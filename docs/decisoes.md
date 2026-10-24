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
til, rosto inclinando, "?") e `pensando` (olhar no alto, boca
entreaberta balbuciando, herdada do `dormindo`, bolhas de pensamento). Quatro expressões, todas de olho aberto. Escolha do
autor; o `pensando` foi pedido por ele além da troca.

**Por quê.** O anel aberto é quase todo o mascote. Fechado, o rosto vira
uma linha larga sobre um ponto de boca e perde a proporção. `confuso`
cobre erro e `pensando` cobre espera, os dois casos de estado vazio e
transição que o `EmptyState` (ticket 09) vai usar.

## D7 — 2026-10-16 — `EmptyState` com o `procurando` por padrão

**Pergunta.** O ticket 09 pedia o `Mascote` `dormindo` como ilustração
padrão do `EmptyState`, e o `dormindo` saiu em D6.

**Escolha.** `procurando`. O vazio mais comum do DS é "procurei e não
achei" (filtro da `Gallery`, tabela sem linhas). Onde o vazio é só
calmaria, a ilustração é trocada: o histórico de alertas usa `piscando`;
erro pede `confuso`, espera pede `pensando`.

**Por quê.** Das quatro, `procurando` é a que diz "nada aqui" sem
sugerir erro nem espera.

## D8 — 2026-10-23 — Temas em dois eixos: Mothership Glass e Mothership Cream

**Pergunta.** A lista `"dark" | "darker" | "light"` mistura identidade e
claridade. Para dar um modo escuro ao claro, o Darker vira o quê, e
como o consumidor escolhe?

**Escolha.** Dois eixos: `theme` (`"glass"` | `"cream"`) e `mode`
(`"base"` | `"dark"`, com `"system"` opcional). Glass base é o antigo
escuro, Glass escuro o antigo Darker, Cream base o antigo claro, Cream
escuro é novo e sai de protótipo. No `<html>`, `data-ms-theme` e
`data-ms-mode` no lugar de `.light`/`.darker`. O `ThemeSwitch` alterna
o modo dentro do tema; trocar de tema é no `ThemeMenu`. Escolha do
autor, sobre recomendação do agente.

**Por quê.** Com dois eixos, cada tema ganha o seu par noturno sem
inventar nomes, e o interruptor tem um sentido só. Atributos
prefixados não colidem com classes `.light`/`.darker` de quem instala.
Quebra API, por isso v2.0.0.

## D9 — 2026-10-23 — Mothership Paperpen, terceiro tema, na v2.0

**Pergunta.** Entra um tema de papel e caneta azul, com muito contorno e
fonte cursiva, além de Glass e Cream. Cursiva em todo texto, com modo
escuro, e em que versão?

**Escolha.** Entra na v2.0, com base e escuro (papel escuro, caneta gel
clara). Cursiva em títulos e display; manuscrita de letra de forma no
corpo, campos e tabelas; terminal em Maple Mono itálico. Visual sai de
protótipo. Escolha do autor; a v2.0 junto foi preferência dele sobre a
v2.1 recomendada.

**Por quê.** Cursiva em 14px, em tabela e campo, perde legibilidade
(pior para dislexia); a manuscrita de forma mantém a cara de escrito à
mão. O itálico do Maple Mono já é cursivo e já está no DS. Com modo
escuro, o `toggleMode` vale em qualquer tema e os dois eixos continuam
simétricos.

## D10 — 2026-10-23 — Cream escuro: caramelo sobre doce de leite

**Pergunta.** O Cream ganha modo escuro (D8). Qual escuro mantém o
creme?

**Escolha.** Base marrom doce de leite (`#2a1f17`), glows pastéis
quentes, texto creme (`#f6eadb`), vidro leitoso quase opaco
(`rgba(78, 66, 56, 0.78)`), accent laranja lavado do Cream base.
Escolhido em protótipo (`.scratch/temas-v2/`, ticket 01) depois de seis
variantes: café, fumaça, vinho, latte, doce de leite e creme noturno.
Escolha do autor.

**Por quê.** O café era o mais próximo, mas o vidro translúcido sobre
quase preto perdia o "cremoso e sólido" do Cream base. O que segura essa
sensação é a superfície quase opaca do latte; o fundo e os glows do doce
de leite dão o calor. Contrastes medidos no ticket 01 (texto/vidro 9.24,
borda/fundo 3.86).

