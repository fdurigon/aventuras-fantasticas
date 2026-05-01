import type { NarrativeNode } from '../../types'

export const ACT2_FLORESTA_NODES: NarrativeNode[] = [
  // ─────────────────────────────────────────────
  // a2_mirthwood_01 ★ — Entrada da Floresta
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_01',
    locationId: 'mirthwood',
    title: 'Entrada da Floresta',
    imageId: 'scenes/mirthwood_entry.webp',
    text: 'Mirthwood não começa nas árvores — começa três passos antes delas. O ar engrossa, ganha cheiro de musgo molhado e cogumelo doce. As runas no arco de carvalho retorcido brilham com a fadiga de uma brasa esquecida. Folhas que deviam ter caído no outono passado seguem penduradas, secas mas teimosas. O silêncio daqui não é ausência de som; é som contido, como uma plateia esperando alguém falar.\n\nVocê pisa nas pedras musgosas do caminho. Quando olha para trás, a estrada já parece distante demais para a quantidade de passos que deu.',
    choices: [
      {
        id: 'a2_m01_caminho',
        label: 'Seguir o caminho principal.',
        outcome: { nextNodeId: 'a2_mirthwood_02' },
      },
      {
        id: 'a2_m01_trilha',
        label: 'Procurar uma trilha lateral.',
        icon: 'dice',
        skillCheck: {
          skill: 'investigar',
          difficulty: 9,
          allowSorte: true,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_03',
            effects: [{ kind: 'setFlag', key: 'pulou_fadas', value: true }],
            narrationOverride: 'Você encontra uma vereda quase invisível entre os fetos. Ela contorna a trilha principal e chega direto na cabana da Velha Garra.',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_02',
            effects: [{ kind: 'energy', amount: -1 }],
            narrationOverride: 'A vereda termina num atoleiro. Você volta para o caminho principal, um pouco mais cansado e coberto de lama.',
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_02' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_02 — As Três Que Esperam
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_02',
    locationId: 'mirthwood',
    title: 'As Três Que Esperam',
    text: 'Três luzinhas pendem no ar à altura dos seus olhos, cada uma do tamanho de um punho fechado. Pousam sobre a curva onde o caminho some entre os fetos. A azul fala primeiro, e a voz é de menina muito velha:\n\n— Andarilho, andarilho. Mirthwood pede pedágio. Não em ouro: em escolha.\n\nA vermelha ri sem parar de rir.\n\n— Diga uma verdade que custe, ou conte uma mentira que sirva, ou abra a bolsa.\n\nA verde não fala. Apenas observa, e algo na maneira como observa lembra você de quando o Mestre Arvendel lia páginas pelas costas das pessoas.',
    choices: [
      {
        id: 'a2_m02_verdade',
        label: 'Falar uma verdade que custe.',
        icon: 'dice',
        skillCheck: {
          skill: 'persuadir',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_03',
            effects: [
              { kind: 'reputation', amount: 1 },
              { kind: 'setFlag', key: 'fadas_amistosas', value: true },
            ],
            narrationOverride: 'As fadas escutam em silêncio. A azul assente devagar. Você passa.',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_03',
            effects: [{ kind: 'energy', amount: -1 }],
            narrationOverride: 'A verdade dói também em quem a ouve. A vermelha ri mais alto um instante, depois para. Você passa, mas com um fio a menos em você.',
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_03' },
      },
      {
        id: 'a2_m02_mentira',
        label: 'Inventar uma boa história.',
        icon: 'dice',
        skillCheck: {
          skill: 'trapaca',
          difficulty: 11,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_03',
            effects: [
              { kind: 'setFlag', key: 'fadas_amistosas', value: true },
              { kind: 'addItem', itemId: 'erva_sombra', quantity: 1 },
            ],
            narrationOverride: 'A história é tão boa que a verde finalmente ri. Elas te deixam passar e a azul te desliza na mão um maço de erva como gorjeta.',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_03',
            effects: [{ kind: 'energy', amount: -2 }],
            narrationOverride: 'A verde percebe o fio falso na história. A vermelha para de rir. Elas puxam um fio de ti — não a história, algo mais antigo — antes de te deixar passar.',
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_03' },
      },
      {
        id: 'a2_m02_pagar',
        label: 'Pagar o pedágio.',
        outcome: {
          nextNodeId: 'a2_mirthwood_03',
          effects: [{ kind: 'gold', amount: -10 }],
        },
      },
      {
        id: 'a2_m02_barbaro',
        label: 'Atravessar à força.',
        classRequirement: 'barbaro',
        icon: 'class',
        skillCheck: {
          skill: 'atletismo',
          difficulty: 11,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_03',
            effects: [{ kind: 'reputation', amount: -1 }],
            narrationOverride: 'Você passa como tempestade. As fadas se dispersam, furiosas mas impotentes.',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_03',
            narrationOverride: 'Uma sombra do bosque se materializa e você a derrota, mas sai do confronto com muito mais respeito pelas fadas.',
          },
        },
        combat: {
          enemyId: 'sombra_bosque',
          victoryOutcome: { nextNodeId: 'a2_mirthwood_03' },
        },
        outcome: { nextNodeId: 'a2_mirthwood_03' },
      },
      {
        id: 'a2_m02_mago',
        label: 'Reconhecer a magia das fadas.',
        classRequirement: 'mago',
        icon: 'class',
        skillCheck: {
          skill: 'arcano',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_03',
            effects: [
              { kind: 'sorte', amount: 2 },
              { kind: 'setFlag', key: 'bencao_verde', value: true },
            ],
            narrationOverride: 'Você nomeia cada fada pelo tipo de magia que carrega. A verde se curva levemente. As três se afastam e você passa com a bênção da floresta.',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_02',
            effects: [],
            narrationOverride: 'A magia é mais antiga que seus livros. As fadas soriem com paciência. Tente outra abordagem.',
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_03' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_03 — Cabana da Velha Garra
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_03',
    locationId: 'mirthwood',
    title: 'Cabana da Velha Garra',
    text: 'A cabana de Velha Garra encosta num carvalho como uma criança encostada na mãe. Tem mais musgo do que telhado e mais ervas penduradas do que parede. A porta está aberta. Quando você cruza o batente, a velha já está virada para a panela, e fala sem se voltar:\n\n— Sentou? Bebe.\n\nHá duas xícaras na mesa. Uma fumega. A outra não. Ela aponta para a que fumega com a colher. Olhos cinzentos, finos. Quase translúcidos.\n\n— Sei o que você procura. Sei quem o mandou. E sei que Mirthwood não está bem. — Ela bate a colher na borda da panela. — Korvath caiu, garoto/a. Caiu no fundo onde ainda tem fundo. Vai ter que descer atrás.',
    choices: [
      {
        id: 'a2_m03_caminho',
        label: 'Pedir o caminho até Korvath.',
        outcome: { nextNodeId: 'a2_mirthwood_04' },
      },
      {
        id: 'a2_m03_comprar',
        label: 'Comprar ervas.',
        outcome: { nextNodeId: 'a2_mirthwood_03' },
      },
      {
        id: 'a2_m03_sombra',
        label: 'Perguntar sobre a oferta sombria.',
        flagRequirement: [
          { key: 'fadas_amistosas', equals: true },
        ],
        outcome: {
          nextNodeId: 'a2_mirthwood_03',
          effects: [{ kind: 'setFlag', key: 'sabe_sobre_selo', value: true }],
        },
      },
      {
        id: 'a2_m03_sombra_rep',
        label: 'Perguntar sobre a oferta sombria.',
        reputationRequirement: { max: -1 },
        flagRequirement: { key: 'sabe_sobre_selo', exists: false },
        outcome: {
          nextNodeId: 'a2_mirthwood_03',
          effects: [{ kind: 'setFlag', key: 'sabe_sobre_selo', value: true }],
        },
      },
      {
        id: 'a2_m03_despedir',
        label: 'Despedir-se.',
        outcome: { nextNodeId: 'a2_mirthwood_04' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_04 — Trilha Sagrada
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_04',
    locationId: 'mirthwood',
    title: 'A Trilha Sagrada',
    text: 'A trilha se abre em três línguas a poucos passos da cabana. À esquerda, um corredor de pinheiros tão silenciosos que o silêncio começa a doer. À frente, um riacho que canta — sim, canta, em vogais que quase formam palavras. À direita, lápides de pedra musgosa marcam um cemitério druídico que respira devagar.\n\nVelha Garra disse: "Os três levam ao mesmo lugar. Mas cada um cobra um preço diferente, e dá um presente diferente." Você escolhe.',
    choices: [
      {
        id: 'a2_m04_pinheiros',
        label: 'O corredor de pinheiros silenciosos.',
        outcome: { nextNodeId: 'a2_mirthwood_05a' },
      },
      {
        id: 'a2_m04_riacho',
        label: 'O riacho que canta.',
        outcome: { nextNodeId: 'a2_mirthwood_05b' },
      },
      {
        id: 'a2_m04_tumulos',
        label: 'Os túmulos antigos.',
        outcome: { nextNodeId: 'a2_mirthwood_05c' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_05a — O Corredor de Pinheiros
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_05a',
    locationId: 'mirthwood',
    title: 'O Corredor de Pinheiros',
    text: 'O silêncio aqui é objeto. Você pode ouvir seus próprios olhos piscarem. No meio do corredor, encurvado entre dois troncos, há um veado branco. Uma flecha de sombra atravessa-lhe o flanco. A flecha não tem haste — apenas a forma de uma haste, feita de fumaça que não se dissipa. O veado olha para você com olhos antigos demais para um animal.',
    choices: [
      {
        id: 'a2_m05a_arrancar',
        label: 'Tentar arrancar a flecha.',
        icon: 'dice',
        skillCheck: {
          skill: 'arcano',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_06',
            effects: [
              { kind: 'sorte', amount: 2 },
              { kind: 'setFlag', key: 'bencao_floresta', value: true },
            ],
            narrationOverride: 'Você sussurra as palavras certas e a flecha se dissolve. O veado se ergue, caminha até você e toca a sua testa com o focinho. Algo quente corre pela sua espinha.',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_06',
            effects: [{ kind: 'energy', amount: -2 }],
            narrationOverride: 'A flecha morde sua mão como gelo vivo. Você a solta com um grito baixo. O veado olha para você um momento longo, e então se vai para o escuro entre as árvores.',
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_06' },
      },
      {
        id: 'a2_m05a_acabar',
        label: 'Acabar com o sofrimento dele.',
        outcome: {
          nextNodeId: 'a2_mirthwood_06',
          effects: [
            { kind: 'reputation', amount: -1 },
            { kind: 'addItem', itemId: 'chifre_lunar', quantity: 1 },
            { kind: 'setFlag', key: 'feriu_sagrado', value: true },
          ],
        },
      },
      {
        id: 'a2_m05a_deixar',
        label: 'Deixar o veado em paz e seguir.',
        outcome: { nextNodeId: 'a2_mirthwood_06' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_05b — O Riacho que Canta
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_05b',
    locationId: 'mirthwood',
    title: 'O Riacho que Canta',
    text: 'A água canta na sua direção, devagar, como mulher cantando para criança que não dorme. Quando você se aproxima, uma figura se desprende da margem — pele de casca, cabelos de musgo, olhos de água parada. A driada estende a mão.\n\n— Bebe — ela diz. — Mas, se beber, paga.',
    choices: [
      {
        id: 'a2_m05b_beber',
        label: 'Beber e pagar a sede da floresta.',
        outcome: {
          nextNodeId: 'a2_mirthwood_06',
          effects: [
            { kind: 'energy', amount: 6 },
            { kind: 'sorte', amount: 2 },
            { kind: 'removeKeyItem', keyItemId: 'selo_sombrio' },
          ],
        },
      },
      {
        id: 'a2_m05b_recusar',
        label: 'Recusar com cortesia.',
        icon: 'dice',
        skillCheck: {
          skill: 'persuadir',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_06',
            effects: [{ kind: 'addItem', itemId: 'pocao_cura', quantity: 1 }],
            narrationOverride: 'A driada ri como água sobre pedra e te entrega uma poção de cura antes de voltar para a margem.',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_06',
            effects: [{ kind: 'reputation', amount: -1 }],
            narrationOverride: 'Ela considera o gesto rude. A margem some na névoa sem uma palavra.',
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_06' },
      },
      {
        id: 'a2_m05b_ladino',
        label: 'Encher o cantil sem ser vista.',
        classRequirement: 'ladino',
        icon: 'class',
        skillCheck: {
          skill: 'furtividade',
          difficulty: 11,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_06',
            effects: [{ kind: 'addItem', itemId: 'pocao_cura', quantity: 2 }],
            narrationOverride: 'Você enche o cantil sem fazer som. A floresta vê, mas a floresta não diz nada. Por ora.',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_06',
            narrationOverride: 'A driada te vê. Uma sombra do bosque surge da margem.',
          },
        },
        combat: {
          enemyId: 'sombra_bosque',
          victoryOutcome: { nextNodeId: 'a2_mirthwood_06' },
        },
        outcome: { nextNodeId: 'a2_mirthwood_06' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_05c — Os Túmulos Antigos
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_05c',
    locationId: 'mirthwood',
    title: 'Os Túmulos Antigos',
    text: 'As lápides são tão velhas que viraram parte das árvores. Em uma delas, um espírito sentado, com os pés enterrados no próprio túmulo, lê um livro que não está lá. Ergue os olhos quando você se aproxima.\n\n— Diga em voz alta — a voz dele é eco — por que veio. Sem floreios. Sem mentira. Os mortos não comem mentira.',
    choices: [
      {
        id: 'a2_m05c_verdade',
        label: 'Vim atrás do Fragmento da Vida para impedir Vorthun.',
        outcome: {
          nextNodeId: 'a2_mirthwood_06',
          effects: [
            { kind: 'reputation', amount: 1 },
            { kind: 'addKeyItem', keyItemId: 'chave_de_raiz' },
          ],
        },
      },
      {
        id: 'a2_m05c_devem',
        label: 'Vim atrás do que me devem.',
        outcome: {
          nextNodeId: 'a2_mirthwood_06',
          effects: [{ kind: 'reputation', amount: -1 }],
        },
      },
      {
        id: 'a2_m05c_mago',
        label: 'Falar a verdade nas runas druídicas.',
        classRequirement: 'mago',
        icon: 'class',
        outcome: {
          nextNodeId: 'a2_mirthwood_06',
          effects: [
            { kind: 'reputation', amount: 2 },
            { kind: 'addItem', itemId: 'pergaminho_de_raiz', quantity: 1 },
          ],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_06 — O Bosque Profanado
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_06',
    locationId: 'mirthwood',
    title: 'O Bosque Profanado',
    imageId: 'scenes/korvath.webp',
    text: 'Os três caminhos se encontram numa clareira que não devia existir. As árvores aqui têm cor de carne queimada e uma seiva preta como tinta. No centro, um círculo de pedras druídicas, todas tombadas para o mesmo lado, como se fugissem de algo no meio. Onde o "meio" devia estar, há um homem ajoelhado de costas para você, vestido de verde podre. Ele não se vira ainda.\n\nAntes que ele se vire, três sombras com forma de cervo levantam-se das pedras tombadas.',
    choices: [
      {
        id: 'a2_m06_atacar',
        label: 'Atacar antes que cerquem.',
        outcome: { nextNodeId: 'a2_mirthwood_07' },
      },
      {
        id: 'a2_m06_ladino_surpresa',
        label: 'Tentar um ataque-surpresa.',
        classRequirement: 'ladino',
        icon: 'class',
        skillCheck: {
          skill: 'furtividade',
          difficulty: 11,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_07',
            effects: [{ kind: 'setFlag', key: 'ataque_surpresa_korvath', value: true }],
            narrationOverride: 'Você se move entre as sombras como sombra. O ataque vem antes que elas se organizem.',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_07',
            narrationOverride: 'Um galho seco denuncia sua posição. As sombras cervas se voltam.',
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_07' },
      },
      {
        id: 'a2_m06_chave_raiz',
        label: 'Usar a Chave de Raiz para entrar direto.',
        itemRequirement: 'chave_de_raiz',
        outcome: {
          nextNodeId: 'a2_mirthwood_08',
          narrationOverride: 'A Chave de Raiz brilha em sua mão e um caminho entre as pedras se abre. As sombras cervas se congelam, incapazes de te bloquear. Você passa direto até Korvath.',
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_07 — Combate: Sombras do Bosque
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_07',
    locationId: 'mirthwood',
    title: 'As Sombras do Bosque',
    text: 'Três sombras cervas avançam. O ar resfria vinte graus em um segundo. Você levanta as armas.',
    choices: [
      {
        id: 'a2_m07_combate',
        label: 'Enfrentar as sombras.',
        combat: {
          enemyId: 'sombra_bosque',
          victoryOutcome: {
            nextNodeId: 'a2_mirthwood_08',
            narrationOverride: 'A última sombra cerva se desfaz em fumaça de carvão.',
          },
          modifiers: {
            enemyEnergyBonus: 4,
            enemyHabilidadeBonus: 1,
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_08' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_08 — Korvath se Volta
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_08',
    locationId: 'mirthwood',
    title: 'Korvath se Volta',
    imageId: 'scenes/korvath.webp',
    text: 'A última sombra desfaz-se em fumaça de carvão e o homem em verde podre finalmente se levanta. Os galhos da coroa de antlers em sua cabeça são pretos, vivos, e crescem alguns centímetros enquanto você o olha. O rosto é jovem; os olhos não.\n\n— Eu não pedi por isso — diz Korvath. — Pedi pela floresta. Mas ela aceitou. E quem aceita o trato escuta a voz que oferece. — Ele sorri, e o sorriso é cansado. — Você veio pelo Fragmento. Ele está em mim. Tira, se puder. Ou ouve, se preferir ouvir.',
    choices: [
      {
        id: 'a2_m08_ouvir',
        label: 'Ouvir o que ele tem a dizer.',
        outcome: { nextNodeId: 'a2_mirthwood_09' },
      },
      {
        id: 'a2_m08_atacar',
        label: 'Acabar com isso. Atacar.',
        outcome: { nextNodeId: 'a2_mirthwood_11a' },
      },
      {
        id: 'a2_m08_mago_pacto',
        label: 'Reconhecer o pacto que o tomou.',
        classRequirement: 'mago',
        icon: 'class',
        skillCheck: {
          skill: 'arcano',
          difficulty: 11,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_09',
            effects: [{ kind: 'setFlag', key: 'pacto_reversivel', value: true }],
            narrationOverride: 'Você reconhece a estrutura do feitiço: um lacete de camadas, não uma prisão definitiva. Ele pode ser desfeito — se Korvath cooperar.',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_09',
            narrationOverride: 'A magia é mais antiga do que qualquer coisa que você leu. Você vai ouvir mesmo assim.',
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_09' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_09 — Tentar Redimir
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_09',
    locationId: 'mirthwood',
    title: 'O Conto de Korvath',
    text: 'Korvath conta — em frases que param no meio — como uma voz veio nas raízes, ofereceu salvar Mirthwood do mofo que vinha do oeste, e cobrou em troca apenas "uma camada de você". Ele aceitou. Não percebeu, na primeira camada, que não era a última.\n\nVocê sente, atrás de tudo, a mesma voz tentando alcançá-lo a partir do verde podre dele.',
    choices: [
      {
        id: 'a2_m09_convencer',
        label: 'Convencê-lo a renunciar ao pacto.',
        icon: 'dice',
        skillCheck: {
          skill: 'persuadir',
          difficulty: 13,
          allowSorte: true,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_11b',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_11a',
            effects: [{ kind: 'setFlag', key: 'korvath_enraivecido', value: true }],
            narrationOverride: 'As palavras chegam perto demais da voz que está dentro dele. Ela reage. Os antlers pretos crescem um centímetro. — Não — ele diz, e não é a voz dele. — Não assim.',
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_11a' },
      },
      {
        id: 'a2_m09_convencer_facil',
        label: 'Convencê-lo a renunciar ao pacto. (Pacto reversível)',
        icon: 'dice',
        flagRequirement: { key: 'pacto_reversivel', equals: true },
        skillCheck: {
          skill: 'persuadir',
          difficulty: 11,
          allowSorte: true,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_11b',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_11a',
            effects: [{ kind: 'setFlag', key: 'korvath_enraivecido', value: true }],
            narrationOverride: 'Você chegou perto. Mas não perto o suficiente.',
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_11a' },
      },
      {
        id: 'a2_m09_forca',
        label: 'Tomar o Fragmento à força.',
        outcome: { nextNodeId: 'a2_mirthwood_11a' },
      },
      {
        id: 'a2_m09_barbaro',
        label: 'Falar de exílio.',
        classRequirement: 'barbaro',
        icon: 'class',
        skillCheck: {
          skill: 'intimidar',
          difficulty: 11,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_11b',
            narrationOverride: 'Você fala de exílio sem enfeite. Korvath escuta. Algo no rosto dele que era voz-alheia recua um passo.',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_11a',
            narrationOverride: 'A voz dentro dele não conhece exílio. Ela conhece só o pacto.',
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_11a' },
      },
      {
        id: 'a2_m09_ladino',
        label: 'Mentir que o pacto pode ser refeito.',
        classRequirement: 'ladino',
        icon: 'class',
        skillCheck: {
          skill: 'trapaca',
          difficulty: 11,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_11b',
            effects: [
              { kind: 'reputation', amount: -1 },
              { kind: 'setFlag', key: 'mentiu_korvath', value: true },
            ],
            narrationOverride: 'A mentira é convincente o suficiente. Korvath acredita, e a crença dele é suficiente para enfraquecer a voz por um momento crucial.',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_11a',
            narrationOverride: 'A voz dentro de Korvath ri da sua tentativa.',
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_11a' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_11a — Combate Korvath
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_11a',
    locationId: 'mirthwood',
    title: 'O Druida Corrompido',
    text: 'Korvath ergue as mãos. Os antlers pretos dobram de tamanho. A voz que fala por ele é fria como raiz de inverno.',
    choices: [
      {
        id: 'a2_m11a_combate',
        label: 'Enfrentá-lo.',
        combat: {
          enemyId: 'combat_korvath',
          victoryOutcome: {
            nextNodeId: 'a2_mirthwood_12_morto',
          },
          modifiers: {
            enemyHabilidadeBonus: 1,
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_12_morto' },
      },
      {
        id: 'a2_m11a_combate_normal',
        label: 'Enfrentá-lo.',
        flagRequirement: { key: 'korvath_enraivecido', exists: false },
        combat: {
          enemyId: 'combat_korvath',
          victoryOutcome: {
            nextNodeId: 'a2_mirthwood_12_morto',
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_12_morto' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_11b — Korvath Redimido
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_11b',
    locationId: 'mirthwood',
    title: 'Korvath Redimido',
    text: 'Algo se desfaz no rosto de Korvath, devagar — como uma máscara que ele não sabia que usava. Os antlers pretos murcham, ficam galhos comuns, caem com um chocalho seco. Ele tomba de joelhos. Tira do peito o Fragmento da Vida — uma lasca de cristal verde que pulsa como veia — e estende para você com as duas mãos.\n\n— Cuide dela melhor do que eu — diz, e não está claro se fala do fragmento ou da floresta. — Eu fico. Vou tentar curar o que profanei.',
    onEnter: [
      { kind: 'reputation', amount: 2 },
      { kind: 'setFlag', key: 'korvath_vivo', value: true },
      { kind: 'addKeyItem', keyItemId: 'frag_vida' },
    ],
    choices: [
      {
        id: 'a2_m11b_seguir',
        label: 'Continuar.',
        outcome: { nextNodeId: 'a2_mirthwood_12_redimido' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_12_morto — A Coroa que Sobra
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_12_morto',
    locationId: 'mirthwood',
    title: 'A Coroa que Sobra',
    text: 'Korvath cai. Os antlers pretos rachados estalam com um som de gelo cedendo. Onde o peito devia continuar peito, há agora um pequeno cristal verde, do tamanho de uma pera, pulsando como veia. Você o pega. O cristal está morno.\n\nAlgo, na coroa quebrada, ainda observa você. E fala sem boca.\n\n*— Há uma camada do dele que ele não usou. Posso te oferecer. Aceita?*',
    onEnter: [
      { kind: 'addKeyItem', keyItemId: 'frag_vida' },
      { kind: 'reputation', amount: 1 },
    ],
    choices: [
      {
        id: 'a2_m12_aceitar_selo',
        label: 'Aceitar o Selo Sombrio.',
        outcome: {
          nextNodeId: 'a2_mirthwood_13',
          effects: [
            { kind: 'addKeyItem', keyItemId: 'selo_sombrio' },
            { kind: 'reputation', amount: -3 },
            { kind: 'setFlag', key: 'selo_mirthwood', value: true },
          ],
        },
      },
      {
        id: 'a2_m12_recusar_selo',
        label: 'Recusar o Selo.',
        outcome: {
          nextNodeId: 'a2_mirthwood_13',
          effects: [
            { kind: 'reputation', amount: 1 },
            { kind: 'setFlag', key: 'recusou_selo_mirthwood', value: true },
          ],
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_12_redimido — A Coroa que Resta
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_12_redimido',
    locationId: 'mirthwood',
    title: 'A Coroa que Resta',
    text: 'Os galhos pretos jazem no chão como coisas mortas. Korvath, ajoelhado, pousa a mão no centro da pedra druídica e fica em silêncio. Você olha para o cristal verde na sua palma, depois para ele.\n\nNão há voz oferecendo nada desta vez. Mas a sombra entre as raízes ainda observa.',
    choices: [
      {
        id: 'a2_m12r_seguir',
        label: 'Continuar.',
        outcome: { nextNodeId: 'a2_mirthwood_13' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_13 — Respiro de Sorte (Cabana de Velha Garra)
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_13',
    locationId: 'mirthwood',
    title: 'De Volta à Cabana',
    text: 'A cabana de Velha Garra continua exatamente onde estava — só você é que mudou. Há de novo duas xícaras na mesa. Desta vez, ambas fumegam. A velha aponta para a sua. Senta. Você senta.\n\n— Carrega muita coisa, garoto/a. Bebe. Coisa de chá é descansar antes da próxima tempestade. — Ela sorri e o sorriso tem mais dentes do que dentes. — Bebe.',
    choices: [
      {
        id: 'a2_m13_descansar',
        label: 'Descansar aqui.',
        flagRequirement: { key: 'respiro_ato2_usado', exists: false },
        outcome: {
          nextNodeId: 'a2_mirthwood_14',
          effects: [
            { kind: 'restoreRespiro', type: 'both' },
            { kind: 'setFlag', key: 'respiro_ato2_usado', value: true },
          ],
        },
      },
      {
        id: 'a2_m13_descansar_bloqueado',
        label: 'Descansar aqui.',
        flagRequirement: { key: 'respiro_ato2_usado', equals: true },
        disabled: true,
        disabledTooltip: 'Você já usou o Respiro deste ato.',
        outcome: { nextNodeId: 'a2_mirthwood_14' },
      },
      {
        id: 'a2_m13_seguir',
        label: 'Agradecer e seguir adiante.',
        outcome: { nextNodeId: 'a2_mirthwood_14' },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_14 — A Runa Sob a Cabana (Mago exclusivo)
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_14',
    locationId: 'mirthwood',
    title: 'A Runa Sob a Cabana',
    text: 'Ao se levantar, você nota algo: uma das tábuas do chão da cabana tem uma runa quase apagada. Velha Garra acompanha o seu olhar e ergue uma sobrancelha.\n\n— Vê isso, é? Bom. Pega. Estava esperando alguém que enxergasse.',
    choices: [
      {
        id: 'a2_m14_decifrar',
        label: 'Decifrar a runa.',
        icon: 'dice',
        skillCheck: {
          skill: 'arcano',
          difficulty: 9,
          allowSorte: false,
          successOutcome: {
            nextNodeId: 'a2_mirthwood_15',
            effects: [{ kind: 'addItem', itemId: 'pergaminho_de_raiz', quantity: 1 }],
            narrationOverride: 'A runa se abre para você como flor. Você copia o que importa.',
          },
          failureOutcome: {
            nextNodeId: 'a2_mirthwood_15',
            narrationOverride: 'A runa é antiga demais. Você não consegue decifrá-la desta vez.',
          },
        },
        outcome: { nextNodeId: 'a2_mirthwood_15' },
      },
      {
        id: 'a2_m14_recusar',
        label: 'Recusar; não é meu.',
        outcome: {
          nextNodeId: 'a2_mirthwood_15',
          effects: [{ kind: 'reputation', amount: 1 }],
          narrationOverride: 'Velha Garra assente uma vez, satisfeita.',
        },
      },
    ],
  },

  // ─────────────────────────────────────────────
  // a2_mirthwood_15 — Saída de Mirthwood
  // ─────────────────────────────────────────────
  {
    id: 'a2_mirthwood_15',
    locationId: 'mirthwood',
    title: 'Saída de Mirthwood',
    text: 'A floresta o solta com mais facilidade do que o segurou. As runas do arco de carvalho, quando você passa por baixo dela ao sair, brilham um pouco mais firmes — não como brasa cansada, mas como brasa lembrada. Não é vitória. É um respiro de árvore que voltou a respirar.\n\nO Mapa abre na sua mão. Faltam dois fragmentos.',
    onEnter: [
      { kind: 'setFlag', key: 'mirthwood_concluido', value: true },
    ],
    isMap: true,
    choices: [
      {
        id: 'a2_m15_mapa',
        label: 'Consultar o mapa.',
        icon: 'map',
        outcome: { nextNodeId: 'a2_karn_01' },
      },
      {
        id: 'a2_m15_bramford',
        label: 'Seguir para Bramford.',
        icon: 'map',
        flagRequirement: { key: 'bramford_concluido', exists: false },
        outcome: { nextNodeId: 'a2_bramford_01' },
      },
      {
        id: 'a2_m15_karn',
        label: 'Seguir para Karn-Tuhl.',
        icon: 'map',
        flagRequirement: { key: 'karn_concluido', exists: false },
        outcome: { nextNodeId: 'a2_karn_01' },
      },
    ],
  },
]
