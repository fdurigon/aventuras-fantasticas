import type { GameState, Item, ItemId, KeyItemId, InventoryEntry } from '@/types'

const MAX_SLOTS = 6
const MAX_STACK = 9

export function addItem(state: GameState, item: Item, quantity = 1): GameState {
  const existing = state.inventory.find(e => e.itemId === item.id)

  if (existing && item.stackable) {
    const newQty = Math.min(MAX_STACK, existing.quantity + quantity)
    return {
      ...state,
      inventory: state.inventory.map(e =>
        e.itemId === item.id ? { ...e, quantity: newQty } : e,
      ),
    }
  }

  if (state.inventory.length >= MAX_SLOTS) {
    // Caller must handle inventory-full scenario
    return state
  }

  return {
    ...state,
    inventory: [...state.inventory, { itemId: item.id, quantity }],
  }
}

export function removeItem(state: GameState, itemId: ItemId, quantity = 1): GameState {
  const entry = state.inventory.find(e => e.itemId === itemId)
  if (!entry) return state

  if (entry.quantity <= quantity) {
    return { ...state, inventory: state.inventory.filter(e => e.itemId !== itemId) }
  }

  return {
    ...state,
    inventory: state.inventory.map(e =>
      e.itemId === itemId ? { ...e, quantity: e.quantity - quantity } : e,
    ),
  }
}

export function hasItem(state: GameState, itemId: ItemId): boolean {
  return state.inventory.some(e => e.itemId === itemId)
}

export function itemCount(state: GameState, itemId: ItemId): number {
  return state.inventory.find(e => e.itemId === itemId)?.quantity ?? 0
}

export function isInventoryFull(state: GameState): boolean {
  return state.inventory.length >= MAX_SLOTS
}

export function addKeyItem(state: GameState, keyItemId: KeyItemId): GameState {
  if (state.keyItems.includes(keyItemId)) return state
  return { ...state, keyItems: [...state.keyItems, keyItemId] }
}

export function removeKeyItem(state: GameState, keyItemId: KeyItemId): GameState {
  return { ...state, keyItems: state.keyItems.filter(k => k !== keyItemId) }
}

export function hasKeyItem(state: GameState, keyItemId: KeyItemId): boolean {
  return state.keyItems.includes(keyItemId)
}

export function applyEquipment(state: GameState, item: Item): GameState {
  if (item.type !== 'equipment') return state
  if (state.equippedItems.includes(item.id)) return state

  let newState: GameState = {
    ...state,
    equippedItems: [...state.equippedItems, item.id],
  }

  const bonus = item.equipmentBonus ?? {}
  if (bonus.habilidade) {
    newState = {
      ...newState,
      stats: { ...newState.stats, habilidade: newState.stats.habilidade + bonus.habilidade },
      maxStats: { ...newState.maxStats, habilidade: newState.maxStats.habilidade + bonus.habilidade },
    }
  }
  if (bonus.sorteMax) {
    newState = {
      ...newState,
      maxStats: { ...newState.maxStats, sorte: newState.maxStats.sorte + bonus.sorteMax },
    }
  }

  return newState
}

export function getInventorySlotCount(state: GameState): number {
  return state.inventory.length
}

export function replaceItem(
  state: GameState,
  slotItemId: ItemId,
  newEntry: InventoryEntry,
): GameState {
  return {
    ...state,
    inventory: state.inventory.map(e =>
      e.itemId === slotItemId ? newEntry : e,
    ),
  }
}