**Revisão (ticket 04).** Com o bloco aplicado no styleguide, o vidro de
latte ficou translúcido e pouco saturado demais: sem o aspecto creme do
modo claro. O painel virou caramelo, mais opaco e saturado
(`rgba(96, 66, 40, 0.92)`), com texto `#fbecd6`; fundo e glows do doce de
leite ficaram. Escolhido ao vivo entre caramelo, doce de leite e toffee,
cada um também com glows mais fortes; o caramelo foi o único que passava
sem subir os tons de accent e gradiente. Escolha do autor. Contrastes no
comentário de cada token (texto/vidro 8.23, borda/vidro 3.02).

**Revisão (2026-10-24, durante o ticket 08).** Com o e-ink do Paperpen
pronto, a paleta dele pareceu ao autor combinar mais com o Cream escuro.
Comparadas ao vivo três variantes: o caramelo, a paleta e-ink com os
glows do Cream e a mesma sem glows. Ficou a paleta e-ink com os glows:
papel âmbar `#c9b998`, tinta `#1f1c18`, vidro claro
(`rgba(236, 226, 206, 0.6)`), accent laranja lavado e gradiente da logo
mantidos. O escuro passa a ser "baixar a luz", não inverter: texto escuro
sobre fundo meio-tom. Por ser meio-tom, accent como texto, ativo, danger,
success e gráficos descem de um a três passos (contrastes no comentário
de cada token: texto/vidro 11.30, borda/papel 3.48). Escolha do autor.

## D11 — 2026-10-23 — Paperpen: papel quadriculado e e-ink

**Pergunta.** Como fica o Paperpen (D9) em fontes, papel, preenchimento,
contorno e ativo, e o que é o modo escuro dele?

**Escolha.** Base: papel quadriculado sobre glows em aquarela, caneta
esferográfica azul, sem vidro. Homemade Apple nos títulos, Patrick Hand
no corpo. Preenchimento sólido em hachura de caneta, contorno meio-termo
(cantos levemente irregulares), ativo em caneta vermelha. Escuro: e-ink
quente monocromático, papel cinza âmbar fosco e tinta preta, com a caneta
vermelha do ativo como única cor. Escolhido em protótipo (ticket 07),
em quatro rodadas. Escolha do autor.

**Por quê.** A Patrick Hand foi a única manuscrita confortável em 14px;
Caveat e Shadows Into Light não acompanharam. O e-ink troca a ideia de
"inverter o papel" por "baixar a luz": menos brilho à noite sem perder a
tinta escura sobre papel. Manter só o ativo em vermelho deixa o sinal de
"selecionado" com a mesma identidade nos dois modos. Sem cor, estado
continua por ícone, texto e `aria`.

**Revisão (2026-10-24, ticket 08).** Aplicado, o e-ink ficou estranho, e
o Cream escuro passou a usar a paleta dele (D10): os dois escuros ficariam
parecidos demais. O escuro do Paperpen segue a linha azulada do base:
papel tinta azul `#1a2b5a`, texto off-white frio `#e8edf5`, caneta azul
clara, e as cores voltam (ativo em caneta vermelha `#ffa49b`, estados,
gráficos, glows em aquarela escurecidos). Escolhido ao vivo entre
azul-marinho, tinta azul e ardósia azul. No mesmo passo, o corpo em
Patrick Hand sobe para 112,5%: com o mesmo "x" da Outfit, ela é ~22%
mais estreita e lia menor em 16px (comparado com 100% e 120%). Escolha
do autor.

## D12 — 2026-10-23 — Mothership Flat, quarto tema, na v2.0

**Pergunta.** Falta um tema neutro e plano, sem vidro, com claro e
escuro. Quanto da marca entra nele?

**Escolha.** Mothership Flat: cinzas neutros, superfície opaca, sem
vidro nem sombra, glows bem sutis. A cor da marca só aparece no sinal
de ativo (gradiente da logo) e nos estados; o accent é tinta neutra.
Entra na v2.0, como o Paperpen. Superfícies separadas do fundo só por tom (card um passo acima do
fundo), sem borda; campos e controles mantêm a borda de 3:1. Escolhido
no protótipo (ticket 09) entre borda, tom e os dois. Escolha do autor.

**Por quê.** É o tema para quem precisa da lib sem a estética de
vidro: produto, painel, documentação. Manter só o ativo colorido é a
mesma regra do e-ink (D11): o sinal de "selecionado" carrega a
identidade em qualquer tema. Os glows sutis mantêm o vínculo com os
outros três sem pesar.
