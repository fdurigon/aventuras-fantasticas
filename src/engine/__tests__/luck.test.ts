import { describe, it, expect } from 'vitest'
import { tryLuck, canUseLuck, applyRespiro } from '@/engine/luck'
import { seededRandom } from '@/engine/random'
import type { GameState } from '@/types'

const baseState: GameState = {
  classId: 'mago',
  stats: { habilidade: 7, energia: 10, sorte: 8 },
  maxStats: { habilidade: 7, energia: 14, sorte: 11 },
  inventory: [], keyItems: [], equippedItems: [], gold: 30, reputation: 0,
  currentNodeId: 'test', visitedNodes: [], flags: {},
  defeatedEnemies: [], unlockedAchievements: [], activeEffects: [], startedAt: 0, combat: null,
}

describe('tryLuck', () => {
  it('spends exactly 1 sorte', () => {
    const result = tryLuck(baseState, 'damage_received', seededRandom(1))
    expect(result.sorteUsed).toBe(1)
    expect(result.newSorte).toBe(7)
  })

  it('success gives -2 damage modifier on damage_received', () => {
    let foundSuccess = false
    for (let s = 0; s < 50; s++) {
      const r = tryLuck(baseState, 'damage_received', seededRandom(s))
      if (r.success) {
        expect(r.damageModifier).toBe(-2)
        foundSuccess = true
        break
      }
    }
    expect(foundSuccess).toBe(true)
  })

  it('failure gives +1 damage modifier on damage_received', () => {
    let foundFailure = false
    // Use state with very low sorte to force failure
    const lowSorteState = { ...baseState, stats: { ...baseState.stats, sorte: 1 } }
    for (let s = 0; s < 50; s++) {
      const r = tryLuck(lowSorteState, 'damage_received', seededRandom(s))
      if (!r.success) {
        expect(r.damageModifier).toBe(1)
        foundFailure = true
        break
      }
    }
    expect(foundFailure).toBe(true)
  })

  it('success gives +2 damage modifier on damage_dealt', () => {
    let found = false
    for (let s = 0; s < 50; s++) {
      const r = tryLuck(baseState, 'damage_dealt', seededRandom(s))
      if (r.success) { expect(r.damageModifier).toBe(2); found = true; break }
    }
    expect(found).toBe(true)
  })

  it('sorte never goes below 0', () => {
    const zeroState = { ...baseState, stats: { ...baseState.stats, sorte: 0 } }
    const result = tryLuck(zeroState, 'damage_received', seededRandom(1))
    expect(result.newSorte).toBe(0)
  })
})

describe('canUseLuck', () => {
  it('returns true when sorte > 0', () => {
    expect(canUseLuck(baseState)).toBe(true)
  })
  it('returns false when sorte === 0', () => {
    const state = { ...baseState, stats: { ...baseState.stats, sorte: 0 } }
    expect(canUseLuck(state)).toBe(false)
  })
})

describe('applyRespiro', () => {
  it('restores sorte to max', () => {
    const result = applyRespiro(baseState)
    expect(result.stats.sorte).toBe(11)
  })

  it('heals 50% of missing energia (ceil)', () => {
    // energia 10, max 14, missing 4, heal = ceil(4/2) = 2 → new = 12
    const result = applyRespiro(baseState)
    expect(result.stats.energia).toBe(12)
  })

  it('does not overheal energia', () => {
    const full = { ...baseState, stats: { ...baseState.stats, energia: 14 } }
    expect(applyRespiro(full).stats.energia).toBe(14)
  })

  it('removes penalty effects', () => {
    const withPenalty = {
      ...baseState,
      activeEffects: [{ kind: 'habilidade_penalty' as const, value: 1, remainingRounds: 5 }],
    }
    const result = applyRespiro(withPenalty)
    expect(result.activeEffects).toHaveLength(0)
  })
})
