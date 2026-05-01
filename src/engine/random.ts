import type { Random } from '@/types'

export const mathRandom: Random = {
  next: () => Math.random(),
}

export function seededRandom(seed: number): Random {
  let s = seed
  return {
    next() {
      s = (s * 1664525 + 1013904223) & 0xffffffff
      return ((s >>> 0) / 0xffffffff)
    },
  }
}
