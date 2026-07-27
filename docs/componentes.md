# Componentes

Referência de props. Todos os componentes aceitam `className` e os
atributos HTML nativos do elemento que renderizam, então `id`,
`data-*`, `style` e handlers funcionam como você espera.

Índice: [Providers](#providers) · [Layout](#layout-e-navegação) ·
[Controles](#controles-e-superfícies) · [Marketing](#marketing) ·
[Interativos](#interativos) · [Alertas](#alertas) · [Dados](#dados) ·
[Marca](#marca)

---

## Providers

Montados uma vez, na raiz. Só o `ThemeProvider` é obrigatório; os outros
habilitam recursos específicos.

```tsx
<ThemeProvider defaultTheme="dark" persist>
  <AlertsProvider>
    <TooltipProvider>
      <LivingBackground />
      {children}
    </TooltipProvider>
  </AlertsProvider>
</ThemeProvider>
```

### `ThemeProvider`

| Prop | Tipo | Padrão | |
|---|---|---|---|
| `defaultTheme` | `"dark" \| "light"` | `"dark"` | tema inicial |
| `persist` | `boolean` | `false` | guarda a escolha no `localStorage` |

Aplica a classe `light` no `<html>`. Com `persist`, a leitura acontece
**depois** da hidratação, para não divergir do HTML do servidor — o custo
é um flash na primeira pintura para quem escolheu o tema claro.

`useTheme()` devolve `{ theme, setTheme, toggle }`.

### `AlertsProvider`

Fornece as notificações e o histórico; monta sozinho o container dos
toasts e o painel de histórico. Veja [Alertas](#alertas).

### `TooltipProvider`

Dá tooltip a qualquer elemento com `data-tip` na árvore — inclusive nós
SVG dentro dos gráficos.

### `LivingBackground`

Anima os glows do fundo. Aceita `config` para calibrar cada glow; veja
[Movimento](movimento.md).

---

## Layout e navegação

### `Page` · `Container`

```tsx
<Page contained>…</Page>
```

`Page` aplica o fundo, a tipografia e as cores do tema. `contained`
embrulha o conteúdo no container de 588px — o mesmo da página original.

### `Navbar`

Pill de vidro flutuante. Largura `calc(100vw − 48px)`, no máximo 1100px.

| Prop | Tipo | Padrão | |
|---|---|---|---|
| `brand` | `ReactNode` | — | marca à esquerda; **sem ela os links centralizam** |
| `brandHref` | `string` | `"#"` | |
| `links` | `{ href, label }[]` | `[]` | |
| `spy` | `boolean` | `false` | marca o link da seção visível |
| `variant` | `"floating" \| "static"` | `"floating"` | `static` renderiza no fluxo |
| `responsive` | `boolean` | `true` | hambúrguer + menu abaixo de 720px |
| `children` | `ReactNode` | — | sino, switch de tema… |

```tsx
<Navbar brand=".valnezJunior()" spy links={[
  { href: "#projetos", label: "Projetos" },
  { href: "#contato", label: "Contato" },
]}>
  <NotificationBell />
  <ThemeSwitch />
</Navbar>
```

Abaixo de 720px os links saem da barra — que passa a dividir o espaço
entre marca, sino e switch — e o hambúrguer abre um menu de vidro logo
abaixo do header. O ícone transiciona de hambúrguer para X.

### `Breadcrumbs`

| Prop | Tipo | |
|---|---|---|
| `items` | `{ label, href? }[]` | o último vira o item atual |
| `glass` | `boolean` | envolve numa pill de vidro |

### `Hero` · `HeroHighlight`

| Prop | Tipo | |
|---|---|---|
| `eyebrow` | `ReactNode` | badge acima do título |
| `title` | `ReactNode` | |
| `subtitle` | `ReactNode` | |
| `actions` | `ReactNode` | fileira de botões |

`HeroHighlight` destaca uma palavra do título com o gradiente da escala
accent.

### `Footer` · `Flash`

`Flash` é o ícone de raio da marca, na cor de destaque.

---

## Controles e superfícies

### `Button` · `ButtonLink`

| Prop | Tipo | Padrão |
|---|---|---|
| `variant` | `"glass" \| "solid" \| "ghost"` | `"glass"` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` |
| `inline` | `boolean` | `false` — largura natural em vez de 100% |

`ButtonLink` renderiza `<a>` com o mesmo visual.

### `IconButton` · `IconRow`

Botão circular. `href` e `aria-label` são **obrigatórios** — um `<a>` sem
`href` não é focável, e um botão só de ícone precisa de nome acessível.

### `Card` · `CardText`

`title` opcional. Combine com `HoverEdge` para o contorno reativo.

### `Badge`

`tone`: `neutral` (vidro, padrão), `accent`, `highlight`, `success`,
`danger`, `violet`, `pink`, `orange`, `gray`.

### `Avatar` · `Profile`

| Prop | Tipo | Padrão |
|---|---|---|
| `size` | `"sm" \| "md" \| "lg"` | `"lg"` (112 / 80 / 48px) |
| `initials` | `string` | exibido quando não há `src` |
| `alt` | `string` | texto alternativo |

### `Field` · `Input` · `Textarea`

`Input` e `Textarea` encaminham `ref`.

### `ThemeSwitch`

Interruptor claro/escuro. Renderiza um `<button role="switch">` com
`aria-checked` — o estado é anunciado, não só visual.

---

## Marketing

Blocos de conversão pra landing pages — adicionados na v1.5.

### `PricingCard`

| Prop | Tipo | |
|---|---|---|
| `title` | `ReactNode` | nome do plano |
| `description` | `ReactNode` | frase curta abaixo do nome |
| `price` | `ReactNode` | valor já formatado — `"R$49"`, `"Grátis"` |
| `period` | `ReactNode` | unidade ao lado do preço — `"/mês"` |
| `features` | `{ text, included? }[]` | `included: false` risca o texto e troca o check por um traço |
| `cta` | `ReactNode` | ação — normalmente um `<ButtonLink>`, fica sempre no rodapé do card |
| `badge` | `ReactNode` | rótulo acima do card (ex. `"Popular"`) — implica `highlighted` |
| `highlighted` | `boolean` | borda e glow accent, sem depender de `badge` |

Combine com `<HoverEdge>` para o contorno reativo, como o `<Card>`.

### `TestimonialCard`

| Prop | Tipo | |
|---|---|---|
| `quote` | `ReactNode` | o depoimento |
| `author` | `ReactNode` | nome de quem depõe |
| `role` | `ReactNode` | cargo e/ou empresa, abaixo do nome |
| `avatar` | `ReactNode` | normalmente um `<Avatar size="sm">` |
| `rating` | `number` | 0–5; omita para não mostrar estrelas |
| `highlighted` | `boolean` | borda e glow accent, para o depoimento em foco |
| `interactive` | `boolean` | contorno reativo no hover/active, padrão `true` |

Identidade (avatar + nome + cargo) sempre no rodapé do card,
independente do tamanho do texto. Já nasce com o contorno reativo
(`interactive`) — não precisa envolver com `<HoverEdge>`. Combine com
`<Carousel items={...}>` para paginar vários depoimentos.

---

## Interativos

### `Accordion`

| Prop | Tipo | |
|---|---|---|
| `items` | `{ title, content, defaultOpen? }[]` | |
| `single` | `boolean` | abrir um fecha os demais |

A expansão anima a altura real do conteúdo (via `grid-template-rows`),
com o bounce do sistema na abertura **e** no fechamento.

### `Carousel`

| Prop | Tipo | |
|---|---|---|
| `slides` | `{ image, caption? }[]` | fotos em tela cheia; `image` aceita `url(...)` ou gradiente |
| `items` | `ReactNode[]` | conteúdo livre por página — ex. um grupo de `TestimonialCard`. Substitui `slides` |
| `autoplay` | `number` | ms entre páginas; interagir reinicia o relógio |
| `arrows` | `boolean` | setas de anterior/próximo; padrão `true`. Os bullets navegam sempre |

O bullet ativo se alonga em pill, mostrando qual página está em
destaque. Com `items`, setas e bullets trocam o branco fixo (pensado
pra foto) pelas cores do tema. Sempre navegável por arraste horizontal
(toque ou mouse), além de setas e bullets.

### `Gallery`

| Prop | Tipo | |
|---|---|---|
| `items` | `{ image, title, description?, categories[] }[]` | |
| `categories` | `{ key, label, tone?, color? }[]` | |
| `allLabel` | `ReactNode` | rótulo do filtro "todos" |

Filtra por categoria; cada item ganha o contorno reativo com as cores das
suas categorias — dois tons quando há duas categorias, a escala 300→600
quando há uma só.

### `Modal` · `StepModal`

| Prop | Tipo | Padrão | |
|---|---|---|---|
| `open` | `boolean` | — | |
| `onClose` | `() => void` | — | |
| `title` | `ReactNode` | — | vira o `aria-labelledby` do diálogo |
| `footer` | `ReactNode` | — | ações à direita |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | 480 / 640 / 880px |
| `dismissable` | `boolean` | `true` | permite fechar no Esc e no clique fora |

Renderiza em portal no `<body>`, trava o scroll do fundo (com contagem de
referências, para modais empilhados), prende o foco dentro do diálogo e
devolve o foco a quem abriu.

`StepModal` acrescenta:

| Prop | Tipo | Padrão | |
|---|---|---|---|
| `steps` | `{ title?, content }[]` | — | |
| `onFinish` | `() => void` | — | chamado ao concluir a última etapa |
| `finishLabel` | `ReactNode` | `"Concluir"` | |
| `showCount` | `boolean` | `false` | "Etapa 2 de 4" em vez dos pontos |

Todas as etapas ficam montadas na mesma célula de uma grade, com as
inativas invisíveis: o modal já nasce com a altura da etapa mais alta e
não muda de tamanho ao navegar.

### `HoverEdge`

Aplica a qualquer superfície o hover do sistema: cresce, projeta sombra e
a borda vira um anel em degradê que gira acompanhando o mouse.

```tsx
<HoverEdge colors={["var(--chart-1)", "var(--color-success)"]}>
  <Card title="Receita">…</Card>
</HoverEdge>
```

| Prop | Tipo | Padrão |
|---|---|---|
| `colors` | `[string, string]` | accent → accent-300 |
| `radius` | `string` | `--radius-md` |
| `lift` | `string` | `-4px` |
| `scale` | `number` | `1.03` |

---

## Alertas

```tsx
const { notify, dismiss, history, unread, toggleHistory } = useAlerts();

notify({
  title: "Sucesso.",
  message: "Operação concluída.",
  tone: "success",
  duration: 20000,
});
```

| Opção | Tipo | Padrão |
|---|---|---|
| `title` | `ReactNode` | — |
| `message` | `ReactNode` | — |
| `tone` | as 9 cores de marca | `"accent"` |
| `duration` | `number` | `20000` |

O toast entra suave, mostra a barra decrescente com o tempo restante e
traz um **X** para dispensar na hora. Todo alerta entra no histórico
(limitado a 50), aberto pelo `<NotificationBell />`, que mostra a
contagem de não lidos.

`<Alert>` cobre o uso estático, em fluxo — mesmas cores, com `onDismiss`
opcional.

---

## Dados

As cores vêm de `--chart-1..4`; veja [Tokens](tokens.md#dados).

### `LineChart`

| Prop | Tipo | |
|---|---|---|
| `series` | `{ name, data[], slot }[]` | `slot` é 1–4 |
| `labels` | `string[]` | eixo x |
| `max` | `number` | teto do eixo y (calculado se omitido) |
| `unit` | `string` | sufixo dos valores |
| `gridLines` | `number` | padrão 5 |

Grade recessiva, linhas de 2px, rótulo direto no fim de cada série e
hover por ponto — a bolinha cresce e ganha halo.

### `Meter`

Barra horizontal. `label`, `value` (0–100) e `slot`. O preenchimento é um
degradê da cor da série até uma versão clara e luminosa; no hover a pill
recebe o contorno reativo.

### `PieChart`

`slices: { label, value, slot }[]`. Fatias com respiro de 2px, rótulos
diretos e legenda. No hover a fatia cresce a partir do centro do gráfico.

### `ProgressRing`

| Prop | Tipo | Padrão |
|---|---|---|
| `value` | `number` | — |
| `caption` | `ReactNode` | — |
| `size` | `number` | `140` |
| `thickness` | `number` | `12` |
| `slot` | `1–4` | `1` |
| `hideValue` | `boolean` | `false` |

### `Sparkline`

`data`, `slot`, `width`, `height`.

### `StatGrid` · `StatTile`

| Prop | Tipo | |
|---|---|---|
| `label` | `ReactNode` | opcional — omita junto com `value` para montar livremente |
| `value` | `ReactNode` | |
| `trend` | `"up" \| "down" \| "flat"` | colore a seta **e** o contorno do hover |
| `delta` | `ReactNode` | texto ao lado da seta |
| `sparkline` | `number[]` | |
| `slot` | `1–4` | |
| `interactive` | `boolean` | contorno reativo, padrão `true` |

No hover, o anel combina a cor da série com a do indicador: verde na
alta, vermelho na queda.

---

## Marca

### `Splash`

| Prop | Tipo | Padrão | |
|---|---|---|---|
| `ready` | `boolean` | — | controlado; omita para o modo automático |
| `minDuration` | `number` | `1800` | tempo mínimo em tela |
| `revealDuration` | `number` | `4600` | quanto a composição final fica em tela |
| `onFinish` | `() => void` | — | chamado ao terminar de sair |
| `persistent` | `boolean` | `false` | não some sozinha |
| `inline` | `boolean` | `false` | preso ao container (que precisa ser `relative`) |

### `Loader`

| Prop | Tipo | Padrão | |
|---|---|---|---|
| `value` | `number` | — | 0–100; omita para o modo indeterminado |
| `size` | `number` | `96` | lado em px |
| `color` | `string` | accent | o topo do degradê é derivado automaticamente |
| `label` | `ReactNode` | — | |
| `showValue` | `boolean` | `false` | exibe a porcentagem |

### `LogoMark`

A logo completa em SVG, com as partes agrupadas para animação e o
gradiente da marca correndo continuamente.
