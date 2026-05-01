import { describe, it, expect } from 'vitest'
import { evaluateFlag, isChoiceAvailable, applyEffect, applyEffects, enterNode, getAvailableChoices } from '@/engine/narrative'
import type { GameState, Choice, NarrativeNode, Item, NodeEffect } from '@/types'

const pocao: Item = {
  id: 'pocao_cura', name: 'Poção de Cura', description: '',
  type: 'consumable', effect: { kind: 'heal', amount: 12 },
  stackable: true, goldValue: 25, usableInCombat: true, usableOutOfCombat: true,
}

const itemReg = (id: string) => id === 'pocao_cura' ? pocao : undefined

const base: GameState = {
  classId: 'mago',
  stats: { habilidade: 7, energia: 10, sorte: 8 },
  maxStats: { habilidade: 7, energia: 14, sorte: 11 },
  inventory: [], keyItems: [], equippedItems: [], gold: 30, reputation: 2,
  currentNodeId: 'node_a', visitedNodes: [], flags: { nivel: 3, ativo: true },
  defeatedEnemies: [], unlockedAchievements: [], activeEffects: [], startedAt: 0, combat: null,
}

describe('evaluateFlag', () => {
  it('evaluates equals', () => {
    expect(evaluateFlag(base.flags, { key: 'nivel', equals: 3 })).toBe(true)
    expect(evaluateFlag(base.flags, { key: 'nivel', equals: 5 })).toBe(false)
  })
  it('evaluates gt/lt', () => {
    expect(evaluateFlag(base.flags, { key: 'nivel', gt: 2 })).toBe(true)
    expect(evaluateFlag(base.flags, { key: 'nivel', lt: 2 })).toBe(false)
  })
  it('evaluates gte/lte', () => {
    expect(evaluateFlag(base.flags, { key: 'nivel', gte: 3 })).toBe(true)
    expect(evaluateFlag(base.flags, { key: 'nivel', lte: 3 })).toBe(true)
    expect(evaluateFlag(base.flags, { key: 'nivel', lte: 2 })).toBe(false)
  })
  it('evaluates exists', () => {
    expect(evaluateFlag(base.flags, { key: 'ativo', exists: true })).toBe(true)
    expect(evaluateFlag(base.flags, { key: 'naoExiste', exists: true })).toBe(false)
  })
  it('treats missing key as 0 for numeric', () => {
    expect(evaluateFlag(base.flags, { key: 'missing', gt: -1 })).toBe(true)
    expect(evaluateFlag(base.flags, { key: 'missing', gt: 0 })).toBe(false)
  })
})

describe('isChoiceAvailable', () => {
  const openChoice: Choice = { id: 'c1', label: 'Ir' }
  const magoOnly: Choice = { id: 'c2', label: 'Magia', classRequirement: 'mago' }
  const ladinoOnly: Choice = { id: 'c3', label: 'Furtivo', classRequirement: 'ladino' }
  const flagged: Choice = { id: 'c4', label: 'Flag', flagRequirement: { key: 'ativo', equals: true } }
  const repChoice: Choice = { id: 'c5', label: 'Rep', reputationRequirement: { min: 0 } }
  const itemChoice: Choice = { id: 'c6', label: 'Item', itemRequirement: 'pocao_cura' }

  it('open choice is always available', () => {
    expect(isChoiceAvailable(openChoice, base)).toBe(true)
  })
  it('class restriction works', () => {
    expect(isChoiceAvailable(magoOnly, base)).toBe(true)
    expect(isChoiceAvailable(ladinoOnly, base)).toBe(false)
  })
  it('flag requirement works', () => {
    expect(isChoiceAvailable(flagged, base)).toBe(true)
    const s2 = { ...base, flags: { ...base.flags, ativo: false } }
    expect(isChoiceAvailable(flagged, s2)).toBe(false)
  })
  it('reputation requirement works', () => {
    expect(isChoiceAvailable(repChoice, base)).toBe(true)
    const s2 = { ...base, reputation: -1 }
    expect(isChoiceAvailable(repChoice, s2)).toBe(false)
  })
  it('item requirement works', () => {
    expect(isChoiceAvailable(itemChoice, base)).toBe(false)
    const s2 = { ...base, inventory: [{ itemId: 'pocao_cura', quantity: 1 }] }
    expect(isChoiceAvailable(itemChoice, s2)).toBe(true)
  })
})

