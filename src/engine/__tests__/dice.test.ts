import { describe, it, expect } from 'vitest'
import { rollDie, roll, roll2d6, roll2d6WithDetail, rollWithDetail } from '@/utils/dice'
import { seededRandom } from '@/engine/random'

const rng = seededRandom(42)

describe('rollDie', () => {
  it('returns value in [1, faces]', () => {
    const results = Array.from({ length: 200 }, () => rollDie(6, seededRandom(Math.floor(Math.random() * 1e9))))
    results.forEach(v => {
      expect(v).toBeGreaterThanOrEqual(1)
      expect(v).toBeLessThanOrEqual(6)
    })
  })
})

describe('roll', () => {
  it('returns sum in expected range', () => {
    const dice = { count: 2, faces: 6, bonus: 3 }
    const r = roll(dice, seededRandom(1))
    expect(r).toBeGreaterThanOrEqual(5) // 2d6+3 min = 5
    expect(r).toBeLessThanOrEqual(15)   // 2d6+3 max = 15
  })

  it('handles zero bonus', () => {
    const dice = { count: 1, faces: 4, bonus: 0 }
    const r = roll(dice, seededRandom(99))
    expect(r).toBeGreaterThanOrEqual(1)
    expect(r).toBeLessThanOrEqual(4)
  })
})

describe('roll2d6', () => {
  it('returns value in [2, 12]', () => {
    for (let i = 0; i < 100; i++) {
      const v = roll2d6(seededRandom(i))
      expect(v).toBeGreaterThanOrEqual(2)
      expect(v).toBeLessThanOrEqual(12)
    }
  })
})

describe('roll2d6WithDetail', () => {
  it('total equals d1 + d2', () => {
    const { total, d1, d2 } = roll2d6WithDetail(seededRandom(7))
    expect(total).toBe(d1 + d2)
  })
})

describe('rollWithDetail', () => {
  it('total equals sum of rolls + bonus', () => {
    const dice = { count: 3, faces: 6, bonus: 2 }
    const { total, rolls } = rollWithDetail(dice, seededRandom(13))
    expect(rolls).toHaveLength(3)
    expect(total).toBe(rolls.reduce((a, b) => a + b, 0) + 2)
  })
})

describe('seededRandom determinism', () => {
  it('produces same sequence with same seed', () => {
    const r1 = seededRandom(123)
    const r2 = seededRandom(123)
    for (let i = 0; i < 10; i++) {
      expect(r1.next()).toBe(r2.next())
    }
  })

  it('produces different sequences with different seeds', () => {
    const vals1 = Array.from({ length: 5 }, () => seededRandom(1).next())
    const vals2 = Array.from({ length: 5 }, () => seededRandom(2).next())
    expect(vals1).not.toEqual(vals2)
  })
})

// suppress unused warning
void rng
