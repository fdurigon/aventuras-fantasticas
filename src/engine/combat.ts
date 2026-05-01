import type {
  CombatState,
  CombatEncounter,
  GameState,
  Power,
  Enemy,
  ActiveEffect,
  CombatLogEntry,
  Random,
  PowerId,
} from '@/types'
import { roll, roll2d6WithDetail } from '@/utils/dice'
import { tryLuck } from './luck'

// ── Bootstrap ────────────────────────────────────────────────

export function initCombat(state: GameState, encounter: CombatEncounter, enemy: Enemy): CombatState {
  const mods = encounter.modifiers ?? {}
  return {
    player: {
      habilidade: state.stats.habilidade,
      energia: state.stats.energia,
      maxEnergia: state.maxStats.energia,
      sorte: state.stats.sorte,
      maxSorte: state.maxStats.sorte,
      activeEffects: [...state.activeEffects],
      usedOnceFlags: [],
    },
    enemy: {
      id: enemy.id,
      currentEnergia: enemy.energia + (mods.enemyEnergyBonus ?? 0),
      activeEffects: [],
    },
    round: 1,
    log: [{ round: 0, actor: 'system', message: `Combate iniciado contra ${enemy.name}!` }],
    fleeAvailable: encounter.fleeAvailable ?? enemy.fleeable,
    outcome: 'ongoing',
    pendingLuckPrompt: false,
    lastDamageToPlayer: 0,
    lastDamageToEnemy: 0,
  }
}

// ── Effect helpers ────────────────────────────────────────────

function sumEffectsByKind(effects: ActiveEffect[], kind: ActiveEffect['kind']): number {
  return effects
    .filter(e => e.kind === kind)
    .reduce((a, e) => a + e.value, 0)
}

function tickEffects(effects: ActiveEffect[]): ActiveEffect[] {
  return effects
    .map(e => ({ ...e, remainingRounds: e.remainingRounds - 1 }))
    .filter(e => e.remainingRounds > 0)
}

function addLog(log: CombatLogEntry[], round: number, actor: CombatLogEntry['actor'], message: string): CombatLogEntry[] {
  return [...log, { round, actor, message }]
}

// ── Combat actions ────────────────────────────────────────────

export type CombatAction =
  | { type: 'power'; powerId: PowerId }
  | { type: 'item'; itemId: string }
  | { type: 'flee' }
  | { type: 'luck' }

export interface RoundResult {
  newState: CombatState
}

export function resolveRound(
  combatState: CombatState,
  action: CombatAction,
  power: Power | null,
  enemy: Enemy,
  rng: Random,
): RoundResult {
  if (combatState.outcome !== 'ongoing') return { newState: combatState }

  let cs = { ...combatState }
  let log = cs.log

  if (action.type === 'flee') {
    return resolveFlee(cs, enemy, rng)
  }

  if (action.type === 'power' && power) {
    const result = resolvePowerAction(cs, power, enemy, rng)
    cs = result.cs
    log = result.log
  }

  // Check outcomes after player action
  cs = checkOutcome(cs, enemy)
  if (cs.outcome !== 'ongoing') return { newState: { ...cs, log } }

  // Tick effects after resolution
  cs = {
    ...cs,
    log,
    player: { ...cs.player, activeEffects: tickEffects(cs.player.activeEffects) },
    enemy: { ...cs.enemy, activeEffects: tickEffects(cs.enemy.activeEffects) },
    round: cs.round + 1,
  }

  return { newState: cs }
}

