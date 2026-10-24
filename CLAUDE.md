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
em dois eixos (Mothership Glass/Cream/Paperpen/Flat × base/escuro),
fundo animado, 57 componentes. Nasceu de engenharia
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
      dispensaria a diretiva. As composições `LogoMarquee`/`TechMarquee`/
      `IconMarquee`/`TestimonialMarquee`, planejadas aqui, saíram do
      roadmap em 2026-10-16: montar com o próprio `Marquee` é direto.

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

### v1.3.0 — lançada em 2026-08-05

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
      componentes a caminho da v1.5 (`DropdownMenu`, `Tooltip`,
      `Drawer`, `EmptyState`, `Timeline`, `Toolbar`, `FilterBar` —
      ainda não implementados).
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
      sem necessidade real hoje). Visual revisado depois de nascer:
      polegar maior que o trilho (`--switch-thumb` 32px > `--switch-height`
      24px, mesmos tokens do `ThemeSwitch`), ativo mantém vidro com tom
      "soft" de marca (`--color-accent-soft`, mesmo par de
      `Badge tone="accent"`) em vez de virar cor sólida.
      `box-shadow` sutil no polegar — achado ao testar: sem ela, ficava
      quase invisível no tema claro (branco sobre o "soft" quase
      branco); `ThemeSwitch` não precisa disso porque o ícone sol/lua
      já garante contraste. 43 componentes (era 40).
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
      robusto de vez, então não vale antecipar isso agora. (Superado na
      v1.8.0: a lista virou portal no `<body>`.)
- [x] `Combobox` (`src/components/select.tsx`) — quarto lote,
      construído junto com a revisão do `Select` acima (mesmo
      arquivo, mesma listbox/`OptionList`/`useOutsideClick`
      compartilhados; só troca o gatilho por um `<input>` editável e
      acrescenta filtro por texto). Mesmo limite de popup não-portal
      do `Select`. 45 componentes (era 43).
- [x] `Tabs` (`src/components/disclosure.tsx`, já tinha
      `"use client"`) e `Pagination` (`src/components/primitives.tsx`,
      sem `"use client"` — 100% controlado, sem estado próprio) —
      quinto lote. `Tabs`: só a aba ativa fica montada; indicador
      desliza com `--ease-bounce` medido via DOM (`offsetLeft`/
      `offsetWidth`, não CSS puro); `←`/`→` já ativam (ativação
      automática), pulando `disabled` com wrap; `Home`/`End` pulam
      pro primeiro/último habilitado; lista rola horizontalmente
      (achado ao testar em mobile: sem `overflow-x`, abas extras
      cortavam na borda da tela em vez de rolar). `Pagination`:
      `page`/`totalPages`/`onChange`, sempre mostra primeira/última
      página, `…` pro meio distante, `aria-current="page"` na atual
      (mesmo padrão de `Breadcrumbs`/`StepModal`). 47 componentes
      (era 45).
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
- [x] `Popover` (`src/components/popover.tsx`, arquivo novo, com
      `"use client"`) — sexto lote. Primeiro componente com
      posicionamento flutuante de verdade: portal no `<body>` +
      `position: fixed`, posição calculada via `getBoundingClientRect`
      do gatilho e do conteúdo (vira de lado se não couber, nunca sai
      da viewport horizontalmente) — o mecanismo que `Select`/
      `Combobox` deliberadamente deixaram pra depois. "Popover leve"
      (ver ACCESSIBILITY.md § Modal): clique fora/Esc fecham e Esc
      devolve o foco ao gatilho, mas não prende o foco dentro como o
      `Modal` — por isso sem `role="dialog"`. `trigger` é medido via
      wrapper interno, não clone com `ref` (`Button`/`ButtonLink`/
      `IconButton` não encaminham ref hoje). Clique no gatilho sempre
      previne a ação padrão dele (achado ao testar: `IconButton`
      exige `href`, então sem `preventDefault` o clique também
      navegava de verdade — quebrou a primeira versão da story,
      montada com `<ButtonLink href="#">`, cujo clique mudava o hash
      da URL e desmontava a story inteira, já que o styleguide inteiro
      roteia por hash). z-index 700, mesma camada do Tooltip (ver
      ARCHITECTURE.md § escala de z-index). 48 componentes (era 47).
