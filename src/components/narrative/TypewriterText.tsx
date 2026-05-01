import { useEffect } from 'react'
import styles from './TypewriterText.module.css'

interface Props {
  text: string
  speedMs?: number
  onComplete?: () => void
}

export function TypewriterText({ text, onComplete }: Props) {
  useEffect(() => {
    onComplete?.()
  }, [text, onComplete])

  const paragraphs = text.split('\n\n')

  return (
    <div className={styles.root} role="text" aria-live="polite">
      {paragraphs.map((p, i) => (
        <p key={i} className={styles.paragraph}>{p}</p>
      ))}
    </div>
  )
}
