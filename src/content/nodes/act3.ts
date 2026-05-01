import type { NarrativeNode } from '../../types'

export const ACT3_NODES: NarrativeNode[] = [
  // ─────────────────────────────────────────────
  // a3_cidadela_01 ★ — Aproximação ao Vale
  // ─────────────────────────────────────────────
  {
    id: 'a3_cidadela_01',
    locationId: 'cidadela_sombras',
    title: 'Aproximação ao Vale',
    imageId: 'scenes/cidadela_exterior.webp',
    text: 'O vale onde a Cidadela das Sombras espera não tem nome no mapa. A última légua é uma descida em ziguezague, e a Égide na sua palma esquenta a cada curva, como quem reconhece um caminho que já fez antes. Acima, nuvens negras correm em sentidos opostos sobre o céu — duas correntes que não deveriam coexistir. Abaixo, a Cidadela: torres de basalto rachado, sem luzes nas janelas, mas com uma luz dentro mesmo assim, fraca, baixa, de algo que arde sem queimar.\n\nVocê para no último alto antes da ponte de pedra que liga o desfiladeiro à muralha. A ponte é estreita; do meio dela em diante, é Vorthun.',
    onEnter: [
      { kind: 'setFlag', key: 'egide_forjada', value: true },
    ],
    choices: [
      {
        id: 'a3_c01_atravessar',
        label: 'Atravessar a ponte.',
        outcome: { nextNodeId: 'a3_cidadela_02' },
      },
      {
        id: 'a3_c01_olhar',
        label: 'Olhar o vale uma última vez.',
        outcome: {
          nextNodeId: 'a3_cidadela_02',
          narrationOverride: 'Você fica um momento. As nuvens giram. Você respira. Depois atravessa.',
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a3_cidadela_02 — O Portão de Sombras
  // ─────────────────────────────────────────────
  {
    id: 'a3_cidadela_02',
    locationId: 'cidadela_sombras',
    title: 'O Portão de Sombras',
    text: 'O portão da Cidadela não tem dobradiças. É feito de sombra propriamente dita — cortinas verticais de noite parada que a Égide tenta abrir e que recusam, baixinho, como mar recusando um nadador cansado. Para passar, é preciso falar com a sombra na língua dela. Ou atravessar e pagar o preço.',
    choices: [
      {
        id: 'a3_c02_arcano',
        label: 'Falar com a sombra (Arcano).',
        icon: 'dice',
        skillCheck: {
          skill: 'arcano',
          difficulty: 11,
          allowSorte: true,
          successOutcome: {
            nextNodeId: 'a3_cidadela_03',
            narrationOverride: 'A sombra recua. O portão se abre em silêncio.',
          },
          failureOutcome: {
            nextNodeId: 'a3_cidadela_03',
            effects: [{ kind: 'energy', amount: -4 }],
            narrationOverride: 'A sombra arranca um pedaço de você ao passar. Você chega do outro lado mais leve do que devia.',
          },
        },
        outcome: { nextNodeId: 'a3_cidadela_03' },
      },
      {
        id: 'a3_c02_forca',
        label: 'Atravessar à força.',
        outcome: {
          nextNodeId: 'a3_cidadela_03',
          effects: [{ kind: 'energy', amount: -4 }],
        },
      },
      {
        id: 'a3_c02_mago_fogo',
        label: 'Usar Bola de Fogo contra a cortina.',
        classRequirement: 'mago',
        icon: 'class',
        outcome: {
          nextNodeId: 'a3_cidadela_03',
          effects: [{ kind: 'setFlag', key: 'penalidade_portao_mago', value: true }],
          narrationOverride: 'A cortina se dissolve em chamas. Você passa, mas o recuo arcano já começa.',
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a3_cidadela_03 — Pátio dos Caídos
  // ─────────────────────────────────────────────
  {
    id: 'a3_cidadela_03',
    locationId: 'cidadela_sombras',
    title: 'Pátio dos Caídos',
    text: 'Atrás do portão, o Pátio dos Caídos é largo e baixo, e o chão está coberto de armaduras. Centenas. Vazias, na primeira olhada. Não vazias, na segunda. Duas das armaduras mais próximas se levantam — alto, depois mais alto, depois alto demais — quando você chega ao centro do pátio. Os elmos selados viram-se com lentidão de quem nunca teve pressa.',
    choices: [
      {
        id: 'a3_c03_combate1',
        label: 'Enfrentar o primeiro cavaleiro.',
        combat: {
          enemyId: 'cavaleiro_sombrio',
          victoryOutcome: {
            nextNodeId: 'a3_cidadela_03b',
            narrationOverride: 'O primeiro cavaleiro cai. O segundo já está em pé.',
          },
        },
        outcome: { nextNodeId: 'a3_cidadela_03b' },
      },
    ],
  },

  // Nó intermediário — segundo cavaleiro (sem recuperação entre combates)
  {
    id: 'a3_cidadela_03b',
    locationId: 'cidadela_sombras',
    title: 'O Segundo Cavaleiro',
    text: 'Não há descanso. O segundo cavaleiro avança antes que a armadura do primeiro termine de cair.',
    choices: [
      {
        id: 'a3_c03b_combate2',
        label: 'Enfrentar o segundo cavaleiro.',
        combat: {
          enemyId: 'cavaleiro_sombrio',
          victoryOutcome: {
            nextNodeId: 'a3_cidadela_04',
            narrationOverride: 'O segundo cavaleiro cai. O pátio fica em silêncio.',
          },
        },
        outcome: { nextNodeId: 'a3_cidadela_04' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a3_cidadela_04 — Galeria dos Reflexos
  // ─────────────────────────────────────────────
  {
    id: 'a3_cidadela_04',
    locationId: 'cidadela_sombras',
    title: 'Galeria dos Reflexos',
    text: 'O corredor depois do pátio é um espelho longo de basalto polido. A primeira reflexão é a sua. A segunda, não.',
    classVariants: {
      mago: 'É o Mestre da Torre de Vesperia, vivo, em pé, lendo um livro que você reconhece. Ele ergue os olhos. Não diz nada. Sorri. Some.',
      ladino: 'É a sua mãe na cozinha da casa antiga, a janela aberta, o cheiro de pão. Ela coloca uma fatia para você na mesa. Ergue o queixo, como se tivesse acabado de ouvir uma piada. Some.',
      barbaro: 'É o seu irmão de sangue, vivo, na fogueira do clã, contando uma história que termina em risada. Ele pisca para você por sobre o ombro do contador. Some.',
    },
    choices: [
      {
        id: 'a3_c04_continuar_honrado',
        label: 'Continuar.',
        reputationRequirement: { min: 3 },
        outcome: {
          nextNodeId: 'a3_cidadela_05',
          effects: [{ kind: 'energy', amount: 4 }],
          narrationOverride: 'A Galeria reconhece um coração que ainda carrega a luz. O espelho aquece levemente.',
        },
      },
      {
        id: 'a3_c04_continuar_sombrio',
        label: 'Continuar.',
        reputationRequirement: { max: -3 },
        outcome: {
          nextNodeId: 'a3_cidadela_05',
          effects: [{ kind: 'sorte', amount: -2 }],
          narrationOverride: 'A Galeria sussurra que você sabe a verdade — eles não estão mais lá.',
        },
      },
      {
        id: 'a3_c04_continuar_neutro',
        label: 'Continuar.',
        outcome: { nextNodeId: 'a3_cidadela_05' },
      },
      {
        id: 'a3_c04_resistir',
        label: 'Tentar resistir à visão.',
        icon: 'dice',
        skillCheck: {
          skill: 'resistirMagia',
          difficulty: 11,
          allowSorte: true,
          successOutcome: {
            nextNodeId: 'a3_cidadela_05',
            effects: [
              { kind: 'setFlag', key: 'aceitouSacrificio', value: true },
              { kind: 'reputation', amount: 1 },
            ],
            narrationOverride: 'Você reconheceu a oferta como armadilha e endureceu o coração ao ponto exato em que se aceita um sacrifício final.',
          },
          failureOutcome: {
            nextNodeId: 'a3_cidadela_05',
            effects: [{ kind: 'energy', amount: -2 }],
            narrationOverride: 'A visão passa mesmo assim. Você a carrega.',
          },
        },
        outcome: { nextNodeId: 'a3_cidadela_05' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a3_cidadela_05 — Algoz de Vorthun
  // ─────────────────────────────────────────────
  {
    id: 'a3_cidadela_05',
    locationId: 'cidadela_sombras',
    title: 'O Algoz de Vorthun',
    text: 'Antes da última escada, o Algoz espera. Mais alto que dois homens. Capuz de sombra; abaixo do capuz, o que faz as vezes de cara é um fogão preto crepitante. A arma é um cutelo curvo do tamanho do seu peito. Ele não saúda. Não é educado. Apenas dá um passo para o lado para mostrar a porta do Trono — e em seguida cancela o gesto, fechando o caminho de novo. Não vai passar inteiro.',
    choices: [
      {
        id: 'a3_c05_combate',
        label: 'Enfrentar o Algoz.',
        combat: {
          enemyId: 'combat_algoz',
          victoryOutcome: {
            nextNodeId: 'a3_cidadela_06',
            effects: [
              { kind: 'addItem', itemId: 'manopla_sombria', quantity: 1 },
              { kind: 'gold', amount: 25 },
              { kind: 'unlockAchievement', achievementId: 'first_blood' },
            ],
          },
        },
        outcome: { nextNodeId: 'a3_cidadela_06' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a3_cidadela_06 ★ — Antessala (Respiro do Ato 3)
  // ─────────────────────────────────────────────
  {
    id: 'a3_cidadela_06',
    locationId: 'cidadela_sombras',
    title: 'A Antessala',
    text: 'A antessala é pequena, redonda, sem mobília exceto um banco de pedra encostado na parede. A porta seguinte — a porta para o Trono — é de bronze fundido em formato de uma única espiral que termina em ponto. Há um silêncio aqui que não é vazio: é coisa cheia de alguma coisa que já foi gente.\n\nVocê senta. Tira a Égide do peito. Olha-a por inteiro pela primeira vez desde Karn-Tuhl. As três janelas pulsam em ritmo sincronizado, como respirações. Você respira no ritmo delas e percebe que a sua respiração desacelera, baixa, fica calma. É um momento. É só um momento. Mas é um momento.',
    choices: [
      {
        id: 'a3_c06_descansar',
        label: 'Descansar até estar pronto/a.',
        flagRequirement: { key: 'respiro_ato3_usado', exists: false },
        outcome: {
          nextNodeId: 'a3_cidadela_07',
          effects: [
            { kind: 'restoreRespiro', type: 'both' },
            { kind: 'setFlag', key: 'respiro_ato3_usado', value: true },
          ],
        },
      },
      {
        id: 'a3_c06_descansar_usado',
        label: 'Descansar até estar pronto/a.',
        flagRequirement: { key: 'respiro_ato3_usado', equals: true },
        disabled: true,
        disabledTooltip: 'Você já descansou aqui.',
        outcome: { nextNodeId: 'a3_cidadela_07' },
      },
      {
        id: 'a3_c06_levantar',
        label: 'Levantar agora; não há mais tempo.',
        outcome: { nextNodeId: 'a3_cidadela_07' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a3_cidadela_07 — A Sala do Trono
  // ─────────────────────────────────────────────
  {
    id: 'a3_cidadela_07',
    locationId: 'cidadela_sombras',
    title: 'A Sala do Trono',
    imageId: 'scenes/vorthun_throne.webp',
    text: 'A Sala do Trono é grande além do que a Cidadela parecia conter. O teto se perde no escuro alto. Doze pilares pretos, um para cada século. Doze chamas verdes em braseiros altos. No centro do salão, um trono de osso e ferro. No trono, Vorthun, o Sombrio Coroado.\n\nEle não se levanta. Não acena. Apenas espera você atravessar todo o salão, devagar, e parar a três passos do trono. Quando finalmente fala, a voz não é alta. É só vasta. Há muitas vozes dentro dela.\n\n— Sente-se um momento — diz Vorthun. — Não tenho medo da Égide. Tenho curiosidade pelo que a carrega.',
    choices: [
      {
        id: 'a3_c07_continuar',
        label: 'Continuar.',
        outcome: { nextNodeId: 'a3_cidadela_08' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a3_cidadela_08 ★ — Decisão Crítica
  // ─────────────────────────────────────────────
  {
    id: 'a3_cidadela_08',
    locationId: 'cidadela_sombras',
    title: 'A Oferta de Vorthun',
    text: 'Vorthun começa a falar. Conta — sem mentira aparente, com o cansaço de quem já contou para si mesmo demais vezes — a história dele. Não a parte do mal. A parte do começo: o jovem arquimago, o medo de morrer pequeno, o pacto, a primeira camada perdida. Ele olha para você e diz, baixinho, no fim:\n\n— Você sabe como começa. Você está começando agora. Eu posso te poupar do meio. Posso te dar o poder sem o pacto. Posso te dar a vingança que você quer. Pode ser pelo Aenor, se você quiser. Pode ser por você. Pode ser nada — pode ir embora. Mas não sai daqui sem escolher. A Égide já está na sua mão. Ela escolheu primeiro.',
    choices: [
      {
        id: 'a3_c08_recusar',
        label: 'Recuso seu pacto.',
        outcome: { nextNodeId: 'a3_cidadela_09a' },
      },
      {
        id: 'a3_c08_neutro',
        label: 'Aceito seu poder, mas pelo Aenor.',
        reputationRequirement: { min: 0, max: 4 },
        outcome: { nextNodeId: 'a3_cidadela_09b' },
        disabledTooltip: 'Requer Reputação entre 0 e +4.',
      },
      {
        id: 'a3_c08_sombrio',
        label: 'Eu também quero o que você quer.',
        reputationRequirement: { max: -3 },
        outcome: { nextNodeId: 'a3_cidadela_09c' },
        disabledTooltip: 'Requer Reputação Sombria (≤ -3).',
      },
      {
        id: 'a3_c08_sacrificio',
        label: 'Eu me ofereço no seu lugar.',
        reputationRequirement: { min: 3 },
        flagRequirement: { key: 'aceitouSacrificio', equals: true },
        outcome: { nextNodeId: 'a3_cidadela_09d' },
        disabledTooltip: 'Requer Reputação Honrada (≥ +3) e o coração preparado para o sacrifício.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a3_cidadela_09a — Recusa
  // ─────────────────────────────────────────────
  {
    id: 'a3_cidadela_09a',
    locationId: 'cidadela_sombras',
    title: 'A Recusa',
    text: 'Vorthun escuta a recusa em silêncio, e por um instante longo demais para ser desprezo, parece quase aliviado. Levanta-se. A coroa fundida ao crânio capta a luz verde dos braseiros e devolve preta. O cutelo dele aparece na mão como se sempre tivesse estado lá.\n\n— Bom. Eu também não acreditei na minha própria oferta. Mostre o que aprendeu na vinda.',
    choices: [
      {
        id: 'a3_c09a_combate',
        label: 'Enfrentar Vorthun.',
        outcome: { nextNodeId: 'a3_cidadela_10' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a3_cidadela_09b — O Pacto Neutro
  // ─────────────────────────────────────────────
  {
    id: 'a3_cidadela_09b',
    locationId: 'cidadela_sombras',
    title: 'O Pacto Neutro',
    text: 'Vorthun se inclina para a frente — pela primeira vez, mexe o trono. Estende a mão coberta de luva de osso. Ela esfria a três passos de distância. Quando você toca a luva, o frio passa pelo seu braço, mira o seu peito, mira a Égide. E para.\n\n— Você acha que pode usar o poder e desfazer-me com o poder — diz, e há um sorriso pequeno na voz. — Talvez possa. Talvez não. Vamos ver.\n\nA Égide treme. O salão muda de cor. Você sente força nova entrar em você — e, com ela, uma voz pequena que ofereceu uma camada que você só agora percebe que aceitou.',
    onEnter: [
      { kind: 'setFlag', key: 'aceitou_pacto_neutro', value: true },
      { kind: 'reputation', amount: -2 },
      { kind: 'addKeyItem', keyItemId: 'selo_sombrio' },
    ],
    choices: [
      {
        id: 'a3_c09b_combate',
        label: 'Usar o poder e enfrentar Vorthun.',
        outcome: { nextNodeId: 'a3_cidadela_10' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a3_cidadela_09c — O Pacto Sombrio
  // ─────────────────────────────────────────────
  {
    id: 'a3_cidadela_09c',
    locationId: 'cidadela_sombras',
    title: 'O Pacto Sombrio',
    text: 'Vorthun não sorri. Não faz gesto algum. Apenas assente uma vez. A Égide na sua mão escurece, perde primeiro a janela do Corpo, depois a da Mente, depois a da Vida. Quando ela termina de escurecer, é uma coroa pequena. Ela sobe sozinha do seu colo até a sua testa. Encaixa.\n\nVorthun se levanta. Faz uma reverência. A reverência dele é também a saudação anã, mas sem honra. Apenas precisão.\n\n— Bem-vindo/a — diz. — Eu fico aqui mais um pouco para ensinar o que sei. Depois é com você.',
    onEnter: [
      { kind: 'removeKeyItem', keyItemId: 'egide_solgar' },
      { kind: 'addKeyItem', keyItemId: 'coroa_negra' },
      { kind: 'reputation', amount: -5 },
    ],
    choices: [
      {
        id: 'a3_c09c_final',
        label: 'Continuar.',
        outcome: { nextNodeId: 'ending_dark' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a3_cidadela_09d — O Sacrifício
  // ─────────────────────────────────────────────
  {
    id: 'a3_cidadela_09d',
    locationId: 'cidadela_sombras',
    title: 'O Sacrifício',
    text: 'Você não fala alto. Apenas pousa a Égide no chão, no meio do espaço entre você e o trono, e dá um passo à frente. Vorthun olha para a Égide. Olha para você. E pela primeira vez, em todo o tempo dele, alguma coisa parecida com o jovem que ele foi atravessa o rosto velho dele.\n\n— Você sabe o que está oferecendo — diz, baixinho. Não é pergunta.\n\nVocê assente. Pega a Égide do chão. Encosta no peito de Vorthun. Encosta no seu peito também. A luz das três janelas começa a crescer.',
    onEnter: [
      { kind: 'setFlag', key: 'escolheu_sacrificio', value: true },
    ],
    choices: [
      {
        id: 'a3_c09d_final',
        label: 'Continuar.',
        outcome: { nextNodeId: 'ending_sacrifice' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a3_cidadela_10 — Combate: Vorthun
  // ─────────────────────────────────────────────
  {
    id: 'a3_cidadela_10',
    locationId: 'cidadela_sombras',
    title: 'O Confronto Final',
    text: 'Os doze braseiros se dobram em um. O salão inteiro fica verde. Vorthun se move como quem nunca cansa.',
    choices: [
      {
        id: 'a3_c10_combate_traicao',
        label: 'Enfrentar Vorthun (traição).',
        flagRequirement: { key: 'aceitou_pacto_neutro', equals: true },
        combat: {
          enemyId: 'combat_vorthun_traicao',
          victoryOutcome: {
            nextNodeId: 'a3_cidadela_11',
          },
          modifiers: {
            playerHabilidadePenalty: -2,
          },
        },
        outcome: { nextNodeId: 'a3_cidadela_11' },
      },
      {
        id: 'a3_c10_combate',
        label: 'Enfrentar Vorthun.',
        flagRequirement: { key: 'aceitou_pacto_neutro', exists: false },
        combat: {
          enemyId: 'combat_vorthun',
          victoryOutcome: {
            nextNodeId: 'a3_cidadela_11',
          },
        },
        outcome: { nextNodeId: 'a3_cidadela_11' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a3_cidadela_11 — A Coroa Cai
  // ─────────────────────────────────────────────
  {
    id: 'a3_cidadela_11',
    locationId: 'cidadela_sombras',
    title: 'A Coroa Cai',
    text: 'Vorthun cai devagar — devagar como árvore antiga cai. A coroa fundida ao crânio se desfaz primeiro, em farelo de cinza. Em seguida, o crânio. Em seguida, a armadura, peça por peça. No fim, há apenas pó verde no chão e, por cima do pó, um único anel simples, sem inscrição. O nome verdadeiro dele, talvez. Você o pega ou deixa.\n\nA Cidadela toda começa a tremer. As nuvens lá fora se desfazem em direções opostas, mais rápidas. Você tem alguns minutos para sair antes que ela caia inteira em cima de você.',
    onEnter: [
      { kind: 'setFlag', key: 'vorthun_derrotado', value: true },
    ],
    choices: [
      // Rota heroica: reputação >= 5, sem selo sombrio
      {
        id: 'a3_c11_heroico',
        label: 'Sair da Cidadela.',
        reputationRequirement: { min: 5 },
        flagRequirement: { key: 'selo_sombrio', exists: false },
        outcome: { nextNodeId: 'ending_heroic' },
      },
      // Rota heroica alternativa: pacto neutro mas com reputação >= 3 e arvendel estável
      {
        id: 'a3_c11_heroico_alt',
        label: 'Sair da Cidadela.',
        flagRequirement: [
          { key: 'aceitou_pacto_neutro', equals: true },
          { key: 'arvendel_estavel', equals: true },
        ],
        reputationRequirement: { min: 3 },
        outcome: { nextNodeId: 'ending_heroic' },
      },
      // Rota sombria: reputação <= -3
      {
        id: 'a3_c11_sombrio',
        label: 'Sair da Cidadela.',
        reputationRequirement: { max: -3 },
        outcome: { nextNodeId: 'ending_dark' },
      },
      // Rota trágica: todos os outros casos
      {
        id: 'a3_c11_tragico',
        label: 'Sair da Cidadela.',
        outcome: { nextNodeId: 'ending_tragic' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // ending_heroic — Final Heroico
  // ─────────────────────────────────────────────
  {
    id: 'ending_heroic',
    locationId: 'cidadela_sombras',
    title: 'Final Heroico — Luz Vencedora',
    imageId: 'scenes/ending_heroic.webp',
    isEnding: 'ending_heroic',
    text: 'Você sai da Cidadela enquanto ela ainda cai. Os escombros não te alcançam. A Égide, na sua palma, devolve a luz para o céu rachado, e o céu se costura sozinho — devagar, mas se costura. Quando você chega ao alto do desfiladeiro, o sol está nascendo pela primeira vez em três dias.\n\nAenor não saberá os detalhes. Aenor saberá apenas que respira. As pessoas voltam a comer fora de casa. Os sinos voltam a bater a hora certa. O Mestre Arvendel — se sobreviveu — vai reescrever a profecia para incluir o nome verdadeiro daquele que a cumpriu. Em outro lugar, nas tribos do norte, alguém canta sua canção. Em outro lugar, na cidade, uma criança aprende a deletrear seu nome.\n\nVocê terminou.',
    onEnter: [
      { kind: 'unlockAchievement', achievementId: 'heroic_ending' },
      { kind: 'unlockAchievement', achievementId: 'all_fragments' },
    ],
    choices: [],
  },

  // ─────────────────────────────────────────────
  // ending_dark — Final Sombrio
  // ─────────────────────────────────────────────
  {
    id: 'ending_dark',
    locationId: 'cidadela_sombras',
    title: 'Final Sombrio — Coroa Negra',
    imageId: 'scenes/ending_dark.webp',
    isEnding: 'ending_dark',
    text: 'A Cidadela não cai. Você cuida disso. Os doze braseiros se acendem todos sob o seu comando — não são doze; são mais agora; são quantos você quiser. Vorthun te ensinou bastante antes de ir, e o que ele não ensinou, a Coroa Negra ensina sozinha.\n\nAenor entra em uma paz nova. Mais profunda. Mais quieta. Não há mais Sombras Errantes nas estradas — você é o que come Sombras Errantes agora. Mestre Arvendel não escreveu uma única palavra sobre você nos arquivos. Não foi por medo. Foi porque ele desapareceu antes de poder escrever.\n\nNo alto da torre mais alta da Cidadela, um trono novo. Você senta. A coroa pesa. Pesa mas pesa de modo que você ouve. E continua sentado.',
    onEnter: [
      { kind: 'unlockAchievement', achievementId: 'dark_ending' },
      { kind: 'unlockAchievement', achievementId: 'dark_pact' },
    ],
    choices: [],
  },

  // ─────────────────────────────────────────────
  // ending_sacrifice — Final do Sacrifício
  // ─────────────────────────────────────────────
  {
    id: 'ending_sacrifice',
    locationId: 'cidadela_sombras',
    title: 'Final do Sacrifício — Maior Amor',
    imageId: 'scenes/ending_sacrifice.webp',
    isEnding: 'ending_sacrifice',
    text: 'A luz das três janelas da Égide cresce até virar uma só. Você e Vorthun ficam dentro dela. Ele te olha. Você olha. Em algum momento entre as duas batidas finais do seu coração, vocês são a mesma pessoa por um instante. Em seguida, vocês são ninguém.\n\nAenor amanhece sem você. Sem ele. As Sombras Errantes evaporam onde estiverem, todas, no mesmo segundo. As estradas voltam a ser estradas. Os pescadores de Bramford recolhem redes. A Floresta de Mirthwood respira. Karn-Tuhl dorme.\n\nAnos depois, em uma feira do porto de Bramford, uma criança aponta para uma placa de bronze nova encaixada na parede do Templo do Saber. A placa não tem nome. Tem apenas a forma de três cristais entrelaçados. A mãe da criança não sabe explicar quem foi. Sabe explicar apenas que foi alguém. E que foi suficiente.',
    onEnter: [
      { kind: 'unlockAchievement', achievementId: 'sacrifice_ending' },
    ],
    choices: [],
  },

  // ─────────────────────────────────────────────
  // ending_tragic — Final Trágico
  // ─────────────────────────────────────────────
  {
    id: 'ending_tragic',
    locationId: 'cidadela_sombras',
    title: 'Final Trágico — Sombras Errantes',
    imageId: 'scenes/ending_tragic.webp',
    isEnding: 'ending_tragic',
    text: 'Você vence. Vorthun cai. A Cidadela cai. O céu se costura — em parte. Há um rasgo no leste que não fecha. Pequeno. Quase imperceptível.\n\nAenor sobrevive. Aenor sobrevive descontado. As estradas têm menos pessoas porque há menos pessoas. A Floresta de Mirthwood respira mais devagar do que respirava antes. Bramford reconstrói o que perdeu, mas não tudo. Karn-Tuhl segue dormindo, e talvez agora não acorde mais.\n\nEm algum lugar muito distante, atrás do rasgo no leste, uma das vozes que estavam na voz de Vorthun arruma a garganta. Aprende a falar sozinha. Vai demorar. Mas vai aprender.\n\nVocê termina sentado num campo vazio, com a Égide quebrada no colo. O que você venceu foi o suficiente para hoje. Não para sempre. Você sabe disso. Você se levanta mesmo assim.',
    onEnter: [
      { kind: 'unlockAchievement', achievementId: 'tragic_ending' },
    ],
    choices: [],
  },
]
