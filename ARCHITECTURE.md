# Architecture

Referência operacional das decisões técnicas do Mothership DS — o
"o que respeitar" ao editar. A narrativa completa de cada uma, com o
bug que a motivou, está em [`docs/arquitetura.md`](docs/arquitetura.md);
este arquivo é a versão densa para consulta rápida.

## Distribuição como código-fonte

`package.json`: `main` e `types` apontam para `./src/index.ts`. **Não
há etapa de build** — o consumidor transpila (`transpilePackages` no
Next, nativo no Vite).

Motivo: bundlers de biblioteca costumam perder ou deslocar a diretiva
`"use client"` ao concatenar módulos. Distribuir o TSX cru transfere a
transpilação para o bundler da aplicação, que já lida com isso
corretamente.

Implicação prática: nunca introduzir uma etapa de build/transpile no
pacote em si (nem para gerar `.js`, nem para minificar CSS) sem
revisitar essa decisão primeiro.

## Fronteira servidor/cliente

Regra: leva `"use client"` todo arquivo que usa estado, efeito, ref
com comportamento ou handler. Hoje só dois arquivos ficam **sem**
a diretiva, por serem puramente apresentacionais:

- `src/components/primitives.tsx`
- `src/components/LogoMark.tsx`

Todo o resto (`Loader`, `Modal`, `Splash`, `alerts`, `charts`,
`disclosure`, `navbar`, `theme`) tem `"use client"` na primeira linha.

### Duas armadilhas de hidratação já corrigidas — não reintroduzir

**IDs de SVG.** Um contador de módulo (`let uid = 0`) vive no processo
do servidor e persiste entre requisições; o servidor emite um ID e o
cliente calcula outro. Quebra qualquer coisa referenciada por
`mask="url(#…)"` ou `fill="url(#…)"`. Solução fixa: `React.useId()`,
sempre — já em uso em `Loader`, `LogoMark`, `Modal`, `charts`,
`disclosure`, `navbar`.

**Leitura de `localStorage`.** `ThemeProvider` com `persist` só lê a
preferência **depois** da hidratação. Ler durante o render faria o
HTML do servidor divergir do primeiro render do cliente (custo aceito:
um flash na primeira pintura para quem escolheu o tema claro).

## Portais e `position: fixed`

Tudo `position: fixed` — Modal/StepModal, menu da navbar, toasts,
histórico de alertas, tooltip — é renderizado em portal no `<body>`.

Motivo: um ancestral com `transform`, `filter`, `backdrop-filter` ou
`will-change` vira o bloco de contenção dos descendentes fixos. Como o
sistema usa `backdrop-filter` à vontade em superfícies de vidro, um
elemento fixo dentro da árvore ancoraria no lugar errado.

Motivo extra do menu da navbar: `backdrop-filter` aninhado dentro de
outro `backdrop-filter` **não se aplica**. Renderizado dentro da
navbar, o menu perde o vidro; no `<body>`, funciona — o JS calcula a
posição sob o header ao abrir.

### Escala de z-index

```
navbar-menu   99      sidebar-backdrop  150
navbar       100      sidebar-drawer    151
splash      1000      sidebar-toggle    152
modal        500      toasts            600
histórico    610      tooltip           700
                      popover           700
```

Toasts e histórico ficam **acima** do modal de propósito: uma
notificação disparada com um diálogo aberto precisa continuar visível.

`Popover` divide a camada do tooltip (700) — os dois são overlays
leves e flutuantes que não bloqueiam a página como o `Modal` (500);
nenhum dos dois precisa ficar acima do outro porque não faz sentido um
Popover conter um tooltip ativo (ou vice-versa) na prática.

A gaveta da `Sidebar` fica **acima** da navbar de propósito (diferença
do menu da própria Navbar, que fica abaixo dela): a gaveta é a
navegação principal enquanto aberta no mobile, não um apêndice
pendurado embaixo da barra. O botão que abre/fecha fica acima da
própria gaveta, pra continuar clicável como "X" por cima dela.

## A biblioteca não invade o app

- **Sem reset global.** `box-sizing` e zeragem de margens valem só
  dentro de `.ms-page`. Reset completo é opt-in via
  `mothership-ds/reset.css`.
