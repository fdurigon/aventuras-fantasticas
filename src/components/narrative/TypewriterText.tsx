import { useState, useEffect, useRef, useCallback } from 'react'
import styles from './TypewriterText.module.css'

interface Props {
  text: string
  speedMs?: number
  onComplete?: () => void
}

export function TypewriterText({ text, speedMs = 20, onComplete }: Props) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const skip = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setDisplayed(text)
    setDone(true)
    onComplete?.()
  }, [text, onComplete])

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    indexRef.current = 0

    timerRef.current = setInterval(() => {
      indexRef.current++
      setDisplayed(text.slice(0, indexRef.current))
      if (indexRef.current >= text.length) {
        clearInterval(timerRef.current!)
        setDone(true)
        onComplete?.()
      }
    }, speedMs)

    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [text, speedMs, onComplete])

  const paragraphs = displayed.split('\n\n')

  return (
    <div
      className={styles.root}
      role="text"
      aria-live="polite"
      onClick={!done ? skip : undefined}
      onKeyDown={e => { if ((e.key === ' ' || e.key === 'Enter') && !done) skip() }}
      tabIndex={!done ? 0 : undefined}
      aria-label={done ? text : 'Texto carregando...'}
    >
      {paragraphs.map((p, i) => (
        <p key={i} className={styles.paragraph}>{p}</p>
      ))}
      {!done && <span className={styles.cursor} aria-hidden>▌</span>}
    </div>
  )
}
