import type { GameState } from '@/types'
import { LOCATIONS } from '@/content/locations'
import styles from './MapView.module.css'

interface Props {
  gameState: GameState
  onSelectLocation: (nodeId: string) => void
}

const LOCATION_START_NODES: Record<string, string> = {
  mirthwood:       'a2_mirthwood_01',
  bramford:        'a2_bramford_01',
  karn_tuhl:       'a2_karn_01',
  cidadela_sombras: 'a3_cidadela_01',
}

const PIN_POSITIONS: Record<string, { top: string; left: string }> = {
  pedragar:         { top: '70%', left: '22%' },
  estrada:          { top: '55%', left: '40%' },
  mirthwood:        { top: '35%', left: '25%' },
  bramford:         { top: '55%', left: '58%' },
  karn_tuhl:        { top: '20%', left: '65%' },
  cidadela_sombras: { top: '40%', left: '80%' },
}

export function MapView({ gameState, onSelectLocation }: Props) {
  const availableLocations = LOCATIONS.filter(loc => {
    if (loc.unlockFlag && !gameState.flags[loc.unlockFlag]) return false
    if (loc.id === 'pedragar') return false
    if (loc.id === 'estrada') return false
    return true
  })

  const getStatus = (locId: string): 'current' | 'available' | 'completed' | 'locked' => {
    const completedFlagMap: Record<string, string> = {
      mirthwood: 'mirthwood_concluido',
      bramford:  'bramford_concluido',
      karn_tuhl: 'karn_concluido',
    }
    if (completedFlagMap[locId] && gameState.flags[completedFlagMap[locId]]) return 'completed'
    if (availableLocations.find(l => l.id === locId)) return 'available'
    return 'locked'
  }

  return (
    <div className={styles.root} role="main" aria-label="Mapa do mundo">
      <h2 className={styles.title}>Reino de Aenor</h2>
      <p className={styles.subtitle}>Escolha seu próximo destino.</p>

      <div className={styles.mapContainer}>
        <img
          src={`${import.meta.env.BASE_URL}images/map.png`}
          alt="Mapa de Aenor"
          className={styles.mapImage}
          onError={e => { (e.target as HTMLImageElement).style.opacity = '0.1' }}
        />
        {LOCATIONS.map(loc => {
          const pos = PIN_POSITIONS[loc.id]
          if (!pos) return null
          const status = getStatus(loc.id)
          const startNode = LOCATION_START_NODES[loc.id]
          const canClick = status === 'available' && startNode

          return (
            <button
              key={loc.id}
              className={`${styles.pin} ${styles[`pin_${status}`]}`}
              style={{ top: pos.top, left: pos.left }}
              onClick={() => canClick && onSelectLocation(startNode)}
              disabled={!canClick}
              aria-label={`${loc.name} — ${status === 'completed' ? 'Concluído' : status === 'available' ? 'Disponível' : 'Bloqueado'}`}
              title={loc.description}
            >
              <span className={styles.pinIcon}>
                {status === 'completed' ? '✓' : status === 'locked' ? '🔒' : '●'}
              </span>
              <span className={styles.pinLabel}>{loc.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
