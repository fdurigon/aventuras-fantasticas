import type { Location } from '@/types'

export const LOCATIONS: Location[] = [
  {
    id: 'pedragar',
    name: 'Vila de Pedragar',
    description: 'Vila inicial do herói. Ponto de partida da aventura. Não há retorno após a partida.',
    imageMarker: 'pin_village',
    visitedFlag: 'visitou_pedragar',
  },
  {
    id: 'estrada',
    name: 'Estradas de Aenor',
    description: 'Hub do mapa entre os grandes destinos. As estradas conectam tudo — e nada.',
    imageMarker: 'pin_road',
    visitedFlag: 'visitou_estrada',
  },
  {
    id: 'mirthwood',
    name: 'Floresta de Mirthwood',
    description: 'Floresta antiga e sagrada aos druidas. Abriga o Fragmento da Vida.',
    imageMarker: 'pin_forest',
    unlockFlag: 'mapa_destravado',
    visitedFlag: 'visitou_mirthwood',
  },
  {
    id: 'bramford',
    name: 'Cidade Mercante de Bramford',
    description: 'Cidade comercial em decadência. Dividida entre a Guarda e a Guilda. Abriga o Fragmento da Mente.',
    imageMarker: 'pin_city',
    unlockFlag: 'mapa_destravado',
    visitedFlag: 'visitou_bramford',
  },
  {
    id: 'karn_tuhl',
    name: 'Ruínas de Karn-Tuhl',
    description: 'Cidade-fortaleza anã abandonada nas montanhas. Abriga o Fragmento do Corpo.',
    imageMarker: 'pin_ruins',
    unlockFlag: 'mapa_destravado',
    visitedFlag: 'visitou_karn_tuhl',
  },
  {
    id: 'cidadela_sombras',
    name: 'Cidadela das Sombras',
    description: 'O covil de Vorthun. Destrancada apenas com a Égide de Solgar completa.',
    imageMarker: 'pin_citadel',
    unlockFlag: 'egide_forjada',
    visitedFlag: 'visitou_cidadela',
  },
]

export const LOCATION_MAP = new Map(LOCATIONS.map(l => [l.id, l]))

export function getLocation(id: string): Location | undefined {
  return LOCATION_MAP.get(id as import('@/types').LocationId)
}
