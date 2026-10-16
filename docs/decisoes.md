# Decisões

Registro das decisões do Mothership DS. Uma seção por decisão, a mais
nova no fim.

## D1 — 2026-10-16 — Par espacial fica fora dos gestos de movimento

**Pergunta.** A v1.9 criou quatro gestos de movimento (assentar,
recolher, pulso, deriva), e a spec diz que todo componente migra para
eles. Só que o par `--transition-spatial`/`--ease-spatial` (0.45s, sem
overshoot), criado na v1.8, não é nenhum dos quatro. Ele é absorvido
pelos gestos, vira um quinto gesto ou fica como exceção?

**Escolha.** Exceção documentada, com um critério: entrou ou saiu de
cena, é gesto; já estava na tela e se transformou, é o par espacial.
Nenhum token muda de nome.

**Por quê.** Nenhum uso do par é entrada ou saída: o `Dock` expandindo
e recolhendo a coluna, a câmera do `Grafo3D` e a legenda escurecendo ao
filtrar são objetos grandes que já estão em cena e mudam de forma.
Absorver em assentar poria overshoot neles, o que já foi testado e
descartado na v1.8 (lê como solavanco). Um quinto gesto ("transformar")
seria coerente, mas muda o vocabulário de quatro que a spec fixou e
renomearia tokens que o `cena.ts` lê pelo nome, sem ganho prático.

**Verificado.** Busca por `--transition-spatial`/`--ease-spatial` em
`src/`: só `.ms-dock*`, a legenda do `Grafo3D` e `src/3d/cena.ts`. O
`Drawer` não usa o par (entra e sai com `0.35s var(--ease-bounce)`),
então migra para assentar/recolher no ticket 05.

## D2 — 2026-10-16 — Gallery, contorno reativo e trilho do Carousel nos gestos

**Pergunta.** Depois da migração (ticket 05), três casos ainda ficavam
fora dos tokens: os itens da `Gallery` sumiam na hora ao trocar de
filtro, ordem ou página; o contorno reativo (`.ms-hover-edge`, item da
`Gallery`, marcas dos gráficos) tinha `0.3s var(--ease-bounce)` próprio
nos dois sentidos; o trilho do `Carousel` deslizava com
`0.5s var(--ease-bounce)`. A spec diz que nenhuma transição solta sobra.

**Escolha.**
- `Gallery`: a leva que está na tela recolhe, e só depois a nova monta
  e assenta. Uma leva por vez, sem as duas se sobreporem na grade.
- Contorno reativo: crescer no hover assenta, voltar ao lugar recolhe.
  Vale também para as bolinhas do gráfico de linhas e as fatias da pizza,
  que são o mesmo vocabulário traduzido para SVG.
- Trilho do `Carousel`: par espacial, sem overshoot. Os bullets seguem
  em pulso, porque confirmam o clique.

**Por quê.** O critério do D1 resolve os três. Item que sai da grade
saiu de cena, então recolhe; a saída em sequência evita que as duas
levas disputem o mesmo espaço da grade. O hover é chegada e partida de
um estado, e o bounce na volta encolhia o elemento além do tamanho de
repouso, que é exatamente o overshoot de saída que a regra proíbe. O
trilho já está na tela e só se desloca: é um objeto grande, onde o
overshoot lê como solavanco, o mesmo motivo do `Dock`.

**Verificado.** Playwright no styleguide: troca de filtro na `Gallery`
mantém os itens anteriores com `ms-gallery-out` (0.15s) e monta os novos
com `ms-gallery-in`; hover com `0.3s` bounce ao entrar e `0.15s` ease-in
ao sair; trilho em `0.45s` `--ease-spatial`. Sob redução de movimento,
gestos em `0.01s` e trilho sem transição.

## D3 — 2026-10-16 — Gradiente de ativo também em Checkbox/Radio, campos focados e opção selecionada

**Pergunta.** O ticket 06 limitou o `--gradient-active` a seis lugares
e manteve o anel de foco sólido. Ao validar, o Valnez notou que
Checkbox e Radio marcados não seguiam o `Switch`, e pediu o gradiente
nas caixas de texto ativas e em "highlights de texto".

**Escolha.**
- Checkbox e Radio marcados ganham o gradiente no contorno. O
  preenchimento (caixa do Checkbox, miolo do Radio) é `--color-text`:
  branco no escuro, quase preto no claro. A marca do Checkbox fica na
  cor do fundo do tema. Preencher com o gradiente foi testado e
  descartado na validação. O polegar do `Switch` ligado segue o mesmo
  desenho (contorno no gradiente, preenchimento `--color-thumb`); o
  trilho continua preenchido.
- Item atual de `Sidebar` e `Dock` perde o azul (texto
  `--color-accent-text` sobre `--color-accent-soft`): fica vidro branco
  (`--color-surface`) com texto na cor normal, mais o anel no gradiente,
  o mesmo desenho do link ativo da `Navbar`. O ciano ao lado do
  gradiente sujava o visual, e os três navs passam a falar igual. No
  claro o vidro sobre o painel de vidro sumia, então o fundo do item
  atual vira token (`--color-surface-selected`, marfim a 90%, com
  `--shadow-selected`).