- [x] `Drawer` (`src/components/drawer.tsx`, arquivo novo, com
      `"use client"`) — sétimo lote. Não é componente novo de verdade,
      é extração: a gaveta mobile que o `Sidebar` já tinha desde a
      v1.2.2 virou um primitivo compartilhado (`open`/`onClose`,
      `side="left"|"right"`), e o `Sidebar` foi reescrito por dentro
      pra consumi-lo — zero mudança de comportamento pro
      `Sidebar` (verificado via Playwright: abre/fecha no botão, véu,
      Esc, clique num link, resize pra desktop — os cinco continuam
      idênticos). Mesma mecânica "leve" de sempre: sem focus trap, sem
      travar o scroll do fundo, portal no `<body>` só depois de montar.
      49 componentes (era 48).
- [x] `DropdownMenu` (`src/components/dropdown-menu.tsx`, arquivo
      novo, com `"use client"`) — oitavo lote. Absorve o que seria um
      `ContextMenu` à parte via `triggerOn="click"|"context"` (decisão
      tomada antes de construir): mesmo menu, só muda o gesto que abre
      e a origem do posicionamento — no modo `"context"`, um gatilho
      virtual de tamanho zero no ponto do clique direito reaproveita o
      `computePosition` do `Popover` (agora exportado) sem duplicar a
      conta de flip/clamp. Foco real percorre os itens (`role="menu"`/
      `"menuitem"`, setas/Home/End/Esc) — diferente da listbox do
      `Select`, que usa `aria-activedescendant` e mantém o foco no
      gatilho. Bug achado ao testar: o painel nasce com
      `visibility: hidden` até a posição ser calculada (mesmo truque
      do Popover, pra não piscar no lugar errado) — chamar `.focus()`
      num elemento ainda oculto é um no-op silencioso, então o efeito
      que foca o primeiro item precisava esperar `pos` sair de `null`,
      não só `open` virar `true` (com uma ref pra só focar uma vez por
      abertura, senão cada reposição por scroll/resize puxava o foco
      de volta). 50 componentes (era 49).
- [x] Três correções de CSS achadas via feedback direto:
      - `Tabs`: `.ms-tabs__list` tinha `overflow-x: auto` sem
        `overflow-y` explícito — por especificação, o navegador
        computa o eixo que falta como `auto` também, e o indicador
        (`bottom: -1px`) bastava pra abrir um scroll vertical
        indevido no container. `overflow-y: hidden` explícito
        resolve.
      - Hover do polegar (`outline: 8px solid var(--color-border)`)
        virou token (`--switch-hover-ring`, `tokens.css`) — existia só
        no `ThemeSwitch`; replicado no `Switch` genérico
        (`.ms-toggle:hover:not(:disabled)::after` — o polegar aqui é
        `::after`, não elemento próprio, então o hover é escutado no
        `<input>` e aplicado no pseudo-elemento).
      - `Input`/`Textarea` no foco desenhavam dois anéis concêntricos:
        a regra global de foco (`.ms-page :is(...):focus-visible`)
        sempre venceu qualquer coisa em `.ms-input:focus` — o `:is()`
        carrega a especificidade do argumento mais específico da
        lista (`[tabindex]`, seletor de atributo), então bate
        `.ms-input:focus` mesmo com `outline: none` declarado ali.
        Duas tentativas incompletas: primeiro `border-color` accent +
        `box-shadow` por cima do outline global (três camadas);
        removido o `box-shadow`, sobrou `border-color` accent ainda
        por cima do outline global (dois anéis, vão visível entre eles
        por causa do `outline-offset`). Correção real: `.ms-input:focus`
        não mexe mais em `border-color`/`box-shadow`, só cancela o
        anel nativo do navegador — o anel visível é só o da regra
        global, um só. Ganhou hover
        (`background: var(--color-surface-hover)`, padrão do resto do
        sistema).
- [x] Rodapé do styleguide (`styleguide/App.tsx`) mostra a versão da
      biblioteca: `import { version } from "../package.json"` (esbuild
      importa JSON nativamente) em vez de string solta no texto, pra
      nunca dessincronizar de release em release. Só o styleguide, não
      é API nova exportada pela biblioteca.

### v1.4.0 — lançada em 2026-08-05

