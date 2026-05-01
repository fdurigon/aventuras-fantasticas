import type { Achievement } from '@/types'

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_blood', name: 'Primeira Lâmina', description: 'Vença seu primeiro combate.', hidden: false },
  { id: 'pacifist_streak', name: 'Voz Antes da Lâmina', description: 'Resolva 5 conflitos sem combate.', hidden: false },
  { id: 'lucky_seven', name: 'Sete Vidas', description: 'Use Sorte 7 vezes em uma run.', hidden: false },
  { id: 'wise_choice', name: 'Decisão Sábia', description: 'Salve Mestre Arvendel no Ato 3.', hidden: true },
  { id: 'dark_pact', name: 'Pacto Sombrio', description: 'Aceite a oferta de Vorthun.', hidden: true },
  { id: 'complete_codex', name: 'Códex Completo', description: 'Derrote todos os inimigos do bestiário em uma run.', hidden: true },
  { id: 'all_fragments', name: 'Égide Restaurada', description: 'Reúna os 3 fragmentos.', hidden: false },
  { id: 'heroic_ending', name: 'Luz Vencedora', description: 'Termine no final Heroico.', hidden: false },
  { id: 'dark_ending', name: 'Coroa Negra', description: 'Termine no final Sombrio.', hidden: true },
  { id: 'sacrifice_ending', name: 'Maior Amor', description: 'Termine no final do Sacrifício.', hidden: true },
  { id: 'tragic_ending', name: 'Sombras Errantes', description: 'Termine no final Trágico.', hidden: true },
  { id: 'all_classes', name: 'Trindade', description: 'Termine o jogo com cada classe.', hidden: false },
  { id: 'no_damage_act1', name: 'Inabalável', description: 'Termine o Ato 1 sem perder Energia.', hidden: true },
]

export const ACHIEVEMENT_MAP = new Map(ACHIEVEMENTS.map(a => [a.id, a]))
