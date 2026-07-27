# Tokens

Tudo no sistema sai daqui. Nenhum componente escreve um valor solto —
cor, medida ou tempo — e é essa disciplina que faz um componente novo
nascer coerente e funcionar nos dois temas sem trabalho extra.

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

O tema escuro é o padrão. O claro é ativado pela classe `light` no
`<html>` — é o que o `ThemeProvider` faz.

### Marca — fixas nos dois temas

São oito, cada uma disponível em três formas.

| Token | Origem |
|---|---|
| `--color-accent` | ciano da marca — ação primária |
| `--color-highlight` | amarelo do ícone de raio — atenção |
| `--color-success` | verde — sucesso, alta, lucro |
| `--color-danger` | vermelho — erro, queda, prejuízo |
| `--color-violet` | violeta dos gráficos (`--chart-3`) |
| `--color-pink` | rosa dos gráficos (`--chart-4`) |
| `--color-orange` | laranja do gradiente da logo |
| `--color-gray` | cinza — status neutro |

As três formas de cada cor:

```css
var(--color-violet)       /* base */
var(--color-violet-500)   /* mesma coisa: 500 é a base */
var(--color-violet-100)   /* escala: 100 mais claro … 900 mais escuro */
var(--color-violet-soft)  /* alfa 0.2, fundo de badges e alertas */
```

Todas funcionam como `tone` em `<Badge>`, `<Alert>` e `notify()`.

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

Família única: [Outfit](https://fonts.google.com/specimen/Outfit), pesos
400 e 500.

| Token | Tamanho | Uso |
|---|---|---|
| `--text-xs` | 12px | badges, anotações |
| `--text-sm` | 14px | rodapé, legendas |
| `--text-md` | 16px | corpo |
| `--text-lg` | 20px | título de card |
| `--text-xl` | 24px | título de seção |
| `--text-2xl` | 32px | título de página |

Mais `--font-family`, `--font-weight-regular` (400),
`--font-weight-medium` (500), `--line-height-base` e
`--line-height-tight`.

Há utilitários prontos: `.ms-h1`, `.ms-h2`, `.ms-h3`, `.ms-text-sm`,
`.ms-text-xs`, `.ms-text-muted`.

## Espaçamento

Escala de oito passos, extraída das medidas que já se repetiam na página
original:

```
--space-1   4px      --space-5   24px
--space-2   8px      --space-6   32px
--space-3  12px      --space-7   56px
--space-4  16px
```

## Raios

| Token | Valor | Uso |
|---|---|---|
| `--radius-md` | 10px | botões, cards, superfícies |
| `--radius-pill` | 50px | navbar, badges, barras |
| `--radius-full` | 50% | avatar, botões de ícone, anéis |

## Efeitos

```css
--blur-glass   20px    /* superfícies de vidro */
--blur-soft     4px    /* trilho do switch */

--transition-fast  0.1s   /* outline */
--transition-base  0.2s   /* deslizes curtos */
--transition-slow  0.3s   /* fundos e cores */

--ease-bounce  cubic-bezier(0.34, 1.56, 0.64, 1)
```

O `--ease-bounce` é a assinatura de movimento do sistema: um overshoot
leve que aparece no accordion, no modal, nos bullets do carrossel e no
contorno reativo. Usar sempre o mesmo easing é o que faz componentes
diferentes parecerem da mesma família.

## Fundo

O fundo é uma cor base mais quatro manchas de luz, cada uma com cor,
posição e tamanho próprios:

```css
--bg-base
--bg-glow-1 … --bg-glow-4              /* cor */
--bg-glow-1-pos … --bg-glow-4-pos      /* posição */
--bg-glow-1-size … --bg-glow-4-size    /* tamanho */
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
