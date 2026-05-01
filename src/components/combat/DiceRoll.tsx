import { useState, useEffect } from 'react'
import styles from './DiceRoll.module.css'

interface Props {
  d1: number
  d2: number
  bonus: number
  total: number
  targetDc?: number
  onComplete?: () => void
}

export function DiceRoll({ d1, d2, bonus, total, targetDc, onComplete }: Props) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setRevealed(false)
    const t = setTimeout(() => {
      setRevealed(true)
      onComplete?.()
    }, 900)
    return () => clearTimeout(t)
  }, [d1, d2, onComplete])

  const success = targetDc !== undefined ? total >= targetDc : undefined

  return (
    <div className={styles.root} role="status" aria-live="polite">
      <div className={styles.dice}>
        <Die value={d1} rolling={!revealed} />
        <Die value={d2} rolling={!revealed} />
      </div>
      {revealed && (
        <div className={styles.result}>
          <span className={styles.formula}>
            {d1} + {d2}{bonus !== 0 ? ` ${bonus >= 0 ? '+' : ''}${bonus}` : ''} ={' '}
            <strong className={`${styles.total} ${success === true ? styles.success : success === false ? styles.failure : ''}`}>
              {total}
            </strong>
          </span>
          {targetDc !== undefined && (
            <span className={success ? styles.successLabel : styles.failureLabel}>
              {success ? '✓ Sucesso' : '✗ Falha'} (CD {targetDc})
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function Die({ value, rolling }: { value: number; rolling: boolean }) {
  return (
    <div className={`${styles.die} ${rolling ? styles.rolling : ''}`} aria-hidden={rolling}>
      {rolling ? '?' : value}
    </div>
  )
}
