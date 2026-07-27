# CLAUDE.md

Guia operacional do **Mothership DS** para trabalhar com o Claude Code.
Lido automaticamente no início de cada sessão — por isso fica enxuto;
os detalhes de cada área vivem nos outros arquivos da raiz:

| Arquivo | Quando consultar |
|---|---|
| [ARCHITECTURE.md](ARCHITECTURE.md) | decisões técnicas, fronteira servidor/cliente, portais, z-index, armadilhas de CSS já resolvidas |
| [COMPONENT_GUIDELINES.md](COMPONENT_GUIDELINES.md) | antes de criar ou editar um componente |
| [TOKENS.md](TOKENS.md) | antes de escrever qualquer CSS — cheat-sheet de todas as variáveis |
| [ACCESSIBILITY.md](ACCESSIBILITY.md) | checklist de a11y por tipo de componente |

`docs/*.md` é a documentação **pública**, em pt-br, referenciada no
README e lida por quem consome a lib. Os quatro arquivos acima são o
guia **interno**, para quem mantém a lib — mais denso, orientado a
regras e armadilhas, não a explicação didática.

## O que é

Design system em React 18+ / TypeScript: glassmorphism, temas
claro/escuro, fundo animado, 34 componentes. Nasceu de engenharia
reversa de uma landing page pessoal em HTML/CSS puro — os tokens vêm
daquele CSS original (ver ARCHITECTURE.md § Origem).

Autor: Valnez Júnior (Mothership Studios). Repo:
`github.com/valnezjr/mothership-ds`. Styleguide publicado em
`valnezjr.github.io/mothership-ds/`, exemplo de landing page em
`valnezjr.github.io/mothership-ds/exemplo/`.

### v1.5 em andamento

Expansão em componentes de "marketing" (landing page), um de cada vez:

- [x] `PricingCard` (`src/components/marketing.tsx`)
- [x] `TestimonialCard` (`src/components/marketing.tsx`)
- [x] `Table` (`src/components/table.tsx`) — pronta para CRUD: 1ª coluna
      status, última ações (editar/excluir), ordenação por coluna
- [ ] Bento grid

Ícones recomendados para uso conjunto: **Lucide** (`lucide-react`) —
decisão e exemplo em README.md § Ícones. Não é dependência do pacote,
só recomendação; componentes que precisam de ícone aceitam `ReactNode`
(nunca importam um ícone específico).

## Comandos

```bash
npm install
npm run typecheck        # tsc --noEmit — rodar antes de qualquer commit
npm run styleguide:dev   # bancada de trabalho: renderiza src/ ao vivo, localhost:8000
npm run styleguide       # gera styleguide/dist/ (publicado no GitHub Pages a cada push em master)
```

Não existe `npm run build` nem suíte de testes automatizada. O pacote
é distribuído como fonte (sem etapa de build — ver ARCHITECTURE.md) e
a validação é visual, no styleguide, nos dois temas e abaixo de 720px.

## Mapa do repositório

```
src/
  index.ts               # TODO export público passa por aqui — é a lista canônica de componentes
  styles.css             # entrypoint único: @import tokens.css + components.css
  reset.css              # opcional, importado à parte por quem quiser reset completo
  styles/tokens.css       # única fonte de tokens (cores, tipografia, espaçamento, efeitos, fundo)
  styles/components.css   # CSS de todos os componentes — prefixo ms-, BEM
  components/*.tsx         # um arquivo por área, não 1:1 com componente (ex.: charts.tsx tem 8 componentes)
styleguide/
  stories.tsx             # catálogo do styleguide — uma entrada por componente novo
  build.mjs               # build com esbuild puro, sem Storybook
docs/                     # documentação pública em pt-br (tokens, componentes, arquitetura, movimento)
examples/next-app/        # landing page de exemplo, buildável — export estático publicado em /exemplo
```

## Regras que não se negociam

- **Tokens antes de valores.** Nenhum CSS novo escreve `15px` ou uma
  cor solta — sempre `var(--espaço-do-token)`. Detalhe: TOKENS.md.
- **`"use client"` só quando precisa.** Componente sem estado/efeito/
  handler fica sem a diretiva (hoje só `primitives.tsx` e
  `LogoMark.tsx`). Detalhe: ARCHITECTURE.md § Fronteira servidor/cliente.
- **IDs de SVG sempre via `React.useId()`.** Nunca um contador de
  módulo — quebra a hidratação. Todo componente com SVG referenciado
  por `url(#...)` já segue isso (Loader, LogoMark, Modal, charts,
  disclosure, navbar).
- **`position: fixed` sempre em portal no `<body>`.** Modal, menu da
  navbar, toasts/histórico, tooltip. Um ancestral com
  `backdrop-filter` quebraria o posicionamento.
- **Sem reset global.** Tudo escopado em `.ms-page`; a lib não pode
  reescrever o CSS de quem a instala.
- **Estado nunca só por cor.** Sempre `aria-*` junto. Detalhe:
  ACCESSIBILITY.md.

## Convenção de código observada no repo

- Merge de classes: `[...].filter(Boolean).join(" ")` inline, não um
  helper importado (o `cx()` de `primitives.tsx` é local a esse
  arquivo, não é padrão compartilhado).
- Props: `interface XProps extends React.HTMLAttributes<HTMLDivElement>`
  (ou o elemento correspondente) + `className` e `{...rest}` sempre
  repassados.
- `LogoMark.tsx` é gerado a partir de `assets/logo.svg` — não editar à
  mão.

## Idioma

Commits, docs e comentários em pt-br, no mesmo tom direto do resto do
projeto (ver `docs/*.md` como referência de estilo). Comentário só
quando explica um *porquê* não óbvio — o código já diz o *o quê*.