function resolvePowerAction(
  cs: CombatState,
  power: Power,
  enemy: Enemy,
  rng: Random,
): { cs: CombatState; log: CombatLogEntry[] } {
  let log = cs.log
  const round = cs.round

  if (power.role === 'utility') {
    log = addLog(log, round, 'player', `${power.name}: ${power.flavorText}`)

    // Apply utility effect
    const newEffects = [...cs.player.activeEffects]
    if (power.effect) {
      const duration = power.effect.duration ?? 1
      if (power.effect.type === 'shield') {
        newEffects.push({ kind: 'shield', value: power.effect.value ?? 4, remainingRounds: duration })
        // Enemy attacks but hits shield
        const { total: enemyFA, d1, d2 } = roll2d6WithDetail(rng)
        const enemyAttack = enemy.habilidade + enemyFA
        const defenseFA = cs.player.habilidade + roll2d6WithDetail(rng).total
        log = addLog(log, round, 'enemy', `${enemy.name} ataca: ${enemy.habilidade}+${d1}+${d2}=${enemyAttack} vs defesa ${defenseFA}`)
        if (enemyAttack > defenseFA) {
          const rawDmg = roll(enemy.damage, rng)
          const shieldVal = power.effect.value ?? 4
          const actualDmg = Math.max(0, rawDmg - shieldVal)
          const newEnergia = Math.max(0, cs.player.energia - actualDmg)
          log = addLog(log, round, 'system', `Dano absorvido pelo escudo: ${rawDmg} - ${shieldVal} = ${actualDmg}`)
          const updatedPlayer = { ...cs.player, energia: newEnergia, activeEffects: newEffects }
          return {
            cs: { ...cs, player: updatedPlayer, log, lastDamageToPlayer: actualDmg, pendingLuckPrompt: actualDmg > 0 },
            log,
          }
        } else {
          log = addLog(log, round, 'system', 'Ataque desviado!')
          const updatedPlayer = { ...cs.player, activeEffects: newEffects }
          return { cs: { ...cs, player: updatedPlayer, log, lastDamageToPlayer: 0, pendingLuckPrompt: false }, log }
        }
      } else if (power.effect.type === 'evade') {
        // Truque de Fumaça — next enemy attack automatically misses
        newEffects.push({ kind: 'evade_next', value: 1, remainingRounds: 1 })
        log = addLog(log, round, 'system', 'Próximo ataque inimigo automaticamente erra!')
        const updatedPlayer = { ...cs.player, activeEffects: newEffects }
        return { cs: { ...cs, player: updatedPlayer, log, lastDamageToPlayer: 0, pendingLuckPrompt: false }, log }
      } else if (power.effect.type === 'rage') {
        // Fúria Ancestral
        const dur = power.effect.duration ?? 3
        newEffects.push({ kind: 'habilidade_bonus', value: 1, remainingRounds: dur })
        newEffects.push({ kind: 'shield', value: 1, remainingRounds: dur })
        log = addLog(log, round, 'system', `Fúria Ancestral: +1 Habilidade e -1 dano recebido por ${dur} rounds`)
        // mark used-once
        const usedOnceFlags = power.usesPerCombat === 1
          ? [...cs.player.usedOnceFlags, power.id]
          : cs.player.usedOnceFlags
        const updatedPlayer = { ...cs.player, activeEffects: newEffects, usedOnceFlags }
        return { cs: { ...cs, player: updatedPlayer, log, lastDamageToPlayer: 0, pendingLuckPrompt: false }, log }
      }
    }
    const updatedPlayer = { ...cs.player, activeEffects: newEffects }
    return { cs: { ...cs, player: updatedPlayer, log, lastDamageToPlayer: 0, pendingLuckPrompt: false }, log }
  }

  // Damage power
  const playerBonus = sumEffectsByKind(cs.player.activeEffects, 'habilidade_bonus')
  const playerPenalty = sumEffectsByKind(cs.player.activeEffects, 'habilidade_penalty')
  const effectiveHab = cs.player.habilidade + playerBonus - playerPenalty

  const { total: playerRoll, d1: pd1, d2: pd2 } = roll2d6WithDetail(rng)
  const { total: enemyRoll, d1: ed1, d2: ed2 } = roll2d6WithDetail(rng)

  const playerFA = effectiveHab + playerRoll + power.attackModifier
  const enemyFA = enemy.habilidade + enemyRoll

  log = addLog(log, round, 'player', `${power.name} — Ataque: ${effectiveHab}+${pd1}+${pd2}+${power.attackModifier}=${playerFA}`)
  log = addLog(log, round, 'enemy', `${enemy.name} defende: ${enemy.habilidade}+${ed1}+${ed2}=${enemyFA}`)

  let newCs = cs

  if (playerFA > enemyFA) {
    // Player hits
    const baseDmg = power.damage ? roll(power.damage, rng) : 2
    const dmgBonus = sumEffectsByKind(cs.player.activeEffects, 'damage_bonus')
    const totalDmg = baseDmg + dmgBonus
    const newEnemyEnergia = Math.max(0, cs.enemy.currentEnergia - totalDmg)
    log = addLog(log, round, 'player', `Acertou! ${totalDmg} de dano. Energia inimigo: ${cs.enemy.currentEnergia} → ${newEnemyEnergia}`)
    newCs = { ...cs, enemy: { ...cs.enemy, currentEnergia: newEnemyEnergia }, lastDamageToEnemy: totalDmg, lastDamageToPlayer: 0, pendingLuckPrompt: false }

    // Check used-once
    if (power.usesPerCombat === 1) {
      newCs = { ...newCs, player: { ...newCs.player, usedOnceFlags: [...newCs.player.usedOnceFlags, power.id] } }
    }
  } else if (enemyFA > playerFA) {
    // Enemy hits
    const rawDmg = roll(enemy.damage, rng)
    const shieldReduction = sumEffectsByKind(cs.player.activeEffects, 'shield')
    const evadeNext = cs.player.activeEffects.some(e => e.kind === 'evade_next')

    let actualDmg = 0
    if (evadeNext) {
      log = addLog(log, round, 'system', 'Ataque desviado pelo truque de fumaça!')
      const newEffects = cs.player.activeEffects.filter(e => e.kind !== 'evade_next')
      newCs = { ...cs, player: { ...cs.player, activeEffects: newEffects }, lastDamageToPlayer: 0, pendingLuckPrompt: false }
    } else {
      actualDmg = Math.max(0, rawDmg - shieldReduction)
      const newEnergia = Math.max(0, cs.player.energia - actualDmg)
      log = addLog(log, round, 'enemy', `${enemy.name} acertou! ${rawDmg}${shieldReduction > 0 ? `-${shieldReduction}(escudo)` : ''}=${actualDmg} de dano.`)
      newCs = { ...cs, player: { ...cs.player, energia: newEnergia }, lastDamageToPlayer: actualDmg, pendingLuckPrompt: actualDmg > 0 }
    }
  } else {
    log = addLog(log, round, 'system', 'As armas se cruzam e se separam sem sangue.')
    newCs = { ...cs, lastDamageToPlayer: 0, lastDamageToEnemy: 0, pendingLuckPrompt: false }
  }

  // Apply self-penalty
  if (power.selfPenalty) {
    const penalty = power.selfPenalty
    const newEffects = [...newCs.player.activeEffects, {
      kind: 'habilidade_penalty' as const,
      value: penalty.amount,
      remainingRounds: penalty.duration,
      source: power.id,
    }]
    newCs = { ...newCs, player: { ...newCs.player, activeEffects: newEffects } }
  }

  return { cs: newCs, log }
}

