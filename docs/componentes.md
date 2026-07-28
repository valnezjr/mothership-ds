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

### `Page`

```tsx
<Page contained>…</Page>
```

`Page` aplica o fundo, a tipografia e as cores do tema. `contained`
embrulha o conteúdo num teto de 588px (`--container-max`) — o mesmo da
página original. Não existe um componente `Container` separado: era um
wrapper fino (só a classe `.ms-container`) que nenhum consumidor real
do sistema usava — cada página já define sua própria largura via
`style`/CSS, e via `Page`/`contained` quando quer especificamente essa
largura original. O token `--container-max` continua disponível pra
quem quiser replicar essa largura manualmente.

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

### `Sidebar`

Sumário completo da página: versão mais densa da Navbar, com
subtópicos por seção. A lib não impõe layout — o host posiciona ao
lado do conteúdo (`<div style={{ display: "flex" }}>`).

| Prop | Tipo | Padrão | |
|---|---|---|---|
| `sections` | `{ href, label, items?: { href, label }[] }[]` | — | seção + subtópicos opcionais |
| `spy` | `boolean` | `true` | marca a seção/subtópico visível, como a Navbar. Ignorado se `active` for passado |
| `active` | `string` | — | controla o item ativo de fora (ex. roteamento próprio) em vez de detectar por scroll — desliga o `spy` interno por completo |
| `variant` | `"sticky" \| "fill"` | `"sticky"` | `fill` estica 100% da altura do pai em vez de grudar na rolagem — pra uso num `.ms-app-shell` |
| `toggleLabel` | `string` | `"Abrir sumário"` | nome acessível do botão da gaveta no mobile |

```tsx
<Sidebar sections={[
  { href: "#introducao", label: "Introdução", items: [
    { href: "#instalacao", label: "Instalação" },
  ] },
  { href: "#guias", label: "Guias" },
]} />
```

Desktop: `position: sticky` (`top: 96px`, sob a navbar flutuante),
rolagem própria se o sumário for mais alto que a tela. Abaixo de
720px vira um botão flutuante (canto inferior esquerdo) que abre a
mesma navegação como gaveta, com véu de fundo — clicar fora, Esc ou
um link fecha. Usa o mesmo scrollspy da Navbar (`useScrollSpy`
compartilhado), estendido para também acompanhar os `items` aninhados;
quando um subtópico está ativo, a seção-pai também recebe destaque.
Sempre que o item ativo muda (por scroll ou por `active`), ele rola
pra dentro da área visível da própria lista (`scrollIntoView`) — útil
se a lista for mais alta que o espaço disponível.

Pra um layout de "uma página por vez" (SPA: clique troca o conteúdo
em vez de rolar até ele — como este próprio styleguide), passe
`active` com o item que está na tela e `variant="fill"`; o `spy`
desliga sozinho, nem os listeners de scroll são anexados. Ver
**Layout de SPA: uma seção por vez** logo abaixo pro padrão completo,
com `useHashRoute` e `.ms-app-shell`.

**Monte só uma por página.** O botão e a gaveta do mobile são
`position: fixed` no canto inferior esquerdo — duas instâncias na tela
ao mesmo tempo sobrepõem os dois botões exatamente no mesmo pixel, e o
clique passa a acertar o que estiver por cima, não necessariamente o
que o usuário via. Este próprio styleguide usa uma só, montada a
partir de `STORIES` (`styleguide/App.tsx`).

### `useHashRoute`

Hook que dá o estado de "qual view está ativa" sincronizado com o
hash da URL — sem lib de rotas. É a metade que falta do `active` da
`Sidebar`: ele controla o destaque, este hook decide qual valor passar.

```tsx
const [activeId] = useHashRoute({ ids: ["cores", "tipografia", "efeitos"] });
```

| Opção | Tipo | Padrão | |
|---|---|---|---|
| `ids` | `string[]` | — | ids válidos, sem `#` |
| `resolve` | `(hash: string, ids: string[]) => string` | bate exato ou cai no primeiro | personalize pra casos como "hash de um grupo cai no primeiro item dele" |

Retorna `[id, navigate]` — `id` é a view ativa (sempre um dos `ids`,
nunca um hash inválido), `navigate(id)` troca a URL programaticamente
(ex. um botão "Próximo"; um `<a href="#id">` normal já funciona sem
chamar nada). Voltar/avançar do navegador funcionam de graça — é só
histórico de URL. Lido só depois da hidratação (mesma cautela do
`ThemeProvider` com `localStorage`): o primeiro render é sempre
`ids[0]`, corrigido pro hash real logo em seguida, pra nunca divergir
do HTML do servidor em apps com SSR.

### Layout de SPA: uma seção por vez

O trio `useHashRoute` + `Sidebar` (`active`, `variant="fill"`) +
`.ms-app-shell` monta um layout de app: header e Sidebar fixos, um
painel de conteúdo que troca no clique (não por scroll) e rola por
dentro. É o padrão deste próprio styleguide — motivo documentado em
ARCHITECTURE.md § Performance do styleguide (com dezenas de
componentes animados, montar todos ao mesmo tempo numa rolagem
contínua pesava; só a seção ativa montada resolve isso de raiz).

