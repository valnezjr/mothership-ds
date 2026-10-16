# 02: Select e Combobox no portal do Popover

Blocked by: None
Status: ready-for-agent

**What to build:** o popup do `Select` e do `Combobox` passa a ser portal no `<body>` com `position: fixed`, posicionado pelo `computePosition` do `Popover`, para não ser cortado por um ancestral com `overflow: hidden`. Teclado, `aria-activedescendant` e clique fora continuam iguais.

- [ ] Dentro de um container com `overflow: hidden`, o popup aparece inteiro
- [ ] Vira para cima quando não cabe embaixo
- [ ] Reposiciona em scroll e resize
- [ ] Teclado (setas, Enter, Esc, Home/End) e clique fora sem regressão
- [ ] Story no styleguide mostrando o caso do `overflow: hidden`
- [ ] Limite removido de ARCHITECTURE.md / comentário do arquivo
