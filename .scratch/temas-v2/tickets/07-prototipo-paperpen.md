# 07: Protótipo do Paperpen

Status: done

**What to build:** esboço descartável em `.scratch/temas-v2/prototipo/` (o mesmo do ticket 01), com Paperpen base e escuro sobre a mesma amostra de componentes. Cobre: textura de papel (SVG `feTurbulence` em data URI ou similar, sem imagem externa), azul de caneta esferográfica, contorno no lugar de preenchimento, e o par de fontes (cursiva nos títulos, manuscrita no corpo) com 2–3 combinações lado a lado. Terminal em Maple Mono itálico.

Em aberto para o protótipo:
- Qual sinal de ativo no lugar de `--gradient-active` (o gradiente da logo sobre papel, ou uma metáfora de papel, como marca-texto ou sublinhado de caneta)
- Accent e cores de estado (caneta vermelha para erro? verde?)
- O que o `LivingBackground` faz no Paperpen (desligado, ou textura estática)
- Botão `solid`: preenchido em azul de caneta ou só contorno grosso

- [x] Base e escuro renderizados, com Glass base de referência
- [x] Combinações de fonte comparadas em texto pequeno (14px), tabela e campo, não só em título
- [x] Contraste medido (texto, mudo, borda, sinal de ativo, foco)
- [x] Valnez escolhe (anotar aqui e em `docs/decisoes.md`)

## Answer

D11 em `docs/decisoes.md`. Valores no `temas.css` do protótipo (rodadas 1–4).

**Base:** papel `#f7f3ea` com granulação (`feTurbulence`), quadriculado de 24px sobre os glows em aquarela; caneta `#1c3f94`. Sem vidro: `--blur-glass: 0`, sombras desligadas, `--border-width: 1.5px`. Corpo em Patrick Hand, títulos e display em Homemade Apple, terminal em Maple Mono itálico. Preenchimento sólido em hachura (base de caneta a 82% + linhas diagonais de 2px/5px) em botão solid, página ativa, ícone do Alert e checkbox. Contorno meio-termo médio (`--radius-md: 48px 10px 40px 10px / 10px 40px 10px 48px`). Ativo em caneta vermelha (`--color-danger` `#c62828` como `--gradient-active`).

**Escuro:** e-ink quente monocromático, não invertido. Papel `#c9b998` (luz âmbar), tinta `#1f1c18`, sem glows nem cor; estados por ícone/texto/`aria` e tons de tinta. A única cor é o ativo: caneta `#a8221b` (anel, 3.74:1) e `#861a14` (texto, 5.01:1).

Achado de passagem: `.ms-hero__highlight` corta glifos que vazam da caixa (`background-clip: text`). Corrigido no protótipo; vai para o ticket 08.

## Comments

- 2026-10-23: protótipo único dos tickets 01 e 07 em `.scratch/temas-v2/prototipo/` (`node .scratch/temas-v2/prototipo/build.mjs` → http://localhost:8001). Componentes reais de `src/`, variantes como sobreposição de tokens em `temas.css`, contraste medido ao vivo no próprio painel. Aguardando a escolha do Valnez.
- 2026-10-23, rodada 2 (escolhas do Valnez): corpo em Patrick Hand (fixo); Shadows e Caveat descartadas para título, entram 7 candidatas. Papel fixo: quadriculado sobre glows aquarela. Botão solid preenchido, mas com preenchimento de caneta (rabisco/marcador/hachura em comparação, aplicado a botão solid, paginação ativa, ícone do Alert e checkbox). Contorno: meio-termo entre reto e rabiscado (sutil e médio em comparação).
- 2026-10-23, rodada 3 (escolhas do Valnez): título Homemade Apple, preenchimento em hachura, contorno meio-termo médio, ativo em caneta vermelha. O corte do "flutua" vinha do `background-clip: text` do `.ms-hero__highlight` (a cursiva vaza da caixa inline); corrigido no protótipo com padding + margem negativa + `box-decoration-break: clone`, a levar para `components.css` no ticket 08 (bug real com qualquer fonte de traço longo). Escuro deixa de ser papel invertido e vira e-ink quente monocromático (papel cinza fosco, tinta preta, sem glows nem cor; estado por ícone/texto/aria e tons de tinta), em três luzes frontais: média `#d9d3c6`, baixa `#c2bbac`, âmbar `#c9b998`. Destaque do herói no e-ink: sublinhado de tinta. Aguardando o nível de luz.
