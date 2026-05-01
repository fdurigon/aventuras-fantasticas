import type { DiceRoll, Random } from '@/types'

export function rollDie(faces: number, rng: Random): number {
  return Math.floor(rng.next() * faces) + 1
}

export function roll(dice: DiceRoll, rng: Random): number {
  let total = dice.bonus
  for (let i = 0; i < dice.count; i++) {
    total += rollDie(dice.faces, rng)
  }
  return total
}

export function roll2d6(rng: Random): number {
  return rollDie(6, rng) + rollDie(6, rng)
}

export function rollWithDetail(dice: DiceRoll, rng: Random): { total: number; rolls: number[] } {
  const rolls: number[] = []
  for (let i = 0; i < dice.count; i++) {
    rolls.push(rollDie(dice.faces, rng))
  }
  const total = rolls.reduce((a, b) => a + b, 0) + dice.bonus
  return { total, rolls }
}

export function roll2d6WithDetail(rng: Random): { total: number; d1: number; d2: number } {
  const d1 = rollDie(6, rng)
  const d2 = rollDie(6, rng)
  return { total: d1 + d2, d1, d2 }
}
