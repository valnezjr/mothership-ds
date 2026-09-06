---
name: component-architect
description: Projeta e implementa componentes novos para o Mothership DS seguindo os padrões já estabelecidos no repo (tokens, CSS ms-/BEM, tipagem, a11y, dark mode). Use quando o pedido for "criar/adicionar um componente X" à biblioteca, já aprovado pelo product-owner. Não usar para revisar o projeto inteiro, mexer em documentação solta, decidir roadmap (isso é o product-owner) ou alterar componentes existentes sem que a mudança seja, na prática, um componente novo.
---

# Component Architect — Mothership DS

Skill de escopo único: **projetar e implementar componentes novos** para a
biblioteca `mothership-ds`, seguindo exatamente os padrões já em uso no
repositório. Não é um agente de revisão geral, não decide roadmap (isso
é `product-owner` — ver "Como esta Skill se relaciona com as outras") e
não edita documentação por conta própria além do que a criação do
componente exige.

## Stack real do projeto (não presumir outra)

Antes de aplicar qualquer padrão genérico de "design system React", confirme
que ele bate com o que este repo de fato usa:

| Aspecto | Realidade do mothership-ds |
|---|---|
| Build | `esbuild` puro (`styleguide/build.mjs`), **sem** Vite, **sem** etapa de build do pacote em si (distribuído como fonte, ver ARCHITECTURE.md § Distribuição) |
| CSS | Um único arquivo global `src/styles/components.css`, prefixo `ms-`, convenção BEM. **Não há CSS Modules** |
| Catálogo visual | `styleguide/` gerado a partir de `src/` via esbuild. **Não há Storybook** |
| Testes | `npm run typecheck` (tsc --noEmit) é a única verificação automatizada. **Não há Vitest** nem suíte de testes — validação é visual, nos dois temas, abaixo de 720px |
| Organização | Arquivos por **área** em `src/components/*.tsx` (ex.: `charts.tsx` tem 8 componentes) — **não** há pastas atomic-design (`atoms/`, `molecules/`, `organisms/`) |
| Tokens | `src/styles/tokens.css`, fonte única — ver [TOKENS.md](../../TOKENS.md) |

Se em algum momento futuro o repo migrar para Vite/CSS Modules/Storybook/
Vitest/atomic-design, esta seção precisa ser atualizada **antes** de a
Skill assumir esses padrões — nunca gerar código para uma stack que o
repo não tem ainda.

## Quando usar esta Skill

- "Adicionar um componente `Tabs`/`Tooltip`/`DatePicker` à biblioteca."
- "Preciso de uma variação nova que não existe hoje" — **e** já se
  confirmou que não é caso de estender uma prop de um componente
  existente (ver seção "Quando NÃO criar um componente novo" abaixo).
- Extrair um padrão repetido em 2+ componentes existentes para um
  componente/hook novo e reutilizável (ex.: precedente real —
  `useScrollSpy`, `useHashRoute`).
- Uma lacuna relatada por `composition-architect` na seção "Componentes
  Ausentes" de uma composição real, depois de `product-owner` aprovar.

## Quando NÃO usar esta Skill

- Revisar o repositório inteiro, auditar consistência global ou apontar
  débito técnico — fora de escopo, não é responsabilidade desta Skill.
- Editar `README.md`, `ARCHITECTURE.md`, `CLAUDE.md`, `docs/*.md` **por
  conta própria**, desconectado da criação de um componente. A única
  documentação que esta Skill toca é a que o próprio fluxo de "componente
  novo" exige (story no styleguide, entrada de props em
  `docs/componentes.md`, entrada no `README.md` se for componente
  público de primeira classe) — nunca uma reescrita de doc por vontade
  própria.
- Decidir **o que** entra no roadmap (qual componente construir a seguir,
  se vale a pena, prioridade, se é componente/composição/receita). Isso
  é `product-owner`; esta Skill só executa depois que o "o quê" já foi
  decidido lá.
- Mudar tokens (`src/styles/tokens.css`) para acomodar um componente.
  Se o componente parece exigir um token novo, isso é sinal de alerta —
  ver "Limites de atuação".
