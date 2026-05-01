import { useGameStore, selectPhase } from '@/store/gameStore'
import { TitleScreen } from '@/routes/TitleScreen'
import { CharacterSelect } from '@/routes/CharacterSelect'
import { Game } from '@/routes/Game'
import { Gallery } from '@/routes/Gallery'

function GameOver() {
  const goToTitle = useGameStore(s => s.goToTitle)
  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '2rem',
      background: 'var(--color-shadow-blue)',
      color: 'var(--color-ink)',
      fontFamily: 'var(--font-display)',
    }}>
      <h2 style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-danger)' }}>
        Fim da Jornada
      </h2>
      <p style={{ fontFamily: 'var(--font-body)', color: 'var(--color-ink-muted)', fontStyle: 'italic' }}>
        A aventura terminou. Mas o Reino de Aenor aguarda novos heróis.
      </p>
      <button
        onClick={goToTitle}
        style={{
          padding: '0.75rem 2rem',
          background: 'var(--color-sepia)',
          color: 'var(--color-ink)',
          border: '2px solid var(--color-ocre)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-base)',
          cursor: 'pointer',
        }}
      >
        Voltar ao Início
      </button>
    </div>
  )
}

export function App() {
  const phase = useGameStore(selectPhase)

  switch (phase) {
    case 'title':     return <TitleScreen />
    case 'charselect': return <CharacterSelect />
    case 'game':      return <Game />
    case 'gameover':  return <GameOver />
    case 'gallery':   return <Gallery />
    default:          return <TitleScreen />
  }
}
