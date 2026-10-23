# 03: API de tema e modo

Blocked by: 02
Status: ready-for-agent

**What to build:** `ThemeProvider`/`useTheme` com os dois eixos do spec (`theme`, `mode`, `resolvedMode`, `setTheme`, `setMode`, `toggleMode`), `mode="system"` ouvindo `prefers-color-scheme`, `persist` com migração da chave antiga, `ThemeSwitch` alternando o modo e `ThemeMenu` com os oito pares em quatro grupos. `Theme` = `"glass" | "cream" | "paperpen" | "flat"`. Tipos exportados por `src/index.ts`.

- [ ] `data-ms-theme`/`data-ms-mode` aplicados depois da hidratação, como hoje
- [ ] `system` acompanha a troca do SO sem recarregar
- [ ] `ms-theme` antigo (`dark`/`darker`/`light`) convertido na leitura
- [ ] `ThemeSwitch`: `aria-checked` = escuro; decidir com o Valnez o ícone de cada estado (Glass base já é escuro, então sol/lua não mapeia direto)
- [ ] `ThemeMenu`: grupos com rótulo acessível, item ativo `menuitemradio` marcado
- [ ] `npm run typecheck` limpo
