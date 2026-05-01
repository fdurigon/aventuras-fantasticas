import type { Power } from '@/types'
import styles from './PowerSelector.module.css'

interface Props {
  powers: Power[]
  usedOnceFlags: string[]
  onPick: (powerId: string) => void
  disabled?: boolean
}

const ROLE_LABEL: Record<string, string> = {
  high_damage: 'Alto Dano',
  consistent:  'Consistente',
  utility:     'Utilitário',
}

export function PowerSelector({ powers, usedOnceFlags, onPick, disabled = false }: Props) {
  return (
    <div className={styles.root} role="group" aria-label="Escolha um poder">
      {powers.map(power => {
        const exhausted = power.usesPerCombat === 1 && usedOnceFlags.includes(power.id)
        const isDisabled = disabled || exhausted

        return (
          <button
            key={power.id}
            className={`${styles.power} ${isDisabled ? styles.exhausted : ''}`}
            onClick={() => !isDisabled && onPick(power.id)}
            disabled={isDisabled}
            title={power.description}
            aria-label={`${power.name}${exhausted ? ' (já usado)' : ''}`}
          >
            <span className={styles.name}>{power.name}</span>
            <span className={styles.role}>{ROLE_LABEL[power.role]}</span>
            {power.damage && (
              <span className={styles.damage}>
                {power.damage.count}d{power.damage.faces}
                {power.damage.bonus ? `+${power.damage.bonus}` : ''}
                {power.attackModifier ? ` (Atk +${power.attackModifier})` : ''}
              </span>
            )}
            {power.effect && (
              <span className={styles.effect}>{power.flavorText}</span>
            )}
            {exhausted && <span className={styles.exhaustedBadge}>Usado</span>}
            {power.selfPenalty && (
              <span className={styles.penalty} title="Penalidade após uso">-{power.selfPenalty.amount} Hab.</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