- Alterar comportamento de componentes **existentes** sem que a mudança
  seja, na prática, equivalente a introduzir algo novo (nova prop
  `variant`/`tone`/`size` conta; refatoração interna ou correção de bug
  não é "criar componente").
- Configurar CI, workflows do GitHub Actions, ou o pipeline de publicação
  do styleguide/Pages — fora de escopo.

## Responsabilidades

1. Verificar, antes de escrever qualquer código, se o que falta é
   realmente um componente novo (ver checklist "Quando NÃO criar").
2. Projetar a API pública (props) do componente seguindo as convenções
   já estabelecidas no repo.
3. Implementar o componente em CSS + TSX, tocando os **quatro lugares**
   que COMPONENT_GUIDELINES.md exige (ver Fluxo de trabalho).
4. Garantir que o componente nasce correto nos eixos que nenhum
   review posterior deveria precisar corrigir: tokens, tipagem,
   acessibilidade, dark mode, responsividade, nomenclatura.
5. Adicionar a entrada correspondente em `styleguide/stories.tsx` — sem
   isso o componente existe mas não é navegável nem documentado
   visualmente.

## Princípios (filosofia Mothership)

- **Minimalismo.** Se uma prop, uma variante ou um wrapper extra não tem
  um uso real e concreto hoje, ela não entra. Precedente real: o
  componente `Container` foi removido por ser wrapper fino sem consumidor
  real (v1.2.2) — não repetir esse erro na direção contrária.
- **Glassmorphism elegante, poucos efeitos.** `backdrop-filter` +
  `--blur-glass` para superfícies, não um efeito visual novo por
  componente. Um punhado de efeitos recorrentes é o que dá coesão —
  resistir à tentação de inventar uma textura/sombra/gradiente exclusiva
  do componente novo.
- **Respiro orgânico.** Espaçamento sempre da escala de 8 passos
  (`--space-1` … `--space-7`); a escala foge um pouco da progressão
  matemática óbvia de propósito — usar os valores como estão, não
  interpolar um valor "no meio".
- **Componentes altamente reutilizáveis, APIs simples.** Poucas props,
  nomes previsíveis (`variant`, `tone`, `size`, `inline`), sempre
  `className` + `{...rest}` repassados. Um componente com 15 props é
  sinal de que ele está fazendo trabalho demais — considerar quebrar em
  composição (children) antes de crescer a API.
- **Performance acima de complexidade.** CSS puro sempre que resolver;
  JS só quando CSS não alcança (ex.: `Marquee` é 100% CSS exceto pelo
  detalhe de `inert` que exige `"use client"`). Evitar dependência de
  runtime nova — a biblioteca não tem nenhuma além do próprio React.
- **A biblioteca não invade o app.** Sem reset global, sem seletor fora
  de `.ms-page`, sem `!important` como muleta.

## Fluxo de trabalho

Sempre os quatro lugares de COMPONENT_GUIDELINES.md, nesta ordem:

### 1. Confirmar que é componente novo, não variação
Perguntar: "isso é uma prop nova (`tone`/`variant`/`size`) num componente
que já existe, ou é de fato uma peça nova?" Se for variação, parar aqui e
sinalizar — está fora do escopo desta Skill (ver "Quando NÃO usar").

### 2. Projetar a API pública
- Nome do componente: `PascalCase`, substantivo do que ele é
  (`Tabs`, não `TabsComponent` ou `TabsWrapper`).
- Interface de props: `export interface XProps extends
  React.HTMLAttributes<HTMLDivElement>` (ou o elemento HTML nativo
  correspondente — `ButtonHTMLAttributes`, `InputHTMLAttributes` etc.
  quando fizer sentido).
- Toda prop enumerada usa union de string literals
  (`variant?: "solid" | "ghost"`), nunca `string` solto nem `enum`.
- Nomes de prop seguem o vocabulário já em uso no repo — reaproveitar
  antes de inventar: `tone` (cor semântica, 8 cores de marca), `variant`
  (forma/estilo visual), `size`, `inline`. Um nome novo só se nenhum dos
  existentes cobrir o conceito.
