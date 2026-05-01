import { create } from 'zustand'
import type {
  GameState,
  ClassId,
  NodeId,
  NodeEffect,
  CombatEncounter,
  MetaSave,
} from '@/types'
import type { CombatAction } from '@/engine/combat'
import { getCharacter } from '@/content/characters'
import { getItem } from '@/content/items'
import { getEnemy } from '@/content/enemies'
import { getPower } from '@/content/powers'
import { getNode } from '@/content/nodes'
import { enterNode, applyEffects } from '@/engine/narrative'
import { initCombat, resolveRound, applyLuckToLastDamage, syncCombatToGameState } from '@/engine/combat'
import { saveGame, loadGame, deleteSave, loadMeta, saveMeta, mergeMeta } from '@/engine/save'
import { mathRandom } from '@/engine/random'

// ── Game state factory ────────────────────────────────────────

function createInitialState(classId: ClassId): GameState {
  const char = getCharacter(classId)
  if (!char) throw new Error(`Unknown class: ${classId}`)

  const state: GameState = {
    classId,
    stats: { ...char.baseStats },
    maxStats: { ...char.baseStats },
    inventory: [],
    keyItems: [...char.startingKeyItems],
    equippedItems: [],
    gold: char.startingGold,
    reputation: 0,
    currentNodeId: 'a1_pedragar_01',
    visitedNodes: [],
    flags: {},
    defeatedEnemies: [],
    unlockedAchievements: [],
    activeEffects: [],
    startedAt: Date.now(),
    combat: null,
  }

  // Add starting items
  let s = state
  for (const itemId of char.startingItems) {
    const item = getItem(itemId)
    if (item) {
      const existing = s.inventory.find(e => e.itemId === itemId)
      if (existing && item.stackable) {
        s = { ...s, inventory: s.inventory.map(e => e.itemId === itemId ? { ...e, quantity: e.quantity + 1 } : e) }
      } else {
        s = { ...s, inventory: [...s.inventory, { itemId, quantity: 1 }] }
      }
    }
  }

  return s
}

// ── Store interface ───────────────────────────────────────────

interface GameStore {
  // State
  gameState: GameState | null
  meta: MetaSave
  phase: 'title' | 'charselect' | 'game' | 'gameover' | 'gallery'

  // Actions
  startNewGame: (classId: ClassId) => void
  continueGame: () => void
  goToTitle: () => void
  goToGallery: () => void
  goToCharSelect: () => void

  // Narrative
  navigateToNode: (nodeId: NodeId, effects?: NodeEffect[]) => void
  applyNodeEffects: (effects: NodeEffect[]) => void

  // Combat
  startCombat: (encounter: CombatEncounter) => void
  performCombatAction: (action: CombatAction) => void
  useLuckInCombat: () => void
  endCombat: (outcome: 'victory' | 'defeat' | 'fled') => void

  // Save
  saveNow: () => void
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  meta: loadMeta(),
  phase: loadGame() ? 'title' : 'title',

  startNewGame: (classId) => {
    const state = createInitialState(classId)
    const node = getNode('a1_pedragar_01')
    const entered = node ? enterNode(state, node, getItem) : state
    saveGame(entered)
    set({ gameState: entered, phase: 'game' })
  },

  continueGame: () => {
    const saved = loadGame()
    if (saved) {
      set({ gameState: saved, phase: 'game' })
    }
  },

  goToTitle: () => set({ phase: 'title' }),
  goToGallery: () => set({ phase: 'gallery' }),
  goToCharSelect: () => set({ phase: 'charselect' }),

  navigateToNode: (nodeId, effects) => {
    const { gameState } = get()
    if (!gameState) return

    let s = gameState
    if (effects?.length) {
      s = applyEffects(s, effects, getItem)
    }

    const node = getNode(nodeId)
    if (!node) {
      console.warn(`Node not found: ${nodeId}`)
      return
    }

    const entered = enterNode(s, node, getItem)
    saveGame(entered)
    set({ gameState: entered })
  },

  applyNodeEffects: (effects) => {
    const { gameState } = get()
    if (!gameState) return
    const s = applyEffects(gameState, effects, getItem)
    saveGame(s)
    set({ gameState: s })
  },

