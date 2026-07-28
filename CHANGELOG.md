# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Adicionado

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
- **`Sidebar`: fundo de vidro** — a versão fixa do desktop (`.ms-sidebar`)
  ganhou o mesmo tratamento de superfície do `Card` (borda, raio,
  `--color-surface`, blur), em vez de ficar só a lista de links flutuando
  sem contorno sobre o fundo da página.

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

- **`Carousel`**: o índice da página ativa não era limitado quando
  `items`/`slides` mudava de tamanho em runtime (ex. paginação
  responsiva) — dava pra ficar preso numa página que deixou de existir.
  Agora o índice é reancorado pro último válido sempre que a contagem
  de páginas muda.

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
