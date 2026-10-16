# 08: Componente Mascote com três expressões

Blocked by: 03
Status: review

**What to build:** esboço em SVG de três expressões derivadas do olho de `assets/logo.svg` (piscando, dormindo, procurando; depois da validação, `dormindo` deu lugar a `confuso` e `pensando`, D6), entregue ao Valnez para refinar no Figma. Com a arte aprovada, o componente `Mascote` (`expressao`, `size`, animação própria de cada expressão com os gestos, `prefers-reduced-motion`), gerado como o `LogoMark`. IDs de SVG via `React.useId()`.

- [x] Esboço entregue e aprovado/refinado pelo Valnez (HITL)
- [x] `Mascote` exportado em `src/index.ts`, com story
- [x] Animações respeitam `prefers-reduced-motion`
- [x] Funciona nos três temas
