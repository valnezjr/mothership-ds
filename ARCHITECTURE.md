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
navbar-menu   99      modal        500
navbar       100      toasts       600
splash      1000      histórico    610
                      tooltip      700
```

Toasts e histórico ficam **acima** do modal de propósito: uma
notificação disparada com um diálogo aberto precisa continuar visível.

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
configuração. Publicado automaticamente a cada push em `main`
(`.github/workflows/pages.yml`).

Documentar um componente novo = uma entrada em
`styleguide/stories.tsx` (ver COMPONENT_GUIDELINES.md); navegação,
índice e âncoras se montam a partir do array `STORIES`.
