import type { GameState, Random } from '@/types'
import { roll2d6 } from '@/utils/dice'

export type LuckContext = 'damage_received' | 'damage_dealt' | 'skill_check' | 'narrative'

export interface LuckResult {
  roll: number
  sorteUsed: number
  success: boolean
  damageModifier: number
  newSorte: number
}

export function tryLuck(state: GameState, context: LuckContext, rng: Random): LuckResult {
  const roll = roll2d6(rng)
  const success = roll <= state.stats.sorte
  const newSorte = Math.max(0, state.stats.sorte - 1)

  let damageModifier = 0
  if (context === 'damage_received') {
    damageModifier = success ? -2 : +1
  } else if (context === 'damage_dealt') {
    damageModifier = success ? +2 : -1
  }

  return {
    roll,
    sorteUsed: 1,
    success,
    damageModifier,
    newSorte,
  }
}

export function canUseLuck(state: GameState): boolean {
  return state.stats.sorte > 0
}

export function applyRespiro(state: GameState): GameState {
  const missingEnergia = state.maxStats.energia - state.stats.energia
  const healAmount = Math.ceil(missingEnergia / 2)

  return {
    ...state,
    stats: {
      ...state.stats,
      sorte: state.maxStats.sorte,
      energia: Math.min(state.maxStats.energia, state.stats.energia + healAmount),
    },
    activeEffects: state.activeEffects.filter(e => !e.kind.includes('penalty')),
  }
}