- Campos de texto focados (Input, Textarea, Combobox, gatilho do
  Select, que também conta com a lista aberta) trocam o anel sólido por
  uma borda no gradiente. É a única exceção ao foco sólido: botões,
  links e os outros controles seguem com `--color-accent-text`.
- Dos highlights de texto, só o rótulo da opção selecionada (Select/
  Combobox) e o do item marcado do `DropdownMenu`, com um token próprio,
  `--gradient-active-text`.

**Por quê.** Marcado é "selecionado", o mesmo sinal do `Switch`.
O campo focado é o lugar onde o usuário está escrevendo, ou seja, o
ativo da tela. Nos outros controles o foco é só passagem do teclado e
não pode ser confundido com "ativo". Texto pede 4.5:1, e as paradas do
anel não chegam lá (rosa -500 dá 3.57 sobre o vidro escuro), por isso
o token separado (-400 no escuro e no Darker, -800 no claro).

**Verificado.** Contraste do anel do campo ≥3:1 (mínimo para indicador
de foco), com as mesmas paradas do `--gradient-active`. Texto ≥4.5:1
sobre o vidro nos três temas. No escuro, o item em hover é branco a
50% e nenhuma cor de texto passa ali (já valia para o
`--color-accent-text`), então a opção selecionada com hover volta para
`--color-text` (`--gradient-active-text-hover`). Playwright nos três
temas.

## D4 — 2026-10-16 — HeroHighlight no gradiente da logo

**Pergunta.** O destaque do título do `Hero` usava um gradiente
próprio, `accent-300` → `accent-500`, ciano nos três temas. No claro
dava 1.3–2.0:1 sobre o creme (abaixo até dos 3:1 de texto grande) e
ignorava o accent laranja do tema. No escuro passava contraste, mas o
ciano pastel destoava do resto da identidade, que lê ciano → rosa →
laranja. Com o peso de exibição (ticket 07), a palavra ficou mais
pesada e o problema mais visível.

**Escolha.** `HeroHighlight` passa a usar `--gradient-active-text`, o
mesmo gradiente da opção selecionada do Select/Combobox. É a única
exceção decorativa à regra "gradiente = ativo" do ticket 06.
Comparado com o accent sólido do tema (`--color-accent-text`, que
consertava o claro mas deixava o escuro igual) e com destaque sem cor
(itálico), descartados na validação.

**Por quê.** O título do herói aparece uma vez por página e não
convive com controles ativos na mesma linha, então não há como
confundir o destaque com "selecionado". Reaproveitar o token de texto
traz junto o contraste já validado e as paradas por tema, sem um token
novo.

**Verificado.** Contraste das paradas sobre o fundo da página: escuro
(-400) 9.26/6.19/8.31, claro (-800) 5.54/7.75/6.20; o Darker é mais
escuro que o escuro. Playwright no escuro e no claro.

## D5 — 2026-10-16 — Mascote: sorriso no gradiente, esclera como na logo

**Pergunta.** O `Mascote` (ticket 08) sai do rosto da logo. Duas cores
pediam regra: o sorriso, que na logo é gradiente, esbarrava em
"gradiente = ativo" (ticket 06); e o anel do olho poderia seguir
`--color-text` em vez da tinta própria da logo.

**Escolha.** O sorriso mantém o gradiente da logo, estático, nas
coordenadas do arquivo original. O anel é a esclera: branco no escuro e
no Darker, `#191933` no claro, a mesma `--ms-logo-ink` do `LogoMark`.
Branco também no claro foi descartado na validação (≈1.1:1 sobre o
creme, o olho some).

As paradas usam `--color-accent-500`/`--color-pink-500`/
`--color-orange-500`, que são as da logo e não mudam com o tema (o
`--color-accent` vira laranja no claro). Nas animações, a piscada é a
mesma `ms-blink` da `Splash` e do `Loader`; o olhar do `pensando` usa a curva da
deriva; os saltos da pupila e as inclinações do `confuso` são pulsos
(0.2s); o "?" e as bolhas assentam ao aparecer e recolhem ao sair. O
pulso fora de clique e a deriva fora do fundo são leituras do vocabulário,
não usos da tabela do spec. A prop `label` (sem ela, `aria-hidden`)
entrou além do ticket, para o caso raro de o mascote carregar sentido
sozinho.

**Por quê.** No mascote o gradiente é a arte da marca, não um sinal de
estado, e ele não convive com controles. A esclera ligada à tinta da
logo mantém mascote e logo idênticos lado a lado em qualquer tema.

## D6 — 2026-10-16 — Mascote sem `dormindo`, com `confuso` e `pensando`

**Pergunta.** O spec pedia `piscando`, `dormindo` e `procurando`. O
`dormindo` passou por três olhos fechados (arco grosso, anel achatado,
e duas variações descartadas na comparação) e continuou estranho.

**Escolha.** `dormindo` sai. Entram `confuso` (pupila encolhida, boca em
til, rosto inclinando, "?") e `pensando` (olhar no alto, bolhas
de pensamento). Quatro expressões, todas de olho aberto. Escolha do
autor; o `pensando` foi pedido por ele além da troca.

**Por quê.** O anel aberto é quase todo o mascote. Fechado, o rosto vira
uma linha larga sobre um ponto de boca e perde a proporção. `confuso`
cobre erro e `pensando` cobre espera, os dois casos de estado vazio e
transição que o `EmptyState` (ticket 09) vai usar.