- [x] Corrigido: 24 links de exemplo do styleguide (`styleguide/stories.tsx`)
      usavam `href="#"` em botões/links sem função real (CTAs do Hero,
      grid de Botões, Lista de links, Ícones, ações dentro de Card,
      CTAs do Card de precificação, gatilho do Popover, crédito do
      Rodapé) — como o styleguide roteia por hash (`useHashRoute`),
      isso navegava pra primeira story e desmontava a story atual,
      quebrando o fluxo de quem só estava testando o componente.
      Trocado por `href="#<id-da-própria-story>"`: autorreferente, não
      muda o hash, não desmonta nada. Mesmo achado corrigido em
      `examples/next-app/app/page.tsx` (crédito do rodapé).
- [x] Auditoria de tokens em indicadores pequenos (bullets, pontos de
      etapa, marcadores) e texto sobre superfície sólida — achou 5
      lugares repetindo `#ffffff` cru sem token (`Button` solid,
      `Pagination` ativa, badge do sino, ícone do `Alert`, placeholder
      do `Avatar`), 2 componentes repetindo o tamanho 8px/24px do
      bullet/ponto sem token (`Carousel`, `StepModal`), 2 repetindo
      10px do marcador pequeno (`Legend`, histórico de alertas), e a
      família de brancos/pretos translúcidos do `Carousel` em modo foto
      sem token nenhum. Tokens novos em `tokens.css`: `--dot-size`/
      `--dot-size-active`, `--indicator-size`, `--color-on-solid`/
      `--color-on-highlight` (a exceção — highlight é claro demais pro
      branco), `--carousel-overlay-*`. Zero mudança visual.
- [x] `Modal` ganha a prop `headerExtra` — conteúdo extra no cabeçalho,
      mesma linha do título, empurrado à direita pelo `flex: 1` do
      título antes do botão de fechar. Achado real de um consumidor da
      lib: `.ms-modal__body` tem `overflow-x: hidden` (reserva de
      espaço da barra de rolagem), então qualquer coisa com hover que
      cresce além da própria caixa (`HoverEdge`) ficava cortada se
      entrasse ali junto com `children` — `.ms-modal__head` não tem
      essa restrição. Nova classe `.ms-modal__head-extra`.

### v1.5.0 — lançada em 2026-08-05

- [x] `Splash` ganha a prop `instant` — pula a revelação e mostra a
      composição final assim que `ready`. Achado real de um consumidor:
      uma instância `inline`+`persistent` montada dentro de uma seção
      que sai/entra de novo (navegação por estado, sem router) replay
      a animação inteira a cada remontagem, porque o CSS reage à classe
      `.ms-splash--ready` aparecendo num elemento novo — não existe
      "primeira vez" do ponto de vista do navegador. `instant` soma
      `.ms-splash--instant` (que já existia, mas só desligava
      `transition`/`animation` sem fixar a posição final) com uma nova
      regra `.ms-splash--ready.ms-splash--instant .ms-splash__word {
      transform: none }`, que força o assentamento sem repetir a
      choreo.
- [x] `LogoMark` ganha a prop `part` (`"full" | "word"`) — `"word"`
      renderiza só o nome (letras + rosto no "o"), `viewBox` recortado
      sem a área do dirigível, já assentado numa posição final estática
      via `.ms-logo--word` (não depende de `.ms-splash--ready`). Antes
      a `LogoMark` só funcionava dentro da `Splash`; esse variant
      resolve o caso de uso solto (ex.: marca de navbar) sem duplicar a
      lógica de montagem — o `viewBox` foi medido com `getBBox()` no
      grupo `.ms-splash__word` já assentado, não estimado a mão.

### v1.6.0 — lançada em 2026-08-06

- [x] `StepIndicator` (`src/components/StepIndicator.tsx`) — extraído do
      rodapé do `StepModal` (pontos em pill ou texto "Etapa X de Y",
      `showCount`). Achado real de um consumidor: precisava do mesmo
      padrão de paginação fora de um modal (galeria paginada em vez de
      scroll — regra de "nunca scroll interno" do projeto consumidor,
      arquitetura.md dele). `StepModal` agora só consome o componente
      (`<StepIndicator current={current} total={steps.length}
      onChange={go} showCount={showCount} />` no lugar do JSX inline),
      sem mudança de comportamento ou API própria. CSS renomeado de
      `.ms-modal__dots`/`__dot`/`__count` pra `.ms-step-indicator__*`
      (interno, não é API pública — sem impacto em quem só usa
      `StepModal`). Nova prop `label` (`"Etapa"` por padrão) parametriza
      a palavra usada no texto/rótulos de acessibilidade, pra caber em
      contextos como "Página" numa galeria. Revisão do
      `design-system-maintainer` achou um item obrigatório antes de
      fechar: `className`/`{...rest}` não estavam sendo repassados pro
      elemento raiz (regra fixa "Props sempre repassadas") — corrigido
      com `StepIndicatorProps extends Omit<React.HTMLAttributes<
      HTMLElement>, "onChange">` (o `Omit` evita colidir com o
      `onChange` nativo do DOM, já que a prop própria tem assinatura
      diferente: `(index: number) => void`).

