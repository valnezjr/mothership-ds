# 02: Select e Combobox no portal do Popover

Blocked by: None
Status: done

**What to build:** o popup do `Select` e do `Combobox` passa a ser portal no `<body>` com `position: fixed`, posicionado pelo `computePosition` do `Popover`, para não ser cortado por um ancestral com `overflow: hidden`. Teclado, `aria-activedescendant` e clique fora continuam iguais.

- [x] Dentro de um container com `overflow: hidden`, o popup aparece inteiro
- [x] Vira para cima quando não cabe embaixo
- [x] Reposiciona em scroll e resize
- [x] Teclado (setas, Enter, Esc, Home/End) e clique fora sem regressão
- [x] Story no styleguide mostrando o caso do `overflow: hidden`
- [x] Limite removido de ARCHITECTURE.md / comentário do arquivo

## Comments

- 2026-10-16: conferido com Playwright (headless) no styleguide: overflow hidden, flip com viewport baixa (lista encolhe para caber), resize, teclado, clique fora, Combobox filtrando, Select dentro de Popover, tema claro. A revisão (`/revisao-spec`) achou uma regressão — escolher opção de um Select dentro de Popover fechava o Popover — corrigida com `isInOwnedPortal`. O `Combobox` continua sem Home/End (já não tinha; não é regressão). Fica para depois: extrair o hook de posição flutuante que `Popover`, `DropdownMenu` e `Select` repetem.
