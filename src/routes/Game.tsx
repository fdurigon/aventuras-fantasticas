import { useEffect, useState } from 'react'
import { useGameStore, selectGameState, selectCurrentNode, selectInCombat } from '@/store/gameStore'
import { getAvailableChoices } from '@/engine/narrative'
import { resolveSkillCheck } from '@/engine/skillCheck'
import { seededRandom } from '@/engine/random'
import { getPowersByClass } from '@/content/powers'
import { getEnemy } from '@/content/enemies'
import { getItem } from '@/content/items'
import type { Choice } from '@/types'
import { TypewriterText } from '@/components/narrative/TypewriterText'
import { ChoiceList } from '@/components/narrative/ChoiceList'
import { StatsBar } from '@/components/hud/StatsBar'
import { CombatScreen } from '@/components/combat/CombatScreen'
import { MapView } from '@/components/map/MapView'
import { InventoryDrawer } from '@/components/inventory/InventoryDrawer'
import styles from './Game.module.css'

export function Game() {
  const store = useGameStore()
  const gameState = useGameStore(selectGameState)
  const node = useGameStore(selectCurrentNode)
  const inCombat = useGameStore(selectInCombat)

  const [textDone, setTextDone] = useState(false)
  const [inventoryOpen, setInventoryOpen] = useState(false)
  const [pauseOpen, setPauseOpen] = useState(false)
  const [skillResult, setSkillResult] = useState<null | { success: boolean; message: string; nextNodeId: string }>(null)

  // Key navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'i' || e.key === 'I') setInventoryOpen(v => !v)
      if (e.key === 'Escape') setPauseOpen(v => !v)
      if (e.key === ' ') setTextDone(true)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Reset text on node change
  useEffect(() => { setTextDone(false); setSkillResult(null) }, [gameState?.currentNodeId])

  if (!gameState || !node) return null

  const handleChoice = (choice: Choice) => {
    if (!gameState) return

    if (choice.skillCheck) {
      const rng = seededRandom(Date.now())
      const result = resolveSkillCheck(choice.skillCheck, gameState, rng)
      const outcome = result.outcome
      setSkillResult({
        success: result.success,
        message: result.success
          ? `Sucesso! (${result.total} ≥ ${choice.skillCheck.difficulty})`
          : `Falha. (${result.total} < ${choice.skillCheck.difficulty})`,
        nextNodeId: outcome.nextNodeId,
      })
      if (outcome.effects) store.applyNodeEffects(outcome.effects)
      setTimeout(() => {
        setSkillResult(null)
        store.navigateToNode(outcome.nextNodeId, outcome.effects)
      }, 1800)
      return
    }

    if (choice.combat) {
      if (choice.outcome?.effects) store.applyNodeEffects(choice.outcome.effects)
      store.startCombat(choice.combat)
      return
    }

    if (choice.outcome) {
      store.navigateToNode(choice.outcome.nextNodeId, choice.outcome.effects)
    }
  }

  const availableChoices = getAvailableChoices(node, gameState)
  const powers = getPowersByClass(gameState.classId)
  const isEnding = !!node.isEnding
  const isMapNode = !!node.isMap

  // Build narrative text with class variant
  let narrativeText = node.text
  if (node.classVariants?.[gameState.classId]) {
    narrativeText += '\n\n' + node.classVariants[gameState.classId]
  }

  if (inCombat && gameState.combat) {
    const enemy = getEnemy(gameState.combat.enemy.id)
    if (!enemy) return null
    return (
      <CombatScreen
        combatState={gameState.combat}
        powers={powers}
        enemy={enemy}
      />
    )
  }

  if (isMapNode) {
    return (
      <MapView
        gameState={gameState}
        onSelectLocation={(nodeId) => store.navigateToNode(nodeId)}
      />
    )
  }

  return (
    <div className={styles.root}>
      {/* HUD */}
      <aside className={styles.hud}>
        <StatsBar
          habilidade={gameState.stats.habilidade}
          energia={gameState.stats.energia}
          maxEnergia={gameState.maxStats.energia}
          sorte={gameState.stats.sorte}
          maxSorte={gameState.maxStats.sorte}
          gold={gameState.gold}
          reputation={gameState.reputation}
        />
        <div className={styles.hudActions}>
          <button className={styles.hudBtn} onClick={() => setInventoryOpen(true)} title="Inventário (I)">
            🎒 Bolsa
          </button>
          <button className={styles.hudBtn} onClick={() => setPauseOpen(true)} title="Pausa (Esc)">
            ⋮ Pausa
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className={`${styles.main} ${isEnding ? styles.ending : ''}`} aria-live="polite">
        {node.imageId && (
          <figure className={styles.scene}>
            <img
              src={`${import.meta.env.BASE_URL}images/${node.imageId}`}
              alt={node.title ?? 'Cena'}
              loading="lazy"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </figure>
        )}

        {node.title && <h2 className={styles.nodeTitle}>{node.title}</h2>}

        <div className={styles.narrative}>
          <TypewriterText
            text={narrativeText}
            speedMs={18}
            onComplete={() => setTextDone(true)}
          />
        </div>

        {skillResult && (
          <div className={`${styles.skillResult} ${skillResult.success ? styles.success : styles.failure}`}>
            {skillResult.message}
          </div>
        )}

        {textDone && !skillResult && !isEnding && (
          <ChoiceList
            choices={availableChoices}
            gameState={gameState}
            onPick={handleChoice}
          />
        )}

        {isEnding && textDone && (
          <div className={styles.endingActions}>
            <p className={styles.endingLabel}>— Fim —</p>
            <button className={styles.returnBtn} onClick={store.goToTitle}>
              Voltar ao Início
            </button>
          </div>
        )}
      </main>

      {inventoryOpen && (
        <InventoryDrawer
          gameState={gameState}
          onClose={() => setInventoryOpen(false)}
          onUseItem={(itemId: string) => {
            if (!getItem(itemId)) return
            store.applyNodeEffects([{ kind: 'removeItem', itemId, quantity: 1 }])
          }}
        />
      )}

      {pauseOpen && (
        <div className={styles.pauseOverlay} role="dialog" aria-label="Menu de pausa">
          <div className={styles.pauseMenu}>
            <h3>Pausa</h3>
            <button onClick={() => setPauseOpen(false)}>Continuar</button>
            <button onClick={() => { store.saveNow(); setPauseOpen(false) }}>Salvar</button>
            <button onClick={store.goToTitle}>Título</button>
          </div>
        </div>
      )}
    </div>
  )
}
