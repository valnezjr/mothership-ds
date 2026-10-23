# 08: Tokens do Paperpen

Blocked by: 02, 07
Status: ready-for-agent

**What to build:** o que foi escolhido no ticket 07 (seção Answer, D11) vira os blocos Paperpen base e escuro em `tokens.css`, usando os tokens preparados no ticket 02 (fontes, estilo do mono, textura) mais as redefinições de superfície, borda, sombra, desfoque, cores de texto/estado, `--chart-*`, ícones em data URI e os ajustes por tema de `components.css` (véu do Modal/Drawer, tinta da logo/mascote).

- [ ] Nenhum componente com vidro sobrando no Paperpen (desfoque zero, contorno legível)
- [ ] Contrastes medidos e anotados nos tokens
- [ ] Fontes do Paperpen fora do carregamento padrão (quem não usa o tema não baixa)
- [ ] Todas as stories conferidas nos dois modos, a 1280px e 390px
- [ ] `.ms-hero__highlight` com folga para glifos que vazam (padding + margem negativa + `box-decoration-break: clone`), sem mudança visual nos outros temas
- [ ] Preenchimento em hachura como token (ex.: `--fill-solid`), não regra solta por componente
- [ ] Validado pelo Valnez