```tsx
"use client";
import { Sidebar, useHashRoute } from "mothership-ds";

const PAGES = { inicio: <p>Início</p>, sobre: <p>Sobre</p> };
const IDS = Object.keys(PAGES);

function App() {
  const [activeId] = useHashRoute({ ids: IDS });

  return (
    <div className="ms-app-shell">
      <header>{/* fica sempre visível */}</header>

      <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 24 }}>
        <Sidebar
          variant="fill"
          active={`#${activeId}`}
          sections={IDS.map((id) => ({ href: `#${id}`, label: id }))}
        />
        <main style={{ flex: 1, overflowY: "auto" }}>{PAGES[activeId]}</main>
      </div>

      <footer>{/* também sempre visível */}</footer>
    </div>
  );
}
```

`.ms-app-shell` só trava a viewport (`height: 100vh`, `overflow:
hidden`, coluna flex) — é opt-in, sem ele uma página comum rola
inteira, como sempre. Sem essa classe (ou fazendo o layout na mão), o
trio `useHashRoute` + `Sidebar active` ainda funciona sozinho, só que
numa página que rola normalmente em vez de um app-shell de altura
fixa — quem decide isso é o CSS ao redor, não os componentes.

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

Blocos de conversão pra landing pages — adicionados na v1.2.

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

### `BentoGrid` · `BentoTile`

`BentoGrid` é só o grid (4 colunas); os tiles são `<BentoTile>` filhos,
como `StatGrid`/`StatTile`.

| Prop (`BentoTile`) | Tipo | |
|---|---|---|
| `colSpan` | `2 \| 3 \| 4` | quantas colunas ocupa no grid de 4 |
| `rowSpan` | `2 \| 3` | quantas linhas ocupa |
| `icon` | `ReactNode` | |
| `title` | `ReactNode` | |
| `description` | `ReactNode` | |
| `interactive` | `boolean` | contorno reativo no hover/active, padrão `true` |

`grid-auto-flow: dense` preenche os buracos deixados por spans
irregulares em vez de deixar o layout furado, mas os tiles esticam
pra altura uniforme da linha (stretch, o padrão do grid) — linhas
sempre alinhadas, só o tamanho (`colSpan`/`rowSpan`) varia entre eles.

Abaixo de 720px o grid vira uma coluna e todo tile volta a 1×1 —
nenhum bloco fica maior que outro numa lista vertical.

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

### `Marquee`

Primitive de scroll horizontal infinito — aceita qualquer `children`,
não só logos.

| Prop | Tipo | Padrão | |
|---|---|---|---|
| `children` | `ReactNode` | — | |
| `direction` | `"left" \| "right"` | `"left"` | |
| `speed` | `"slow" \| "normal" \| "fast" \| number` | `"normal"` | número = segundos exatos |
| `pauseOnHover` | `boolean` | `false` | |
| `fade` | `boolean` | `false` | máscara CSS nas laterais, com tokens de espaçamento |
| `gap` | `"sm" \| "md" \| "lg"` | `"md"` | |

Sem prop `loop`: o loop é sempre contínuo — o conteúdo é duplicado uma
vez (a cópia leva `aria-hidden` + `inert`) e a animação desliza
exatamente metade da faixa, sem costura. Toda a animação é CSS puro
(`@keyframes` + `animation-play-state`); nenhum JS move o elemento.
Empilhe vários `<Marquee>` para linhas independentes.

Ainda não implementadas — só composições futuras do mesmo primitive,
sem lógica própria: `LogoMarquee`, `TechMarquee`, `IconMarquee`,
`TestimonialMarquee`.

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

### `Table`

Pronta para o esquema CRUD — a primeira coluna e a última **não** são
configuráveis via `columns`, pra toda tabela do sistema nascer
consistente:

| Prop | Tipo | |
|---|---|---|
| `columns` | `{ key, header, cell, sortable?, sortValue?, align? }[]` | colunas do meio |
| `rows` | `T[]` | |
| `rowKey` | `(row) => Key` | |
| `status` | `(row) => { label, tone? }` | **1ª coluna**, sempre — badge de status |
| `onEdit` | `(row) => void` | ícone de editar na última coluna; omita para não mostrar |
| `onDelete` | `(row) => void` | ícone de excluir na última coluna; omita para não mostrar |
| `actions` | `(row) => ReactNode` | ações extras, na mesma última coluna |
| `emptyState` | `ReactNode` | exibido quando `rows` está vazio |

Colunas com `sortable` (e `sortValue`, o valor comparável) ganham um
botão no cabeçalho que alterna `asc → desc → ordem original`. O `<th>`
correspondente leva `aria-sort`, então leitor de tela anuncia a
direção sem depender do ícone. `overflow-x: auto` no wrapper cobre
telas estreitas sem quebrar o layout.

```tsx
<Table<Usuario>
  rows={usuarios}
  rowKey={(u) => u.id}
  status={(u) => ({ label: u.ativo ? "Ativo" : "Inativo", tone: u.ativo ? "success" : "gray" })}
  onEdit={(u) => abrirEdicao(u)}
  onDelete={(u) => excluir(u)}
  columns={[
    { key: "nome", header: "Nome", sortable: true, sortValue: (u) => u.nome, cell: (u) => u.nome },
    { key: "email", header: "E-mail", cell: (u) => u.email },
  ]}
/>
```

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

A logo em SVG, com as partes agrupadas para animação e o gradiente da
marca correndo continuamente. **Uso interno da `Splash`** — as partes
(palavra, letras, dirigível) nascem fora de posição via CSS, prontas
pra revelação; sem uma ancestral `.ms-splash--ready`, ficam presas
nessa fase inicial. Não é um componente de "logo genérica" para uso
solto — se precisar da marca em outro contexto, use `assets/logo.svg`
diretamente.
