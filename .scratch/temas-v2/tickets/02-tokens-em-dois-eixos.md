# 02: Tokens e seletores em dois eixos

Status: ready-for-agent

**What to build:** `tokens.css` reorganizado em Glass base (`:root`), Glass escuro (o bloco `.darker` atual), Cream base (o `.light` atual), selecionados por `data-ms-theme`/`data-ms-mode` no `<html>`. Todo seletor `.light`/`.darker` em `components.css` e `reset.css` migra. Zero mudança visual nos três temas existentes. O Cream escuro fica com um bloco reservado, herdando do Cream base, até o ticket 04. Entram também, sem mudança visual, os tokens que o Paperpen vai redefinir: `--font-family-display`, `--font-mono-style` e a textura do fundo (spec § Paperpen), já aplicados nos componentes que usam título/display, código e o fundo.

- [ ] Sem atributo nenhum, a página continua Glass base
- [ ] Nada em `components.css` escolhe fonte de título ou estilo do mono sem passar pelos tokens novos
- [ ] Nenhum `.light`/`.darker` sobrando em `src/` (grep)
- [ ] Capturas antes/depois iguais nos três temas existentes (Playwright)
- [ ] Bloco de `prefers-reduced-motion` dos tokens de movimento continua valendo em todos