### v1.7.0 — lançada em 2026-08-06

- [x] `Gallery` ganha `itemsPerPage` (`src/components/disclosure.tsx`) —
      pagina a grade com `StepIndicator` (`showCount`, `label="Página"`)
      em vez de crescer em altura; sem a prop, comportamento idêntico ao
      de antes. Achado real: consumidor tinha reimplementado uma grade
      "parecida com Gallery" do zero (sem filtros/badges/cores de
      categoria) só porque a versão original não paginava — resultado
      visualmente nada a ver com a identidade do componente real.
      `filtered`/`totalPages`/`visibleItems` recalculados a cada render
      (arrays pequenos, sem necessidade de `useMemo`); dois `useEffect`
      pequenos mantêm a página válida ao trocar de filtro ou
      `itemsPerPage` encolher num reflow responsivo.

### v1.8.0 — lançada em 2026-10-16

- [x] Contraste de texto sobre superfície sólida de marca
      (`src/styles/tokens.css`, `src/styles/components.css`) — `Button
      variant="solid"`, `Alert` (6 de 8 tons) e `Pagination` ativa
      mediam abaixo de 4.5:1 com `--color-on-solid` branco fixo
      (achado real via `axe-core`). `--color-on-accent`/
      `--color-on-danger` (novos, `#1a1a2e` — mesmo valor de
      `--color-on-highlight`) resolvem accent/danger; o ícone do
      `Alert` usa esse par como padrão do próprio componente, cobrindo
      success/orange/gray de graça (mesmo valor, sem token dedicado).
      `pink` (único caso sem solução só de texto — falha nos dois
      sentidos com o tom -500) trocou o fundo do ícone pra `pink-600`
      com texto branco. `violet` não precisou de nada.
- [x] `Drawer` (`src/components/drawer.tsx`) — painel fechado ganha
      `visibility: hidden` (mesmo truque de delay que o véu de fundo
      já usava) — antes só saía da tela por `transform`, então
      continuava alcançável por Tab mesmo fechado, inclusive onde o
      gatilho que abre o painel nunca aparece.
- [x] `TooltipProvider` ganha `focusin`/`focusout` (`src/components/charts.tsx`)
      — somados a `pointerover`/`pointermove`/`pointerout`, mesmo
      listener delegado na `window`. Achado real de um consumidor
      (valnezJrLP): `data-tip` num elemento focável nunca aparecia por
      teclado, só com mouse. `place()` (interno, não exportado)
      refatorado pra receber coordenadas em vez de `PointerEvent` —
      evita duplicar clamp/offset entre os dois caminhos; ponto de
      ancoragem é o cursor pro ponteiro, o canto inferior-esquerdo do
      próprio elemento (`getBoundingClientRect()`) pro foco. Duas
      correções extras achadas pelo `axe-core` na sequência: `role`/
      `id` do `<div role="tooltip">` só entram quando há tooltip ativo
      (antes existia sempre, vazio — viola ARIA); `aria-describedby`
      liga o elemento focado ao tooltip (antes só existia visualmente,
      nunca chegava a leitor de tela pelo caminho de foco). Zero
      mudança de API pública.
- [x] `Gallery` com `itemsPerPage` — corrigido o bounce de entrada
      (`ms-gallery-in`) não repetir ao trocar de página
      (`src/components/disclosure.tsx`). A `key` de cada item era só a
      posição dentro da página atual (`0..itemsPerPage-1`), estável entre
      páginas — o React reaproveitava os mesmos nós ao invés de montar
      novos, e a animação (só dispara no mount) nunca rodava de novo,
      diferente da troca de filtro (que já força remount ao mudar a
      lista inteira). `key` passa a incluir `currentPage`. Achado real de
      um consumidor pedindo "as animações de transição padrão do design
      system" pra paginação.