- **Herança, não força bruta.** Cor e fonte são declaradas em
  `.ms-page` e herdadas; só controles nativos (que não herdam sozinhos)
  são instruídos explicitamente. `.ms-page * { color: … }` forçaria a
  cor em cada nó e exigiria `!important` para a lib se corrigir depois.
- As classes `.fil*` da logo (herdadas do export do CorelDRAW) saíram
  de um `<style>` inline dentro do SVG — `<style>` em SVG **não é
  escopado** e vazava para o documento inteiro.

## Gotchas de CSS já resolvidos

| Problema | Causa | Solução aplicada |
|---|---|---|
| Painel do `StepModal` transborda no eixo X | `overflow: hidden` esconde a barra mas não impede arrastar o conteúdo (trackpad) | `overflow-x: clip` — mas o navegador rebaixa `clip`→`hidden` se o mesmo elemento rola no outro eixo, então o corpo rola em Y e a grade das etapas corta em X, em elementos separados |
| Barra de rolagem sem estilo custom no Chrome | `scrollbar-width: thin` desativa os pseudo-elementos `::-webkit-scrollbar` | separar as duas abordagens com `@supports not selector(::-webkit-scrollbar)` |
| `max-height: 100%` não limita nada dentro de um grid | a faixa de altura automática cresce para caber o conteúdo antes de `100%` resolver, virando circular | `grid-template-rows: minmax(0, 1fr)` |
| Alvo de hover invisível em gráfico não recebe eventos | `fill: transparent` não conta como "pintado" para o teste de acerto | `pointer-events: all` explícito |
| `drop-shadow` do anel de progresso cortado no viewport do SVG | limite do viewport recorta o brilho | `overflow: visible` no elemento |

## Styleguide gerado da própria biblioteca

`styleguide/` importa componentes direto de `src/` — não existe
catálogo paralelo que possa divergir do código. Build via `esbuild`
puro (`styleguide/build.mjs`), sem Storybook: zero dependência extra
de runtime, artefato estático que o GitHub Pages serve sem
configuração. Publicado automaticamente a cada push em `master`
(`.github/workflows/pages.yml`).

Documentar um componente novo = uma entrada em
`styleguide/stories.tsx` (ver COMPONENT_GUIDELINES.md); a Sidebar se
monta sozinha a partir do array `STORIES`.

### Nomes de arquivo com hash de conteúdo (produção)

`styleguide/build.mjs`, no build de produção (não em `--serve`),
nomeia a saída como `styleguide-<hash>.js`/`.css` — `entryNames:
"styleguide-[hash]"` do esbuild, com `metafile: true` pra descobrir os
nomes reais e escrever `index.html` depois, apontando pra eles.
`dist/` é limpo (`rmSync`) no início de cada build, pra não acumular
hash antigo.

Motivo: a CDN do GitHub Pages responde `cache-control: max-age=600`
pra qualquer arquivo estático, e sem hash no nome um deploy novo não
muda a URL de `styleguide.js` — o navegador (ou a CDN) podia continuar
servindo a versão de até 10 minutos atrás sem nenhum sinal de que
mudou. Achado real, não hipotético: componentes já publicados não
apareciam pra quem tinha visitado o styleguide antes do deploy mais
recente. Com hash de conteúdo, cada deploy que muda algo gera um nome
de arquivo novo — não tem cache velho pra servir, porque a URL em si
mudou.

`--serve` (desenvolvimento local) mantém nome fixo, sem hash: não há
CDN nem cache de navegador relevante num servidor com watch, e nomear
com hash ali só complicaria o fluxo de live-reload sem benefício.

### Performance do styleguide: uma story por vez, não as 37 juntas

Até a v1.2.2, `App.tsx` renderizava todas as stories na mesma página,
uma rolagem contínua. Com ~37 componentes montados ao mesmo tempo —
`backdrop-filter` em dezenas de painéis de vidro, o parallax do mouse
do `LivingBackground`, marquees rodando, o `Splash` fazendo lint —
a performance degradava visivelmente conforme o catálogo crescia.

A correção começou como código só do styleguide (`App.tsx` virando
uma SPA de fato: só a story ativa montada). O resultado agradou o
suficiente pra virar suporte nativo da biblioteca — três peças,
usáveis por qualquer consumidor, não só por este repo:

- **`useHashRoute`** (`src/components/navbar.tsx`) — estado de "qual
  view está ativa" sincronizado com o hash da URL, sem lib de rotas.
  Um listener de `hashchange` decide o id ativo via `resolve` (padrão:
  bate exato com a lista de `ids` ou cai no primeiro) — o styleguide
  personaliza isso pra "hash de um grupo cai na primeira story dele".
  Isso também dá voltar/avançar do navegador de graça — é só histórico
  de URL, sem estado extra pra sincronizar manualmente. Lido só depois
  da hidratação (mesma cautela do `ThemeProvider` com `localStorage` —
  ver § Fronteira servidor/cliente): o primeiro render é sempre
  `ids[0]`, corrigido pro hash real logo em seguida, pra nunca
  divergir do HTML do servidor em apps com SSR (o styleguide em si não
  precisa disso — é CSR puro — mas o hook é exportado da biblioteca e
  Next.js faz SSR por padrão).
- **`Sidebar` ganha `variant="fill"`** — sem sticky nem teto de altura
  próprio, só estica 100% da altura do pai (`align-items: stretch` do
  flex ao redor faz o resto). Combinada com `active` (controlado por
  fora em vez de detectar por scroll — sem isso a Sidebar não teria
  como saber qual item destacar, já que não há mais nada rolando pra
  detectar via scroll; `spy` desliga sozinho quando `active` é
  passado). A Sidebar também ganhou `scrollIntoView` no item ativo,
  dentro da própria lista — sem isso, navegar pra um item fora da área
  visível não rolava a lista sozinha até lá.
- **`.ms-app-shell`** (`src/styles/components.css`) — utilitário
  opt-in que trava a viewport (`height: 100vh`, `overflow: hidden`,
  coluna flex) em vez de deixar a página crescer. Só o painel de
  conteúdo (normalmente um `<main>` com `overflow-y: auto` próprio)
  rola por dentro; o resto (header, Sidebar `variant="fill"`, footer)
  fica sempre visível.

`App.tsx` também move o foco pro título (`tabIndex={-1}` + `.focus()`)
e zera o scroll do `<main>` a cada troca — mesma prática de qualquer
troca de rota em SPA, pra quem navega por teclado/leitor de tela
perceber que o conteúdo mudou. Isso fica por conta do consumidor (um
`useEffect` simples num `ref`), não é parte da API do hook — o hook só
resolve "qual id está ativo", nada de DOM.

Isso é opt-in em toda a extensão: `Page`/`.ms-page` continuam sendo
uma superfície de rolagem normal por padrão; sem `.ms-app-shell` (ou
sem passar `active`/`variant="fill"` pra Sidebar), nada muda pra quem
já tinha uma página comum.

## Topologia do GitHub Pages

Um repositório tem um único site de Pages, então o styleguide e o
exemplo de landing page dividem a mesma implantação por subcaminho:

```
valnezjr.github.io/mothership-ds/           ← styleguide/dist (esbuild)
valnezjr.github.io/mothership-ds/exemplo/   ← examples/next-app/out (Next export estático)
```

O workflow builda os dois e copia `examples/next-app/out/` para
`styleguide/dist/exemplo/` antes de um único `upload-pages-artifact`.
`examples/next-app` só ativa `output: "export"` e
`basePath: "/mothership-ds/exemplo"` quando a env `GITHUB_PAGES=true`
está setada (só o workflow define isso) — copiar os arquivos do
exemplo para outro projeto não herda esse comportamento.

O `basePath` repete o nome do repo mesmo ele já aparecendo na URL do
Pages: caminhos absolutos (o que o Next gera com `basePath`) resolvem
contra a raiz do **domínio** (`valnezjr.github.io`), não contra a raiz
do site do projeto — só `/exemplo` fazia os assets pedirem
`valnezjr.github.io/exemplo/...` (404) em vez de
`valnezjr.github.io/mothership-ds/exemplo/...`. Descoberto porque o
teste local antes do primeiro deploy simulava a raiz errada (servia
`exemplo/` diretamente na raiz do servidor, sem o segmento do repo por
cima). Ao trocar o subcaminho, atualizar `basePath` em
`examples/next-app/next.config.js` junto com os links no README.
