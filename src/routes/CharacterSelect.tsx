import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { CHARACTERS } from '@/content/characters'
import { Button } from '@/components/ui/Button'
import type { ClassId } from '@/types'
import styles from './CharacterSelect.module.css'

export function CharacterSelect() {
  const { startNewGame, goToTitle } = useGameStore()
  const [selected, setSelected] = useState<ClassId | null>(null)
  const [expanded, setExpanded] = useState<ClassId | null>(null)

  const char = selected ? CHARACTERS.find(c => c.id === selected) : null

  return (
    <main className={styles.root}>
      <header className={styles.header}>
        <button className={styles.back} onClick={goToTitle} aria-label="Voltar ao título">← Voltar</button>
        <h1 className={styles.title}>Escolha seu Destino</h1>
        <p className={styles.subtitle}>Cada caminho conta uma história diferente.</p>
      </header>

      <div className={styles.cards}>
        {CHARACTERS.map(c => (
          <article
            key={c.id}
            className={`${styles.card} ${selected === c.id ? styles.cardSelected : ''}`}
            onClick={() => setSelected(c.id)}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setSelected(c.id) }}
            role="radio"
            aria-checked={selected === c.id}
            aria-label={`${c.name}, ${c.title}`}
          >
            <div className={styles.portrait}>
              <img src={import.meta.env.BASE_URL + c.portraitImage.slice(1)} alt={c.name} loading="lazy" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
            <div className={styles.cardBody}>
              <h2 className={styles.charName}>{c.name}</h2>
              <p className={styles.charTitle}>{c.title}</p>
              <div className={styles.stats}>
                <Stat label="Hab" value={c.baseStats.habilidade} />
                <Stat label="Ene" value={c.baseStats.energia} />
                <Stat label="Sor" value={c.baseStats.sorte} />
              </div>
              <p className={styles.backstoryShort}>
                {c.backstory.slice(0, 120)}…
              </p>
              <button
                className={styles.readMore}
                onClick={e => { e.stopPropagation(); setExpanded(expanded === c.id ? null : c.id) }}
              >
                {expanded === c.id ? 'Ocultar' : 'Ler história completa'}
              </button>
              {expanded === c.id && (
                <p className={styles.backstoryFull}>{c.backstory}</p>
              )}
            </div>
          </article>
        ))}
      </div>

      <div className={styles.footer}>
        <Button
          variant="primary"
          size="lg"
          disabled={!selected}
          onClick={() => selected && startNewGame(selected)}
          aria-label={char ? `Iniciar jornada como ${char.name}` : 'Selecione um personagem'}
        >
          {char ? `⚔ Iniciar como ${char.name}` : 'Selecione um personagem'}
        </Button>
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 700, fontFamily: 'var(--font-ui)', color: 'var(--color-sepia)' }}>{value}</div>
      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-ink-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
    </div>
  )
}
