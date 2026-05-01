import type { NarrativeNode } from '../../types'

export const ACT1_NODES: NarrativeNode[] = [
  // ─────────────────────────────────────────────
  // a1_pedragar_01 — Abertura
  // ─────────────────────────────────────────────
  {
    id: 'a1_pedragar_01',
    locationId: 'pedragar',
    title: 'Abertura',
    imageId: 'scenes/cena_abertura.png',
    text: 'A vila de Pedragar existe há mais de dois séculos nesse dobramento de colina. Hoje à tarde ela é um pano de fundo para o momento em que tudo mudou.',
    classVariants: {
      mago: 'O cheiro de incenso e poeira de livro envolve sua pequena oficina nos fundos da casa do Mestre Arvendel. Você acabou de fechar o terceiro volume do Códex de Iluminação, e o cajado quebrado de Vesperia repousa contra a parede como sempre — em silêncio, mas pesando mais a cada noite. Lá fora, o sino da vila bate pela quinta hora da tarde quando você ouve o grito.',
      ladino: 'Você terminou de afiar a esquerda. A direita já espera no cinto. Há duas semanas você se esconde em Pedragar — vila pequena, longe de Bramford, longe da Guilda. Por enquanto, ninguém da Adaga Quieta sabe que você está aqui. Por enquanto. Você guarda as adagas e está prestes a se levantar quando ouve o primeiro grito.',
      barbaro: 'O sol baixa sobre as palhas de Pedragar, e seu machado totêmico ainda pinga a graxa da limpeza. Trabalho honesto: cortar lenha por cama e jantar. Dois invernos longe de casa, e ainda nenhum sinal de que o exílio vá acabar. Você levanta para guardar a ferramenta quando ouve o grito — agudo, pequeno, como criança.',
    },
    choices: [
      {
        id: 'a1_01_correr',
        label: 'Correr para o grito.',
        outcome: { nextNodeId: 'a1_pedragar_02' },
      },
      {
        id: 'a1_01_item',
        label: 'Pegar o item-chave antes.',
        outcome: {
          nextNodeId: 'a1_pedragar_03',
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a1_pedragar_02 — Praça em chamas
  // ─────────────────────────────────────────────
  {
    id: 'a1_pedragar_02',
    locationId: 'pedragar',
    title: 'Praça em Chamas',
    text: 'A praça de Pedragar está em caos. Aldeões fogem em todas as direções, derrubando bancos e cestas. No centro, duas formas de sombra pura ondulam sobre os paralelepípedos — Sombras Errantes, pequenas mas famintas, investindo contra quem não correu a tempo. Uma delas te avista. Não vai esperar convite.',
    choices: [
      {
        id: 'a1_02_combate',
        label: 'Enfrentar a Sombra Errante.',
        combat: {
          enemyId: 'sombra_errante',
          victoryOutcome: {
            nextNodeId: 'a1_pedragar_05',
            narrationOverride: 'A sombra se desfaz em fumaça fria. A segunda recua para os bosques. De algum canto da praça, uma voz fraca alcança você: "Aqui... aqui..."',
          },
        },
        outcome: { nextNodeId: 'a1_pedragar_05' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a1_pedragar_03 — Pegar item antes
  // ─────────────────────────────────────────────
  {
    id: 'a1_pedragar_03',
    locationId: 'pedragar',
    title: 'Um Momento de Precaução',
    text: 'Você para. Dois segundos. Pega o seu item-chave e o coloca no lugar certo. Quando você chega à praça, há sangue no paralelepípedo, mas você está pronto.',
    onEnter: [
      { kind: 'setFlag', key: 'levou_item_chave', value: true },
    ],
    choices: [
      {
        id: 'a1_03_praca',
        label: 'Ir para a praça.',
        outcome: { nextNodeId: 'a1_pedragar_02' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a1_pedragar_05 — Mestre Arvendel ferido
  // ─────────────────────────────────────────────
  {
    id: 'a1_pedragar_05',
    locationId: 'pedragar',
    title: 'Mestre Arvendel Ferido',
    imageId: 'scenes/arvendel.png',
    text: 'Você segue a voz até o fundo da ruela lateral da praça. Arvendel está encostado numa parede de pedra, os dedos apertando o lado esquerdo das costelas. A túnica está escura de vermelho. Os olhos são vivos, urgentes. Ele te reconhece antes que você diga uma palavra.\n\n— Você — ele murmura. — Sabia que seria você. Sente-se. Ou fique em pé. Não temos tempo para preferências.',
    choices: [
      {
        id: 'a1_05_ouvir',
        label: 'Ouvir a profecia toda.',
        outcome: { nextNodeId: 'a1_pedragar_06' },
      },
      {
        id: 'a1_05_cuidar',
        label: 'Cuidar do ferimento primeiro.',
        outcome: {
          nextNodeId: 'a1_pedragar_06b',
          effects: [{ kind: 'reputation', amount: 1 }],
        },
      },
      {
        id: 'a1_05_investigar',
        label: 'Examinar a ferida para entender o que causou.',
        icon: 'dice',
        skillCheck: {
          skill: 'investigar',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a1_pedragar_06',
            effects: [{ kind: 'setFlag', key: 'arvendel_traido', value: true }],
            narrationOverride: 'A ferida não é de Sombra Errante. O corte é limpo, preciso — faca, não garra. Alguém em Pedragar atacou Arvendel esta noite. Você guarda esse pensamento no fundo da mente e ouve o que ele tem a dizer.',
          },
          failureOutcome: {
            nextNodeId: 'a1_pedragar_06',
            narrationOverride: 'A luz é ruim demais. Você não consegue determinar o que causou o ferimento. Arvendel te puxa pelo pulso.',
          },
        },
        outcome: { nextNodeId: 'a1_pedragar_06' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a1_pedragar_06 — A Profecia
  // ─────────────────────────────────────────────
  {
    id: 'a1_pedragar_06',
    locationId: 'pedragar',
    title: 'A Profecia',
    text: 'Arvendel fala depressa, as palavras tropeçando umas nas outras. Narra a história dos fragmentos — três pedaços de um amuleto chamado Égide de Solgar, espalhados pelo reino na noite do banimento de Vorthun, o Sombrio Coroado, cinco séculos atrás. Narra que o lich não foi destruído. Narra os três locais onde os fragmentos dormem: Mirthwood, Bramford, Karn-Tuhl.\n\n— Apenas alguém marcado pela Sombra mas não dominado pode reunir os três — ele diz, e a voz treme na última palavra. — Olhe para o que perdeu esta noite. Olhe para por que ainda está em pé.\n\nEle estende o Mapa da Égide. Sua mão fecha em torno do seu pulso. E então se afrouxa. Arvendel desmaia — respiração, mas leve demais.',
    onEnter: [
      { kind: 'addKeyItem', keyItemId: 'mapa_egide' },
      { kind: 'setFlag', key: 'arvendel_grave', value: true },
    ],
    choices: [
      {
        id: 'a1_06_seguir',
        label: 'Continuar.',
        outcome: { nextNodeId: 'a1_pedragar_07' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a1_pedragar_06b — Cuidar Antes
  // ─────────────────────────────────────────────
  {
    id: 'a1_pedragar_06b',
    locationId: 'pedragar',
    title: 'Cuidar Antes',
    text: 'Você rasga uma tira de manga, estanca o sangramento, força um gole d\'água entre os lábios de Arvendel. Ele resiste por instinto, depois cede. A respiração dele se aprofunda um pouco.\n\nSó então ele começa a falar — e a profecia sai mais completa, com nomes e runas que não diria sob dor. Quando termina, está exausto mas estável. Tira do pescoço um amuleto de bronze com três janelas vazias.\n\n— Era do meu mestre. Agora é seu. Vai precisar mais do que eu.\n\nEle entrega o Mapa da Égide e fecha os olhos. Desta vez, o peito sobe e desce firme.',
    onEnter: [
      { kind: 'addKeyItem', keyItemId: 'mapa_egide' },
      { kind: 'addItem', itemId: 'amuleto_arvendel', quantity: 1 },
      { kind: 'setFlag', key: 'arvendel_estavel', value: true },
      { kind: 'reputation', amount: 1 },
    ],
    choices: [
      {
        id: 'a1_06b_seguir',
        label: 'Continuar.',
        outcome: { nextNodeId: 'a1_pedragar_07' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a1_pedragar_07 — Suprimentos
  // ─────────────────────────────────────────────
  {
    id: 'a1_pedragar_07',
    locationId: 'pedragar',
    title: 'Antes de Partir',
    text: 'A vila tem mais sussurros do que pessoas. Os que ficaram não falam contigo, mas seguem-no com os olhos enquanto você caminha entre as casas. Antes de partir, há tempo para passar em dois lugares. Não três. Você sabe isso sem ninguém dizer.',
    choices: [
      {
        id: 'a1_07_ferreiro',
        label: 'Casa do ferreiro.',
        flagRequirement: { key: '_07_ferreiro_visitado', equals: true },
        disabled: true,
        disabledTooltip: 'Já visitado.',
        outcome: { nextNodeId: 'a1_pedragar_07_ferreiro' },
      },
      {
        id: 'a1_07_ferreiro_open',
        label: 'Casa do ferreiro.',
        flagRequirement: { key: '_07_ferreiro_visitado', exists: false },
        outcome: { nextNodeId: 'a1_pedragar_07_ferreiro' },
      },
      {
        id: 'a1_07_mercado',
        label: 'Mercado da vila.',
        flagRequirement: { key: '_07_mercado_visitado', equals: true },
        disabled: true,
        disabledTooltip: 'Já visitado.',
        outcome: { nextNodeId: 'a1_pedragar_07_mercado' },
      },
      {
        id: 'a1_07_mercado_open',
        label: 'Mercado da vila.',
        flagRequirement: { key: '_07_mercado_visitado', exists: false },
        outcome: { nextNodeId: 'a1_pedragar_07_mercado' },
      },
      {
        id: 'a1_07_capela',
        label: 'Capela de Pedragar.',
        flagRequirement: { key: '_07_capela_visitado', equals: true },
        disabled: true,
        disabledTooltip: 'Já visitado.',
        outcome: { nextNodeId: 'a1_pedragar_07_capela' },
      },
      {
        id: 'a1_07_capela_open',
        label: 'Capela de Pedragar.',
        flagRequirement: { key: '_07_capela_visitado', exists: false },
        outcome: { nextNodeId: 'a1_pedragar_07_capela' },
      },
      {
        id: 'a1_07_arvendel_open',
        label: 'Casa do Mestre Arvendel.',
        flagRequirement: { key: '_07_arvendel_visitado', exists: false },
        outcome: { nextNodeId: 'a1_pedragar_07_arvendel' },
      },
      {
        id: 'a1_07_arvendel',
        label: 'Casa do Mestre Arvendel.',
        flagRequirement: { key: '_07_arvendel_visitado', equals: true },
        disabled: true,
        disabledTooltip: 'Já visitado.',
        outcome: { nextNodeId: 'a1_pedragar_07_arvendel' },
      },
      {
        id: 'a1_07_partir',
        label: 'Partir agora.',
        outcome: { nextNodeId: 'a1_pedragar_08' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a1_pedragar_07_ferreiro
  // ─────────────────────────────────────────────
  {
    id: 'a1_pedragar_07_ferreiro',
    locationId: 'pedragar',
    title: 'Casa do Ferreiro',
    text: 'O ferreiro é gordo e silencioso. Tem brasa apagada na forja e olho vivo no balcão. Empurra para você três coisas que sobraram da última encomenda nunca paga.',
    onEnter: [
      { kind: 'setFlag', key: '_07_ferreiro_visitado', value: true },
      { kind: 'incrementFlag', key: 'pedragar_visitas', by: 1 },
    ],
    isMerchant: true,
    choices: [
      {
        id: 'a1_ferreiro_despedir',
        label: 'Despedir-se.',
        outcome: { nextNodeId: 'a1_pedragar_07' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a1_pedragar_07_mercado
  // ─────────────────────────────────────────────
  {
    id: 'a1_pedragar_07_mercado',
    locationId: 'pedragar',
    title: 'Mercado da Vila',
    text: 'A última barraca aberta vende ervas e duas coisas a mais. A vendedora não pergunta para onde você vai; só empacota o que você aponta.',
    onEnter: [
      { kind: 'setFlag', key: '_07_mercado_visitado', value: true },
      { kind: 'incrementFlag', key: 'pedragar_visitas', by: 1 },
    ],
    isMerchant: true,
    choices: [
      {
        id: 'a1_mercado_despedir',
        label: 'Despedir-se.',
        outcome: { nextNodeId: 'a1_pedragar_07' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a1_pedragar_07_capela — Respiro do Ato 1
  // ─────────────────────────────────────────────
  {
    id: 'a1_pedragar_07_capela',
    locationId: 'pedragar',
    title: 'A Capela de Pedragar',
    text: 'A Capela é a casa mais alta da vila. Quem ainda reza está rezando agora. Você senta. A pedra do banco é fria, mas o silêncio é morno. Por um instante, é possível esquecer tudo o que está esperando do outro lado da porta. Você fecha os olhos. Quando os abre, a vela que estava no meio terminou — e a próxima já começou.',
    onEnter: [
      { kind: 'setFlag', key: '_07_capela_visitado', value: true },
      { kind: 'incrementFlag', key: 'pedragar_visitas', by: 1 },
    ],
    choices: [
      {
        id: 'a1_capela_descansar',
        label: 'Descansar e rezar.',
        flagRequirement: { key: 'respiro_ato1_usado', exists: false },
        outcome: {
          nextNodeId: 'a1_pedragar_07',
          effects: [
            { kind: 'restoreRespiro', type: 'both' },
            { kind: 'addSorteMax', amount: 1 },
            { kind: 'setFlag', key: 'respiro_ato1_usado', value: true },
          ],
        },
      },
      {
        id: 'a1_capela_descansar_usado',
        label: 'Descansar e rezar.',
        flagRequirement: { key: 'respiro_ato1_usado', equals: true },
        disabled: true,
        disabledTooltip: 'Você já usou o Respiro deste ato.',
        outcome: { nextNodeId: 'a1_pedragar_07' },
      },
      {
        id: 'a1_capela_vela',
        label: 'Apenas acender uma vela e sair.',
        outcome: {
          nextNodeId: 'a1_pedragar_07',
          effects: [{ kind: 'reputation', amount: 1 }],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a1_pedragar_07_arvendel
  // ─────────────────────────────────────────────
  {
    id: 'a1_pedragar_07_arvendel',
    locationId: 'pedragar',
    title: 'Casa do Mestre Arvendel',
    text: 'A casa de Arvendel está em silêncio que pesa. Se ele está vivo, está dormindo no quarto dos fundos. Você passa pela escrivaninha, pelos livros que ele organizava de modo que só ele entendia. Há um descanso aqui que outras casas da vila não têm.',
    onEnter: [
      { kind: 'setFlag', key: '_07_arvendel_visitado', value: true },
      { kind: 'incrementFlag', key: 'pedragar_visitas', by: 1 },
    ],
    choices: [
      {
        id: 'a1_arvendel_dormir',
        label: 'Descansar até pela manhã.',
        outcome: {
          nextNodeId: 'a1_pedragar_07',
          effects: [{ kind: 'restoreRespiro', type: 'energia' }],
        },
      },
      {
        id: 'a1_arvendel_ver',
        label: 'Ver Arvendel uma última vez.',
        flagRequirement: { key: 'arvendel_estavel', equals: true },
        outcome: {
          nextNodeId: 'a1_pedragar_07',
          effects: [
            { kind: 'reputation', amount: 1 },
            { kind: 'addItem', itemId: 'pocao_sorte', quantity: 1 },
          ],
        },
      },
      {
        id: 'a1_arvendel_sair',
        label: 'Sair sem mexer em nada.',
        outcome: {
          nextNodeId: 'a1_pedragar_07',
          effects: [{ kind: 'reputation', amount: 1 }],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a1_pedragar_08 — Encruzilhada / WorldMap
  // ─────────────────────────────────────────────
  {
    id: 'a1_pedragar_08',
    locationId: 'estrada',
    title: 'A Encruzilhada',
    imageId: 'map.png',
    text: 'Você sai de Pedragar ao amanhecer. A estrada se divide diante de você. O Mapa da Égide brilha levemente na sua bolsa. Três caminhos. Três fragmentos. Escolha onde começar.',
    onEnter: [
      { kind: 'setFlag', key: 'mapa_destravado', value: true },
    ],
    isMap: true,
    choices: [
      {
        id: 'a1_08_mirthwood',
        label: 'Floresta de Mirthwood.',
        icon: 'map',
        outcome: { nextNodeId: 'a2_mirthwood_01' },
      },
      {
        id: 'a1_08_bramford',
        label: 'Cidade de Bramford.',
        icon: 'map',
        outcome: { nextNodeId: 'a2_bramford_01' },
      },
      {
        id: 'a1_08_karn',
        label: 'Ruínas de Karn-Tuhl.',
        icon: 'map',
        outcome: { nextNodeId: 'a2_karn_01' },
      },
    ],
  },
]
