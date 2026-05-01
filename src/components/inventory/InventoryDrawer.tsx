import type { GameState } from '@/types'
import { getItem } from '@/content/items'
import { useGameStore } from '@/store/gameStore'
import styles from './InventoryDrawer.module.css'

interface Props {
  gameState: GameState
  onClose: () => void
  onUseItem?: (itemId: string) => void
}

export function InventoryDrawer({ gameState, onClose, onUseItem }: Props) {
  const { performCombatAction } = useGameStore()
  const inCombat = gameState.combat !== null

  const handleUseItem = (itemId: string) => {
    if (inCombat) {
      performCombatAction({ type: 'item', itemId })
    } else if (onUseItem) {
      onUseItem(itemId)
    }
    onClose()
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label="Inventário" onClick={onClose}>
      <div className={styles.drawer} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Inventário</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Fechar inventário">✕</button>
        </div>

        <div className={styles.gold}>
          <span>💰</span>
          <span>{gameState.gold} peças de ouro</span>
        </div>

        {gameState.inventory.length === 0 ? (
          <p className={styles.empty}>Mochila vazia.</p>
        ) : (
          <ul className={styles.list}>
            {gameState.inventory.map(entry => {
              const item = getItem(entry.itemId)
              if (!item) return null
              const isEquipped = gameState.equippedItems.includes(entry.itemId)
              const isConsumable = item.type === 'consumable'
              return (
                <li key={entry.itemId} className={`${styles.item} ${isEquipped ? styles.equipped : ''}`}>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.name}</span>
                    {entry.quantity > 1 && <span className={styles.qty}>×{entry.quantity}</span>}
                    <span className={styles.itemDesc}>{item.description}</span>
                  </div>
                  <div className={styles.itemActions}>
                    {isEquipped && <span className={styles.equippedBadge}>Equipado</span>}
                    {isConsumable && (
                      <button
                        className={styles.useBtn}
                        onClick={() => handleUseItem(entry.itemId)}
                      >
                        Usar
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}

        {gameState.keyItems.length > 0 && (
          <div className={styles.keyItems}>
            <h4 className={styles.keyTitle}>Itens-chave</h4>
            <ul className={styles.keyList}>
              {gameState.keyItems.map(id => (
                <li key={id} className={styles.keyItem}>🔑 {id.replace(/_/g, ' ')}</li>
              ))}
            </ul>
          </div>
        )}

        <div className={styles.slots}>
          {gameState.inventory.length}/6 espaços
        </div>
      </div>
    </div>
  )
}