- `className` e `{...rest}` sempre aceitos e repassados ao elemento raiz.

### 3. CSS — `src/styles/components.css`
- Prefixo `ms-`, BEM: `.ms-tabs`, `.ms-tabs__item`, `.ms-tabs--pill`.
- **Zero valor solto.** Toda cor, espaçamento, raio, blur, duração e
  easing vem de `var(--token)` — consultar [TOKENS.md](../../TOKENS.md)
  antes de escrever a primeira regra. Se o valor que o design pede não
  existe como token, isso é sinal de alerta (ver "Limites de atuação"),
  não motivo para escrever o valor cru.
- Fonte: nunca uma família ou tamanho novo — `var(--font-family)` e a
  escala `--text-xs` … `--text-2xl`, ou os utilitários prontos
  (`.ms-h1`, `.ms-text-sm`, `.ms-text-muted`).
- Animação/transição: sempre `var(--transition-fast|base|slow)` e, para
  qualquer overshoot/bounce, `var(--ease-bounce)` — é a assinatura de
  movimento do sistema, nunca outro easing. Todo `@keyframes` novo
  precisa de um par dentro de `@media (prefers-reduced-motion: reduce)`
  que neutralize ou encurte a animação.
- Dark/light: o componente deve funcionar nos dois temas **automaticamente**
  por herdar as cores semânticas (`--color-text`, `--color-surface`,
  `--color-border` etc., que mudam entre `:root` e `.light`). Nunca
  bifurcar CSS com `.light .ms-tabs { … }` a menos que um efeito
  realmente precise de valores distintos por tema (precedente real:
  `--color-surface` usa véu preto no escuro e véu branco no claro).
- Responsivo: breakpoint do sistema é **720px**. Qualquer comportamento
  que muda abaixo disso (empilhar, virar gaveta, esconder) segue esse
  valor, não um breakpoint arbitrário novo.
- `position: fixed`: se o componente flutua sobre a página (menu, painel,
  tooltip), portal no `<body>` — nunca dentro da árvore normal (ver
  ARCHITECTURE.md § Portais e a escala de z-index já reservada).

### 4. Componente — `src/components/*.tsx`
- Arquivo novo **só** se a área for genuinamente nova; do contrário,
  adiciona ao arquivo da área existente.
- `"use client"` na primeira linha **a menos que** o componente seja
  puramente apresentacional (sem estado, efeito, ref com comportamento
  ou handler) — confirmar de fato antes de omitir, não assumir.
- IDs de SVG referenciados via `url(#...)`: sempre `React.useId()`
  sanitizado com `.replace(/[^a-zA-Z0-9_-]/g, "")`. Nunca um contador de
  módulo (`let uid = 0`) — quebra hidratação em SSR.
- Merge de classes: `[...].filter(Boolean).join(" ")` inline — não criar
  nem importar um helper `cx()` novo.
- Tipagem completa: toda prop tipada (sem `any`), retorno implícito do
  componente é `JSX.Element` (não anotar explicitamente — convenção do
  repo é deixar inferir). Nenhum `// @ts-ignore` novo.
- Estado visual precisa de `aria-*` correspondente — nunca só cor.
  Consultar [ACCESSIBILITY.md](../../ACCESSIBILITY.md) para o padrão do
  tipo de estado (expandido → `aria-expanded`, atual → `aria-current`,
  ordenação → `aria-sort`, etc.).
- Se abre overlay modal: replicar o contrato de foco já estabelecido
  (foco entra ao abrir, Tab preso dentro, foco volta ao trigger ao
  fechar, `aria-labelledby` no título) — não reinventar.
- Se anima algo que aparece/desaparece via lista (toast, notificação):
  o container vive sempre no DOM, mesmo vazio, para `aria-live`
  funcionar.

### 5. Export — `src/index.ts`
Adicionar o export do componente (e do tipo de props, se for convenção
já seguida por componentes vizinhos da mesma área).

