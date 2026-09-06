# Component Guidelines

Como criar ou editar um componente no Mothership DS. Para o "porquê"
por trás de cada regra, ver [ARCHITECTURE.md](ARCHITECTURE.md); para
props dos componentes existentes, [`docs/componentes.md`](docs/componentes.md).

## Onde um componente novo entra

Quatro lugares, sempre os quatro:

1. **CSS** em `src/styles/components.css` — prefixo `ms-`, BEM
   (`.ms-tabs`, `.ms-tabs__item`, `.ms-tabs--pill`), só tokens (ver
   [TOKENS.md](TOKENS.md)), nunca um valor solto.
2. **Componente** em `src/components/` — arquivo novo só se a área for
   nova; do contrário, adiciona ao arquivo da área existente
   (`charts.tsx` já tem 8 componentes de dados, `primitives.tsx` tem os
   controles básicos).
3. **Export** em `src/index.ts`.
4. **Story** em `styleguide/stories.tsx` — uma entrada no array
   `STORIES`; navegação, índice e âncoras se montam sozinhos a partir
   dela.

Pular qualquer um dos quatro deixa o componente inacessível (sem
export), indocumentado (sem story) ou sem estilo.

## Template do componente

```tsx
"use client"; // só se usar estado, efeito, handler ou ref com comportamento

import React from "react";

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: { id: string; label: React.ReactNode; content: React.ReactNode }[];
}

export function Tabs({ items, className, ...rest }: TabsProps) {
  return (
    <div
      className={["ms-tabs", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {/* ... */}
    </div>
  );
}
```

Pontos fixos, confirmados no código existente (não convenção teórica):

- **Merge de classes**: `[...].filter(Boolean).join(" ")` inline, em
  todo componente do repo. Não existe um helper `cx()` compartilhado —
  o `cx()` de `primitives.tsx` é local a esse arquivo.
- **Props**: estende `React.HTMLAttributes<TElement>` (ou
  `ButtonHTMLAttributes`, `InputHTMLAttributes` etc. quando fizer
  sentido), sempre aceita `className` e sempre repassa `{...rest}`.
- **`"use client"` é a exceção documentada, não a regra**: hoje só
  `primitives.tsx` e `LogoMark.tsx` ficam sem ela. Ao criar um
  componente novo puramente visual (sem estado/efeito/handler), ele
  também pode ficar sem — mas confirme que de fato não usa nada disso.
- **IDs de SVG**: se o componente referencia algo via `url(#...)`
  (máscara, gradiente, filtro), gere o ID com `React.useId()` e
  sanitize com `.replace(/[^a-zA-Z0-9_-]/g, "")` — é o padrão em
  `Loader`, `LogoMark`, `Modal`, `charts`, `disclosure`, `navbar`.
  Nunca um contador de módulo (`let uid = 0`): quebra a hidratação.
- **`position: fixed`**: se o componente flutua sobre o resto da
  página (menu, painel, tooltip), renderize em portal no `<body>` —
  ver ARCHITECTURE.md § Portais.

## Checklist antes de abrir o PR

- [ ] Conferido nos **dois temas** (switch na navbar do styleguide).
- [ ] Conferido em **tela estreita** (breakpoint do sistema: 720px).
- [ ] Animações respeitam `prefers-reduced-motion` (ver ACCESSIBILITY.md).
- [ ] Estado marcado com `aria-*`, nunca só por cor.
- [ ] Foco visível — o anel `:focus-visible` padrão do sistema deve
      cobrir o controle novo sem CSS extra; se não cobrir, algo está
      fora do padrão.
- [ ] `npm run typecheck` limpo.
- [ ] Entrada em `styleguide/stories.tsx` existe e renderiza.

## Quando NÃO criar um componente novo

Se o que falta é uma variação de um componente existente (`tone`,
`variant`, `size`), estenda a prop em vez de duplicar o componente —
é o padrão já usado em `Button`/`ButtonLink` (`variant`, `size`,
`inline`) e `Badge`/`Alert`/`notify()` (`tone` compartilhando as
9 cores de marca).

## Arquivos gerados — não editar à mão

`src/components/LogoMark.tsx` é gerado a partir de `assets/logo.svg`.
Mudanças na logo entram pelo SVG de origem, não pelo TSX.
