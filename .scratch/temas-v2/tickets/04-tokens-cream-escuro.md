# 04: Tokens do Cream escuro

Blocked by: 01, 02
Status: done

**What to build:** a variante G escolhida no ticket 01 (seção Answer, D10) vira o bloco do Cream escuro em `tokens.css`: cores de texto/borda/superfície, `--bg-base` e glows, `--chart-*`, `--gradient-active`/`-text`, `--color-accent-text`, ícones em data URI (`--icon-switch`, `--icon-select`), e os ajustes por tema que hoje existem em `components.css` (véu do Modal/Drawer, tinta da logo/mascote).

- [x] Contrastes medidos e anotados no comentário do token, como nos outros temas
- [x] Todas as stories conferidas no Cream escuro, a 1280px e 390px
- [x] Validado pelo Valnez

## Notas da implementação

- Valores da G (ticket 01, D10) como vieram, menos o painel (abaixo). O protótipo partia do Glass base, o bloco real herda do Cream base: `--shadow-selected` volta a `none` e `--gradient-active-text-hover` à cor do texto, como no Glass.
- Fora do protótipo, por contraste medido (detalhe no comentário de cada token):
  - `--chart-*` um passo mais claro (`accent-400`, `highlight-600`, `violet-400`, `pink-400`): os do Glass ficavam abaixo de 3:1 no vidro (violeta 2.27). ΔE mínimo 12.6 em deutan.
  - `--color-danger` em `danger-300`: o de marca dá 3.41 como texto sobre o vidro (item perigoso do DropdownMenu, delta negativo do StatTile). Token semântico, não escala nem cor de marca.
  - `--gradient-active` em -400 (o rosa -500 dá 2.70 no vidro), `-text` em -300.
- `--color-accent-text` sobre o `--color-accent-soft` dá 4.23: só pinta o ícone do Bento, onde 3:1 basta.
- `--icon-switch` já era a lua cheia pelo `:root[data-ms-mode="dark"]`, sem regra nova.
- Véu do Modal/Drawer já é `--bg-base` a 72%, escurece sozinho. Tinta da logo/mascote volta a `#fefefe`; `reset.css` ganha o fundo `#2a1f17`.
- Conferido: as 53 stories a 1280 e 390px (Playwright, sem erro de página).
- Validação: o vidro de latte da G ficou translúcido e pouco saturado, sem o aspecto creme do claro. Comparadas ao vivo (seletor temporário no styleguide) caramelo, doce de leite e toffee; ficou o painel caramelo (`rgba(96, 66, 40, 0.92)`, texto `#fbecd6`) sobre o fundo e os glows da G. Revisão anotada na D10.
- Revisão de 2026-10-24 (durante o ticket 08): o bloco trocou o caramelo pela paleta do e-ink do Paperpen com os glows do Cream (D10, revisão). Valores e contrastes no comentário do bloco. Success e danger em -900 (o success de marca dá 1.01 no papel âmbar), então o ícone do Alert nesses dois tons e o `--color-on-danger` viram brancos (8.79/11.68). Tinta da logo volta à escura do Cream base; `reset.css` em `#c9b998`. Conferido: 56 stories a 1280 e 390px, sem erro de página. Validado pelo Valnez na comparação ao vivo.
