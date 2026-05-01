// ============================================================
// AVENTURAS FANTÁSTICAS — Shared Types
// ============================================================

// ── Primitives ──────────────────────────────────────────────
export type ClassId = 'mago' | 'ladino' | 'barbaro'

export type SkillName =
  | 'arcano'
  | 'atletismo'
  | 'furtividade'
  | 'intimidar'
  | 'persuadir'
  | 'trapaca'
  | 'investigar'
  | 'resistirMagia'

export type NodeId = string
export type ItemId = string
export type KeyItemId = string
export type EnemyId = string
export type PowerId = string
export type EndingId = string
export type AchievementId = string
export type LocationId =
  | 'pedragar'
  | 'mirthwood'
  | 'bramford'
  | 'karn_tuhl'
  | 'cidadela_sombras'
  | 'estrada'

// ── Dice ────────────────────────────────────────────────────
export interface DiceRoll {
  count: number
  faces: number
  bonus: number
}

// ── Powers ──────────────────────────────────────────────────
export type PowerRole = 'high_damage' | 'consistent' | 'utility'

export interface PowerEffect {
  type: 'shield' | 'evade' | 'rage' | 'sneak_bonus' | 'multi_attack'
  value?: number
  duration?: number
}

export interface SelfPenalty {
  stat: 'habilidade' | 'energia'
  amount: number
  duration: number
}

export interface Power {
  id: PowerId
  classId: ClassId
  name: string
  description: string
  role: PowerRole
  attackModifier: number
  damage: DiceRoll | null
  effect: PowerEffect | null
  selfPenalty: SelfPenalty | null
  flavorText: string
  usesPerCombat?: number // undefined = unlimited
}

// ── Items ───────────────────────────────────────────────────
export type ItemEffect =
  | { kind: 'heal'; amount: number }
  | { kind: 'restoreSorte'; amount: number }
  | { kind: 'tempBuff'; stat: 'habilidade'; amount: number; duration: number }
  | { kind: 'damageBoost'; amount: number; duration: number }
  | { kind: 'luckBoost'; amount: number; duration: number }
  | { kind: 'special'; tag: string }

export interface Item {
  id: ItemId
  name: string
  description: string
  type: 'consumable' | 'equipment' | 'misc'
  effect: ItemEffect
  stackable: boolean
  goldValue: number
  usableInCombat: boolean
  usableOutOfCombat: boolean
  equipmentBonus?: Partial<Record<SkillName, number>> & {
    habilidade?: number
    sorteMax?: number
  }
}

export interface InventoryEntry {
  itemId: ItemId
  quantity: number
}

// ── Enemies ─────────────────────────────────────────────────
export interface EnemyResistance {
  type: PowerEffect['type']
  reduction: number
}

export interface Enemy {
  id: EnemyId
  name: string
  description: string
  portraitImage: string
  habilidade: number
  energia: number
  damage: DiceRoll
  fleeable: boolean
  goldReward: number
  itemDropId?: ItemId
  dropChance?: number // 0-1, default 1 if itemDropId set
  resistances?: EnemyResistance[]
  bestiaryFlavor: string
}

// ── Active Effects ───────────────────────────────────────────
export type ActiveEffectKind =
  | 'habilidade_bonus'
  | 'damage_bonus'
  | 'shield'
  | 'evade_next'
  | 'rage'
  | 'sneak_bonus'
  | 'habilidade_penalty'
  | 'luck_bonus'

export interface ActiveEffect {
  kind: ActiveEffectKind
  value: number
  remainingRounds: number
  source?: string
}

// ── Combat State ─────────────────────────────────────────────
export interface CombatLogEntry {
  round: number
  actor: 'player' | 'enemy' | 'system'
  message: string
}

export interface CombatPlayerState {
  habilidade: number
  energia: number
  maxEnergia: number
  sorte: number
  maxSorte: number
  activeEffects: ActiveEffect[]
  usedOnceFlags: PowerId[]
}

export interface CombatEnemyState {
  id: EnemyId
  currentEnergia: number
  activeEffects: ActiveEffect[]
}

export type CombatOutcome = 'ongoing' | 'victory' | 'defeat' | 'fled'

export interface CombatState {
  player: CombatPlayerState
  enemy: CombatEnemyState
  round: number
  log: CombatLogEntry[]
  fleeAvailable: boolean
  outcome: CombatOutcome
  pendingLuckPrompt: boolean
  lastDamageToPlayer: number
  lastDamageToEnemy: number
}

