# 09: Protótipo do Flat

Status: done

**What to build:** Flat base e escuro no mesmo protótipo dos tickets 01 e 07 (`.scratch/temas-v2/prototipo/`), sobre a mesma amostra de componentes. Neutro (cinzas zinco), sem vidro e sem sombra, glows bem sutis, cor só no `--gradient-active` e nos estados. Comparar três jeitos de separar superfície do fundo: só borda, só tom (card um passo acima do fundo), tom + borda fraca.

- [x] Base e escuro renderizados
- [x] Contraste medido: claro texto/vidro 17.72, mudo 6.09, borda/fundo 3.12, on-accent 16.97, danger 3.21; escuro texto/vidro 14.25, mudo 7.67, borda/fundo 3.82, danger 4.87
- [x] Valnez escolhe a separação (anotar aqui e em `docs/decisoes.md`)

## Notas

- Achado: a borda de controle precisa de 3:1 (`--color-border`), mas uma borda de card nesse peso pesa demais num tema flat. O protótipo usa uma divisória fraca só para superfícies (`--p-card-border`, ~1.3:1). Se ficar, vira token (ex.: `--color-border-subtle`) no ticket 02, com o valor de `--color-border` nos outros temas.
- No "só tom", campo dentro de card do mesmo tom some: o campo volta à cor do fundo.

## Answer

Só tom, sem borda (escolha do Valnez, 2026-10-23). Card, StatTile e tabela um passo acima do fundo, sem contorno; campos e controles mantêm a borda de 3:1.

- Claro: fundo `#f4f4f5`, superfície `#ffffff`, texto `#18181b`, mudo 0.68, borda de controle `rgba(24, 24, 27, 0.48)` (3.12:1), hover `rgba(24, 24, 27, 0.06)`, accent `#18181b` com `--color-on-accent: #fafafa`; ativo com as paradas do Cream base (`accent-700`/`pink-600`/`orange-600`, texto `-800`); glows `-200`/`-300` a 14–22%.
- Escuro: fundo `#18181b`, superfície `#232327`, selecionado `#2a2a2f`, texto `#f4f4f5`, mudo 0.7, borda de controle `rgba(244, 244, 245, 0.42)` (3.82:1), accent `#f4f4f5` com `--color-on-accent: #18181b`; ativo como o do Glass; glows `-800`/`-900` a 16–18%.
- Campo dentro de superfície do mesmo tom some: no Flat, `.ms-input` dentro de card usa a cor do fundo.
- A divisória fraca (`--p-card-border`) não é mais necessária: nenhum token novo de borda.

## Comments

- 2026-10-23: escolhas do Valnez antes do protótipo: nome Mothership Flat, neutro + ativo da logo, glows bem sutis, separação a prototipar.
