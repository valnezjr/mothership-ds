# Tokens

Tudo no sistema sai daqui. Nenhum componente escreve um valor solto —
cor, medida ou tempo — e é essa disciplina que faz um componente novo
nascer coerente e funcionar nos oito pares de tema sem trabalho extra.

Os tokens vivem em [`src/styles/tokens.css`](../src/styles/tokens.css)
como variáveis CSS, então você pode consumi-los no seu próprio código:

```css
.minha-secao {
  padding: var(--space-5);
  border-radius: var(--radius-md);
  background: var(--color-surface);
}
```

## Cores

### Semânticas — mudam com o tema

| Token | Papel |
|---|---|
| `--color-text` | texto principal |
| `--color-text-muted` | texto secundário, legendas |
| `--color-border` | bordas e divisores |
| `--color-border-strong` | borda em destaque (hover) |
| `--color-surface` | a superfície de vidro |
| `--color-surface-hover` | superfície de vidro em hover |
| `--color-border-surface` | contorno de superfície em fluxo (card, tabela, navbar); `transparent` no Flat |
| `--color-field` | fundo dos campos; a superfície em todo tema, o fundo da página no Flat |

### Temas

O tema tem dois eixos independentes: a **identidade** (`theme`) e a
**claridade** (`mode`). Quatro temas, cada um com modo base e escuro,
somam oito pares:

| `theme` | Base | Escuro |
|---|---|---|
| `"glass"` — **Mothership Glass** | vidro claro sobre fundo escuro, glows da marca (o padrão) | vidro escuro, o fundo da página a 60%, hover mais sutil — para a noite |
| `"cream"` — **Mothership Cream** | off-white quente, accent laranja lavado | papel âmbar meio-tom com tinta escura: baixa a luz em vez de inverter |
| `"paperpen"` — **Mothership Paperpen** | papel quadriculado, caneta esferográfica azul, sem vidro, fontes manuscritas | papel azul-tinta, caneta azul clara |
| `"flat"` — **Mothership Flat** | cinzas neutros, superfície opaca, sem vidro nem sombra | o mesmo, em zinco escuro |

O `ThemeProvider` escreve os dois eixos no `<html>`, como
`data-ms-theme` e `data-ms-mode` (o modo já resolvido, `"base"` ou
`"dark"`). Sem atributo nenhum, vale o Glass base — o `:root`. O CSS de
cada par fica num seletor de atributo:

```css
:root                                                /* Glass base */
[data-ms-mode="dark"]:is([data-ms-theme="glass"], :not([data-ms-theme]))
[data-ms-theme="cream"]                              /* Cream base */
[data-ms-theme="cream"][data-ms-mode="dark"]         /* Cream escuro */
/* … e o mesmo para paperpen e flat */
```

