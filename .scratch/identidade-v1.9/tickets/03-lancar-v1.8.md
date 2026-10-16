# 03: Lançar a v1.8.0

Blocked by: 01, 02
Status: review

**What to build:** fechar a v1.8.0: `CHANGELOG.md` com "Não lançado" virando `[1.8.0]`, `package.json` em 1.8.0, seção do `CLAUDE.md` renomeada para v1.8.0. A tag e o push são do Valnez (ou com aprovação dele).

- [x] `npm run typecheck` passa
- [x] CHANGELOG, package.json e CLAUDE.md em 1.8.0
- [ ] Styleguide conferido nos três temas e abaixo de 720px
- [ ] Tag `v1.8.0` e push aprovados pelo Valnez

## Comments

- 2026-10-16 (agente): versão fechada em CHANGELOG (`[Não lançado]` vazio reaberto acima, os dois `### Corrigido` da 1.8.0 fundidos), `package.json`/`package-lock.json` e `CLAUDE.md` (seção v1.8.0 completada com o que faltava do CHANGELOG, `### Não lançado` vazio reaberto). Bullet da v1.8 saiu do roadmap do README. Typecheck, `npm test` (4/4) e `npm run styleguide` passam. Falta o Valnez: conferir o styleguide nos três temas e abaixo de 720px, e aprovar tag `v1.8.0` + push.
