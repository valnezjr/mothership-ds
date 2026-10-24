# 08: Tokens do Paperpen

Blocked by: 02, 07
Status: done

**What to build:** o que foi escolhido no ticket 07 (seção Answer, D11) vira os blocos Paperpen base e escuro em `tokens.css`, usando os tokens preparados no ticket 02 (fontes, estilo do mono, textura) mais as redefinições de superfície, borda, sombra, desfoque, cores de texto/estado, `--chart-*`, ícones em data URI e os ajustes por tema de `components.css` (véu do Modal/Drawer, tinta da logo/mascote).

- [x] Nenhum componente com vidro sobrando no Paperpen (desfoque zero, contorno legível)
- [x] Contrastes medidos e anotados nos tokens
- [x] Fontes do Paperpen fora do carregamento padrão (quem não usa o tema não baixa)
- [x] Todas as stories conferidas nos dois modos, a 1280px e 390px
- [x] `.ms-hero__highlight` com folga para glifos que vazam (padding + margem negativa + `box-decoration-break: clone`), sem mudança visual nos outros temas
- [x] Preenchimento em hachura como token (ex.: `--fill-solid`), não regra solta por componente
- [x] Validado pelo Valnez

## Notas da implementação

- Blocos `[data-ms-theme="paperpen"]` (base) e `…[data-ms-mode="dark"]` em `tokens.css`. Base com os valores da D11/rodada 3 (título Homemade Apple, hachura, contorno médio, papel quadriculado sobre aquarela, ativo em caneta vermelha). O escuro saiu do e-ink na validação (abaixo). Contrastes anotados em cada token.
- `--fill-solid` (novo, `none` fora do Paperpen) é uma camada por cima da cor: papel a 18% entre linhas de 2px. Dá exatamente a "cor a 82% + linhas cheias" do protótipo sem depender da cor, então um token serve a todos. Aplicado em Button solid, página ativa, ícone do Alert, Checkbox marcado e, fora da lista do protótipo, badge do PricingCard (mesmo par do Button) e avatar sem foto (o gradiente roxo fixo destoava do papel).
- Fontes: o `tokens.css` só nomeia as famílias; quem usa carrega (como a Outfit). O styleguide ganhou um `<link>` separado do Google Fonts: o CSS vem sempre, o arquivo de fonte só quando um texto usa a família. README/docs ficam para o ticket 05.
- `background-repeat` da `.ms-page`/Splash passou a `repeat` em todos os temas (a granulação é um ladrilho). Os glows ocupam a área inteira, então nada muda neles: capturas idênticas.
- `.ms-hero__highlight`: folga vertical e `box-decoration-break: clone` globais; a lateral só no Paperpen, porque o gradiente dos outros temas corre na horizontal e se espalharia (primeira versão mudava ~2 mil px, Δ 29/255). Agora o Hero de Glass/Cream difere em Δ máx 1/255 (arredondamento).
- Ajustes por tema em `components.css`: véu do Modal/Drawer (o próprio papel a 72%, como o Cream), tinta da logo/mascote (`--color-text`), entrelinha do Hero, `StatTile` em `--text-2xl`, anel do hover-edge sem o ciano -300 de fallback, halos coloridos (Gallery nova, Meter) zerados, ícone rosa do Alert no e-ink.
- Fora do protótipo, por contraste medido (confirmar na validação):
  - Gráficos do base vêm do Cream base (o protótipo usava o vermelho do ativo e o verde de status); os do escuro, do Cream escuro antigo (accent/violet/pink -400, highlight -600).
  - Ícone do Alert sobre a hachura pede 3:1: laranja e cinza do base viram -700 (vale para o tema inteiro: badges, bordas). No escuro, violet/pink/orange/gray vão ao -400, e o rosa do ícone deixa o -600 de lado (2.03).
  - Fallback `"Comic Sans MS"` no corpo, para manter o traço manuscrito enquanto a Patrick Hand carrega.
- Conferido (Playwright, `prefers-reduced-motion` para parar o fundo vivo): 56 stories × base/escuro × 1280/390, sem erro de página, sem `backdrop-filter` nem `box-shadow` sobrando. Glass base/escuro e Cream base/escuro antes × depois: 432/448 idênticas; as 16 restantes são o Splash (varia sozinho) e o Hero (Δ 1/255).
- Para a validação: a Homemade Apple só tem peso 400, e Hero/`StatTile` usam 600 (negrito sintético, como no protótipo).
- `revisao-spec`: TOKENS.md atualizado (achado duro). Ficam como julgamento: `rgba` da tinta repetido nos tokens (mesmo padrão do Cream), regras por tema espalhadas em `components.css` (o Cream faz igual), véu duplicado entre Modal/Drawer.
- Validação (2026-10-24), duas revisões do Valnez:
  - Escuro: o e-ink ficava parecido demais com o Cream escuro, que passou a usar a paleta dele (D10, revisão). Comparadas ao vivo três tintas azuis (marinho `#142040`, tinta `#1a2b5a`, ardósia `#1c2636`) contra o e-ink; ficou a tinta azul, com texto off-white frio `#e8edf5`, caneta azul clara `#9fb8ff`, vermelho `#ffa49b` (o `#ff8a80` do protótipo dava 4.04 como texto no hover) e cores de volta. Ativo como texto vira a cor do texto no hover, como no Glass base. D11 revisada.
  - Corpo: a Patrick Hand lia menor que a Outfit em 16px. Medido: mesmo "x" (0.47 × 0.48), ~22% mais estreita, então `font-size-adjust` não resolve. `--text-xs/sm/md` a 112,5% no Paperpen (comparado ao vivo com 100% e 120%); títulos fora.
  - Reconferido: 56 stories × base/escuro × 1280/390, sem erro de página, sem vidro nem sombra.
