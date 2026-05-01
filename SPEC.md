# Aventuras Fantásticas — Especificação Técnica e de Design

> **Versão:** 1.0
> **Data:** 2026-04-29
> **Idioma do produto:** PT-BR
> **Idioma dos prompts de imagem:** EN
> **Status:** Pronto para implementação

---

## Sumário

1. [Visão Geral](#1-visão-geral)
2. [Tom, Estética e Inspirações](#2-tom-estética-e-inspirações)
3. [Stack e Arquitetura](#3-stack-e-arquitetura)
4. [Estrutura de Pastas](#4-estrutura-de-pastas)
5. [Modelo de Dados](#5-modelo-de-dados)
6. [Personagens Jogáveis](#6-personagens-jogáveis)
7. [Sistema de Atributos](#7-sistema-de-atributos)
8. [Sistema de Combate](#8-sistema-de-combate)
9. [Sistema de Skill Checks](#9-sistema-de-skill-checks)
10. [Sistema de Sorte](#10-sistema-de-sorte)
11. [Inventário e Economia](#11-inventário-e-economia)
12. [Reputação e Moralidade](#12-reputação-e-moralidade)
13. [Mapa e Locais](#13-mapa-e-locais)
14. [Estrutura Narrativa](#14-estrutura-narrativa)
15. [Enredo Completo](#15-enredo-completo)
16. [Catálogo de Nós Narrativos](#16-catálogo-de-nós-narrativos)
17. [Bestiário](#17-bestiário)
18. [Itens](#18-itens)
19. [Conquistas](#19-conquistas)
20. [Finais](#20-finais)
21. [UI/UX e Telas](#21-uiux-e-telas)
22. [Save System](#22-save-system)
23. [Acessibilidade e Responsividade](#23-acessibilidade-e-responsividade)
24. [Prompts de Geração de Imagem](#24-prompts-de-geração-de-imagem)
25. [Requisitos Não Funcionais](#25-requisitos-não-funcionais)
26. [Roadmap de Implementação](#26-roadmap-de-implementação)
27. [Glossário](#27-glossário)

---

## 1. Visão Geral

**Aventuras Fantásticas** é um livro-jogo digital single-player rodando em navegador, inspirado nos clássicos *Fighting Fantasy* (Steve Jackson / Ian Livingstone) traduzidos no Brasil dos anos 80/90. O jogador escolhe entre três classes (Mago, Ladino, Bárbaro), navega uma árvore de escolhas narrativas, enfrenta combates por rolagem de dados e busca um dos 3-4 finais possíveis.

### 1.1 Pilares de design

| Pilar | Implicação |
|---|---|
| **Texto antes de imagem** | A narrativa carrega o jogo; imagens reforçam momentos-chave. |
| **Decisão sobre reflexo** | Sem ação em tempo real. Tudo é escolha + rolagem. |
| **Permadeath honesto** | Morrer reinicia. Sem checkpoints. Aumenta peso das escolhas. |
| **Identidade de classe** | Cada classe abre conteúdo exclusivo, não só ajusta números. |
| **Rejogabilidade temática** | 3 classes × 4 finais × ramificações = pelo menos 12 runs distintas. |

### 1.2 Duração-alvo

- **Run completa:** ~60 minutos.
- **Total de nós narrativos:** ~95 (15 Ato 1 + 65 Ato 2 + 15 Ato 3).
- **Total de combates:** 8-10 (3 obrigatórios, 5-7 opcionais).
- **Pontos de save:** auto-save a cada nó.

### 1.3 Público

Jogadores de RPG de mesa, fãs de livros-jogos, leitores de fantasia clássica. Idade-alvo: 14+.

---

## 2. Tom, Estética e Inspirações

### 2.1 Tom narrativo

**Heroico clássico D&D anos 80.** Bem contra mal claros, herói convocado por um destino, magia épica, vilão antigo retornando. Sem cinismo grimdark, sem humor irônico — tom solene e aventureiro. NPCs nobres, traições pontuais, redenção possível.

### 2.2 Estética visual da UI

**Pergaminho/livro antigo.** Toda a UI evoca um manuscrito iluminado:
- Fundo: textura de pergaminho (`#f4ead5` / `#e8dcc0`).
- Tipografia: serifada (Cinzel para títulos, EB Garamond ou IM Fell DW Pica para corpo).
- Bordas: filetes ornamentais, capitulares decoradas no início de capítulos.
- Paleta: marrom-sépia, ocre, vinho, verde-musgo, dourado para destaques.
- Botões de escolha: cards em pergaminho com selo de cera.

### 2.3 Estética das ilustrações

**Fantasia clássica pintada estilo Larry Elmore / Frank Frazetta / Keith Parkinson.** Pintura digital com qualidade de óleo, paleta rica, luz dramática, composição de capa de livro. Personagens heroicos, cenários épicos.

---

## 3. Stack e Arquitetura

### 3.1 Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Browser moderno (ES2022+) |
| Framework UI | React 18 + TypeScript 5 |
| Build | Vite 5 |
| Estilo | CSS Modules + variáveis CSS (design tokens) |
| Estado global | Zustand (escolha justificada: leve, sem boilerplate, ótimo para estado de jogo) |
| Roteamento | React Router 6 (poucas rotas: `/`, `/jogo`, `/galeria`) |
| Persistência | `localStorage` via wrapper tipado |
| Testes | Vitest + React Testing Library |
| Lint/Format | ESLint + Prettier |
| Tipos de dado de jogo | Conteúdo em `.ts` (não JSON) para tipagem forte e autocomplete |

### 3.2 Princípios de arquitetura

- **Conteúdo separado de motor.** Nós narrativos, inimigos, itens, locais ficam em `src/content/` como dados tipados; o motor (`src/engine/`) consome esses dados.
- **Motor puro e testável.** Combate, rolagens, checks são funções puras (aceitam estado + RNG, retornam novo estado). Facilita unit-test e replay.
- **RNG injetável.** Toda função aleatória recebe um `Random` (interface) — em produção usa `Math.random`, em testes usa seed determinístico.
- **Imutabilidade de estado.** Estado do jogo nunca é mutado; sempre se gera novo objeto.
- **UI burra.** Componentes React não têm regra de jogo; só renderizam estado e disparam ações.

### 3.3 Diagrama de fluxo

```
[ContentRegistry] ──provê──► [GameEngine] ──atualiza──► [GameStore (Zustand)]
                                  ▲                              │
                                  │                              │
                              [Random]                        renderiza
                                                                 │
                                                                 ▼
                                                           [React UI]
                                                                 │
                                                            disparaAção
                                                                 │
                                                                 └─► volta ao Engine
```

---

## 4. Estrutura de Pastas

```
aventuras-fantasticas/
├── public/
│   └── images/                  # imagens geradas (PNG/WebP)
│       ├── characters/          # mago.webp, ladino.webp, barbaro.webp
│       ├── map.webp
│       ├── scenes/              # cena_<id>.webp
│       └── enemies/             # inimigo_<id>.webp
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/
│   │   ├── TitleScreen.tsx
│   │   ├── CharacterSelect.tsx
│   │   ├── Game.tsx
│   │   └── Gallery.tsx
│   ├── components/
│   │   ├── narrative/
│   │   │   ├── NarrativeNode.tsx
│   │   │   ├── ChoiceList.tsx
│   │   │   └── TypewriterText.tsx
│   │   ├── combat/
│   │   │   ├── CombatScreen.tsx
│   │   │   ├── PowerSelector.tsx
│   │   │   ├── DiceRoll.tsx
│   │   │   └── EnemyCard.tsx
│   │   ├── map/
│   │   │   └── WorldMap.tsx
│   │   ├── inventory/
│   │   │   ├── InventoryPanel.tsx
│   │   │   └── ItemCard.tsx
│   │   ├── hud/
│   │   │   ├── StatsBar.tsx        # Habilidade, Energia, Sorte
│   │   │   ├── GoldDisplay.tsx
│   │   │   └── ReputationMeter.tsx
│   │   └── ui/                     # botões, cards, modais com estilo pergaminho
│   ├── engine/
│   │   ├── combat.ts               # lógica de combate
│   │   ├── skillCheck.ts           # rolagens 2d6 + bônus
│   │   ├── luck.ts                 # sistema de Sorte
│   │   ├── narrative.ts            # avanço de nós, condições
│   │   ├── inventory.ts            # adicionar/remover/usar
│   │   ├── reputation.ts           # alterações de moralidade
│   │   ├── random.ts               # interface Random + impls
│   │   └── save.ts                 # serialização localStorage
│   ├── content/
│   │   ├── characters.ts           # 3 classes
│   │   ├── powers.ts               # 9 poderes (3 por classe)
│   │   ├── nodes/                  # nós narrativos
│   │   │   ├── act1.ts
│   │   │   ├── act2_floresta.ts
│   │   │   ├── act2_cidade.ts
│   │   │   ├── act2_ruinas.ts
│   │   │   └── act3.ts
│   │   ├── enemies.ts
│   │   ├── items.ts
│   │   ├── locations.ts            # 6 locais do mapa
│   │   ├── achievements.ts
│   │   └── endings.ts
│   ├── store/
│   │   └── gameStore.ts            # Zustand
│   ├── types/
│   │   └── index.ts                # tipos compartilhados
│   ├── styles/
│   │   ├── tokens.css              # variáveis CSS
│   │   └── global.css
│   └── utils/
│       └── dice.ts                 # rolagem de dados
├── SPEC.md
├── README.md
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 5. Modelo de Dados

### 5.1 Tipos centrais (TypeScript)

```ts
// === Personagem e atributos ===
export type ClassId = 'mago' | 'ladino' | 'barbaro';

export type SkillName =
  | 'arcano' | 'atletismo' | 'furtividade' | 'intimidar'
  | 'persuadir' | 'trapaca' | 'investigar' | 'resistirMagia';

export interface CharacterClass {
  id: ClassId;
  name: string;
  title: string;            // ex.: "Eldwin Vethrys, o Aprendiz Esquecido"
  backstory: string;        // 1 parágrafo
  portraitImage: string;    // path em public/images/characters/
  baseStats: { habilidade: number; energia: number; sorte: number };
  skillBonuses: Record<SkillName, number>; // -2 a +2
  startingPowers: PowerId[];
  startingItems: ItemId[];
  startingGold: number;
}

// === Poderes ===
export type PowerRole = 'high_damage' | 'consistent' | 'utility';
export type PowerId = string;

export interface Power {
  id: PowerId;
  classId: ClassId;
  name: string;
  description: string;
  role: PowerRole;
  attackModifier: number;          // soma à Força de Ataque
  damage: DiceRoll | null;         // null para utilitários
  effect: PowerEffect | null;      // efeito utilitário
  selfPenalty: SelfPenalty | null; // ex.: -1 Habilidade próximo turno
  flavorText: string;              // texto narrativo no combate
}

export interface DiceRoll { count: number; faces: number; bonus: number; } // 2d6+1
export interface PowerEffect {
  type: 'shield' | 'evade' | 'rage' | 'sneak_bonus' | 'multi_attack';
  value?: number;
  duration?: number; // em rounds
}
export interface SelfPenalty {
  stat: 'habilidade' | 'energia';
  amount: number;
  duration: number;
}

// === Estado de jogo ===
export interface GameState {
  classId: ClassId;
  stats: { habilidade: number; energia: number; sorte: number };
  maxStats: { habilidade: number; energia: number; sorte: number };
  inventory: InventoryEntry[];     // máx 6 slots
  keyItems: KeyItemId[];           // itens narrativos, sem limite
  gold: number;
  reputation: number;              // -10 (sombrio) a +10 (honrado)
  currentNodeId: NodeId;
  visitedNodes: NodeId[];
  flags: Record<string, boolean | number | string>; // estado narrativo livre
  defeatedEnemies: EnemyId[];      // bestiário
  unlockedEndings: EndingId[];     // por save (e cross-save em meta)
  startedAt: number;               // timestamp ISO
}

export interface InventoryEntry { itemId: ItemId; quantity: number; }

// === Itens ===
export type ItemId = string;
export type KeyItemId = string;

export interface Item {
  id: ItemId;
  name: string;
  description: string;
  type: 'consumable' | 'equipment' | 'misc';
  effect: ItemEffect;
  stackable: boolean;
  goldValue: number;
  usableInCombat: boolean;
  usableOutOfCombat: boolean;
}

export type ItemEffect =
  | { kind: 'heal'; amount: number }
  | { kind: 'restoreSorte'; amount: number }
  | { kind: 'tempBuff'; stat: 'habilidade'; amount: number; duration: number }
  | { kind: 'damageBoost'; amount: number; duration: number }
  | { kind: 'special'; tag: string };

// === Inimigos ===
export type EnemyId = string;

export interface Enemy {
  id: EnemyId;
  name: string;
  description: string;
  portraitImage: string;
  habilidade: number;
  energia: number;
  damage: DiceRoll;          // dano causado quando vence o round
  fleeable: boolean;         // se o jogador pode fugir
  goldReward: number;        // se vencer
  itemDropId?: ItemId;
  resistances?: { type: PowerEffect['type']; reduction: number }[];
  bestiaryFlavor: string;    // texto ao registrar no bestiário
}

// === Nós narrativos ===
export type NodeId = string;
export type LocationId = 'pedragar' | 'mirthwood' | 'bramford' | 'karn_tuhl' | 'cidadela_sombras' | 'estrada';

export interface NarrativeNode {
  id: NodeId;
  locationId: LocationId;
  title?: string;            // título opcional do capítulo
  imageId?: string;          // referência a public/images/scenes/
  text: string;              // narrativa principal (pode conter quebras de parágrafo)
  classVariants?: Partial<Record<ClassId, string>>; // texto adicional por classe
  choices: Choice[];
  onEnter?: NodeEffect[];    // efeitos automáticos ao entrar (ex.: ganhar item)
  isEnding?: EndingId;       // se este nó é um final
}

export interface Choice {
  id: string;
  label: string;
  classRequirement?: ClassId | ClassId[];      // só visível para certas classes
  flagRequirement?: FlagCondition;             // só visível se flag bate
  itemRequirement?: ItemId | KeyItemId;        // requer item
  reputationRequirement?: { min?: number; max?: number };
  skillCheck?: SkillCheck;                     // se a escolha exige rolagem
  combat?: CombatEncounter;                    // se leva a combate
  outcome: ChoiceOutcome;                      // efeitos imediatos + próximo nó
  hidden?: boolean;                            // não-visível mas selecionável (debug)
}

export interface SkillCheck {
  skill: SkillName;
  difficulty: number;        // CD: 7, 9, 11, 13
  successOutcome: ChoiceOutcome;
  failureOutcome: ChoiceOutcome;
  allowSorte: boolean;       // pode gastar Sorte para refazer?
}

export interface CombatEncounter {
  enemyIds: EnemyId[];                  // sempre 1 nesta versão (1v1)
  victoryOutcome: ChoiceOutcome;
  defeatOutcome?: ChoiceOutcome;        // padrão: game over
  fleeOutcome?: ChoiceOutcome;
}

export interface ChoiceOutcome {
  nextNodeId: NodeId;
  effects?: NodeEffect[];
  narrationOverride?: string; // texto que aparece como transição
}

export type NodeEffect =
  | { kind: 'addItem'; itemId: ItemId; quantity?: number }
  | { kind: 'removeItem'; itemId: ItemId; quantity?: number }
  | { kind: 'addKeyItem'; keyItemId: KeyItemId }
  | { kind: 'removeKeyItem'; keyItemId: KeyItemId }
  | { kind: 'gold'; amount: number }                 // negativo = perder
  | { kind: 'energy'; amount: number }               // negativo = dano
  | { kind: 'sorte'; amount: number }
  | { kind: 'reputation'; amount: number }
  | { kind: 'setFlag'; key: string; value: boolean | number | string }
  | { kind: 'unlockAchievement'; achievementId: string };

export interface FlagCondition {
  key: string;
  equals?: boolean | number | string;
  gt?: number;
  lt?: number;
}

// === Conquistas, Finais, Locais ===
export interface Achievement {
  id: string;
  name: string;
  description: string;
  hidden: boolean;     // não mostra requisitos antes de desbloquear
}

export interface Ending {
  id: EndingId;
  name: string;
  type: 'heroic' | 'dark' | 'sacrifice' | 'tragic';
  imageId: string;
  text: string;
  conditions: string;  // descrição humana das condições
}
export type EndingId = string;

export interface Location {
  id: LocationId;
  name: string;
  description: string;
  imageMarker: string;     // pin no mapa
  unlockFlag?: string;     // flag que destrava no mapa
  visitedFlag: string;     // flag setada após primeira visita
}
```

---

## 6. Personagens Jogáveis

Os três personagens compartilham o mesmo enredo, mas cada um vê escolhas exclusivas, recebe diálogos diferentes, e tem combate/checks com perfil próprio.

### 6.1 Eldwin Vethrys — O Mago

> *"Os livros me ensinaram tudo o que sei. Mas nenhum me preparou para o que vem aí."*

**Backstory.** Aprendiz da Torre de Vesperia, dedicada à magia arcana protetora. Quando a Torre foi consumida pelas Sombras Errantes, Eldwin foi o único sobrevivente — salvo por um ritual incompleto que custou a vida do mestre. Carrega o cajado quebrado do mestre como lembrança e fardo. Acredita que o conhecimento vence o medo, mas seu corpo franzino paga o preço da escolha de estudar em vez de treinar.

**Stats iniciais.**
| Atributo | Valor |
|---|---|
| Habilidade | 7 |
| Energia | 14 |
| Sorte | 11 |

**Bônus de skill.**
| Skill | Mod |
|---|---|
| Arcano | +2 |
| Investigar | +1 |
| Persuadir | +1 |
| Atletismo | -1 |
| Furtividade | -1 |
| Intimidar | 0 |
| Trapaça | 0 |
| Resistir Magia | +1 |

**Itens iniciais.** Cajado Quebrado de Vesperia (chave), Poção de Cura Menor (×2), 30 moedas de ouro.

**Poderes.** ver §6.4.

---

### 6.2 Sira Crowfoot — A Ladina

> *"Falar bonito, sumir bonito, fugir mais bonito ainda."*

**Backstory.** Cresceu nos becos de Bramford depois que sua família foi acusada (injustamente) de heresia. Aprendeu cedo que a verdade é só a história mais bem contada. Trabalhou com a Guilda da Adaga Quieta até descobrir que o mestre da Guilda também serve às Sombras — desde então, foge dele tanto quanto persegue uma chance de redenção. Carrega adagas gêmeas que pertenciam ao pai.

**Stats iniciais.**
| Atributo | Valor |
|---|---|
| Habilidade | 8 |
| Energia | 16 |
| Sorte | 12 |

**Bônus de skill.**
| Skill | Mod |
|---|---|
| Furtividade | +2 |
| Trapaça | +2 |
| Investigar | +1 |
| Intimidar | -1 |
| Atletismo | 0 |
| Arcano | 0 |
| Persuadir | 0 |
| Resistir Magia | -1 |

**Itens iniciais.** Adagas Gêmeas do Pai (chave), Gazua (chave), Pó da Cegueira (×1), 50 moedas de ouro.

**Poderes.** ver §6.4.

---

### 6.3 Thorgar Mãodepedra — O Bárbaro

> *"Conversa é tempo que o machado podia ter usado melhor."*

**Backstory.** Filho de chefe da tribo Korrundir, das estepes geladas do Norte. Foi exilado depois de recusar matar um irmão de sangue por uma ordem que considerou injusta. Vagueia o sul há dois invernos, lutando como mercenário, sempre carregando o machado totêmico do clã — e a culpa de não ter dito sim. Acredita que algumas batalhas exigem mais que força, mas ainda não descobriu quais.

**Stats iniciais.**
| Atributo | Valor |
|---|---|
| Habilidade | 10 |
| Energia | 22 |
| Sorte | 7 |

**Bônus de skill.**
| Skill | Mod |
|---|---|
| Atletismo | +2 |
| Intimidar | +2 |
| Resistir Magia | +1 |
| Arcano | -2 |
| Trapaça | -1 |
| Furtividade | -1 |
| Persuadir | -1 |
| Investigar | 0 |

**Itens iniciais.** Machado Totêmico (chave), Pele de Lobo Branco (chave, dá +1 contra frio em flag), Carne Seca (×3), 15 moedas de ouro.

---

### 6.4 Poderes (3 por classe, 9 totais)

Todo poder define seu papel — **alto dano** (high_damage) tem dado maior, mas penalidade de retorno ou condição; **consistente** (consistent) tem dado menor sem efeito colateral; **utilitário** (utility) não causa dano, mas aplica efeito (escudo, esquiva, fúria).

#### Mago

| Poder | Papel | Mod ataque | Dano | Efeito / Penalidade |
|---|---|---|---|---|
| **Bola de Fogo** | high_damage | +0 | 1d6+3 (4-9) | Após uso: -1 Habilidade no próximo round (recuo arcano). |
| **Raio Arcano** | consistent | +1 | 1d4+2 (3-6) | — |
| **Escudo Místico** | utility | — | — | Próximo dano recebido reduzido em 4. Não acerta o inimigo. |

#### Ladino

| Poder | Papel | Mod ataque | Dano | Efeito / Penalidade |
|---|---|---|---|---|
| **Apunhalar nas Sombras** | high_damage | +2 | 2d4 (2-8) | Só pode ser usado uma vez por combate (efeito surpresa). |
| **Estocada Rápida** | consistent | +0 | 1d4+2 (3-6) | — |
| **Truque de Fumaça** | utility | — | — | Próximo ataque inimigo automaticamente erra. Não acerta o inimigo. |

#### Bárbaro

| Poder | Papel | Mod ataque | Dano | Efeito / Penalidade |
|---|---|---|---|---|
| **Golpe Devastador** | high_damage | +0 | 1d8+1 (2-9) | Após uso: -1 Habilidade no próximo round. |
| **Investida** | consistent | +1 | 1d6+1 (2-7) | +2 dano se Energia atual < 50% do máximo. |
| **Fúria Ancestral** | utility | — | — | Próximos 3 rounds: +1 Habilidade e -1 dano recebido. Cooldown: 1 vez por combate. |

---

## 7. Sistema de Atributos

### 7.1 Atributos centrais

| Atributo | Função | Range típico |
|---|---|---|
| **Habilidade** | Soma à rolagem de combate (Força de Ataque). Define modificadores em alguns checks. | 7-10 |
| **Energia** | Hit points. Chega a 0 → game over. | 14-22 |
| **Sorte** | Reserva gastável para refazer rolagens, reduzir dano, escapar de armadilhas. | 7-12 |

### 7.2 Sem progressão

Atributos máximos são fixos durante toda a run. Itens podem dar buffs **temporários** (X rounds) ou restaurar até o máximo, mas **nunca** elevam o teto. Justificativa: mantém o tom clássico FF, simplifica balanceamento, e força decisões de uso de recursos.

### 7.3 Efeitos temporários

Cada efeito ativo é armazenado em `gameState.activeEffects: ActiveEffect[]`. Cada `ActiveEffect` tem `{type, value, remainingRounds}`. Ao começar um round de combate, decrementa `remainingRounds`; chega a 0, remove. Fora de combate, efeitos com duração em rounds expiram ao sair do combate.

---

## 8. Sistema de Combate

### 8.1 Filosofia

Combate é o coração mecânico do jogo. Segue o **modelo clássico Fighting Fantasy**: ambos lados rolam Força de Ataque e o maior acerta. O jogador adiciona **escolha de poder** ao modelo clássico — cada poder modifica o resultado.

### 8.2 Estado de combate

```ts
interface CombatState {
  player: { stats, activeEffects, usedOnceFlags: PowerId[] };
  enemy: { id, currentEnergia, activeEffects };
  round: number;
  log: CombatLogEntry[];
  fleeAvailable: boolean;
  outcome: 'ongoing' | 'victory' | 'defeat' | 'fled';
}
```

### 8.3 Ordem de um round

1. **UI: jogador escolhe ação.** Opções:
   - Usar um dos 3 poderes
   - Usar item (lista de itens com `usableInCombat: true`)
   - Tentar fugir (apenas se `fleeAvailable === true`)
2. **Resolução:**
   - Se **utilitário**: aplica o efeito; o inimigo ainda ataca normalmente (rola só ele) e o jogador defende com modificador do efeito (ex.: Escudo Místico reduz 4 do dano; Truque de Fumaça anula o ataque).
   - Se **dano**: resolve o **contest**:
     - `forcaAtaquePlayer = habilidade + 2d6 + power.attackModifier - penalidadesAtivas`
     - `forcaAtaqueInimigo = enemy.habilidade + 2d6`
     - Se `player > inimigo`: jogador acerta, inimigo perde `rolar(power.damage)` Energia.
     - Se `inimigo > player`: inimigo acerta, jogador perde `rolar(enemy.damage)` Energia.
     - Se **empate**: ambos se desviam, ninguém perde Energia. *(Texto: "As lâminas se cruzam e se separam sem sangue.")*
   - Se **item**: aplica o efeito do item (cura/buff/etc.); inimigo ataca livre — jogador rola só defesa (`enemy.habilidade + 2d6` vs. um valor fixo: jogador "se cobre" com `habilidade + 2d6`; perde se inimigo for maior).
   - Se **fuga**: rolagem `2d6 + habilidade` vs. `enemy.habilidade + 8`. Sucesso: vai para `fleeOutcome`. Falha: jogador perde 2 Energia e o round continua (inimigo ataca normalmente).
3. **Após dano:** se jogador recebeu dano, oferece **Tentar a Sorte**. Ver §10.
4. **Verifica fim de combate:**
   - `enemy.energia <= 0` → vitória.
   - `player.energia <= 0` → derrota → game over.
5. **Decrementa durações** dos efeitos ativos. Próximo round.

### 8.4 Penalidades de poder

Quando um poder tem `selfPenalty` (ex.: Bola de Fogo: -1 Habilidade no próximo round), aplica-se um `ActiveEffect` com `duration: 1`. No próximo round, subtrai do cálculo de Força de Ataque.

### 8.5 Pseudocódigo da resolução

```ts
function resolveRound(state, action, rng): CombatState {
  // 1. Aplica ação do jogador
  const playerResult = applyPlayerAction(state, action, rng);

  // 2. Inimigo escolhe e aplica ataque (sempre seu único ataque)
  const enemyResult = applyEnemyAttack(state, playerResult, rng);

  // 3. Logs e atualiza efeitos ativos
  const newState = mergeResults(state, playerResult, enemyResult);
  return tickEffects(newState);
}
```

### 8.6 Fuga

`fleeable: true` no encontro habilita o botão "Fugir". Caso contrário, botão fica desabilitado. Combates de chefe (Vorthun, Druida Corrompido, Senhor da Guilda Sombria) sempre são `fleeable: false`.

### 8.7 Recompensas

Ao vencer:
- Recebe `enemy.goldReward` em ouro.
- Se `enemy.itemDropId` definido: ganha o item (se inventário cheio, é oferecida troca).
- Inimigo é registrado no bestiário (`gameState.defeatedEnemies`).
- Aplica-se o `victoryOutcome.effects` do encontro.

### 8.8 Derrota

- Mostra tela de **GAME OVER** com texto narrativo do `defeatOutcome` (se houver) ou texto padrão: *"Suas pernas falham. O mundo escurece. Sua aventura termina aqui."*
- Botão "Tentar Novamente" → reinicia em `CharacterSelect` com save apagado.
- Antes de apagar: persiste em `metaSave` (cross-run) os finais e conquistas já desbloqueados.

---

## 9. Sistema de Skill Checks

### 9.1 Filosofia

Decisões fora de combate que envolvem risco passam por uma rolagem `2d6 + bônus de classe vs. CD`. O jogador vê o dado rolar (animação) e o resultado.

### 9.2 Tabela de dificuldade

| Nível | CD |
|---|---|
| Trivial | 5 (raramente usado) |
| Fácil | 7 |
| Médio | 9 |
| Difícil | 11 |
| Muito difícil | 13 |
| Lendário | 15 (raro, sempre permite usar Sorte) |

### 9.3 Cálculo

```
total = 2d6 + skillBonus[skill]
sucesso = total >= CD
```

Se `allowSorte === true`, depois do resultado o jogador pode gastar **1 ponto de Sorte** para refazer a rolagem (mantendo o segundo resultado, mesmo se pior).

### 9.4 Skills (8 categorias)

| Skill | Quando usar |
|---|---|
| **arcano** | Ler runas, identificar magia, conjurar truque, dispelar |
| **atletismo** | Escalar, nadar, forçar porta, correr |
| **furtividade** | Esgueirar, esconder, roubar |
| **intimidar** | Forçar resposta, dispersar multidão, encarar inimigo |
| **persuadir** | Convencer com lógica/empatia, negociar preço |
| **trapaca** | Mentir, blefar, jogar cartas, falsificar |
| **investigar** | Notar pista, lembrar conhecimento, decifrar |
| **resistirMagia** | Resistir a feitiço de carga, controle mental, ilusão |

### 9.5 Mensagens visíveis

A UI deve mostrar **antes** da rolagem: skill + CD + total estimado mínimo/máximo (`2d6+bonus = 2-12 + bonus`).
Após rolagem: dados, total, resultado, e narração do `successOutcome` ou `failureOutcome`.

---

## 10. Sistema de Sorte

### 10.1 Mecânica

Sorte é uma **reserva gastável** que começa cheia (depende da classe) e diminui ao longo da run.

### 10.2 Quando o jogador pode "Tentar a Sorte"

| Situação | Custo | Efeito |
|---|---|---|
| Após receber dano em combate | 1 Sorte | Rola 2d6: se ≤ Sorte atual, dano -2; se > Sorte atual, dano +1 (sortuda mas falhou). |
| Após causar dano em combate | 1 Sorte | Rola 2d6: se ≤ Sorte atual, dano +2; se > Sorte atual, dano -1. |
| Refazer skill check (se `allowSorte`) | 1 Sorte | Refaz rolagem; vale o novo resultado mesmo se pior. |
| Em nó narrativo com escolha "Confiar na Sorte" | 1 Sorte | Rola 2d6: se ≤ Sorte, sucesso narrativo automático. |

### 10.3 Recuperar Sorte

- **Poções de Sorte** (item raro) restauram +2.
- **Marcos narrativos** (descansar em local seguro, nó específico) restauram até o máximo.
- **Conquistas dentro da run** podem dar +1 (ex.: salvar NPC vulnerável).
- **Respiro de Sorte** (ver §10.4).

### 10.4 Respiro de Sorte (1 por ato)

Para amenizar a dureza da permadeath em uma run de ~1h, cada ato tem **um nó dedicado de descanso** que restaura Sorte ao máximo, recupera 50% da Energia perdida (arredondando para cima) e remove efeitos negativos persistentes. O Respiro é **opcional** — o jogador escolhe usar ou seguir adiante.

| Ato | Nó | Localização narrativa |
|---|---|---|
| Ato 1 | `a1_pedragar_07_capela` (sub-escolha em `_07`) | A Capela de Pedragar antes de partir. Já existente; reforçado para também restaurar Sorte ao máximo. |
| Ato 2 | `a2_<region>_respiro` | Um nó por região (cabana de Velha Garra em Mirthwood; capela em Bramford; forja antiga em Karn-Tuhl). **Apenas o primeiro Respiro do Ato 2 conta** — o flag `respiro_ato2_usado` bloqueia os demais. |
| Ato 3 | `a3_cidadela_06` (Antessala antes do Trono) | Recurso final antes do confronto com Vorthun. |

**Regras do Respiro:**
- Restaura Sorte para `maxSorte`.
- Cura Energia: `min(maxEnergia, energia + ceil((maxEnergia - energia) / 2))`.
- Limpa todos os `activeEffects` com `kind: 'penalty'` (efeitos persistentes negativos vindos de armadilhas/maldições).
- Define flag `respiro_<ato>_usado: true`.
- **Não cura** `keyItems` perdidos nem reverte escolhas; é apenas mecânica de fôlego.

**UI:** o nó de Respiro mostra ilustração calma, texto contemplativo (~150 palavras) e duas escolhas: *"Descansar aqui."* (aplica o Respiro) e *"Seguir agora; reservo o fôlego."* (deixa para usar em próximo ato; se for Ato 3 já não há próximo, então é uma opção de roleplay).

### 10.5 UI

Barra de Sorte visível no HUD com formato `Sorte: 8/12`. Cada gasto pulsa visualmente. Botão "Tentar a Sorte" fica desabilitado se `sorte <= 0`.

---

## 11. Inventário e Economia

### 11.1 Slots

- **Itens regulares:** 6 slots. Itens stackable acumulam até 9 por slot.
- **Itens-chave:** ilimitados, exibidos em aba separada. Não podem ser descartados.
- Quando o jogador encontra item e inventário está cheio: modal "Substituir um item ou descartar este?".

### 11.2 Tipos de item

| Tipo | Comportamento |
|---|---|
| **consumable** | Uso único; stackable; usável em/fora de combate (depende do item). |
| **equipment** | Permanente; modificador passivo (ex.: +1 Habilidade enquanto equipado). MVP terá 2-3 itens deste tipo. |
| **misc** | Tem valor de venda mas nenhum efeito direto. |

### 11.3 Ouro

- Inteiro ≥ 0.
- Encontrado em vitórias, achados, recompensas.
- Gasto em mercadores (Bramford principalmente).

### 11.4 Mercadores

- **Mestre Belaron, Bramford** — vende poções, gazua extra, mapa.
- **Velha Garra, Mirthwood** — troca itens raros por ervas.
- Tabela de preços fica em `content/items.ts` como `goldValue`. Mercadores podem ter `priceMultiplier` (ex.: Velha Garra cobra 1.5×).

### 11.5 Diálogo de mercador

Modal mostra inventário do mercador, ouro do jogador, botões Comprar/Vender. Vender: 50% do `goldValue`.

---

## 12. Reputação e Moralidade

### 12.1 Eixo único

`reputation: number` no estado, `-10` (Sombrio) a `+10` (Honrado). Começa em **0** (Neutro).

### 12.2 Como se altera

- Escolhas em nós narrativos têm `effects` com `{kind: 'reputation', amount: ±1 ou ±2}`.
- Ações automáticas:
  - Salvar NPC: +1 a +2.
  - Roubar / matar inocente: -1 a -3.
  - Cumprir promessa: +1.
  - Quebrar promessa: -2.

### 12.3 Como se aplica

- **Dialogos exclusivos:** algumas escolhas têm `reputationRequirement: { min: 5 }` ou `max: -3`.
- **Reações de NPCs:** texto narrativo varia (ramos `if reputation >= 5: "O guarda saúda você." else: "...desvia o olhar."`).
- **Final desbloqueado:**
  - Vitória Heroica: requer `reputation >= +5`.
  - Vitória Sombria: requer `reputation <= -3`.
  - Sacrifício Nobre: requer `reputation >= +3` E flag `aceitouSacrificio === true`.
  - Tragédia: qualquer caso fora dos acima ao chegar no nó final.

### 12.4 UI

Medidor sutil no HUD: ícone de balança com agulha. Tooltip mostra "Reputação: Honrado (+6)". Mudanças animam.

---

## 13. Mapa e Locais

### 13.1 6 locais

| ID | Nome | Descrição curta | Quando aparece |
|---|---|---|---|
| `pedragar` | Vila de Pedragar | Vila inicial do herói; ponto de partida da aventura. | Ato 1 (não retornável após sair). |
| `estrada` | Estradas de Aenor | Hub do mapa entre locais. | Ato 2 (acessível entre regiões). |
| `mirthwood` | Floresta de Mirthwood | Floresta antiga, sagrada aos druidas; abriga o Fragmento da Vida. | Ato 2. |
| `bramford` | Cidade Mercante de Bramford | Cidade comercial decadente; abriga o Fragmento da Mente. | Ato 2. |
| `karn_tuhl` | Ruínas de Karn-Tuhl | Cidade-fortaleza anã abandonada; abriga o Fragmento do Corpo. | Ato 2. |
| `cidadela_sombras` | Cidadela das Sombras | Covil de Vorthun. | Ato 3 (destrava após coletar 3 fragmentos). |

### 13.2 Comportamento do mapa

- Não é um mapa interativo o tempo todo. Aparece em **momentos-chave**:
  - Após sair de Pedragar (define ordem dos 3 locais do Ato 2).
  - Após concluir cada região do Ato 2 (escolhe próxima).
  - Após coletar 3 fragmentos (libera Cidadela das Sombras).
- O jogador pode visitar os 3 locais do Ato 2 em **qualquer ordem**, mas precisa visitar os 3.
- Cada local pode ser **revisitado** apenas para **mercador** (Bramford) entre regiões. Demais conteúdos são consumidos na primeira visita.

### 13.3 UI do mapa

- Imagem grande de mapa pintado em pergaminho.
- Pins clicáveis em cada local visitável. Locais "destravados-mas-não-visitados" pulsam suavemente. Locais visitados ficam com selo "✓".
- Botão "Voltar à narrativa" se jogador abriu mapa fora de momento-chave (apenas para consulta).

---

## 14. Estrutura Narrativa

### 14.1 Topologia

A árvore é **reconvergente em pontos de ato**:
- Início (1 nó) → ramificações livres dentro do Ato 1 → **Ponto de Convergência 1** (sair de Pedragar).
- Ato 2: estrutura paralela, 3 sub-árvores (Mirthwood, Bramford, Karn-Tuhl), cada uma com seu mini-clímax. Reconvergem após coletar fragmento.
- **Ponto de Convergência 2:** após os 3 fragmentos.
- Ato 3: 1 sub-árvore final com escolhas críticas e ramo para 4 finais.

### 14.2 Justificativa

Reconvergência limita escopo de escrita (~95 nós) mas mantém sensação de agência. Escolhas afetam: stats, inventário, reputação, NPCs vivos/mortos, finais — não estrutura geral.

### 14.3 Convenção de IDs

`<ato>_<local>_<n>` — ex.: `a1_pedragar_05`, `a2_mirthwood_07`, `a3_cidadela_05`. Variantes do mesmo nó podem ser sufixadas: `a2_mirthwood_11a`/`_11b` (caminhos alternativos) ou `a2_mirthwood_12_morto`/`_redimido` (estados resultantes).

Nós de combate: `combat_<id>`.
Nós de final: `ending_<tipo>` — `ending_heroic`, `ending_dark`, `ending_sacrifice`, `ending_tragic`.

---

## 15. Enredo Completo

### 15.1 Premissa

O reino de **Aenor** vive em paz há cinco séculos, desde que o lich **Vorthun, o Sombrio Coroado**, foi banido para o Reino das Sombras pelo Rei-Mago Solgar. Mas Vorthun não foi destruído — apenas selado, e seu selo se enfraquece. Sombras Errantes começaram a aparecer pelas estradas. A Torre de Vesperia foi consumida em uma noite. As tribos do Norte falam de uma "estrela morta" no horizonte.

A única arma capaz de destruí-lo definitivamente é a **Égide de Solgar**, um amuleto fragmentado em três partes na noite do banimento, escondidas em três lugares onde a magia ainda é forte:

1. **Fragmento da Vida** — guardado pelos druidas da Floresta de Mirthwood.
2. **Fragmento da Mente** — selado no Templo do Saber em Bramford.
3. **Fragmento do Corpo** — perdido nas Ruínas de Karn-Tuhl, antiga cidade anã.

A profecia diz que apenas alguém marcado pela Sombra mas não dominado por ela pode reunir os fragmentos. O herói (qualquer das três classes) **acaba de perder algo importante para as Sombras** — a Torre (Mago), a família (Ladina), o irmão de sangue (Bárbaro) — e por isso é o escolhido.

### 15.2 Vilão principal

**Vorthun, o Sombrio Coroado.** Antigo arquimago humano que tentou imortalidade através de pacto com entidades das Sombras Externas. Foi parcialmente bem-sucedido — virou lich — e parcialmente possuído pelo que invocou. Hoje é uma consciência fria habitando armadura e ossos, com fome de fechar o ciclo: dominar Aenor e abrir as portas para que as Sombras Externas entrem definitivamente no mundo.

Físico: armadura negra rachada, coroa fundida ao crânio, voz de "muitas vozes em uma".

Motivação narrativa: oferece poder ao herói no Ato 3 ("junte-se a mim, vi seu sofrimento, posso vingá-lo"). Resistir → ramo Heroico/Sacrifício. Ceder → ramo Sombrio.

### 15.3 NPCs principais

| NPC | Função | Onde aparece | Pode morrer? |
|---|---|---|---|
| **Mestre Arvendel** | Sábio que explica a profecia em Pedragar; fica para trás. | Ato 1 | Não no Ato 1; pode morrer no Ato 3 dependendo de escolhas. |
| **Velha Garra** | Druida ancestral em Mirthwood; mercadora de ervas + dá pista do fragmento. | Ato 2 - Mirthwood | Não. |
| **Druida Korvath** | Druida corrompido pela Sombra; chefe de Mirthwood. | Ato 2 - Mirthwood | Sim (combate). |
| **Mestre Belaron** | Mercador em Bramford; tem informações sobre o Templo. | Ato 2 - Bramford | Não. |
| **Capitão Vellis** | Líder da Guarda de Bramford; pode ajudar ou trair. | Ato 2 - Bramford | Sim, depende de escolhas. |
| **Senhora Sombria da Guilda** | Antagonista intermediária em Bramford; serve a Vorthun. | Ato 2 - Bramford | Sim (combate, para Ladina é arco pessoal). |
| **Rei dos Mortos Anão (Durin Pedraferro)** | Espectro do antigo rei anão em Karn-Tuhl; pode dar fragmento ou exigir prova. | Ato 2 - Karn-Tuhl | Não. |
| **Algoz de Vorthun** | Tenente do vilão; chefe pré-final. | Ato 3 | Sim (combate). |
| **Vorthun, o Sombrio Coroado** | Vilão final. | Ato 3 | Sim (combate final). |

### 15.4 Resumo dos 3 atos

#### Ato 1 — O Chamado (Pedragar) — ~15 nós
- Abertura: o herói está em sua rotina (Eldwin estuda, Sira esconde-se da Guilda, Thorgar trabalha como mercenário).
- Sombras Errantes atacam Pedragar à noite.
- Herói sobrevive; encontra Mestre Arvendel ferido.
- Arvendel explica a profecia, dá item-chave (Mapa da Égide).
- Decisões: levar quem da vila? Pegar suprimentos onde? Confiar em quem?
- Convergência: herói sai de Pedragar com Mapa, escolhe ordem do Ato 2.

#### Ato 2 — Os Três Fragmentos — ~65 nós

**Mirthwood (Floresta da Vida) — ~20 nós**
- Velha Garra recebe o herói; pede prova de pureza.
- Trilha pela floresta com escolhas: ajudar criatura ferida? Negociar com fadas? Aceitar maldição?
- Descobre que o **Druida Korvath** corrompeu o Bosque Sagrado.
- Confronto com Korvath (combate de chefe regional).
- Recebe Fragmento da Vida.
- Decisão: matar Korvath redimível? Poupá-lo? Aceitar oferta sombria?

**Bramford (Cidade da Mente) — ~22 nós**
- Cidade dividida entre Guarda e Guilda da Adaga Quieta.
- Templo do Saber está fechado; Capitão Vellis precisa de ajuda contra a Guilda OU jogador pode aliar-se à Guilda.
- Subarcos: investigar Templo, infiltrar Guilda, libertar prisioneiro.
- Confronto com **Senhora Sombria da Guilda** (combate; arco pessoal para Sira).
- Recebe Fragmento da Mente.
- Decisão: deixar a cidade em mãos de quem?

**Karn-Tuhl (Ruínas do Corpo) — ~23 nós**
- Ruínas anãs em vento gélido; mortos-vivos errantes.
- Encontra **Durin Pedraferro**, espectro do rei anão.
- Provas para acessar o cofre: força (combate), saber (enigma), honra (julgamento).
- Boss: Forja Animada (golem dos guardiões mortos).
- Recebe Fragmento do Corpo.

#### Ato 3 — Cidadela das Sombras — ~15 nós
- Mapa abre uma vez; herói segue para Cidadela.
- Atravessa Portão de Sombras (skill check arcano).
- Encontra **Algoz de Vorthun** (combate de meio-fim).
- Sala do Trono: Vorthun oferece pacto.
- 4 ramos finais (ver §20).

---

## 16. Catálogo de Nós Narrativos

> **Convenção.** Cada entrada lista: ID, título curto, sinopse, escolhas e seus efeitos. Nós marcados como ★ têm prosa completa neste documento (escritores podem usar como gabarito de tom/extensão para os demais).

### 16.1 Ato 1 — Pedragar

#### `a1_pedragar_01` ★ — Abertura
**Imagem:** `scenes/cena_abertura.webp`
**Texto (varia por classe):**

> *(Mago)* O cheiro de incenso e poeira de livro envolve sua pequena oficina nos fundos da casa do Mestre Arvendel. Você acabou de fechar o terceiro volume do *Códex de Iluminação*, e o cajado quebrado de Vesperia repousa contra a parede como sempre — em silêncio, mas pesando mais a cada noite. Lá fora, o sino da vila bate pela quinta hora da tarde quando você ouve o grito.

> *(Ladina)* Você terminou de afiar a esquerda. A direita já espera no cinto. Há duas semanas você se esconde em Pedragar — vila pequena, longe de Bramford, longe da Guilda. Por enquanto, ninguém da Adaga Quieta sabe que você está aqui. Por enquanto. Você guarda as adagas e está prestes a se levantar quando ouve o primeiro grito.

> *(Bárbaro)* O sol baixa sobre as palhas de Pedragar, e seu machado totêmico ainda pinga a graxa da limpeza. Trabalho honesto: cortar lenha por cama e jantar. Dois invernos longe de casa, e ainda nenhum sinal de que o exílio vá acabar. Você levanta para guardar a ferramenta quando ouve o grito — agudo, pequeno, como criança.

**Escolhas:**
- → `a1_pedragar_02` — *"Correr para o grito."* (sem custo)
- → `a1_pedragar_03` — *"Pegar o item-chave antes."* (gasta 1 turno narrativo, mas inicia com bônus de prontidão na próxima cena)

#### `a1_pedragar_02` — Praça em chamas
**Sinopse.** Praça atacada por 2 Sombras Errantes. Aldeões fogem. Combate inevitável (1 Sombra Errante; segunda foge para os bosques). Após vitória, ouve voz fraca: "Aqui... aqui...".
**Escolhas:**
- → `a1_pedragar_05` (encontra Arvendel ferido).

#### `a1_pedragar_03` — Pegar item antes
**Sinopse.** Herói pega seu item-chave (cajado/adagas/machado). Ganha **flag `levou_item_chave: true`** que dá +1 Habilidade na próxima skill check de combate.
**Escolhas:**
- → `a1_pedragar_02`.

#### `a1_pedragar_05` — Mestre Arvendel ferido
**Sinopse.** Arvendel está sangrando atrás do altar. Reconhece o herói. Murmura sobre a profecia. Dá o **Mapa da Égide** (key item).
**Skill check opcional:** *Investigar* CD 9 — descobre que Arvendel foi atacado por traição interna (revelação narrativa que volta no Ato 3).
**Escolhas:**
- → `a1_pedragar_06` — *Ouvir a profecia toda.*
- → `a1_pedragar_06b` — *Cuidar do ferimento primeiro.* (Reputação +1; Arvendel sobrevive com mais saúde, ramificação no Ato 3.)

#### `a1_pedragar_06` — A Profecia
**Sinopse.** Arvendel — apesar do ferimento — começa imediatamente. Narra a história dos fragmentos e das três regiões. Diz o nome de Vorthun com cautela. Entrega o **Mapa da Égide**. A pressa custa: Arvendel desmaia ao terminar e fica em estado grave (flag `arvendel_grave: true`).
**onEnter:** `addKeyItem mapa_egide`, `setFlag arvendel_grave: true`.
**Escolhas:**
- → `a1_pedragar_07`.

#### `a1_pedragar_06b` — Cuidar Antes
**Sinopse.** O herói rasga uma tira de pano, estanca o sangramento, força um gole d'água. Arvendel respira mais firme. Só então ele começa a falar — e a profecia sai mais completa, com nomes que não diria sob dor. Entrega o **Mapa da Égide** e um **Amuleto de Arvendel** (key item de equipamento; +1 Sorte máxima enquanto carregado). Arvendel sobrevive em estado estável (flag `arvendel_estavel: true`).
**onEnter:** `addKeyItem mapa_egide`, `addItem amuleto_arvendel` ×1, `setFlag arvendel_estavel: true`, `+1 Reputação`.
**Escolhas:**
- → `a1_pedragar_07`.

#### `a1_pedragar_07` — Suprimentos
**Sinopse.** Antes de partir, o herói pode visitar até **2 locais** entre os 4 disponíveis. Cada visita seta a flag `_07_<destino>_visitado` e retorna ao próprio `a1_pedragar_07`; ao tentar uma terceira visita, todos os destinos já visitados aparecem desabilitados.
**Texto:**
> A vila tem mais sussurros do que pessoas. Os que ficaram não falam contigo, mas seguem-no com os olhos enquanto você caminha entre as casas. Antes de partir, há tempo para passar em dois lugares. Não três. Você sabe isso sem ninguém dizer.

**Escolhas:**
- → `a1_pedragar_07_ferreiro` — *"Casa do ferreiro."* (desabilitado se `_07_ferreiro_visitado`)
- → `a1_pedragar_07_mercado` — *"Mercado da vila."* (desabilitado se `_07_mercado_visitado`)
- → `a1_pedragar_07_capela` — *"Capela de Pedragar."* (desabilitado se `_07_capela_visitado`)
- → `a1_pedragar_07_arvendel` — *"Casa do Mestre Arvendel."* (desabilitado se `_07_arvendel_visitado`; só visível se ainda não foi)
- → `a1_pedragar_08` — *"Partir agora."*

> *Regra de duas visitas:* o contador `pedragar_visitas` (chave em `gameState.flags`) começa em 0 e vai até 2. Cada sub-nó incrementa o contador no `onEnter`. Se contador `>= 2`, todos os sub-nós ficam desabilitados, restando apenas "Partir agora".

#### `a1_pedragar_07_ferreiro` — Casa do Ferreiro
**Texto:**
> O ferreiro é gordo e silencioso. Tem brasa apagada na forja e olho vivo no balcão. Empurra para você três coisas que sobraram da última encomenda nunca paga.

**onEnter:** `setFlag _07_ferreiro_visitado: true`, incrementa contador de flags `pedragar_visitas`.
**Escolhas (mercador):**
- *"Comprar."* — abre mercador: `pocao_cura_menor` 12o, `po_cegueira` 15o, e (apenas Bárbaro) `lamina_afiada` 30o (item misc; descrita só aqui — `+1 dano em combate por 5 rounds`, uso único). Preço 1.0×.
- *"Despedir-se."* → `a1_pedragar_07`.

#### `a1_pedragar_07_mercado` — Mercado
**Texto:**
> A última barraca aberta vende ervas e duas coisas a mais. A vendedora não pergunta para onde você vai; só empacota o que você aponta.

**onEnter:** `setFlag _07_mercado_visitado: true`, incrementa contador de flags `pedragar_visitas`.
**Escolhas (mercador):**
- *"Comprar."* — `pocao_cura_menor` 12o, `pocao_cura` 25o, `carne_seca` 3o, `pocao_sorte` 35o (raro; só 1 em estoque).
- *"Despedir-se."* → `a1_pedragar_07`.

#### `a1_pedragar_07_capela` — Capela de Pedragar (Respiro do Ato 1)
**Texto:**
> A Capela é a casa mais alta da vila. Quem ainda reza está rezando agora. Você senta. A pedra do banco é fria, mas o silêncio é morno. Por um instante, é possível esquecer tudo o que está esperando do outro lado da porta. Você fecha os olhos. Quando os abre, a vela que estava no meio terminou — e a próxima já começou.

**onEnter:** `setFlag _07_capela_visitado: true`, incrementa contador de flags `pedragar_visitas`.
**Escolhas:**
- *"Descansar e rezar."* → aplica **Respiro do Ato 1**: Sorte → `maxSorte`, Energia → `min(maxEnergia, energia + ceil((maxEnergia - energia) / 2))`, limpa efeitos negativos persistentes, `+1 maxSorte` (bênção permanente desta run), `setFlag respiro_ato1_usado: true`. → `a1_pedragar_07`.
- *"Apenas acender uma vela e sair."* → `+1 Reputação`, sem Respiro. → `a1_pedragar_07`.

> *Nota:* o Respiro do Ato 1 é único (não pode ser repetido). A bênção permanente de +1 Sorte máxima dura a run inteira.

#### `a1_pedragar_07_arvendel` — Casa do Mestre Arvendel
**Texto:**
> A casa de Arvendel está em silêncio que pesa. Se ele está vivo, está dormindo no quarto dos fundos. Você passa pela escrivaninha, pelos livros que ele organizava de modo que só ele entendia. Há um descanso aqui que outras casas da vila não têm.

**onEnter:** `setFlag _07_arvendel_visitado: true`, incrementa contador de flags `pedragar_visitas`.
**Escolhas:**
- *"Descansar até pela manhã."* → Energia → `maxEnergia` (cura completa), sem efeito sobre Sorte. → `a1_pedragar_07`.
- *"Ver Arvendel uma última vez."* (apenas se `arvendel_estavel`) → `+1 Reputação`, ele entrega `pocao_sorte` ×1. → `a1_pedragar_07`.
- *"Sair sem mexer em nada."* → `+1 Reputação`. → `a1_pedragar_07`.

#### `a1_pedragar_08` — Encruzilhada
**Sinopse.** Herói sai da vila ao amanhecer. O `WorldMap` abre pela primeira vez. Jogador escolhe a primeira região do Ato 2.
**onEnter:** `setFlag mapa_destravado: true`.
**Escolhas (apresentadas como pins do `WorldMap`):**
- → `a2_mirthwood_01` — *"Floresta de Mirthwood."*
- → `a2_bramford_01` — *"Cidade de Bramford."*
- → `a2_karn_01` — *"Ruínas de Karn-Tuhl."*

> *Implementação:* este nó dispara a abertura da `<WorldMap>` em vez de exibir o `<NarrativeView>` padrão. As escolhas são pins clicáveis no mapa.

### 16.2 Ato 2 — Mirthwood, a Floresta da Vida (20 nós)

> Tom: místico, melancólico, vegetal. Floresta antiga adoecendo. Personagens lentos, frases curtas, sensorial.

#### `a2_mirthwood_01` ★ — Entrada da Floresta
**Imagem:** `scenes/mirthwood_entry.webp`
**Texto:**
> Mirthwood não começa nas árvores — começa três passos antes delas. O ar engrossa, ganha cheiro de musgo molhado e cogumelo doce. As runas no arco de carvalho retorcido brilham com a fadiga de uma brasa esquecida. Folhas que deviam ter caído no outono passado seguem penduradas, secas mas teimosas. O silêncio daqui não é ausência de som; é som contido, como uma plateia esperando alguém falar.
>
> Você pisa nas pedras musgosas do caminho. Quando olha para trás, a estrada já parece distante demais para a quantidade de passos que deu.

**Escolhas:**
- → `a2_mirthwood_02` — *"Seguir o caminho principal."*
- *"Procurar uma trilha lateral."* → `skill check Investigar CD 9, Sorte permitida`
  - Sucesso → `a2_mirthwood_03` (chega direto na cabana, com flag `pulou_fadas`)
  - Falha → `a2_mirthwood_02` com efeito `{kind:'energy', amount:-1}`

#### `a2_mirthwood_02` — As Três Que Esperam
**Imagem:** —
**Texto:**
> Três luzinhas pendem no ar à altura dos seus olhos, cada uma do tamanho de um punho fechado. Pousam sobre a curva onde o caminho some entre os fetos. A azul fala primeiro, e a voz é de menina muito velha:
>
> — Andarilho, andarilho. Mirthwood pede pedágio. Não em ouro: em escolha.
>
> A vermelha ri sem parar de rir.
>
> — Diga uma verdade que custe, ou conte uma mentira que sirva, ou abra a bolsa.
>
> A verde não fala. Apenas observa, e algo na maneira como observa lembra você de quando o Mestre Arvendel lia páginas pelas costas das pessoas.

**Escolhas:**
- *"Falar uma verdade que custe."* → `skill Persuadir CD 9` — sucesso: passa, +1 Reputação, flag `fadas_amistosas`. Falha: passa mesmo assim, mas -1 Energia (a verdade dói também a quem ouve).
- *"Inventar uma boa história."* → `skill Trapaça CD 11` — sucesso: passa, ganha pista (flag `fadas_amistosas`, item `erva_sombra` ×1). Falha: -2 Energia (puxam um fio de ti), passa.
- *"Pagar o pedágio."* → -10 ouro (se não tiver: bloqueada). Passa.
- *"(Bárbaro) Atravessar à força."* `classRequirement: 'barbaro'` → `skill Atletismo CD 11` — sucesso: -1 Reputação, passa. Falha: combate `sombra_bosque` ×1, passa.
- *"(Mago) Reconhecer a magia das fadas."* `classRequirement: 'mago'` → `skill Arcano CD 9` — sucesso: as fadas se curvam, passa com +2 Sorte (flag `bencao_verde`). Falha: trata como tentativa de Persuadir CD 9.

→ Após resolução: `a2_mirthwood_03`.

#### `a2_mirthwood_03` — Cabana da Velha Garra
**Imagem:** —
**Texto:**
> A cabana de Velha Garra encosta num carvalho como uma criança encostada na mãe. Tem mais musgo do que telhado e mais ervas penduradas do que parede. A porta está aberta. Quando você cruza o batente, a velha já está virada para a panela, e fala sem se voltar:
>
> — Sentou? Bebe.
>
> Há duas xícaras na mesa. Uma fumega. A outra não. Ela aponta para a que fumega com a colher. Olhos cinzentos, finos. Quase translúcidos.
>
> — Sei o que você procura. Sei quem o mandou. E sei que Mirthwood não está bem. — Ela bate a colher na borda da panela. — Korvath caiu, garoto/a. Caiu no fundo onde ainda tem fundo. Vai ter que descer atrás.

**onEnter:** —

**Escolhas:**
- *"Pedir o caminho até Korvath."* → `a2_mirthwood_04`. Velha Garra marca três trilhas no seu mapa.
- *"Comprar ervas."* → abre mercador (oferece `erva_sombra` 18o, `pocao_cura` 20o, `pocao_sorte` 28o — preço 0.9× para fadas amistosas).
- *"Perguntar sobre a oferta sombria."* (visível só com flag `fadas_amistosas` ou Reputação ≤ -1) → diálogo extra que dá flag `sabe_sobre_selo`. → `a2_mirthwood_03` (loop até sair).
- *"Despedir-se."* → `a2_mirthwood_04`.

#### `a2_mirthwood_04` — Trilha Sagrada
**Imagem:** —
**Texto:**
> A trilha se abre em três línguas a poucos passos da cabana. À esquerda, um corredor de pinheiros tão silenciosos que o silêncio começa a doer. À frente, um riacho que canta — sim, canta, em vogais que quase formam palavras. À direita, lápides de pedra musgosa marcam um cemitério druídico que respira devagar.
>
> Velha Garra disse: "Os três levam ao mesmo lugar. Mas cada um cobra um preço diferente, e dá um presente diferente." Você escolhe.

**Escolhas:**
- → `a2_mirthwood_05a` — *"O corredor de pinheiros silenciosos."*
- → `a2_mirthwood_05b` — *"O riacho que canta."*
- → `a2_mirthwood_05c` — *"Os túmulos antigos."*

#### `a2_mirthwood_05a` — O Corredor de Pinheiros
**Texto:**
> O silêncio aqui é objeto. Você pode ouvir seus próprios olhos piscarem. No meio do corredor, encurvado entre dois troncos, há um veado branco. Uma flecha de sombra atravessa-lhe o flanco. A flecha não tem haste — apenas a forma de uma haste, feita de fumaça que não se dissipa. O veado olha para você com olhos antigos demais para um animal.

**Escolhas:**
- *"Tentar arrancar a flecha."* → `skill Arcano CD 9` (Mago: +2) — sucesso: o veado se ergue, te toca a testa com o focinho, +2 Sorte e flag `bencao_floresta`. Falha: -2 Energia (a flecha morde sua mão), o veado se vai.
- *"Acabar com o sofrimento dele."* → -1 Reputação, ganha `chifre_lunar` (item misc, vende por 25o), flag `feriu_sagrado`.
- *"Deixar o veado em paz e seguir."* → segue sem efeito.

→ `a2_mirthwood_06`.

#### `a2_mirthwood_05b` — O Riacho que Canta
**Texto:**
> A água canta na sua direção, devagar, como mulher cantando para criança que não dorme. Quando você se aproxima, uma figura se desprende da margem — pele de casca, cabelos de musgo, olhos de água parada. A driada estende a mão.
>
> — Bebe — ela diz. — Mas, se beber, paga.

**Escolhas:**
- *"Beber e pagar a sede da floresta."* → +6 Energia, +2 Sorte, mas perde 1 item-chave **se** o jogador carrega `selo_sombrio` (a driada arranca). Caso contrário, perde 1d4 ouro como "sede".
- *"Recusar com cortesia."* → `skill Persuadir CD 9` — sucesso: a driada ri, te dá `pocao_cura` ×1. Falha: -1 Reputação (ela considera o gesto rude).
- *"(Ladina) Encher o cantil sem ser vista."* `classRequirement: 'ladino'` → `skill Furtividade CD 11` — sucesso: ganha `pocao_cura` ×2 furtada, +0 Reputação (a floresta vê). Falha: combate `sombra_bosque` ×1.

→ `a2_mirthwood_06`.

#### `a2_mirthwood_05c` — Os Túmulos Antigos
**Texto:**
> As lápides são tão velhas que viraram parte das árvores. Em uma delas, um espírito sentado, com os pés enterrados no próprio túmulo, lê um livro que não está lá. Ergue os olhos quando você se aproxima.
>
> — Diga em voz alta — a voz dele é eco — por que veio. Sem floreios. Sem mentira. Os mortos não comem mentira.

**Escolhas:**
- *"Vim atrás do Fragmento da Vida para impedir Vorthun."* → +1 Reputação, o espírito te dá `chave_de_raiz` (key item; abre atalho em `a2_mirthwood_06`).
- *"Vim atrás do que me devem."* → -1 Reputação, o espírito te encara longamente e some.
- *"(Mago) Falar a verdade nas runas druídicas."* `classRequirement: 'mago'` → +2 Reputação, `pergaminho_de_raiz` (item misc 30o), o espírito sorri pela primeira vez em séculos.

→ `a2_mirthwood_06`.

#### `a2_mirthwood_06` — O Bosque Profanado
**Imagem:** `scenes/korvath.webp` (intro)
**Texto:**
> Os três caminhos se encontram numa clareira que não devia existir. As árvores aqui têm cor de carne queimada e uma seiva preta como tinta. No centro, um círculo de pedras druídicas, todas tombadas para o mesmo lado, como se fugissem de algo no meio. Onde o "meio" devia estar, há um homem ajoelhado de costas para você, vestido de verde podre. Ele não se vira ainda.
>
> Antes que ele se vire, três sombras com forma de cervo levantam-se das pedras tombadas.

**Escolhas:**
- → `a2_mirthwood_07` — *"Atacar antes que cerquem."*
- *"(Ladina) Tentar um ataque-surpresa."* `classRequirement: 'ladino'` → `skill Furtividade CD 11` — sucesso: começa `a2_mirthwood_07` com Apunhalar nas Sombras pré-armado (próximo combate o poder ganha +2 dano). Falha: começa `a2_mirthwood_07` normal.

#### `a2_mirthwood_07` — Combate: Sombras do Bosque
**Combate:** `sombra_bosque` ×1 (representa a alcateia; 1v1 simplificado, mas com +2 dano para representar o número).

> *Nota mecânica:* para manter o motor 1v1, o encontro usa estatísticas combinadas — `sombra_bosque` boss-version: Hab 8, Energia 14, dano 1d6+1, fugível: não.

**Após vitória:** → `a2_mirthwood_08`. **Após derrota:** game over padrão.

#### `a2_mirthwood_08` — Korvath se Volta
**Imagem:** `scenes/korvath.webp`
**Texto:**
> A última sombra desfaz-se em fumaça de carvão e o homem em verde podre finalmente se levanta. Os galhos da coroa de antlers em sua cabeça são pretos, vivos, e crescem alguns centímetros enquanto você o olha. O rosto é jovem; os olhos não.
>
> — Eu não pedi por isso — diz Korvath. — Pedi pela floresta. Mas ela aceitou. E quem aceita o trato escuta a voz que oferece. — Ele sorri, e o sorriso é cansado. — Você veio pelo Fragmento. Ele está em mim. Tira, se puder. Ou ouve, se preferir ouvir.

**Escolhas:**
- → `a2_mirthwood_09` — *"Ouvir o que ele tem a dizer."*
- → `a2_mirthwood_11a` — *"Acabar com isso. Atacar."*
- *"(Mago) Reconhecer o pacto que o tomou."* `classRequirement: 'mago'` → `skill Arcano CD 11` — sucesso: descobre que o pacto é reversível, abre escolha extra em `a2_mirthwood_09` (CD reduzida de 13 → 11). Falha: → `a2_mirthwood_09`.

#### `a2_mirthwood_09` — Tentar Redimir
**Texto:**
> Korvath conta — em frases que param no meio — como uma voz veio nas raízes, ofereceu salvar Mirthwood do mofo que vinha do oeste, e cobrou em troca apenas "uma camada de você". Ele aceitou. Não percebeu, na primeira camada, que não era a última.
>
> Você sente, atrás de tudo, a mesma voz tentando alcançá-lo a partir do verde podre dele.

**Escolhas:**
- *"Convencê-lo a renunciar ao pacto."* → `skill Persuadir CD 13` (CD 11 se flag `pacto_reversivel`), Sorte permitida. Sucesso → `a2_mirthwood_11b` (redenção). Falha → `a2_mirthwood_11a` (combate, Korvath enraivecido: +1 Habilidade no chefe).
- *"Tomar o Fragmento à força."* → `a2_mirthwood_11a`.
- *"(Bárbaro) Falar de exílio."* `classRequirement: 'barbaro'` → `skill Persuadir CD 11` (Bárbaro normalmente penalizado, mas aqui usa Intimidar +2 como bônus narrativo: total = 2d6 + 2). Sucesso → `a2_mirthwood_11b`. Falha → `a2_mirthwood_11a`.
- *"(Ladina) Mentir que o pacto pode ser refeito."* `classRequirement: 'ladino'` → `skill Trapaça CD 11`. Sucesso → `a2_mirthwood_11b` *com flag `mentiu_korvath`* (Reputação -1, mas evita combate). Falha → `a2_mirthwood_11a`.

#### `a2_mirthwood_11a` — Combate Korvath
**Combate:** `combat_korvath` (chefe regional, ver §17). Não-fugível.

**Vitória → `a2_mirthwood_12_morto`.** **Derrota → game over.**

#### `a2_mirthwood_11b` — Korvath Redimido
**Texto:**
> Algo se desfaz no rosto de Korvath, devagar — como uma máscara que ele não sabia que usava. Os antlers pretos murcham, ficam galhos comuns, caem com um chocalho seco. Ele tomba de joelhos. Tira do peito o Fragmento da Vida — uma lasca de cristal verde que pulsa como veia — e estende para você com as duas mãos.
>
> — Cuide dela melhor do que eu — diz, e não está claro se fala do fragmento ou da floresta. — Eu fico. Vou tentar curar o que profanei.

**onEnter:** `+2 Reputação`, `flag korvath_vivo: true`, `addKeyItem frag_vida`.
**Escolhas:**
- → `a2_mirthwood_12_redimido`.

#### `a2_mirthwood_12_morto` — A Coroa que Sobra
**Texto:**
> Korvath cai. Os antlers pretos rachados estalam com um som de gelo cedendo. Onde o peito devia continuar peito, há agora um pequeno cristal verde, do tamanho de uma pera, pulsando como veia. Você o pega. O cristal está morno.
>
> Algo, na coroa quebrada, ainda observa você. E fala sem boca.
>
> *— Há uma camada do dele que ele não usou. Posso te oferecer. Aceita?*

**onEnter:** `addKeyItem frag_vida`, `+1 Reputação` (você fez o que tinha que ser feito).
**Escolhas:**
- *"Aceitar o Selo Sombrio."* → +2 Habilidade permanente, `addKeyItem selo_sombrio`, `-3 Reputação`, flag `selo_mirthwood`. → `a2_mirthwood_13`.
- *"Recusar o Selo."* → +1 Reputação, flag `recusou_selo_mirthwood`. → `a2_mirthwood_13`.

#### `a2_mirthwood_12_redimido` — A Coroa que Resta
**Texto:**
> Os galhos pretos jazem no chão como coisas mortas. Korvath, ajoelhado, pousa a mão no centro da pedra druídica e fica em silêncio. Você olha para o cristal verde na sua palma, depois para ele.
>
> Não há voz oferecendo nada desta vez. Mas a sombra entre as raízes ainda observa.

**Escolhas:**
- → `a2_mirthwood_13`.

#### `a2_mirthwood_13` — Respiro de Sorte (Cabana de Velha Garra)
**Imagem:** —
**Texto:**
> A cabana de Velha Garra continua exatamente onde estava — só você é que mudou. Há de novo duas xícaras na mesa. Desta vez, ambas fumegam. A velha aponta para a sua. Senta. Você senta.
>
> — Carrega muita coisa, garoto/a. Bebe. Coisa de chá é descansar antes da próxima tempestade. — Ela sorri e o sorriso tem mais dentes do que dentes. — Bebe.

**Escolhas:**
- *"Descansar aqui."* → aplica Respiro: Sorte → max, Energia → +50% do que falta, limpa efeitos negativos persistentes, flag `respiro_ato2_usado`. (Só funciona se nenhum outro Respiro do Ato 2 foi usado.) → `a2_mirthwood_14`.
- *"Agradecer e seguir adiante."* → segue sem cura. → `a2_mirthwood_14`.

> *Nota:* se o jogador já usou o Respiro em outra região do Ato 2, a opção *"Descansar"* aparece desabilitada com tooltip "Você já usou o Respiro deste ato".

#### `a2_mirthwood_14` (Mago exclusivo) — A Runa Sob a Cabana
**classRequirement:** 'mago'
**Texto:**
> Ao se levantar, você nota algo: uma das tábuas do chão da cabana tem uma runa quase apagada. Velha Garra acompanha o seu olhar e ergue uma sobrancelha.
>
> — Vê isso, é? Bom. Pega. Estava esperando alguém que enxergasse.

**Escolhas:**
- *"Decifrar a runa."* → `skill Arcano CD 9` — sucesso: ganha `pergaminho_de_raiz` (item; em combate, gasta turno e dá +3 Sorte instantâneo). Falha: nenhum efeito.
- *"Recusar; não é meu."* → +1 Reputação. Velha Garra assente.

→ `a2_mirthwood_15`.

#### `a2_mirthwood_15` — Saída de Mirthwood
**Imagem:** —
**Texto:**
> A floresta o solta com mais facilidade do que o segurou. As runas do arco de carvalho, quando você passa por baixo dela ao sair, brilham um pouco mais firmes — não como brasa cansada, mas como brasa lembrada. Não é vitória. É um respiro de árvore que voltou a respirar.
>
> O Mapa abre na sua mão. Faltam dois fragmentos.

**onEnter:** flag `mirthwood_concluido`. Se 3 fragmentos: avança Ato 3.
**Escolhas:**
- → `WorldMap` (mapa interativo abre; jogador escolhe próxima região do Ato 2 ou, se 3/3, Cidadela das Sombras).

**Combate-chave:** `combat_korvath` (ver §17).

> *Revisitas a Mirthwood (apenas para mercadora):* o jogador pode reabrir a cabana de Velha Garra a partir do `WorldMap` enquanto estiver no Ato 2. A cabana funciona apenas como mercador (loop sobre `a2_mirthwood_03`); nenhum diálogo novo é desbloqueado.

### 16.3 Ato 2 — Bramford, a Cidade da Mente (22 nós)

> Tom: urbano, cinza, intriga. Cidade comercial em decadência institucional. Diálogos rápidos, ruas barulhentas, sussurros nos becos.

#### `a2_bramford_01` ★ — Portão de Bramford
**Imagem:** `scenes/bramford_market.webp` (vista geral)
**Texto:**
> Bramford fede a peixe e a metal. As muralhas são altas demais para a quantidade de guardas que as patrulha — três no portão sul, dois inclinados como se a alabarda pesasse mais do que a coragem. Um deles bate a mão contra a sua bolsa quando você passa, mais por hábito do que por suspeita, e diz "passa", e não olha mais.
>
> Lá dentro, é o ruído. Mercadores gritando preços, cavalos gritando porque mercadores gritam, sinos da Guarda batendo a hora errada por dois segundos. Acima de tudo, sobre o telhado mais alto da cidade, uma cúpula de pedra fechada por correntes — o Templo do Saber. Você veio por causa daquela cúpula.

**Escolhas:**
- → `a2_bramford_02` — *"Ir ao mercado central."*
- → `a2_bramford_03` — *"Buscar uma taverna para ouvir a cidade."*
- *"(Ladina) Pegar o caminho dos becos."* `classRequirement: 'ladino'` → flag `evitou_guarda` (-1 ouro de propina não paga, +0 Reputação). → `a2_bramford_03`.

#### `a2_bramford_02` — Mercado de Belaron
**Texto:**
> A barraca de Mestre Belaron é uma exceção: organizada, com itens dispostos em fileiras, cada um com uma etiqueta de pergaminho amarrada por barbante azul. Belaron é magro, cara fina, lentes presas num cordão. Reconhece um aventureiro pela sola do sapato.
>
> — Você caminhou por estrada de terra recente — diz ele, sem cumprimentar. — Floresta, talvez. Tem cheiro. Posso te vender alguma coisa que não te deixa morrer no caminho do Templo.

**Escolhas:**
- *"Comprar."* → mercador (oferece `pocao_cura_menor` 12o, `pocao_cura` 25o, `pocao_sorte` 30o, `po_cegueira` 15o, `botas_silenciosas` 80o).
- *"Perguntar sobre o Templo do Saber."* → diálogo: Belaron explica que o Templo está fechado pela Guarda há dois meses; corrente nas portas; "se quer entrar, precisa de Vellis ou de quem manda em Vellis". Flag `sabe_do_templo`.
- *"Perguntar sobre a Guilda da Adaga Quieta."* (se Ladina) → ele empalidece e fala baixo: a Senhora Sombria voltou da Capital, e ninguém sabe o que ela quer com Bramford. Flag `sabe_senhora_sombria`. **Sira:** ouve um nome — um nome que reconhece. → `a2_bramford_02b_sira`.
- *"Despedir-se."* → `a2_bramford_03`.

#### `a2_bramford_02b_sira` (Ladina exclusivo) — Um Nome Ouvido
**classRequirement:** 'ladino'
**Texto:**
> O nome que Belaron sussurrou sai da boca dele e entra em você como uma pedra entra na água. *Aelin Faro.* Aelin Faro foi quem entrou na sua casa naquela noite. Foi quem sorria enquanto sua mãe gritava. Foi quem, sete anos depois, cortou as três crianças que viram demais nas docas. Aelin Faro virou Senhora Sombria. Bom. Bom.
>
> Você fica em silêncio um momento longo demais. Belaron não pergunta nada.

**onEnter:** flag `sira_arco_pessoal: true`.
**Escolhas:**
- → `a2_bramford_03`.

#### `a2_bramford_03` — A Taverna "O Pé Quebrado"
**Texto:**
> "O Pé Quebrado" tem mesa pegajosa, ale ralo, e clientela que prefere o canto das paredes. Você senta. Em três minutos, sem pedir, três conversas chegam aos seus ouvidos: uma sobre roubo de cavalos, uma sobre uma noite em que a Guarda perdeu controle do bairro do porto, e uma — mais baixa, mais firme — sobre alguém da Guilda querendo "passar mensagem para forasteiros novos".
>
> Um homem de bigode molhado de espuma se aproxima com um caneco a mais. Sorri.

**Escolhas:**
- *"Ouvir o que ele tem para dizer."* → `skill Investigar CD 9` (Sorte permitida) — sucesso: descobre o nome de contato da Guarda (Cap. Vellis) E da Guilda (homem do beco da Roda Quebrada); +1 ao próximo skill check do ato. Falha: descobre só uma das duas (escolhida aleatoriamente).
- *"Pagar uma cerveja em troca de informação."* → -3 ouro, mesma informação que sucesso de Investigar.
- *"Ignorar e sair."* → vai a `a2_bramford_04` sem informação extra.

→ `a2_bramford_04`.

#### `a2_bramford_04` — Os Dois Que Esperam
**Texto:**
> Ao sair da taverna, você os encontra. Os dois. Em becos opostos da rua, como xadrez.
>
> À direita, sob a lanterna oficial: **Capitão Vellis**, casaco azul-rei surrado, cicatriz no canto da boca, mão pousada na espada como se sempre estivesse pousada. Ele acena com a cabeça uma vez. Apenas.
>
> À esquerda, sob nada: uma figura encapuzada, magra, dedos longos. Faz com a mão direita o sinal da Guilda — três dedos curvados, polegar dentro. Convite ou ameaça, dá no mesmo na linguagem deles.
>
> Bramford não vai te deixar conversar com os dois. Você precisa escolher um lado para entrar no Templo.

**Escolhas:**
- → `a2_bramford_05_guarda` — *"Ir falar com Vellis."*
- → `a2_bramford_05_guilda` — *"Ir falar com a Guilda."*
- *"(Ladina) Tentar despistar os dois e seguir sozinha."* `classRequirement: 'ladino'` → `skill Furtividade CD 13`, Sorte permitida. Sucesso: pula direto para `a2_bramford_09` (Templo) com flag `entrou_sozinha` e -2 Energia (escalada noturna). Falha: a Guilda te encurrala — vai forçada para `a2_bramford_05_guilda` com -1 Reputação.

#### `a2_bramford_05_guarda` — Capitão Vellis
**Texto:**
> Vellis te leva para um cubículo nas casernas onde uma única vela arde acima de mapas amassados. Aponta com a faca de pão para uma marcação no porto.
>
> — Tem uma célula da Adaga Quieta no armazém 14. Eles guardam o que destranca o Templo. Se você acabar com eles, eu destranco. Simples. Honra contra honra.
>
> Ele coloca a faca em pé.
>
> — Não é simples.

**Escolhas:**
- *"Aceitar a missão."* → flag `aliado_guarda`. → `a2_bramford_06_guarda`.
- *"Pedir mais detalhes."* → diálogo: Vellis admite que perdeu três homens na última tentativa; oferece +1 `pocao_cura` se você fizer. Aceita: → `a2_bramford_06_guarda` com poção. Recusa: → `a2_bramford_05_guarda` (loop).
- *"Recusar e procurar a Guilda."* → -1 Reputação ("você prometeu ouvir e não ouviu", segundo ele). → `a2_bramford_05_guilda`.

#### `a2_bramford_06_guarda` — Armazém 14
**Texto:**
> O armazém cheira a sal velho e a metal úmido. Há três vultos numa mesa baixa: dois jogando dados, um afiando algo. As lanternas baixas pintam o chão de meia-luz. Não te viram. Ainda.

**Escolhas:**
- *"Atacar de surpresa."* → `skill Furtividade CD 9` (Ladina: +2 → CD efetiva 7) — sucesso: começa combate com Apunhalar nas Sombras pré-armado / Bola de Fogo grátis (Mago) / Investida grátis (Bárbaro) no primeiro round. Falha: combate normal.
- *"Negociar a saída deles."* → `skill Persuadir CD 11`. Sucesso: dois fogem, fica um (combate enfraquecido: `assassino_guilda` Energia 7); +1 Reputação. Falha: combate normal.
- *"(Bárbaro) Quebrar a porta gritando."* `classRequirement: 'barbaro'` → `skill Intimidar CD 9` (Bárbaro: +2 → CD efetiva 7). Sucesso: dois fogem; segundo combate é `assassino_guilda` normal mas com -2 Energia. Falha: combate normal.

→ `a2_bramford_07_guarda` (combate).

#### `a2_bramford_07_guarda` — Combate na Doca
**Combate:** `assassino_guilda` (1v1; representa o que sobrou do grupo). Fugível: não.

**Vitória:** ganha `chave_do_templo` (key item), `addItem po_cegueira` ×1, +20 ouro. → `a2_bramford_08_guarda`.

#### `a2_bramford_08_guarda` — Relatório a Vellis
**Texto:**
> Vellis examina a chave que você deixa cair na mesa dele. Os olhos não pesam mais. Ele assente devagar e empurra na sua direção um pequeno frasco de vidro escuro: licor de junípero, dos bons. Não fala. Em Bramford, esse silêncio é gratidão.
>
> — A corrente do Templo cai amanhã ao amanhecer. Você decide se entra com a Guarda escoltando, ou sozinho/a.

**Escolhas:**
- *"Entrar com a escolta."* → +0 dificuldade nos enigmas, mas a Senhora Sombria sabe que você vem (flag `entrada_publica`; Senhora Sombria recupera +4 Energia no combate dela). → `a2_bramford_09`.
- *"Entrar sozinho/a."* → flag `entrada_silenciosa`. → `a2_bramford_09`.

#### `a2_bramford_05_guilda` — A Sala dos Sussurros
**Texto:**
> O encapuzado te leva por dois becos, três escadarias e um alçapão até uma sala onde só há velas e silhuetas. Uma das silhuetas avança meia cara para a luz. Mulher. Sorri sem entregar dente.
>
> — A Guilda quer o Selo do Capitão Vellis. Coisa pequena. Bronze. Está na gaveta dele. Você devolve, e a corrente do Templo cai. Não vai precisar matar ninguém. Provavelmente.

**Escolhas:**
- *"Aceitar."* → flag `aliado_guilda`. → `a2_bramford_06_guilda`.
- *"Pedir mais."* → diálogo: ela oferece também `botas_silenciosas` ao final. Aceita: → `a2_bramford_06_guilda` com promessa. Recusa: → `a2_bramford_05_guilda` (loop).
- *"(Sira) Perguntar sobre Aelin Faro."* `flagRequirement: sira_arco_pessoal` → ela diz: "A Senhora prefere encontros formais. Termine o trabalho e ela talvez te receba." Flag `sira_promessa_encontro`. → `a2_bramford_06_guilda`.

#### `a2_bramford_06_guilda` — A Casa de Vellis
**Texto:**
> A casa de Vellis fica acima do quartel: três cômodos, uma estante, uma mesa de madeira tão polida que reflete a vela. A gaveta da escrivaninha está trancada por uma fechadura simples — para ele. Para você, depende.

**Escolhas:**
- *"Forçar a fechadura."* → `skill Furtividade CD 9` (Ladina: +2). Sucesso: pega o Selo. Falha: -2 Energia (espinho mecânico) e *segundo* tentar → CD 11 ou desistir.
- *"(Ladina) Usar a gazua de origem."* `classRequirement: 'ladino'`, `itemRequirement: 'gazua'` → automático, sem rolagem. (Sira já carrega gazua de início.)
- *"(Mago) Truque arcano."* `classRequirement: 'mago'` → `skill Arcano CD 9`. Sucesso: pega o Selo. Falha: -2 Energia.
- *"(Bárbaro) Arrombar com calma."* `classRequirement: 'barbaro'` → `skill Atletismo CD 11`. Sucesso: pega o Selo, -1 Reputação (faz barulho). Falha: alarme, combate `assassino_guilda` (guarda da casa).

→ `a2_bramford_07_guilda`.

#### `a2_bramford_07_guilda` — A Saída pela Janela
**Texto:**
> Selo no bolso. Uma sombra sobe a escada do cômodo ao lado. Não é Vellis: é maior, mais leve. Você tem três batidas de coração para decidir.

**Escolhas:**
- *"Pular pela janela."* → `skill Atletismo CD 9`. Sucesso: -1 Energia, escapa. Falha: -3 Energia, escapa de qualquer jeito.
- *"Esconder-se atrás da estante."* → `skill Furtividade CD 11`. Sucesso: a sombra passa, escapa limpo. Falha: combate `assassino_guilda` enfraquecido (Energia 7).
- *"Atacar primeiro."* → combate `assassino_guilda` direto.

→ `a2_bramford_08_guilda`.

#### `a2_bramford_08_guilda` — A Senhora Sombria
**Imagem:** `scenes/senhora_sombria.webp` (intro)
**Texto:**
> A Senhora Sombria recebe você em um salão sem janelas. Quatro velas. Um tabuleiro de pedra branco e preto na mesa, peças interrompidas no meio de um lance. Ela aceita o Selo, gira-o entre dois dedos. Olha para você longamente.
>
> — Bem feito — diz. — A corrente do Templo cai esta noite. Eu mesma vou descer com você. Há coisas no Templo que precisam responder a perguntas minhas.

**classVariants:**
> *(Sira)* Você reconhece os olhos antes do rosto. Ela também reconhece os seus. O sorriso dela se contém um milímetro. — Pequena gata-velha. Quanto tempo. Vamos terminar uma conversa antiga juntas, então.

**Escolhas:**
- *"Concordar em descer com ela."* → flag `desce_com_senhora`; o combate em `a2_bramford_15` é precedido de troca de palavras mais longa. → `a2_bramford_09`.
- *"(Sira) Atacar agora."* `classRequirement: 'ladino', flagRequirement: sira_arco_pessoal` → combate `combat_senhora_sombria` *aqui*, sem enigmas; recompensa só fragmento, sem ouro extra. → após vitória, `a2_bramford_16_alt`.
- *"Aceitar mas planejar fugir lá dentro."* → flag `pretende_trair`. → `a2_bramford_09`.

#### `a2_bramford_09` — As Portas do Templo do Saber
**Imagem:** `scenes/templo_saber.webp`
**Texto:**
> A corrente cai com um som que parece pergunta. As portas se abrem para um corredor de pedra que afunda mais do que sobe — três degraus, dez, vinte, cada um marcado com uma runa diferente, todas indistintas no escuro úmido. No fim, uma sala redonda, três portas seladas, três runas vivas pulsando com luz fraca azul. Uma de cada cor: prata, âmbar, azul-cobalto. Uma de cada tipo de prova.

**Escolhas:**
- → `a2_bramford_10` — *"Tentar a porta de prata (Arcano)."*
- → `a2_bramford_11` — *"Tentar a porta de âmbar (Investigar)."*
- → `a2_bramford_12` — *"Tentar a porta de cobalto (Resistir Magia)."*

> *Estrutura:* o jogador deve passar pelas 3 provas para abrir a Câmara Central. Pode tentá-las em qualquer ordem. Falhar em uma prova custa Energia mas permite tentativa nova depois (a runa "se fecha por hora") — se gastar mais de 2 falhas no Templo total, sai com -1 Reputação ("o Saber percebe esforço; falha demais ofende").

#### `a2_bramford_10` — Porta de Prata: Arcano
**Texto:**
> A runa de prata é uma equação. Não exatamente uma equação de números, mas você reconhece o ritmo: três símbolos giram, dois ficam, um falta. Falta o quê?

**Escolhas:**
- *"Resolver a equação."* → `skill Arcano CD 9`, Sorte permitida. Sucesso: porta abre, +0 efeito. Falha: -2 Energia, runa se fecha (volta a `a2_bramford_09` para tentar outra; pode voltar mais tarde).
- *"Quebrar à força a runa."* (Bárbaro) → `skill Atletismo CD 13`. Sucesso: porta abre, -2 Reputação ("vandalismo do Saber"), -1 Energia. Falha: -4 Energia.

→ Se 3/3 portas abertas: `a2_bramford_13`. Senão: → `a2_bramford_09`.

#### `a2_bramford_11` — Porta de Âmbar: Investigar
**Texto:**
> A runa de âmbar mostra cinco rostos esculpidos no batente, cada um expressando algo diferente. Embaixo, em escrita druídica antiga, a frase: "Apenas o que mente sorri sem motivo." Quatro rostos sorriem. Um sorri menos. Um não sorri. Um sorri muito.

**Escolhas:**
- *"Apontar para um rosto."* → `skill Investigar CD 9`. Sucesso: identifica o rosto correto (o que sorri sem motivo claro). Falha: -2 Energia (faísca dolorida no braço).
- *"(Mago) Ler a escrita druídica completa."* `classRequirement: 'mago'` → CD efetiva 7 (Mago tem +1 Investigar e +2 Arcano combinados). Sucesso direto.

→ Se 3/3 portas: `a2_bramford_13`. Senão: `a2_bramford_09`.

#### `a2_bramford_12` — Porta de Cobalto: Resistir
**Texto:**
> Quando você se aproxima da runa de cobalto, ela se abre como um olho que estava fingindo dormir. Uma voz entra na sua cabeça e tenta tomar a cadeira que pertence à sua. *Diga seu nome*, ela exige. *Diga o nome de quem você ama. Diga o que tem mais medo de perder.*

**Escolhas:**
- *"Resistir."* → `skill Resistir Magia CD 11`, Sorte permitida. Sucesso: porta abre, +0 efeito. Falha: -3 Energia E -1 Sorte (a voz arranca um pouco).
- *"(Bárbaro) Aceitar e gritar de volta."* `classRequirement: 'barbaro'` → `skill Intimidar CD 11`. Sucesso: porta abre, +1 Reputação ("o Saber respeita coragem bruta"). Falha: -2 Energia, tenta de novo.

→ Se 3/3 portas: `a2_bramford_13`.

#### `a2_bramford_13` — A Câmara do Saber
**Texto:**
> A Câmara Central é redonda e fica vazia até o momento em que você entra. Aí, sim, ela se preenche: prateleiras com livros que ninguém leu mas alguém quis que sobrevivessem; um pedestal no centro; sobre o pedestal, suspenso a um dedo da pedra, um cristal âmbar do tamanho de um ovo de codorna. Ele zumbe baixinho.
>
> Você se aproxima. O cristal o reconhece — você jura que ele se inclina um pouco em sua direção. E é nesse instante que a sombra fala atrás de você.

**Escolhas:**
- → `a2_bramford_14`.

#### `a2_bramford_14` — A Senhora Sombria, no Pedestal
**Imagem:** `scenes/senhora_sombria.webp`
**Texto:**
> Aelin Faro — Senhora Sombria — está parada entre você e a saída. Ela não estava aí dois segundos atrás. As correntes da entrada agora gemem alto, fechando-se sozinhas atrás dela.
>
> — Eu cuido daqui — diz. — Você fez sua parte. Pode ir embora vivo se for embora agora. Sem o Fragmento, naturalmente.

**classVariants:**
> *(Sira)* Ela olha para você de um jeito que diz "menina, você cresceu." Você olha de volta de um jeito que diz "você morre hoje".

**Escolhas:**
- *"Recusar. O Fragmento é meu."* → `a2_bramford_15` (combate).
- *"(Sira) Falar o nome dela em voz alta."* `flagRequirement: sira_arco_pessoal` → -1 efeito de surpresa para ela no combate (perde 1 round de iniciativa); +1 Reputação para Sira. → `a2_bramford_15`.
- *"(Mago) Identificar que ela usa selo de Vorthun."* `classRequirement: 'mago'` → `skill Arcano CD 9`. Sucesso: descobre que o selo dela está incompleto; ela perde -2 Habilidade no combate. → `a2_bramford_15`.
- *"Aceitar e ir embora."* → -2 Reputação, **não pega o Fragmento**. Sai com flag `desistiu_bramford` (impede o final Heroico mais adiante). → `a2_bramford_19`.

#### `a2_bramford_15` — Combate: Senhora Sombria
**Combate:** `combat_senhora_sombria`. Não-fugível.
**Modificadores:**
- Se `entrada_publica`: Senhora Sombria começa com +4 Energia.
- Se `flagRequirement: sira_arco_pessoal` E falou nome em `a2_bramford_14`: Senhora perde 1 round (jogador age duas vezes seguidas).
- Se Mago identificou selo incompleto: Senhora -2 Habilidade.

**Vitória:** → `a2_bramford_16`. **Derrota:** game over.

#### `a2_bramford_16` — O Fragmento da Mente
**Texto:**
> A Senhora cai sem barulho. Quando o último resquício de sombra escorre dos olhos dela, o rosto que sobra é jovem demais para o medo que ela causou. Você se aproxima do pedestal. O cristal âmbar pousa na sua mão como se sempre estivesse esperando.
>
> Atrás de você, o Templo respira. Algo no fundo da Câmara — o próprio Saber, quem sabe — assente uma única vez.

**onEnter:** `addKeyItem frag_mente`, `+2 Reputação`, flag `bramford_concluido`.
**classVariants:**
> *(Sira)* Você fica de joelhos um momento. Não vai dizer em voz alta o que se sente. Mas se sente.

**Escolhas:**
- → `a2_bramford_17`.

#### `a2_bramford_16_alt` — Vitória Antecipada (rota Sira ataca em _08)
**Texto:**
> O Templo se abre depois — a corrente cai sozinha, como se reconhecesse que o trabalho dela já tinha sido feito. Você desce sozinha, e o cristal te espera. Ele zumbe diferente para você. Como se também conhecesse Aelin.

**onEnter:** `addKeyItem frag_mente`, `+1 Reputação` (não +2 — você atacou antes de obter sanção do Templo).
**Escolhas:**
- → `a2_bramford_17`.

#### `a2_bramford_17` — Bramford Vazia
**Texto:**
> Você sai do Templo na hora em que Bramford acorda. Os pescadores recolhem redes. Os sinos batem a hora certa pela primeira vez essa semana. Vellis pode estar te esperando no portão, ou pode não estar. A Guilda pode te seguir, ou pode te deixar ir. A cidade decide sozinha quem te vê.

**Escolhas:**
- *"Procurar a Capela do Templo para descansar."* → `a2_bramford_18` (Respiro).
- *"Sair direto pelo portão."* → `a2_bramford_19`.

#### `a2_bramford_18` — Respiro de Sorte (Capela do Templo)
**Texto:**
> A Capela é o anexo lateral do Templo do Saber, baixa, fria, com bancos de pedra polida pelos joelhos de séculos. Acima do altar, um vitral simples mostra três figuras de costas, caminhando juntas para uma luz fraca. Você senta. O silêncio aqui é o tipo de silêncio que não pesa: pousa.
>
> Por um instante, é possível esquecer que existe Vorthun. Por um instante.

**Escolhas:**
- *"Descansar aqui."* → aplica Respiro: Sorte → max, +50% Energia que falta, limpa efeitos negativos persistentes, flag `respiro_ato2_usado`. (Indisponível se já usado.) → `a2_bramford_19`.
- *"Levantar e seguir; reservo o fôlego."* → segue sem cura. → `a2_bramford_19`.

#### `a2_bramford_19` — Saída de Bramford
**Texto:**
> O portão sul. Os mesmos guardas inclinados na alabarda. Um deles assente para você como se reconhecesse — embora não tenha como reconhecer. Talvez seja a postura de quem agora carrega dois fragmentos.
>
> O Mapa abre na sua mão. Falta um.

**onEnter:** se 3 fragmentos: avança Ato 3.
**Escolhas:**
- → `WorldMap`.

**Combate-chave:** `combat_senhora_sombria` (ver §17).
**Para Ladina:** o caminho Guilda + flag `sira_arco_pessoal` é o arco emocional dela. Não disponível para outras classes.

### 16.4 Ato 2 — Karn-Tuhl, as Ruínas do Corpo (23 nós)

> Tom: ancião, gelado, solene. Honra anã. Frases de pedra: poucas, pesadas, ditas devagar. Eco constante.

#### `a2_karn_01` ★ — Aproximação
**Imagem:** `scenes/karn_tuhl_entry.webp`
**Texto:**
> A trilha sobe e o ar fica fino antes da paciência ficar fina. Karn-Tuhl não foi construída na montanha — foi feita *como* a montanha. As muralhas são lascas naturais empilhadas pela mão do tempo até parecerem propósito. De longe, parece que a fortaleza está dormindo. De perto, parece que está esperando.
>
> A neve aqui é antiga. Não a neve do inverno passado: neve que ninguém pisou em décadas. Quando seu pé afunda, o som que sai é de papel velho.

**Escolhas:**
- → `a2_karn_02` — *"Subir o último trecho aberto."*
- *"(Bárbaro) Cantar baixinho a canção de viagem do clã."* `classRequirement: 'barbaro'` → flag `cancao_korrundir` (afeta o reconhecimento de Durin lá adiante; +1 Reputação durante prova de Honra). → `a2_karn_02`.

#### `a2_karn_02` — Tempestade
**Texto:**
> Vem de oeste, e vem rápido demais para ser tempestade comum. Em três respirações, você não enxerga a mão estendida. O vento tem voz: muitas vozes pequenas, todas falando a mesma palavra que você não consegue ouvir.

**Escolhas:**
- *"Resistir."* → `skill Resistir Magia CD 9`, Sorte permitida. Sucesso: passa, +0 efeito. Falha: -3 Energia (frio que não é frio).
- *"(Bárbaro) Encarar de frente."* `classRequirement: 'barbaro'` → `skill Atletismo CD 9`. Sucesso: passa sem perder Energia, +1 Reputação ("a montanha respeita quem a respeita"). Falha: -1 Energia.
- *"Abrigar-se entre rochas."* → `skill Investigar CD 7`. Sucesso: passa sem perder Energia. Falha: passa, -2 Energia.

→ `a2_karn_03`.

#### `a2_karn_03` — Portão das Ruínas
**Texto:**
> O Portão de Karn-Tuhl tem três vezes a altura sua. Os batentes — duas estátuas de guerreiros anões com martelos no ombro — estão rachados, mas os olhos das estátuas permanecem inteiros, e os olhos parecem te seguir. A porta está entreaberta o suficiente para um corpo passar de lado. Cheira a forja apagada e a sal antigo.

**Escolhas:**
- *"Entrar."* → `a2_karn_04`.
- *"Examinar as estátuas antes."* → `skill Investigar CD 9`. Sucesso: descobre que as estátuas têm runas de boas-vindas para "filhos do norte" — flag `runa_boas_vindas` (afeta diálogo de Durin). → `a2_karn_04`.

#### `a2_karn_04` — A Sala do Mosaico
**Texto:**
> O primeiro corredor leva a uma sala redonda cujo chão é um mosaico. Centenas de mil pequenas pedras coloridas formam a história do reino: a chegada dos primeiros anões, a forja da Égide, a ruína. Algumas peças do mosaico estão soltas, espalhadas no chão. Há um pedestal ao lado da porta seguinte com cinco encaixes vazios. Acima dos encaixes: cinco runas com cinco palavras.

**Escolhas:**
- *"Resolver o mosaico."* → `skill Investigar CD 9`, Sorte permitida. Sucesso: porta se abre, atalho destrava (você pula `a2_karn_05`). Falha: porta se abre mesmo assim depois de errar três peças, mas alarma os mortos da forja → vai para `a2_karn_05` com -1 Energia (faísca da pedra ressentida).
- *"Forçar a porta sem resolver."* → `skill Atletismo CD 11`. Sucesso: porta cede, mas faz barulho — vai para `a2_karn_05`. Falha: -2 Energia, e ainda vai para `a2_karn_05`.

#### `a2_karn_05` — Esqueletos no Salão da Forja
**Imagem:** —
**Texto:**
> O Salão da Forja é vasto. Quatro forjas frias em fila no centro; quatro bigornas; quatro pares de pinças penduradas em cada uma. E quatro corpos de pé, sem se mover, em frente a cada bigorna, como se ainda esperassem o aço esquentar. Eles ouvem você antes de você decidir respirar.

**Combate:** `esqueleto_anao` (1v1; representa dois esqueletos combinados — Energia 14, dano 1d6+1).
**Vitória:** → `a2_karn_06`. **Derrota:** game over.

#### `a2_karn_06` — A Forja Apagada
**Texto:**
> A primeira forja, ao centro, não está completamente apagada. Há na ferramenta — um martelo de cabo de bronze — um calor que não devia ter sobrado depois de um século. Quando você se aproxima, o calor responde. O martelo não pesa o que devia pesar.
>
> Há uma escolha aqui: pegar o martelo, deixar o martelo, ou tentar ouvir o que ele diz.

**Escolhas:**
- *"Pegar o martelo."* → ganha `martelo_de_brasa` (item misc; em combate gasta turno e dá +2 dano no próximo ataque; quebra após 3 usos). → `a2_karn_07`.
- *"Deixar."* → +1 Reputação ("anão respeita quem não pega o que não é dele"). → `a2_karn_07`.
- *"(Mago) Ler o calor que sobrou."* `classRequirement: 'mago'` → `skill Arcano CD 9`. Sucesso: descobre o nome do ferreiro que o forjou (Brom Pedraferro, irmão de Durin) — flag `sabe_brom`. → `a2_karn_07`.

#### `a2_karn_07` — Sala do Trono
**Imagem:** `scenes/durin_throne.webp`
**Texto:**
> Você sai do salão da forja para um corredor que afunda em curva, e o corredor se abre num Salão do Trono que parece pequeno apenas por causa do trono que ocupa o centro. O trono é simples: pedra trabalhada com runas pequenas. Vazio. Atrás do trono, doze braseiros, todos apagados há séculos.
>
> Quando você dá o décimo passo na sala, os doze braseiros se acendem ao mesmo tempo, com fogo azul. E sobre o trono, a forma de um anão de armadura trabalhada — translúcido, contornado em luz fria — toma assento.

**Escolhas:**
- → `a2_karn_08`.

#### `a2_karn_08` — Durin Pedraferro
**Texto:**
> Durin Pedraferro, último Rei dos Reis de Karn-Tuhl, te encara. A barba dele desce até a cintura mesmo no espectro. A coroa parece pesar mesmo sem peso. Ele não saúda. Espera.
>
> — Estranho — diz, e a voz vem de todos os braseiros ao mesmo tempo. — O que vem buscar dos mortos é coisa que pertence aos vivos? Ou é o contrário? Cada visitante responde diferente. Responde.

**classVariants:**
> *(Bárbaro com flag `cancao_korrundir`)* Antes de você responder, Durin levanta a mão. Ergue a barba do peito. Olha mais demorado. — *Korrundir.* Sua canção é mais antiga do que você sabe. — Ele não sorri, mas também não escurece. — Continue.

**Escolhas:**
- *"Vim pelo Fragmento do Corpo, para impedir Vorthun."* → +1 Reputação. → `a2_karn_09`.
- *"Vim porque me mandaram."* → -1 Reputação ("o anão respeita quem sabe por que veio"). → `a2_karn_09`.
- *"(Mago) Recitar o nome de Brom."* `classRequirement: 'mago', flagRequirement: sabe_brom` → +2 Reputação, Durin pousa a mão no peito (gesto de gratidão anã). Flag `durin_amistoso` (reduz CD da prova do Saber para 9). → `a2_karn_09`.

#### `a2_karn_09` — A Escolha da Prova
**Texto:**
> Durin se levanta. Os braseiros estremecem.
>
> — O Fragmento dorme atrás de mim, na pedra que era da Coroa. Para chegar a ele, você dá uma das três provas dos reis. **Força**: prove que pode segurar o que carrega. **Saber**: prove que entende o que pega. **Honra**: prove que merece o que pede.
>
> Ele se volta para o trono e fica ao lado dele, esperando.

**Escolhas:**
- → `a2_karn_10a` — *"Prova da Força."*
- → `a2_karn_10b` — *"Prova do Saber."*
- → `a2_karn_10c` — *"Prova da Honra."* — `requirement: reputation >= 0 AND flag salvou_npc_qualquer = true`. Indisponível caso contrário (com tooltip explicativo).

#### `a2_karn_10a` — Prova da Força: Forja Animada
**Texto:**
> A pedra atrás do trono se abre, e da abertura caminha uma forma alta — montante de armadura anã viva, peças que nunca foram um corpo único e que agora servem como um. As mãos da Forja Animada terminam em martelos. Os olhos são duas brasas de azul.

**Combate:** `combat_forja_animada`. Não-fugível.
**Vitória:** → `a2_karn_11`. **Derrota:** game over.

#### `a2_karn_10b` — Prova do Saber
**Texto:**
> Durin coloca à sua frente, em cima do trono, três objetos: um anel sem inscrição, uma faca de cabo polido, e uma pedra cinza com uma única runa. Ele fala devagar:
>
> — Dois pertenceram a reis. Um, a um traidor. Os reis ainda estão nos objetos. O traidor, não. Aponte o objeto vazio.

**Escolhas:**
- *"Apontar."* → `skill Investigar CD 11` (CD 9 se `durin_amistoso`), Sorte permitida. Sucesso: a faca brilha em rejeição — era do traidor. → `a2_karn_11` com +1 Reputação. Falha: -3 Energia (Durin não pune; é a sala que pune o erro), tenta de novo (CD +1 a cada tentativa).
- *"(Bárbaro) Confessar não saber, pedir Honra."* `classRequirement: 'barbaro'` → muda para `a2_karn_10c` se requisitos batem; senão -1 Reputação e tenta de novo.

#### `a2_karn_10c` — Prova da Honra
**Texto:**
> Durin se aproxima a um passo. Os braseiros baixam a luz, como se a sala quisesse ouvir melhor. Ele fala:
>
> — Você caminhou até aqui carregando o que carregou. Eu vi cada noite das suas. Os mortos veem assim — quietos. Diga em voz alta: a coisa de mais peso que você fez. E diga se faria de novo.

**Escolhas:**
- *"Confessar e prometer fazer melhor."* → +2 Reputação, Durin assente. → `a2_karn_11`.
- *"Confessar e dizer que faria de novo."* → +1 Reputação se a confissão se alinha com a Reputação atual (≥+3); 0 caso contrário. → `a2_karn_11`.
- *"Mentir."* → `skill Trapaça CD 13`. Sucesso: passa, -2 Reputação ("Durin sabe; Durin não fala"). Falha: -3 Reputação, mas Durin diz "vá; o Fragmento ainda é necessário" e libera. → `a2_karn_11`.

#### `a2_karn_11` — O Cofre dos Reis
**Texto:**
> Atrás do trono, a pedra cede em camadas — três anéis girando lentamente em direções opostas — e revela uma câmara pequena onde só há uma coisa: o cristal. O Fragmento do Corpo é mais opaco que os outros, com cor de ferro recém-temperado. Está pesado mesmo antes de pesar.

**Escolhas:**
- → `a2_karn_12`.

#### `a2_karn_12` — O Fragmento do Corpo
**Texto:**
> Você toma o cristal. Ele esquenta. A sala toda esquenta um pouco — não desconfortável; vivo. Durin, que esteve em silêncio desde a prova, fala:
>
> — Os três pedaços vão se reconhecer. Volte ao mapa. Onde a estrada se cruza com a estrada, eles te chamam para juntar. Aquilo será a Égide. Aquilo será peso de verdade.

**onEnter:** `addKeyItem frag_corpo`, `+1 Reputação`.

**Escolhas:**
- *"Perguntar a Durin sobre Vorthun."* → diálogo: Durin lembra de quando Vorthun ainda era humano, pelo nome verdadeiro (*"Tholan, o Que Lia em Voz Alta"*). Flag `sabe_nome_vorthun` (afeta um diálogo opcional no Ato 3). → `a2_karn_13`.
- → `a2_karn_13` — *"Despedir-se."*

#### `a2_karn_13` — Despedida
**Texto:**
> Durin Pedraferro se senta de novo. Os braseiros começam a se apagar um a um, sem pressa. Antes do último apagar, ele ergue a mão direita: a saudação anã para um igual.
>
> — Vai com peso, estranho. Volta sem ele.

**Escolhas:**
- → `a2_karn_14_barbaro` — *(Se `cancao_korrundir`)* — Bárbaro exclusivo.
- → `a2_karn_15_mago` — *(Se Mago)* — Mago exclusivo.
- → `a2_karn_16_ladino` — *(Se Ladina)* — Ladina exclusivo.
- → `a2_karn_18` — *"Sair direto."*

#### `a2_karn_14_barbaro` (Bárbaro exclusivo) — A Reconciliação Totêmica
**classRequirement:** 'barbaro'
**Texto:**
> Antes de você sair, uma terceira figura translúcida desce do alto do salão. É um guerreiro de barba ruiva, jovem demais para o que carrega na expressão. Ele encara o seu machado totêmico longamente. Estende a mão. Você reconhece a tatuagem na palma: o nó de Korrundir, o mesmo da casa do seu pai.
>
> — Aqui também moramos — diz a aparição. — O exílio não acaba; muda de cara. Continua. Volta para casa um dia, mas continua.

**onEnter:** `+1 Reputação`, flag `honra_norte`, `+2 Sorte`.

**Escolhas:**
- → `a2_karn_18`.

#### `a2_karn_15_mago` (Mago exclusivo) — Pergaminho Rúnico
**classRequirement:** 'mago'
**Texto:**
> Antes de sair, você nota um nicho lateral do salão, fechado por uma pedra que se mexe quando você se aproxima — não por magia óbvia; pela velha gentileza de uma sala que reconhece quem sabe ler. Dentro: um único pergaminho enrolado em couro escuro. Está intacto. As runas saltam para sua mente como se sempre tivessem morado lá.

**Escolhas:**
- *"Ler o pergaminho."* → `skill Arcano CD 9`. Sucesso: ganha `pergaminho_de_brasa` (item; em combate, gasta turno e dá +3 dano no próximo ataque que acertar; uso único). Falha: -1 Energia (a runa morde os dedos), pergaminho some.
- *"Deixar para outro estranho."* → +1 Reputação.

→ `a2_karn_18`.

#### `a2_karn_16_ladino` (Ladina exclusivo) — O Cofre que Não Era de Rei
**classRequirement:** 'ladino'
**Texto:**
> Quando os braseiros já se apagaram quase todos, você nota uma coisa que ninguém te apontou: uma fresta no rodapé do trono que não está alinhada com as outras. A fresta tem fechadura. A fechadura tem um trinco do tipo que você reconhece de longe — fechadura de tesouro pessoal, não de coroa.

**Escolhas:**
- *"Abrir."* → `skill Furtividade CD 9` (Ladina: +2 → CD efetiva 7). Sucesso: encontra `anel_de_brom` (equipment; +1 Sorte máxima enquanto equipado), -1 Reputação (você roubou de um morto). Falha: alarme — combate `esqueleto_anao` extra.
- *"Deixar."* → +1 Reputação.

→ `a2_karn_18`.

#### `a2_karn_17` — Visão Profética (opcional, gatilho automático)
**Trigger:** se `frag_vida` E `frag_mente` E `frag_corpo` no inventário-chave ao entrar em `a2_karn_18`.
**Texto:**
> Os três cristais, no seu bolso, decidem que está na hora. Esquentam todos juntos. Quando você os tira para olhar, eles flutuam um a um até parar a meia-altura, formando um triângulo. Há uma centelha entre eles. A centelha cresce devagar. Cresce até virar um amuleto de bronze fundido com três janelas pulsantes.
>
> A Égide de Solgar está em sua mão pela primeira vez em quinhentos anos.
>
> No mesmo instante, no horizonte, uma estrela morta abre o olho.

**onEnter:** `removeKeyItem frag_vida`, `removeKeyItem frag_mente`, `removeKeyItem frag_corpo`, `addKeyItem egide_solgar`.

**Escolhas:**
- → `a2_karn_18`.

#### `a2_karn_18` — Esqueleto Solitário (opcional)
**Texto:**
> No corredor de saída, um único esqueleto ainda está em pé, encostado numa parede como se descansasse. Ele acorda quando você passa. Não te ataca de imediato. Estende a mão para a sua bolsa, hesita, e nessa hesitação parece quase humano.

**Escolhas:**
- *"Atacar."* → combate `esqueleto_anao`. Vitória: +5 ouro. → `a2_karn_19`.
- *"Passar de lado, devagar."* → `skill Furtividade CD 9`. Sucesso: passa. Falha: combate forçado.
- *"Deixar uma moeda na mão dele."* → -1 ouro, +1 Reputação ("o esqueleto fecha a mão e dorme de novo"). → `a2_karn_19`.

→ `a2_karn_19`.

#### `a2_karn_19` — Respiro de Sorte (Forja Antiga)
**Texto:**
> Antes do portão de saída, você passa por um nicho que não passou na entrada — ou passou, e não viu. Uma forja menor, esquecida. As brasas no fundo dela ainda estão acesas, contra todas as possibilidades. Há um banco de pedra ao lado. Quem o cavou na pedra colocou também encosto: pensaram em quem ia sentar.
>
> Você senta. O calor entra pelos ossos. Por um instante, o frio parece coisa de outro tempo.

**Escolhas:**
- *"Descansar aqui."* → aplica Respiro: Sorte → max, +50% Energia que falta, limpa efeitos negativos persistentes, flag `respiro_ato2_usado`. (Indisponível se já usado.) → `a2_karn_20`.
- *"Levantar e seguir; reservo o fôlego."* → segue sem cura. → `a2_karn_20`.

#### `a2_karn_20` — Saída de Karn-Tuhl
**Texto:**
> O Portão se fecha atrás de você sozinho. Você ouve o som — pedra contra pedra — e por um momento o som lembra de algo que não era som: um aceno.
>
> A neve antiga cobre seus passos no caminho de volta. O Mapa abre na sua mão. Os três fragmentos respondem uns aos outros agora, baixinho, como gente conversando do outro lado da parede.

**onEnter:** flag `karn_concluido`. Se 3 fragmentos: avança Ato 3 (Égide forjada via `a2_karn_17` ou em `a2_karn_21`).
**Escolhas:**
- → `a2_karn_21` (se 3 fragmentos coletados; senão direto para `WorldMap`).
- → `WorldMap` (se ainda falta região).

#### `a2_karn_21` ★ — A Égide Forjada (transição para Ato 3)
**Trigger:** apenas se 3 fragmentos coletados E não passou por `a2_karn_17`.
**Texto:**
> No alto do desfiladeiro, com Karn-Tuhl ficando para trás, os três cristais decidem juntos. Esquentam. Saltam do seu bolso e flutuam um a um, formando um triângulo no ar à sua frente. A centelha entre eles cresce. Vira fogo. Vira metal. Vira amuleto.
>
> A Égide de Solgar repousa, finalmente, na sua palma. Ela é mais leve do que você esperava. Mais quente também. E mais triste — como se reconhecesse o trabalho que ainda tem pela frente.
>
> O Mapa, no seu bolso, abre sozinho. No centro dele, onde antes havia uma mancha de tinta velha, agora pulsa um ponto vermelho fraco, em um vale que ninguém marcou: a **Cidadela das Sombras**.

**onEnter:** `removeKeyItem frag_vida`, `removeKeyItem frag_mente`, `removeKeyItem frag_corpo`, `addKeyItem egide_solgar`, flag `egide_forjada`.

**Escolhas:**
- → `a3_cidadela_01` (segue diretamente para o Ato 3).

**Combate-chave:** `combat_forja_animada` (ver §17).
**Para Bárbaro:** o nó `a2_karn_14_barbaro` é o arco de reconciliação com o exílio. Não disponível para outras classes.

### 16.5 Ato 3 — Cidadela das Sombras (17 nós + 4 finais)

> Tom: épico e claustrofóbico. Frases mais curtas que no Ato 2; câmara cada vez mais fechada. Vorthun fala como se já estivesse vencido — e por isso é assustador. Cada nó assume que o jogador carrega `egide_solgar`.

#### `a3_cidadela_01` ★ — Aproximação ao Vale
**Imagem:** `scenes/cidadela_exterior.webp`
**Texto:**
> O vale onde a Cidadela das Sombras espera não tem nome no mapa. A última légua é uma descida em ziguezague, e a Égide na sua palma esquenta a cada curva, como quem reconhece um caminho que já fez antes. Acima, nuvens negras correm em sentidos opostos sobre o céu — duas correntes que não deveriam coexistir. Abaixo, a Cidadela: torres de basalto rachado, sem luzes nas janelas, mas com uma luz dentro mesmo assim, fraca, baixa, de algo que arde sem queimar.
>
> Você para no último alto antes da ponte de pedra que liga o desfiladeiro à muralha. A ponte é estreita; do meio dela em diante, é Vorthun.

**onEnter:** se ainda não foi consumido, `removeKeyItem frag_vida`, `removeKeyItem frag_mente`, `removeKeyItem frag_corpo`, `addKeyItem egide_solgar`, `setFlag egide_forjada: true` (idempotente caso `a2_karn_17`/`a2_karn_21` do Ato 2 já tenha forjado).

**Escolhas:**
- → `a3_cidadela_02` — *"Atravessar a ponte."*
- *"Olhar o vale uma última vez."* → flavor curto (+0 efeito); → `a3_cidadela_02`.

#### `a3_cidadela_02` — O Portão de Sombras
**Texto:**
> O portão da Cidadela não tem dobradiças. É feito de sombra propriamente dita — cortinas verticais de noite parada que a Égide tenta abrir e que recusam, baixinho, como mar recusando um nadador cansado. Para passar, é preciso falar com a sombra na língua dela. Ou atravessar e pagar o preço.

**Escolhas:**
- *"Falar com a sombra (Arcano)."* → `skill Arcano CD 11`, Sorte permitida.
  - Sucesso → `a3_cidadela_03`.
  - Falha → `a3_cidadela_03` com `-4 Energia` (a sombra arranca um pedaço de você ao passar).
- *"Atravessar à força."* → `-4 Energia` automático, → `a3_cidadela_03`.
- *"(Mago) Usar Bola de Fogo contra a cortina."* `classRequirement: 'mago'` → automático: a cortina cede; consome 1 uso de poder com `selfPenalty` aplicada já no Pátio (`-1 Habilidade` no primeiro round de `a3_cidadela_03`).

#### `a3_cidadela_03` — Pátio dos Caídos
**Texto:**
> Atrás do portão, o Pátio dos Caídos é largo e baixo, e o chão está coberto de armaduras. Centenas. Vazias, na primeira olhada. Não vazias, na segunda. Duas das armaduras mais próximas se levantam — alto, depois mais alto, depois alto demais — quando você chega ao centro do pátio. Os elmos selados viram-se com lentidão de quem nunca teve pressa.

**Combate em sequência:** `cavaleiro_sombrio` ×1 → ao vencer, `cavaleiro_sombrio` ×1 (segundo cavaleiro acorda). Não-fugível. Entre os dois combates, **não há cura**.

**Vitória final:** → `a3_cidadela_04`. **Derrota em qualquer combate:** game over.

#### `a3_cidadela_04` — Galeria dos Reflexos
**Imagem:** —
**Texto:**
> O corredor depois do pátio é um espelho longo de basalto polido. A primeira reflexão é a sua. A segunda, não.

**classVariants:**
> *(Mago)* É o Mestre da Torre de Vesperia, vivo, em pé, lendo um livro que você reconhece. Ele ergue os olhos. Não diz nada. Sorri. Some.
>
> *(Ladina)* É a sua mãe na cozinha da casa antiga, a janela aberta, o cheiro de pão. Ela coloca uma fatia para você na mesa. Ergue o queixo, como se tivesse acabado de ouvir uma piada. Some.
>
> *(Bárbaro)* É o seu irmão de sangue, vivo, na fogueira do clã, contando uma história que termina em risada. Ele pisca para você por sobre o ombro do contador. Some.

**Escolhas:**
- *"Continuar."* → resolução condicional:
  - Se `reputation >= +3`: aplica `+4 Energia` (a Galeria reconhece um coração que ainda carrega a luz). → `a3_cidadela_05`.
  - Se `reputation <= -3`: aplica `-2 Sorte` (a Galeria sussurra que você sabe a verdade — eles não estão mais lá). → `a3_cidadela_05`.
  - Caso contrário (neutro): sem efeito. → `a3_cidadela_05`.
- *"(qualquer classe) Tentar resistir à visão."* → `skill Resistir Magia CD 11`, Sorte permitida.
  - Sucesso: `setFlag aceitouSacrificio: true` (você reconheceu a oferta como armadilha e endureceu o coração ao ponto exato em que se aceita um sacrifício final). +1 Reputação. → `a3_cidadela_05`.
  - Falha: `-2 Energia`, segue. → `a3_cidadela_05`.

> *Nota mecânica:* a flag `aceitouSacrificio` também pode ser setada por escolhas anteriores (ver §20.3); este é um dos caminhos.

#### `a3_cidadela_05` — Algoz de Vorthun
**Imagem:** —
**Texto:**
> Antes da última escada, o Algoz espera. Mais alto que dois homens. Capuz de sombra; abaixo do capuz, o que faz as vezes de cara é um fogão preto crepitante. A arma é um cutelo curvo do tamanho do seu peito. Ele não saúda. Não é educado. Apenas dá um passo para o lado para mostrar a porta do Trono — e em seguida cancela o gesto, fechando o caminho de novo. Não vai passar inteiro.

**Combate:** `combat_algoz`. Não-fugível.

**Vitória:** ganha `manopla_sombria` (auto-equip: +1 Habilidade), `+25 ouro`, `unlockAchievement first_blood` se ainda não desbloqueada. → `a3_cidadela_06`. **Derrota:** game over.

#### `a3_cidadela_06` ★ — Antessala (Respiro do Ato 3)
**Imagem:** —
**Texto:**
> A antessala é pequena, redonda, sem mobília exceto um banco de pedra encostado na parede. A porta seguinte — a porta para o Trono — é de bronze fundido em formato de uma única espiral que termina em ponto. Há um silêncio aqui que não é vazio: é coisa cheia de alguma coisa que já foi gente.
>
> Você senta. Tira a Égide do peito. Olha-a por inteiro pela primeira vez desde Karn-Tuhl. As três janelas pulsam em ritmo sincronizado, como respirações. Você respira no ritmo delas e percebe que a sua respiração desacelera, baixa, fica calma. É um momento. É só um momento. Mas é um momento.

**Escolhas:**
- *"Descansar até estar pronto/a."* → aplica **Respiro do Ato 3**: Sorte → `maxSorte`, Energia → `min(maxEnergia, energia + ceil((maxEnergia - energia) / 2))`, limpa efeitos negativos persistentes, `setFlag respiro_ato3_usado: true`. → `a3_cidadela_07`.
- *"Levantar agora; não há mais tempo."* → segue sem cura. → `a3_cidadela_07`.

#### `a3_cidadela_07` — A Sala do Trono
**Imagem:** `scenes/vorthun_throne.webp`
**Texto:**
> A Sala do Trono é grande além do que a Cidadela parecia conter. O teto se perde no escuro alto. Doze pilares pretos, um para cada século. Doze chamas verdes em braseiros altos. No centro do salão, um trono de osso e ferro. No trono, Vorthun, o Sombrio Coroado.
>
> Ele não se levanta. Não acena. Apenas espera você atravessar todo o salão, devagar, e parar a três passos do trono. Quando finalmente fala, a voz não é alta. É só vasta. Há muitas vozes dentro dela.
>
> — Sente-se um momento — diz Vorthun. — Não tenho medo da Égide. Tenho curiosidade pelo que a carrega.

**Escolhas:**
- → `a3_cidadela_08`.

#### `a3_cidadela_08` ★ — Decisão Crítica
**Texto:**
> Vorthun começa a falar. Conta — sem mentira aparente, com o cansaço de quem já contou para si mesmo demais vezes — a história dele. Não a parte do mal. A parte do começo: o jovem arquimago, o medo de morrer pequeno, o pacto, a primeira camada perdida. Ele olha para você e diz, baixinho, no fim:
>
> — Você sabe como começa. Você está começando agora. Eu posso te poupar do meio. Posso te dar o poder sem o pacto. Posso te dar a vingança que você quer. Pode ser pelo Aenor, se você quiser. Pode ser por você. Pode ser nada — pode ir embora. Mas não sai daqui sem escolher. A Égide já está na sua mão. Ela escolheu primeiro.

**Escolhas (apresentadas em ordem fixa, com tooltips de requisitos):**
- *"Recuso seu pacto."* → `a3_cidadela_09a` (combate Vorthun).
- *"Aceito seu poder, mas pelo Aenor."* — `requirement: reputation BETWEEN 0 AND +4` → `a3_cidadela_09b` (pacto neutro / traição).
- *"Eu também quero o que você quer."* — `requirement: reputation <= -3` → `a3_cidadela_09c` (pacto sombrio).
- *"Eu me ofereço no seu lugar."* — `requirement: reputation >= +3 AND flag aceitouSacrificio` → `a3_cidadela_09d` (sacrifício).

> *UI:* opções não disponíveis aparecem desabilitadas com tooltip explicativo ("Requer Reputação Honrada" / "Requer Reputação Sombria" / etc.). Sempre há ao menos uma opção viável (recusar é incondicional).

#### `a3_cidadela_09a` — Recusa
**Texto:**
> Vorthun escuta a recusa em silêncio, e por um instante longo demais para ser desprezo, parece quase aliviado. Levanta-se. A coroa fundida ao crânio capta a luz verde dos braseiros e devolve preta. O cutelo dele aparece na mão como se sempre tivesse estado lá.
>
> — Bom. Eu também não acreditei na minha própria oferta. Mostre o que aprendeu na vinda.

**Escolhas:**
- → `a3_cidadela_10` (combate Vorthun).

#### `a3_cidadela_09b` — O Pacto Neutro
**Texto:**
> Vorthun se inclina para a frente — pela primeira vez, mexe o trono. Estende a mão coberta de luva de osso. Ela esfria a três passos de distância. Quando você toca a luva, o frio passa pelo seu braço, mira o seu peito, mira a Égide. E para.
>
> — Você acha que pode usar o poder e desfazer-me com o poder — diz, e há um sorriso pequeno na voz. — Talvez possa. Talvez não. Vamos ver.
>
> A Égide treme. O salão muda de cor. Você sente força nova entrar em você — e, com ela, uma voz pequena que ofereceu uma camada que você só agora percebe que aceitou.

**onEnter:** `+2 Habilidade` temporário (5 rounds), `setFlag aceitou_pacto_neutro: true`, `-2 Reputação`, `addKeyItem selo_sombrio` se ainda não tiver.

**Escolhas:**
- → `a3_cidadela_10` (combate Vorthun, variante traição).

#### `a3_cidadela_09c` — O Pacto Sombrio
**Texto:**
> Vorthun não sorri. Não faz gesto algum. Apenas assente uma vez. A Égide na sua mão escurece, perde primeiro a janela do Corpo, depois a da Mente, depois a da Vida. Quando ela termina de escurecer, é uma coroa pequena. Ela sobe sozinha do seu colo até a sua testa. Encaixa.
>
> Vorthun se levanta. Faz uma reverência. A reverência dele é também a saudação anã, mas sem honra. Apenas precisão.
>
> — Bem-vindo/a — diz. — Eu fico aqui mais um pouco para ensinar o que sei. Depois é com você.

**onEnter:** `removeKeyItem egide_solgar`, `addKeyItem coroa_negra` (item-chave novo: simbólico apenas; ver §18.3), `-5 Reputação`.

**Escolhas:**
- → `ending_dark`.

#### `a3_cidadela_09d` — O Sacrifício
**Texto:**
> Você não fala alto. Apenas pousa a Égide no chão, no meio do espaço entre você e o trono, e dá um passo à frente. Vorthun olha para a Égide. Olha para você. E pela primeira vez, em todo o tempo dele, alguma coisa parecida com o jovem que ele foi atravessa o rosto velho dele.
>
> — Você sabe o que está oferecendo — diz, baixinho. Não é pergunta.
>
> Você assente. Pega a Égide do chão. Encosta no peito de Vorthun. Encosta no seu peito também. A luz das três janelas começa a crescer.

**onEnter:** `setFlag escolheu_sacrificio: true`.

**Escolhas:**
- → `ending_sacrifice`.

#### `a3_cidadela_10` — Combate: Vorthun
**Texto:**
> Os doze braseiros se dobram em um. O salão inteiro fica verde. Vorthun se move como quem nunca cansa.

**Combate condicional:**
- Se `aceitou_pacto_neutro`: encontro é `combat_vorthun_traicao` (variante; ele sabe que você o traiu primeiro). Jogador entra com +2 Habilidade temporário (5 rounds, do pacto).
- Caso contrário: encontro é `combat_vorthun` padrão.

Não-fugível. **Vitória:** → `a3_cidadela_11`. **Derrota:** game over.

#### `a3_cidadela_11` — A Coroa Cai
**Texto:**
> Vorthun cai devagar — devagar como árvore antiga cai. A coroa fundida ao crânio se desfaz primeiro, em farelo de cinza. Em seguida, o crânio. Em seguida, a armadura, peça por peça. No fim, há apenas pó verde no chão e, por cima do pó, um único anel simples, sem inscrição. O nome verdadeiro dele, talvez. Você o pega ou deixa.
>
> A Cidadela toda começa a tremer. As nuvens lá fora se desfazem em direções opostas, mais rápidas. Você tem alguns minutos para sair antes que ela caia inteira em cima de você.

**onEnter:** `setFlag vorthun_derrotado: true`. Se `flag aceitou_pacto_neutro: true`: setFlag `traicao_consumada: true` (afeta avaliação de final).

**Escolhas (resolução automática condicionada):**
- Avaliação em ordem (primeiro match vence):
  1. Se `escolheu_sacrificio: true` → impossível chegar aqui (ramo `a3_cidadela_09d` vai direto para ending). Defensivo: → `ending_sacrifice`.
  2. Se `aceitou_pacto_neutro: true` E `traicao_consumada: true`:
     - Sub-avaliação: se `reputation >= +3` E flag `arvendel_estavel`: → `ending_heroic` (a vitória pelo Aenor com cuidado de gente, mesmo após pacto temporário, ainda atinge o final luminoso — Égide queimou o pacto na vitória).
     - Caso contrário: → `ending_tragic`.
  3. Se `reputation >= +5` E `selo_sombrio` NÃO carregado: → `ending_heroic`.
  4. Se `reputation <= -3`: → `ending_dark` (a Égide reconhece o portador como sucessor; mesmo sem pacto explícito).
  5. Caso contrário: → `ending_tragic`.

> *Decisão de design:* a tabela do nó `a3_cidadela_11` é a **única autoridade** para escolher entre os 4 finais ao vencer Vorthun em combate. Os ramos `a3_cidadela_09c` e `a3_cidadela_09d` levam direto a finais sem passar por `a3_cidadela_11`.

---

#### `ending_heroic` — Final Heroico
**Imagem:** `scenes/ending_heroic.webp`
**Texto:**
> Você sai da Cidadela enquanto ela ainda cai. Os escombros não te alcançam. A Égide, na sua palma, devolve a luz para o céu rachado, e o céu se costura sozinho — devagar, mas se costura. Quando você chega ao alto do desfiladeiro, o sol está nascendo pela primeira vez em três dias.
>
> Aenor não saberá os detalhes. Aenor saberá apenas que respira. As pessoas voltam a comer fora de casa. Os sinos voltam a bater a hora certa. O Mestre Arvendel — se sobreviveu — vai reescrever a profecia para incluir o nome verdadeiro daquele que a cumpriu. Em outro lugar, nas tribos do norte, alguém canta sua canção. Em outro lugar, na cidade, uma criança aprende a deletrear seu nome.
>
> Você terminou.

**onEnter:** `unlockAchievement heroic_ending`, `unlockAchievement all_fragments` (defensivo), `unlockEnding ending_heroic`.

**Escolhas:**
- *"Voltar ao Título."* → apaga save principal, persiste meta. → `TitleScreen`.

#### `ending_dark` — Final Sombrio
**Imagem:** `scenes/ending_dark.webp`
**Texto:**
> A Cidadela não cai. Você cuida disso. Os doze braseiros se acendem todos sob o seu comando — não são doze; são mais agora; são quantos você quiser. Vorthun te ensinou bastante antes de ir, e o que ele não ensinou, a Coroa Negra ensina sozinha.
>
> Aenor entra em uma paz nova. Mais profunda. Mais quieta. Não há mais Sombras Errantes nas estradas — você é o que come Sombras Errantes agora. Mestre Arvendel não escreveu uma única palavra sobre você nos arquivos. Não foi por medo. Foi porque ele desapareceu antes de poder escrever.
>
> No alto da torre mais alta da Cidadela, um trono novo. Você senta. A coroa pesa. Pesa mas pesa de modo que você ouve. E continua sentado.

**onEnter:** `unlockAchievement dark_ending`, `unlockAchievement dark_pact` (defensivo), `unlockEnding ending_dark`.

**Escolhas:**
- *"Voltar ao Título."* → apaga save principal, persiste meta. → `TitleScreen`.

#### `ending_sacrifice` — Final do Sacrifício
**Imagem:** `scenes/ending_sacrifice.webp`
**Texto:**
> A luz das três janelas da Égide cresce até virar uma só. Você e Vorthun ficam dentro dela. Ele te olha. Você olha. Em algum momento entre as duas batidas finais do seu coração, vocês são a mesma pessoa por um instante. Em seguida, vocês são ninguém.
>
> Aenor amanhece sem você. Sem ele. As Sombras Errantes evaporam onde estiverem, todas, no mesmo segundo. As estradas voltam a ser estradas. Os pescadores de Bramford recolhem redes. A Floresta de Mirthwood respira. Karn-Tuhl dorme.
>
> Anos depois, em uma feira do porto de Bramford, uma criança aponta para uma placa de bronze nova encaixada na parede do Templo do Saber. A placa não tem nome. Tem apenas a forma de três cristais entrelaçados. A mãe da criança não sabe explicar quem foi. Sabe explicar apenas que foi alguém. E que foi suficiente.

**onEnter:** `unlockAchievement sacrifice_ending`, `unlockEnding ending_sacrifice`.

**Escolhas:**
- *"Voltar ao Título."* → apaga save principal, persiste meta. → `TitleScreen`.

#### `ending_tragic` — Final Trágico
**Imagem:** `scenes/ending_tragic.webp`
**Texto:**
> Você vence. Vorthun cai. A Cidadela cai. O céu se costura — em parte. Há um rasgo no leste que não fecha. Pequeno. Quase imperceptível.
>
> Aenor sobrevive. Aenor sobrevive descontado. As estradas têm menos pessoas porque há menos pessoas. A Floresta de Mirthwood respira mais devagar do que respirava antes. Bramford reconstrói o que perdeu, mas não tudo. Karn-Tuhl segue dormindo, e talvez agora não acorde mais.
>
> Em algum lugar muito distante, atrás do rasgo no leste, uma das vozes que estavam na voz de Vorthun arruma a garganta. Aprende a falar sozinha. Vai demorar. Mas vai aprender.
>
> Você termina sentado num campo vazio, com a Égide quebrada no colo. O que você venceu foi o suficiente para hoje. Não para sempre. Você sabe disso. Você se levanta mesmo assim.

**onEnter:** `unlockAchievement tragic_ending`, `unlockEnding ending_tragic`.

**Escolhas:**
- *"Voltar ao Título."* → apaga save principal, persiste meta. → `TitleScreen`.

---

## 17. Bestiário

### 17.1 Inimigos comuns

| ID | Nome | Hab | Ene | Dano | Fugível | Ouro | Drop | Onde |
|---|---|---|---|---|---|---|---|---|
| `sombra_errante` | Sombra Errante | 6 | 8 | 1d4 | sim | 5 | — | Pedragar, Estrada |
| `sombra_bosque` | Sombra do Bosque | 7 | 10 | 1d4+1 | sim | 8 | Erva da Sombra (50%) | Mirthwood |
| `lobo_corrompido` | Lobo Corrompido | 8 | 9 | 1d6 | sim | 0 | — | Mirthwood |
| `bandido_estrada` | Bandido | 7 | 12 | 1d4+1 | não (1°) | 15 | Adaga (rara) | Estrada |
| `assassino_guilda` | Assassino da Guilda | 9 | 11 | 1d6+1 | sim | 20 | Pó da Cegueira (50%) | Bramford |
| `esqueleto_anao` | Esqueleto Anão | 7 | 8 | 1d6 | não | 0 | Fragmento de Osso | Karn-Tuhl |
| `cavaleiro_sombrio` | Cavaleiro Sombrio | 9 | 14 | 1d6+2 | não | 0 | Insígnia | Cidadela |

### 17.2 Chefes (não-fugíveis)

| ID | Nome | Hab | Ene | Dano | Recompensa | Onde |
|---|---|---|---|---|---|---|
| `combat_korvath` | Druida Korvath | 9 | 22 | 1d6+2 | Fragmento da Vida (key) | Mirthwood |
| `combat_senhora_sombria` | Senhora Sombria da Guilda | 10 | 20 | 1d6+2 | Fragmento da Mente (key) | Bramford |
| `combat_forja_animada` | Forja Animada | 8 | 26 | 1d8 | Fragmento do Corpo (key) | Karn-Tuhl |
| `combat_algoz` | Algoz de Vorthun | 10 | 24 | 2d4 | Manopla Sombria (item; +1 Habilidade) | Cidadela |
| `combat_vorthun` | Vorthun, o Sombrio Coroado | 11 | 30 | 1d8+2 | (final do jogo) | Cidadela |
| `combat_vorthun_traicao` | Vorthun (variante traição) | 11 | 26 | 1d6+3 | (final do jogo) | Cidadela |

> **Notas de balanceamento:** Vorthun tem Habilidade 11, contra Habilidade máxima do Bárbaro 10 — empate é desfavorável; jogador depende do uso correto de poderes utilitários e da Sorte. Para Mago (Hab 7), o combate exige Escudo Místico em rounds de Bola de Fogo + Sorte ofensiva. Sira (Hab 8) precisa abrir com Apunhalar + manter Truques de Fumaça.

### 17.3 Bestiário (UI)

Após primeira derrota, registra entrada em `defeatedEnemies`. Tela "Bestiário" lista todos os derrotados com retrato, descrição e `bestiaryFlavor`. Acessível pelo menu pausa.

---

## 18. Itens

### 18.1 Consumíveis

| ID | Nome | Efeito | Stack | Ouro | Onde adquirir |
|---|---|---|---|---|---|
| `pocao_cura_menor` | Poção de Cura Menor | +6 Energia | sim | 12 | Mercados |
| `pocao_cura` | Poção de Cura | +12 Energia | sim | 25 | Belaron, Velha Garra |
| `pocao_sorte` | Poção de Sorte | +2 Sorte | sim | 30 | Belaron, mercado de Pedragar (raro), Arvendel |
| `po_cegueira` | Pó da Cegueira | (combate) inimigo erra próximo ataque | sim | 15 | Belaron, drop, ferreiro Pedragar |
| `erva_sombra` | Erva da Sombra | +2 Habilidade por 3 rounds | sim | 18 | Velha Garra, drops |
| `carne_seca` | Carne Seca | +3 Energia | sim | 3 | Mercado, inicial Bárbaro |
| `chifre_lunar` | Chifre Lunar | (misc) sem efeito; vende-se. | não | 25 | Drop em `a2_mirthwood_05a` (corte do veado branco) |
| `martelo_de_brasa` | Martelo de Brasa | (combate) gasta turno; próximo ataque com poder de dano ganha **+2 dano**. Quebra após 3 usos. | não | 0 (não vende) | Achado em `a2_karn_06` |
| `pergaminho_de_brasa` | Pergaminho de Brasa | (combate) gasta turno; próximo ataque com poder de dano ganha **+3 dano**. Uso único. | sim | 0 (não vende) | Achado em `a2_karn_15_mago` |
| `pergaminho_de_raiz` | Pergaminho de Raiz | (combate) gasta turno; **+3 Sorte instantâneo** (não ultrapassa `maxSorte`). Uso único. | sim | 30 | Drop em `a2_mirthwood_05c` ou compra Velha Garra |
| `lamina_afiada` | Lâmina Afiada | (combate) gasta turno; **+1 dano** em todos os ataques pelos próximos 5 rounds. Uso único. | sim | 30 | Ferreiro de Pedragar |

### 18.2 Equipamentos (auto-equipados ao adquirir; não ocupam slot extra)

| ID | Nome | Efeito passivo | Onde |
|---|---|---|---|
| `manopla_sombria` | Manopla Sombria | +1 Habilidade | Drop Algoz |
| `amuleto_arvendel` | Amuleto de Arvendel | +1 Sorte máxima | Drop em `a1_pedragar_06b` (Arvendel sobrevive estável) |
| `botas_silenciosas` | Botas Silenciosas | +1 Furtividade | Comprável Bramford (Guilda) |
| `anel_de_brom` | Anel de Brom | +1 Sorte máxima | Achado em `a2_karn_16_ladino` (cofre escondido) |

> *Nota de equipamento:* não há slot de equipamento explícito no MVP. Itens de §18.2 ficam permanentemente "equipados" assim que adquiridos. Não ocupam slot regular do inventário (são listados na aba "Equipados" do `<InventoryDrawer>`). Bônus passivos somam diretamente em `gameState.stats` no momento da aquisição via `engine/inventory.ts:applyEquipment()`.

### 18.3 Itens-chave (key items)

| ID | Nome | Função |
|---|---|---|
| `cajado_vesperia` | Cajado Quebrado de Vesperia | Mago start; usado em puzzle Mirthwood |
| `adagas_pai` | Adagas Gêmeas do Pai | Ladina start; flag emocional Bramford |
| `gazua` | Gazua | Ladina start; permite forçar fechaduras simples sem rolagem (`a2_bramford_06_guilda`, etc.). |
| `machado_totem` | Machado Totêmico Korrundir | Bárbaro start; reconhecido em Karn-Tuhl |
| `mapa_egide` | Mapa da Égide | Recebido de Arvendel (`_06` ou `_06b`); destrava `WorldMap` |
| `chave_de_raiz` | Chave de Raiz | Recebida em `a2_mirthwood_05c`; abre atalho em `a2_mirthwood_06` (pula combate de servos: o jogador entra direto em `_08`). |
| `chave_do_templo` | Chave do Templo | Drop em `a2_bramford_07_guarda`; alternativa narrativa para destravar o Templo se ramo Guarda foi escolhido. |
| `frag_vida` | Fragmento da Vida | 1° fragmento |
| `frag_mente` | Fragmento da Mente | 2° fragmento |
| `frag_corpo` | Fragmento do Corpo | 3° fragmento |
| `egide_solgar` | Égide de Solgar | Forjada após reunir os 3 — destrava Cidadela das Sombras |
| `selo_sombrio` | Selo Sombrio | Aceitar oferta de Korvath/Senhora Sombria. Carregar este item afeta o final disponível e dispara reações narrativas (driada em `a2_mirthwood_05b`, etc.). |
| `coroa_negra` | Coroa Negra | Substitui `egide_solgar` no ramo `a3_cidadela_09c` (pacto sombrio aceito). Não tem efeito mecânico de jogo — apenas simbólico narrativo no `ending_dark`. |

---

## 19. Conquistas

| ID | Nome | Descrição | Hidden |
|---|---|---|---|
| `first_blood` | Primeira Lâmina | Vença seu primeiro combate. | não |
| `pacifist_streak` | Voz Antes da Lâmina | Resolva 5 conflitos sem combate. | não |
| `lucky_seven` | Sete Vidas | Use Sorte 7 vezes em uma run. | não |
| `wise_choice` | Decisão Sábia | Salve Mestre Arvendel no Ato 3. | sim |
| `dark_pact` | Pacto Sombrio | Aceite a oferta de Vorthun. | sim |
| `complete_codex` | Códex Completo | Derrote todos os inimigos do bestiário em uma run. | sim |
| `all_fragments` | Égide Restaurada | Reúna os 3 fragmentos. | não |
| `heroic_ending` | Luz Vencedora | Termine no final Heroico. | não |
| `dark_ending` | Coroa Negra | Termine no final Sombrio. | sim |
| `sacrifice_ending` | Maior Amor | Termine no final do Sacrifício. | sim |
| `tragic_ending` | Sombras Errantes | Termine no final Trágico. | sim |
| `all_classes` | Trindade | Termine o jogo com cada classe. | não |
| `no_damage_act1` | Inabalável | Termine o Ato 1 sem perder Energia. | sim |

Conquistas são persistidas em `metaSave` (cross-run) — não somem ao morrer.

---

## 20. Finais

### 20.1 Final Heroico (`ending_heroic`)
**Condições:** Vencer Vorthun em combate direto, Reputação ≥ +5.
**Texto-âncora:** Vorthun se desfaz em poeira; a Cidadela rui ao redor; o herói retorna ao reino e é recebido como salvador. NPCs sobreviventes aparecem em vinheta. Égide reluz.
**Imagem:** `scenes/ending_heroic.webp` — herói segurando Égide com sol nascente.

### 20.2 Final Sombrio (`ending_dark`)
**Condições:** Aceitar pacto sombrio com Vorthun, Reputação ≤ -3.
**Texto-âncora:** Vorthun cede o trono ao herói. As Sombras Externas obedecem nova voz. Final amargo: o herói venceu... mas tornou-se o que combateu. Aenor é "salvo" sob mão de ferro.
**Imagem:** `scenes/ending_dark.webp` — herói sentado em trono negro, coroa fundida.

### 20.3 Final do Sacrifício (`ending_sacrifice`)
**Condições:** Reputação ≥ +3, flag `aceitouSacrificio === true`, e nó `_09` escolha "Eu me ofereço no seu lugar".
**Texto-âncora:** Herói usa Égide para se selar com Vorthun. Aenor é salvo, mas o herói desaparece. Última cena: anos depois, em uma feira de Bramford, uma criança pergunta à mãe quem foi a figura na placa de bronze do Templo do Saber; a mãe não sabe o nome, mas sabe a história.
**Imagem:** `scenes/ending_sacrifice.webp` — duas silhuetas (herói e Vorthun) consumidas em luz dourada.

### 20.4 Final Trágico (`ending_tragic`)
**Condições:** Qualquer outro caminho que chega ao confronto sem cumprir requisitos dos 3 anteriores. Ex.: vence Vorthun com Reputação neutra mas Selo Sombrio carregado, ou aceita pacto neutro e morre na traição, ou vence sem Égide completa por flag rara.
**Texto-âncora:** Vorthun é destruído mas as Sombras Externas já cruzaram. O reino sobrevive em frangalhos. Ato vencedor mas o mundo perdeu mais do que ganhou.
**Imagem:** `scenes/ending_tragic.webp` — herói no campo de batalha vazio, céu rachado.

---

## 21. UI/UX e Telas

### 21.1 Mapa de telas

```
TitleScreen ──► CharacterSelect ──► Game (rota principal)
     ▲                                  │
     │                                  ├── NarrativeView (default)
     │                                  ├── CombatView (modal full-screen)
     │                                  ├── MapView (modal full-screen)
     │                                  ├── InventoryDrawer (lateral)
     │                                  ├── BestiaryView (modal)
     │                                  └── PauseMenu
     │
     └── Gallery (finais desbloqueados, conquistas) — acessível do TitleScreen
```

### 21.2 TitleScreen

- Background: ilustração de mapa em pergaminho desbotado.
- Título grande "Aventuras Fantásticas" em fonte Cinzel.
- Botões: **Continuar** (se há save), **Nova Aventura**, **Galeria**, **Créditos**.
- Mostra discreto contador "Finais desbloqueados: X/4".

### 21.3 CharacterSelect

- 3 cards lado a lado (mobile: empilhados verticalmente).
- Cada card: retrato, nome, título, stats, sumário backstory (3-4 linhas).
- Botão "Ler história completa" expande modal com backstory completo.
- Hover/focus card: levemente eleva e dourado.
- Botão "Iniciar Jornada" no card selecionado.

### 21.4 NarrativeView

- Layout: imagem (se houver) no topo, texto narrativo grande no centro, lista de escolhas na base.
- Texto com efeito typewriter (~25 chars/seg). Click ou Enter pula para o final.
- HUD lateral persistente: stats, ouro, reputação. Ícone para abrir Inventário, Bestiário, Mapa, Pausa.
- Indicador sutil em escolhas: ícone de dado se há skill check, ícone de espada se leva a combate, ícone de classe se é exclusiva.
- Tooltip ao passar mouse na escolha: mostra requisitos, dificuldade do check.

### 21.5 CombatView

- Background atmosférico (mais escuro/sombrio).
- Esquerda: stats do jogador (Energia em barra, Sorte, efeitos ativos, Habilidade atual).
- Direita: card do inimigo (retrato + Energia + nome).
- Centro: log de combate (últimas 4-5 linhas), animação de dados.
- Inferior: botões de ação — 3 poderes (com tooltip), itens usáveis, fugir (se permitido).
- Animação de dado: ~1.2s, dado rolando, número final destacado.
- Após dano: aparece prompt "Tentar a Sorte?" com Sim/Não.

### 21.6 MapView

- Imagem de mapa em fullscreen (overlay sobre o jogo).
- Pins clicáveis em locais.
- Painel lateral com nome + descrição + status (visitado, disponível, bloqueado) do local em foco.
- Botão "Confirmar viagem" e "Voltar".

### 21.7 InventoryDrawer

- Drawer lateral direito, abre/fecha com tecla I ou ícone.
- Aba "Itens" (6 slots com quantidade), aba "Itens-chave", aba "Equipados".
- Cada item: nome, descrição, botões "Usar" (se aplicável) e "Descartar" (regular apenas).

### 21.8 BestiaryView

- Modal com grid de inimigos.
- Inimigos não derrotados aparecem como silhueta com `???`.
- Click em inimigo derrotado: card com retrato, stats, flavor text, contagem de derrotas.

### 21.9 PauseMenu

- Esc abre. Botões: Continuar, Salvar Manualmente, Voltar ao Título, Reiniciar Run.
- Reiniciar Run pede confirmação dupla (apaga save).

### 21.10 Estados de transição

- Mudança de nó: fade-out 200ms → fade-in 300ms.
- Entrada em combate: fade para preto + tagline atmosférica ("Lâminas saem das bainhas.") por 1s.
- Game over: tela escurece, texto narrativo, botão único.

### 21.11 Componentes-chave React (especificação)

Cada componente abaixo recebe props tipados; estado vem do Zustand store via hooks selecionadores.

- `<TypewriterText text speedMs onComplete onSkip />`
- `<DiceRoll diceCount faces bonus targetDc onRevealed />`
- `<ChoiceList choices onPick />`
- `<StatsBar habilidade energia maxEnergia sorte maxSorte effects />`
- `<EnemyCard enemy currentEnergia />`
- `<PowerSelector powers disabled onPick />`
- `<InventoryItemCard item count onUse onDiscard />`
- `<ImageScene src alt caption />`

---

## 22. Save System

### 22.1 Slots e formato

- **1 save automático** principal (`av_fant_save_v1`).
- **1 metaSave** (`av_fant_meta_v1`) com finais e conquistas desbloqueados (cross-run, nunca apagado).
- Formato: JSON serializável de `GameState` + version.

### 22.2 Quando salva

- Após cada `ChoiceOutcome` resolvido (entrada em novo nó).
- Após combate (vitória ou fuga).
- Ao usar "Salvar Manualmente" no menu pausa.

### 22.3 Versionamento e migrações

```ts
interface SaveBlob {
  version: number;        // 1
  savedAt: number;
  state: GameState;
}
```

Se versão diferente da atual, executa migrações em `engine/save.ts:migrate(blob)`. Se inválido, descarta com aviso ao usuário.

### 22.4 Apagar

- Ao morrer (game over), persiste meta primeiro, depois apaga save principal.
- Botão "Reiniciar Run" também apaga (com confirmação).

---

## 23. Acessibilidade e Responsividade

### 23.1 Acessibilidade

- **Teclado:** todas as ações principais com atalho. `1-9` para escolhas, `I` inventário, `M` mapa, `Esc` pausa, `Espaço` pula typewriter.
- **Foco visível:** outline dourado em elementos focáveis.
- **ARIA:** roles e labels em todos os botões e regiões; `aria-live="polite"` no log de combate.
- **Contraste:** texto sobre pergaminho >= 7:1.
- **Animações:** respeita `prefers-reduced-motion` (desliga typewriter, reduz fades).
- **Tamanho da fonte:** botão na pausa permite +20%/+40%.

### 23.2 Responsividade

- **Desktop (≥1024px):** layout multi-coluna, HUD lateral.
- **Tablet (768-1024px):** HUD topo recolhível.
- **Mobile (< 768px):** layout single-column, HUD compacto, inventário em modal full-screen, escolhas viram lista vertical.
- **Combate em mobile:** inimigo card no topo, jogador embaixo, botões de poder em grid 2×2.

---

## 24. Prompts de Geração de Imagem

> Todos os prompts em **inglês**. Estilo unificado: pintura digital fantasia clássica, paleta sépia/heróica. Anexar em todas as cenas a chave `--style classic-fantasy-painting --aspect 16:9` (ou 1:1 / 3:4 conforme uso).

### 24.1 Personagens (3 retratos — aspect 3:4)

**Mago — `characters/mago.webp`**
> Portrait of Eldwin Vethrys, a young human male wizard in his early twenties, slight build, pale skin, tired hazel eyes, dark hair to the shoulders, wearing dusty wine-colored academic robes embroidered with faded silver runes. Holds a broken oak staff with a cracked crystal at its top, the only memento of his fallen master. Stands in a dim study with stacks of old leather books behind him, candle light catching the dust in the air. Mood: melancholic resolve. Style: classic fantasy oil painting in the style of Larry Elmore and Keith Parkinson, rich warm sepia palette, dramatic chiaroscuro lighting, painterly brushwork, book cover composition. Aspect ratio 3:4.

**Ladina — `characters/ladino.webp`**
> Portrait of Sira Crowfoot, a human woman in her late twenties, lean and wiry, olive skin, sharp green eyes, raven-black hair tied back, a small scar across the left cheekbone. Wears dark leather rogue armor with deep hood half-lowered, twin matching daggers crossed at her belt. Standing in a moonlit alley of a medieval merchant city, lantern glow behind her, expression cool and watchful, half a smirk. Mood: confident outlaw with hidden grief. Style: classic fantasy oil painting in the style of Larry Elmore and Keith Parkinson, rich warm sepia palette, dramatic chiaroscuro, painterly brushwork, book cover composition. Aspect ratio 3:4.

**Bárbaro — `characters/barbaro.webp`**
> Portrait of Thorgar Stonehand, a tall and powerfully built human male barbarian in his early thirties, weathered skin tanned by snow and sun, ice-blue eyes, long copper-brown hair braided with bone beads, full beard. Wears a white wolf pelt over leather and fur armor, broad shoulders bared. Holds a great two-handed totemic axe carved with tribal runes. Stands in a snowy mountain pass, breath visible, distant peaks behind him. Mood: stoic exile carrying old guilt. Style: classic fantasy oil painting in the style of Larry Elmore and Frank Frazetta, rich warm sepia palette with cold blue accents, dramatic lighting, painterly brushwork, book cover composition. Aspect ratio 3:4.

### 24.2 Mapa do mundo — `map.webp` (aspect 16:9)

> Hand-painted parchment map of the kingdom of Aenor, classic fantasy cartography style. Visible locations marked with small ornamental icons: a small village (Pedragar) at the edge of rolling hills; an ancient deep forest (Mirthwood) painted in mossy greens; a walled merchant city (Bramford) on a river; ruined dwarven mountain fortress (Karn-Tuhl) high on snowy peaks; a dark spired citadel (Cidadela das Sombras) hidden in a valley of black clouds. Roads winding between them. Compass rose, sea monsters in the corner ocean, decorative cartouche with title "Reino de Aenor". Style: aged parchment, sepia and ochre palette, painted in the style of medieval illuminated manuscripts and Tolkien-era fantasy maps. Aspect ratio 16:9.

### 24.3 Cenas-chave (12 imagens — aspect 16:9)

| ID | Prompt |
|---|---|
| `scenes/cena_abertura.webp` | A small medieval village at dusk being attacked by ribbon-like shadow creatures pouring from the forest. Villagers flee with torches. Smoke curls. Style: classic fantasy oil painting (Elmore/Frazetta), warm sepia with cold violet shadows, dramatic lighting. 16:9. |
| `scenes/arvendel.webp` | An old robed sage with a long white beard, gravely wounded, slumped against a stone altar in a candlelit chapel, holding a glowing parchment toward the viewer with trembling hand. Style: classic fantasy oil painting, deep amber chiaroscuro. 16:9. |
| `scenes/mirthwood_entry.webp` | The entrance to an ancient sacred forest, a colossal twisted oak archway covered in glowing runes and moss, mist between the trees, soft golden shafts of light. Style: classic fantasy oil painting, lush mossy greens and gold. 16:9. |
| `scenes/korvath.webp` | A tall corrupted druid in tattered green robes, antler crown blackened, eyes glowing with shadow, standing in a ruined sacred grove of dying trees. Style: classic fantasy oil painting, sickly greens and shadow purple. 16:9. |
| `scenes/bramford_market.webp` | A bustling medieval merchant city square at midday, half-timbered houses, crowded market stalls with hanging cloth signs, a tall stone temple in the background, river visible between buildings. Style: classic fantasy oil painting, rich earth tones. 16:9. |
| `scenes/templo_saber.webp` | The interior of an ancient temple of knowledge, towering stone columns, walls lined with bookshelves rising into shadow, runic mosaic floor glowing faintly. Style: classic fantasy oil painting, deep blues and gold candlelight. 16:9. |
| `scenes/senhora_sombria.webp` | A regal hooded woman in obsidian assassin robes seated on a throne of scrolls and daggers, half her face hidden, the other half showing cruel beauty. Style: classic fantasy oil painting, blacks and bronzes. 16:9. |
| `scenes/karn_tuhl_entry.webp` | A massive ruined dwarven gate carved into a snowy mountain face, runes of ancient kings, snow drifting in, broken statues of dwarven warriors flanking the entrance. Style: classic fantasy oil painting, cold blue snow and warm forge embers within. 16:9. |
| `scenes/durin_throne.webp` | The ghostly spirit of a dwarven king in ornate armor, translucent blue, seated on a stone throne in a vast empty hall, blue spectral fire braziers around him. Style: classic fantasy oil painting, ethereal blue with deep shadow. 16:9. |
| `scenes/cidadela_exterior.webp` | An immense black citadel of jagged spires rising from a valley of black clouds, lightning crackling around its peaks, a single stone bridge approaching. Style: classic fantasy oil painting, dark gothic dramatic. 16:9. |
| `scenes/vorthun_throne.webp` | A vast obsidian throne room lit by green spectral flame, Vorthun the lich-king seated upon a throne of bones, cracked black armor, fused crown, glowing green eyes within hollow helm. Style: classic fantasy oil painting, blacks and toxic greens, monumental scale. 16:9. |
| `scenes/ending_heroic.webp` | A hero (silhouetted) standing on a cliff at sunrise, holding aloft a glowing tri-form amulet (the Aegis), kingdom spreading below in golden light. Style: classic fantasy oil painting, triumphant warm gold. 16:9. |
| `scenes/ending_dark.webp` | A hero seated on a throne of black iron and bone, fused dark crown, glowing eyes, kingdom mist visible through tall windows behind. Style: classic fantasy oil painting, blacks and bloody crimson. 16:9. |
| `scenes/ending_sacrifice.webp` | Two silhouettes (the hero and Vorthun) consumed together in a vertical pillar of golden light rising into a fractured sky, citadel breaking apart. Style: classic fantasy oil painting, golds and whites against deep black. 16:9. |
| `scenes/ending_tragic.webp` | A lone hero standing on an empty battlefield at dusk, broken Aegis at their feet, sky cracked open with shadow tendrils receding. Style: classic fantasy oil painting, muted ash and bruised purples. 16:9. |

### 24.4 Inimigos (retratos — aspect 1:1)

Para cada `enemyId`, prompt curto:

| ID | Prompt |
|---|---|
| `sombra_errante` | A wraith-like silhouette of pure shadow with hollow white eyes, ribbons of darkness trailing from its body, hovering in twilight. Classic fantasy oil painting style, dark violet palette. 1:1. |
| `sombra_bosque` | A shadow creature shaped like a corrupted stag, antlers of black smoke, eyes like green coals, deep forest at night behind. Classic fantasy oil painting style. 1:1. |
| `lobo_corrompido` | A snarling wolf with shadow leaking from its eyes and mouth, mangy fur, in moonlit woods. Classic fantasy oil painting style. 1:1. |
| `bandido_estrada` | A grim human bandit in patchwork leather armor, scarred face, holding a notched short sword on a forest road. Classic fantasy oil painting style. 1:1. |
| `assassino_guilda` | A masked human assassin in tight black leather, twin curved daggers, lurking on a moonlit rooftop. Classic fantasy oil painting style. 1:1. |
| `esqueleto_anao` | An undead dwarven skeleton in rusted ancient plate armor, glowing blue eye sockets, holding a cracked warhammer, in a dark stone hall. Classic fantasy oil painting style. 1:1. |
| `cavaleiro_sombrio` | An imposing knight in cracked black plate armor, helmet sealed, glowing red visor slit, holding a great two-handed sword crackling with shadow. Classic fantasy oil painting style. 1:1. |
| `combat_korvath` | (use scene `scenes/korvath.webp` cropped square). |
| `combat_senhora_sombria` | (use scene `scenes/senhora_sombria.webp` cropped square). |
| `combat_forja_animada` | A massive humanoid construct of dwarven iron and forge fire, glowing runes, hammer-arms, in an ancient forge. Classic fantasy oil painting style. 1:1. |
| `combat_algoz` | A towering executioner-knight in shadow-touched armor, carrying a great curved cleaver, hood of darkness, eyes like coals. Classic fantasy oil painting style. 1:1. |
| `combat_vorthun` | (use scene `scenes/vorthun_throne.webp` cropped to upper torso). |

---

## 25. Requisitos Não Funcionais

### 25.1 Desempenho

- Carregamento inicial < 3s em conexão 4G simulada.
- Bundle JS gz < 250KB (sem imagens).
- Imagens em WebP com fallback PNG, lazy-loaded fora do viewport.
- 60fps em animação de dado, typewriter e fades.

### 25.2 Compatibilidade

- Chrome/Edge ≥ 110, Firefox ≥ 110, Safari ≥ 16.
- Sem polyfills além dos automáticos do Vite.

### 25.3 Segurança

- Sem backend; sem dados pessoais coletados.
- localStorage não armazena PII.
- Sem chamadas externas em produção (todo conteúdo bundled).

### 25.4 Testabilidade

- 100% das funções em `src/engine/` cobertas por unit test.
- Snapshot test de pelo menos 1 nó por capítulo para evitar regressão de conteúdo.
- Smoke test de "happy path heroico" via React Testing Library + Playwright (opcional).

### 25.5 Internacionalização

- Idioma único (PT-BR) na v1.
- Estrutura de strings já isolável: textos longos vivem dentro de `nodes/*.ts`; strings de UI vivem em `src/i18n/pt.ts` com chaves. Adicionar EN é trabalho de tradução, não de refactor.

### 25.6 Tempo de boot do conteúdo

Conteúdo é importado estaticamente (`import * as nodes from './content/nodes'`); não há fetch dinâmico em runtime. Isso permite tree-shake e tipagem estrita do grafo de nós.

### 25.7 Validação do grafo narrativo

Script `npm run validate-graph` que percorre todos os nós e verifica:
- Todos os `nextNodeId` referenciados existem.
- Todos os `enemyId`, `itemId`, `keyItemId` referenciados existem.
- Todos os nós são alcançáveis a partir de `a1_pedragar_01`.
- Todo final tem ao menos 1 caminho.
- Nenhum nó é "buraco negro" (sem escolhas e sem `isEnding`).

Script roda em CI (GitHub Actions) e no `pre-commit`.

---

## 26. Roadmap de Implementação

Sugestão de fases para construir incrementalmente — cada fase é uma release jogável.

### Fase 0 — Setup (1-2 dias)
- Vite + React + TS scaffolded.
- Tokens de design, fontes carregadas, layout base de pergaminho.
- Estrutura de pastas criada.
- ESLint + Prettier + Vitest configurados.

### Fase 1 — Motor (3-5 dias)
- Tipos em `src/types/index.ts`.
- `engine/random.ts`, `dice.ts`.
- `engine/skillCheck.ts` + testes.
- `engine/combat.ts` + testes.
- `engine/luck.ts` + testes.
- `engine/inventory.ts`, `reputation.ts`, `narrative.ts`.
- `store/gameStore.ts` Zustand.
- `engine/save.ts` localStorage + versionamento.

### Fase 2 — Conteúdo mínimo (2-3 dias)
- 3 personagens em `content/characters.ts`.
- 9 poderes em `content/powers.ts`.
- ~15 nós do Ato 1 em `content/nodes/act1.ts`.
- 2-3 inimigos.
- 5-8 itens iniciais.
- Validador de grafo passando.

### Fase 3 — UI essencial (4-6 dias)
- TitleScreen + CharacterSelect.
- NarrativeView com TypewriterText e ChoiceList.
- HUD lateral (StatsBar, GoldDisplay, ReputationMeter).
- CombatView com PowerSelector e DiceRoll.
- Modal de Tentar a Sorte.
- Tela de Game Over.

### Fase 4 — Conteúdo Ato 2 e Ato 3 (5-8 dias)
- Os ~80 nós restantes.
- 7 inimigos restantes incluindo chefes.
- Itens completos.
- Mapa interativo com WorldMap.
- 4 finais.

### Fase 5 — Extras (3-5 dias)
- InventoryDrawer.
- BestiaryView.
- Galeria de finais e conquistas.
- Diário/log de aventura.
- PauseMenu.

### Fase 6 — Imagens e polish (paralelo)
- Geração e integração de imagens.
- Animações de transição.
- Som? (fora do escopo v1, mas hooks já permitem adicionar depois).

### Fase 7 — Testes e release (2-3 dias)
- Smoke test em dispositivos reais (mobile, tablet, desktop).
- Cobertura de testes ≥ 80% no engine.
- Build de produção e deploy estático (Vercel/Netlify/GitHub Pages).

**Total estimado:** 20-30 dias de desenvolvimento full-time.

---

## 27. Glossário

| Termo | Definição |
|---|---|
| **Ato** | Divisão maior da narrativa (1, 2 ou 3). |
| **Bestiário** | Coleção de inimigos derrotados pelo jogador. |
| **CD** | Class Difficulty / Classe de Dificuldade — número que a rolagem precisa igualar ou ultrapassar. |
| **Égide de Solgar** | Artefato lendário com 3 fragmentos; a chave para destruir Vorthun. |
| **Energia** | HP do personagem. |
| **Força de Ataque** | Habilidade + 2d6 + modificadores; resolução de combate clássico FF. |
| **Fragmento** | Cada uma das 3 partes da Égide. |
| **Habilidade** | Atributo de combate; modificador principal. |
| **Key item** | Item-chave; narrativo, sem ocupar slot, indescartável. |
| **MetaSave** | Save persistente cross-run com finais e conquistas. |
| **Nó narrativo** | Unidade atômica de história; um nó = uma cena = uma decisão. |
| **Reputação** | Eixo único -10 a +10 que mede honra/sombria do herói. |
| **Sombras Errantes** | Inimigos comuns; servos menores de Vorthun. |
| **Sorte** | Atributo gastável; refaz rolagens, modula dano. |
| **Vorthun** | Vilão final; lich antigo. |

---

## Anexo A — Exemplo de Combate Resolvido (passo a passo)

**Cenário:** Eldwin (Mago, Hab 7, Energia 14, Sorte 11) vs. Sombra Errante (Hab 6, Energia 8, dano 1d4).

**Round 1.**
- Jogador escolhe **Bola de Fogo** (+0 ataque, dano 1d6+3, penalidade -1 Hab próximo round).
- Player: 7 + 2d6(=8) + 0 = **15**.
- Sombra: 6 + 2d6(=7) = **13**.
- Player vence: rola 1d6+3 = **6 dano**. Sombra Energia: 8 → 2.
- Tick efeitos: penalidade -1 Hab fica ativa para round 2.

**Round 2.**
- Player escolhe **Raio Arcano** (+1 ataque, dano 1d4+2).
- Player: (7-1) + 2d6(=6) + 1 = **13**.
- Sombra: 6 + 2d6(=9) = **15**.
- Sombra vence: rola 1d4 = **3 dano**. Player Energia: 14 → 11.
- **Tentar a Sorte?** Player escolhe sim. Rola 2d6 = **9** vs Sorte 11. Sucesso: dano reduzido em 2. Player Energia: 14 → 13. Sorte: 11 → 10.
- Tick: penalidade expira.

**Round 3.**
- Player escolhe **Raio Arcano**.
- Player: 7 + 2d6(=9) + 1 = **17**.
- Sombra: 6 + 2d6(=8) = **14**.
- Player vence: 1d4+2 = **5 dano**. Sombra Energia: 2 → -3. **Vitória.**

**Recompensa:** +5 ouro, sombra registrada no bestiário.

---

## Anexo B — Tabela Mestra de Skill Checks no Jogo

| Local | Nó | Skill | CD | Sorte? | Sucesso (efeito) | Falha (efeito) |
|---|---|---|---|---|---|---|
| Pedragar | a1_pedragar_05 | Investigar | 9 | sim | Descobre traição interna (flag) | (nada; segue normal) |
| Mirthwood | a2_mirthwood_02 | Persuadir/Trapaca | 9/11 | sim | Fadas ajudam (+pista) | -2 Energia, segue |
| Mirthwood | a2_mirthwood_09 | Persuadir | 13 | sim | Korvath redime-se (sem combate) | Combate forçado |
| Bramford | a2_bramford_03 | Investigar | 9 | sim | Descobre fraqueza Senhora Sombria (+1 ataque no chefe) | (nada) |
| Bramford | a2_bramford_07 (×3) | Arcano/Investigar/Resistir | 9/11/9 | sim | Cada sucesso = -2 dano no chefe próximo | (cada falha = -1 Energia) |
| Karn-Tuhl | a2_karn_02 | Resistir Magia | 9 | não | Sem dano | -3 Energia (frio) |
| Karn-Tuhl | a2_karn_04 | Investigar | 9 | sim | Atalho (pula 1 combate) | Sem atalho |
| Karn-Tuhl | a2_karn_08b | Investigar | 11 | sim | Vence enigma sem combate | Combate forçado |
| Cidadela | a3_cidadela_02 | Arcano | 11 | sim | Atravessa Portão | -4 Energia, atravessa |
| Cidadela | a3_cidadela_04 | Resistir Magia | 11 | sim | +3 Sorte (lembra-se de algo bom) | -1 Reputação (lembra-se de algo ruim) |

> Notas: o jogo **nunca bloqueia progresso** por skill check; a falha sempre tem caminho, com custo. Princípio: dado é tempero, não muralha.

---

## Anexo C — Fórmulas Resumidas

**Combate (round padrão, dano):**
```
playerFA = habilidade + d6 + d6 + power.attackModifier - somaPenalidades
enemyFA  = enemy.habilidade + d6 + d6
if playerFA > enemyFA: enemy.energia -= roll(power.damage)
elif enemyFA > playerFA: player.energia -= roll(enemy.damage)
else: nada
```

**Combate (round padrão, utilitário):**
```
aplicar power.effect ao estado
enemyFA = enemy.habilidade + d6 + d6
defenseFA = habilidade + d6 + d6 + (efeito de utility, ex.: shield= +∞ se shield_active)
if enemyFA > defenseFA: player.energia -= max(0, roll(enemy.damage) - shield_reduction)
```

**Skill check:**
```
total = d6 + d6 + skillBonus[skill] - somaPenalidadesAtivas
sucesso = total >= cd
```

**Tentar a Sorte (após dano):**
```
roll = d6 + d6
if roll <= sorte_atual: dano_recebido -= 2 (mín 0)
else: dano_recebido += 1
sorte_atual -= 1
```

**Fuga:**
```
playerRoll = habilidade + d6 + d6
enemyThreshold = enemy.habilidade + 8
sucesso = playerRoll >= enemyThreshold
falha => -2 Energia E inimigo ataca normal no round
```

---

**Fim do SPEC.md.**
