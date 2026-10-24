# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

## [2.0.0] — 2026-10-24

Temas em dois eixos: `theme` diz a identidade, `mode` diz se ela está
em base ou escura. Quatro temas — Mothership Glass, Cream, Paperpen e
Flat —, oito pares. Quebra a API de tema; componentes, tokens e
classes `ms-*` seguem iguais. Guia completo em
[`docs/migracao-v2.md`](docs/migracao-v2.md). Decisões em
`docs/decisoes.md`, D8 a D12.

### Quebras

- **`Theme` passa a ser `"glass" | "cream" | "paperpen" | "flat"`**
  (era `"dark" | "darker" | "light"`). O antigo escuro é o Glass base,
  o Darker é o Glass escuro e o claro é o Cream base.
- **Tema padrão passa a ser o Mothership Flat** (`defaultTheme="flat"`,
  era o antigo escuro). Quem não passa `defaultTheme` abre no Flat base;
  `defaultTheme="glass"` mantém o visual da v1. Sem `ThemeProvider`, só
  com o CSS, nada muda: sem atributo no `<html>`, vale o Glass base.
  Com SSR, ponha `data-ms-theme="flat" data-ms-mode="base"` no `<html>`
  do servidor para não abrir no Glass até hidratar (D13).
- **`useTheme().toggle` sai; entra `toggleMode`**, que alterna base ↔
  escuro dentro do tema atual (o `toggle` trocava claro ↔ escuro, ou
  seja, de tema). `useTheme()` ganha `mode`, `resolvedMode` e `setMode`.
- **Classes `.light` e `.darker` no `<html>` saem**: o `ThemeProvider`
  escreve `data-ms-theme` e `data-ms-mode` (o modo resolvido). Sem
  atributo, vale o Glass base. Prefixados, os atributos não colidem com
  classes de quem instala a lib. CSS que mirava as classes precisa
  trocar de seletor (tabela no guia de migração).