// ── Narrative ────────────────────────────────────────────────
export type NodeEffect =
  | { kind: 'addItem'; itemId: ItemId; quantity?: number }
  | { kind: 'removeItem'; itemId: ItemId; quantity?: number }
  | { kind: 'addKeyItem'; keyItemId: KeyItemId }
  | { kind: 'removeKeyItem'; keyItemId: KeyItemId }
  | { kind: 'gold'; amount: number }
  | { kind: 'energy'; amount: number }
  | { kind: 'sorte'; amount: number }
  | { kind: 'reputation'; amount: number }
  | { kind: 'setFlag'; key: string; value: boolean | number | string }
  | { kind: 'incrementFlag'; key: string; by?: number }
  | { kind: 'unlockAchievement'; achievementId: AchievementId }
  | { kind: 'restoreRespiro'; type: 'sorte' | 'energia' | 'both' }
  | { kind: 'addSorteMax'; amount: number }

export interface FlagCondition {
  key: string
  equals?: boolean | number | string
  gt?: number
  lt?: number
  gte?: number
  lte?: number
  exists?: boolean
}

export interface SkillCheckDef {
  skill: SkillName
  difficulty: number
  successOutcome: ChoiceOutcome
  failureOutcome: ChoiceOutcome
  allowSorte: boolean
}

export interface CombatEncounter {
  enemyId: EnemyId
  victoryOutcome: ChoiceOutcome
  defeatOutcome?: ChoiceOutcome
  fleeOutcome?: ChoiceOutcome
  fleeAvailable?: boolean
  modifiers?: {
    enemyEnergyBonus?: number
    enemyHabilidadeBonus?: number
    playerHabilidadePenalty?: number
    playerPreArmedPowerId?: PowerId
  }
}

export interface ChoiceOutcome {
  nextNodeId: NodeId
  effects?: NodeEffect[]
  narrationOverride?: string
}

export interface Choice {
  id: string
  label: string
  classRequirement?: ClassId | ClassId[]
  flagRequirement?: FlagCondition | FlagCondition[]
  itemRequirement?: ItemId | KeyItemId
  reputationRequirement?: { min?: number; max?: number }
  skillCheck?: SkillCheckDef
  combat?: CombatEncounter
  outcome?: ChoiceOutcome
  disabled?: boolean
  disabledTooltip?: string
  icon?: 'dice' | 'sword' | 'class' | 'map' | 'lock'
}

export interface NarrativeNode {
  id: NodeId
  locationId: LocationId
  title?: string
  imageId?: string
  text: string
  classVariants?: Partial<Record<ClassId, string>>
  choices: Choice[]
  onEnter?: NodeEffect[]
  isEnding?: EndingId
  isMerchant?: boolean
  isMap?: boolean
}

// ── Characters ───────────────────────────────────────────────
export interface CharacterClass {
  id: ClassId
  name: string
  title: string
  backstory: string
  portraitImage: string
  baseStats: { habilidade: number; energia: number; sorte: number }
  skillBonuses: Record<SkillName, number>
  startingPowers: PowerId[]
  startingItems: ItemId[]
  startingKeyItems: KeyItemId[]
  startingGold: number
}

// ── Game State ───────────────────────────────────────────────
export interface GameState {
  classId: ClassId
  stats: { habilidade: number; energia: number; sorte: number }
  maxStats: { habilidade: number; energia: number; sorte: number }
  inventory: InventoryEntry[]
  keyItems: KeyItemId[]
  equippedItems: ItemId[]
  gold: number
  reputation: number
  currentNodeId: NodeId
  visitedNodes: NodeId[]
  flags: Record<string, boolean | number | string>
  defeatedEnemies: EnemyId[]
  unlockedAchievements: AchievementId[]
  activeEffects: ActiveEffect[]
  startedAt: number
  combat: CombatState | null
}

// ── Meta Save (cross-run) ────────────────────────────────────
export interface MetaSave {
  version: number
  unlockedEndings: EndingId[]
  unlockedAchievements: AchievementId[]
  completedClasses: ClassId[]
}

// ── Save Blob ────────────────────────────────────────────────
export interface SaveBlob {
  version: number
  savedAt: number
  state: GameState
}

// ── Achievements & Endings ────────────────────────────────────
export interface Achievement {
  id: AchievementId
  name: string
  description: string
  hidden: boolean
}

export interface Ending {
  id: EndingId
  name: string
  type: 'heroic' | 'dark' | 'sacrifice' | 'tragic'
  imageId: string
  text: string
  conditions: string
}

// ── Locations ────────────────────────────────────────────────
export interface Location {
  id: LocationId
  name: string
  description: string
  imageMarker: string
  unlockFlag?: string
  visitedFlag: string
}

// ── Random interface (injectable) ────────────────────────────
export interface Random {
  next(): number // [0, 1)
}
