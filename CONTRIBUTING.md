# Contribuindo

## Rodando o projeto

```bash
npm install
npm run styleguide:dev   # styleguide com watch em http://localhost:8000
npm run typecheck        # checagem de tipos
```

O styleguide é a bancada de trabalho: ele renderiza os componentes reais
da biblioteca, então qualquer mudança em `src/` aparece nele.

## Criando um componente

Um componente novo entra em três lugares.

**1. O CSS**, em `src/styles/components.css`. Sempre com prefixo `ms-` e
nomenclatura BEM (`.ms-tabs`, `.ms-tabs__item`, `.ms-tabs--pill`), e
sempre consumindo tokens em vez de valores soltos — `var(--space-4)`,
`var(--radius-md)`, `var(--color-surface)`, `var(--ease-bounce)`. É essa
disciplina que faz o componente já nascer coerente e funcionando nos dois
temas de graça.

**2. O componente**, em `src/components/`. Estenda os atributos HTML
nativos, aceite `className` e mescle com as classes do sistema:

```tsx
"use client"; // só se usar estado, efeito ou handler

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: { id: string; label: React.ReactNode; content: React.ReactNode }[];
}

export function Tabs({ items, className, ...rest }: TabsProps) {
  return <div className={["ms-tabs", className].filter(Boolean).join(" ")} {...rest} />;
}
```

Componentes puramente visuais ficam sem `"use client"`, para continuarem
renderizáveis no servidor.

**3. O export**, em `src/index.ts`.

E, para documentar, uma entrada em `styleguide/stories.tsx` — a
navegação, o índice e as âncoras se atualizam sozinhos.

## Antes de abrir o PR

- Conferir nos **dois temas** (o switch está na navbar do styleguide).
- Conferir em **tela estreita** (o breakpoint do sistema é 720px).
- Respeitar **`prefers-reduced-motion`** se houver animação.
- Marcar estado com **`aria-*`** (`aria-expanded`, `aria-current`), nunca
  só com cor.
- Garantir **foco visível**: o sistema tem um anel `:focus-visible`
  padrão; controles novos devem herdá-lo.
- Rodar `npm run typecheck`.

## Convenções que valem a pena conhecer

- **Portais**: qualquer coisa `position: fixed` (modal, menu, toasts,
  tooltip) é renderizada em portal no `<body>` — dentro da árvore, um
  ancestral com `backdrop-filter` quebraria o posicionamento.
- **IDs em SVG**: use `React.useId()`, nunca um contador de módulo —
  senão servidor e cliente divergem e a hidratação quebra.
- **Nada de reset global**: a folha da biblioteca não deve reescrever o
  CSS de quem a instala. Tudo é escopado em `.ms-page`.
