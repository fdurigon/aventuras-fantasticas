import styles from './StatsBar.module.css'
import { getReputationLabel } from '@/engine/reputation'

interface Props {
  habilidade: number
  energia: number
  maxEnergia: number
  sorte: number
  maxSorte: number
  gold: number
  reputation: number
}

export function StatsBar({ habilidade, energia, maxEnergia, sorte, maxSorte, gold, reputation }: Props) {
  const energiaPct = (energia / maxEnergia) * 100
  const sortePct   = (sorte   / maxSorte)   * 100
  const repLabel   = getReputationLabel(reputation)

  return (
    <aside className={styles.root} aria-label="Status do personagem">
      <div className={styles.stat}>
        <span className={styles.label}>⚔ Habilidade</span>
        <span className={styles.value}>{habilidade}</span>
      </div>

      <div className={styles.stat}>
        <span className={styles.label}>♥ Energia</span>
        <div className={styles.barWrap} role="meter" aria-valuenow={energia} aria-valuemin={0} aria-valuemax={maxEnergia} aria-label={`Energia: ${energia} de ${maxEnergia}`}>
          <div
            className={`${styles.bar} ${energiaPct <= 30 ? styles.barDanger : energiaPct <= 60 ? styles.barWarn : styles.barOk}`}
            style={{ width: `${energiaPct}%` }}
          />
        </div>
        <span className={styles.value}>{energia}/{maxEnergia}</span>
      </div>

      <div className={styles.stat}>
        <span className={styles.label}>★ Sorte</span>
        <div className={styles.barWrap} role="meter" aria-valuenow={sorte} aria-valuemin={0} aria-valuemax={maxSorte} aria-label={`Sorte: ${sorte} de ${maxSorte}`}>
          <div className={`${styles.bar} ${styles.barGold}`} style={{ width: `${sortePct}%` }} />
        </div>
        <span className={styles.value}>{sorte}/{maxSorte}</span>
      </div>

      <div className={styles.stat}>
        <span className={styles.label}>◈ Ouro</span>
        <span className={styles.value}>{gold}</span>
      </div>

      <div className={styles.stat}>
        <span className={styles.label}>⚖ Reputação</span>
        <span className={`${styles.value} ${reputation >= 3 ? styles.honrado : reputation <= -3 ? styles.sombrio : ''}`}>
          {repLabel} ({reputation > 0 ? '+' : ''}{reputation})
        </span>
      </div>
    </aside>
  )
}
