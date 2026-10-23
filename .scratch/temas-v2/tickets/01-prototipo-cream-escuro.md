# 01: Protótipo do Cream escuro

Status: done

**What to build:** esboço descartável em `.scratch/temas-v2/prototipo/` com 2–3 variantes do Cream escuro lado a lado, cada uma com a mesma amostra de componentes (Card, Button solid/outline, Input focado, Tabs, Switch ligado, Alert, Table) sobre o fundo vivo. Ponto de partida: café/espresso (base marrom quase preto, texto creme), espelho do Darker sobre base quente, e uma terceira a critério. Accent: o laranja lavado do Cream, a não ser que o protótipo mostre motivo para mudar.

- [x] Variantes renderizadas lado a lado, com o Cream base e o Glass escuro de referência
- [x] Contraste medido de cada variante (texto, texto mudo, borda, `--gradient-active`, accent-text)
- [x] Valnez escolhe a variante (anotar aqui e em `docs/decisoes.md`)

## Answer

Variante G (`cream-final` no protótipo), D10 em `docs/decisoes.md`: vidro do Latte sobre o resto do Doce de leite.

- `--bg-base: #2a1f17`; glows `orange-300` 38%, `pink-300` 32%, `accent-300` 22%, `orange-200` 40%
- texto `#f6eadb`, mudo 0.74, borda 0.45, `--color-border-strong`/`--color-thumb` `#f6eadb`
- vidro `rgba(78, 66, 56, 0.78)`, hover `rgba(246, 234, 219, 0.14)`, selecionado `rgba(92, 79, 68, 0.92)`
- accent do Cream (`#e19460`), `--color-accent-text: #f0b48a`, `--color-on-accent: #1e1712`
- Medido: texto/fundo 13.55, texto/vidro 9.24, mudo/vidro 5.90, borda/fundo 3.86, accent-text/vidro 6.05, on-accent/accent 7.25, danger/vidro 3.41

## Comments

- 2026-10-23: protótipo único dos tickets 01 e 07 em `.scratch/temas-v2/prototipo/` (`node .scratch/temas-v2/prototipo/build.mjs` → http://localhost:8001). Componentes reais de `src/`, variantes como sobreposição de tokens em `temas.css`, contraste medido ao vivo no próprio painel. Aguardando a escolha do Valnez.
- 2026-10-23, rodada 2: Café foi o mais próximo, mas perde o cremoso e sólido do Cream base. Entram D Latte, E Doce de leite e F Creme noturno (superfície quase opaca, glows pastéis); Fumaça e Vinho saem.
- 2026-10-23, rodada 3: Valnez escolheu algo entre Latte e Doce de leite (vidro do Latte, resto do Doce de leite). Montado como G (`cream-final`). Contrastes medidos: texto/fundo 13.55, texto/vidro 9.24, mudo/vidro 5.90, borda/fundo 3.86, accent-text/vidro 6.05, on-accent/accent 7.25, danger/vidro 3.41. Aguardando o ok final.
