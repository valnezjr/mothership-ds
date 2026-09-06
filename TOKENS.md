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
--font-weight-regular: 400;
--font-weight-medium: 500;

--text-xs: 12px;    /* badges, anotações */
--text-sm: 14px;    /* rodapé, legendas */
--text-md: 16px;    /* corpo */
--text-lg: 20px;    /* título de card */
--text-xl: 24px;    /* título de seção */
--text-2xl: 32px;   /* título de página */

--line-height-base: 1.5;
--line-height-tight: 24px;
```

Utilitários prontos: `.ms-h1`, `.ms-h2`, `.ms-h3`, `.ms-text-sm`,
`.ms-text-xs`, `.ms-text-muted`.

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
leve). Usar sempre este easing — nunca outro — é o que faz
componentes diferentes parecerem da mesma família. Detalhe em
[`docs/movimento.md`](docs/movimento.md).

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
(aplicado pelo `ThemeProvider`).

| Token | Papel |
|---|---|
| `--color-text` | texto principal |
| `--color-text-muted` | texto secundário, legendas |
| `--color-border` | bordas e divisores |
| `--color-border-strong` | borda em destaque (hover) |
| `--color-surface` | a superfície de vidro |
| `--color-surface-hover` | superfície de vidro em hover |
| `--color-thumb` | thumb do switch |

## Cores de marca — fixas nos dois temas

Oito cores, cada uma em três formas:

```css
var(--color-violet)       /* base, == -500 */
var(--color-violet-500)
var(--color-violet-100)   /* escala: 100 claro … 900 escuro */
var(--color-violet-soft)  /* alfa 0.2 — fundo de badges/alertas */
```

| Token base | Uso semântico |
|---|---|
| `--color-accent` | ciano — ação primária. Parada 0% de `assets/logo.svg` |
| `--color-highlight` | amarelo — atenção (ícone flash da página original, não da logo) |
| `--color-success` | verde — sucesso, alta, lucro |
| `--color-danger` | vermelho — erro, queda, prejuízo |
| `--color-violet` | violeta decorativo — não vem da logo |
| `--color-pink` | magenta. Parada 60% de `assets/logo.svg` |
| `--color-orange` | laranja. Parada 100% de `assets/logo.svg` |
| `--color-gray` | cinza — status neutro |

`accent`/`pink`/`orange` são as três paradas exatas do gradiente da
logo (realinhado na v1.2). `--chart-3`/`--chart-4` não seguem
`violet`/`pink` automaticamente — já validados contra daltonismo nos
valores antigos, ficam soltos por design.

Todas funcionam como `tone` em `<Badge>`, `<Alert>` e `notify()`.

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
