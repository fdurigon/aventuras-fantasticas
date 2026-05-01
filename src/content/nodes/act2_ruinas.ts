import type { NarrativeNode } from '../../types'

export const ACT2_RUINAS_NODES: NarrativeNode[] = [
  // ─────────────────────────────────────────────
  // a2_karn_01 ★ — Aproximação
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_01',
    locationId: 'karn_tuhl',
    title: 'Aproximação',
    imageId: 'scenes/karn_tuhl_entry.webp',
    text: 'A trilha sobe e o ar fica fino antes da paciência ficar fina. Karn-Tuhl não foi construída na montanha — foi feita *como* a montanha. As muralhas são lascas naturais empilhadas pela mão do tempo até parecerem propósito. De longe, parece que a fortaleza está dormindo. De perto, parece que está esperando.\n\nA neve aqui é antiga. Não a neve do inverno passado: neve que ninguém pisou em décadas. Quando seu pé afunda, o som que sai é de papel velho.',
    choices: [
      {
        id: 'a2_k01_subir',
        label: 'Subir o último trecho aberto.',
        outcome: { nextNodeId: 'a2_karn_02' },
      },
      {
        id: 'a2_k01_barbaro_cancao',
        label: 'Cantar baixinho a canção de viagem do clã.',
        classRequirement: 'barbaro',
        icon: 'class',
        outcome: {
          nextNodeId: 'a2_karn_02',
          effects: [
            { kind: 'setFlag', key: 'cancao_korrundir', value: true },
            { kind: 'reputation', amount: 1 },
          ],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_02 — Tempestade
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_02',
    locationId: 'karn_tuhl',
    title: 'A Tempestade',
    text: 'Vem de oeste, e vem rápido demais para ser tempestade comum. Em três respirações, você não enxerga a mão estendida. O vento tem voz: muitas vozes pequenas, todas falando a mesma palavra que você não consegue ouvir.',
    choices: [
      {
        id: 'a2_k02_resistir',
        label: 'Resistir.',
        icon: 'dice',
        skillCheck: {
          skill: 'resistirMagia',
          difficulty: 9,
          allowSorte: true,
          successOutcome: {
            nextNodeId: 'a2_karn_03',
            narrationOverride: 'As vozes batem na sua mente e passam como vento contra pedra.',
          },
          failureOutcome: {
            nextNodeId: 'a2_karn_03',
            effects: [{ kind: 'energy', amount: -3 }],
            narrationOverride: 'O frio não é frio — é algo que vinha de mais longe do que a montanha. Você passa, mais leve em Energia.',
          },
        },
        outcome: { nextNodeId: 'a2_karn_03' },
      },
      {
        id: 'a2_k02_barbaro_encarar',
        label: 'Encarar de frente.',
        classRequirement: 'barbaro',
        icon: 'class',
        skillCheck: {
          skill: 'atletismo',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_karn_03',
            effects: [{ kind: 'reputation', amount: 1 }],
            narrationOverride: 'Você avança passo a passo. A montanha respeita quem a respeita.',
          },
          failureOutcome: {
            nextNodeId: 'a2_karn_03',
            effects: [{ kind: 'energy', amount: -1 }],
            narrationOverride: 'A tempestade te empurra um passo atrás para cada dois que você dá. Você chega, mas custou.',
          },
        },
        outcome: { nextNodeId: 'a2_karn_03' },
      },
      {
        id: 'a2_k02_abrigar',
        label: 'Abrigar-se entre rochas.',
        icon: 'dice',
        skillCheck: {
          skill: 'investigar',
          difficulty: 7,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_karn_03',
            narrationOverride: 'Você encontra um nicho entre duas pedras e espera a rajada pior passar.',
          },
          failureOutcome: {
            nextNodeId: 'a2_karn_03',
            effects: [{ kind: 'energy', amount: -2 }],
            narrationOverride: 'O nicho não é nicho o suficiente. Você passa de qualquer jeito, mas pagando.',
          },
        },
        outcome: { nextNodeId: 'a2_karn_03' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_03 — Portão das Ruínas
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_03',
    locationId: 'karn_tuhl',
    title: 'Portão das Ruínas',
    text: 'O Portão de Karn-Tuhl tem três vezes a altura sua. Os batentes — duas estátuas de guerreiros anões com martelos no ombro — estão rachados, mas os olhos das estátuas permanecem inteiros, e os olhos parecem te seguir. A porta está entreaberta o suficiente para um corpo passar de lado. Cheira a forja apagada e a sal antigo.',
    choices: [
      {
        id: 'a2_k03_entrar',
        label: 'Entrar.',
        outcome: { nextNodeId: 'a2_karn_04' },
      },
      {
        id: 'a2_k03_examinar',
        label: 'Examinar as estátuas antes.',
        icon: 'dice',
        skillCheck: {
          skill: 'investigar',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_karn_04',
            effects: [{ kind: 'setFlag', key: 'runa_boas_vindas', value: true }],
            narrationOverride: 'Você encontra runas de boas-vindas para "filhos do norte" entalhadas na base das estátuas. Um detalhe que pode importar lá dentro.',
          },
          failureOutcome: {
            nextNodeId: 'a2_karn_04',
            narrationOverride: 'As estátuas guardam seus segredos. Você entra de qualquer jeito.',
          },
        },
        outcome: { nextNodeId: 'a2_karn_04' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_04 — A Sala do Mosaico
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_04',
    locationId: 'karn_tuhl',
    title: 'Sala do Mosaico',
    text: 'O primeiro corredor leva a uma sala redonda cujo chão é um mosaico. Centenas de mil pequenas pedras coloridas formam a história do reino: a chegada dos primeiros anões, a forja da Égide, a ruína. Algumas peças do mosaico estão soltas, espalhadas no chão. Há um pedestal ao lado da porta seguinte com cinco encaixes vazios. Acima dos encaixes: cinco runas com cinco palavras.',
    choices: [
      {
        id: 'a2_k04_resolver',
        label: 'Resolver o mosaico.',
        icon: 'dice',
        skillCheck: {
          skill: 'investigar',
          difficulty: 9,
          allowSorte: true,
          successOutcome: {
            nextNodeId: 'a2_karn_07',
            narrationOverride: 'As peças encaixam. A porta abre. Você chegou ao Salão do Trono pulando o Salão da Forja.',
          },
          failureOutcome: {
            nextNodeId: 'a2_karn_05',
            effects: [{ kind: 'energy', amount: -1 }],
            narrationOverride: 'Você erra três peças. Uma faísca da pedra ressentida te morde. A porta abre, mas o Salão da Forja vai acordar.',
          },
        },
        outcome: { nextNodeId: 'a2_karn_05' },
      },
      {
        id: 'a2_k04_forcar',
        label: 'Forçar a porta sem resolver.',
        icon: 'dice',
        skillCheck: {
          skill: 'atletismo',
          difficulty: 11,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_karn_05',
            narrationOverride: 'A porta cede com um estrondo. O mosaico não aprova o método.',
          },
          failureOutcome: {
            nextNodeId: 'a2_karn_05',
            effects: [{ kind: 'energy', amount: -2 }],
            narrationOverride: 'A porta cede depois que você cede primeiro. Doloroso.',
          },
        },
        outcome: { nextNodeId: 'a2_karn_05' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_05 — Esqueletos no Salão da Forja
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_05',
    locationId: 'karn_tuhl',
    title: 'Salão da Forja',
    text: 'O Salão da Forja é vasto. Quatro forjas frias em fila no centro; quatro bigornas; quatro pares de pinças penduradas em cada uma. E quatro corpos de pé, sem se mover, em frente a cada bigorna, como se ainda esperassem o aço esquentar. Eles ouvem você antes de você decidir respirar.',
    choices: [
      {
        id: 'a2_k05_combate',
        label: 'Enfrentar os esqueletos.',
        combat: {
          enemyId: 'esqueleto_anao_duplo',
          victoryOutcome: {
            nextNodeId: 'a2_karn_06',
          },
        },
        outcome: { nextNodeId: 'a2_karn_06' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_06 — A Forja Apagada
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_06',
    locationId: 'karn_tuhl',
    title: 'A Forja Apagada',
    text: 'A primeira forja, ao centro, não está completamente apagada. Há na ferramenta — um martelo de cabo de bronze — um calor que não devia ter sobrado depois de um século. Quando você se aproxima, o calor responde. O martelo não pesa o que devia pesar.\n\nHá uma escolha aqui: pegar o martelo, deixar o martelo, ou tentar ouvir o que ele diz.',
    choices: [
      {
        id: 'a2_k06_pegar',
        label: 'Pegar o martelo.',
        outcome: {
          nextNodeId: 'a2_karn_07',
          effects: [{ kind: 'addItem', itemId: 'martelo_de_brasa', quantity: 1 }],
        },
      },
      {
        id: 'a2_k06_deixar',
        label: 'Deixar.',
        outcome: {
          nextNodeId: 'a2_karn_07',
          effects: [{ kind: 'reputation', amount: 1 }],
          narrationOverride: 'Anão respeita quem não pega o que não é dele.',
        },
      },
      {
        id: 'a2_k06_mago_ler',
        label: 'Ler o calor que sobrou.',
        classRequirement: 'mago',
        icon: 'class',
        skillCheck: {
          skill: 'arcano',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_karn_07',
            effects: [{ kind: 'setFlag', key: 'sabe_brom', value: true }],
            narrationOverride: 'No calor residual, um nome: Brom Pedraferro. O irmão do rei.',
          },
          failureOutcome: {
            nextNodeId: 'a2_karn_07',
            effects: [{ kind: 'energy', amount: -1 }],
            narrationOverride: 'O calor morde seus dedos antes de deixar ir.',
          },
        },
        outcome: { nextNodeId: 'a2_karn_07' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_07 — Sala do Trono
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_07',
    locationId: 'karn_tuhl',
    title: 'Sala do Trono',
    imageId: 'scenes/durin_throne.webp',
    text: 'Você sai do salão da forja para um corredor que afunda em curva, e o corredor se abre num Salão do Trono que parece pequeno apenas por causa do trono que ocupa o centro. O trono é simples: pedra trabalhada com runas pequenas. Vazio. Atrás do trono, doze braseiros, todos apagados há séculos.\n\nQuando você dá o décimo passo na sala, os doze braseiros se acendem ao mesmo tempo, com fogo azul. E sobre o trono, a forma de um anão de armadura trabalhada — translúcido, contornado em luz fria — toma assento.',
    choices: [
      {
        id: 'a2_k07_continuar',
        label: 'Continuar.',
        outcome: { nextNodeId: 'a2_karn_08' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_08 — Durin Pedraferro
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_08',
    locationId: 'karn_tuhl',
    title: 'Durin Pedraferro',
    text: 'Durin Pedraferro, último Rei dos Reis de Karn-Tuhl, te encara. A barba dele desce até a cintura mesmo no espectro. A coroa parece pesar mesmo sem peso. Ele não saúda. Espera.\n\n— Estranho — diz, e a voz vem de todos os braseiros ao mesmo tempo. — O que vem buscar dos mortos é coisa que pertence aos vivos? Ou é o contrário? Cada visitante responde diferente. Responde.',
    classVariants: {
      barbaro: 'Antes de você responder, Durin levanta a mão. Ergue a barba do peito. Olha mais demorado. — *Korrundir.* Sua canção é mais antiga do que você sabe. — Ele não sorri, mas também não escurece. — Continue.',
    },
    choices: [
      {
        id: 'a2_k08_fragmento',
        label: 'Vim pelo Fragmento do Corpo, para impedir Vorthun.',
        outcome: {
          nextNodeId: 'a2_karn_09',
          effects: [{ kind: 'reputation', amount: 1 }],
        },
      },
      {
        id: 'a2_k08_mandaram',
        label: 'Vim porque me mandaram.',
        outcome: {
          nextNodeId: 'a2_karn_09',
          effects: [{ kind: 'reputation', amount: -1 }],
        },
      },
      {
        id: 'a2_k08_mago_brom',
        label: 'Recitar o nome de Brom.',
        classRequirement: 'mago',
        flagRequirement: { key: 'sabe_brom', equals: true },
        icon: 'class',
        outcome: {
          nextNodeId: 'a2_karn_09',
          effects: [
            { kind: 'reputation', amount: 2 },
            { kind: 'setFlag', key: 'durin_amistoso', value: true },
          ],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_09 — A Escolha da Prova
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_09',
    locationId: 'karn_tuhl',
    title: 'A Escolha da Prova',
    text: 'Durin se levanta. Os braseiros estremecem.\n\n— O Fragmento dorme atrás de mim, na pedra que era da Coroa. Para chegar a ele, você dá uma das três provas dos reis. **Força**: prove que pode segurar o que carrega. **Saber**: prove que entende o que pega. **Honra**: prove que merece o que pede.\n\nEle se volta para o trono e fica ao lado dele, esperando.',
    choices: [
      {
        id: 'a2_k09_forca',
        label: 'Prova da Força.',
        outcome: { nextNodeId: 'a2_karn_10a' },
      },
      {
        id: 'a2_k09_saber',
        label: 'Prova do Saber.',
        outcome: { nextNodeId: 'a2_karn_10b' },
      },
      {
        id: 'a2_k09_honra',
        label: 'Prova da Honra.',
        reputationRequirement: { min: 0 },
        flagRequirement: { key: 'salvou_npc', equals: true },
        outcome: { nextNodeId: 'a2_karn_10c' },
        disabledTooltip: 'Requer Reputação ≥ 0 e ter salvo algum NPC.',
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_10a — Prova da Força: Forja Animada
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_10a',
    locationId: 'karn_tuhl',
    title: 'A Forja Animada',
    text: 'A pedra atrás do trono se abre, e da abertura caminha uma forma alta — montante de armadura anã viva, peças que nunca foram um corpo único e que agora servem como um. As mãos da Forja Animada terminam em martelos. Os olhos são duas brasas de azul.',
    choices: [
      {
        id: 'a2_k10a_combate',
        label: 'Enfrentar a Forja Animada.',
        combat: {
          enemyId: 'combat_forja_animada',
          victoryOutcome: { nextNodeId: 'a2_karn_11' },
        },
        outcome: { nextNodeId: 'a2_karn_11' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_10b — Prova do Saber
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_10b',
    locationId: 'karn_tuhl',
    title: 'Prova do Saber',
    text: 'Durin coloca à sua frente, em cima do trono, três objetos: um anel sem inscrição, uma faca de cabo polido, e uma pedra cinza com uma única runa. Ele fala devagar:\n\n— Dois pertenceram a reis. Um, a um traidor. Os reis ainda estão nos objetos. O traidor, não. Aponte o objeto vazio.',
    choices: [
      {
        id: 'a2_k10b_apontar',
        label: 'Apontar para um objeto.',
        icon: 'dice',
        skillCheck: {
          skill: 'investigar',
          difficulty: 11,
          allowSorte: true,
          successOutcome: {
            nextNodeId: 'a2_karn_11',
            effects: [{ kind: 'reputation', amount: 1 }],
            narrationOverride: 'A faca brilha em rejeição — era do traidor. Durin assente.',
          },
          failureOutcome: {
            nextNodeId: 'a2_karn_10b',
            effects: [
              { kind: 'energy', amount: -3 },
              { kind: 'incrementFlag', key: 'tentativas_saber_karn', by: 1 },
            ],
            narrationOverride: 'Durin não pune; é a sala que pune o erro. Tente de novo.',
          },
        },
        outcome: { nextNodeId: 'a2_karn_10b' },
      },
      {
        id: 'a2_k10b_apontar_facil',
        label: 'Apontar para um objeto.',
        flagRequirement: { key: 'durin_amistoso', equals: true },
        icon: 'dice',
        skillCheck: {
          skill: 'investigar',
          difficulty: 9,
          allowSorte: true,
          successOutcome: {
            nextNodeId: 'a2_karn_11',
            effects: [{ kind: 'reputation', amount: 1 }],
            narrationOverride: 'A familiaridade que Durin sentiu abriu um caminho. A faca brilha em rejeição.',
          },
          failureOutcome: {
            nextNodeId: 'a2_karn_10b',
            effects: [{ kind: 'energy', amount: -3 }],
            narrationOverride: 'Não desta vez. A sala é paciente.',
          },
        },
        outcome: { nextNodeId: 'a2_karn_10b' },
      },
      {
        id: 'a2_k10b_barbaro_honra',
        label: 'Confessar não saber, pedir a Prova da Honra.',
        classRequirement: 'barbaro',
        reputationRequirement: { min: 0 },
        flagRequirement: { key: 'salvou_npc', equals: true },
        icon: 'class',
        outcome: { nextNodeId: 'a2_karn_10c' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_10c — Prova da Honra
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_10c',
    locationId: 'karn_tuhl',
    title: 'Prova da Honra',
    text: 'Durin se aproxima a um passo. Os braseiros baixam a luz, como se a sala quisesse ouvir melhor. Ele fala:\n\n— Você caminhou até aqui carregando o que carregou. Eu vi cada noite das suas. Os mortos veem assim — quietos. Diga em voz alta: a coisa de mais peso que você fez. E diga se faria de novo.',
    choices: [
      {
        id: 'a2_k10c_confessar_melhor',
        label: 'Confessar e prometer fazer melhor.',
        outcome: {
          nextNodeId: 'a2_karn_11',
          effects: [{ kind: 'reputation', amount: 2 }],
        },
      },
      {
        id: 'a2_k10c_confessar_denovo',
        label: 'Confessar e dizer que faria de novo.',
        outcome: {
          nextNodeId: 'a2_karn_11',
          effects: [{ kind: 'reputation', amount: 1 }],
        },
      },
      {
        id: 'a2_k10c_mentir',
        label: 'Mentir.',
        icon: 'dice',
        skillCheck: {
          skill: 'trapaca',
          difficulty: 13,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_karn_11',
            effects: [{ kind: 'reputation', amount: -2 }],
            narrationOverride: '"Durin sabe. Durin não fala." — mas ele deixa passar.',
          },
          failureOutcome: {
            nextNodeId: 'a2_karn_11',
            effects: [{ kind: 'reputation', amount: -3 }],
            narrationOverride: 'Durin te olha longamente. — Vá; o Fragmento ainda é necessário — diz, e se senta de volta.',
          },
        },
        outcome: { nextNodeId: 'a2_karn_11' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_11 — O Cofre dos Reis
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_11',
    locationId: 'karn_tuhl',
    title: 'O Cofre dos Reis',
    text: 'Atrás do trono, a pedra cede em camadas — três anéis girando lentamente em direções opostas — e revela uma câmara pequena onde só há uma coisa: o cristal. O Fragmento do Corpo é mais opaco que os outros, com cor de ferro recém-temperado. Está pesado mesmo antes de pesar.',
    choices: [
      {
        id: 'a2_k11_continuar',
        label: 'Continuar.',
        outcome: { nextNodeId: 'a2_karn_12' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_12 — O Fragmento do Corpo
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_12',
    locationId: 'karn_tuhl',
    title: 'O Fragmento do Corpo',
    text: 'Você toma o cristal. Ele esquenta. A sala toda esquenta um pouco — não desconfortável; vivo. Durin, que esteve em silêncio desde a prova, fala:\n\n— Os três pedaços vão se reconhecer. Volte ao mapa. Onde a estrada se cruza com a estrada, eles te chamam para juntar. Aquilo será a Égide. Aquilo será peso de verdade.',
    onEnter: [
      { kind: 'addKeyItem', keyItemId: 'frag_corpo' },
      { kind: 'reputation', amount: 1 },
    ],
    choices: [
      {
        id: 'a2_k12_perguntar',
        label: 'Perguntar a Durin sobre Vorthun.',
        outcome: {
          nextNodeId: 'a2_karn_13',
          effects: [{ kind: 'setFlag', key: 'sabe_nome_vorthun', value: true }],
          narrationOverride: 'Durin lembra de quando Vorthun ainda era humano, pelo nome verdadeiro: *"Tholan, o Que Lia em Voz Alta."* A lembrança o pesa.',
        },
      },
      {
        id: 'a2_k12_despedir',
        label: 'Despedir-se.',
        outcome: { nextNodeId: 'a2_karn_13' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_13 — Despedida
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_13',
    locationId: 'karn_tuhl',
    title: 'Despedida',
    text: 'Durin Pedraferro se senta de novo. Os braseiros começam a se apagar um a um, sem pressa. Antes do último apagar, ele ergue a mão direita: a saudação anã para um igual.\n\n— Vai com peso, estranho. Volta sem ele.',
    choices: [
      {
        id: 'a2_k13_barbaro',
        label: 'Continuar.',
        classRequirement: 'barbaro',
        flagRequirement: { key: 'cancao_korrundir', equals: true },
        outcome: { nextNodeId: 'a2_karn_14_barbaro' },
      },
      {
        id: 'a2_k13_mago',
        label: 'Continuar.',
        classRequirement: 'mago',
        outcome: { nextNodeId: 'a2_karn_15_mago' },
      },
      {
        id: 'a2_k13_ladino',
        label: 'Continuar.',
        classRequirement: 'ladino',
        outcome: { nextNodeId: 'a2_karn_16_ladino' },
      },
      {
        id: 'a2_k13_sair',
        label: 'Sair direto.',
        outcome: { nextNodeId: 'a2_karn_17' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_14_barbaro — A Reconciliação Totêmica
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_14_barbaro',
    locationId: 'karn_tuhl',
    title: 'A Reconciliação Totêmica',
    text: 'Antes de você sair, uma terceira figura translúcida desce do alto do salão. É um guerreiro de barba ruiva, jovem demais para o que carrega na expressão. Ele encara o seu machado totêmico longamente. Estende a mão. Você reconhece a tatuagem na palma: o nó de Korrundir, o mesmo da casa do seu pai.\n\n— Aqui também moramos — diz a aparição. — O exílio não acaba; muda de cara. Continua. Volta para casa um dia, mas continua.',
    onEnter: [
      { kind: 'reputation', amount: 1 },
      { kind: 'setFlag', key: 'honra_norte', value: true },
      { kind: 'sorte', amount: 2 },
    ],
    choices: [
      {
        id: 'a2_k14b_continuar',
        label: 'Continuar.',
        outcome: { nextNodeId: 'a2_karn_17' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_15_mago — Pergaminho Rúnico
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_15_mago',
    locationId: 'karn_tuhl',
    title: 'O Pergaminho Rúnico',
    text: 'Antes de sair, você nota um nicho lateral do salão, fechado por uma pedra que se mexe quando você se aproxima — não por magia óbvia; pela velha gentileza de uma sala que reconhece quem sabe ler. Dentro: um único pergaminho enrolado em couro escuro. Está intacto. As runas saltam para sua mente como se sempre tivessem morado lá.',
    choices: [
      {
        id: 'a2_k15m_ler',
        label: 'Ler o pergaminho.',
        icon: 'dice',
        skillCheck: {
          skill: 'arcano',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_karn_17',
            effects: [{ kind: 'addItem', itemId: 'pergaminho_de_brasa', quantity: 1 }],
            narrationOverride: 'O pergaminho se abre para você como coisa viva. Você o guarda com cuidado.',
          },
          failureOutcome: {
            nextNodeId: 'a2_karn_17',
            effects: [{ kind: 'energy', amount: -1 }],
            narrationOverride: 'A runa morde seus dedos. O pergaminho some em pó.',
          },
        },
        outcome: { nextNodeId: 'a2_karn_17' },
      },
      {
        id: 'a2_k15m_deixar',
        label: 'Deixar para outro estranho.',
        outcome: {
          nextNodeId: 'a2_karn_17',
          effects: [{ kind: 'reputation', amount: 1 }],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_16_ladino — O Cofre que Não Era de Rei
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_16_ladino',
    locationId: 'karn_tuhl',
    title: 'O Cofre Escondido',
    text: 'Quando os braseiros já se apagaram quase todos, você nota uma coisa que ninguém te apontou: uma fresta no rodapé do trono que não está alinhada com as outras. A fresta tem fechadura. A fechadura tem um trinco do tipo que você reconhece de longe — fechadura de tesouro pessoal, não de coroa.',
    choices: [
      {
        id: 'a2_k16l_abrir',
        label: 'Abrir.',
        icon: 'dice',
        skillCheck: {
          skill: 'furtividade',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_karn_17',
            effects: [
              { kind: 'addItem', itemId: 'anel_de_brom', quantity: 1 },
              { kind: 'reputation', amount: -1 },
            ],
            narrationOverride: 'Dentro: um anel de bronze que brilha ao toque. Você o guarda e não menciona isso em voz alta.',
          },
          failureOutcome: {
            nextNodeId: 'a2_karn_18',
            narrationOverride: 'Um alarme antigo soa nas paredes. Um esqueleto desperta.',
          },
        },
        combat: {
          enemyId: 'esqueleto_anao',
          victoryOutcome: { nextNodeId: 'a2_karn_17' },
        },
        outcome: { nextNodeId: 'a2_karn_17' },
      },
      {
        id: 'a2_k16l_deixar',
        label: 'Deixar.',
        outcome: {
          nextNodeId: 'a2_karn_17',
          effects: [{ kind: 'reputation', amount: 1 }],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_17 — Visão Profética (trigger automático)
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_17',
    locationId: 'karn_tuhl',
    title: 'A Égide Desperta',
    text: 'Os três cristais, no seu bolso, decidem que está na hora. Esquentam todos juntos. Quando você os tira para olhar, eles flutuam um a um até parar a meia-altura, formando um triângulo. Há uma centelha entre eles. A centelha cresce devagar. Cresce até virar um amuleto de bronze fundido com três janelas pulsantes.\n\nA Égide de Solgar está em sua mão pela primeira vez em quinhentos anos.\n\nNo mesmo instante, no horizonte, uma estrela morta abre o olho.',
    onEnter: [
      { kind: 'removeKeyItem', keyItemId: 'frag_vida' },
      { kind: 'removeKeyItem', keyItemId: 'frag_mente' },
      { kind: 'removeKeyItem', keyItemId: 'frag_corpo' },
      { kind: 'addKeyItem', keyItemId: 'egide_solgar' },
      { kind: 'setFlag', key: 'egide_forjada', value: true },
      { kind: 'unlockAchievement', achievementId: 'all_fragments' },
    ],
    choices: [
      {
        id: 'a2_k17_continuar',
        label: 'Continuar.',
        outcome: { nextNodeId: 'a2_karn_18' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_18 — Esqueleto Solitário (opcional)
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_18',
    locationId: 'karn_tuhl',
    title: 'O Esqueleto Solitário',
    text: 'No corredor de saída, um único esqueleto ainda está em pé, encostado numa parede como se descansasse. Ele acorda quando você passa. Não te ataca de imediato. Estende a mão para a sua bolsa, hesita, e nessa hesitação parece quase humano.',
    choices: [
      {
        id: 'a2_k18_atacar',
        label: 'Atacar.',
        combat: {
          enemyId: 'esqueleto_anao',
          victoryOutcome: {
            nextNodeId: 'a2_karn_19',
            effects: [{ kind: 'gold', amount: 5 }],
          },
        },
        outcome: { nextNodeId: 'a2_karn_19' },
      },
      {
        id: 'a2_k18_passar',
        label: 'Passar de lado, devagar.',
        icon: 'dice',
        skillCheck: {
          skill: 'furtividade',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_karn_19',
            narrationOverride: 'Você desliza pela beira da parede. O esqueleto não acorda mais.',
          },
          failureOutcome: {
            nextNodeId: 'a2_karn_19',
            narrationOverride: 'O esqueleto acorda. Combate.',
          },
        },
        combat: {
          enemyId: 'esqueleto_anao',
          victoryOutcome: { nextNodeId: 'a2_karn_19' },
        },
        outcome: { nextNodeId: 'a2_karn_19' },
      },
      {
        id: 'a2_k18_moeda',
        label: 'Deixar uma moeda na mão dele.',
        outcome: {
          nextNodeId: 'a2_karn_19',
          effects: [
            { kind: 'gold', amount: -1 },
            { kind: 'reputation', amount: 1 },
          ],
          narrationOverride: 'O esqueleto fecha a mão e dorme de novo.',
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_19 — Respiro de Sorte (Forja Antiga)
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_19',
    locationId: 'karn_tuhl',
    title: 'A Forja Antiga',
    text: 'Antes do portão de saída, você passa por um nicho que não passou na entrada — ou passou, e não viu. Uma forja menor, esquecida. As brasas no fundo dela ainda estão acesas, contra todas as possibilidades. Há um banco de pedra ao lado. Quem o cavou na pedra colocou também encosto: pensaram em quem ia sentar.\n\nVocê senta. O calor entra pelos ossos. Por um instante, o frio parece coisa de outro tempo.',
    choices: [
      {
        id: 'a2_k19_descansar',
        label: 'Descansar aqui.',
        flagRequirement: { key: 'respiro_ato2_usado', exists: false },
        outcome: {
          nextNodeId: 'a2_karn_20',
          effects: [
            { kind: 'restoreRespiro', type: 'both' },
            { kind: 'setFlag', key: 'respiro_ato2_usado', value: true },
          ],
        },
      },
      {
        id: 'a2_k19_descansar_bloqueado',
        label: 'Descansar aqui.',
        flagRequirement: { key: 'respiro_ato2_usado', equals: true },
        disabled: true,
        disabledTooltip: 'Você já usou o Respiro deste ato.',
        outcome: { nextNodeId: 'a2_karn_20' },
      },
      {
        id: 'a2_k19_seguir',
        label: 'Levantar e seguir; reservo o fôlego.',
        outcome: { nextNodeId: 'a2_karn_20' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_20 — Saída de Karn-Tuhl
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_20',
    locationId: 'karn_tuhl',
    title: 'Saída de Karn-Tuhl',
    text: 'O Portão se fecha atrás de você sozinho. Você ouve o som — pedra contra pedra — e por um momento o som lembra de algo que não era som: um aceno.\n\nA neve antiga cobre seus passos no caminho de volta. O Mapa abre na sua mão. Os três fragmentos respondem uns aos outros agora, baixinho, como gente conversando do outro lado da parede.',
    onEnter: [
      { kind: 'setFlag', key: 'karn_concluido', value: true },
    ],
    isMap: true,
    choices: [
      {
        id: 'a2_k20_egide',
        label: 'A Égide se forma.',
        flagRequirement: [
          { key: 'mirthwood_concluido', equals: true },
          { key: 'bramford_concluido', equals: true },
          { key: 'egide_forjada', exists: false },
        ],
        outcome: { nextNodeId: 'a2_karn_21' },
      },
      {
        id: 'a2_k20_cidadela',
        label: 'Seguir para a Cidadela das Sombras.',
        flagRequirement: { key: 'egide_forjada', equals: true },
        icon: 'map',
        outcome: { nextNodeId: 'a3_cidadela_01' },
      },
      {
        id: 'a2_k20_mirthwood',
        label: 'Seguir para Mirthwood.',
        flagRequirement: { key: 'mirthwood_concluido', exists: false },
        icon: 'map',
        outcome: { nextNodeId: 'a2_mirthwood_01' },
      },
      {
        id: 'a2_k20_bramford',
        label: 'Seguir para Bramford.',
        flagRequirement: { key: 'bramford_concluido', exists: false },
        icon: 'map',
        outcome: { nextNodeId: 'a2_bramford_01' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_karn_21 ★ — A Égide Forjada
  // ─────────────────────────────────────────────
  {
    id: 'a2_karn_21',
    locationId: 'karn_tuhl',
    title: 'A Égide Forjada',
    text: 'No alto do desfiladeiro, com Karn-Tuhl ficando para trás, os três cristais decidem juntos. Esquentam. Saltam do seu bolso e flutuam um a um, formando um triângulo no ar à sua frente. A centelha entre eles cresce. Vira fogo. Vira metal. Vira amuleto.\n\nA Égide de Solgar repousa, finalmente, na sua palma. Ela é mais leve do que você esperava. Mais quente também. E mais triste — como se reconhecesse o trabalho que ainda tem pela frente.\n\nO Mapa, no seu bolso, abre sozinho. No centro dele, onde antes havia uma mancha de tinta velha, agora pulsa um ponto vermelho fraco, em um vale que ninguém marcou: a **Cidadela das Sombras**.',
    onEnter: [
      { kind: 'removeKeyItem', keyItemId: 'frag_vida' },
      { kind: 'removeKeyItem', keyItemId: 'frag_mente' },
      { kind: 'removeKeyItem', keyItemId: 'frag_corpo' },
      { kind: 'addKeyItem', keyItemId: 'egide_solgar' },
      { kind: 'setFlag', key: 'egide_forjada', value: true },
      { kind: 'unlockAchievement', achievementId: 'all_fragments' },
    ],
    choices: [
      {
        id: 'a2_k21_cidadela',
        label: 'Seguir para a Cidadela das Sombras.',
        outcome: { nextNodeId: 'a3_cidadela_01' },
      },
    ],
  },
]
