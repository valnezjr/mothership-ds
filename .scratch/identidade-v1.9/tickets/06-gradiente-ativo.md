# 06: Gradiente da logo como sinal de "ativo"

Blocked by: 03
Status: review

**What to build:** `--gradient-active` por tema (escuro/Darker com as paradas `-500` de accent → pink → orange; claro com `-600`/`-700`), aplicado a: indicador das `Tabs`, item atual de `Navbar`/`Sidebar`/`Dock`, ponto ativo do `StepIndicator`, card selecionado e `Switch` ligado. Estático. O anel de foco não muda. Nenhum outro uso do gradiente.

- [x] Token nos três temas, documentado como de uso exclusivo
- [x] Aplicado nos seis lugares
- [x] Estado ativo continua comunicado por `aria-*`, não só pela cor
- [x] Contraste de 3:1 do indicador sobre o fundo nos três temas (medido)

**Decidido com o Valnez (2026-10-16):** "card selecionado" é a prop nova `selected` no `Card` (anel + `aria-current="true"`). No item atual de Navbar/Sidebar/Dock o gradiente entra como anel, e o fundo e o texto continuam os de antes.

## Notas

- Medido (WCAG, fundo / vidro): escuro -500 ciano 7.52/5.79, rosa 4.64/3.57, laranja 6.37/4.90; Darker 7.52/4.64/6.37 nos dois; claro accent-700 3.83/4.08, pink-600 4.26/4.54, orange-600 3.16/3.36 (o accent-600 dá 2.70, por isso o -700). Abaixo de 3:1 só no centro dos glows do fundo, limite que o `--color-accent` sólido já tinha.
- `Navbar` não tinha `aria-*` no link atual: ganhou `aria-current="location"` (campo novo em `LinkRenderProps`).
- Sidebar: o anel fica só em quem tem `aria-current`. A seção-mãe de um subtópico ativo segue no fundo "soft".
- Conferido no Playwright nos três temas (capturas dos seis lugares, `aria-*` lido no DOM). Primeira rodada de validação: Valnez aprovou o StepIndicator e pediu o gradiente em Checkbox/Radio, campos focados e opção selecionada (D3, `docs/decisoes.md`). Aplicado; aguardando nova validação.
