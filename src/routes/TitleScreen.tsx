import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { loadGame } from '@/engine/save'
import styles from './TitleScreen.module.css'
import { Button } from '@/components/ui/Button'

export function TitleScreen() {
  const { goToCharSelect, continueGame, goToGallery, meta } = useGameStore()
  const [hasSave, setHasSave] = useState(false)

  useEffect(() => {
    setHasSave(loadGame() !== null)
  }, [])

  return (
    <main className={styles.root}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.titleBlock}>
          <p className={styles.subtitle}>Uma Aventura no Reino de Aenor</p>
          <h1 className={styles.title}>Aventuras<br />Fantásticas</h1>
          <div className={styles.ornament}>⸻ ✦ ⸻</div>
        </div>

        <nav className={styles.menu} aria-label="Menu principal">
          {hasSave && (
            <Button variant="primary" size="lg" full onClick={continueGame}>
              ▶ Continuar Aventura
            </Button>
          )}
          <Button variant={hasSave ? 'secondary' : 'primary'} size="lg" full onClick={goToCharSelect}>
            {hasSave ? '⚔ Nova Aventura' : '⚔ Iniciar Aventura'}
          </Button>
          <Button variant="ghost" size="lg" full onClick={goToGallery}>
            📜 Galeria
          </Button>
        </nav>

        {meta.unlockedEndings.length > 0 && (
          <p className={styles.finaisLabel}>
            Finais descobertos: {meta.unlockedEndings.length}/4
          </p>
        )}

        <footer className={styles.footer}>
          <p>Inspirado em Fighting Fantasy • Steve Jackson &amp; Ian Livingstone</p>
        </footer>
      </div>
    </main>
  )
}