O escuro de cada tema herda do base dele o que não redefine. O
`ThemeSwitch` alterna só o modo dentro do tema atual; o `ThemeMenu`
escolhe entre os oito pares (ver
[componentes](componentes.md#themeprovider)).

Paperpen e Flat não têm vidro (`--blur-glass: 0`) nem sombra. O
Paperpen é o único que troca as fontes e o papel, e por isso pede quatro tokens
que nos outros temas não mudam nada:

| Token | Fora do Paperpen | No Paperpen |
|---|---|---|
| `--font-family-display` | `var(--font-family)` | Homemade Apple (títulos e display) |
| `--font-mono-style` | `normal` | `italic` (o itálico do Maple Mono é cursivo) |
| `--bg-texture` | `none` | granulação + quadriculado (`--paper-line`) |
| `--fill-solid` | `none` | hachura de caneta por cima de todo preenchimento sólido |

#### Fontes do Paperpen

Como a Outfit, as fontes não vêm com a lib: quem usa o Paperpen
importa [Patrick Hand](https://fonts.google.com/specimen/Patrick+Hand)
(corpo, campos e tabelas) e
[Homemade Apple](https://fonts.google.com/specimen/Homemade+Apple)
(títulos). Pode deixar o CSS do Google Fonts no `<head>` sempre:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Homemade+Apple&display=swap"
  rel="stylesheet"
/>
```

Esse CSS só declara as famílias (`@font-face`). O navegador baixa o
arquivo de fonte quando algum texto usa a família, e nenhum usa antes de
o tema ser aplicado. Quem não oferece o Paperpen não precisa da linha.

Para não fazer nem a requisição do CSS antes da hora, injete o `<link>`
quando o tema entrar:

```tsx
"use client";
import { useEffect } from "react";
import { useTheme } from "mothership-ds";

const PAPERPEN_FONTS =
  "https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Homemade+Apple&display=swap";

export function PaperpenFonts() {
  const { theme } = useTheme();
  useEffect(() => {
    if (theme !== "paperpen" || document.querySelector(`link[href="${PAPERPEN_FONTS}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = PAPERPEN_FONTS;
    document.head.appendChild(link);
  }, [theme]);
  return null;
}
```

Monte `<PaperpenFonts />` dentro do `ThemeProvider`. O texto aparece
nas fontes de reserva até o arquivo chegar, só na primeira vez: o corpo
em `"Comic Sans MS", cursive`, os títulos na `cursive` do sistema.

### Marca — fixas em todos os temas (exceto o accent)

São oito, cada uma disponível em três formas. Todas foram extraídas
direto da marca Mothership ou harmonizadas pra completar a paleta sem
destoar dela — nenhuma é um tom escolhido de forma solta.

| Token | Origem |
|---|---|
| `--color-accent` | ciano — ação primária. Parada 0% do gradiente de `assets/logo.svg`. No Cream vira um laranja lavado (`#e19460`, o laranja da logo com menos saturação), que combina com o fundo creme; no Paperpen é a caneta; no Flat, tinta neutra (quase preto no base, quase branco no escuro) |
| `--color-highlight` | amarelo do ícone de raio da página original — atenção |
| `--color-success` | verde — sucesso, alta, lucro |
| `--color-danger` | vermelho — erro, queda, prejuízo |
| `--color-violet` | violeta decorativo — não vem da logo, só dos gráficos |
| `--color-pink` | magenta. Parada 60% do gradiente de `assets/logo.svg` |
| `--color-orange` | laranja. Parada 100% do gradiente de `assets/logo.svg` |
| `--color-gray` | cinza — status neutro |

Para o accent como **texto ou anel de foco** há o `--color-accent-text`:
o `--color-accent` é de preenchimento e borda, e como texto não chega a
AA em todo tema. No Glass ele é o `--color-accent-400`; no Cream,
`#984a16` (`#6e330e` no escuro) — o laranja do Cream escurecido até AA;
no Paperpen e no Flat, o próprio accent, que já é tinta.

`accent`, `pink` e `orange` são as três paradas exatas do gradiente da
logo (realinhado na v1.2 — antes, `accent` e `pink` eram aproximações).
`--chart-3`/`--chart-4` **não** seguem `violet`/`pink` automaticamente:
nasceram deles num momento anterior, mas já validados contra
daltonismo e contraste nesses valores — mudar a cor de marca não
invalida um gráfico já publicado.

As três formas de cada cor:

```css
var(--color-violet)       /* base */
var(--color-violet-500)   /* mesma coisa: 500 é a base */
var(--color-violet-100)   /* escala: 100 mais claro … 900 mais escuro */
var(--color-violet-soft)  /* alfa 0.2, fundo de badges e alertas */
```

Todas funcionam como `tone` em `<Badge>`, `<Alert>` e `notify()`.

### Gradiente de ativo

`--gradient-active` é o gradiente da logo, e serve para uma coisa só:
dizer **"isto está ativo ou selecionado"**. Aparece no indicador das
`Tabs`, no item atual da `Navbar`, do `Sidebar` e do `Dock` (como anel),
no ponto ativo do `StepIndicator`, no `Card` com `selected` (anel), no
`Switch` ligado, no Checkbox e no Radio marcados e na borda dos campos
de texto focados. Fora desses lugares ele não entra, nem como enfeite: o
gradiente só funciona como sinal enquanto for raro.

É estático. O anel de foco dos outros controles continua sólido
(`--color-accent-text`): nos campos de texto o foco é o lugar onde se
está escrevendo, então conta como ativo; num botão é só passagem do
teclado.

Como texto (rótulo da opção selecionada do `Select`/`Combobox` e do
item marcado do `DropdownMenu`) entra o `--gradient-active-text`, com
paradas mais claras sobre fundo escuro (`-400`) e mais escuras sobre
fundo claro (`-800`), porque texto pede 4.5:1.
A cor nunca carrega o estado sozinha: cada um desses componentes também
marca o estado em `aria-current`, `aria-selected` ou `checked`.

| Tema | Paradas (direita → esquerda) |
|---|---|
| Glass (base e escuro), Flat escuro | `accent-500` → `pink-500` → `orange-500` |
| Cream base, Flat base | `accent-700` → `pink-600` → `orange-600` |
| Cream escuro | `accent-800` → `pink-700` → `orange-800` |
| Paperpen (base e escuro) | sem gradiente: caneta vermelha (`--color-danger`) chapada |

Todas as paradas ficam em 3:1 ou mais sobre o fundo e a superfície do
próprio par. No Cream base, o ciano desce até o `-700` porque o `-600`
fica em 2.70:1 sobre o creme; o Cream escuro, meio-tom, desce mais um
passo. No Paperpen o ativo é a caneta vermelha, a única cor que muda de
papel — o mesmo sinal nos dois modos.

### Dados

```css
--chart-1  /* ciano   */   --chart-3  /* violeta */
--chart-2  /* ouro    */   --chart-4  /* magenta */
--chart-grid
```

A ordem é **fixa**: a identidade de uma série nunca muda de cor quando
outra some. Cada tema tem seus próprios passos, escolhidos para passar em
três verificações computacionais:

- separação sob daltonismo (protanopia e deuteranopia), ΔE ≥ 8
- distinção em visão normal, ΔE ≥ 15
- contraste contra a superfície do tema, ≥ 3:1

Verde e vermelho ficam **reservados para status** — nunca viram "série 5".

## Tipografia

Família de todos os temas, exceto o Paperpen (ver [Temas](#fontes-do-paperpen)):
[Outfit](https://fonts.google.com/specimen/Outfit), pesos
400, 500 e 600. Escolhida por ser limpa, muito legível e versátil o
bastante pra título e corpo de texto; por não ser tão batida quanto as
fontes mainstream, carrega uma pegada mais orgânica.

| Token | Tamanho | Uso |
|---|---|---|
| `--text-xs` | 12px | badges, anotações |
| `--text-sm` | 14px | rodapé, legendas |
| `--text-md` | 16px | corpo |
| `--text-lg` | 20px | título de card |
| `--text-xl` | 24px | título de seção |
| `--text-2xl` | 32px | título de página |
| `--text-display` | 48px | número grande de dashboard, título de herói |

Para código e dados alinhados há `--font-mono`, com a
[Maple Mono](https://github.com/subframe7536/maple-font): "a" de um
andar e formas arredondadas como a Outfit, e com ligaduras. A lib não
carrega essa fonte; instale `@fontsource/maple-mono` e importe onde
for usar. Sem ela, o token cai na mono do sistema.

Mais `--font-family`, `--font-family-display` (títulos; a mesma do
corpo fora do Paperpen), `--font-mono-style`, `--font-weight-regular` (400),
`--font-weight-medium` (500), `--font-weight-display` (600),
`--line-height-base`, `--line-height-tight` e `--line-height-prose`
(1.6, mais aberto para texto corrido longo — usado pelo `Prose`).

O peso de exibição anda sempre junto com `--text-display` e só em dois
lugares: o número do `StatTile` e o título do `Hero`. Em qualquer outro
título, 500 continua o teto. `.ms-display` aplica os dois de uma vez,
com a mesma restrição: número grande ou título de herói montado à mão.
O `ProgressRing` fica de fora de propósito, porque o número mora dentro
do anel e 48px não cabe. No `StatTile`, o número encolhe até 32px
quando o tile é estreito demais para ele.

Há utilitários prontos: `.ms-display`, `.ms-h1`, `.ms-h2`, `.ms-h3`, `.ms-text-sm`,
`.ms-text-xs`, `.ms-text-muted`.

## Espaçamento

Escala de sete passos, extraída das medidas que já se repetiam na página
original:

```
--space-1   4px      --space-5   24px
--space-2   8px      --space-6   32px
--space-3  12px      --space-7   56px
--space-4  16px
```

Os saltos fogem um pouco da progressão matemática mais comum (dobrar
ou somar um valor fixo) de propósito — o respiro é mais orgânico e
característico do que "canônico".

## Raios

| Token | Valor | Uso |
|---|---|---|
| `--radius-md` | 10px | botões, cards, superfícies |
| `--radius-pill` | 50px | navbar, badges, barras |
| `--radius-full` | 50% | avatar, botões de ícone, anéis |

## Efeitos

Poucos efeitos, mas recorrentes, tratados como token igual o resto dos
fundamentos: garante aplicação uniforme (nenhum componente reinventa
um blur ou um easing próprio), coesão visual e performance.

```css
--blur-glass   20px    /* superfícies de vidro */
--blur-soft     4px    /* trilho do switch */

--transition-fast  0.1s   /* outline */
--transition-base  0.2s   /* deslizes curtos */
--transition-slow  0.3s   /* fundos e cores */

--ease-bounce   cubic-bezier(0.34, 1.56, 0.64, 1)
--ease-default  ease   /* curva das --transition-*: cores e fundos */
```

As `--transition-*` mudam cor e fundo na curva `ease` do CSS, que tem
nome próprio, `--ease-default`, para quem precisar escrevê-la.

O `--ease-bounce` é a assinatura de movimento do sistema: um overshoot
leve que aparece no accordion, no modal, nos bullets do carrossel e no
contorno reativo. Usar a mesma curva em toda entrada e todo clique é o
que faz componentes diferentes parecerem da mesma família; saídas e
loops usam as curvas dos gestos abaixo.

### Gestos de movimento

Quatro gestos nomeados cobrem tudo que entra, sai, confirma um clique ou
roda em loop, cada um com curva e duração próprias. A regra é **assentar ao entrar, recolher ao
sair**. Explicação completa em [Movimento](movimento.md#os-quatro-gestos).

```css
--motion-assentar-ease      var(--ease-bounce)           /* entrada */
--motion-assentar-duration  0.3s
--motion-recolher-ease      cubic-bezier(0.36, 0, 0.66, 0) /* saída */
--motion-recolher-duration  0.15s
--motion-pulso-ease         var(--ease-bounce)           /* clique */
--motion-pulso-duration     0.2s
--motion-deriva-ease        linear                       /* contínuo */
```

```css
.meu-painel        { animation: entra var(--motion-assentar-duration) var(--motion-assentar-ease); }
.meu-painel.saindo { animation: sai   var(--motion-recolher-duration) var(--motion-recolher-ease) forwards; }
```

Com `prefers-reduced-motion: reduce`, as durações dos gestos encolhem
para `0.01s` sozinhas. A deriva não tem duração: quem a usa pausa a
animação nessa preferência.

O que já está na tela e só muda de forma (o `Dock` expandindo, a câmera
do `Grafo3D`) fica fora dos gestos e usa `--transition-spatial`/
`--ease-spatial`. Detalhe em [Movimento](movimento.md#transformação-em-cena).

## Sombras e opacidades

```css
--shadow-xs    0 1px 3px    preto 30%   /* polegar do Toggle */
--shadow-sm    0 8px 32px   preto 25%   /* toast, botão da Sidebar */
--shadow-md    0 12px 32px  preto 25%   /* Listbox, Popover, DropdownMenu */
--shadow-lg    0 18px 44px  preto 35%   /* card pressionado */
--shadow-xl    0 24px 64px  preto 45%   /* Modal */
--shadow-glow-accent  0 12px 40px  accent 22%   /* card em destaque */
--shadow-drop  drop-shadow(0 4px 14px preto 45%) /* para filter */

--opacity-disabled  0.4    /* controle desabilitado */
--opacity-dimmed    0.55   /* item fora de foco, ainda legível */
```

As sombras formam uma escala de elevação: quanto mais alto o elemento
flutua sobre a página, maior o token. São pretas em todo tema com
sombra, porque sombra escurece o que está embaixo; Paperpen e Flat as
desligam.

## Larguras de traço

```css
--border-width  1px   /* borda padrão de superfícies, campos e divisores */
--focus-width   2px   /* anel de foco */
```

## Fundo

O fundo é uma cor base mais quatro manchas de luz, cada uma com cor,
posição e tamanho próprios:

```css
--bg-base
--bg-glow-1 … --bg-glow-4              /* cor */
--bg-glow-1-pos … --bg-glow-4-pos      /* posição */
--bg-glow-1-size … --bg-glow-4-size    /* tamanho */
--bg-texture                           /* camada por cima dos glows; none fora do Paperpen */
--bg-page                              /* a composição pronta */
```

Os tokens de posição e tamanho são exatamente o que o
[`LivingBackground`](movimento.md) anima. Trocar uma cor de glow muda o
clima da página inteira sem tocar em nenhum componente.

## Contorno reativo

Os parâmetros do utilitário `HoverEdge`:

```css
--ms-edge-a / --ms-edge-b   /* cores do anel em degradê */
--ms-edge-radius            /* padrão: --radius-md */
--ms-edge-lift              /* padrão: -4px */
--ms-edge-scale             /* padrão: 1.03 */
--ms-grad-angle             /* atualizado em runtime pelo componente */
```

## Trocando a marca

Para levar o sistema a outra identidade, o caminho mais curto é redefinir
os tokens depois de importar o CSS:

```css
@import "mothership-ds/styles.css";

:root {
  --color-accent: #7c3aed;
  --font-family: "Inter", sans-serif;
  --radius-md: 4px;      /* um sistema de cantos vivos */
  --bg-glow-1: #1e293b;
}
```

Nenhum componente precisa ser tocado.

Com temas, o peso do seletor conta. Um token redefinido no `:root`
vence os pares base (o seletor deles pesa o mesmo e vem antes do seu
CSS), mas não os escuros, cujo seletor tem dois atributos. Para fixar o
valor nos oito pares, some `:root[data-ms-mode]`; para mudar um par só,
use o seletor dele:

```css
:root,
:root[data-ms-mode] {
  --color-accent: #7c3aed;              /* em todos os pares */
}

[data-ms-theme="cream"][data-ms-mode="dark"] {
  --color-accent: #c26a2e;              /* só no Cream escuro */
}
```
