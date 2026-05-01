import type { GameState, SaveBlob, MetaSave } from '@/types'

const SAVE_KEY = 'av_fant_save_v1'
const META_KEY = 'av_fant_meta_v1'
const SAVE_VERSION = 1

export function saveGame(state: GameState): void {
  const blob: SaveBlob = {
    version: SAVE_VERSION,
    savedAt: Date.now(),
    state,
  }
  localStorage.setItem(SAVE_KEY, JSON.stringify(blob))
}

export function loadGame(): GameState | null {
  const raw = localStorage.getItem(SAVE_KEY)
  if (!raw) return null

  try {
    const blob = JSON.parse(raw) as SaveBlob
    if (blob.version !== SAVE_VERSION) {
      const migrated = migrate(blob)
      return migrated
    }
    return blob.state
  } catch {
    return null
  }
}

export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null
}

export function deleteSave(): void {
  localStorage.removeItem(SAVE_KEY)
}

export function loadMeta(): MetaSave {
  const raw = localStorage.getItem(META_KEY)
  if (!raw) return defaultMeta()

  try {
    return JSON.parse(raw) as MetaSave
  } catch {
    return defaultMeta()
  }
}

export function saveMeta(meta: MetaSave): void {
  localStorage.setItem(META_KEY, JSON.stringify(meta))
}

export function mergeMeta(meta: MetaSave, state: GameState): MetaSave {
  const endings = [...new Set([...meta.unlockedEndings])]
  const achievements = [...new Set([...meta.unlockedAchievements, ...state.unlockedAchievements])]
  const classes = meta.completedClasses.includes(state.classId)
    ? meta.completedClasses
    : [...meta.completedClasses, state.classId]
  return { ...meta, unlockedEndings: endings, unlockedAchievements: achievements, completedClasses: classes }
}

function defaultMeta(): MetaSave {
  return {
    version: SAVE_VERSION,
    unlockedEndings: [],
    unlockedAchievements: [],
    completedClasses: [],
  }
}

function migrate(blob: SaveBlob): GameState {
  // Future migrations go here
  return blob.state
}