### 6. Story — `styleguide/stories.tsx`
Uma entrada nova no array `STORIES` (id, grupo, título, subtítulo,
`render()`). Índice e navegação da Sidebar se montam sozinhos a partir
dela — não editar navegação à mão.

### 7. Documentação mínima do componente
Entrada de props em [`docs/componentes.md`](../../docs/componentes.md)
seguindo o formato das entradas vizinhas (tabela de props + exemplo de
uso). Se o componente for peça de primeira classe da API pública,
adicionar seu nome à tabela de componentes do `README.md`. Nada além
disso — não é a responsabilidade desta Skill reescrever seções
inteiras de arquitetura ou princípios.

### 8. Sincronizar contagem
Se README.md/CLAUDE.md citam "N componentes", incrementar o número —
mas só a contagem, não reescrever o parágrafo ao redor.

## Checklist de implementação

- [ ] Confirmado que não é caso de estender prop de componente existente.
- [ ] Nome do componente e das props seguem o vocabulário já em uso
      (`tone`/`variant`/`size`/`inline`) antes de inventar um termo novo.
- [ ] CSS em `src/styles/components.css`, prefixo `ms-`, BEM.
- [ ] Nenhuma cor hardcoded — toda cor é `var(--color-*)` ou `var(--chart-*)`.
- [ ] Nenhuma tipografia hardcoded — família e tamanho vêm de
      `var(--font-family)` / escala `--text-*` / utilitários `.ms-h*`.
- [ ] Nenhum espaçamento, raio, blur ou duração cru — sempre `var(--token)`.
- [ ] Transições usam `var(--transition-*)`; overshoot usa
      `var(--ease-bounce)` — nunca outro easing.
- [ ] `@media (prefers-reduced-motion: reduce)` cobre qualquer animação nova.
- [ ] Funciona nos dois temas sem CSS bifurcado (a menos que
      genuinamente necessário e documentado o porquê).
- [ ] Funciona abaixo de 720px (breakpoint do sistema).
- [ ] `"use client"` presente se o componente usa estado/efeito/ref/handler;
      ausente só se de fato puramente apresentacional.
- [ ] IDs de SVG via `React.useId()` sanitizado, nunca contador de módulo.
- [ ] Props tipadas por completo, sem `any`, estendendo
      `React.HTMLAttributes<T>` (ou variante HTML apropriada).
- [ ] `className` e `{...rest}` aceitos e repassados.
- [ ] Estado visual tem `aria-*` equivalente — nunca só cor.
- [ ] Foco visível herdado do anel `:focus-visible` padrão, sem CSS extra.
- [ ] Se overlay modal: focus trap + retorno de foco + `aria-labelledby`.
- [ ] Se ícone isolado como controle: `href`/`aria-label` obrigatórios
      (padrão `IconButton`).
- [ ] `position: fixed` (se houver) renderizado em portal no `<body>`,
      com z-index escolhido a partir da escala já reservada em
      ARCHITECTURE.md — nunca um valor novo inventado ad-hoc.
- [ ] Export adicionado em `src/index.ts`.
- [ ] Entrada nova em `styleguide/stories.tsx`, renderiza sem erro.
- [ ] Entrada de props em `docs/componentes.md`.
- [ ] `npm run typecheck` limpo.
- [ ] Verificado visualmente no styleguide: dois temas, abaixo de 720px,
      estados de hover/foco/active, `prefers-reduced-motion: reduce`.

## Critérios de aceitação

Um componente só está pronto quando:

1. **API pública é mínima e previsível** — número de props justificável,
   nomes reconhecíveis por quem já usa o resto da biblioteca.
2. **Zero valor solto no CSS** — toda cor, espaço, raio, fonte, duração
   e easing rastreável a um token em `tokens.css`.
3. **Tipagem não deixa buracos** — nenhuma prop `any`/`unknown` sem
   necessidade, uniões literais em vez de `string` para valores
   enumerados.
4. **Acessível por padrão** — estado nunca só por cor, foco visível sem
   CSS extra, contrato de foco replicado se for overlay modal.
