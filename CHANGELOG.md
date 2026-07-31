# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

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
  só** — `.ms-input:focus` somava `border-color` accent com
  `box-shadow: 0 0 0 1px accent`, e a regra global de foco
  (`.ms-page :is(...):focus-visible`) continuava valendo por cima
  (tem mais especificidade que `.ms-input:focus` por causa do
  `:is()`, então o `outline: none` local não a cancelava) — resultado:
  o outline global (2px, offset 1px) e o box-shadow (1px) desenhavam
  dois anéis concêntricos. Removido o `box-shadow`; sobra só a
  mudança de cor da borda (sem deslocar layout) mais o outline global,
  um anel só. Ganhou também hover (`background: var(--color-surface-hover)`,
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
