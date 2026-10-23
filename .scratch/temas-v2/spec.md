# Spec: temas v2 do Mothership DS

Status: ready-for-agent
Criado: 2026-10-23 · Origem: conversa com o Valnez (sessão no repo, 2026-10-23). Decisão de API em D8 (`docs/decisoes.md`).

## Problem Statement

Hoje o DS tem três temas numa lista só (`"dark" | "darker" | "light"`), aplicados por classes soltas no `<html>` (`.light`, `.darker`; escuro é a ausência das duas). A lista mistura duas coisas: qual identidade (vidro ou creme) e se ela está clara ou escura. O Darker é uma variante noturna do escuro, mas a API não diz isso, e o claro (creme) não tem versão noturna. As classes sem prefixo também podem colidir com o CSS de quem instala a lib.

## Solution

Dois eixos, independentes:

| | `mode="base"` | `mode="dark"` |
|---|---|---|
| **`theme="glass"`** (Mothership Glass) | o atual escuro (`:root`) | o atual Darker |
| **`theme="cream"`** (Mothership Cream) | o atual claro | **novo**, a prototipar |
| **`theme="paperpen"`** (Mothership Paperpen) | **novo**: papel quadriculado, caneta azul | **novo**: e-ink quente, tinta preta |
| **`theme="flat"`** (Mothership Flat) | **novo**: neutro claro, sem vidro | **novo**: neutro escuro, sem vidro |

- **Nomes de exibição:** "Mothership Glass", "Mothership Cream", "Mothership Paperpen" e "Mothership Flat". Modos: "Base" e "Escuro".
- **API:** `ThemeProvider` com `defaultTheme` (`"glass"` padrão) e `defaultMode` (`"base"` padrão; aceita `"system"`). `useTheme()` devolve `theme`, `mode` (o escolhido, pode ser `"system"`), `resolvedMode` (`"base" | "dark"`), `setTheme`, `setMode`, `toggleMode`.
- **`mode="system"`:** acompanha `prefers-color-scheme` (claro → base, escuro → dark), ouvindo mudanças do SO. Opcional; o padrão continua `"base"`.
- **DOM:** `data-ms-theme` e `data-ms-mode` (o resolvido) no `<html>`. Saem `.light` e `.darker`. Sem atributo nenhum, vale Glass base (o `:root`), como hoje.
- **`ThemeSwitch`:** alterna o modo dentro do tema atual (base ↔ escuro). `aria-checked` = modo escuro.
- **`ThemeMenu`:** os oito pares (quatro grupos, um por tema), marcável como hoje.
- **`persist`:** grava tema e modo. Lê a chave antiga `ms-theme` e converte (`dark` → glass/base, `darker` → glass/dark, `light` → cream/base), para quem já tinha escolha salva não perder.
- **Cream escuro:** vidro leitoso quase opaco sobre base doce de leite (D10). Mesmo padrão de contraste dos outros (texto ≥4.5:1, borda de controle e `--gradient-active` ≥3:1, medidos).
- **Paperpen:** sem vidro. Textura de papel no fundo no lugar dos glows, texto na cor de caneta esferográfica azul, contorno no lugar de preenchimento (`--blur-glass: 0`, superfície transparente ou de papel, `--border-width` mais grosso, sombras desligadas). Fontes: Homemade Apple em títulos e display, Patrick Hand no corpo, campos e tabelas, por legibilidade; terminal em Maple Mono itálico (cursivo, já é a fonte do DS). Preenchimento sólido em hachura, contorno levemente irregular, ativo em caneta vermelha. Modo escuro: e-ink quente monocromático (não é o papel invertido), com a caneta vermelha do ativo como única cor. Detalhe em D11.
- **Flat:** neutro e plano. Sem vidro, sem sombra, superfície opaca, cinzas neutros; a cor da marca só no sinal de ativo (`--gradient-active`) e nos estados. Glows bem sutis. Botão solid em tinta neutra (preto no claro, branco no escuro). Superfícies separadas do fundo só por tom, sem borda (ticket 09). Detalhe em D12.
- **Tokens novos que o Paperpen pede** (valem nos outros temas com o valor de hoje, sem mudança visual): `--font-family-display` (títulos/display; nos outros temas aponta para `--font-family`), `--font-mono-style` (`normal` nos outros, `italic` no Paperpen) e um token de textura do fundo (`none` nos outros). As fontes do Paperpen só são carregadas por quem usa o tema.

Versão: **v2.0.0** (quebra de API: valores de `Theme`, `toggle`, classes do `<html>`). Leva junto o que está em "Não lançado" no CLAUDE.md.

## Fora do escopo

- Um quinto tema ou um terceiro modo.
- Script anti-flash no `<head>` para SSR (o tema continua aplicado depois da hidratação, como hoje).
- Mexer nas escalas `--color-*-100..900` ou nas cores de marca.