- **`ThemeSwitch` alterna o modo, não o tema**: no Cream vai de base
  para escuro, não para o Glass. Rótulo "Modo escuro" (era "Alternar
  tema"), `aria-checked` = escuro.

### Adicionado

- **`defaultMode`** no `ThemeProvider` (`"base"` padrão) e
  **`mode="system"`**, que acompanha o `prefers-color-scheme` e as
  mudanças do SO. Lido com `useSyncExternalStore`, então o primeiro
  render já sai no modo certo no cliente (`"base"` no servidor).
- **`persist` grava tema e modo** (`ms-theme` e `ms-mode`) e converte a
  escolha salva pela v1 (`dark`/`darker`/`light`) para o par
  equivalente: ninguém perde a preferência na atualização.
- **`ThemeMenu` com os oito pares**, um grupo rotulado por tema, e
  **Seguir o sistema** no topo. O gatilho mostra o ícone do modo na
  tela (lua vazada no Glass base, sol no base dos outros, lua cheia em
  qualquer escuro) e diz o par no `aria-label`, com ", seguindo o
  sistema" quando for o caso. O mesmo ícone vale no polegar do
  `ThemeSwitch`.
- **Mothership Cream escuro** (D10): papel âmbar meio-tom (`#c9b998`)
  com tinta escura (`#1f1c18`), vidro claro, glows e gradiente da logo.
  Baixa a luz em vez de inverter, por isso accent como texto, ativo,
  danger, success e gráficos descem de um a três passos (texto/vidro
  11.30:1, borda/papel 3.48:1).
- **Mothership Paperpen** (D9, D11): papel quadriculado sobre glows em
  aquarela, caneta esferográfica azul, sem vidro nem sombra, contorno
  mais grosso com cantos levemente irregulares, preenchimento sólido em
  hachura de caneta e ativo em caneta vermelha. Homemade Apple nos
  títulos, Patrick Hand no corpo (a 112,5%, por ser ~22% mais estreita
  que a Outfit), terminal em Maple Mono itálico. Escuro em papel azul
  tinta (`#1a2b5a`), texto off-white frio e caneta azul clara. As
  fontes não vêm com a lib: receita em
  [`docs/tokens.md`](docs/tokens.md#fontes-do-paperpen).
- **Mothership Flat** (D12): zinco neutro, superfície opaca, sem vidro
  nem sombra, glows sutis. Accent em tinta neutra (botão solid preto no
  base, branco no escuro); a cor da marca só no gradiente de ativo e
  nos estados. Superfícies separadas do fundo só por tom.
- **Tokens para os temas novos**, com o valor de hoje nos outros (sem
  mudança visual): `--font-family-display` (títulos e display),
  `--font-mono-style`, `--bg-texture` (primeira camada do `--bg-page`),
  `--fill-solid` (camada por cima de preenchimento sólido),
  `--paper-line`, `--color-border-surface` (contorno de superfície em
  fluxo) e `--color-field` (fundo dos campos).
- **`--ease-default: ease`** (`src/styles/tokens.css`): nomeia a curva
  que as `--transition-*` já usavam implícita, para o Mothership Shell
  ler o token em vez de fixar o `ease` no gerador. O `.ms-hover-edge`
  passa a escrevê-la explícita na cor da borda. Nada muda no visual.

### Styleguide e exemplo

- **Story "Temas"** em Fundações: os oito pares lado a lado numa grade
  4×2, cada um num `<iframe>` com os atributos no próprio `<html>`.
- `ThemeMenu` da navbar com os oito pares; textos das stories sem os
  nomes da v1. Fontes do Paperpen no `<head>` do styleguide e do
  exemplo.
- **Busca no styleguide** (`styleguide/App.tsx`): campo no cabeçalho,
  feito com o próprio `Combobox`, que acha a story pelo título, pelo nome
  do componente (`Button`, `Table`, `PricingCard`…, campo novo
  `keywords` nas stories) ou pelo texto de apoio, sem diferenciar acento
  nem caixa. `/` ou Ctrl+K focam o campo. Só o styleguide; nenhuma API
  nova na biblioteca.

### Corrigido

- **`reset.css` sem o fundo do Flat** e com o Cream base em branco puro
  (`#ffffff`, de antes do off-white da v1.8): o `<html>` pintava o
  fundo errado no overscroll. Agora espelha o `--bg-base` dos oito
  pares.
- **Olho da `Splash` fora do centro no Firefox** (`.ms-splash__word`):
  o nome nasce ampliado em `scale(2.4)` com origem no centro da própria
  caixa (`transform-box: fill-box`), e o Firefox soma à caixa do grupo
  o transform das letras ainda escondidas — a origem mudava e o rosto
  nascia ~50px à direita. A origem agora é fixa, em coordenadas do
  `viewBox`, no centro que o Chromium já usava: nada muda nele.
- **`<main>` do styleguide alcançável pelo teclado** (`tabIndex={0}`):
  o painel que rola por dentro do `.ms-app-shell` não rolava pelo
  teclado nas stories sem nada focável (`scrollable-region-focusable`
  do `axe-core`, herdada da v1.3). A receita de layout de SPA em
  [`docs/componentes.md`](docs/componentes.md) passa a trazer o mesmo
  `tabIndex`.

## [1.9.0] — 2026-10-16

### Adicionado

- **`Mascote`** (`src/components/Mascote.tsx`, sem `"use client"`): o
  rosto da marca em quatro expressões (`expressao`: `piscando`,
  `procurando`, `confuso`, `pensando`), com `size` e `label` (sem ele,
  decorativo). Olho, pupila e sorriso são as paths da logo; cada
  expressão tem animação própria nos gestos, parada sob
  `prefers-reduced-motion`.
  As paths do rosto passam a morar em `face-paths.ts`, compartilhadas
  com o `Loader`. Decisão de cores em D5, `docs/decisoes.md`.
  54 componentes (era 53).
- **`EmptyState`** (`src/components/EmptyState.tsx`, sem `"use client"`):
  ilustração (padrão: `Mascote` `procurando`; aceita qualquer
  `ReactNode`), `title`, `description`, `action` e `compact`. Assenta ao
  entrar. Passa a ser o vazio da `Table` e da `Gallery` (`emptyState`,
  prop nova na `Gallery`: texto vira o título; outro nó entra como veio)
  e do histórico de alertas (`compact`). Na `Gallery`, um filtro sem
  itens mostrava a grade vazia, sem aviso. 55 componentes (era 54).
- **`Tooltip`** (`src/components/Tooltip.tsx`, sem `"use client"`):
  `<Tooltip content>` em volta de um gatilho — a forma em componente do
  `data-tip`, com o mesmo renderizador do `TooltipProvider` (posição,
  foco por teclado, `aria-describedby`); pede o Provider acima na
  árvore. O wrapper não tem caixa (`display: contents`). O `data-tip`
  continua igual. 56 componentes (era 55).
- **`Prose`** (`src/components/Prose.tsx`, sem `"use client"`): texto
  corrido já em HTML — o que sai de um conversor de markdown — com o
  ritmo vertical e a tipografia do sistema (títulos, parágrafos, listas
  com marcador, links em `--color-accent-text`, código em `--font-mono`,
  citações, divisor). Recebe `html` ou `children`. Não converte nem
  sanitiza. Token novo `--line-height-prose` (1.6). 57 componentes
  (era 56).
- **`--gradient-active`** (`src/styles/tokens.css`): o gradiente da logo
  como sinal de ativo/selecionado, e só isso. Paradas `-500` no
  escuro/Darker; `accent-700`/`pink-600`/`orange-600` no claro, todas
  ≥3:1 sobre fundo e vidro. Aplicado no indicador das `Tabs`, no ponto
  ativo do `StepIndicator`, no `Switch` ligado (antes o tom "soft" do
  accent) e, como anel, no item atual de `Navbar`/`Sidebar`/`Dock`.
- **Gradiente de ativo também no contorno de Checkbox/Radio marcados**
  e do polegar do `Switch` ligado (preenchimento em `--color-text`, marca
  do Checkbox na cor do fundo; o polegar mantém `--color-thumb`),
  **na borda dos
  campos de texto focados** (Input, Textarea, Combobox, gatilho do Select,
  que também conta com a lista aberta; única exceção ao anel de foco
  sólido) **e no rótulo da opção selecionada** do Select/Combobox e do
  item marcado do DropdownMenu, com `--gradient-active-text` (≥4.5:1).
  O rótulo da opção agora fica num `<span class="ms-listbox__label">` e o
  conteúdo do item do DropdownMenu num `<span class="ms-dropdown-menu__text">`.
  Decisão em D3, `docs/decisoes.md`.
- **Item atual de `Sidebar` e `Dock` sem o azul**: o texto ciano sobre o
  fundo `--color-accent-soft` vira vidro branco (`--color-surface`) com
  texto normal e o anel no gradiente, igual ao link ativo da `Navbar`.
  No claro, os três usam `--color-surface-selected` (marfim a 90%) e
  `--shadow-selected`, para o item não sumir sobre o painel.
- **`Card` ganha `selected`**: anel no gradiente de ativo e
  `aria-current="true"`.
- **`Navbar`: link atual com `aria-current="location"`**. Antes só a
  classe marcava o estado. `LinkRenderProps` ganha o campo
  `"aria-current"`; um `renderLink` próprio deve repassá-lo.

### Alterado

- **Componentes nos gestos de movimento** (`src/styles/components.css`):
  tudo que entra assenta (`--motion-assentar-*`, 0.3s com overshoot) e
  tudo que sai recolhe (`--motion-recolher-*`, 0.15s, sem overshoot):
  Modal/StepModal, toast, histórico de alertas, Drawer, menu da Navbar,
  Popover, DropdownMenu, lista do Select/Combobox, Tooltip, Accordion e
  Gallery. Antes, o Accordion e o Drawer fechavam com overshoot, e o
  Modal/toast saíam com `ease`. Cliques (seta do Accordion, hambúrguer ⇄ X, polegar do
  `Switch`/`ThemeSwitch`, Checkbox/Radio, seta do Select, indicador das
  `Tabs`, bullets do Carousel e pontos do `StepIndicator`) usam o pulso;
  Marquee e a onda do Loader usam a curva da deriva. As media queries de
  `prefers-reduced-motion` que só encurtavam essas durações saíram: o
  token já encolhe para 0.01s.
- **Gallery, contorno reativo e Carousel** (D2 em `docs/decisoes.md`):
  ao trocar de filtro, ordem ou página, os itens da `Gallery` recolhem
  antes de os novos assentarem (antes sumiam na hora). O hover reativo
  (`.ms-hover-edge`, item da `Gallery`, bolinhas do gráfico de linhas,
  fatias da pizza) cresce assentando e volta recolhendo, sem o overshoot
  que o encolhia além do tamanho original. O trilho do `Carousel` passa
  ao par espacial (`--transition-spatial`/`--ease-spatial`, sem
  overshoot) e para de animar sob `prefers-reduced-motion`.
- **Popover, DropdownMenu, Select/Combobox e histórico de alertas
  ganham saída animada**: antes sumiam na hora; agora ficam montados
  pelo tempo do recolher (hook interno `usePresence`), sem interação
  nesse intervalo.
- **Peso de exibição** (`src/styles/tokens.css`): `--font-weight-display`
  (600) e `--text-display` (48px), mais o utilitário `.ms-display`. Só
  para números grandes e título de herói: o valor do `StatTile` sobe de
  32px/500 para 48px/600, e o título do `Hero` passa a ir até 48px/600
  (era até 56px/500; o mínimo de 32px no mobile segue igual). Num tile
  estreito, o número do `StatTile` encolhe até 32px (container query).
  O `ProgressRing` fica de fora: 48px não cabe dentro do anel.

### Corrigido

- **`HeroHighlight`** passa do gradiente ciano (`accent-300` →
  `accent-500`) para o gradiente da logo em texto
  (`--gradient-active-text`). No claro o ciano dava 1.3–2.0:1 sobre o
  creme; agora fica ≥4.5:1 nos três temas. Única exceção decorativa ao
  gradiente de ativo (D4 em `docs/decisoes.md`). Quem
  carrega a Outfit precisa incluir o peso 600 na URL do Google Fonts
  (`wght@400;500;600`); sem ele, o navegador sintetiza o negrito.
- **`TooltipProvider`** sobrescrevia o `aria-describedby` do elemento
  focado e, ao sair, apagava o atributo inteiro — junto com o que quem
  consome tivesse posto ali. Agora o id do tooltip entra somado aos que
  já existiam e sai sozinho.
- **Badge do `PricingCard`** usava `#fff` cru sobre `--color-accent`:
  2.5:1, abaixo do AA. Passa para `--color-on-accent`, o mesmo par do
  `Button variant="solid"`. Achado pelo `axe-core` na auditoria da v1.9.
- **Corpo do `Accordion`** (`role="region"`) não tinha nome; com vários
  itens, o leitor de tela via regiões iguais. Agora é rotulado pelo
  próprio cabeçalho (`aria-labelledby`).
- **`DropdownMenu` com `triggerOn="context"`** punha `aria-haspopup`/
  `aria-expanded` no gatilho, em geral uma área sem papel (um `Card`, uma
  linha) — ARIA inválido. Esses atributos ficam só no modo `"click"`.

## [1.8.0] — 2026-10-16

### Alterado

- **Tema claro em off-white quente** (`.light` em `src/styles/tokens.css`):
  o branco puro com texto preto (21:1) estourava em telas grandes.
  Fundo creme (`--bg-base` `#ebe4d8`), vidro marfim
  (`rgba(245, 240, 230, 0.6)`), texto marrom quase preto (`#26201a`,
  13.6:1 sobre o vidro), bordas (55%, 3.45:1 — acima do mínimo de 3:1
  para controles) e muted no mesmo tom, polegar do switch
  marfim, chevron do Select e véus do Modal/Drawer acompanhando o fundo.
  Os glows seguem o degradê da logo.

- **Accent do claro: laranja lavado** (`--color-accent: #e19460`, o
  laranja da logo menos saturado): o ciano ficava frio e apagado sobre o
  creme. Como preenchimento passa com o `--color-on-accent` (7.0:1);
  como texto/foco fica ~2:1, o mesmo patamar do ciano antes. As escalas
  `--color-accent-*` seguem ciano.

### Adicionado

- **`--color-accent-text`** (`src/styles/tokens.css`): o accent como
  texto e anel de foco, com AA em todos os temas — `--color-accent-400`
  no escuro/Darker (5.12:1 sobre o `--color-accent-soft`; o ciano puro
  ficava em 4.16) e `#984a16` no claro (≥4.58:1; o laranja lavado ficava
  em ~2:1). Os nove usos de `--color-accent` como `color`/`outline` em
  `components.css` (foco, opção selecionada do Select, item ativo de
  Sidebar/Dock, rodapé, Grafo3D) passam a usá-lo; preenchimentos e
  bordas seguem no `--color-accent`.

- **`ThemeMenu`** (`src/components/theme.tsx`): seletor dos três temas
  (escuro, Darker, claro) num `DropdownMenu`, aberto por um botão
  redondo igual ao do `NotificationBell`, com o ícone do tema ativo.
  Substitui o `ThemeSwitch` na navbar do styleguide e do exemplo; o
  `ThemeSwitch` continua exportado, só com claro/escuro. 53 componentes
  (era 52).

- **`DropdownMenuItem checked`**: item de escolha única
  (`role="menuitemradio"` + `aria-checked`), com check na opção
  marcada.

- **`Theme` com `"darker"`**: o `ThemeProvider` aplica a classe `darker`
  com `setTheme("darker")` e a persiste com `persist`; `toggle` segue
  alternando claro/escuro (do Darker, vai para o claro).

- **Tema Darker** (`.darker` em `src/styles/tokens.css`): variante do
  escuro com vidro escuro (`--color-surface` = `--bg-base` a 60%) e hover
  sutil (branco a 15%), para uso noturno. Texto, bordas, marca, glows e
  fundo são os do escuro. Ativada pela classe `darker` no `<html>`. Nasceu no rice do
  desktop do autor.

- **Tokens de sombra e opacidade** (`src/styles/tokens.css`):
  `--shadow-xs`…`--shadow-xl` (escala de elevação), `--shadow-glow-accent`,
  `--shadow-drop`, `--opacity-disabled`, `--opacity-dimmed`, `--border-width` (1px)
  e `--focus-width` (2px).

- **`--font-mono`** (`src/styles/tokens.css`): Maple Mono, com fallback
  para a mono do sistema. A lib não carrega a fonte (nenhum componente
  usa ainda); quem precisa importa `@fontsource/maple-mono`. Escolhida
  ao lado da Outfit pelo "a" de um andar, pelas formas arredondadas e
  pelas ligaduras. Os valores
  estavam soltos em `components.css` e agora são consumidos de lá por
  `var()`, sem mudança visual. Motivo: consumidores fora do React (o rice
  do desktop do autor: Hyprland e Noctalia) precisam ler sombras e
  opacidades da mesma fonte que as cores.

- **`Select` e `Combobox` abrem a lista para cima** quando ela não cabe
  embaixo do campo e há mais espaço em cima (`.ms-listbox--above`). Campo
  no pé da tela, como a caixa de mensagem de um chat, não empurra mais a
  página para rolar. Consumidor real: a Conversa do Ambiente Mothership.

- **`Grafo3D`** e **`layoutForca3D`** (`src/3d/`, ponto de entrada novo
  `mothership-ds/3d`): primeiro componente 3D do pacote. Grafo de nós e
  arestas genéricos com o movimento do `LivingBackground` — deriva lenta,
  parallax amortecido pelo ponteiro, viagem da câmera até o nó selecionado
  com `--transition-spatial`/`--ease-spatial` (a curva CSS é avaliada no
  JS). Hover e seleção acendem o nó e os vizinhos e esmaecem o resto rumo
  a `--bg-base`; névoa na cor do fundo dá profundidade. Grupos coloridos
  por slot: 1–4 são `--chart-*`, 5–8 as cores de marca. Cores relidas dos
  tokens quando o tema troca. Os nós respiram devagar em volta do lugar,
  cada um no seu tempo, e as ligações esticam junto: o grafo se lê como
  uma malha viva. A legenda é filtro: cada cor clicada reúne o grupo num
  anel de frente para a câmera, no centro; grupos a mais viram anéis
  concêntricos por fora, e o resto se afasta e esmaece, com as ligações
  para o anel ainda visíveis (`filtro`/`aoFiltrar`, controlado ou não).
  Rótulos são HTML sobre o canvas, com os fracos escondidos quando
  colidiriam. Lista de botões escondida (aparece
  no foco) e anúncio `aria-live` para teclado e leitor de tela;
  `prefers-reduced-motion` desliga deriva e parallax e torna a viagem
  instantânea. Seleção controlada ou não. A viagem até um nó gira a
  câmera para chegar pelo lado de fora do grafo, com as outras notas
  atrás dele. O `destaque` vence a seleção (um caminho destacado continua
  aceso com a câmera no destino); o hover vence os dois. Layout por forças
  em 3D determinístico, puro e testado
  (`npm test`, `node --test`), com puxão ao centro forte o bastante para
  as notas sem ligação ficarem em volta do núcleo em vez de espremê-lo
  (medido num vault real com 29% de órfãs).
  three.js puro, sem react-three-fiber (r3f 8 é só React 18, r3f 9 só
  React 19). `three` entra como `peerDependency` **opcional**: o pacote
  principal segue sem dependência de runtime. 52 componentes (era 51).

- **`Dock`** (`src/components/navbar.tsx`): navegação principal de app —
  coluna de ícones à esquerda, em pílula como a Navbar, que expande para
  ícone + título no formato do `Sidebar` (`--radius-md`, `--space-4`,
  240px); largura, raio e respiro animam com o par espacial
  (`--transition-spatial`/`--ease-spatial`). Recolhida, o rótulo continua
  no DOM como nome acessível e o tooltip (`data-tip`) assume a leitura
  visual. Item ativo com o destaque do `Sidebar` e `aria-current="page"`;
  contador opcional por item. Abaixo de 720px a coluna vira um único
  botão, no lugar onde o host a pôs, que abre a navegação expandida no
  `Drawer` — uma barra de ícones não comporta os destinos de um app.
  Ícones chegam como `ReactNode` (Lucide continua só recomendação).
  Consumidor real: a interface do sistema agêntico do autor. 51
  componentes (era 50).

- **Capítulo `docs/3d.md`**: o vocabulário 3D que emergiu de um consumidor
  real (Mothership Agency, react-three-fiber) usando os tokens deste
  pacote numa cena 3D (escrito antes do `Grafo3D` existir).
  Cobre níveis de superfície (derivar `--bg-base` por mistura com branco
  em espaço **linear**, ao contrário da composição em sRGB da regra 2D),
  o rig de iluminação (cor de marca como temperatura ambiente, sempre em
  intensidade baixa, nunca como sinal de estado), o mapeamento
  estado→token (par 3D do `tone` de `<Badge>`) e a regra irmã dos
  `--color-on-*`: em 3D a legibilidade do sinal de estado não vem de um
  par de cores, vem de um teto de valor nas superfícies passivas somado à
  diferença de tipo de material (`MeshBasicMaterial` imune à luz da cena
  vs. `MeshLambertMaterial` em tudo mais).

- **Par de token espacial**: `--transition-spatial` (0.45s) e
  `--ease-spatial` (`cubic-bezier(0.34, 1, 0.64, 1)`). `--ease-bounce`
  existente tem overshoot (`y1: 1.56`) — bom pra botão/accordion, ruim pra
  algo grande e lento entrando em cena (painel largo, ponto de vista de
  câmera): ultrapassar o alvo e voltar lê como solavanco, não como charme.
  `--ease-spatial` é a mesma família (mesmos `x1`/`x2` de `--ease-bounce`,
  mesma cadência de partida/chegada), só com `y1` travado em 1. Pedido de
  um consumidor real (Mothership Agency) pra transição de câmera/painel
  numa cena 3D.

- **`Gallery` ganha destaque de item novo e ordenação por data**
  (`GalleryItem.addedAt`): dentro de `newDays` (padrão 30, ~1 mês) o
  item ganha o contorno reativo — que hoje só aparecia no hover — fixo,
  mais um `<Badge>` (`newLabel`, padrão `"Novo"`); a cor de ambos vem
  das categorias do próprio item (`colorsFor`), não de um tom fixo do
  sistema — mesma ideia do `highlighted`/badge do `PricingCard`, mas
  sem depender de `--color-accent`. O badge reaproveita
  `ms-badge--{tone}` (fundo suave + borda) em vez de preenchimento
  sólido porque a cor da categoria é arbitrária e não dá pra garantir
  contraste de texto branco fixo contra qualquer uma delas. `sortable`
  liga um botão asc/desc ao lado dos filtros — mesmo ícone/alternância
  da `Table` (`SortIcon`, agora exportado) — que ordena por `addedAt`;
  `defaultSortOrder` escolhe o estado inicial (padrão `"desc"`, mais
  novos primeiro). Itens sem `addedAt` contam como a data mais antiga
  possível e preservam a ordem original entre si (sort estável) — um
  catálogo existente sem datas não embaralha ao ligar `sortable`.
  Aditivo nas duas frentes: sem `addedAt`/`sortable`, `Gallery` se
  comporta exatamente como antes.

- **`Modal` ganha `size="full"`**: preenche quase toda a viewport
  (`width`/`height: 100%`, diferente das outras variantes que só
  encolhem pro tamanho do próprio conteúdo). Pensado pra conteúdo que
  precisa de espaço de verdade — um PDF ou imagem embutidos, por
  exemplo — não pra diálogo de texto comum. `.ms-modal__body` já era
  `flex: 1`; com `full`, um `<iframe>`/imagem com `height: 100%` dentro
  passa a preencher o espaço disponível de verdade.

- **`Gallery` ganha `onClick` por item** (`GalleryItem.onClick`): vira o
  card num `<button>` (`.ms-gallery__item-trigger`), pensado pra abrir o
  case completo em algo por cima da página (ex.: `Modal`) ao clicar.
  Sem `onClick`, o item continua só visual, como sempre foi — aditivo,
  sem mudança de comportamento pra quem já usa `Gallery`.

### Corrigido

- **`Select` e `Combobox` não são mais cortados por `overflow: hidden`**
  (`src/components/select.tsx`): a lista virou portal no `<body>`,
  posicionada com o clamp horizontal do `Popover` e com a largura do
  campo, na camada 700 (acima do `Modal`). Abre para cima quando não cabe
  embaixo; se não cabe em nenhum lado, vai para o lado com mais espaço e
  encolhe. Clicar na lista (inclusive na barra de rolagem) não tira mais
  o foco do campo, e a opção destacada pelo teclado rola para a vista.
  Um `Select` dentro de um `Popover` não fecha mais o `Popover` ao
  escolher uma opção (`isInOwnedPortal`, em `popover.tsx`).

- **Portais caíam pra fonte/cor padrão do navegador** — `Modal`,
  `StepModal`, `Drawer`, `Popover`, `DropdownMenu`, toasts e
  `TooltipProvider` renderizam via `createPortal(..., document.body)`
  de propósito (ver ARCHITECTURE.md § Portais — evita que um ancestral
  com `transform`/`filter`/`backdrop-filter` vire bloco de contenção de
  `position: fixed`). O problema: `font-family`/`color`/o reset de
  `box-sizing`/margem/lista/scrollbar e o anel de `:focus-visible`
  eram aplicados só na regra `.ms-page`, e um portal em `document.body`
  é *irmão* de `.ms-page`, não descendente — nada disso chegava lá.
  Achado real com um consumidor: o título do `Modal` media
  `font-family: "Times New Roman"` e `color: rgb(0, 0, 0)` no
  navegador, em vez de `Outfit`/branco. Nova classe `.ms-portal-root`
  carrega a mesma folha de `.ms-page` (sem o fundo vivo, que não faz
  sentido numa superfície flutuante) e é aplicada na raiz de cada um
  desses sete componentes — sem mudar onde eles portam, só sem perder
  mais o escopo de estilo ao fazer isso.
- **Contraste de texto sobre superfície sólida de marca** — `Button
  variant="solid"`, `Alert` (6 dos 8 tons) e `Pagination` ativa
  mediam abaixo de 4.5:1 (WCAG AA) com o `--color-on-solid` branco
  fixo (achado real via `axe-core` contra um consumidor). Dois tokens
  novos, `--color-on-accent`/`--color-on-danger` (`#1a1a2e`, mesmo
  valor já usado por `--color-on-highlight`), cobrem accent e danger;
  o ícone do `Alert` usa esse par como padrão, o que também resolve
  success/orange/gray de graça (mesmo `#1a1a2e`, sem token próprio).
  `pink` (único caso sem solução só de token — falha nos dois sentidos
  com o tom -500) teve o fundo do ícone trocado pra `pink-600`
  (escala já existente) com texto branco. `violet` não precisou de
  nada (já media 4.5:1+). Zero mudança visual pra quem já lia o texto
  confortavelmente — só onde o contraste falhava de verdade.
- `Drawer` (mothership-ds/src/components/drawer.tsx): painel fechado
  ganha `visibility: hidden` (com o mesmo truque de delay que o véu de
  fundo já usava) — antes só saía da tela por `transform`, então os
  links de navegação continuavam alcançáveis por Tab mesmo fechado,
  inclusive em telas onde o gatilho que abre o painel nunca aparece.
- `TooltipProvider` reage a foco de teclado, não só a ponteiro
  (mouse/toque): `focusin`/`focusout` somam-se a
  `pointerover`/`pointermove`/`pointerout`, mesmo padrão de delegação
  num listener só na `window`. Achado real de um consumidor
  (valnezJrLP): um `data-tip` num elemento focável (`tabIndex={0}`)
  nunca aparecia navegando por Tab, só passando o mouse — a informação
  ficava invisível pra quem usa teclado. O Provider continua sem
  decidir *se* um elemento é focável (isso é escolha de quem consome);
  só passa a reagir quando já é. Duas correções extras achadas pelo
  `axe-core` na sequência: (1) o `<div role="tooltip">` do portal
  existia sempre no DOM, mesmo vazio — um elemento com esse role sem
  nome acessível viola ARIA independente de estar visível; `role`/`id`
  agora só entram quando há um tooltip ativo de verdade. (2) o caminho
  de foco mostrava o texto visualmente mas nunca ligava o elemento
  focado ao tooltip — `aria-describedby` (`id` estável via `useId`)
  resolve isso, só no caminho de foco (o de ponteiro já é visual pra
  quem enxerga, sem relação com leitor de tela).
- `Gallery` com `itemsPerPage`: trocar de página não repetia o bounce de
  entrada (`ms-gallery-in`, `var(--ease-bounce)`) que os itens já têm ao
  aparecer num filtro — a `key` de cada item era só a posição dentro da
  página (`0..itemsPerPage-1`), então o React reaproveitava os mesmos nós
  do DOM entre páginas em vez de montar novos, e a animação (disparada só
  no mount) nunca rodava de novo. `key` agora inclui a página atual.

## [1.7.0] — 2026-08-06

### Adicionado

- **`Gallery` ganha a prop `itemsPerPage`**: pagina a grade (`StepIndicator`,
  `showCount`, `label="Página"`, mais anterior/próximo) em vez de crescer
  em altura. Sem essa prop, comportamento idêntico ao de antes (grade
  inteira de uma vez). Trocar de filtro ou `itemsPerPage` encolher
  (reflow responsivo) sempre volta pra primeira página; a paginação
  reage à lista já filtrada, não à lista completa. Achado real: um
  consumidor tinha reimplementado uma grade parecida com `Gallery` do
  zero, sem os filtros/badges/cores de categoria, só porque `Gallery`
  não paginava — a paginação nativa resolve isso sem sair do
  componente real.

## [1.6.0] — 2026-08-06

### Adicionado

- **`StepIndicator`**: indicador de progresso por etapas/páginas — pontos
  em pill (mesma linguagem dos bullets do `Carousel`) ou texto "Etapa X
  de Y" (`showCount`). Extraído do rodapé do `StepModal`, que agora só
  consome este componente (mesmo comportamento visual, zero mudança de
  API do `StepModal`) — pensado pra também servir navegação paginada
  fora de um modal (ex.: uma galeria de projetos paginada em vez de
  scroll).

### Alterado

- CSS do indicador de etapas renomeado de `.ms-modal__dots`/`__dot`/
  `__count` (implícito do `StepModal`) pra `.ms-step-indicator__dots`/
  `__dot`/`__count` (agora do `StepIndicator`, componente próprio). Sem
  mudança visual — é troca de nome de classe interna, não de API pública.

## [1.5.0] — 2026-08-05

### Adicionado

- **`Splash` ganha a prop `instant`**: pula a sequência de revelação e
  mostra a composição final assim que `ready`, sem repetir a animação de
  entrada. Pensada para uma instância desmontada e remontada mais de uma
  vez na mesma sessão (ex.: um consumidor que troca de seção e volta) —
  sem isso, o CSS reage à classe `.ms-splash--ready` aparecendo num
  elemento novo como se fosse a primeira revelação, tocando tudo de novo
  do zero.
- **`LogoMark` ganha a prop `part`** (`"full" | "word"`, padrão `"full"`):
  `"word"` renderiza só o nome (letras + rosto no "o"), com `viewBox`
  recortado (sem a área do dirigível) e já assentado numa posição final
  estática via `.ms-logo--word`, sem depender de estar dentro de uma
  `Splash` com `.ms-splash--ready`. Pensado para uso solto como marca em
  outros contextos (ex.: navbar).

## [1.4.0] — 2026-08-05

### Adicionado

- **Tokens novos para indicadores pequenos (bullets, pontos de etapa,
  marcadores) e texto sobre superfície sólida** (`tokens.css`), fechando
  lacunas achadas numa auditoria: `--dot-size`/`--dot-size-active` (8px/
  24px — bullets do `Carousel` e pontos do `StepModal` repetiam esses
  números soltos em dois lugares); `--indicator-size` (10px — swatch do
  `Legend` e dot do histórico de alertas, mesma repetição); `--color-on-
  solid` (branco fixo pra texto/ícone sobre fundo saturado — `Button`
  variant="solid", página ativa da `Pagination`, badge do sino da
  `Navbar`, ícone do `Alert`, placeholder do `Avatar`, controles do
  `Carousel` em modo foto — cinco lugares que já repetiam `#ffffff` cru,
  dois deles com um comentário no código admitindo a lacuna há tempo);
  `--color-on-highlight` (`#1a1a2e` — a única exceção, o tom `highlight`
  é claro demais pro branco); e `--carousel-overlay-*` (border/surface/
  surface-hover/dot/scrim — a família de valores translúcidos brancos/
  pretos que as setas, bullets e legenda do `Carousel` em modo foto já
  usavam, cada um com seu próprio número mágico). Nenhuma mudança
  visual — só a mesma aparência de sempre, agora com um nome.
- **`Modal`: prop `headerExtra`** (`ModalProps`) — conteúdo extra no
  cabeçalho, mesma linha do título (ícones, badges, ações rápidas),
  empurrado à direita pelo `flex: 1` do título, antes do botão de
  fechar. Existe porque `.ms-modal__body` tem `overflow-x: hidden`
  (reserva de espaço pra barra de rolagem) — qualquer coisa com hover
  que cresce além da própria caixa (`HoverEdge`, por exemplo) ficava
  cortada se entrasse ali junto com `children`; `.ms-modal__head` não
  tem essa restrição. Achado real, relatado por um consumidor da lib
  (landing page própria, usando ícones com `HoverEdge` num cabeçalho de
  Modal). Nova classe `.ms-modal__head-extra` (`flex-shrink: 0`).

### Corrigido

- **Links de exemplo do styleguide navegavam pra fora da story ao
  clicar** (`styleguide/stories.tsx`, 24 ocorrências): botões/links de
  demonstração sem função real (CTAs do Hero, grid de Botões, Lista de
  links, Ícones, ações dentro de Card, CTAs do Card de precificação,
  gatilho do Popover, crédito do Rodapé) usavam `href="#"` — como o
  styleguide inteiro roteia por hash (`useHashRoute`), isso navegava
  pra `ids[0]` (a primeira story) e desmontava a story atual, quebrando
  o fluxo de quem estava só testando o componente. Trocado por
  `href="#<id-da-própria-story>"` em cada ocorrência — autorreferente,
  então o clique não muda o hash (já é o mesmo) e a story não desmonta.
  Mesmo achado, mesma correção, em `examples/next-app/app/page.tsx`
  (crédito do rodapé, `href="#contato"` — a `Footer` ali já tem
  `id="contato"`). O gatilho do `Popover` (linha 1295) já estava
  protegido por `e.preventDefault()` interno do componente, mas ganhou
  a troca por consistência mesmo assim.

## [1.3.0] — 2026-08-05

### Adicionado

- **`Sidebar`: prop `active`** — controla o item ativo de fora (ex.
  roteamento próprio) em vez de detectar por scroll. Passando `active`,
  o `spy` interno desliga por completo (nem os listeners de scroll são
  anexados). Ganhou também um efeito próprio: sempre que o item ativo
  muda, ele rola pra dentro da área visível da lista da própria
  Sidebar (`scrollIntoView`) — útil se a lista for mais alta que o
  espaço disponível, em qualquer um dos dois modos (`spy` ou `active`).
- **Suporte nativo a layout de SPA (uma seção por vez)**: o padrão que
  o styleguide passou a usar para resolver a própria performance virou
  API real da biblioteca, não só código interno.
  - **`useHashRoute`** (hook) — sincroniza "qual view está ativa" com
    o hash da URL, sem lib de rotas. `resolve` customiza como um hash
    sem correspondência exata resolve pra um id válido (padrão: cai no
    primeiro). Retorna `[id, navigate]`; voltar/avançar do navegador
    funcionam de graça. Lido só depois da hidratação, mesma cautela do
    `ThemeProvider` com `localStorage` — nunca diverge do HTML do
    servidor em apps com SSR.
  - **`Sidebar`: prop `variant`** (`"sticky"` padrão, `"fill"` novo) —
    `fill` estica 100% da altura do pai em vez de `position: sticky`,
    pra uso dentro de um app-shell de altura fixa.
  - **`.ms-app-shell`** (utilitário CSS) — trava a viewport
    (`height: 100vh`, `overflow: hidden`, coluna flex); opt-in, sem
    ele uma página comum rola inteira como sempre.
  - Receita completa em docs/componentes.md § Layout de SPA; raciocínio
    em ARCHITECTURE.md § Performance do styleguide.
- **`Stack`, `Divider`, `Skeleton`** — primeiro lote do caminho até a
  v1.5 (37 → 55 componentes planejados; ver categorias reorganizadas
  logo abaixo). Os três em `src/components/primitives.tsx`, sem
  `"use client"` (puramente apresentacionais):
  - **`Stack`** — wrapper fino de flexbox (`direction`, `gap` na escala
    `--space-1..7`, `align`, `wrap`), sem lógica própria.
  - **`Divider`** — linha divisória; `orientation="vertical"` renderiza
    `<div role="separator" aria-orientation="vertical">` em vez de
    `<hr>` (que é sempre horizontal por especificação).
  - **`Skeleton`** — placeholder de carregamento; o pulso anima entre
    `--color-surface`/`--color-surface-hover` (nenhuma cor nova),
    `aria-hidden="true"` por padrão, e desliga sob
    `prefers-reduced-motion: reduce`.
  - 40 componentes (era 37).
- **`Checkbox`, `Radio`, `Switch`** — segundo lote do caminho até a
  v1.5, o trio de formulário. Também em `src/components/primitives.tsx`,
  sem `"use client"`:
  - **`Checkbox`**, **`Radio`** — `<input>` nativo com `appearance:
    none`, mantêm foco/teclado/participação em `<form>` de graça; só o
    visual (check/ponto) é customizado via `::after`. Agrupamento de
    `Radio` é nativo (mesmo `name`), sem `RadioGroup` — não havia
    necessidade concreta pra mais um componente.
  - **`Switch`** — `<input type="checkbox" role="switch">`, participa
    de `<form>` normalmente. Deliberadamente **não** compartilha
    implementação com `ThemeSwitch`: os dois parecem o mesmo controle,
    mas `ThemeSwitch` anima a troca de ícone sol/lua presa à classe
    `.light` do tema, não a um `checked` local — generalizar os dois
    sob um primitivo comum exigiria reescrever `ThemeSwitch` por dentro
    sem necessidade real hoje (YAGNI); revisitar se um caso de uso
    concreto pedir isso no futuro. Visual revisado depois de nascer,
    pra bater com o `ThemeSwitch` de verdade: polegar **maior** que o
    trilho (`--switch-thumb` 32px sobre `--switch-height` 24px, mesmos
    tokens), protruindo acima/abaixo. Ativo continua vidro — ganha só
    o tom "soft" de marca (`--color-accent-soft` + borda
    `--color-accent`, mesmo par de `Badge tone="accent"`), nunca uma
    cor sólida. Achado ao testar: sem sombra própria, o polegar branco
    ficava quase invisível no tema claro sobre o tom "soft" quase
    branco — `ThemeSwitch` escapa disso porque o ícone sol/lua desenhado
    nele garante contraste; este polegar é liso, então precisou de
    `box-shadow` sutil.
  - 43 componentes (era 40).
- **`Select`** — terceiro lote do caminho até a v1.5, revisado depois
  de nascer: a primeira versão era um `<select>` nativo estilizado
  (limitado à lista aberta ser renderizada pelo navegador/SO, fora do
  alcance de CSS/vidro); decidimos abandonar o nativo em favor de uma
  **listbox própria**, já que ele não deixava nenhum primitive
  reaproveitável pro `Combobox` de qualquer forma. Passa a viver em
  `src/components/select.tsx` (arquivo novo, com `"use client"` — tem
  estado próprio). Gatilho `<button role="combobox">` estilizado como
  `.ms-input`; popup `<ul role="listbox">` de vidro, animação de
  entrada com `--ease-bounce`. Teclado completo: `↓`/`↑` (pulando
  `disabled`, com wrap), `Enter`/`Espaço`, `Esc`, `Home`/`End`. Clique
  fora fecha. Aceita `value`/`defaultValue`/`onChange` (controlado ou
  não) e `name` (monta um `<input type="hidden">` pra `<form>` nativo).
  **Limite conhecido e deliberado**: o popup é `position: absolute` num
  wrapper `position: relative`, não portal no `<body>` como Modal/menu
  da Navbar — pode cortar dentro de um ancestral com `overflow:
  hidden`. Decisão consciente: o mecanismo de posicionamento robusto
  (portal + cálculo de posição) é o que o `Popover` (próximo do
  roadmap) resolve de vez; construir isso agora antecipraria trabalho
  que muda de qualquer forma quando ele existir.
- **`Combobox`** — quarto lote, construído junto com a revisão do
  `Select` acima. Também em `src/components/select.tsx`, reaproveitando
  a mesma listbox/navegação por teclado (`OptionList`,
  `useOutsideClick`, `nextEnabledIndex` — internos, não exportados); a
  diferença é o gatilho (`<input>` editável, não um `<button>`
  só-escolha) e um filtro por texto (`filter`, com padrão de "contém,
  sem diferenciar maiúsculas") aplicado conforme o usuário digita.
  Mesmo limite de popup não-portal do `Select`. 45 componentes (era 43).
- **`Tabs`, `Pagination`** — quinto lote do caminho até a v1.5.
  - **`Tabs`** (`src/components/disclosure.tsx`) — só a aba ativa fica
    montada (desmonta as demais, como o `Accordion`). Indicador (pill
    fina) desliza até a aba ativa com `--ease-bounce`, medido de
    verdade via DOM (`offsetLeft`/`offsetWidth` do botão, não um
    truque de CSS puro) — recalcula em `resize`. `←`/`→` navegam **e
    já ativam** a aba (ativação automática), pulando `disabled` com
    wrap; `Home`/`End` pulam pro primeiro/último item habilitado.
    Lista de abas rola horizontalmente quando não cabe — achado real
    ao testar em mobile: sem `overflow-x`, as abas simplesmente
    cortavam na borda da tela em vez de rolar.
  - **`Pagination`** (`src/components/primitives.tsx`, sem
    `"use client"` — 100% controlado, sem estado próprio) — sempre
    mostra primeira e última página; distância grande vira `…`.
    Página atual leva `aria-current="page"` (mesmo padrão já usado em
    `Breadcrumbs`/`StepModal`). Setas de anterior/próxima desabilitam
    nas pontas.
  - 47 componentes (era 45).
- **`Popover`** (`src/components/popover.tsx`, arquivo novo, com
  `"use client"`) — sexto lote. Primeiro componente com posicionamento
  flutuante de verdade: portal no `<body>` + `position: fixed`,
  posição calculada via `getBoundingClientRect` do gatilho e do
  conteúdo (vira de lado se não couber, nunca sai da viewport
  horizontalmente) — o mecanismo que `Select`/`Combobox` deixaram pra
  depois, deliberadamente. "Popover leve" (ver ACCESSIBILITY.md §
  Modal): clique fora ou `Esc` fecham, `Esc` devolve o foco ao gatilho,
  mas **não** prende o foco dentro como o `Modal` — por isso sem
  `role="dialog"`, que implicaria um contrato que ele não cumpre.
  `trigger` aceita qualquer `ReactElement` sem precisar encaminhar
  `ref` (`Button`/`ButtonLink`/`IconButton` não encaminham hoje) — a
  medição de posição usa um wrapper interno em vez de clonar `ref` no
  gatilho. Clique no gatilho sempre previne a ação padrão dele —
  achado real ao testar: a primeira versão da story usava
  `<ButtonLink href="#">` como gatilho, e sem `preventDefault` o
  clique também navegava de verdade (o styleguide inteiro roteia por
  hash, então mudar pra `#` desmontava a story inteira);
  `IconButton`/`ButtonLink` sempre renderizam `<a>`
  (`IconButton` exige `href`), então esse risco existe pra qualquer
  gatilho desse tipo, não só no exemplo. z-index 700, mesma camada do
  `TooltipProvider` (ver ARCHITECTURE.md § escala de z-index — os dois
  são overlays leves flutuantes, não bloqueiam a página como o Modal).
  48 componentes (era 47).
- **`Drawer`** (`src/components/drawer.tsx`, arquivo novo, com
  `"use client"`) — sétimo lote. Extração, não componente do zero: a
  gaveta mobile que o `Sidebar` já tinha desde a v1.2.2 virou primitivo
  compartilhado (`open`/`onClose`, `side="left"|"right"`,
  `backdropClassName`), e o `Sidebar` foi reescrito por dentro pra
  consumi-lo — comportamento idêntico ao de antes, verificado via
  Playwright (abrir/fechar pelo botão, véu, `Esc`, clique num link,
  resize pra desktop). Mesma mecânica "leve" do `Popover`: sem focus
  trap, sem travar o scroll do fundo, portal no `<body>` só depois de
  montar. 49 componentes (era 48).
- **`DropdownMenu`** (`src/components/dropdown-menu.tsx`, arquivo
  novo, com `"use client"`) — oitavo lote. Absorve o que seria um
  `ContextMenu` separado via `triggerOn="click"|"context"`: mesmo
  menu, só muda o gesto que abre (clique vs. clique direito) e a
  origem do posicionamento — no modo `"context"`, um gatilho virtual
  de tamanho zero no ponto do clique reaproveita o `computePosition`
  do `Popover` (agora exportado), sem duplicar a conta de flip/clamp.
  Diferente da listbox do `Select`/`Combobox` (`aria-activedescendant`,
  foco fica no gatilho), o foco real percorre os itens
  (`role="menu"`/`"menuitem"`, `↑`/`↓`/`Home`/`End`/`Esc`) — padrão
  WAI-ARIA de menu. `DropdownMenuItem` aceita `tone="danger"` (mesma
  cor de `Badge tone="danger"`) e `disabled`; `DropdownMenuLabel` e
  `DropdownMenuDivider` são só apresentação. Bug achado ao testar: o
  painel nasce com `visibility: hidden` até a posição ser calculada
  (mesmo truque do `Popover`, pra não piscar no lugar errado) —
  `.focus()` num elemento oculto é um no-op silencioso, então o efeito
  que foca o primeiro item ao abrir precisou esperar a posição estar
  pronta, não só o menu estar "aberto". 50 componentes (era 49).
- **Versão no rodapé do styleguide** (`styleguide/App.tsx`): lê
  `version` direto do `package.json` (`import { version } from
  "../package.json"` — esbuild importa JSON nativamente, sem loader
  extra) em vez de string solta, pra nunca ficar dessincronizada de
  release em release. Só o styleguide, não é API nova da biblioteca.

### Corrigido

- **`Tabs`: scroll vertical indevido em `.ms-tabs__list`** —
  `overflow-x: auto` sozinho faz o navegador computar `overflow-y`
  como `auto` também, por especificação (mesmo caso do `<main>` do
  styleguide, já documentado); o indicador (`bottom: -1px`) bastava
  pra abrir esse scroll vertical. Corrigido com `overflow-y: hidden`
  explícito.
- **Hover do polegar tokenizado (`--switch-hover-ring`, novo em
  `tokens.css`) e replicado no `Switch` genérico**: o anel de hover
  (8px, `var(--color-border)`) existia só no `ThemeSwitch`
  (`.ms-switch__thumb:hover`); `Switch` (`.ms-toggle`) não tinha
  nenhum hover. Como o polegar do `Switch` é um `::after` (não
  elemento próprio), o hover é escutado no `<input>` e aplicado no
  pseudo-elemento (`.ms-toggle:hover:not(:disabled)::after`).
- **`Input`/`Textarea`: dois anéis de contorno no foco em vez de um
  só** — a regra global de foco (`.ms-page :is(...):focus-visible`)
  sempre venceu qualquer coisa declarada em `.ms-input:focus`: o
  `:is()` da regra global carrega a especificidade do argumento mais
  específico da lista (`[tabindex]`, um seletor de atributo), então
  ela bate `.ms-input:focus` mesmo com `outline: none` declarado ali.
  Duas tentativas incompletas antes da correção final: primeiro
  `.ms-input:focus` somava `border-color` accent com
  `box-shadow: 0 0 0 1px accent` por cima do outline global (três
  camadas); removido o `box-shadow`, sobrou `border-color` accent
  ainda por cima do outline global (dois anéis concêntricos com um
  vão visível entre eles — o `outline-offset` da regra global). A
  correção real: `.ms-input:focus` não mexe mais em `border-color`
  nem `box-shadow`, só cancela o anel nativo do navegador
  (`outline: none`) — o anel accent visível é só o da regra global,
  um só. Ganhou também hover (`background: var(--color-surface-hover)`,
  mesmo padrão de botão/link/item de navegação do resto do sistema).

- **Cache indefinido do styleguide publicado**: `styleguide.js`/
  `styleguide.css` eram gerados sempre com o mesmo nome de arquivo —
  depois de um deploy novo, o navegador e a CDN do GitHub Pages
  (`cache-control: max-age=600`) podiam continuar servindo a versão
  antiga por até 10 minutos, sem nenhum sinal de que o conteúdo tinha
  mudado (achado real: as stories de `Checkbox`/`Radio`/`Switch`/
  `Stack`/`Divider`/`Skeleton` já publicadas não apareciam pra quem
  tinha visitado o styleguide antes). `styleguide/build.mjs` agora
  nomeia a build de produção com hash de conteúdo
  (`styleguide-<hash>.js`/`.css`, via `entryNames` do esbuild) — um
  deploy novo sempre gera um nome de arquivo novo, então não tem cache
  velho pra servir. `index.html` é escrito depois do build, apontando
  pros nomes reais (lidos do `metafile` do esbuild). `dist/` é limpo
  no início de cada build, pra não acumular hashes antigos. O modo
  `--serve` local mantém nome fixo (`styleguide.js`/`.css`, sem hash)
  — não há CDN nem cache de navegador relevante num servidor de
  desenvolvimento com watch.
- **`Pagination`: parâmetro `i` não utilizado no `.map()` de
  `src/components/primitives.tsx`** — achado ao consumir a lib como
  dependência git (fonte crua, sem build) num projeto com
  `noUnusedLocals`/`noUnusedParameters` estritos: como não há etapa de
  build própria, o `tsc` do consumidor type-checa o `.tsx` original da
  lib, e esse tipo de aviso — inofensivo sob o `tsconfig.json` deste
  repo, que não liga essas flags — quebra quem liga. Sem mudança de
  comportamento (as chaves da lista já eram únicas via `t`, não `i`).

### Alterado

- **Styleguide vira uma SPA de uma story por vez**: até aqui,
  `App.tsx` montava as 37 stories na mesma página, rolagem contínua —
  com tantos painéis de vidro (`backdrop-filter`), o parallax do
  `LivingBackground` e marquees rodando ao mesmo tempo, a performance
  degradava. Agora só a story ativa fica montada: header e Sidebar
  ficam fixos (`.ms-app-shell`), só o `<main>` rola. A troca é por hash
  da URL (`useHashRoute`, com `resolve` customizado pra "hash de um
  grupo cai na primeira story dele"), sem lib de rotas — voltar/avançar
  do navegador funciona de graça. Troca de story move o foco pro título
  e zera o scroll do `<main>` — mesma prática de qualquer troca de rota
  em SPA. Rodapé deixa de ficar no fim de uma rolagem longa — agora é a
  última linha da coluna fixa, sempre visível. `App.tsx` foi reescrito
  depois pra consumir o `useHashRoute`/`Sidebar variant`/`.ms-app-shell`
  nativos em vez do código bespoke original (ver "Adicionado" acima).
- **Story "Sidebar"**: texto atualizado — dizia "com `spy` ligado",
  desatualizado desde que este próprio styleguide passou a controlar
  o item ativo via `active` (ver acima).
- **Cores dos glows do `LivingBackground`** (`--bg-glow-1..4` em
  `src/styles/tokens.css`, os dois temas): eram tons de violeta/roxo/azul
  sem relação com nenhum token de marca. Agora usam `color-mix(in srgb,
  var(...), transparent)` sobre a escala de
  `--color-accent`/`--color-pink`/`--color-orange` — as três paradas
  exatas do gradiente de `assets/logo.svg` — então o fundo lê como
  ciano → magenta → laranja, a mesma progressão da logo, em vez de uma
  paleta desconectada dela. O `color-mix` (mesmo idioma já usado nas
  sombras de `.ms-hover-edge`/`.ms-sparkline`) dilui a cor pra manter o
  efeito suave — a versão inicial, com a cor de marca sólida, ficava
  forte demais. Se a marca for realinhada de novo (como em v1.2.0), o
  fundo acompanha automaticamente, sem edição manual.
- **Entrada do toast (`Alert` disparado por `notify()`) ganha bounce**:
  `ms-toast-in` trocou o easing de `ease` pra `var(--ease-bounce)` — a
  assinatura de movimento do sistema, até agora ausente desse
  componente — e o `from` do keyframe ganhou `scale(0.94)` (mesmo
  padrão de `ms-modal-in`). O toast cresce um pouco além do tamanho
  final antes de assentar, em vez de só deslizar e aparecer. Coberto
  por `prefers-reduced-motion: reduce` (`animation-duration: 0.01s`,
  mesma técnica do Modal) — o toast e o painel de histórico
  (`AlertHistory`, que reaproveita o mesmo keyframe) não tinham essa
  cobertura antes; ganharam agora.
- **Categorias de componentes reorganizadas** (`docs/componentes.md`,
  `README.md`), preparando terreno pro lote de componentes novos a
  caminho da v1.5. Eram 8: Providers, Layout e navegação, Controles e
  superfícies, Marketing, Interativos, Alertas, Dados, Marca. Agora são
  11 — "Layout e navegação" virou duas (**Layout**: `Page`, `Hero`,
  `Footer`; **Navegação**: `Navbar`, `Sidebar`, `useHashRoute`,
  `Breadcrumbs`); **Formulários** foi extraída de "Controles e
  superfícies" (`Field`, `Input`, `Textarea`); **Overlays** foi extraída
  de "Interativos" (`Modal`, `StepModal`). Nenhum componente mudou de
  nome, prop ou comportamento — só a categorização, pra cada peça nova
  do roadmap (`Tabs`, `Checkbox`, `Tooltip`, `Drawer` etc.) já ter um
  lugar certo pra entrar.

### Corrigido

- **Hover reativo (`.ms-hover-edge`) cortado nas bordas do `<main>`**:
  `overflow-y: auto` faz o `overflow-x` computado virar `auto` também
  por especificação (não dá pra ter só um eixo com scroll e o outro
  "visible") — o `scale(1.03)` do hover crescia o card ~13px pra cada
  lado e a caixa cortava esse crescimento (e a sombra) na borda.
  Consequência direta de `<main>` ter ganhado `overflow-y: auto` na
  virada pra SPA de uma story por vez. Corrigido com respiro lateral e
  superior no `<main>` (`padding: 8px 32px 32px`, `maxWidth` de 860
  pra 900 pra compensar a largura útil).
- **`ThemeSwitch`: clicar no trilho não alternava o tema** — só o
  clique no polegar redondo (`role="switch"`) disparava `toggle()`; o
  trilho (`.ms-switch__track`) era decorativo. `onClick` movido pro
  `<div className="ms-switch">` que envolve os dois — o clique do botão
  sobe até lá por bubbling (dispara uma vez só, não duas), e agora
  clicar em qualquer parte do controle alterna o tema. O botão continua
  sendo o alvo de foco/teclado e o único elemento com semântica de
  switch (`role`/`aria-checked`).

## [1.2.2] — 2026-07-28

### Alterado

- **Copy dos fundamentos (Cores, Tipografia, Espaçamento & Raios,
  Efeitos)** no styleguide e em `docs/tokens.md` ganha o raciocínio de
  design por trás de cada escolha: cores extraídas ou harmonizadas com
  a marca Mothership; Outfit escolhida pela legibilidade, versatilidade
  e uma pegada mais orgânica por fugir do mainstream; escala de
  espaçamento que foge de propósito da progressão matemática mais
  óbvia; poucos efeitos recorrentes tratados como token, garantindo
  coesão e performance. De quebra, corrigido "escala de oito passos"
  pra "sete" em `docs/tokens.md` (são 7 tokens, `--space-1..7`).
- **README**: `Sidebar` estava faltando na tabela de componentes;
  novo princípio "Poucos efeitos, respiro orgânico" sintetiza a mesma
  filosofia acima. Descrição do repositório no GitHub também
  atualizada (ainda dizia 37 componentes).

### Removido

- **`Container`** (`src/components/primitives.tsx`) — wrapper fino
  (só a classe `.ms-container`: teto de 588px, margem e raio herdados
  da página pessoal original) que nenhum consumidor real do sistema
  usava — nem o styleguide, nem o exemplo Next.js, que já definem a
  própria largura via `style`. A única outra utilidade cogitada (usar
  pra travar a largura do `<main>`) seria redundante com o que
  qualquer app já faz sozinho com uma linha de CSS. `Page` continua
  oferecendo a mesma largura via `contained` (usa `.ms-container`
  internamente); o token `--container-max` segue documentado pra quem
  quiser replicar essa largura manualmente. 37 componentes (era 38).

### Adicionado

- **Story "Page"** no styleguide: sem exemplo isolado do componente em
  si de propósito (um `.ms-page` dentro de outro duplicaria o fundo de
  tela cheia da página de forma confusa — este próprio styleguide, com
  a classe no `<body>`, já é o exemplo em produção); a demonstração do
  teto de 588px (`contained`) usa a classe `.ms-container` direto, já
  que o componente `Container` foi removido (ver seção Removido).
- **`Sidebar`** (`src/components/navbar.tsx`) — sumário completo de
  seções e subtópicos, versão mais densa da Navbar. `sections` aceita
  `{ href, label, items?: { href, label }[] }[]`. Sticky à esquerda
  no desktop (`position: sticky`, sob a navbar flutuante), com rolagem
  própria se passar da altura da tela. Abaixo de 720px vira um botão
  flutuante que abre a mesma navegação como gaveta, com véu de fundo —
  fecha ao clicar fora, Esc ou um link. Mesmo scrollspy da `Navbar`
  (`spy`, padrão `true` aqui — na Navbar é `false`), estendido para
  também acompanhar os `items` aninhados; quando um subtópico está
  ativo, a seção-pai recebe destaque também. A lógica de scrollspy foi
  extraída para um hook privado (`useScrollSpy`) compartilhado pelas
  duas — antes era um efeito quase idêntico duplicado só na Navbar.

### Alterado

- **Styleguide passa a usar o próprio `Sidebar` como navegação padrão**
  (`styleguide/App.tsx`): a Navbar do topo perde os links de grupo e o
  hambúrguer (fica só marca + sino + switch de tema), e a lista plana
  de âncoras logo abaixo do título sai — o sumário completo (grupos +
  cada componente) passa a viver na Sidebar fixa à esquerda, montada a
  partir do mesmo array `STORIES` que já gerava a navegação antiga.
  Layout virou duas colunas (`display: flex`) só no wrapper da página;
  a largura do conteúdo (860px) não muda.
- **Textos de apoio de todas as 35 stories reescritos**: eram legendas
  de uma linha (`"Outfit 400/500, escala 12–32px"`); agora são 1–2
  frases explicando o que o componente é e quando usar, no tom de
  documentação — cada grupo (Fundações/Componentes/Dados) também
  ganhou uma frase de abertura.
- **Header do styleguide passa a cobrir a largura total** (do início
  da Sidebar até o fim do `<main>`), em vez de ficar confinado à
  coluna de 860px do conteúdo — saiu de dentro do `<div>` de duas
  colunas para o topo do wrapper. O conteúdo de fato ganhou um
  `<main>` semântico (antes era uma `<div>` genérica).
- **`maxWidth: 620` removido dos parágrafos do styleguide** (intro do
  header, descrição de cada grupo, subtítulo de cada story): a caixa
  do header já cobria a largura toda desde o ajuste acima, mas o texto
  ficava preso a 620px — dava a impressão de que o header (e o corpo
  de texto abaixo) era mais estreito que a Sidebar + `<main>` juntos.
  Não era padding do wrapper nem margin do header, só essa restrição
  inline nos parágrafos.
- **`Sidebar`: fundo de vidro** — a versão fixa do desktop (`.ms-sidebar`)
  ganhou o mesmo tratamento de superfície do `Card` (borda, raio,
  `--color-surface`, blur), em vez de ficar só a lista de links flutuando
  sem contorno sobre o fundo da página.
- **`docs/componentes.md`: `LogoMark` reescrito** — a descrição dizia
  "a logo completa", sugerindo uso solto; na prática as partes (palavra,
  letras, dirigível) nascem fora de posição via CSS e só assentam sob
  uma ancestral `.ms-splash--ready`, hoje fornecida só pela `Splash`.
  Documentado como uso interno dela, não uma "logo genérica" — cheguei
  a tentar uma story isolada pra esse levantamento e ela ficava presa
  na fase 1 (só olho), confirmando o comportamento antes de decidir não
  incluir (a `AlertHistory` também ficou de fora pelo mesmo espírito:
  o próprio código já documenta "não renderize manualmente").

- **`BentoGrid`/`BentoTile`**: mais opções de tamanho — `rowSpan`
  ganha a opção `3` (era só `2`), e o grid usa `grid-auto-flow: dense`
  pra preencher buracos deixados por spans irregulares em vez de
  deixar o layout furado. Tentei também tirar o stretch das linhas
  (`align-items: start`, tiles do tamanho do próprio conteúdo) pra um
  ar mais orgânico, mas revertido — linhas alinhadas ficaram melhores;
  só o tamanho (`colSpan`/`rowSpan`) varia entre os tiles agora.
- **Exemplo do bento grid no styleguide**: o grid de 7 tiles deixava
  2 células vazias no canto inferior direito (a soma dos spans não
  fechava as 4×4 células do grid). Novo tile (`rowSpan={2}`) preenche
  exatamente esse buraco via `dense`, e o tile "Styleguide gerado da
  própria biblioteca" deixa de sobrar sozinho com espaço vazio ao lado.
- **Exemplo do card de depoimentos no styleguide**: paginação de 2
  depoimentos por página era fixa, então no mobile o segundo card de
  cada página quebrava linha e empilhava embaixo do primeiro dentro da
  mesma página do carrossel. Agora o tamanho da página é responsivo —
  1 depoimento por página abaixo de 720px, 2 acima disso.

### Corrigido

- **Vidro escurecido no tema claro derrubava o contraste do texto**:
  `--color-surface` no `.light` usava um véu **preto**
  (`rgba(0,0,0,.05)`) sobre os glows saturados do fundo — o resultado
  era uma superfície cinza/roxa turva, mais escura que o esperado,
  reduzindo o contraste com o texto preto por cima. Trocado para véu
  **branco** (`rgba(255,255,255,.6)`), que lava a cor por baixo pro
  efeito de vidro fosco de verdade — mesma lógica já usada no tema
  escuro (véu branco sobre fundo escuro), espelhada pro claro. Afeta
  toda superfície de vidro do sistema (Card, Navbar, Sidebar, Modal,
  inputs…), já que todas herdam do mesmo token. `--color-surface-hover`
  **não** acompanhou — tentei branco ali também, mas sobre uma base já
  branca o hover ficava imperceptível; continua escurecendo
  (`rgba(0,0,0,.15)`, valor original) pra sinalizar o estado de
  verdade.

- **`Carousel`**: o índice da página ativa não era limitado quando
  `items`/`slides` mudava de tamanho em runtime (ex. paginação
  responsiva) — dava pra ficar preso numa página que deixou de existir.
  Agora o índice é reancorado pro último válido sempre que a contagem
  de páginas muda.
- **`Sidebar`: linha lateral colada nos subtópicos** — `.ms-page ul {
  padding: 0 }` (reset global) tem mais especificidade que uma classe
  sozinha, então o `padding-left` do `.ms-sidebar__list` nunca vencia a
  cascata; a linha vertical ficava sem respiro nenhum dos itens, e o
  hover encostava nela. Precisou prefixar `.ms-page .ms-sidebar__list`
  pra vencer o reset.
- **Gaveta da `Sidebar` abria atrás da Navbar no mobile**: `.ms-sidebar__backdrop`
  (98) e `.ms-sidebar__drawer` (99) tinham z-index menor que `.ms-navbar`
  (100) — a navbar flutuante cobria o topo da gaveta ao abrir. Subidos
  para 150/151 (acima da navbar de propósito, diferente do menu da
  própria Navbar que fica por baixo); o botão que abre/fecha foi pra
  152, acima da própria gaveta, pra continuar clicável como "X" por
  cima dela. Escala documentada em ARCHITECTURE.md.
- **Sidebar sobrepunha a Navbar no fim da página (desktop)**: o
  `padding-bottom: 80px` que dava respiro ao fim da página vivia no
  wrapper mais externo, **fora** da caixa em que a Sidebar (`position:
  sticky`) se apoia — esse respiro não contava pro cálculo de onde o
  sticky "solta", então no scroll máximo a Sidebar subia ~48px acima
  do esperado, atrás da navbar flutuante. Confirmado hackeando o
  padding-bottom do `<main>` pra um valor absurdo (2000px) sem nenhum
  efeito — prova de que o container errado estava sendo inflado. O
  respiro foi movido pra dentro da própria linha flex (Sidebar + main)
  como `var(--space-6)`, a mesma folga já usada no `max-height` da
  Sidebar — fecha a conta exata pra qualquer altura de tela, não só a
  testada.
- **Exemplos da story "Navbar" não colapsavam pro hambúrguer no
  mobile**: as três instâncias de demonstração passavam
  `responsive={false}` explicitamente, mesmo com o texto da própria
  story prometendo "em telas estreitas os links migram pro menu do
  hambúrguer". Sem o hambúrguer no DOM, a regra CSS que esconde os
  links (`.ms-navbar:has(.ms-navbar__burger) > .ms-navbar__link`)
  nunca batia — os links ficavam visíveis dentro do pill, cortados
  pela barra de rolagem invisível (`scrollbar-width: none`). Removido
  o override; as três voltam ao padrão (`responsive` `true`) e
  colapsam de verdade.

## [1.2.0] — 2026-07-27

### Adicionado

- **Marketing**: `PricingCard` — card de precificação com preço,
  período, lista de recursos (com ícone de check ou traço para
  excluídos, nunca só cor) e ação fixada no rodapé do card. `badge`
  ou `highlighted` aplicam a borda e o glow de destaque do plano
  recomendado. Combina com `HoverEdge`, como o `Card`.
- **Marketing**: `TestimonialCard` — depoimento com estrelas de
  avaliação opcionais (`rating`, com `aria-label` equivalente em
  texto) e identidade (avatar + nome + cargo) sempre fixada no
  rodapé. Já nasce com o contorno reativo do sistema (`interactive`,
  padrão `true`, hover **e** active) — não precisa envolver com
  `HoverEdge`. `highlighted` para o depoimento em foco.
- **Utilitário `.ms-hover-edge`**: passa a disparar também em
  `:active`, não só `:hover` — feedback de toque em telas sem hover
  de verdade. Beneficia todo mundo que já usa a classe (`Card`,
  `StatTile`, itens da `Gallery`).
- **`Carousel`**: nova prop `items` (`ReactNode[]`) para paginar
  conteúdo livre em vez de fotos — ex. grupos de `TestimonialCard`.
  Setas e bullets passam a usar as cores do tema nesse modo, em vez
  do branco fixo pensado para foto. Nova prop `arrows` (padrão
  `true`) esconde as setas, deixando a navegação só nos bullets.
  Navegável por arraste horizontal (toque ou mouse) em qualquer modo.
- **Dados**: `Table` — pronta para o esquema CRUD: primeira coluna
  sempre a badge de `status`, última sempre os ícones de ação
  (`onEdit`/`onDelete`, mais `actions` para extras), nenhuma das duas
  configurável via `columns` — pra toda tabela do sistema nascer
  consistente. Colunas `sortable` ganham alternância `asc → desc →
  ordem original` no cabeçalho, com `aria-sort` no `<th>`.
  `overflow-x: auto` no wrapper cobre telas estreitas.
- **Marketing**: `BentoGrid`/`BentoTile` — grid de 4 colunas com tiles
  de tamanho variável (`colSpan`/`rowSpan`), como `StatGrid`/`StatTile`.
  Já nasce com o contorno reativo (`interactive`, padrão `true`).
  Abaixo de 720px vira uma coluna e todo tile volta a 1×1.
- **`Marquee`** — primitive de scroll horizontal infinito para
  qualquer `children` (não só logos): `direction` (`left`/`right`),
  `speed` (`slow`/`normal`/`fast` ou um número de segundos exato),
  `pauseOnHover`, `fade` (máscara CSS com token de espaçamento) e
  `gap`. Animação 100% CSS — duas cópias do conteúdo (a segunda com
  `aria-hidden` + `inert`) deslizando -50% via `translate3d`, sem
  `requestAnimationFrame` nem timer. Sem `loop`: o loop é sempre
  contínuo, já que desligá-lo exigiria medir a largura real do
  conteúdo via JS. Sob `prefers-reduced-motion`, a rolagem para e a
  cópia duplicada some, sobrando uma linha estática normal.
  `LogoMarquee`/`TechMarquee`/`IconMarquee`/`TestimonialMarquee`
  ficam documentados como composições futuras do mesmo primitive,
  ainda não implementadas.

### Alterado

- **Cores de marca realinhadas com `assets/logo.svg`**: `--color-accent`
  (`#00afef`, era `#00a7da`) e `--color-pink` (`#ed2d66`, era
  `#d4708f`) passam a ser as paradas exatas do gradiente da logo —
  `--color-orange` já era. Escalas 100–900 recalculadas com a mesma
  fórmula de mix (branco/preto) já usada no accent original, preservando
  o "formato" da escala. `--chart-3`/`--chart-4` **não** acompanham —
  já validados contra daltonismo nos valores antigos, ficam soltos por
  design (documentado em `docs/tokens.md` e `TOKENS.md`).

## [1.0.1] — 2026-07-27

### Corrigido

- **Modal no tema claro**: o véu do fundo era escuro, o que atravessava o
  vidro do diálogo e derrubava o contraste do texto escuro. Agora é claro
  no tema claro (e continua escuro no escuro).
- **Splash embutida**: a variante `inline` herdava a camada de
  sobreposição (z-index 1000) e passava por cima de headers fixos. Como
  nessa variante ela é conteúdo da página, e não overlay, saiu da camada
  de overlay.

## [1.0.0] — 2026-07-26

Primeira versão pública. O sistema nasceu da engenharia reversa de uma
página pessoal em HTML/CSS e foi convertido em biblioteca React.

### Adicionado

- **Fundações**: tokens de cor (8 cores de marca com escalas 100–900 e
  versões `-soft`), tipografia Outfit, espaçamento, raios, efeitos de
  vidro, `--ease-bounce` e as cores de dados `--chart-1..4` validadas
  contra daltonismo e contraste.
- **Fundo vivo** (`LivingBackground`): quatro glows em órbitas
  deformadas por harmônicos, com pulsação de tamanho e parallax do mouse.
- **Layout e navegação**: `Page`, `Container`, `Navbar` (scrollspy +
  menu hamburguer responsivo), `Breadcrumbs`, `Hero`, `Footer`.
- **Controles e superfícies**: `Button`, `ButtonLink`, `IconButton`,
  `LinkList`, `Card`, `Badge`, `Avatar`, `Profile`, `Field`, `Input`,
  `Textarea`, `ThemeSwitch`.
- **Interativos**: `Accordion`, `Carousel`, `Gallery`, `Modal`,
  `StepModal` e o utilitário `HoverEdge` (contorno reativo).
- **Alertas**: `Alert`, `AlertsProvider`/`useAlerts` com toasts de 20s,
  barra de tempo, botão de dispensar, histórico e `NotificationBell`.
- **Dados**: `LineChart`, `Meter`, `PieChart`, `ProgressRing`,
  `Sparkline`, `StatGrid`/`StatTile`, `Legend` e `TooltipProvider`.
- **Marca**: `Splash` (animação de abertura) e `Loader` (rosto da marca
  enchendo de líquido conforme o progresso).
- **Styleguide** gerado a partir da própria biblioteca.
