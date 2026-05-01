import type { NarrativeNode } from '../../types'

export const ACT2_CIDADE_NODES: NarrativeNode[] = [
  // ─────────────────────────────────────────────
  // a2_bramford_01 ★ — Portão de Bramford
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_01',
    locationId: 'bramford',
    title: 'Portão de Bramford',
    imageId: 'scenes/bramford_market.webp',
    text: 'Bramford fede a peixe e a metal. As muralhas são altas demais para a quantidade de guardas que as patrulha — três no portão sul, dois inclinados como se a alabarda pesasse mais do que a coragem. Um deles bate a mão contra a sua bolsa quando você passa, mais por hábito do que por suspeita, e diz "passa", e não olha mais.\n\nLá dentro, é o ruído. Mercadores gritando preços, cavalos gritando porque mercadores gritam, sinos da Guarda batendo a hora errada por dois segundos. Acima de tudo, sobre o telhado mais alto da cidade, uma cúpula de pedra fechada por correntes — o Templo do Saber. Você veio por causa daquela cúpula.',
    choices: [
      {
        id: 'a2_b01_mercado',
        label: 'Ir ao mercado central.',
        outcome: { nextNodeId: 'a2_bramford_02' },
      },
      {
        id: 'a2_b01_taverna',
        label: 'Buscar uma taverna para ouvir a cidade.',
        outcome: { nextNodeId: 'a2_bramford_03' },
      },
      {
        id: 'a2_b01_ladino',
        label: 'Pegar o caminho dos becos.',
        classRequirement: 'ladino',
        icon: 'class',
        outcome: {
          nextNodeId: 'a2_bramford_03',
          effects: [
            { kind: 'setFlag', key: 'evitou_guarda', value: true },
          ],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_02 — Mercado de Belaron
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_02',
    locationId: 'bramford',
    title: 'Mercado de Belaron',
    text: 'A barraca de Mestre Belaron é uma exceção: organizada, com itens dispostos em fileiras, cada um com uma etiqueta de pergaminho amarrada por barbante azul. Belaron é magro, cara fina, lentes presas num cordão. Reconhece um aventureiro pela sola do sapato.\n\n— Você caminhou por estrada de terra recente — diz ele, sem cumprimentar. — Floresta, talvez. Tem cheiro. Posso te vender alguma coisa que não te deixa morrer no caminho do Templo.',
    isMerchant: true,
    choices: [
      {
        id: 'a2_b02_templo',
        label: 'Perguntar sobre o Templo do Saber.',
        outcome: {
          nextNodeId: 'a2_bramford_02',
          effects: [{ kind: 'setFlag', key: 'sabe_do_templo', value: true }],
          narrationOverride: 'Belaron abaixa a voz. O Templo está fechado há dois meses por ordem da Guarda. Corrente nas portas. "Se quer entrar, precisa de Vellis ou de quem manda em Vellis."',
        },
      },
      {
        id: 'a2_b02_guilda',
        label: 'Perguntar sobre a Guilda da Adaga Quieta.',
        classRequirement: 'ladino',
        icon: 'class',
        outcome: {
          nextNodeId: 'a2_bramford_02b_sira',
          effects: [{ kind: 'setFlag', key: 'sabe_senhora_sombria', value: true }],
        },
      },
      {
        id: 'a2_b02_despedir',
        label: 'Despedir-se.',
        outcome: { nextNodeId: 'a2_bramford_03' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_02b_sira — Um Nome Ouvido (Ladina exclusivo)
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_02b_sira',
    locationId: 'bramford',
    title: 'Um Nome Ouvido',
    text: 'O nome que Belaron sussurrou sai da boca dele e entra em você como uma pedra entra na água. *Aelin Faro.* Aelin Faro foi quem entrou na sua casa naquela noite. Foi quem sorria enquanto sua mãe gritava. Foi quem, sete anos depois, cortou as três crianças que viram demais nas docas. Aelin Faro virou Senhora Sombria. Bom. Bom.\n\nVocê fica em silêncio um momento longo demais. Belaron não pergunta nada.',
    onEnter: [
      { kind: 'setFlag', key: 'sira_arco_pessoal', value: true },
    ],
    choices: [
      {
        id: 'a2_b02b_continuar',
        label: 'Continuar.',
        outcome: { nextNodeId: 'a2_bramford_03' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_03 — A Taverna "O Pé Quebrado"
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_03',
    locationId: 'bramford',
    title: 'O Pé Quebrado',
    text: '"O Pé Quebrado" tem mesa pegajosa, ale ralo, e clientela que prefere o canto das paredes. Você senta. Em três minutos, sem pedir, três conversas chegam aos seus ouvidos: uma sobre roubo de cavalos, uma sobre uma noite em que a Guarda perdeu controle do bairro do porto, e uma — mais baixa, mais firme — sobre alguém da Guilda querendo "passar mensagem para forasteiros novos".\n\nUm homem de bigode molhado de espuma se aproxima com um caneco a mais. Sorri.',
    choices: [
      {
        id: 'a2_b03_ouvir',
        label: 'Ouvir o que ele tem para dizer.',
        icon: 'dice',
        skillCheck: {
          skill: 'investigar',
          difficulty: 9,
          allowSorte: true,
          successOutcome: {
            nextNodeId: 'a2_bramford_04',
            effects: [
              { kind: 'setFlag', key: 'sabe_vellis', value: true },
              { kind: 'setFlag', key: 'sabe_contato_guilda', value: true },
              { kind: 'setFlag', key: 'bonus_check_bramford', value: true },
            ],
            narrationOverride: 'Você ouve tudo. Nome do Capitão Vellis. O beco da Roda Quebrada para o contato da Guilda. O bigode molhado assente e recua.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_04',
            effects: [{ kind: 'setFlag', key: 'sabe_vellis', value: true }],
            narrationOverride: 'Você capta metade. O nome Vellis, mas não o beco da Guilda.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_04' },
      },
      {
        id: 'a2_b03_pagar',
        label: 'Pagar uma cerveja em troca de informação.',
        outcome: {
          nextNodeId: 'a2_bramford_04',
          effects: [
            { kind: 'gold', amount: -3 },
            { kind: 'setFlag', key: 'sabe_vellis', value: true },
            { kind: 'setFlag', key: 'sabe_contato_guilda', value: true },
          ],
        },
      },
      {
        id: 'a2_b03_ignorar',
        label: 'Ignorar e sair.',
        outcome: { nextNodeId: 'a2_bramford_04' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_04 — Os Dois Que Esperam
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_04',
    locationId: 'bramford',
    title: 'Os Dois Que Esperam',
    text: 'Ao sair da taverna, você os encontra. Os dois. Em becos opostos da rua, como xadrez.\n\nÀ direita, sob a lanterna oficial: **Capitão Vellis**, casaco azul-rei surrado, cicatriz no canto da boca, mão pousada na espada como se sempre estivesse pousada. Ele acena com a cabeça uma vez. Apenas.\n\nÀ esquerda, sob nada: uma figura encapuzada, magra, dedos longos. Faz com a mão direita o sinal da Guilda — três dedos curvados, polegar dentro. Convite ou ameaça, dá no mesmo na linguagem deles.\n\nBramford não vai te deixar conversar com os dois. Você precisa escolher um lado para entrar no Templo.',
    choices: [
      {
        id: 'a2_b04_guarda',
        label: 'Ir falar com Vellis.',
        outcome: { nextNodeId: 'a2_bramford_05_guarda' },
      },
      {
        id: 'a2_b04_guilda',
        label: 'Ir falar com a Guilda.',
        outcome: { nextNodeId: 'a2_bramford_05_guilda' },
      },
      {
        id: 'a2_b04_ladino_solo',
        label: 'Tentar despistar os dois e seguir sozinha.',
        classRequirement: 'ladino',
        icon: 'class',
        skillCheck: {
          skill: 'furtividade',
          difficulty: 13,
          allowSorte: true,
          successOutcome: {
            nextNodeId: 'a2_bramford_09',
            effects: [
              { kind: 'setFlag', key: 'entrou_sozinha', value: true },
              { kind: 'energy', amount: -2 },
            ],
            narrationOverride: 'Você desaparece pelos telhados. A escalada noturna cansa, mas funciona.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_05_guilda',
            effects: [{ kind: 'reputation', amount: -1 }],
            narrationOverride: 'A Guilda percebe antes que você chegue aos telhados. Dois braços te encaminham firmemente para o beco.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_05_guilda' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_05_guarda — Capitão Vellis
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_05_guarda',
    locationId: 'bramford',
    title: 'Capitão Vellis',
    text: 'Vellis te leva para um cubículo nas casernas onde uma única vela arde acima de mapas amassados. Aponta com a faca de pão para uma marcação no porto.\n\n— Tem uma célula da Adaga Quieta no armazém 14. Eles guardam o que destranca o Templo. Se você acabar com eles, eu destranco. Simples. Honra contra honra.\n\nEle coloca a faca em pé.\n\n— Não é simples.',
    choices: [
      {
        id: 'a2_b05g_aceitar',
        label: 'Aceitar a missão.',
        outcome: {
          nextNodeId: 'a2_bramford_06_guarda',
          effects: [{ kind: 'setFlag', key: 'aliado_guarda', value: true }],
        },
      },
      {
        id: 'a2_b05g_detalhes',
        label: 'Pedir mais detalhes.',
        outcome: {
          nextNodeId: 'a2_bramford_06_guarda',
          effects: [
            { kind: 'setFlag', key: 'aliado_guarda', value: true },
            { kind: 'addItem', itemId: 'pocao_cura', quantity: 1 },
          ],
          narrationOverride: 'Vellis admite que perdeu três homens. Empurra uma poção de cura na sua direção. — Honra conta. Vá.',
        },
      },
      {
        id: 'a2_b05g_recusar',
        label: 'Recusar e procurar a Guilda.',
        outcome: {
          nextNodeId: 'a2_bramford_05_guilda',
          effects: [{ kind: 'reputation', amount: -1 }],
          narrationOverride: '"Você prometeu ouvir e não ouviu", diz Vellis. Ele não tenta te parar.',
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_06_guarda — Armazém 14
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_06_guarda',
    locationId: 'bramford',
    title: 'Armazém 14',
    text: 'O armazém cheira a sal velho e a metal úmido. Há três vultos numa mesa baixa: dois jogando dados, um afiando algo. As lanternas baixas pintam o chão de meia-luz. Não te viram. Ainda.',
    choices: [
      {
        id: 'a2_b06g_surpresa',
        label: 'Atacar de surpresa.',
        icon: 'dice',
        skillCheck: {
          skill: 'furtividade',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_bramford_07_guarda',
            effects: [{ kind: 'setFlag', key: 'surpresa_armazem', value: true }],
            narrationOverride: 'Você se move como sombra. O primeiro nem chegou a gritar.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_07_guarda',
            narrationOverride: 'Uma tábua geme sob seu peso. Eles se levantam.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_07_guarda' },
      },
      {
        id: 'a2_b06g_negociar',
        label: 'Negociar a saída deles.',
        icon: 'dice',
        skillCheck: {
          skill: 'persuadir',
          difficulty: 11,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_bramford_07_guarda',
            effects: [
              { kind: 'reputation', amount: 1 },
              { kind: 'setFlag', key: 'assassinos_fugiram', value: true },
            ],
            narrationOverride: 'Dois saem pela janela dos fundos. Um fica. Ele parece preferir ficar.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_07_guarda',
            narrationOverride: 'Eles ficam. E tiram as facas.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_07_guarda' },
      },
      {
        id: 'a2_b06g_barbaro',
        label: 'Quebrar a porta gritando.',
        classRequirement: 'barbaro',
        icon: 'class',
        skillCheck: {
          skill: 'intimidar',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_bramford_07_guarda',
            effects: [{ kind: 'setFlag', key: 'assassinos_fugiram_barb', value: true }],
            narrationOverride: 'Dois tropeçam uns nos outros tentando sair. Um fica, pálido mas determinado.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_07_guarda',
            narrationOverride: 'Eles ficam. O grito só serviu para acordar os da rua de fora.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_07_guarda' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_07_guarda — Combate na Doca
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_07_guarda',
    locationId: 'bramford',
    title: 'Combate no Armazém',
    text: 'O que sobrou da célula da Guilda não vai embora de bom grado.',
    choices: [
      {
        id: 'a2_b07g_combate',
        label: 'Enfrentar o assassino.',
        combat: {
          enemyId: 'assassino_guilda',
          victoryOutcome: {
            nextNodeId: 'a2_bramford_08_guarda',
            effects: [
              { kind: 'addKeyItem', keyItemId: 'chave_do_templo' },
              { kind: 'addItem', itemId: 'po_cegueira', quantity: 1 },
              { kind: 'gold', amount: 20 },
            ],
          },
        },
        outcome: { nextNodeId: 'a2_bramford_08_guarda' },
      },
      {
        id: 'a2_b07g_combate_fraco',
        label: 'Enfrentar o assassino (enfraquecido).',
        flagRequirement: [
          { key: 'assassinos_fugiram', equals: true },
        ],
        combat: {
          enemyId: 'assassino_guilda_fraco',
          victoryOutcome: {
            nextNodeId: 'a2_bramford_08_guarda',
            effects: [
              { kind: 'addKeyItem', keyItemId: 'chave_do_templo' },
              { kind: 'addItem', itemId: 'po_cegueira', quantity: 1 },
              { kind: 'gold', amount: 20 },
            ],
          },
        },
        outcome: { nextNodeId: 'a2_bramford_08_guarda' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_08_guarda — Relatório a Vellis
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_08_guarda',
    locationId: 'bramford',
    title: 'Relatório a Vellis',
    text: 'Vellis examina a chave que você deixa cair na mesa dele. Os olhos não pesam mais. Ele assente devagar e empurra na sua direção um pequeno frasco de vidro escuro: licor de junípero, dos bons. Não fala. Em Bramford, esse silêncio é gratidão.\n\n— A corrente do Templo cai amanhã ao amanhecer. Você decide se entra com a Guarda escoltando, ou sozinho/a.',
    choices: [
      {
        id: 'a2_b08g_escolta',
        label: 'Entrar com a escolta.',
        outcome: {
          nextNodeId: 'a2_bramford_09',
          effects: [{ kind: 'setFlag', key: 'entrada_publica', value: true }],
        },
      },
      {
        id: 'a2_b08g_sozinho',
        label: 'Entrar sozinho/a.',
        outcome: {
          nextNodeId: 'a2_bramford_09',
          effects: [{ kind: 'setFlag', key: 'entrada_silenciosa', value: true }],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_05_guilda — A Sala dos Sussurros
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_05_guilda',
    locationId: 'bramford',
    title: 'A Sala dos Sussurros',
    text: 'O encapuzado te leva por dois becos, três escadarias e um alçapão até uma sala onde só há velas e silhuetas. Uma das silhuetas avança meia cara para a luz. Mulher. Sorri sem entregar dente.\n\n— A Guilda quer o Selo do Capitão Vellis. Coisa pequena. Bronze. Está na gaveta dele. Você devolve, e a corrente do Templo cai. Não vai precisar matar ninguém. Provavelmente.',
    choices: [
      {
        id: 'a2_b05gi_aceitar',
        label: 'Aceitar.',
        outcome: {
          nextNodeId: 'a2_bramford_06_guilda',
          effects: [{ kind: 'setFlag', key: 'aliado_guilda', value: true }],
        },
      },
      {
        id: 'a2_b05gi_pedir_mais',
        label: 'Pedir mais.',
        outcome: {
          nextNodeId: 'a2_bramford_06_guilda',
          effects: [
            { kind: 'setFlag', key: 'aliado_guilda', value: true },
            { kind: 'setFlag', key: 'promessa_botas', value: true },
          ],
          narrationOverride: 'Ela anui. Botas silenciosas aguardam você ao final do trabalho.',
        },
      },
      {
        id: 'a2_b05gi_sira_faro',
        label: 'Perguntar sobre Aelin Faro.',
        classRequirement: 'ladino',
        flagRequirement: { key: 'sira_arco_pessoal', equals: true },
        icon: 'class',
        outcome: {
          nextNodeId: 'a2_bramford_06_guilda',
          effects: [
            { kind: 'setFlag', key: 'aliado_guilda', value: true },
            { kind: 'setFlag', key: 'sira_promessa_encontro', value: true },
          ],
          narrationOverride: '"A Senhora prefere encontros formais. Termine o trabalho e ela talvez te receba." A silhueta some na vela.',
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_06_guilda — A Casa de Vellis
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_06_guilda',
    locationId: 'bramford',
    title: 'A Casa de Vellis',
    text: 'A casa de Vellis fica acima do quartel: três cômodos, uma estante, uma mesa de madeira tão polida que reflete a vela. A gaveta da escrivaninha está trancada por uma fechadura simples — para ele. Para você, depende.',
    choices: [
      {
        id: 'a2_b06gi_forcar',
        label: 'Forçar a fechadura.',
        icon: 'dice',
        skillCheck: {
          skill: 'furtividade',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_bramford_07_guilda',
            narrationOverride: 'A fechadura cede com um clique satisfatório. O Selo está dentro.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_06_guilda',
            effects: [{ kind: 'energy', amount: -2 }],
            narrationOverride: 'Um espinho mecânico na fechadura morde seus dedos. A tentativa falhou. Você pode tentar de novo.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_07_guilda' },
      },
      {
        id: 'a2_b06gi_gazua',
        label: 'Usar a gazua.',
        classRequirement: 'ladino',
        itemRequirement: 'gazua',
        icon: 'class',
        outcome: {
          nextNodeId: 'a2_bramford_07_guilda',
          narrationOverride: 'A gazua faz o trabalho em quatro segundos. Você pega o Selo.',
        },
      },
      {
        id: 'a2_b06gi_mago',
        label: 'Truque arcano.',
        classRequirement: 'mago',
        icon: 'class',
        skillCheck: {
          skill: 'arcano',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_bramford_07_guilda',
            narrationOverride: 'A fechadura obedece à sua vontade. O Selo está dentro.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_06_guilda',
            effects: [{ kind: 'energy', amount: -2 }],
            narrationOverride: 'A magia para no meio do truque. Tente de outra forma.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_07_guilda' },
      },
      {
        id: 'a2_b06gi_barbaro',
        label: 'Arrombar com calma.',
        classRequirement: 'barbaro',
        icon: 'class',
        skillCheck: {
          skill: 'atletismo',
          difficulty: 11,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_bramford_07_guilda',
            effects: [{ kind: 'reputation', amount: -1 }],
            narrationOverride: 'Você abre. A gaveta, e metade da escrivaninha. O barulho vai ecoar. Mas o Selo está aqui.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_07_guilda',
            narrationOverride: 'O alarme mecânico toca. Uma sombra aparece na escada.',
          },
        },
        combat: {
          enemyId: 'assassino_guilda',
          victoryOutcome: { nextNodeId: 'a2_bramford_07_guilda' },
        },
        outcome: { nextNodeId: 'a2_bramford_07_guilda' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_07_guilda — A Saída pela Janela
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_07_guilda',
    locationId: 'bramford',
    title: 'A Saída pela Janela',
    text: 'Selo no bolso. Uma sombra sobe a escada do cômodo ao lado. Não é Vellis: é maior, mais leve. Você tem três batidas de coração para decidir.',
    choices: [
      {
        id: 'a2_b07gi_janela',
        label: 'Pular pela janela.',
        icon: 'dice',
        skillCheck: {
          skill: 'atletismo',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_bramford_08_guilda',
            effects: [{ kind: 'energy', amount: -1 }],
            narrationOverride: 'Você cai e rola. Um joelho reclama, mas você escapa.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_08_guilda',
            effects: [{ kind: 'energy', amount: -3 }],
            narrationOverride: 'A queda é pior do que o planejado. Você escapa de qualquer jeito, mancando.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_08_guilda' },
      },
      {
        id: 'a2_b07gi_esconder',
        label: 'Esconder-se atrás da estante.',
        icon: 'dice',
        skillCheck: {
          skill: 'furtividade',
          difficulty: 11,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_bramford_08_guilda',
            narrationOverride: 'A sombra passa sem pausar. Você conta vinte respirações e sai.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_08_guilda',
            narrationOverride: 'A estante rui. Combate inevitável.',
          },
        },
        combat: {
          enemyId: 'assassino_guilda_fraco',
          victoryOutcome: { nextNodeId: 'a2_bramford_08_guilda' },
        },
        outcome: { nextNodeId: 'a2_bramford_08_guilda' },
      },
      {
        id: 'a2_b07gi_atacar',
        label: 'Atacar primeiro.',
        combat: {
          enemyId: 'assassino_guilda',
          victoryOutcome: { nextNodeId: 'a2_bramford_08_guilda' },
        },
        outcome: { nextNodeId: 'a2_bramford_08_guilda' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_08_guilda — A Senhora Sombria
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_08_guilda',
    locationId: 'bramford',
    title: 'A Senhora Sombria',
    imageId: 'scenes/senhora_sombria.webp',
    text: 'A Senhora Sombria recebe você em um salão sem janelas. Quatro velas. Um tabuleiro de pedra branco e preto na mesa, peças interrompidas no meio de um lance. Ela aceita o Selo, gira-o entre dois dedos. Olha para você longamente.\n\n— Bem feito — diz. — A corrente do Templo cai esta noite. Eu mesma vou descer com você. Há coisas no Templo que precisam responder a perguntas minhas.',
    classVariants: {
      ladino: 'Você reconhece os olhos antes do rosto. Ela também reconhece os seus. O sorriso dela se contém um milímetro. — Pequena gata-velha. Quanto tempo. Vamos terminar uma conversa antiga juntas, então.',
    },
    choices: [
      {
        id: 'a2_b08gi_concordar',
        label: 'Concordar em descer com ela.',
        outcome: {
          nextNodeId: 'a2_bramford_09',
          effects: [{ kind: 'setFlag', key: 'desce_com_senhora', value: true }],
        },
      },
      {
        id: 'a2_b08gi_sira_atacar',
        label: 'Atacar agora.',
        classRequirement: 'ladino',
        flagRequirement: { key: 'sira_arco_pessoal', equals: true },
        icon: 'class',
        combat: {
          enemyId: 'combat_senhora_sombria',
          victoryOutcome: {
            nextNodeId: 'a2_bramford_16_alt',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_16_alt' },
      },
      {
        id: 'a2_b08gi_trair',
        label: 'Aceitar mas planejar fugir lá dentro.',
        outcome: {
          nextNodeId: 'a2_bramford_09',
          effects: [{ kind: 'setFlag', key: 'pretende_trair', value: true }],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_09 — Portas do Templo do Saber
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_09',
    locationId: 'bramford',
    title: 'Portas do Templo do Saber',
    imageId: 'scenes/templo_saber.webp',
    text: 'A corrente cai com um som que parece pergunta. As portas se abrem para um corredor de pedra que afunda mais do que sobe — três degraus, dez, vinte, cada um marcado com uma runa diferente, todas indistintas no escuro úmido. No fim, uma sala redonda, três portas seladas, três runas vivas pulsando com luz fraca azul. Uma de cada cor: prata, âmbar, azul-cobalto. Uma de cada tipo de prova.',
    choices: [
      {
        id: 'a2_b09_prata',
        label: 'Tentar a porta de prata (Arcano).',
        flagRequirement: { key: 'prova_prata_concluida', exists: false },
        outcome: { nextNodeId: 'a2_bramford_10' },
      },
      {
        id: 'a2_b09_ambar',
        label: 'Tentar a porta de âmbar (Investigar).',
        flagRequirement: { key: 'prova_ambar_concluida', exists: false },
        outcome: { nextNodeId: 'a2_bramford_11' },
      },
      {
        id: 'a2_b09_cobalto',
        label: 'Tentar a porta de cobalto (Resistir Magia).',
        flagRequirement: { key: 'prova_cobalto_concluida', exists: false },
        outcome: { nextNodeId: 'a2_bramford_12' },
      },
      {
        id: 'a2_b09_camara',
        label: 'Avançar para a câmara central.',
        flagRequirement: [
          { key: 'prova_prata_concluida', equals: true },
          { key: 'prova_ambar_concluida', equals: true },
          { key: 'prova_cobalto_concluida', equals: true },
        ],
        outcome: { nextNodeId: 'a2_bramford_13' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_10 — Porta de Prata: Arcano
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_10',
    locationId: 'bramford',
    title: 'A Porta de Prata',
    text: 'A runa de prata é uma equação. Não exatamente uma equação de números, mas você reconhece o ritmo: três símbolos giram, dois ficam, um falta. Falta o quê?',
    choices: [
      {
        id: 'a2_b10_resolver',
        label: 'Resolver a equação.',
        icon: 'dice',
        skillCheck: {
          skill: 'arcano',
          difficulty: 9,
          allowSorte: true,
          successOutcome: {
            nextNodeId: 'a2_bramford_09',
            effects: [{ kind: 'setFlag', key: 'prova_prata_concluida', value: true }],
            narrationOverride: 'A runa se fecha. A porta de prata gira.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_09',
            effects: [
              { kind: 'energy', amount: -2 },
              { kind: 'incrementFlag', key: 'falhas_templo', by: 1 },
            ],
            narrationOverride: 'A equação recusa. Uma descarga faz seus dentes doer. A porta se fecha por ora.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_09' },
      },
      {
        id: 'a2_b10_barbaro_forca',
        label: 'Quebrar à força a runa.',
        classRequirement: 'barbaro',
        icon: 'class',
        skillCheck: {
          skill: 'atletismo',
          difficulty: 13,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_bramford_09',
            effects: [
              { kind: 'setFlag', key: 'prova_prata_concluida', value: true },
              { kind: 'reputation', amount: -2 },
              { kind: 'energy', amount: -1 },
            ],
            narrationOverride: 'A runa explode. A porta abre. O Saber não aprova.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_09',
            effects: [{ kind: 'energy', amount: -4 }],
            narrationOverride: 'A runa devolve cada joule de força que você colocou. A porta não cedeu.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_09' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_11 — Porta de Âmbar: Investigar
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_11',
    locationId: 'bramford',
    title: 'A Porta de Âmbar',
    text: 'A runa de âmbar mostra cinco rostos esculpidos no batente, cada um expressando algo diferente. Embaixo, em escrita druídica antiga, a frase: "Apenas o que mente sorri sem motivo." Quatro rostos sorriem. Um sorri menos. Um não sorri. Um sorri muito.',
    choices: [
      {
        id: 'a2_b11_apontar',
        label: 'Apontar para um rosto.',
        icon: 'dice',
        skillCheck: {
          skill: 'investigar',
          difficulty: 9,
          allowSorte: true,
          successOutcome: {
            nextNodeId: 'a2_bramford_09',
            effects: [{ kind: 'setFlag', key: 'prova_ambar_concluida', value: true }],
            narrationOverride: 'Você aponta para o rosto que sorri sem razão aparente. A porta de âmbar gira.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_09',
            effects: [
              { kind: 'energy', amount: -2 },
              { kind: 'incrementFlag', key: 'falhas_templo', by: 1 },
            ],
            narrationOverride: 'Você apontou errado. Uma faísca dolorida no braço te lembra do custo.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_09' },
      },
      {
        id: 'a2_b11_mago',
        label: 'Ler a escrita druídica completa.',
        classRequirement: 'mago',
        icon: 'class',
        skillCheck: {
          skill: 'arcano',
          difficulty: 7,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_bramford_09',
            effects: [{ kind: 'setFlag', key: 'prova_ambar_concluida', value: true }],
            narrationOverride: 'A escrita te dá tudo. Você aponta e a porta cede.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_09',
            effects: [{ kind: 'energy', amount: -2 }],
            narrationOverride: 'O idioma é mais antigo que seus estudos. Tente de outra forma.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_09' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_12 — Porta de Cobalto: Resistir
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_12',
    locationId: 'bramford',
    title: 'A Porta de Cobalto',
    text: 'Quando você se aproxima da runa de cobalto, ela se abre como um olho que estava fingindo dormir. Uma voz entra na sua cabeça e tenta tomar a cadeira que pertence à sua. *Diga seu nome*, ela exige. *Diga o nome de quem você ama. Diga o que tem mais medo de perder.*',
    choices: [
      {
        id: 'a2_b12_resistir',
        label: 'Resistir.',
        icon: 'dice',
        skillCheck: {
          skill: 'resistirMagia',
          difficulty: 11,
          allowSorte: true,
          successOutcome: {
            nextNodeId: 'a2_bramford_09',
            effects: [{ kind: 'setFlag', key: 'prova_cobalto_concluida', value: true }],
            narrationOverride: 'A voz encontra uma parede. A porta de cobalto gira.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_09',
            effects: [
              { kind: 'energy', amount: -3 },
              { kind: 'sorte', amount: -1 },
              { kind: 'incrementFlag', key: 'falhas_templo', by: 1 },
            ],
            narrationOverride: 'A voz arranca um pouco antes que você a expulse. A porta se fecha.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_09' },
      },
      {
        id: 'a2_b12_barbaro_gritar',
        label: 'Aceitar e gritar de volta.',
        classRequirement: 'barbaro',
        icon: 'class',
        skillCheck: {
          skill: 'intimidar',
          difficulty: 11,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_bramford_09',
            effects: [
              { kind: 'setFlag', key: 'prova_cobalto_concluida', value: true },
              { kind: 'reputation', amount: 1 },
            ],
            narrationOverride: 'Você grita de volta com mais força. A voz recua. O Saber respeita coragem bruta.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_12',
            effects: [{ kind: 'energy', amount: -2 }],
            narrationOverride: 'A voz não recua. Tente de novo.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_09' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_13 — A Câmara do Saber
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_13',
    locationId: 'bramford',
    title: 'A Câmara do Saber',
    text: 'A Câmara Central é redonda e fica vazia até o momento em que você entra. Aí, sim, ela se preenche: prateleiras com livros que ninguém leu mas alguém quis que sobrevivessem; um pedestal no centro; sobre o pedestal, suspenso a um dedo da pedra, um cristal âmbar do tamanho de um ovo de codorna. Ele zumbe baixinho.\n\nVocê se aproxima. O cristal o reconhece — você jura que ele se inclina um pouco em sua direção. E é nesse instante que a sombra fala atrás de você.',
    choices: [
      {
        id: 'a2_b13_continuar',
        label: 'Continuar.',
        outcome: { nextNodeId: 'a2_bramford_14' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_14 — A Senhora Sombria, no Pedestal
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_14',
    locationId: 'bramford',
    title: 'A Senhora no Pedestal',
    imageId: 'scenes/senhora_sombria.webp',
    text: 'Aelin Faro — Senhora Sombria — está parada entre você e a saída. Ela não estava aí dois segundos atrás. As correntes da entrada agora gemem alto, fechando-se sozinhas atrás dela.\n\n— Eu cuido daqui — diz. — Você fez sua parte. Pode ir embora vivo se for embora agora. Sem o Fragmento, naturalmente.',
    classVariants: {
      ladino: 'Ela olha para você de um jeito que diz "menina, você cresceu." Você olha de volta de um jeito que diz "você morre hoje".',
    },
    choices: [
      {
        id: 'a2_b14_recusar',
        label: 'Recusar. O Fragmento é meu.',
        outcome: { nextNodeId: 'a2_bramford_15' },
      },
      {
        id: 'a2_b14_sira_nome',
        label: 'Falar o nome dela em voz alta.',
        classRequirement: 'ladino',
        flagRequirement: { key: 'sira_arco_pessoal', equals: true },
        icon: 'class',
        outcome: {
          nextNodeId: 'a2_bramford_15',
          effects: [
            { kind: 'reputation', amount: 1 },
            { kind: 'setFlag', key: 'sira_falou_nome', value: true },
          ],
        },
      },
      {
        id: 'a2_b14_mago_selo',
        label: 'Identificar que ela usa selo de Vorthun.',
        classRequirement: 'mago',
        icon: 'class',
        skillCheck: {
          skill: 'arcano',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_bramford_15',
            effects: [{ kind: 'setFlag', key: 'mago_achou_selo_fraco', value: true }],
            narrationOverride: 'O selo dela está incompleto — uma das runas foi apagada. Você sabe como explorar isso.',
          },
          failureOutcome: {
            nextNodeId: 'a2_bramford_15',
            narrationOverride: 'Você não consegue decifrar o selo a tempo. Ela já avança.',
          },
        },
        outcome: { nextNodeId: 'a2_bramford_15' },
      },
      {
        id: 'a2_b14_aceitar',
        label: 'Aceitar e ir embora.',
        outcome: {
          nextNodeId: 'a2_bramford_19',
          effects: [
            { kind: 'reputation', amount: -2 },
            { kind: 'setFlag', key: 'desistiu_bramford', value: true },
          ],
          narrationOverride: 'Você vai embora sem o Fragmento. Bramford perdeu.',
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_15 — Combate: Senhora Sombria
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_15',
    locationId: 'bramford',
    title: 'A Batalha da Câmara',
    text: 'Aelin Faro ergue as mãos e a escuridão responde.',
    choices: [
      {
        id: 'a2_b15_combate',
        label: 'Enfrentá-la.',
        combat: {
          enemyId: 'combat_senhora_sombria',
          victoryOutcome: { nextNodeId: 'a2_bramford_16' },
          modifiers: {
            enemyEnergyBonus: 4,
          },
        },
        flagRequirement: { key: 'entrada_publica', equals: true },
        outcome: { nextNodeId: 'a2_bramford_16' },
      },
      {
        id: 'a2_b15_combate_normal',
        label: 'Enfrentá-la.',
        combat: {
          enemyId: 'combat_senhora_sombria',
          victoryOutcome: { nextNodeId: 'a2_bramford_16' },
        },
        flagRequirement: { key: 'entrada_publica', exists: false },
        outcome: { nextNodeId: 'a2_bramford_16' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_16 — O Fragmento da Mente
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_16',
    locationId: 'bramford',
    title: 'O Fragmento da Mente',
    text: 'A Senhora cai sem barulho. Quando o último resquício de sombra escorre dos olhos dela, o rosto que sobra é jovem demais para o medo que ela causou. Você se aproxima do pedestal. O cristal âmbar pousa na sua mão como se sempre estivesse esperando.\n\nAtrás de você, o Templo respira. Algo no fundo da Câmara — o próprio Saber, quem sabe — assente uma única vez.',
    classVariants: {
      ladino: 'Você fica de joelhos um momento. Não vai dizer em voz alta o que se sente. Mas se sente.',
    },
    onEnter: [
      { kind: 'addKeyItem', keyItemId: 'frag_mente' },
      { kind: 'reputation', amount: 2 },
      { kind: 'setFlag', key: 'bramford_concluido', value: true },
    ],
    choices: [
      {
        id: 'a2_b16_continuar',
        label: 'Continuar.',
        outcome: { nextNodeId: 'a2_bramford_17' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_16_alt — Vitória Antecipada (Sira)
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_16_alt',
    locationId: 'bramford',
    title: 'O Fragmento, Sozinha',
    text: 'O Templo se abre depois — a corrente cai sozinha, como se reconhecesse que o trabalho dela já tinha sido feito. Você desce sozinha, e o cristal te espera. Ele zumbe diferente para você. Como se também conhecesse Aelin.',
    onEnter: [
      { kind: 'addKeyItem', keyItemId: 'frag_mente' },
      { kind: 'reputation', amount: 1 },
      { kind: 'setFlag', key: 'bramford_concluido', value: true },
    ],
    choices: [
      {
        id: 'a2_b16alt_continuar',
        label: 'Continuar.',
        outcome: { nextNodeId: 'a2_bramford_17' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_17 — Bramford Vazia
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_17',
    locationId: 'bramford',
    title: 'Bramford ao Amanhecer',
    text: 'Você sai do Templo na hora em que Bramford acorda. Os pescadores recolhem redes. Os sinos batem a hora certa pela primeira vez essa semana. Vellis pode estar te esperando no portão, ou pode não estar. A Guilda pode te seguir, ou pode te deixar ir. A cidade decide sozinha quem te vê.',
    choices: [
      {
        id: 'a2_b17_capela',
        label: 'Procurar a Capela do Templo para descansar.',
        outcome: { nextNodeId: 'a2_bramford_18' },
      },
      {
        id: 'a2_b17_sair',
        label: 'Sair direto pelo portão.',
        outcome: { nextNodeId: 'a2_bramford_19' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_18 — Respiro de Sorte (Capela)
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_18',
    locationId: 'bramford',
    title: 'A Capela do Templo',
    text: 'A Capela é o anexo lateral do Templo do Saber, baixa, fria, com bancos de pedra polida pelos joelhos de séculos. Acima do altar, um vitral simples mostra três figuras de costas, caminhando juntas para uma luz fraca. Você senta. O silêncio aqui é o tipo de silêncio que não pesa: pousa.\n\nPor um instante, é possível esquecer que existe Vorthun. Por um instante.',
    choices: [
      {
        id: 'a2_b18_descansar',
        label: 'Descansar aqui.',
        flagRequirement: { key: 'respiro_ato2_usado', exists: false },
        outcome: {
          nextNodeId: 'a2_bramford_19',
          effects: [
            { kind: 'restoreRespiro', type: 'both' },
            { kind: 'setFlag', key: 'respiro_ato2_usado', value: true },
          ],
        },
      },
      {
        id: 'a2_b18_descansar_bloqueado',
        label: 'Descansar aqui.',
        flagRequirement: { key: 'respiro_ato2_usado', equals: true },
        disabled: true,
        disabledTooltip: 'Você já usou o Respiro deste ato.',
        outcome: { nextNodeId: 'a2_bramford_19' },
      },
      {
        id: 'a2_b18_seguir',
        label: 'Levantar e seguir; reservo o fôlego.',
        outcome: { nextNodeId: 'a2_bramford_19' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_bramford_19 — Saída de Bramford
  // ─────────────────────────────────────────────
  {
    id: 'a2_bramford_19',
    locationId: 'bramford',
    title: 'Saída de Bramford',
    text: 'O portão sul. Os mesmos guardas inclinados na alabarda. Um deles assente para você como se reconhecesse — embora não tenha como reconhecer. Talvez seja a postura de quem agora carrega dois fragmentos.\n\nO Mapa abre na sua mão. Falta um.',
    onEnter: [
      { kind: 'setFlag', key: 'bramford_concluido', value: true },
    ],
    isMap: true,
    choices: [
      {
        id: 'a2_b19_mirthwood',
        label: 'Seguir para Mirthwood.',
        flagRequirement: { key: 'mirthwood_concluido', exists: false },
        icon: 'map',
        outcome: { nextNodeId: 'a2_mirthwood_01' },
      },
      {
        id: 'a2_b19_karn',
        label: 'Seguir para Karn-Tuhl.',
        flagRequirement: { key: 'karn_concluido', exists: false },
        icon: 'map',
        outcome: { nextNodeId: 'a2_karn_01' },
      },
    ],
  },
]
