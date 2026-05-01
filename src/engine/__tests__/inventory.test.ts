import { describe, it, expect } from 'vitest'
import {
  addItem, removeItem, hasItem, itemCount,
  isInventoryFull, addKeyItem, removeKeyItem, hasKeyItem, applyEquipment,
} from '@/engine/inventory'
import type { GameState, Item } from '@/types'

const pocao: Item = {
  id: 'pocao_cura_menor', name: 'Poção de Cura Menor', description: '',
  type: 'consumable', effect: { kind: 'heal', amount: 6 },
  stackable: true, goldValue: 12, usableInCombat: true, usableOutOfCombat: true,
}

const espada: Item = {
  id: 'manopla_sombria', name: 'Manopla Sombria', description: '',
  type: 'equipment', effect: { kind: 'special', tag: 'equip' },
  stackable: false, goldValue: 0, usableInCombat: false, usableOutOfCombat: false,
  equipmentBonus: { habilidade: 1 },
}

const base: GameState = {
  classId: 'mago',
  stats: { habilidade: 7, energia: 14, sorte: 11 },
  maxStats: { habilidade: 7, energia: 14, sorte: 11 },
  inventory: [], keyItems: [], equippedItems: [], gold: 30, reputation: 0,
  currentNodeId: 'test', visitedNodes: [], flags: {},
  defeatedEnemies: [], unlockedAchievements: [], activeEffects: [], startedAt: 0, combat: null,
}

describe('addItem', () => {
  it('adds a new item to empty inventory', () => {
    const s = addItem(base, pocao, 1)
    expect(s.inventory).toHaveLength(1)
    expect(s.inventory[0]).toEqual({ itemId: 'pocao_cura_menor', quantity: 1 })
  })

  it('stacks stackable items', () => {
    const s1 = addItem(base, pocao, 2)
    const s2 = addItem(s1, pocao, 3)
    expect(s2.inventory).toHaveLength(1)
    expect(s2.inventory[0]!.quantity).toBe(5)
  })

  it('does not exceed stack size 9', () => {
    const s1 = addItem(base, pocao, 8)
    const s2 = addItem(s1, pocao, 5)
    expect(s2.inventory[0]!.quantity).toBe(9)
  })

  it('does not add beyond 6 slots', () => {
    let s = base
    const items = ['a','b','c','d','e','f','g'].map(id => ({ ...pocao, id, stackable: false }))
    items.forEach(item => { s = addItem(s, item) })
    expect(s.inventory).toHaveLength(6)
  })
})

describe('removeItem', () => {
  it('decrements quantity', () => {
    const s1 = addItem(base, pocao, 3)
    const s2 = removeItem(s1, 'pocao_cura_menor', 1)
    expect(s2.inventory[0]!.quantity).toBe(2)
  })

  it('removes entry when quantity reaches 0', () => {
    const s1 = addItem(base, pocao, 1)
    const s2 = removeItem(s1, 'pocao_cura_menor', 1)
    expect(s2.inventory).toHaveLength(0)
  })

  it('is idempotent for missing item', () => {
    const s = removeItem(base, 'nonexistent', 1)
    expect(s.inventory).toHaveLength(0)
  })
})

describe('hasItem / itemCount', () => {
  it('returns true when item exists', () => {
    const s = addItem(base, pocao)
    expect(hasItem(s, 'pocao_cura_menor')).toBe(true)
    expect(itemCount(s, 'pocao_cura_menor')).toBe(1)
  })

  it('returns false when item missing', () => {
    expect(hasItem(base, 'pocao_cura_menor')).toBe(false)
    expect(itemCount(base, 'pocao_cura_menor')).toBe(0)
  })
})

describe('isInventoryFull', () => {
  it('returns false for empty inventory', () => {
    expect(isInventoryFull(base)).toBe(false)
  })

  it('returns true when 6 slots used', () => {
    let s = base
    for (let i = 0; i < 6; i++) {
      s = addItem(s, { ...pocao, id: `item_${i}`, stackable: false })
    }
    expect(isInventoryFull(s)).toBe(true)
  })
})

describe('key items', () => {
  it('adds and detects key item', () => {
    const s = addKeyItem(base, 'mapa_egide')
    expect(hasKeyItem(s, 'mapa_egide')).toBe(true)
  })

  it('remove key item', () => {
    const s1 = addKeyItem(base, 'mapa_egide')
    const s2 = removeKeyItem(s1, 'mapa_egide')
    expect(hasKeyItem(s2, 'mapa_egide')).toBe(false)
  })

  it('does not duplicate', () => {
    const s1 = addKeyItem(base, 'mapa_egide')
    const s2 = addKeyItem(s1, 'mapa_egide')
    expect(s2.keyItems).toHaveLength(1)
  })
})

describe('applyEquipment', () => {
  it('adds habilidade bonus', () => {
    const s = applyEquipment(base, espada)
    expect(s.stats.habilidade).toBe(8)
    expect(s.maxStats.habilidade).toBe(8)
  })

  it('does not apply twice', () => {
    const s1 = applyEquipment(base, espada)
    const s2 = applyEquipment(s1, espada)
    expect(s2.stats.habilidade).toBe(8)
  })

  it('adds item to equippedItems', () => {
    const s = applyEquipment(base, espada)
    expect(s.equippedItems).toContain('manopla_sombria')
  })
})
