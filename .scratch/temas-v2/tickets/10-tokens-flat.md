# 10: Tokens do Flat

Blocked by: 02, 09
Status: done

**What to build:** Flat base e escuro em `tokens.css`, a partir do ticket 09 (seção Answer): separação só por tom, sem borda nas superfícies; cinzas neutros, superfície opaca, `--blur-glass: 0`, sombras desligadas, glows sutis, `--color-accent` neutro (tinta: preto no claro, branco no escuro), `--gradient-active` da logo (paradas do claro como no Cream base), `--chart-*`, ícones em data URI e os ajustes por tema de `components.css` (véu do Modal/Drawer, tinta da logo/mascote).

- [x] Superfícies sem borda no Flat por token (ex.: borda de superfície `transparent`), não regra solta por componente; controles mantêm 3:1
- [x] Campo dentro de superfície legível (fundo do campo diferente do card)
- [x] Contrastes medidos e anotados nos tokens
- [x] Todas as stories conferidas nos dois modos, a 1280px e 390px
- [x] Validado pelo Valnez

## Notas da implementação

- Blocos `[data-ms-theme="flat"]` (base) e `…[data-ms-mode="dark"]` em `tokens.css`, com os valores da Answer do 09, 1:1 com o protótipo (`ec15909`). Contrastes anotados em cada token. O escuro herda do base desfoque, sombras e separação; ativo, gráficos e estados voltam aos do Glass.
- Dois tokens novos no `:root`, iguais aos de antes em todo tema:
  - `--color-border-surface` (= `--color-border`; `transparent` no Flat): contorno de superfície em fluxo. Card, StatTile, tabela e também Pricing, Testimonial, Bento, Carousel, item da Gallery, Accordion, Navbar, Sidebar, Dock e Breadcrumbs glass (a Answer só citava os três primeiros; a D12 fala de "superfícies"). Sobreposições (Modal, Popover, listas, Drawer, Tooltip, histórico de alertas) e controles ficam no `--color-border`: sem sombra e sem contorno, sumiriam sobre um card.
  - `--color-field` (= `--color-surface`; `--bg-base` no Flat): fundo de Input/Textarea/gatilho do Select, Checkbox, Radio e do `--gradient-field-ring`. Vale para todo campo, não só dentro de card: fora dele o campo fica da cor da página, separado pela borda de 3:1.
- Ajustes por tema em `components.css`, somando o Flat às regras do Paperpen: anel do hover-edge sem o ciano de fallback, avatar sem foto em tinta, halos da Gallery nova e do Meter zerados, tinta da logo/mascote em `--color-text`. Véu do Modal/Drawer no base: tinta a 40% (o preto a 55% pesava sobre a página clara); no escuro, o véu padrão.
- Ícone do Alert no base: o `--color-on-accent` vira `#fafafa` (o accent é tinta preta) e cairia a 1.83–3.20 em success/danger/orange/gray; volta ao `#1a1a2e` (via `--color-on-highlight`, mesmo valor).
- Conferido (Playwright, `prefers-reduced-motion`): 56 stories × base/escuro × 1280/390, sem erro de página, sem `backdrop-filter` nem `box-shadow` sobrando, nenhuma superfície com contorno além do PricingCard em destaque (intencional), nenhum `.ms-input` da cor do pai. Glass, Cream e Paperpen base/escuro antes × depois: 657/672 idênticas; as 15 restantes são o Splash (varia sozinho) e 1 px com Δ 1/255 no Paperpen escuro.
- Para a validação:
  - danger e success seguem os de marca, como no Cream base: como texto, danger 3.21 e success 1.91 sobre a superfície (o delta do StatTile em alta fica claro demais). Badge/Alert success com borda 1.91. Manter ou descer para -700/-800 (pede texto branco nos preenchimentos, como o Cream escuro)?
  - Superfície dentro de superfície (StatTile num Card, Accordion num Modal) fica branco sobre branco, sem contorno.
  - Borda sem contorno também em Navbar/Sidebar/Dock e nos cards de marketing (fora do que o protótipo mostrou).
- Validado pelo Valnez (2026-10-24), sem mudanças; os pontos acima ficam como estão.
- `revisao-spec`: véu com `rgba` cru virou `color-mix` sobre `--color-text`; Checkbox incluído na doc do `--color-field`. Ficam como julgamento: bloco "sem vidro nem sombra" repetido do Paperpen, `--chart-*`/paradas copiados do Cream base e do Glass (não acompanham se eles mudarem), seletores `:is(paperpen, flat)` espalhados (mesmo padrão do 08), `--color-on-highlight` emprestado no ícone do Alert. `docs/tokens.md` (público) fica para o ticket 05.
