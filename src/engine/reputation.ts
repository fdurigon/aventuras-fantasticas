import type { GameState } from '@/types'

export const MIN_REPUTATION = -10
export const MAX_REPUTATION = 10

export function changeReputation(state: GameState, amount: number): GameState {
  const newRep = Math.max(MIN_REPUTATION, Math.min(MAX_REPUTATION, state.reputation + amount))
  return { ...state, reputation: newRep }
}

export function getReputationLabel(reputation: number): string {
  if (reputation >= 8) return 'Lendário'
  if (reputation >= 5) return 'Honrado'
  if (reputation >= 2) return 'Virtuoso'
  if (reputation >= -1) return 'Neutro'
  if (reputation >= -4) return 'Suspeito'
  if (reputation >= -7) return 'Vil'
  return 'Sombrio'
}

export function meetsReputationRequirement(
  state: GameState,
  req: { min?: number; max?: number },
): boolean {
  if (req.min !== undefined && state.reputation < req.min) return false
  if (req.max !== undefined && state.reputation > req.max) return false
  return true
}
