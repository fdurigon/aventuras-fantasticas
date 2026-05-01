import type {
  GameState,
  NarrativeNode,
  Choice,
  NodeEffect,
  FlagCondition,
  ClassId,
  Item,
  ItemId,
  KeyItemId,
} from '@/types'
import { addItem, removeItem, addKeyItem, removeKeyItem, applyEquipment } from './inventory'
import { changeReputation } from './reputation'
import { applyRespiro } from './luck'

// ── Flag evaluation ──────────────────────────────────────────

export function evaluateFlag(flags: Record<string, boolean | number | string>, cond: FlagCondition): boolean {
  const val = flags[cond.key]

  if (cond.exists !== undefined) {
    return cond.exists ? val !== undefined : val === undefined
  }
  if (cond.equals !== undefined) {
    return val === cond.equals
  }
  const num = Number(val ?? 0)
  if (cond.gt !== undefined && !(num > cond.gt)) return false
  if (cond.lt !== undefined && !(num < cond.lt)) return false
  if (cond.gte !== undefined && !(num >= cond.gte)) return false
  if (cond.lte !== undefined && !(num <= cond.lte)) return false
  return true
}

// ── Choice availability ──────────────────────────────────────

export function isChoiceAvailable(choice: Choice, state: GameState): boolean {
  if (choice.classRequirement) {
    const req = Array.isArray(choice.classRequirement)
      ? choice.classRequirement
      : [choice.classRequirement]
    if (!req.includes(state.classId as ClassId)) return false
  }

  if (choice.flagRequirement) {
    const conds = Array.isArray(choice.flagRequirement)
      ? choice.flagRequirement
      : [choice.flagRequirement]
    if (!conds.every(c => evaluateFlag(state.flags, c))) return false
  }

  if (choice.itemRequirement) {
    const req = choice.itemRequirement
    if (!state.inventory.some(e => e.itemId === req) && !state.keyItems.includes(req as KeyItemId)) {
      return false
    }
  }

  if (choice.reputationRequirement) {
    const { min, max } = choice.reputationRequirement
    if (min !== undefined && state.reputation < min) return false
    if (max !== undefined && state.reputation > max) return false
  }

  return true
}

export function getAvailableChoices(node: NarrativeNode, state: GameState): Choice[] {
  return node.choices.filter(c => isChoiceAvailable(c, state))
}

// ── Effect application ───────────────────────────────────────

export function applyEffect(
  state: GameState,
  effect: NodeEffect,
  itemRegistry: (id: ItemId) => Item | undefined,
): GameState {
  switch (effect.kind) {
    case 'addItem': {
      const item = itemRegistry(effect.itemId)
      if (!item) return state
      const qty = effect.quantity ?? 1
      if (item.type === 'equipment') {
        return applyEquipment(state, item)
      }
      return addItem(state, item, qty)
    }
    case 'removeItem':
      return removeItem(state, effect.itemId, effect.quantity ?? 1)
    case 'addKeyItem':
      return addKeyItem(state, effect.keyItemId)
    case 'removeKeyItem':
      return removeKeyItem(state, effect.keyItemId)
    case 'gold':
      return { ...state, gold: Math.max(0, state.gold + effect.amount) }
    case 'energy': {
      const newEnergia = Math.max(0, Math.min(state.maxStats.energia, state.stats.energia + effect.amount))
      return { ...state, stats: { ...state.stats, energia: newEnergia } }
    }
    case 'sorte': {
      const newSorte = Math.max(0, Math.min(state.maxStats.sorte, state.stats.sorte + effect.amount))
      return { ...state, stats: { ...state.stats, sorte: newSorte } }
    }
    case 'reputation':
      return changeReputation(state, effect.amount)
    case 'setFlag':
      return { ...state, flags: { ...state.flags, [effect.key]: effect.value } }
    case 'incrementFlag': {
      const current = Number(state.flags[effect.key] ?? 0)
      return { ...state, flags: { ...state.flags, [effect.key]: current + (effect.by ?? 1) } }
    }
    case 'unlockAchievement': {
      if (state.unlockedAchievements.includes(effect.achievementId)) return state
      return { ...state, unlockedAchievements: [...state.unlockedAchievements, effect.achievementId] }
    }
    case 'restoreRespiro':
      return applyRespiro(state)
    case 'addSorteMax':
      return {
        ...state,
        maxStats: { ...state.maxStats, sorte: state.maxStats.sorte + effect.amount },
        stats: { ...state.stats, sorte: Math.min(state.stats.sorte + effect.amount, state.maxStats.sorte + effect.amount) },
      }
  }
}

export function applyEffects(
  state: GameState,
  effects: NodeEffect[],
  itemRegistry: (id: ItemId) => Item | undefined,
): GameState {
  return effects.reduce((s, e) => applyEffect(s, e, itemRegistry), state)
}

// ── Node transition ──────────────────────────────────────────

export function enterNode(
  state: GameState,
  node: NarrativeNode,
  itemRegistry: (id: ItemId) => Item | undefined,
): GameState {
  let newState = state
  if (node.onEnter) {
    newState = applyEffects(newState, node.onEnter, itemRegistry)
  }
  if (!newState.visitedNodes.includes(node.id)) {
    newState = { ...newState, visitedNodes: [...newState.visitedNodes, node.id] }
  }
  return { ...newState, currentNodeId: node.id }
}
