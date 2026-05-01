import type { Power } from '@/types'

export const POWERS: Power[] = [
  // ── Mago ────────────────────────────────────────────────────
  {
    id: 'bola_de_fogo',
    classId: 'mago',
    name: 'Bola de Fogo',
    description: 'Uma esfera de fogo concentrada que explode no alvo.',
    role: 'high_damage',
    attackModifier: 0,
    damage: { count: 1, faces: 6, bonus: 3 },
    effect: null,
    selfPenalty: { stat: 'habilidade', amount: 1, duration: 1 },
    flavorText: 'O calor sai dos dedos antes do controle.',
    usesPerCombat: undefined,
  },
  {
    id: 'raio_arcano',
    classId: 'mago',
    name: 'Raio Arcano',
    description: 'Um raio de energia pura, consistente e controlado.',
    role: 'consistent',
    attackModifier: 1,
    damage: { count: 1, faces: 4, bonus: 2 },
    effect: null,
    selfPenalty: null,
    flavorText: 'Luz azul-branca que corta o ar sem palavras.',
  },
  {
    id: 'escudo_mistico',
    classId: 'mago',
    name: 'Escudo Místico',
    description: 'Um escudo de energia que absorve o próximo golpe.',
    role: 'utility',
    attackModifier: 0,
    damage: null,
    effect: { type: 'shield', value: 4, duration: 1 },
    selfPenalty: null,
    flavorText: 'Uma barreira translúcida se forma ao redor do corpo.',
  },

  // ── Ladina ──────────────────────────────────────────────────
  {
    id: 'apunhalar_sombras',
    classId: 'ladino',
    name: 'Apunhalar nas Sombras',
    description: 'Golpe surpresa que só pode ser usado uma vez por combate.',
    role: 'high_damage',
    attackModifier: 2,
    damage: { count: 2, faces: 4, bonus: 0 },
    effect: null,
    selfPenalty: null,
    flavorText: 'Rápido demais para ser visto, pesado demais para ser ignorado.',
    usesPerCombat: 1,
  },
  {
    id: 'estocada_rapida',
    classId: 'ladino',
    name: 'Estocada Rápida',
    description: 'Ataque veloz e confiável com as adagas.',
    role: 'consistent',
    attackModifier: 0,
    damage: { count: 1, faces: 4, bonus: 2 },
    effect: null,
    selfPenalty: null,
    flavorText: 'Duas lâminas, um movimento.',
  },
  {
    id: 'truque_fumaca',
    classId: 'ladino',
    name: 'Truque de Fumaça',
    description: 'Pó de fumaça que faz o próximo ataque inimigo errar automaticamente.',
    role: 'utility',
    attackModifier: 0,
    damage: null,
    effect: { type: 'evade', value: 1, duration: 1 },
    selfPenalty: null,
    flavorText: 'A fumaça engole o espaço entre os dois.',
  },

  // ── Bárbaro ─────────────────────────────────────────────────
  {
    id: 'golpe_devastador',
    classId: 'barbaro',
    name: 'Golpe Devastador',
    description: 'Golpe de machado com força máxima — deixa o bárbaro exposto.',
    role: 'high_damage',
    attackModifier: 0,
    damage: { count: 1, faces: 8, bonus: 1 },
    effect: null,
    selfPenalty: { stat: 'habilidade', amount: 1, duration: 1 },
    flavorText: 'O machado fala mais alto que qualquer palavra.',
  },
  {
    id: 'investida',
    classId: 'barbaro',
    name: 'Investida',
    description: 'Ataque direto e contundente. Mais poderoso quando ferido.',
    role: 'consistent',
    attackModifier: 1,
    damage: { count: 1, faces: 6, bonus: 1 },
    effect: null,
    selfPenalty: null,
    flavorText: 'O sofrimento vira combustível.',
  },
  {
    id: 'furia_ancestral',
    classId: 'barbaro',
    name: 'Fúria Ancestral',
    description: '+1 Habilidade e -1 dano recebido por 3 rounds. Uma vez por combate.',
    role: 'utility',
    attackModifier: 0,
    damage: null,
    effect: { type: 'rage', value: 1, duration: 3 },
    selfPenalty: null,
    flavorText: 'Os ancestrais olham. E aprovam.',
    usesPerCombat: 1,
  },
]

export const POWER_MAP = new Map(POWERS.map(p => [p.id, p]))

export function getPower(id: string): Power | undefined {
  return POWER_MAP.get(id)
}

export function getPowersByClass(classId: string): Power[] {
  return POWERS.filter(p => p.classId === classId)
}