  startCombat: (encounter) => {
    const { gameState } = get()
    if (!gameState) return

    const enemy = getEnemy(encounter.enemyId)
    if (!enemy) {
      console.warn(`Enemy not found: ${encounter.enemyId}`)
      return
    }

    const cs = initCombat(gameState, encounter, enemy)
    const newState = { ...gameState, combat: cs }
    set({ gameState: newState })
  },

  performCombatAction: (action) => {
    const { gameState } = get()
    if (!gameState?.combat) return

    const cs = gameState.combat
    const encounter = findCurrentEncounter(gameState)
    if (!encounter) return

    const enemy = getEnemy(cs.enemy.id)
    if (!enemy) return

    const power = action.type === 'power' ? getPower(action.powerId) ?? null : null
    const { newState: newCs } = resolveRound(cs, action, power, enemy, mathRandom)

    const updated = syncCombatToGameState(gameState, newCs)
    saveGame(updated)
    set({ gameState: updated })

    if (newCs.outcome === 'victory') {
      get().endCombat('victory')
    } else if (newCs.outcome === 'defeat') {
      get().endCombat('defeat')
    } else if (newCs.outcome === 'fled') {
      get().endCombat('fled')
    }
  },

  useLuckInCombat: () => {
    const { gameState } = get()
    if (!gameState?.combat) return

    const newCs = applyLuckToLastDamage(
      gameState.combat,
      'damage_received',
      gameState,
      mathRandom,
    )
    const updated = syncCombatToGameState(gameState, newCs)
    saveGame(updated)
    set({ gameState: updated })
  },

  endCombat: (outcome) => {
    const { gameState } = get()
    if (!gameState?.combat) return

    if (outcome === 'defeat') {
      // Persist meta then clear save
      const newMeta = mergeMeta(get().meta, gameState)
      saveMeta(newMeta)
      deleteSave()
      set({ gameState: null, meta: newMeta, phase: 'gameover' })
      return
    }

    const encounter = findCurrentEncounter(gameState)
    const nextOutcome = outcome === 'victory' ? encounter?.victoryOutcome : encounter?.fleeOutcome

    let s: GameState = { ...gameState, combat: null }

    if (outcome === 'victory' && encounter) {
      const enemy = getEnemy(gameState.combat.enemy.id)
      if (enemy) {
        // Gold reward
        if (enemy.goldReward > 0) {
          s = { ...s, gold: s.gold + enemy.goldReward }
        }
        // Item drop
        if (enemy.itemDropId) {
          const chance = enemy.dropChance ?? 1
          if (mathRandom.next() <= chance) {
            const item = getItem(enemy.itemDropId)
            if (item) {
              s = { ...s, inventory: [...s.inventory, { itemId: item.id, quantity: 1 }] }
            }
          }
        }
        // Register to bestiary
        if (!s.defeatedEnemies.includes(enemy.id)) {
          s = { ...s, defeatedEnemies: [...s.defeatedEnemies, enemy.id] }
        }
        // Achievement: first_blood
        if (!s.unlockedAchievements.includes('first_blood')) {
          s = { ...s, unlockedAchievements: [...s.unlockedAchievements, 'first_blood'] }
        }
      }

      if (nextOutcome?.effects) {
        s = applyEffects(s, nextOutcome.effects, getItem)
      }
    }

    saveGame(s)
    set({ gameState: s })

    if (nextOutcome?.nextNodeId) {
      get().navigateToNode(nextOutcome.nextNodeId)
    }
  },

  saveNow: () => {
    const { gameState } = get()
    if (gameState) saveGame(gameState)
  },
}))

// ── Helpers ───────────────────────────────────────────────────

function findCurrentEncounter(state: GameState): CombatEncounter | null {
  if (!state.combat) return null
  const node = getNode(state.currentNodeId)
  if (!node) return null

  for (const choice of node.choices) {
    if (choice.combat?.enemyId === state.combat.enemy.id) {
      return choice.combat
    }
  }
  return null
}

// ── Selectors ─────────────────────────────────────────────────

export const selectGameState = (s: GameStore) => s.gameState
export const selectPhase = (s: GameStore) => s.phase
export const selectMeta = (s: GameStore) => s.meta
export const selectCurrentNode = (s: GameStore) =>
  s.gameState ? getNode(s.gameState.currentNodeId) : null
export const selectInCombat = (s: GameStore) => s.gameState?.combat !== null && s.gameState?.combat !== undefined
