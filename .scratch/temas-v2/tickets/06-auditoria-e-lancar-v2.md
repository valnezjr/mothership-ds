# 06: Auditoria e lançamento da v2.0.0

Blocked by: 05
Status: done

**What to build:** `axe-core` nas 57 stories nos oito pares de tema/modo, a 1280px e 390px, comparado com o build da v1.9.0; revisão do `release-manager` (major, breaking changes listadas); `package.json` em 2.0.0.

- [x] Nenhuma violação nova em relação à v1.9.0
- [x] Relatório do `release-manager` aprovado
- [x] Valnez aprova o lançamento

## Comments

- 2026-10-24 (agente): `axe-core` 4.10 (wcag2a/aa, 2.1 a/aa, best-practice) nas 58 stories (as 57 da v1.9 mais "Temas") × oito pares, a 1280px e 390px, no build da HEAD; a `v1.9.0` nos três temas dela. Pares com equivalente na v1.9 (Glass base = escuro, Glass escuro = Darker, Cream base = claro) contra o mesmo par; os cinco novos contra a união dos três temas da v1.9 na mesma story. Tema escrito direto em `data-ms-theme`/`data-ms-mode` (classes `light`/`darker` na v1.9) e conferido a cada story. Primeira passada: só `scrollable-region-focusable` no `<main>` do styleguide aparecia em stories novas — regra herdada (51 ocorrências na v1.9), que muda de story conforme a altura do conteúdo (Paperpen a 112,5%, grade da "Temas"). Corrigida com `tabIndex={0}` no `<main>` e na receita de SPA de `docs/componentes.md`. Segunda passada: **0 novas**, 48 herdadas a menos. Ficam `landmark-unique` (Navbar, Breadcrumbs) e o `<pre>` do `Prose` a 390px (anotado em docs/componentes.md § Prose). Limites: os `<iframe>` da story "Temas" não entram (`iframes: false`; mostram as mesmas stories já auditadas em cada par), e o axe não mede texto em gradiente.
- 2026-10-24 (agente): relatório do `release-manager` — **score 95/100, versão 2.0.0 (major), pronto para publicar: sim**, pendente só a aprovação do Valnez. Quebras: `Theme` com valores novos, `toggle` → `toggleMode`, classes `.light`/`.darker` → atributos `data-ms-*`, `ThemeSwitch` alternando modo; todas no CHANGELOG § Quebras com migração e exemplos em `docs/migracao-v2.md`. `src/index.ts` sem export removido (`Theme` mudou de valores; `ThemeMode`/`ResolvedMode` novos). `dependencies` vazio, `peerDependencies`/`exports`/`sideEffects` iguais. Typecheck, `npm test`, `npm run styleguide` e build do `examples/next-app` passam. Problema achado e corrigido: `description` do `package.json` ainda com "escuro/Darker/claro". Os 5 pontos descontados são a `description`. Escopo a mais: o `tabIndex` (herdada corrigida de passagem, como na v1.9).
- 2026-10-24 (agente): CHANGELOG `[2.0.0]`, `package.json`/lock e CLAUDE.md em 2.0.0 com a data de hoje, como na v1.9 (release preparada antes do aval; a data muda se a aprovação vier depois). Falta o Valnez: conferir o styleguide nos oito pares e abaixo de 720px (inclui Tab até o `<main>`), e aprovar merge no `master`, tag `v2.0.0` e push.
- 2026-10-24 (agente): Valnez aprovou o lançamento, com dois pedidos antes: olho da `Splash` fora do centro (era o Firefox/Zen: `transform-box: fill-box` no `.ms-splash__word` soma o transform das letras escondidas; origem agora fixa no `viewBox`, igual nos dois motores) e o Flat como tema padrão (D13). Merge em fast-forward no `master`, tag `v2.0.0` e push.
