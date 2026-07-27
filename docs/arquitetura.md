# Arquitetura

As decisões técnicas do sistema e o motivo de cada uma. Boa parte delas
foi tomada depois de esbarrar no problema — os casos estão registrados
aqui para não se repetirem.

## Origem

O sistema nasceu de uma página pessoal em HTML/CSS puro: um agrupador de
links com fundo em foto, glassmorphism e tema claro/escuro. Os tokens
foram extraídos daquele CSS — as medidas que já se repetiam viraram a
escala de espaçamento, as duas cores de destaque viraram a base da
paleta, o `backdrop-filter` virou `--blur-glass`.

Três bugs do CSS original foram corrigidos na extração: uma variável
`--surface-color` que nunca existiu, um `backdrop-filter: blur 4px` com
sintaxe inválida (faltavam os parênteses) e um `class="ight"` no HTML.

Os fundos, originalmente duas fotos JPEG, foram recriados como gradientes
CSS com as cores amostradas pixel a pixel das imagens — o que eliminou
duas requisições, o breakpoint que trocava a foto mobile pela desktop, e
tornou o fundo animável.

## Distribuição como código-fonte

O pacote não tem etapa de build: `main` e `types` apontam para
`src/index.ts`.

O motivo é a diretiva `"use client"`. Empacotadores costumam perdê-la ou
colocá-la no lugar errado ao concatenar módulos, e o resultado é um erro
de servidor difícil de diagnosticar. Distribuir o TSX cru transfere a
transpilação para o bundler da aplicação, que já sabe lidar com isso —
daí o `transpilePackages` no Next.

O custo é exigir esse ajuste de configuração. Para uma biblioteca de uso
interno, é uma troca boa.

## Fronteira servidor/cliente

Componentes puramente visuais (`primitives.tsx`) ficam **sem**
`"use client"` — continuam renderizáveis no servidor. Só os arquivos que
usam estado, efeito ou handler levam a diretiva.

Duas armadilhas de hidratação foram corrigidas ao longo do caminho:

**IDs de SVG.** Um contador de módulo (`let uid = 0`) parece inofensivo,
mas vive no processo do servidor e persiste entre requisições — o
servidor emite `id="ms-loader-57"` e o cliente calcula `ms-loader-1`.
Como esses IDs são referenciados por `mask="url(#…)"` e `fill="url(#…)"`,
a divergência quebra o visual. A solução é `React.useId()`, sempre.

**Leitura de `localStorage`.** O `ThemeProvider` com `persist` só lê a
preferência depois da hidratação. Ler durante o render faria o HTML do
servidor divergir do primeiro render do cliente.

## Portais e `position: fixed`

Tudo que é `position: fixed` — modal, menu da navbar, toasts, tooltip —
é renderizado em portal no `<body>`.

O motivo é uma regra do CSS que morde justamente este sistema: um
ancestral com `transform`, `filter`, `backdrop-filter` ou `will-change`
vira o bloco de contenção dos descendentes fixos. Como o design system
usa `backdrop-filter` à vontade, um elemento fixo renderizado dentro da
árvore ancoraria no lugar errado.

O menu da navbar tem um motivo extra: `backdrop-filter` aninhado dentro
de outro `backdrop-filter` não se aplica. Renderizado dentro da navbar, o
menu ficava sem o vidro; no `<body>`, o efeito funciona — o JS calcula a
posição sob o header ao abrir.

## Escala de z-index

```
navbar-menu   99      modal        500
navbar       100      toasts       600
splash      1000      histórico    610
                      tooltip      700
```

Toasts e histórico ficam **acima** do modal de propósito: uma notificação
disparada com um diálogo aberto precisa continuar visível.

## A biblioteca não invade o app

Uma folha de estilos distribuída não pode reescrever o CSS de quem a
instala. Duas coisas garantem isso:

- **Sem reset global.** O `box-sizing` e a zeragem de margens valem só
  dentro de `.ms-page`. Quem quiser o reset completo importa
  `mothership-ds/reset.css`, explicitamente.
- **Herança em vez de força bruta.** A cor e a fonte são declaradas em
  `.ms-page` e herdadas; só os controles nativos (que não herdam sozinhos)
  são instruídos. A alternativa — `.ms-page * { color: … }` — forçava a
  cor em cada nó e obrigava a biblioteca a usar `!important` para se
  corrigir.

Pelo mesmo princípio, as classes `.fil*` da logo (herdadas do arquivo do
CorelDRAW) saíram de um `<style>` dentro do SVG: um `<style>` inline em
SVG **não é escopado**, e aquelas regras vazavam para o documento inteiro.

## CSS: escolhas que exigiram investigação

**`overflow-x: clip` vs `hidden`.** O painel que entra no `StepModal`
desliza no eixo X e transbordaria. Com `hidden` a barra some, mas o
transbordo continua existindo (dá para arrastar com trackpad). `clip`
corta sem criar área rolável — mas o navegador o rebaixa para `hidden`
quando o mesmo elemento rola no outro eixo. A solução foi separar as
responsabilidades em dois elementos: o corpo rola no Y, a grade interna
das etapas corta no X.

**Barra de rolagem.** Definir `scrollbar-width: thin` no Chrome
**desativa** a estilização detalhada dos pseudo-elementos
`::-webkit-scrollbar`. As duas abordagens ficam separadas por
`@supports not selector(::-webkit-scrollbar)`, que na prática entrega as
propriedades padrão ao Firefox e os pseudo-elementos ao resto.

**`max-height: 100%` dentro de grid.** Uma faixa de grid com altura
automática cresce para caber o conteúdo, e então `100%` resolve contra
essa altura já esticada — a restrição vira circular e não limita nada. A
correção é `grid-template-rows: minmax(0, 1fr)`.

**`fill: transparent` não recebe eventos.** Os alvos de hover invisíveis
dos gráficos precisam de `pointer-events: all`: um preenchimento
transparente não conta como "pintado" para o teste de acerto.

**`drop-shadow` cortado.** O brilho do anel de progresso era cortado no
limite do viewport do SVG; `overflow: visible` no elemento resolve.

## Acessibilidade

- Estado sempre marcado com `aria-*` além da cor: `aria-expanded` no
  accordion e no hambúrguer, `aria-current` nos passos e breadcrumbs,
  `aria-checked` no switch de tema.
- **Foco visível** em todos os controles: um anel accent `:focus-visible`,
  já que o anel padrão do navegador some sobre as superfícies de vidro.
- **Modal**: foco entra no diálogo ao abrir, circula dentro dele com Tab
  e volta ao gatilho ao fechar. `aria-labelledby` aponta para o título.
- **Toasts**: o container da região viva fica sempre no DOM — leitores de
  tela só anunciam conteúdo inserido em containers que já existiam.
- **Cores de dados** validadas por script contra daltonismo (ΔE CVD ≥ 8),
  visão normal (ΔE ≥ 15) e contraste (≥ 3:1), separadamente em cada tema.

## Styleguide gerado da biblioteca

O styleguide importa os componentes de `src/` e renderiza os componentes
reais — não há catálogo paralelo que possa divergir do código. Um
componente novo entra com uma entrada em `styleguide/stories.tsx`; a
navegação, o índice e as âncoras se montam a partir dela.

O build usa esbuild direto, sem Storybook: o objetivo era zero
dependência de runtime e um artefato estático que o GitHub Pages serve
sem configuração.
