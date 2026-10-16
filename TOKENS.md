# Tokens

Cheat-sheet de todas as variáveis CSS do sistema. Fonte da verdade:
[`src/styles/tokens.css`](src/styles/tokens.css) — se este arquivo e o
CSS divergirem, o CSS ganha; atualize aqui. Para o texto explicado
(exemplos, critérios de validação em prosa), ver
[`docs/tokens.md`](docs/tokens.md).

**Regra fixa**: nenhum componente escreve `15px` ou `#00afef` direto —
sempre `var(--token)`.

## Tipografia

```css
--font-family: "Outfit", sans-serif;
--font-mono: "Maple Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-display: 600;  /* só com --text-display */

--text-xs: 12px;    /* badges, anotações */
--text-sm: 14px;    /* rodapé, legendas */
--text-md: 16px;    /* corpo */
--text-lg: 20px;    /* título de card */
--text-xl: 24px;    /* título de seção */
--text-2xl: 32px;   /* título de página */
--text-display: 48px; /* número de StatTile, título do Hero */

--line-height-base: 1.5;
--line-height-prose: 1.6; /* texto corrido longo, só no Prose */
--line-height-tight: 24px;
```

Utilitários prontos: `.ms-display`, `.ms-h1`, `.ms-h2`, `.ms-h3`, `.ms-text-sm`,
`.ms-text-xs`, `.ms-text-muted`.

`--font-mono` não é carregada pela lib (nenhum componente usa ainda):
quem precisa importa a Maple Mono (`@fontsource/maple-mono`); sem ela,
cai na mono do sistema.

## Espaçamento

Escala de oito passos:

```css
--space-1: 4px;    --space-5: 24px;
--space-2: 8px;    --space-6: 32px;
--space-3: 12px;   --space-7: 56px;
--space-4: 16px;
```

## Raios

```css
--radius-md: 10px;     /* botões, cards, container, superfícies */
--radius-pill: 50px;   /* navbar, badges, trilho do switch */
--radius-full: 50%;    /* avatar, botões de ícone, anéis */
```

## Efeitos e movimento

```css
--blur-glass: 20px;    /* superfícies de vidro */
--blur-soft: 4px;      /* trilho do switch */

--transition-fast: 0.1s;   /* outline */
--transition-base: 0.2s;   /* deslizes curtos */
--transition-slow: 0.3s;   /* fundos e cores */

--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
```

`--ease-bounce` é a assinatura de movimento do sistema (overshoot
leve). Detalhe em [`docs/movimento.md`](docs/movimento.md).

### Gestos

Todo movimento de componente que entra, sai, confirma um clique ou roda
em loop é um dos quatro gestos. Regra: **assentar ao entrar, recolher ao
sair**. Não escrever `0.3s var(--ease-bounce)`
numa entrada — usar o par do gesto.

```css
--motion-assentar-ease: var(--ease-bounce);          /* entrada: modal, toast, popover, janela */
--motion-assentar-duration: 0.3s;
--motion-recolher-ease: cubic-bezier(0.36, 0, 0.66, 0); /* saída de qualquer coisa, sem overshoot */
--motion-recolher-duration: 0.15s;
--motion-pulso-ease: var(--ease-bounce);             /* confirmação de clique */
--motion-pulso-duration: 0.2s;
--motion-deriva-ease: linear;                        /* contínuo: fundo vivo, giro de borda */
```

- `recolher` é o `--ease-spatial` espelhado no tempo (mesma família,
  acelera em vez de frear).
- Sob `prefers-reduced-motion`, as três durações viram `0.01s` no
  próprio `tokens.css` — quem usa o token não precisa de media query.
- `deriva` não tem token de duração (o período é de cada uso). Sob
  redução de movimento ela **para**: quem a usa pausa a animação na
  própria regra.
- `--transition-*` seguem existindo para mudança de cor/fundo, que não
  é entrada nem saída.
