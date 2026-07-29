# CLAUDE.md

Guia operacional do **Mothership DS** para trabalhar com o Claude Code.
Lido automaticamente no início de cada sessão — por isso fica enxuto;
os detalhes de cada área vivem nos outros arquivos da raiz:

| Arquivo | Quando consultar |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | decisões técnicas, fronteira servidor/cliente, portais, z-index, armadilhas de CSS já resolvidas |
| [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md) | antes de criar ou editar um componente |
| [TOKENS.md](TOKENS.md) | antes de escrever qualquer CSS — cheat-sheet de todas as variáveis |
| [ACCESSIBILITY.md](ACCESSIBILITY.md) | checklist de a11y por tipo de componente |

`docs/*.md` é a documentação **pública**, em pt-br, referenciada no
README e lida por quem consome a lib. Os quatro arquivos acima são o
guia **interno**, para quem mantém a lib — mais denso, orientado a
regras e armadilhas, não a explicação didática.

## O que é

Design system em React 18+ / TypeScript: glassmorphism, temas
claro/escuro, fundo animado, 45 componentes. Nasceu de engenharia
reversa de uma landing page pessoal em HTML/CSS puro — os tokens vêm
daquele CSS original (ver ARCHITECTURE.md § Origem).

Autor: Valnez Júnior (Mothership Studios). Repo:
`github.com/valnezjr/mothership-ds`. Styleguide publicado em
`valnezjr.github.io/mothership-ds/`, exemplo de landing page em
`valnezjr.github.io/mothership-ds/exemplo/`.

### v1.2.0 — lançada em 2026-07-27

- [x] `PricingCard` (`src/components/marketing.tsx`)
- [x] `TestimonialCard` (`src/components/marketing.tsx`)
- [x] `Table` (`src/components/table.tsx`) — pronta para CRUD: 1ª coluna
      status, última ações (editar/excluir), ordenação por coluna
- [x] `BentoGrid`/`BentoTile` (`src/components/marketing.tsx`) —
      `colSpan`/`rowSpan` no grid de 4, vira 1 coluna abaixo de 720px
