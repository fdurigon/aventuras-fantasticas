import type { GameState, SkillCheckDef, ChoiceOutcome, Random } from '@/types'
import { roll2d6WithDetail } from '@/utils/dice'

export interface SkillCheckResult {
  skill: string
  bonus: number
  d1: number
  d2: number
  total: number
  difficulty: number
  success: boolean
  outcome: ChoiceOutcome
}

export function resolveSkillCheck(
  check: SkillCheckDef,
  state: GameState,
  rng: Random,
): SkillCheckResult {
  const classData = getClassSkillBonuses(state.classId)
  const bonus = classData[check.skill] ?? 0
  const { d1, d2, total: rawTotal } = roll2d6WithDetail(rng)
  const total = rawTotal + bonus
  const success = total >= check.difficulty

  return {
    skill: check.skill,
    bonus,
    d1,
    d2,
    total,
    difficulty: check.difficulty,
    success,
    outcome: success ? check.successOutcome : check.failureOutcome,
  }
}

export function resolveSkillCheckRetry(
  check: SkillCheckDef,
  state: GameState,
  rng: Random,
): SkillCheckResult {
  return resolveSkillCheck(check, { ...state, stats: { ...state.stats, sorte: state.stats.sorte - 1 } }, rng)
}

// Imported lazily to avoid circular dep — characters.ts will call registerSkillBonuses
const bonusRegistry: Record<string, Record<string, number>> = {}

export function registerClassSkillBonuses(classId: string, bonuses: Record<string, number>): void {
  bonusRegistry[classId] = bonuses
}

export function getClassSkillBonuses(classId: string): Record<string, number> {
  return bonusRegistry[classId] ?? {}
}