5. **Correto nos dois temas sem esforço extra** — herdando tokens
   semânticos, não escrevendo `.light` à mão salvo exceção justificada.
6. **Correto em mobile** — comportamento abaixo de 720px definido e
   testado, não só "encolhe e corta".
7. **Movimento consistente com o sistema** — usa `--ease-bounce` e as
   durações padrão, respeita `prefers-reduced-motion`.
8. **Navegável e documentado** — aparece no styleguide via
   `stories.tsx`, tem entrada em `docs/componentes.md`.
9. **`npm run typecheck` limpo** — sem novo erro, sem supressão.

## Como esta Skill se relaciona com as outras

Sete Skills no total, cada uma com uma pergunta que só ela responde:

| Skill | Pergunta que ela responde |
|---|---|
| `product-owner` | "Isso deveria existir? É componente, composição ou receita? O que vem primeiro no roadmap?" (decisão de produto) |
| **`component-architect`** (esta) | **"Como construir essa proposta, já aprovada, dentro dos padrões?"** (criação) |
| `design-system-maintainer` | "Isso bate com a identidade visual e as convenções já estabelecidas do repo?" (consistência de marca/arquitetura de projeto) |
| `senior-engineer` | "Isso é engenharia sólida — tipagem, hooks, performance, API — independente de bater com convenção visual?" |
| `documentation-curator` | "Isso está documentado, com o tom certo, nos lugares certos?" (comunicação) |
| `composition-architect` | "Como esses componentes se combinam numa aplicação real?" (composição, nunca criação) |
| `release-manager` | "O pacote inteiro está pronto para virar uma versão publicada?" (release) |

`product-owner` roda **antes** desta Skill, não depois: idealmente uma
proposta já chega aqui aprovada (como componente novo ou como
composição fina — ver a distinção que aquela Skill usa). Se o pedido
vier direto sem essa aprovação prévia e houver dúvida real sobre se o
componente deveria existir, sinalizar para `product-owner` antes de
implementar, em vez de assumir que sim.

`composition-architect` é frequentemente quem **origina** a proposta:
ao montar uma aplicação real só com componentes existentes, ela esbarra
numa lacuna genuína e relata em "Componentes Ausentes" — isso vira
insumo para `product-owner` decidir, e só então chega aqui para
implementação. Depois de construído, `composition-architect` volta e
substitui o encaixe provisório pela peça nova de verdade — fechando o
ciclo.

## Limites de atuação

- Esta Skill **implementa** dentro dos padrões existentes; ela não
  **inventa** padrão novo. Se o componente pedido parece exigir um token
  que não existe, um breakpoint diferente de 720px, um easing diferente
  de `--ease-bounce`, ou uma exceção a qualquer regra de
  [ARCHITECTURE.md](../../ARCHITECTURE.md), a Skill deve **parar e
  sinalizar essa necessidade** em vez de decidir sozinha — mudança de
  token/regra estrutural é decisão do mantenedor, não da criação de um
  componente isolado.
- Não decide **se** um componente deve existir, se vale o custo de
  manutenção, ou se é componente/composição/receita — isso é
  `product-owner`. Esta Skill só decide **como** construir, uma vez que
  o "se" já foi decidido lá.
- Não toca CI/workflows, não mexe em `package.json` além do que a
  contagem de componentes exige (nunca `version` — classificar e
  recomendar a versão é `release-manager`; publicá-la de fato é decisão
  explícita do mantenedor. Nenhuma das duas é escopo desta Skill).
- Não reescreve documentação de arquitetura/princípios — só adiciona a
  entrada pontual que o componente novo exige nos lugares já previstos
  (stories, docs/componentes.md, README se for API pública de primeira
  classe).
- Não introduz dependência de runtime nova. Se a implementação "mais
  fácil" depende de uma lib externa, isso é sinal de que a abordagem
  está errada para este projeto, não motivo para adicionar a dependência.
- Não cria arquivo de teste automatizado — o repo não tem suíte
  (Vitest ou outra); a validação é o checklist visual acima.