- **Exceção: transformação em cena.** Algo que já está na tela e muda
  de forma ou de ponto de vista (Dock expandindo, câmera do Grafo3D,
  legenda filtrando, trilho do Carousel) usa `--transition-spatial`/`--ease-spatial`, não
  um gesto. Critério: entrou ou saiu de cena → gesto; já estava e se
  transformou → par spatial. O `Drawer` entra e sai, então é gesto.
  Decisão D1 em `docs/decisoes.md`.
- Saída e entrada por transição (não animação): a transição de cada
  sentido mora no estado de **destino** — recolher na regra base,
  assentar no modificador `--open` (ver `.ms-drawer`, `.ms-navbar__menu`,
  `.ms-accordion__body`, `.ms-tooltip`).
- Componente que **desmonta** ao fechar precisa ficar montado durante
  o recolher: `usePresence(open)` (`src/components/presence.ts`,
  interno) devolve `present`/`leaving` e lê a duração real do token
  (`recolherMs()`), então acompanha o `0.01s` da redução de movimento.

## Sombras e opacidades

```css
--shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.3);     /* polegar do Toggle */
--shadow-sm: 0 8px 32px rgba(0, 0, 0, 0.25);   /* flutuantes pequenos: toast, botão da Sidebar */
--shadow-md: 0 12px 32px rgba(0, 0, 0, 0.25);  /* sobreposições: Listbox, Popover, DropdownMenu */
--shadow-lg: 0 18px 44px rgba(0, 0, 0, 0.35);  /* card pressionado (Gallery) */
--shadow-xl: 0 24px 64px rgba(0, 0, 0, 0.45);  /* Modal */
--shadow-glow-accent: 0 12px 40px <accent 22%>; /* card em destaque (Pricing/Testimonial) */
--shadow-drop: drop-shadow(0 4px 14px rgba(0, 0, 0, 0.45)); /* para `filter` (fatia de pizza) */

--opacity-disabled: 0.4;   /* controle desabilitado */
--opacity-dimmed: 0.55;    /* item fora de foco, ainda legível */
```

Escala de elevação: quanto mais alto o elemento flutua, maior o
número. Sombra é sempre preta (não varia por tema). Exceções que
seguem soltas de propósito: halos na própria cor do elemento
(`drop-shadow(... currentColor)` em gráficos, brilho do `Meter`, borda
nova da `Gallery`), porque dependem de variável do componente.

## Larguras de traço

```css
--border-width: 1px;   /* borda padrão */
--focus-width: 2px;    /* anel de foco */
```

Variações de componente seguem soltas de propósito: hover do `Button`
(1.5px), `IconButton` e `Avatar` placeholder (2px), trilho da barra de
rolagem.

## Larguras fixas

```css
--container-max: 588px;
--avatar-size: 112px;
--switch-width: 64px;
--switch-height: 24px;
--switch-thumb: 32px;
```

## Cores semânticas — mudam com o tema

Tema escuro é `:root` (padrão); tema claro é `.light` no `<html>`
(aplicado pelo `ThemeProvider`). Há ainda a variante **`.darker`**: o
escuro com vidro escuro (`--color-surface` = `--bg-base` a 60%, hover
branco a 15%) em vez de vidro claro. Texto, bordas, marca e fundo são os
do escuro. Aplicada pelo `ThemeProvider` com `setTheme("darker")`; o `ThemeMenu`
escolhe entre os três temas, e o `ThemeSwitch` alterna só escuro/claro.

| Token | Papel |
|---|---|
| `--color-text` | texto principal |
| `--color-text-muted` | texto secundário, legendas |
| `--color-border` | bordas e divisores |
| `--color-border-strong` | borda em destaque (hover) |
| `--color-surface` | a superfície de vidro |
| `--color-surface-hover` | superfície de vidro em hover |
| `--color-thumb` | thumb do switch |

## Cores de marca — fixas em todos os temas (exceto o accent no claro)

Oito cores, cada uma em três formas:

```css
var(--color-violet)       /* base, == -500 */
var(--color-violet-500)
var(--color-violet-100)   /* escala: 100 claro … 900 escuro */
var(--color-violet-soft)  /* alfa 0.2 — fundo de badges/alertas */
```

