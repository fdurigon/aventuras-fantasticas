/// <reference types="node" />
/**
 * Graph validation script — §25.7
 * Run: npm run validate-graph
 */
import { NODE_MAP } from '../content/nodes/index.js'
import { ITEM_MAP } from '../content/items.js'
import { ENEMY_MAP } from '../content/enemies.js'

// Key items that are valid but not in ITEM_MAP
const VALID_KEY_ITEMS = new Set([
  'cajado_vesperia', 'adagas_pai', 'gazua', 'machado_totem', 'pele_lobo_branco',
  'mapa_egide', 'frag_vida', 'frag_mente', 'frag_corpo', 'egide_solgar',
  'selo_sombrio', 'coroa_negra', 'chave_de_raiz', 'chave_do_templo', 'amuleto_arvendel',
])

const VALID_ACHIEVEMENTS = new Set([
  'first_blood', 'pacifist_streak', 'lucky_seven', 'wise_choice', 'dark_pact',
  'complete_codex', 'all_fragments', 'heroic_ending', 'dark_ending',
  'sacrifice_ending', 'tragic_ending', 'all_classes', 'no_damage_act1',
])

const VALID_ENDINGS = new Set([
  'ending_heroic', 'ending_dark', 'ending_sacrifice', 'ending_tragic',
])

let errors = 0
let warnings = 0

function error(msg: string) {
  console.error(`❌ ERROR: ${msg}`)
  errors++
}

function warn(msg: string) {
  console.warn(`⚠️  WARN:  ${msg}`)
  warnings++
}

function checkNodeId(id: string, context: string) {
  if (!NODE_MAP.has(id)) {
    error(`nextNodeId "${id}" does not exist (from ${context})`)
  }
}

function checkItemId(id: string, context: string) {
  if (!ITEM_MAP.has(id) && !VALID_KEY_ITEMS.has(id)) {
    error(`itemId/keyItemId "${id}" not found (from ${context})`)
  }
}

function checkEnemyId(id: string, context: string) {
  if (!ENEMY_MAP.has(id)) {
    error(`enemyId "${id}" not found (from ${context})`)
  }
}

// ── Run checks ───────────────────────────────────────────────
console.log(`\n🗺  Validating narrative graph (${NODE_MAP.size} nodes)...\n`)

const reachable = new Set<string>()
const queue: string[] = ['a1_pedragar_01']

// ── Reachability BFS ─────────────────────────────────────────
while (queue.length > 0) {
  const id = queue.shift()!
  if (reachable.has(id)) continue
  reachable.add(id)

  const node = NODE_MAP.get(id)
  if (!node) continue

  for (const choice of node.choices) {
    const outcomes = [choice.outcome, choice.skillCheck?.successOutcome, choice.skillCheck?.failureOutcome, choice.combat?.victoryOutcome, choice.combat?.defeatOutcome, choice.combat?.fleeOutcome].filter(Boolean)
    for (const o of outcomes) {
      if (o?.nextNodeId && !reachable.has(o.nextNodeId)) {
        queue.push(o.nextNodeId)
      }
    }
  }
}

// ── Per-node validation ──────────────────────────────────────
for (const [id, node] of NODE_MAP) {
  const ctx = `node ${id}`

  // Reachability
  if (!reachable.has(id)) {
    warn(`Node "${id}" is unreachable from a1_pedragar_01`)
  }

  // No black holes
  if (node.choices.length === 0 && !node.isEnding && !node.isMap && !node.isMerchant) {
    error(`Node "${id}" has no choices and is not an ending/map/merchant`)
  }

  // onEnter effects
  for (const effect of node.onEnter ?? []) {
    if (effect.kind === 'addItem') checkItemId(effect.itemId, `${ctx} onEnter`)
    if (effect.kind === 'removeItem') checkItemId(effect.itemId, `${ctx} onEnter`)
    if (effect.kind === 'addKeyItem') checkItemId(effect.keyItemId, `${ctx} onEnter`)
    if (effect.kind === 'removeKeyItem') checkItemId(effect.keyItemId, `${ctx} onEnter`)
    if (effect.kind === 'unlockAchievement' && !VALID_ACHIEVEMENTS.has(effect.achievementId)) {
      error(`Unknown achievementId "${effect.achievementId}" (from ${ctx})`)
    }
  }

  // Ending reference
  if (node.isEnding && !VALID_ENDINGS.has(node.isEnding)) {
    error(`Node "${id}" has unknown isEnding: "${node.isEnding}"`)
  }

  // Choices
  for (const choice of node.choices) {
    const choiceCtx = `${ctx} choice "${choice.id}"`

    // Direct outcome
    if (choice.outcome) {
      checkNodeId(choice.outcome.nextNodeId, choiceCtx)
      for (const e of choice.outcome.effects ?? []) {
        if (e.kind === 'addItem') checkItemId(e.itemId, choiceCtx)
        if (e.kind === 'removeItem') checkItemId(e.itemId, choiceCtx)
        if (e.kind === 'addKeyItem') checkItemId(e.keyItemId, choiceCtx)
        if (e.kind === 'removeKeyItem') checkItemId(e.keyItemId, choiceCtx)
      }
    }

    // Skill check
    if (choice.skillCheck) {
      checkNodeId(choice.skillCheck.successOutcome.nextNodeId, `${choiceCtx} skillCheck.success`)
      checkNodeId(choice.skillCheck.failureOutcome.nextNodeId, `${choiceCtx} skillCheck.failure`)
    }

    // Combat
    if (choice.combat) {
      checkEnemyId(choice.combat.enemyId, choiceCtx)
      checkNodeId(choice.combat.victoryOutcome.nextNodeId, `${choiceCtx} combat.victory`)
      if (choice.combat.defeatOutcome) {
        checkNodeId(choice.combat.defeatOutcome.nextNodeId, `${choiceCtx} combat.defeat`)
      }
      if (choice.combat.fleeOutcome) {
        checkNodeId(choice.combat.fleeOutcome.nextNodeId, `${choiceCtx} combat.flee`)
      }
    }
  }
}

// ── Ending reachability ──────────────────────────────────────
for (const endingId of VALID_ENDINGS) {
  if (!NODE_MAP.has(endingId)) {
    error(`Ending node "${endingId}" does not exist`)
  } else if (!reachable.has(endingId)) {
    warn(`Ending "${endingId}" is not reachable`)
  }
}

// ── Summary ──────────────────────────────────────────────────
console.log(`\n📊 Results:`)
console.log(`   Nodes:     ${NODE_MAP.size}`)
console.log(`   Reachable: ${reachable.size}`)
console.log(`   Errors:    ${errors}`)
console.log(`   Warnings:  ${warnings}`)

if (errors > 0) {
  console.error(`\n💥 Validation FAILED with ${errors} error(s).\n`)
  process.exit(1)
} else if (warnings > 0) {
  console.warn(`\n⚠️  Validation passed with ${warnings} warning(s).\n`)
} else {
  console.log(`\n✅ Validation PASSED — graph is clean.\n`)
}
