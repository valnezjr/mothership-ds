# 12: Auditoria de qualidade e lançamento da v1.9.0

Blocked by: 05, 06, 07, 09, 10, 11
Status: review

**What to build:** `axe-core` e contraste em todas as stories nos três temas, corrigindo o que a identidade mexeu; então CHANGELOG, package.json e CLAUDE.md em 1.9.0. Tag e push com aprovação do Valnez.

- [x] `axe-core` sem violações novas nos três temas
- [x] Release 1.9.0 preparada
- [ ] Tag e push aprovados pelo Valnez

## Comments

- 2026-10-16: a v1.8.0 foi taggeada na `identidade-v1.9`, sem mesclar no `master` (decisão do Valnez: mesclar só no fim da v1.9). Ao lançar a v1.9, mesclar `identidade-v1.9` no `master` — só assim o styleguide do GitHub Pages sai da 1.7.0.
- 2026-10-16 (agente): `axe-core` (wcag2a/aa, 2.1 a/aa, best-practice) nas 57 stories × três temas, a 1280px e 390px, no build da HEAD e no da `v1.8.0`, com diff entre os dois: nenhuma violação nova. Três herdadas corrigidas (badge do `PricingCard` 2.5:1 → `--color-on-accent`; `region` do Accordion sem nome; ARIA de gatilho no `DropdownMenu` em modo `"context"`). Ficam: `landmark-unique` nas stories de Navbar/Breadcrumbs (várias instâncias na mesma página, só do styleguide) e `label-content-name-mismatch` do badge da `Dock`. Limite conhecido: o axe não mede texto em gradiente (`--gradient-active-text`, `HeroHighlight`); esses contrastes são os medidos em D3/D4. Release: CHANGELOG `[1.9.0]` com `[Não lançado]` reaberto, `package.json`/lock e `CLAUDE.md` em 1.9.0, bullet da v1.9 e sub-bullet do `Prose` fora do roadmap do README. Typecheck, `npm test` (7/7) e `npm run styleguide` passam. Falta o Valnez: conferir o styleguide nos três temas e abaixo de 720px, e aprovar merge no `master`, tag `v1.9.0` e push.