function resolveFlee(cs: CombatState, enemy: Enemy, rng: Random): RoundResult {
  const { total: playerRoll } = roll2d6WithDetail(rng)
  const playerTotal = cs.player.habilidade + playerRoll
  const threshold = enemy.habilidade + 8

  if (playerTotal >= threshold) {
    const newLog = addLog(cs.log, cs.round, 'system', `Fuga bem-sucedida! (${playerTotal} vs ${threshold})`)
    return { newState: { ...cs, outcome: 'fled', log: newLog } }
  } else {
    // Flee failed — player takes 2 damage
    const newEnergia = Math.max(0, cs.player.energia - 2)
    let newLog = addLog(cs.log, cs.round, 'system', `Fuga falhou! (${playerTotal} vs ${threshold}) -2 Energia`)
    newLog = addLog(newLog, cs.round, 'enemy', `${enemy.name} ataca enquanto você tenta fugir!`)
    const newCs = {
      ...cs,
      player: { ...cs.player, energia: newEnergia },
      log: newLog,
      lastDamageToPlayer: 2,
      pendingLuckPrompt: true,
      round: cs.round + 1,
    }
    return { newState: checkOutcome(newCs, enemy) }
  }
}

export function applyLuckToLastDamage(
  cs: CombatState,
  context: 'damage_received' | 'damage_dealt',
  gameState: GameState,
  rng: Random,
): CombatState {
  const luckResult = tryLuck(gameState, context, rng)
  const modifier = luckResult.damageModifier

  let newCs = {
    ...cs,
    player: { ...cs.player, sorte: luckResult.newSorte },
    pendingLuckPrompt: false,
  }

  const log = addLog(
    cs.log,
    cs.round,
    'system',
    `Sorte testada: rolou ${luckResult.roll} vs Sorte ${gameState.stats.sorte} — ${luckResult.success ? 'SUCESSO' : 'FALHA'} (dano ${modifier >= 0 ? '+' : ''}${modifier})`,
  )
  newCs = { ...newCs, log }

  if (context === 'damage_received') {
    const newEnergia = Math.max(0, cs.player.energia + modifier)
    newCs = { ...newCs, player: { ...newCs.player, energia: newEnergia } }
  }

  return checkOutcome(newCs, null)
}

function checkOutcome(cs: CombatState, _enemy: Enemy | null): CombatState {
  if (cs.player.energia <= 0) {
    return { ...cs, outcome: 'defeat' }
  }
  if (cs.enemy.currentEnergia <= 0) {
    const log = addLog(cs.log, cs.round, 'system', '¡Vitória!')
    return { ...cs, outcome: 'victory', log }
  }
  return cs
}

export function syncCombatToGameState(gameState: GameState, cs: CombatState): GameState {
  return {
    ...gameState,
    stats: {
      ...gameState.stats,
      energia: cs.player.energia,
      sorte: cs.player.sorte,
    },
    activeEffects: cs.player.activeEffects,
    combat: cs,
  }
}