describe('applyEffect', () => {
  it('gold positive', () => {
    const s = applyEffect(base, { kind: 'gold', amount: 10 }, itemReg)
    expect(s.gold).toBe(40)
  })
  it('gold negative does not go below 0', () => {
    const s = applyEffect(base, { kind: 'gold', amount: -100 }, itemReg)
    expect(s.gold).toBe(0)
  })
  it('energy heal', () => {
    const s = applyEffect(base, { kind: 'energy', amount: 3 }, itemReg)
    expect(s.stats.energia).toBe(13)
  })
  it('energy does not exceed max', () => {
    const s = applyEffect(base, { kind: 'energy', amount: 100 }, itemReg)
    expect(s.stats.energia).toBe(14)
  })
  it('sorte change', () => {
    const s = applyEffect(base, { kind: 'sorte', amount: 2 }, itemReg)
    expect(s.stats.sorte).toBe(10)
  })
  it('reputation change', () => {
    const s = applyEffect(base, { kind: 'reputation', amount: 1 }, itemReg)
    expect(s.reputation).toBe(3)
  })
  it('setFlag', () => {
    const s = applyEffect(base, { kind: 'setFlag', key: 'testKey', value: 'hello' }, itemReg)
    expect(s.flags['testKey']).toBe('hello')
  })
  it('incrementFlag', () => {
    const s = applyEffect(base, { kind: 'incrementFlag', key: 'nivel', by: 2 }, itemReg)
    expect(s.flags['nivel']).toBe(5)
  })
  it('addKeyItem', () => {
    const s = applyEffect(base, { kind: 'addKeyItem', keyItemId: 'mapa_egide' }, itemReg)
    expect(s.keyItems).toContain('mapa_egide')
  })
  it('addItem', () => {
    const s = applyEffect(base, { kind: 'addItem', itemId: 'pocao_cura', quantity: 2 }, itemReg)
    expect(s.inventory).toHaveLength(1)
    expect(s.inventory[0]!.quantity).toBe(2)
  })
  it('unlockAchievement', () => {
    const s = applyEffect(base, { kind: 'unlockAchievement', achievementId: 'first_blood' }, itemReg)
    expect(s.unlockedAchievements).toContain('first_blood')
  })
})

describe('enterNode', () => {
  const node: NarrativeNode = {
    id: 'node_b', locationId: 'pedragar', text: 'Texto',
    choices: [],
    onEnter: [{ kind: 'gold', amount: 5 }],
  }

  it('applies onEnter effects', () => {
    const s = enterNode(base, node, itemReg)
    expect(s.gold).toBe(35)
  })

  it('sets currentNodeId', () => {
    const s = enterNode(base, node, itemReg)
    expect(s.currentNodeId).toBe('node_b')
  })

  it('adds to visitedNodes', () => {
    const s = enterNode(base, node, itemReg)
    expect(s.visitedNodes).toContain('node_b')
  })

  it('does not duplicate visitedNodes', () => {
    const s1 = enterNode(base, node, itemReg)
    const s2 = enterNode(s1, node, itemReg)
    expect(s2.visitedNodes.filter(n => n === 'node_b')).toHaveLength(1)
  })
})

describe('getAvailableChoices', () => {
  const node: NarrativeNode = {
    id: 'test', locationId: 'pedragar', text: '',
    choices: [
      { id: 'c1', label: 'Todos' },
      { id: 'c2', label: 'Só mago', classRequirement: 'mago' },
      { id: 'c3', label: 'Só ladino', classRequirement: 'ladino' },
    ],
  }
  it('returns available choices for mago', () => {
    const choices = getAvailableChoices(node, base)
    expect(choices.map(c => c.id)).toEqual(['c1', 'c2'])
  })
})

describe('applyEffects chain', () => {
  it('applies multiple effects in order', () => {
    const effects: NodeEffect[] = [
      { kind: 'gold', amount: 10 },
      { kind: 'reputation', amount: 1 },
      { kind: 'setFlag', key: 'chegou', value: true },
    ]
    const s = applyEffects(base, effects, itemReg)
    expect(s.gold).toBe(40)
    expect(s.reputation).toBe(3)
    expect(s.flags['chegou']).toBe(true)
  })
})
