import type { Ending } from '@/types'

export const ENDINGS: Ending[] = [
  {
    id: 'ending_heroic',
    name: 'Luz Vencedora',
    type: 'heroic',
    imageId: 'scenes/ending_heroic.png',
    text: `Você sai da Cidadela enquanto ela ainda cai. Os escombros não te alcançam. A Égide, na sua palma, devolve a luz para o céu rachado, e o céu se costura sozinho — devagar, mas se costura. Quando você chega ao alto do desfiladeiro, o sol está nascendo pela primeira vez em três dias.

Aenor não saberá os detalhes. Aenor saberá apenas que respira. As pessoas voltam a comer fora de casa. Os sinos voltam a bater a hora certa. O Mestre Arvendel — se sobreviveu — vai reescrever a profecia para incluir o nome verdadeiro daquele que a cumpriu. Em outro lugar, nas tribos do norte, alguém canta sua canção. Em outro lugar, na cidade, uma criança aprende a deletrear seu nome.

Você terminou.`,
    conditions: 'Vencer Vorthun em combate. Reputação ≥ +5.',
  },
  {
    id: 'ending_dark',
    name: 'Coroa Negra',
    type: 'dark',
    imageId: 'scenes/ending_dark.png',
    text: `A Cidadela não cai. Você cuida disso. Os doze braseiros se acendem todos sob o seu comando — não são doze; são mais agora; são quantos você quiser. Vorthun te ensinou bastante antes de ir, e o que ele não ensinou, a Coroa Negra ensina sozinha.

Aenor entra em uma paz nova. Mais profunda. Mais quieta. Não há mais Sombras Errantes nas estradas — você é o que come Sombras Errantes agora. Mestre Arvendel não escreveu uma única palavra sobre você nos arquivos. Não foi por medo. Foi porque ele desapareceu antes de poder escrever.

No alto da torre mais alta da Cidadela, um trono novo. Você senta. A coroa pesa. Pesa mas pesa de modo que você ouve. E continua sentado.`,
    conditions: 'Aceitar o pacto sombrio com Vorthun. Reputação ≤ -3.',
  },
  {
    id: 'ending_sacrifice',
    name: 'Maior Amor',
    type: 'sacrifice',
    imageId: 'scenes/ending_sacrifice.png',
    text: `A luz das três janelas da Égide cresce até virar uma só. Você e Vorthun ficam dentro dela. Ele te olha. Você olha. Em algum momento entre as duas batidas finais do seu coração, vocês são a mesma pessoa por um instante. Em seguida, vocês são ninguém.

Aenor amanhece sem você. Sem ele. As Sombras Errantes evaporam onde estiverem, todas, no mesmo segundo. As estradas voltam a ser estradas. Os pescadores de Bramford recolhem redes. A Floresta de Mirthwood respira. Karn-Tuhl dorme.

Anos depois, em uma feira do porto de Bramford, uma criança aponta para uma placa de bronze nova encaixada na parede do Templo do Saber. A placa não tem nome. Tem apenas a forma de três cristais entrelaçados. A mãe da criança não sabe explicar quem foi. Sabe explicar apenas que foi alguém. E que foi suficiente.`,
    conditions: 'Reputação ≥ +3 e flag aceitouSacrificio = true.',
  },
  {
    id: 'ending_tragic',
    name: 'Sombras Errantes',
    type: 'tragic',
    imageId: 'scenes/ending_tragic.png',
    text: `Você vence. Vorthun cai. A Cidadela cai. O céu se costura — em parte. Há um rasgo no leste que não fecha. Pequeno. Quase imperceptível.

Aenor sobrevive. Aenor sobrevive descontado. As estradas têm menos pessoas porque há menos pessoas. A Floresta de Mirthwood respira mais devagar do que respirava antes. Bramford reconstrói o que perdeu, mas não tudo. Karn-Tuhl segue dormindo, e talvez agora não acorde mais.

Em algum lugar muito distante, atrás do rasgo no leste, uma das vozes que estavam na voz de Vorthun arruma a garganta. Aprende a falar sozinha. Vai demorar. Mas vai aprender.

Você termina sentado num campo vazio, com a Égide quebrada no colo. O que você venceu foi o suficiente para hoje. Não para sempre. Você sabe disso. Você se levanta mesmo assim.`,
    conditions: 'Qualquer outro caminho até o final.',
  },
]

export const ENDING_MAP = new Map(ENDINGS.map(e => [e.id, e]))