- [x] Cores de marca realinhadas com `assets/logo.svg`: `--color-accent`
      (#00afef, era #00a7da) e `--color-pink` (#ed2d66, era #d4708f)
      agora são as paradas exatas do gradiente da logo; `--color-orange`
      já era exata. Escalas 100–900 recalculadas com a mesma fórmula de
      mix já usada (branco/preto, mesmos pesos). `--chart-3`/`--chart-4`
      não seguem — já validados nos valores antigos, seguem soltos.
- [x] `Marquee` (`src/components/marquee.tsx`) — primitive de scroll
      horizontal infinito, animação 100% CSS (duas cópias do conteúdo,
      translate3d de -50%). Único arquivo do repo com `"use client"`
      só por causa do `inert` (React 18 descarta `inert=""` via JSX;
      precisa setar a propriedade DOM via ref) — a animação em si
      dispensaria a diretiva. `LogoMarquee`/`TechMarquee`/`IconMarquee`/
      `TestimonialMarquee` ficam como composições futuras, documentadas
      mas não implementadas.

### v1.2.2 — lançada em 2026-07-28

- [x] `Sidebar` (`src/components/navbar.tsx`) — sumário completo com
      subtópicos, sticky à esquerda no desktop; abaixo de 720px vira
      botão + gaveta (mesma navegação, com véu de fundo). Scrollspy
      compartilhado com a `Navbar` via `useScrollSpy` (hook privado,
      extraído nessa adição — antes era um efeito duplicado em cada
      componente).
- [x] Styleguide (`styleguide/App.tsx`) passa a usar essa `Sidebar`
      como navegação padrão, montada a partir de `STORIES` — a Navbar
      do topo perde `links`/hambúrguer (só marca + sino + switch). A
      story `"sidebar"` não instancia o componente de novo — duas
      instâncias na mesma página duplicam o botão/gaveta fixos do
      mobile na mesma posição de tela (achado real, não hipotético);
      o texto da story só aponta pra Sidebar real já em uso.
      Textos de apoio das 35 stories reescritos pra tom de documentação
      (eram legendas de uma linha).
- [x] Removido `Container` (`src/components/primitives.tsx`) — wrapper
      fino que nenhum consumidor real usava; `Page`/`contained` segue
      oferecendo a mesma largura de 588px via `.ms-container` (classe
      mantida no CSS). 37 componentes (era 38).
- [x] Corrigido `--color-surface` no tema claro: véu preto
      (`rgba(0,0,0,.05)`) sobre os glows saturados do fundo virava um
      cinza/roxo turvo que derrubava o contraste do texto preto.
      Trocado por véu branco (`rgba(255,255,255,.6)`), espelhando a
      lógica do tema escuro. `--color-surface-hover` continua
      escurecendo (`rgba(0,0,0,.15)`) — branco ali ficava
      imperceptível sobre a base já branca.
- [x] Corrigido: as três instâncias de exemplo da story "Navbar"
      passavam `responsive={false}`, então nunca colapsavam pro
      hambúrguer no mobile (links cortados pela barra de rolagem
      invisível do pill) — removido o override.

### Não lançado

- [x] `Sidebar` ganha a prop `active` (controla o item ativo de fora,
      desliga o `spy` interno) e um efeito de `scrollIntoView` no item
      ativo dentro da própria lista.
- [x] Styleguide (`styleguide/App.tsx`) vira SPA de uma story por vez —
      as 37 montadas juntas numa rolagem contínua estavam degradando a
      performance (glass em dezenas de painéis, parallax do fundo vivo,
      marquees rodando ao mesmo tempo). Header e Sidebar fixos
      (`height: 100vh`, só `<main>` rola); troca por hash da URL, sem
      lib de rotas — voltar/avançar do navegador funciona de graça.
      Rodapé sai do fim de uma rolagem longa pra última linha da coluna
      fixa, sempre visível.
- [x] Corrigido: `overflow-y: auto` no `<main>` (recém-adicionado pra
      SPA acima) fazia o `overflow-x` computado virar `auto` também
      por especificação — o `scale(1.03)` do hover reativo
      (`.ms-hover-edge`) crescia o card pra fora da caixa e a borda
      cortava esse crescimento (e a sombra). Corrigido com respiro
      lateral/superior no `<main>` (`padding: 8px 32px 32px`).
- [x] O padrão acima virou suporte **nativo** da biblioteca, não só
      código do styleguide: `useHashRoute` (hook novo,
      `src/components/navbar.tsx`) sincroniza "qual view está ativa"
      com o hash da URL; `Sidebar` ganha `variant="fill"` (estica
      100% da altura do pai em vez de sticky); `.ms-app-shell`
      (`src/styles/components.css`) trava a viewport. `App.tsx` foi
      reescrito pra consumir essas três peças em vez do código
      bespoke que tinha antes — prova de que a API funciona. Tudo
      opt-in: sem essas peças, nada muda pra quem já tinha uma página
      comum. Detalhe completo em ARCHITECTURE.md § Performance do
      styleguide; receita de uso em docs/componentes.md § Layout de
      SPA.
- [x] Glows do `LivingBackground` (`--bg-glow-1..4`,
      `src/styles/tokens.css`, dois temas) trocados de tons de
      violeta/roxo/azul sem relação com a marca para
      `color-mix(in srgb, var(...), transparent)` sobre
      `--color-accent`/`--color-pink`/`--color-orange` — as três
      paradas do gradiente de `assets/logo.svg`. Fundo passa a ler
      ciano → magenta → laranja, e acompanha automaticamente qualquer
      realinhamento futuro da marca. O `color-mix` (diluindo pra
      ~50-65%) veio de um ajuste rápido: a primeira versão, com a cor
      de marca sólida, ficou forte demais — mesmo idioma já usado nas
      sombras de `.ms-hover-edge`/`.ms-sparkline`.
- [x] Corrigido: `ThemeSwitch` só alternava tema clicando no polegar
      redondo, não no trilho. `onClick` movido do `<button
      role="switch">` pro `<div className="ms-switch">` que envolve
      botão + trilho — o clique do botão sobe por bubbling (dispara uma
      vez só), o do trilho vai direto. Botão continua o único alvo de
      foco/teclado e de `role`/`aria-checked`.
- [x] Toast de `notify()` ganha bounce na entrada: `ms-toast-in` passa
      de `ease` pra `var(--ease-bounce)` e o `from` ganha
      `scale(0.94)` (mesmo padrão de `ms-modal-in`) — cresce um pouco
      além do tamanho final antes de assentar. `.ms-alert--toast` e
      `.ms-alert-history` (reaproveita o mesmo keyframe) ganharam
      `@media (prefers-reduced-motion: reduce) { animation-duration:
      0.01s }`, que não existia antes pra nenhum dos dois.
- [x] Categorias de componentes reorganizadas (`docs/componentes.md`,
      `README.md`) de 8 pra 11, preparando terreno pro lote de
      componentes a caminho da v1.5 (`Tabs`, `Pagination`,
      `DropdownMenu`, `Tooltip`, `Popover`, `Drawer`, `EmptyState`,
      `Timeline`, `Toolbar`, `FilterBar` — ainda não implementados).
      "Layout e navegação" virou **Layout** + **Navegação**;
      **Formulários** saiu de "Controles e superfícies"; **Overlays**
      saiu de "Interativos". Nenhum componente existente mudou de
      nome/prop/comportamento, só a categorização.
- [x] `Stack`, `Divider`, `Skeleton` (`src/components/primitives.tsx`,
      sem `"use client"`) — primeiro lote do caminho até a v1.5.
      `Stack`: flexbox fino, `gap` na escala `--space-1..7`. `Divider`:
      `<hr>` horizontal, `<div role="separator" aria-orientation="vertical">`
      quando vertical. `Skeleton`: pulso entre
      `--color-surface`/`--color-surface-hover` (nenhuma cor nova),
      desliga sob `prefers-reduced-motion`. 40 componentes (era 37).
- [x] `Checkbox`, `Radio`, `Switch` (`src/components/primitives.tsx`,
      sem `"use client"`) — segundo lote (trio de formulário). Ambos
      `Checkbox`/`Radio` são `<input>` nativo com `appearance: none`
      (foco/teclado/`<form>` de graça, só o `::after` é customizado);
      `Radio` agrupa via `name` nativo, sem `RadioGroup`. `Switch` é
      `<input type="checkbox" role="switch">`, deliberadamente **sem**
      compartilhar implementação com `ThemeSwitch` (mecanismos de
      animação diferentes por baixo — `:checked` vs. classe `.light`
      do tema; generalizar os dois exigiria reescrever `ThemeSwitch`
      sem necessidade real hoje). 43 componentes (era 40).
- [x] `Select` — terceiro lote, revisado: começou como `<select>`
      nativo estilizado, mas foi abandonado a favor de listbox própria
      (decisão consciente, não bug) — não sobrou nenhum primitive
      nativo reaproveitável, então virou o design final. Passa a viver
      em `src/components/select.tsx` (arquivo novo, **com**
      `"use client"` — tem estado próprio, diferente de tudo que já
      morava em `primitives.tsx`). Gatilho `<button role="combobox">`
      + `.ms-input`; popup `<ul role="listbox">` de vidro
      (`--ease-bounce`, `--icon-select` reaproveitado só na seta do
      gatilho agora). Teclado completo (setas com wrap pulando
      `disabled`, Enter/Espaço, Esc, Home/End). Popup é `position:
      absolute` num wrapper `position: relative` — **não** é portal no
      `<body>` como Modal/menu da Navbar; decisão deliberada, sabendo
      que o `Popover` (próximo do roadmap) resolve posicionamento
      robusto de vez, então não vale antecipar isso agora.
- [x] `Combobox` (`src/components/select.tsx`) — quarto lote,
      construído junto com a revisão do `Select` acima (mesmo
      arquivo, mesma listbox/`OptionList`/`useOutsideClick`
      compartilhados; só troca o gatilho por um `<input>` editável e
      acrescenta filtro por texto). Mesmo limite de popup não-portal
      do `Select`. 45 componentes (era 43).
- [x] Corrigido: build de produção do styleguide
      (`styleguide/build.mjs`) nomeava `styleguide.js`/`.css` sempre
      igual — depois de um deploy, a CDN do GitHub Pages
      (`cache-control: max-age=600`) podia servir a versão de até 10
      minutos atrás, sem sinal nenhum de que mudou (achado real:
      componentes recém-publicados não apareciam pra quem já tinha
      visitado o styleguide). Agora nomeia com hash de conteúdo
      (`entryNames: "styleguide-[hash]"`, `metafile: true` pra achar o
      nome real e escrever o `index.html` depois); `dist/` é limpo no
      início de cada build. `--serve` local continua com nome fixo.
      Detalhe em ARCHITECTURE.md § Nomes de arquivo com hash de
      conteúdo.

Ícones recomendados para uso conjunto: **Lucide** (`lucide-react`) —
decisão e exemplo em README.md § Ícones. Não é dependência do pacote,
só recomendação; componentes que precisam de ícone aceitam `ReactNode`
(nunca importam um ícone específico).

## Comandos

```bash
npm install
npm run typecheck        # tsc --noEmit — rodar antes de qualquer commit
npm run styleguide:dev   # bancada de trabalho: renderiza src/ ao vivo, localhost:8000
npm run styleguide       # gera styleguide/dist/ (publicado no GitHub Pages a cada push em master)
```

Não existe `npm run build` nem suíte de testes automatizada. O pacote
é distribuído como fonte (sem etapa de build — ver ARCHITECTURE.md) e
a validação é visual, no styleguide, nos dois temas e abaixo de 720px.

## Mapa do repositório

```
src/
  index.ts               # TODO export público passa por aqui — é a lista canônica de componentes
  styles.css             # entrypoint único: @import tokens.css + components.css
  reset.css              # opcional, importado à parte por quem quiser reset completo
  styles/tokens.css       # única fonte de tokens (cores, tipografia, espaçamento, efeitos, fundo)
  styles/components.css   # CSS de todos os componentes — prefixo ms-, BEM
  components/*.tsx         # um arquivo por área, não 1:1 com componente (ex.: charts.tsx tem 8 componentes)
styleguide/
  stories.tsx             # catálogo do styleguide — uma entrada por componente novo
  build.mjs               # build com esbuild puro, sem Storybook
docs/                     # documentação pública em pt-br (tokens, componentes, arquitetura, movimento)
examples/next-app/        # landing page de exemplo, buildável — export estático publicado em /exemplo
```

## Regras que não se negociam

- **Tokens antes de valores.** Nenhum CSS novo escreve `15px` ou uma
  cor solta — sempre `var(--espaço-do-token)`. Detalhe: TOKENS.md.
- **`"use client"` só quando precisa.** Componente sem estado/efeito/
  handler fica sem a diretiva (hoje só `primitives.tsx` e
  `LogoMark.tsx`). Detalhe: ARCHITECTURE.md § Fronteira servidor/cliente.
- **IDs de SVG sempre via `React.useId()`.** Nunca um contador de
  módulo — quebra a hidratação. Todo componente com SVG referenciado
  por `url(#...)` já segue isso (Loader, LogoMark, Modal, charts,
  disclosure, navbar).
- **`position: fixed` sempre em portal no `<body>`.** Modal, menu da
  navbar, toasts/histórico, tooltip. Um ancestral com
  `backdrop-filter` quebraria o posicionamento.
- **Sem reset global.** Tudo escopado em `.ms-page`; a lib não pode
  reescrever o CSS de quem a instala.
- **Estado nunca só por cor.** Sempre `aria-*` junto. Detalhe:
  ACCESSIBILITY.md.

## Convenção de código observada no repo

- Merge de classes: `[...].filter(Boolean).join(" ")` inline, não um
  helper importado (o `cx()` de `primitives.tsx` é local a esse
  arquivo, não é padrão compartilhado).
- Props: `interface XProps extends React.HTMLAttributes<HTMLDivElement>`
  (ou o elemento correspondente) + `className` e `{...rest}` sempre
  repassados.
- `LogoMark.tsx` é gerado a partir de `assets/logo.svg` — não editar à
  mão.

## Idioma

Commits, docs e comentários em pt-br, no mesmo tom direto do resto do
projeto (ver `docs/*.md` como referência de estilo). Comentário só
quando explica um *porquê* não óbvio — o código já diz o *o quê*.
