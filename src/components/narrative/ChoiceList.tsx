import type { Choice, GameState } from '@/types'
import { isChoiceAvailable } from '@/engine/narrative'
import styles from './ChoiceList.module.css'

interface Props {
  choices: Choice[]
  gameState: GameState
  onPick: (choice: Choice) => void
  disabled?: boolean
}

const ICONS: Record<string, string> = {
  dice:  '⚄',
  sword: '⚔',
  class: '✦',
  map:   '🗺',
  lock:  '🔒',
}

export function ChoiceList({ choices, gameState, onPick, disabled = false }: Props) {
  return (
    <ol className={styles.list} role="list">
      {choices.map((choice, idx) => {
        const available = isChoiceAvailable(choice, gameState)
        const isDisabled = disabled || !available

        return (
          <li key={choice.id} className={styles.item}>
            <button
              className={`${styles.choice} ${isDisabled ? styles.disabled : ''}`}
              onClick={() => !isDisabled && onPick(choice)}
              disabled={isDisabled}
              aria-keyshortcuts={`${idx + 1}`}
              title={isDisabled ? (choice.disabledTooltip ?? 'Não disponível') : undefined}
            >
              <span className={styles.number}>{idx + 1}</span>
              <span className={styles.label}>{choice.label}</span>
              {choice.icon && (
                <span className={styles.icon} aria-hidden>{ICONS[choice.icon]}</span>
              )}
              {choice.skillCheck && (
                <span className={styles.badge} title={`Teste: ${choice.skillCheck.skill} CD ${choice.skillCheck.difficulty}`}>
                  ⚄ CD{choice.skillCheck.difficulty}
                </span>
              )}
              {choice.combat && (
                <span className={styles.badge} aria-label="Combate">⚔</span>
              )}
              {choice.classRequirement && (
                <span className={styles.classBadge} aria-label="Exclusivo de classe">✦</span>
              )}
            </button>
          </li>
        )
      })}
    </ol>
  )
}
