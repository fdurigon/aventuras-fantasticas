import type { CombatState, Power, Enemy } from '@/types'
import { useGameStore } from '@/store/gameStore'
import { PowerSelector } from './PowerSelector'
import styles from './CombatScreen.module.css'

interface Props {
  combatState: CombatState
  powers: Power[]
  enemy: Enemy
}

export function CombatScreen({ combatState, powers, enemy }: Props) {
  const { performCombatAction, useLuckInCombat } = useGameStore()

  const energiaPct = (combatState.player.energia / combatState.player.maxEnergia) * 100
  const enemyPct   = (combatState.enemy.currentEnergia / enemy.energia) * 100

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h2 className={styles.round}>Round {combatState.round}</h2>
      </header>

      <div className={styles.arena}>
        {/* Player side */}
        <section className={styles.side} aria-label="Você">
          <h3 className={styles.sideTitle}>Você</h3>
          <div className={styles.statRow}>
            <span>⚔ {combatState.player.habilidade}</span>
            <div className={styles.barWrap}>
              <div className={`${styles.bar} ${energiaPct <= 30 ? styles.barDanger : styles.barOk}`}
                style={{ width: `${energiaPct}%` }} />
            </div>
            <span>{combatState.player.energia}/{combatState.player.maxEnergia}</span>
          </div>
          <div className={styles.sorteRow}>
            ★ Sorte: {combatState.player.sorte}/{combatState.player.maxSorte}
          </div>
          {combatState.player.activeEffects.length > 0 && (
            <ul className={styles.effects}>
              {combatState.player.activeEffects.map((e, i) => (
                <li key={i} className={styles.effectTag}>{e.kind} ×{e.remainingRounds}</li>
              ))}
            </ul>
          )}
        </section>

        <div className={styles.vs}>VS</div>

        {/* Enemy side */}
        <section className={styles.side} aria-label={enemy.name}>
          <div className={styles.enemyPortrait}>
            <img src={enemy.portraitImage} alt={enemy.name}
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          </div>
          <h3 className={styles.sideTitle}>{enemy.name}</h3>
          <div className={styles.statRow}>
            <span>⚔ {enemy.habilidade}</span>
            <div className={styles.barWrap}>
              <div className={`${styles.bar} ${enemyPct <= 30 ? styles.barDanger : styles.barEnemy}`}
                style={{ width: `${enemyPct}%` }} />
            </div>
            <span>{combatState.enemy.currentEnergia}/{enemy.energia}</span>
          </div>
        </section>
      </div>

      {/* Combat log */}
      <div className={styles.log} role="log" aria-live="polite" aria-label="Log de combate">
        {combatState.log.slice(-5).map((entry, i) => (
          <p key={i} className={`${styles.logEntry} ${styles[`actor_${entry.actor}`]}`}>
            {entry.message}
          </p>
        ))}
      </div>

      {/* Luck prompt */}
      {combatState.pendingLuckPrompt && combatState.player.sorte > 0 && (
        <div className={styles.luckPrompt}>
          <p>Tentar a Sorte? ({combatState.player.sorte} Sorte restante)</p>
          <div className={styles.luckButtons}>
            <button className={styles.luckYes} onClick={useLuckInCombat}>Sim, tentar!</button>
            <button className={styles.luckNo} onClick={() => useGameStore.getState().performCombatAction({ type: 'item', itemId: '__skip_luck__' })}>
              Não
            </button>
          </div>
        </div>
      )}

      {/* Actions */}
      {!combatState.pendingLuckPrompt && combatState.outcome === 'ongoing' && (
        <div className={styles.actions}>
          <PowerSelector
            powers={powers}
            usedOnceFlags={combatState.player.usedOnceFlags}
            onPick={(powerId) => performCombatAction({ type: 'power', powerId })}
          />
          {combatState.fleeAvailable && (
            <button
              className={styles.fleeBtn}
              onClick={() => performCombatAction({ type: 'flee' })}
            >
              🏃 Fugir
            </button>
          )}
        </div>
      )}

      {/* Outcome banners */}
      {combatState.outcome === 'victory' && (
        <div className={styles.victoryBanner} role="alert">
          ⚔ Vitória! ⚔
        </div>
      )}
      {combatState.outcome === 'defeat' && (
        <div className={styles.defeatBanner} role="alert">
          Você foi derrotado...
        </div>
      )}
    </div>
  )
}
