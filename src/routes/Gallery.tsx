import { useGameStore } from '@/store/gameStore'
import { ACHIEVEMENTS } from '@/content/achievements'
import { ENDINGS } from '@/content/endings'
import styles from './Gallery.module.css'

export function Gallery() {
  const { meta } = useGameStore()
  const setPhase = () => useGameStore.setState({ phase: 'title' })

  const unlockedEndings   = meta.unlockedEndings   ?? []
  const unlockedAchievements = meta.unlockedAchievements ?? []

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <h2 className={styles.title}>Galeria</h2>
        <button className={styles.backBtn} onClick={setPhase}>← Voltar</button>
      </header>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Finais</h3>
        <div className={styles.endingGrid}>
          {ENDINGS.map(ending => {
            const unlocked = unlockedEndings.includes(ending.id)
            return (
              <div
                key={ending.id}
                className={`${styles.endingCard} ${unlocked ? styles.unlocked : styles.locked}`}
              >
                <div className={styles.endingTitle}>
                  {unlocked ? ending.name : '???'}
                </div>
                {unlocked && (
                  <p className={styles.endingText}>{ending.conditions}</p>
                )}
                {!unlocked && (
                  <p className={styles.endingHint}>Continue jogando para desbloquear.</p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          Conquistas ({unlockedAchievements.length}/{ACHIEVEMENTS.length})
        </h3>
        <ul className={styles.achieveList}>
          {ACHIEVEMENTS.map(ach => {
            const unlocked = unlockedAchievements.includes(ach.id)
            return (
              <li
                key={ach.id}
                className={`${styles.achieveItem} ${unlocked ? styles.unlocked : styles.locked}`}
              >
                <span className={styles.achieveIcon}>{unlocked ? '★' : '🔒'}</span>
                <div className={styles.achieveInfo}>
                  <span className={styles.achieveName}>
                    {unlocked ? ach.name : '???'}
                  </span>
                  {unlocked && (
                    <span className={styles.achieveDesc}>{ach.description}</span>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
