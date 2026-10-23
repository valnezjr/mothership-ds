# 03: API de tema e modo

Blocked by: 02
Status: done

**What to build:** `ThemeProvider`/`useTheme` com os dois eixos do spec (`theme`, `mode`, `resolvedMode`, `setTheme`, `setMode`, `toggleMode`), `mode="system"` ouvindo `prefers-color-scheme`, `persist` com migração da chave antiga, `ThemeSwitch` alternando o modo e `ThemeMenu` com os oito pares em quatro grupos. `Theme` = `"glass" | "cream" | "paperpen" | "flat"`. Tipos exportados por `src/index.ts`.

- [x] `data-ms-theme`/`data-ms-mode` aplicados depois da hidratação, como hoje
- [x] `system` acompanha a troca do SO sem recarregar
- [x] `ms-theme` antigo (`dark`/`darker`/`light`) convertido na leitura
- [x] `ThemeSwitch`: `aria-checked` = escuro; decidir com o Valnez o ícone de cada estado (Glass base já é escuro, então sol/lua não mapeia direto)
- [x] `ThemeMenu`: grupos com rótulo acessível, item ativo `menuitemradio` marcado
- [x] `npm run typecheck` limpo

## Notas da implementação

- Ícones (escolha do Valnez): Glass base lua vazada, base dos outros temas sol, qualquer escuro lua cheia. Mesmo par no polegar (`--icon-switch`, bloco "Ícone do ThemeSwitch" em `tokens.css`) e nos itens/gatilho do `ThemeMenu`. Muda o polegar do Glass base, que era lua cheia.
- Polegar à direita = escuro (`[data-ms-mode="dark"]`), não mais = Cream.
- `persist` grava `ms-theme` (tema) e `ms-mode` (modo escolhido, pode ser `system`); valores antigos de `ms-theme` são convertidos e regravados. Só grava depois de ler, para o StrictMode não sobrescrever a escolha salva.
- `toggleMode` parte do modo resolvido e sai do `system`.
- Lógica pura em `src/components/theme-state.ts`, testada em `theme-state.test.ts`. Provider/Switch/Menu conferidos com Playwright numa página descartável (StrictMode, persist, legado, `system` com `emulateMedia`): 20/20.
- Paperpen e Flat já estão no menu, mas sem bloco de tokens renderizam como Glass até os tickets 08/10.
- Validação visual do Valnez: ok (2026-10-23).
- `revisao-spec` (2026-10-23): padrões sem infração no código; spec sem requisito faltando. Pendências:
  - `mode="system"` pisca: `prefersDark` começa `false` e fica velho ao voltar com `setMode("system")`, então o primeiro frame sai em `base` com o SO escuro. Ler `matchMedia` na hora (ex.: `useSyncExternalStore`).
  - `ThemeMenu` sem opção "Sistema": depois de escolher um par, não dá para voltar ao `system` pela interface (spec não pede).
  - `persist` trocado de `false` para `true` em execução grava os padrões antes de ler (caso de borda).
  - Smells para o ticket 05: regra do ícone em dois lugares (`modeIcon` e `tokens.css`), tema+modo sem tipo próprio, `["base", "dark"]` literal no menu, nome `lerSalvo`.
  - `TOKENS.md` (175–182) e `CLAUDE.md` desatualizados; entram no ticket 05.
