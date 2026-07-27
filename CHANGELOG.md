# Changelog

Todas as mudanças relevantes deste projeto são documentadas aqui.
O formato segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o versionamento segue [SemVer](https://semver.org/lang/pt-BR/).

## [Não lançado]

### Alterado

- **`BentoGrid`/`BentoTile`**: mais opções de tamanho — `rowSpan`
  ganha a opção `3` (era só `2`), e o grid usa `grid-auto-flow: dense`
  pra preencher buracos deixados por spans irregulares em vez de
  deixar o layout furado. Tentei também tirar o stretch das linhas
  (`align-items: start`, tiles do tamanho do próprio conteúdo) pra um
  ar mais orgânico, mas revertido — linhas alinhadas ficaram melhores;
  só o tamanho (`colSpan`/`rowSpan`) varia entre os tiles agora.

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
