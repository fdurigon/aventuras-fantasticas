import { describe, it, expect, beforeAll } from 'vitest'
import { resolveSkillCheck, registerClassSkillBonuses } from '@/engine/skillCheck'
import { seededRandom } from '@/engine/random'
import type { GameState, SkillCheckDef } from '@/types'

beforeAll(() => {
  registerClassSkillBonuses('mago', { arcano: 2, investigar: 1, persuadir: 1, atletismo: -1, furtividade: -1, intimidar: 0, trapaca: 0, resistirMagia: 1 })
  registerClassSkillBonuses('ladino', { furtividade: 2, trapaca: 2, investigar: 1, intimidar: -1, atletismo: 0, arcano: 0, persuadir: 0, resistirMagia: -1 })
  registerClassSkillBonuses('barbaro', { atletismo: 2, intimidar: 2, resistirMagia: 1, arcano: -2, trapaca: -1, furtividade: -1, persuadir: -1, investigar: 0 })
})

const baseState: GameState = {
  classId: 'mago',
  stats: { habilidade: 7, energia: 14, sorte: 11 },
  maxStats: { habilidade: 7, energia: 14, sorte: 11 },
  inventory: [], keyItems: [], equippedItems: [], gold: 30, reputation: 0,
  currentNodeId: 'test', visitedNodes: [], flags: {},
  defeatedEnemies: [], unlockedAchievements: [], activeEffects: [], startedAt: 0, combat: null,
}

const arcanoCheck: SkillCheckDef = {
  skill: 'arcano',
  difficulty: 9,
  successOutcome: { nextNodeId: 'success_node' },
  failureOutcome: { nextNodeId: 'failure_node' },
  allowSorte: true,
}

describe('resolveSkillCheck', () => {
  it('returns a result with correct fields', () => {
    const result = resolveSkillCheck(arcanoCheck, baseState, seededRandom(1))
    expect(result.skill).toBe('arcano')
    expect(result.bonus).toBe(2)
    expect(result.d1).toBeGreaterThanOrEqual(1)
    expect(result.d2).toBeGreaterThanOrEqual(1)
    expect(result.total).toBe(result.d1 + result.d2 + result.bonus)
    expect(result.difficulty).toBe(9)
    expect(typeof result.success).toBe('boolean')
  })

  it('succeeds when total >= difficulty', () => {
    // Seed that makes 2d6 = 10: total = 10 + 2 = 12 >= 9
    let foundSuccess = false
    for (let s = 0; s < 50; s++) {
      const r = resolveSkillCheck(arcanoCheck, baseState, seededRandom(s))
      if (r.success) { foundSuccess = true; break }
    }
    expect(foundSuccess).toBe(true)
  })

  it('uses correct class bonus for ladino', () => {
    const ladinoState = { ...baseState, classId: 'ladino' as const }
    const furtCheck: SkillCheckDef = { ...arcanoCheck, skill: 'furtividade' }
    const result = resolveSkillCheck(furtCheck, ladinoState, seededRandom(1))
    expect(result.bonus).toBe(2)
  })

  it('outcome matches success state', () => {
    // Run many times and verify outcome always matches
    for (let s = 0; s < 20; s++) {
      const r = resolveSkillCheck(arcanoCheck, baseState, seededRandom(s))
      if (r.success) {
        expect(r.outcome.nextNodeId).toBe('success_node')
      } else {
        expect(r.outcome.nextNodeId).toBe('failure_node')
      }
    }
  })
})