| Token base | Uso semântico |
|---|---|
| `--color-accent` | ciano — ação primária. Parada 0% de `assets/logo.svg`. **No claro vira laranja lavado** (`#e19460`, o orange da logo menos saturado): o ciano some sobre o creme. As escalas `--color-accent-*` seguem ciano |
| `--color-highlight` | amarelo — atenção (ícone flash da página original, não da logo) |
| `--color-success` | verde — sucesso, alta, lucro |
| `--color-danger` | vermelho — erro, queda, prejuízo |
| `--color-violet` | violeta decorativo — não vem da logo |
| `--color-pink` | magenta. Parada 60% de `assets/logo.svg` |
| `--color-orange` | laranja. Parada 100% de `assets/logo.svg` |
| `--color-gray` | cinza — status neutro |

**`--color-accent-text`** — o accent como **texto e anel de foco**
(link/item ativo, opção selecionada, `:focus-visible`). `--color-accent`
fica para preenchimento e borda: como texto ele não garante AA em todo
tema. Escuro e Darker: `--color-accent-400` (5.12:1 sobre o
`--color-accent-soft`). Claro: `#984a16`, o laranja do claro escurecido
até AA (≥4.58:1 sobre fundo, vidro e soft). Nunca use `--color-accent`
como `color:` ou `outline-color`.

`accent`/`pink`/`orange` são as três paradas exatas do gradiente da
logo (realinhado na v1.2). `--chart-3`/`--chart-4` não seguem
`violet`/`pink` automaticamente — já validados contra daltonismo nos
valores antigos, ficam soltos por design.

Todas funcionam como `tone` em `<Badge>`, `<Alert>` e `notify()`.

**`--gradient-active`**: o gradiente da logo (ciano à direita, rosa em
60%, laranja à esquerda, mesma direção do SVG). **Uso exclusivo** como
sinal de ativo/selecionado: indicador das `Tabs`, item atual de
`Navbar`/`Sidebar`/`Dock` (anel), ponto ativo do `StepIndicator`,
`Card selected` (anel), `Switch` ligado, contorno de Checkbox/Radio marcados e a
borda dos campos de texto focados (única exceção ao foco sólido, D3).
Nada além disso, nem
decoração: se aparecer em outro lugar, deixa de dizer "ativo". Estático.
O anel de foco continua sólido (`--color-accent-text`), e o estado vai
sempre também em `aria-*`. Paradas `-500` no escuro/Darker; no claro
`accent-700`/`pink-600`/`orange-600` (o `accent-600` fica em 2.70:1 sobre
o creme). Todas ≥3:1 sobre o fundo e o vidro dos três temas; os valores
medidos estão no comentário do token. Abaixo de 3:1 só no centro dos
glows do fundo (limite que o `--color-accent` sólido já tinha).

**`--color-surface-selected`** / **`--shadow-selected`**: fundo e sombra
do item atual de Navbar/Sidebar/Dock. No escuro/Darker, o próprio vidro
e sem sombra; no claro, marfim quase opaco (`rgba(255,253,248,.9)`) com
`--shadow-xs`, porque vidro marfim sobre o painel marfim não aparecia.

**`--gradient-active-text`**: o mesmo sinal como texto (rótulo da opção
selecionada do Select/Combobox e do item marcado do DropdownMenu), com
paradas que passam de 4.5:1: `-400` no escuro/Darker, `-800` no claro.
**`--gradient-active-text-hover`** é a versão com o item em hover: no
escuro vira `--color-text`, porque o hover branco a 50% não deixa
nenhuma cor de texto passar. **`--gradient-field-ring`** é o fundo em
camadas para borda em gradiente onde não há `::before` (Input, Radio):
use com `border-color: transparent`.

## Texto/ícone sobre superfície sólida

Fixas nos dois temas — usadas quando texto/ícone precisa ficar sobre
um fundo de cor de marca saturado o bastante pra exigir contraste
garantido, em vez de `var(--color-text)` normal (que assume a
superfície neutra de vidro):

