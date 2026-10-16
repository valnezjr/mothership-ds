# 06: Gradiente da logo como sinal de "ativo"

Blocked by: 03
Status: ready-for-agent

**What to build:** `--gradient-active` por tema (escuro/Darker com as paradas `-500` de accent → pink → orange; claro com `-600`/`-700`), aplicado a: indicador das `Tabs`, item atual de `Navbar`/`Sidebar`/`Dock`, ponto ativo do `StepIndicator`, card selecionado e `Switch` ligado. Estático. O anel de foco não muda. Nenhum outro uso do gradiente.

- [ ] Token nos três temas, documentado como de uso exclusivo
- [ ] Aplicado nos seis lugares
- [ ] Estado ativo continua comunicado por `aria-*`, não só pela cor
- [ ] Contraste de 3:1 do indicador sobre o fundo nos três temas (medido)
