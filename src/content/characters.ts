import type { CharacterClass } from '@/types'
import { registerClassSkillBonuses } from '@/engine/skillCheck'

export const CHARACTERS: CharacterClass[] = [
  {
    id: 'mago',
    name: 'Eldwin Vethrys',
    title: 'O Aprendiz Esquecido',
    backstory:
      'Aprendiz da Torre de Vesperia, dedicada à magia arcana protetora. Quando a Torre foi consumida pelas Sombras Errantes, Eldwin foi o único sobrevivente — salvo por um ritual incompleto que custou a vida do mestre. Carrega o cajado quebrado do mestre como lembrança e fardo. Acredita que o conhecimento vence o medo, mas seu corpo franzino paga o preço da escolha de estudar em vez de treinar.',
    portraitImage: '/images/characters/mago.webp',
    baseStats: { habilidade: 7, energia: 14, sorte: 11 },
    skillBonuses: {
      arcano: 2,
      investigar: 1,
      persuadir: 1,
      atletismo: -1,
      furtividade: -1,
      intimidar: 0,
      trapaca: 0,
      resistirMagia: 1,
    },
    startingPowers: ['bola_de_fogo', 'raio_arcano', 'escudo_mistico'],
    startingItems: ['pocao_cura_menor', 'pocao_cura_menor'],
    startingKeyItems: ['cajado_vesperia'],
    startingGold: 30,
  },
  {
    id: 'ladino',
    name: 'Sira Crowfoot',
    title: 'A Adaga de Duas Faces',
    backstory:
      'Cresceu nos becos de Bramford depois que sua família foi acusada injustamente de heresia. Aprendeu cedo que a verdade é só a história mais bem contada. Trabalhou com a Guilda da Adaga Quieta até descobrir que o mestre da Guilda também serve às Sombras — desde então, foge dele tanto quanto persegue uma chance de redenção. Carrega adagas gêmeas que pertenciam ao pai.',
    portraitImage: '/images/characters/ladino.webp',
    baseStats: { habilidade: 8, energia: 16, sorte: 12 },
    skillBonuses: {
      furtividade: 2,
      trapaca: 2,
      investigar: 1,
      intimidar: -1,
      atletismo: 0,
      arcano: 0,
      persuadir: 0,
      resistirMagia: -1,
    },
    startingPowers: ['apunhalar_sombras', 'estocada_rapida', 'truque_fumaca'],
    startingItems: ['po_cegueira'],
    startingKeyItems: ['adagas_pai', 'gazua'],
    startingGold: 50,
  },
  {
    id: 'barbaro',
    name: 'Thorgar Mãodepedra',
    title: 'O Exilado do Norte',
    backstory:
      'Filho de chefe da tribo Korrundir, das estepes geladas do Norte. Foi exilado depois de recusar matar um irmão de sangue por uma ordem que considerou injusta. Vagueia o sul há dois invernos, lutando como mercenário, sempre carregando o machado totêmico do clã — e a culpa de não ter dito sim. Acredita que algumas batalhas exigem mais que força, mas ainda não descobriu quais.',
    portraitImage: '/images/characters/barbaro.webp',
    baseStats: { habilidade: 10, energia: 22, sorte: 7 },
    skillBonuses: {
      atletismo: 2,
      intimidar: 2,
      resistirMagia: 1,
      arcano: -2,
      trapaca: -1,
      furtividade: -1,
      persuadir: -1,
      investigar: 0,
    },
    startingPowers: ['golpe_devastador', 'investida', 'furia_ancestral'],
    startingItems: ['carne_seca', 'carne_seca', 'carne_seca'],
    startingKeyItems: ['machado_totem', 'pele_lobo_branco'],
    startingGold: 15,
  },
]

export const CHARACTER_MAP = new Map(CHARACTERS.map(c => [c.id, c]))

export function getCharacter(id: string): CharacterClass | undefined {
  return CHARACTER_MAP.get(id as import('@/types').ClassId)
}

// Register skill bonuses into the engine at module load time
CHARACTERS.forEach(c => registerClassSkillBonuses(c.id, c.skillBonuses))