- [x] `Gallery` ganha `onClick` por item (`GalleryItem.onClick`,
      `src/components/disclosure.tsx`) — o card vira `<button>`
      (`.ms-gallery__item-trigger`, reset próprio de `<button>` nativo)
      quando definido; sem ele, item continua só visual. Achado real:
      consumidor queria abrir o case completo (um PDF) por cima da
      página ao clicar num item do portfólio — igual à exibição de um
      `Modal` (véu com blur, fecha no X ou clique fora), mas a
      `Gallery` não tinha nenhum jeito de saber que um item foi
      clicado. `Gallery` só expõe o clique; quem usa decide o que abre.
- [x] `Modal` ganha `size="full"` (`src/components/Modal.tsx`,
      `.ms-modal--full`) — preenche quase toda a viewport
      (`width`/`height: 100%` explícitos, diferente de `sm`/`lg`, que só
      têm `width` e encolhem em altura pro tamanho do próprio conteúdo
      via `max-height`). Achado real: o `Modal` de `size="lg"` (880px)
      abrindo um PDF (`Sobre.tsx`, decisão #24 do valnezJrLP) ficava
      pequeno demais pra leitura confortável. `.ms-modal__body` já é
      `flex: 1` — com `height: 100%` no `.ms-modal`, um
      `<iframe>`/imagem com `height: 100%` dentro passa a preencher o
      espaço de verdade, não uma altura chutada em `vh`.
- [x] `Dock` (`src/components/navbar.tsx`) — navegação principal de app:
      coluna de ícones em pílula (Navbar) que expande para painel no formato do Sidebar
      (largura do `Sidebar`, par espacial na animação). Rótulo fica no DOM
      como nome acessível; recolhida, o tooltip assume a leitura visual
      (pede `TooltipProvider`). Abaixo de 720px vira um botão no lugar,
      que abre a navegação no `Drawer` — decisão do autor: barra de
      ícones não comporta os destinos de um app. Primeiro componente com
      ícone obrigatório; ícone chega como `ReactNode`. 51 componentes
      (era 50).
- [x] `Grafo3D` (`src/3d/`, entrada `mothership-ds/3d`) — primeiro
      componente 3D. three.js puro, **sem react-three-fiber**: o r3f 8 só
      aceita React 18 e o r3f 9 só React 19, e o DS promete os dois.
      `three` é peer opcional; o pacote principal continua sem dependência
      de runtime. Cena imperativa em `cena.ts`, montada uma vez; o React só
      entrega dados e seleção. Layout `layoutForca3D` puro e testado com
      `node --test` (`npm test`). Texto (rótulos, legenda) é HTML por cima
      do canvas, para herdar fonte e tema. Cada nó tem três posições:
      `posicoes` (layout), `atual` (indo rumo ao layout ou ao anel do
      filtro) e `exibida` (atual + respiração); desenho, clique e rótulos
      leem `exibida`. A esfera de colisão do InstancedMesh é fixa e larga,
      porque os nós se movem a cada quadro. 52 componentes (era 51).
- [x] Temas: claro em off-white quente (creme, accent laranja lavado),
      tema `"darker"` no `ThemeProvider`, `--color-accent-text` (accent
      como texto/foco com AA nos três temas) e `ThemeMenu`
      (`src/components/theme.tsx`, seletor dos três temas num
      `DropdownMenu`, com `DropdownMenuItem checked`). `ThemeSwitch`
      segue exportado, só claro/escuro. 53 componentes (era 52).
      Valores e contrastes no CHANGELOG § 1.8.0.
- [x] `Select`/`Combobox` com a lista em portal no `<body>`
      (`src/components/select.tsx`), posicionada pelo clamp do
      `Popover`, camada 700; abre para cima quando não cabe embaixo.
      `isInOwnedPortal` (`popover.tsx`) impede um `Select` dentro de um
      `Popover` de fechar o `Popover` ao escolher.
- [x] Menores, detalhados no CHANGELOG § 1.8.0: tokens de sombra e
      opacidade, `--font-mono` (Maple Mono), par espacial
      `--transition-spatial`/`--ease-spatial`, capítulo `docs/3d.md`,
      `Gallery` com `addedAt`/`newDays`/`sortable`, e `.ms-portal-root`
      — portais no `<body>` herdavam a fonte/cor padrão do navegador
      por estarem fora do `.ms-page`.

### v1.9.0 — lançada em 2026-10-16

- [x] Tokens dos quatro gestos de movimento (`src/styles/tokens.css`):
      `--motion-<gesto>-ease`/`-duration` para assentar (bounce, 0.3s),
      recolher (`--ease-spatial` espelhado no tempo, 0.15s), pulso
      (bounce, 0.2s) e deriva (linear, sem duração). Sob
      `prefers-reduced-motion`, as durações viram `0.01s` no próprio
      token. Regra "assentar ao entrar, recolher ao sair" em
      `docs/movimento.md`; demo lado a lado na story de Efeitos. Exceção
      (D1): o que
      já está em cena e só muda de forma (Dock expandindo, câmera do
      Grafo3D) segue no par `--transition-spatial`/`--ease-spatial`.
- [x] Componentes migrados para os gestos (ticket 05): entra assentando,
      sai recolhendo, clique pulsa. Popover, DropdownMenu,
      Select/Combobox e histórico de alertas, que sumiam na hora, ganham
      saída via `usePresence` (`src/components/presence.ts`, interno),
      que lê a duração do próprio token. Accordion e Drawer deixam de
      fechar com overshoot. D2: itens da `Gallery` recolhem antes da
      leva nova assentar, hover reativo assenta/recolhe, trilho do
      `Carousel` vai pro par espacial. Fora: valores de gráfico,
      Splash/Loader (ver auditoria no ticket 05).
- [x] `--gradient-active` (ticket 06): gradiente da logo como sinal de
      ativo, uso exclusivo. Preenche indicador das `Tabs`, ponto do
      `StepIndicator` e `Switch` ligado; vira anel (máscara do
      `.ms-hover-edge`, no `::before`) no item atual de Navbar/Sidebar/
      Dock e no `Card` com a prop nova `selected`. Claro usa
      `accent-700`/`pink-600`/`orange-600` (o `accent-600` não chega a
      3:1 no creme). No Sidebar, anel só em quem tem `aria-current`.
      `Navbar` passa a marcar o link atual com `aria-current`.
      Depois da validação (D3): contorno de Checkbox/Radio marcados
      (preenchimento em `--color-text`), borda dos
      campos focados (única exceção ao foco sólido, via fundo em camadas
      `--gradient-field-ring`, já que `<input>` não tem `::before`) e
      rótulo da opção selecionada em `--gradient-active-text`
      (≥4.5:1; no hover do escuro volta a `--color-text`). Item atual de
      Sidebar/Dock perde o azul: vidro branco + anel, como a Navbar.
- [x] Peso de exibição (ticket 07): `--font-weight-display` (600) e
      `--text-display` (48px), utilitário `.ms-display`. Só no valor do
      `StatTile` e no título do `Hero` (teto cai de 56px para 48px).
      `ProgressRing` fica de fora: o número mora dentro do anel, 48px
      não cabe. Outfit 600 entra na URL do styleguide, exemplo e README.
      `HeroHighlight` sai do ciano pastel para `--gradient-active-text`
      (D4): no claro dava ~2:1, e destoava da marca nos dois temas.
- [x] `Mascote` (`src/components/Mascote.tsx`, sem `"use client"`,
      ticket 08): rosto da logo em `piscando`/`procurando`/`confuso`/
      `pensando`, `size`, `label` opcional (sem ele, `aria-hidden`).
      Esboço em `.scratch/identidade-v1.9/mascote/`. Sorriso no
      gradiente da logo, esclera na `--ms-logo-ink` (D5). `dormindo`,
      do spec, saiu: de olho fechado o rosto perde a massa do anel (D6). Paths do rosto extraídas
      para `face-paths.ts` (sem diretiva), usadas também pelo `Loader`:
      importar de um módulo `"use client"` quebraria o Mascote no
      servidor. 54 componentes (era 53).
- [x] `EmptyState` (`src/components/EmptyState.tsx`, sem `"use client"`,
      ticket 09): ilustração (padrão `Mascote` `procurando`; o
      `dormindo` do ticket saiu em D6; escolha em D7), título, descrição, `action`,
      `compact`. Vira o vazio da `Table` e da `Gallery` (o `emptyState`
      delas, quando texto, vira o título; a `Gallery` ganha a prop) e
      do histórico de alertas (`compact`, `piscando`). Vazio da
      `Gallery` recolhe na troca de vista, como os itens. A listbox de
      `Select`/`Combobox` segue só texto: é uma linha da lista. 55
      componentes (era 54).
- [x] `Tooltip` (`src/components/Tooltip.tsx`, sem `"use client"`,
      ticket 10): `<Tooltip content>` em volta do gatilho. Não desenha
      nada: é um `<span data-tip>` com `display: contents`, então o
      renderizador é o do `TooltipProvider`, um só para os dois
      caminhos. Para isso o Provider passou a pôr o `aria-describedby`
      no elemento *focado* (não no dono do `data-tip`, que no `Tooltip`
      é o wrapper) e a ancorar no focado quando o dono não tem caixa.
      De quebra, o `aria-describedby` de quem consome deixa de ser
      sobrescrito: o id do tooltip entra somado e sai sozinho.
      56 componentes (era 55).
- [x] `Prose` (`src/components/Prose.tsx`, sem `"use client"`, ticket
      11): HTML já convertido de markdown (`html`) ou JSX (`children`)
      no ritmo do sistema. Não converte nem sanitiza. Devolve, só dentro
      de `.ms-prose`, margens e marcadores que o reset da `.ms-page`
      tira — mesma especificidade, declarado depois. Cobre o
      `src/telas/prosa.css` provisório do Ambiente; o `h1` escondido de
      lá é regra daquela tela e segue local. Token novo
      `--line-height-prose` (1.6, o valor do Ambiente). 57 componentes
      (era 56).
- [x] Auditoria `axe-core` (ticket 12): as 57 stories nos três temas,
      a 1280px e 390px, comparadas com o build da v1.8.0. Nenhuma
      violação nova. Três herdadas corrigidas de passagem: badge do
      `PricingCard` com `#fff` cru (2.5:1, vira `--color-on-accent`),
      `region` do Accordion sem nome (`aria-labelledby` no cabeçalho) e
      `aria-expanded` no gatilho do `DropdownMenu` em modo `"context"`.
      Ficam as das stories que repetem `Navbar`/`Breadcrumbs` na mesma
      página (`landmark-unique`) e o `label-content-name-mismatch` do
      badge da `Dock`. Texto em gradiente (`background-clip: text`)
      o axe não mede; os contrastes vêm de D3/D4.

### v2.0.0 — lançada em 2026-10-24 (spec em `.scratch/temas-v2/`)

- [x] Temas em dois eixos (D8): `theme` (`"glass" | "cream" |
      "paperpen" | "flat"`) × `mode` (`"base" | "dark" | "system"`).
      `ThemeProvider` com `defaultTheme`/`defaultMode`/`persist`;
      `useTheme()` com `theme`, `mode`, `resolvedMode`, `setTheme`,
      `setMode`, `toggleMode` (o `toggle` saiu). Lógica pura em
      `src/components/theme-state.ts` (sem React, testada com
      `node --test`): leitura do `persist` (converte a chave `ms-theme`
      da v1), resolução do `"system"`, rótulos dos temas e a regra do
      ícone por par (`iconeDoModo`, repetida à mão no `--icon-switch`). No `<html>`, `data-ms-theme` e
      `data-ms-mode` (o resolvido) no lugar de `.light`/`.darker`.
      `"system"` lido com `useSyncExternalStore`, para não sair um frame
      em base com o SO escuro.
- [x] `ThemeSwitch` alterna o modo dentro do tema. `ThemeMenu` com os
      oito pares (um grupo rotulado por tema) e "Seguir o sistema" no
      topo; ícone do gatilho e do polegar por par (regra em
      docs/componentes.md § ThemeMenu).
- [x] Mothership Cream escuro (D10, papel âmbar meio-tom com os glows),
      Mothership Paperpen (D9/D11, papel e caneta, Patrick Hand/Homemade
      Apple, que quem usa carrega) e Mothership Flat (D12, neutro, sem
      vidro). Tokens novos sem efeito nos outros temas:
      `--font-family-display`, `--font-mono-style`, `--bg-texture`,
      `--fill-solid`, `--paper-line`, `--color-border-surface`,
      `--color-field`.
- [x] Styleguide: story "Temas" (grade 4×2, linha = tema, coluna =
      modo; um `<iframe>` por par — os
      tokens do Glass base moram no `:root`, então um par não se aplica
      a um trecho da página). Docs: `docs/tokens.md` § Temas e § Fontes
      do Paperpen, `docs/componentes.md` § ThemeProvider/ThemeMenu,
      README § Temas, guia `docs/migracao-v2.md`, CHANGELOG § 2.0.0.
      `src/reset.css` ganha o Flat e o Cream base no `--bg-base` real.
- [x] Busca no styleguide (`styleguide/App.tsx`): `Combobox` no
      cabeçalho, com opções já filtradas e ordenadas por peso (título e
      `keywords` antes do texto de apoio; o `filter` do Combobox só
      responde sim/não). Busca sem acento nem caixa. `keywords` (opcional
      em `Story`) leva o nome do export quando o título é em pt-br —
      story nova com título diferente do componente precisa dele. `/` ou
      Ctrl+K focam. O Combobox remonta (`key`) depois da escolha para o
      campo voltar vazio.
- [x] Auditoria `axe-core` (ticket 06): 58 stories nos oito pares, a
      1280px e 390px, contra o build da v1.9.0 (pares com equivalente
      contra o mesmo par; os novos contra a união dos três temas da
      v1.9 na mesma story). Tema aplicado direto nos atributos do
      `<html>` e conferido a cada story. Nenhuma violação nova. Corrigida
      a herdada `scrollable-region-focusable` no `<main>` do styleguide
      (`tabIndex={0}`, também na receita de SPA em docs/componentes.md):
      sem nada focável, o painel não rolava pelo teclado. Ficam o
      `landmark-unique` de Navbar/Breadcrumbs e o `<pre>` do `Prose` a
      390px (rola na horizontal; o `tabIndex` teria de vir do HTML de
      quem usa).

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

Não existe `npm run build`. `npm test` roda só a lógica pura
(`node --test`: layout do `Grafo3D`, estado de tema). O pacote é
distribuído como fonte (sem etapa de build — ver ARCHITECTURE.md) e a
validação é visual, no styleguide, nos oito pares de tema (`ThemeMenu`)
e abaixo de 720px.

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
  handler fica sem a diretiva (hoje `primitives.tsx`, `LogoMark.tsx`,
  `Mascote.tsx`, `EmptyState.tsx`, `Tooltip.tsx` e `Prose.tsx`). Detalhe: ARCHITECTURE.md § Fronteira servidor/cliente.
- **IDs de SVG sempre via `React.useId()`.** Nunca um contador de
  módulo — quebra a hidratação. Todo componente com SVG referenciado
  por `url(#...)` já segue isso (Loader, LogoMark, Mascote, Modal, charts,
  disclosure, navbar).
- **`position: fixed` sempre em portal no `<body>`.** Modal, menu da
  navbar, toasts/histórico, tooltip. Um ancestral com
  `backdrop-filter` quebraria o posicionamento.
- **Sem reset global.** Tudo escopado em `.ms-page`; a lib não pode
  reescrever o CSS de quem a instala.
- **Estado nunca só por cor.** Sempre `aria-*` junto. Detalhe:
  ACCESSIBILITY.md.
- **Tema por atributo, nunca por classe.** CSS de tema mira
  `[data-ms-theme="x"]`/`[data-ms-mode="dark"]`; o Glass base é o
  `:root` (sem atributo). Token novo ganha valor nos oito pares, com o
  contraste medido no comentário; tema novo também entra em
  `src/reset.css`. Nomes nas docs e na interface: "Mothership
  Glass/Cream/Paperpen/Flat", "Base"/"Escuro" — nunca "claro"/"Darker".
  Detalhe: TOKENS.md § Cores semânticas.

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

## Agent skills

### Issue tracker

Local markdown: tickets, specs e mapas do wayfinder ficam em `.scratch/<esforço>/`. Ver `docs/agents/issue-tracker.md`.

### Triage labels

Rótulos padrão da `triage` (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), gravados na linha `Status:` dos tickets. Ver `docs/agents/triage-labels.md`.

### Domain docs

Layout Mothership: decisões em `docs/decisoes.md` (criado na primeira decisão), glossário em `docs/glossario.md`. Ver `docs/agents/domain.md`.