```css
--color-on-solid: #ffffff;      /* violet, avatar/carrossel — fundos com contraste real */
--color-on-highlight: #1a1a2e;  /* exceção: sobre --color-highlight */
--color-on-accent: #1a1a2e;     /* exceção: sobre --color-accent */
--color-on-danger: #1a1a2e;     /* exceção: sobre --color-danger */
```

Nem toda cor de marca precisa de token próprio — só quando o par
padrão (`--color-on-solid`, branco) mede abaixo de 4.5:1 (WCAG AA,
texto normal). Medido: `accent` 2.51, `highlight` 1.47, `success`
1.91, `danger` 3.21, `pink` 4.06, `orange` 2.96, `gray` 3.34 — todos
abaixo do mínimo com branco; só `violet` (4.82) passa. `success`/
`orange`/`gray` não ganharam token dedicado porque caem no mesmo
`#1a1a2e` de `--color-on-accent` e nenhuma regra de CSS precisa
referenciá-los por um nome próprio (o ícone do `Alert`, único
consumidor desses três, usa `--color-on-accent` como padrão — ver
`components.css` § `.ms-alert__icon svg`). `pink` foi o único caso sem
solução só de token: `pink-500` falha nos dois sentidos (4.06 branco /
4.20 escuro) — resolvido trocando o **fundo** do ícone pra `pink-600`
(já existente na escala) com texto branco (5.39), não criando token de
texto novo.

## Cores de dados (gráficos)

```css
--chart-1   /* ciano   */    --chart-3   /* violeta */
--chart-2   /* ouro    */    --chart-4   /* magenta */
--chart-grid
```

Ordem **fixa** — a identidade de uma série nunca muda de cor quando
outra some/reordena. Valores diferentes por tema (passos próprios,
validados contra a superfície de cada um). `success`/`danger` ficam
**reservadas para status**, nunca viram "série 5".

Critério de validação de qualquer cor de dado nova, checado por
script, separadamente em cada tema:

- separação sob daltonismo (protanopia/deuteranopia): ΔE ≥ 8
- distinção em visão normal: ΔE ≥ 15
- contraste contra a superfície do tema: ≥ 3:1

## Fundo (`LivingBackground`)

```css
--bg-base
--bg-glow-1 … --bg-glow-4              /* cor de cada mancha */
--bg-glow-1-pos … --bg-glow-4-pos      /* posição — animada em runtime */
--bg-glow-1-size … --bg-glow-4-size    /* tamanho — animado em runtime */
--bg-page                              /* composição pronta, definida uma vez */
```

Os tokens de posição/tamanho são exatamente o que o `LivingBackground`
escreve via JS a cada frame (ver `docs/movimento.md`). Trocar uma cor
de glow muda o clima da página inteira sem tocar em nenhum componente.

## Contorno reativo (`HoverEdge`)

```css
--ms-edge-a / --ms-edge-b   /* cores do anel em degradê */
--ms-edge-radius            /* padrão: --radius-md */
--ms-edge-lift              /* padrão: -4px */
--ms-edge-scale             /* padrão: 1.03 */
--ms-grad-angle             /* atualizado em runtime pelo componente, não editar */
```

## Scroll infinito (`Marquee`)

```css
--ms-marquee-duration   /* padrão 40s; slow=60s, fast=20s via classe modificadora */
--ms-marquee-gap        /* padrão --space-5; sm=--space-4, lg=--space-6 via classe */
```

O fade lateral (`fade`) usa `mask-image` com `var(--space-7)` como
largura da transição — nenhum valor novo, reaproveita o espaçamento.

## Trocando a marca (rebrand)

Redefinir tokens depois de importar o CSS — nenhum componente precisa
ser tocado:

```css
@import "mothership-ds/styles.css";

:root {
  --color-accent: #7c3aed;
  --font-family: "Inter", sans-serif;
  --radius-md: 4px;      /* sistema de cantos vivos */
  --bg-glow-1: #1e293b;
}
```
