# 02: Tokens e seletores em dois eixos

Status: done

**What to build:** `tokens.css` reorganizado em Glass base (`:root`), Glass escuro (o bloco `.darker` atual), Cream base (o `.light` atual), selecionados por `data-ms-theme`/`data-ms-mode` no `<html>`. Todo seletor `.light`/`.darker` em `components.css` e `reset.css` migra. Zero mudança visual nos três temas existentes. O Cream escuro fica com um bloco reservado, herdando do Cream base, até o ticket 04. Entram também, sem mudança visual, os tokens que o Paperpen vai redefinir: `--font-family-display`, `--font-mono-style` e a textura do fundo (spec § Paperpen), já aplicados nos componentes que usam título/display, código e o fundo.

- [x] Sem atributo nenhum, a página continua Glass base
- [x] Nada em `components.css` escolhe fonte de título ou estilo do mono sem passar pelos tokens novos
- [x] Nenhum `.light`/`.darker` sobrando em `src/` (grep)
- [x] Capturas antes/depois iguais nos três temas existentes (Playwright)
- [x] Bloco de `prefers-reduced-motion` dos tokens de movimento continua valendo em todos

## Notas da implementação

- O `ThemeProvider` passa a escrever `data-ms-theme`/`data-ms-mode` (`dark` → glass/base, `darker` → glass/dark, `light` → cream/base), com a API de hoje. Sem isso a migração dos seletores quebrava os temas; a API nova fica no ticket 03. Quem estiliza `html.light` por fora perde o gancho já aqui (vai para o CHANGELOG da v2.0).
- Glass escuro também vale com só `data-ms-mode="dark"` (sem tema), já que Glass é o padrão.
- `--bg-texture` é a primeira camada do `--bg-page` (vale na `.ms-page` e no Splash). O `background-repeat: no-repeat` vale para todas as camadas: textura em `url()` que precise repetir é decisão do ticket 08.
- Ficaram fora de `--font-family-display`: `.ms-ring__number` (número dentro do anel, mesmo motivo do ticket 07), rótulos pequenos (`.ms-gallery__title`, histórico de alertas) e a marca da Navbar/Dock.
- Capturas: todas as stories nos três temas, 1280 e 390px. 336/342 idênticas pixel a pixel; as 6 restantes são o Splash, que já varia entre duas rodadas do "antes" (animação).
- Docs públicas (`docs/tokens.md`, `docs/componentes.md`) ainda descrevem `.light`/`.darker`: ficam para o ticket 05.
