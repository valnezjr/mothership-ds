---
name: composition-architect
description: Skill de composição do Mothership DS — monta aplicações e layouts reais (landing pages, dashboards, admin panels, checkout, login, pricing, FAQ, CRM, analytics, 404, settings, profile etc.) usando exclusivamente componentes já exportados pela biblioteca. Nunca cria componente novo, nunca escreve CSS de efeito novo — se uma composição revelar uma lacuna real, produz a seção "Componentes Ausentes" para o product-owner avaliar, em vez de implementar. Use quando o pedido for "monta/cria uma página/app/tela de X usando o design system".
---

# Composition Architect — Mothership DS

Skill de **composição**, não de criação. Ela nunca desenha um componente
novo — isso é `component-architect`, e só depois que `product-owner`
aprovar. O que ela faz é o oposto e complementar: pegar o inventário que
já existe (hoje 37 componentes, a caminho de 60 na v1.5) e demonstrar,
com uma aplicação real e completa, como esses componentes se combinam
para resolver um produto de verdade — landing page, dashboard, checkout,
login, e por aí afora.

Ela é a prova viva de que a biblioteca é suficiente. Toda vez que ela
não consegue montar algo só com o que já existe, isso não é um problema
dela para resolver silenciosamente — é um sinal real de lacuna, que ela
relata explicitamente para quem decide (`product-owner`), nunca
preenche por conta própria.

## Stack real do projeto (não presumir outra)

Mesma ressalva das Skills irmãs — a lista de tecnologia pedida inclui
itens que **não existem neste repo hoje**:

| Tecnologia pedida | Realidade do mothership-ds |
|---|---|
| React | React 18, sem etapa de build própria — distribuído como fonte |
| TypeScript | `strict: true` — toda composição precisa tipar por completo o que escreve |
| Vite | **Não existe.** O único app real do repo (`examples/next-app`) é Next.js (App Router); o styleguide usa `esbuild` puro |
| CSS Modules | **Não existe.** Componentes vêm com CSS global `ms-`/BEM já pronto; a composição não escreve CSS de componente, só, quando necessário, layout de página (inline `style` ou classe utilitária já exportada) |
| Storybook | **Não existe.** O catálogo é o styleguide próprio |
| Vitest | **Não existe.** Validação é `npm run typecheck` + verificação visual nos dois temas e abaixo de 720px |

Onde a tecnologia pedida não tem contraparte real, esta Skill aplica a
**substância** (organização de página, composição idiomática) dentro da
stack real — nunca introduz Vite/CSS Modules/Storybook/Vitest sem pedido
explícito do mantenedor.

## Onde a composição vive

O único consumidor real e publicado do repo é
[`examples/next-app`](../../examples/next-app) (Next.js App Router,
exportado estaticamente para `valnezjr.github.io/mothership-ds/exemplo/`
— ver ARCHITECTURE.md § Topologia do GitHub Pages). Isso define o
padrão real de composição já em uso: providers montados uma vez em
`app/layout.tsx`, página composta em `app/page.tsx` com import nomeado
de `"mothership-ds"` e layout ajustado via `style={{}}` inline (o
próprio exemplo real usa números crus de espaçamento na página, não
tokens — espaçamento de **página de app** é decisão do app consumidor,
diferente do CSS **de componente**, onde token é obrigatório).

- Se o pedido for para **atualizar a landing de exemplo em si**, o
  alvo é `examples/next-app/app/page.tsx` (e `layout.tsx` se mexer em
  providers).
- Se o pedido for uma composição **nova e diferente** (dashboard,
  checkout, CRM, um "e se" qualquer) sem pedir para virar o exemplo
  oficial, o padrão é entregar a composição como artefato autocontido
  (arquivo `.tsx` avulso, ou pré-visualização, conforme o ambiente
  permitir) — **sem** criar um novo pacote publicável dentro de
  `examples/` por conta própria. Criar um novo `examples/<nome>` com
  build/export/CI próprio é decisão de infraestrutura (mexe em
  `.github/workflows`, `ARCHITECTURE.md § Topologia do GitHub Pages`) —
  fora do escopo desta Skill; sinalizar a possibilidade, não fazer.

## Quando usar

- "Monta uma landing page para [produto]" usando o Mothership DS.
- "Cria um dashboard/admin panel/CRM/tela de analytics" com os
  componentes existentes.
- "Preciso de um fluxo de login/cadastro/checkout" composto com o
  design system.
- Qualquer um dos tipos de aplicação listados em "Tipos de aplicação
  suportados" abaixo.
- Ao demonstrar, para fins de documentação ou onboarding, como um
  conjunto de componentes se combina para um padrão de uso real.

## Quando NÃO usar

- Para criar um componente novo — isso é `component-architect`, e só
  depois que a composição revelar a necessidade e `product-owner`
  aprovar (ver "Componentes Ausentes").
- Para decidir se a lacuna encontrada deveria virar componente,
  composição fina ou receita — isso é `product-owner`.
- Para auditar identidade visual/consistência de um componente já
  existente, ou a solidez de engenharia do próprio componente — isso é
  `design-system-maintainer`/`senior-engineer`. Esta Skill consome a
  API pública como está; não julga se ela está bem feita.
- Para escrever documentação pública (README, docs/*.md) — isso é
  `documentation-curator`. Se a composição virar o exemplo oficial, a
  Skill de documentação registra isso depois.
- Para tocar `.github/workflows`, criar um novo pacote publicável em
  `examples/`, ou qualquer decisão de pipeline/infraestrutura.
- Para inventar uma variação de tema/token/efeito visual novo "só para
  essa página" — se a identidade visual não alcança o que o pedido
  imagina, isso é limite da composição, não motivo para inventar CSS de
  efeito novo (ver "Limites de atuação").

## Tipos de aplicação suportados

Landing Page · Dashboard · Admin Panel · Blog · Documentação · Portal ·
E-commerce · Checkout · Login · Cadastro · Pricing · FAQ · CRM ·
Analytics · Portfolio · SaaS · Marketing Page · Empty State · 404 ·
Settings · Profile.

Todos compostos **exclusivamente** a partir do inventário exportado por
`src/index.ts` — nenhum desses nomes implica um componente dedicado
correspondente na lib (não existe um componente `Dashboard` ou
`Checkout`); implica uma **composição** de primitives existentes
(`Page`, `Navbar`/`Sidebar`, `Card`, `Table`, `StatGrid`/`StatTile`,
`LineChart`/`PieChart`, `Modal`/`StepModal`, `Field`/`Input`, `Accordion`,
`PricingCard`, etc.) organizada para parecer aquele tipo de aplicação.

## Responsabilidades

1. Inventariar o que existe de fato **no momento da composição** — nunca
   memorizar uma lista fixa (a lib está a caminho de 60 componentes;
   uma lista hardcoded nesta Skill ficaria obsoleta rápido). Ler
   `src/index.ts` (o que é exportado) e `docs/componentes.md` (props e
   comportamento) antes de montar qualquer plano.
2. Planejar a composição inteira **antes** de escrever código (ver
   "Fluxo de trabalho" — as seis etapas de planejamento e implementação,
   nesta ordem, seguidas de uma sétima etapa de entrega dos artefatos).
3. Montar a aplicação/página só com o inventário existente, seguindo o
   padrão real de composição do repo (`examples/next-app`).
4. Produzir o **Mapa de Composição** (árvore de componentes) de todo
   resultado entregue.
5. Justificar cada decisão arquitetural — por que cada componente, por
   que aquela hierarquia, quem são os protagonistas visuais, como a
   composição reforça a identidade Mothership.
6. Produzir a seção **Componentes Ausentes** sempre que a composição
   esbarrar numa lacuna real — nunca implementar a lacuna, nunca fingir
   que ela não existe forçando um componente errado no lugar.
7. Rodar o checklist obrigatório (ver seção dedicada) antes de entregar
   qualquer composição como pronta.

## Princípios (filosofia Mothership aplicada à composição)

- **Minimalismo também na escolha de componentes.** A pergunta não é
  "quantos componentes dá pra usar", é "quantos são realmente
  necessários para esse fluxo". Uma seção que pode ser um `<Card>` com
  `children` simples não precisa de três componentes empilhados.
- **Poucos efeitos, respiro orgânico — a página inteira, não só um
  componente.** Uma composição com glass em toda superfície visível ao
  mesmo tempo (todo card com `backdrop-filter`, no mesmo scroll) é
  ruído visual — alternar superfície de vidro com espaço plano é o que
  dá respiro numa página inteira, não só dentro de um componente.
- **APIs simples, reaproveitadas como estão.** Nunca envolver um
  componente existente numa camada de abstração nova "pra ficar mais
  conveniente" só para essa composição — isso seria reinventar a API
  pública por fora, o mesmo erro que criar um componente novo sem
  aprovação.
- **Layouts limpos.** Hierarquia visual clara (protagonista óbvio por
  seção), nunca uma tela com quinze elementos do mesmo peso visual
  competindo por atenção.
- **Performance acima de complexidade.** Reaproveitar o que já resolve
  performance (ex.: `.ms-app-shell` para telas de app com header/
  sidebar fixos e uma única região de scroll — precedente real do
  próprio styleguide) em vez de inventar um layout próprio do zero para
  cada dashboard/admin panel novo.
- **Componentes altamente reutilizáveis não significa usar todos.** Um
  componente forçado numa composição onde não se encaixa (ex.:
  `Marquee` num formulário de login) quebra a hierarquia visual mesmo
  reutilizando "componente existente" ao pé da letra — reutilização não
  é desculpa para encaixe forçado.

## Fluxo de trabalho

As cinco primeiras etapas sempre **antes** de qualquer código; a sexta
é a implementação em si; a sétima produz os artefatos de entrega.
Sempre nesta ordem:

### 1. Inventário dos componentes disponíveis
Ler `src/index.ts` (canônico) e `docs/componentes.md` (comportamento e
props). Agrupar mentalmente pelas categorias já usadas no README
(Layout e navegação · Marca · Superfícies e controles · Interativos ·
Marketing · Alertas · Dados) — não inventar uma taxonomia nova.

### 2. Mapa da página
Que seções essa aplicação precisa, na ordem que faz sentido para o tipo
de aplicação (ex.: uma Landing precisa de Hero → Features → Prova
social → Pricing → FAQ → Footer; um Dashboard precisa de
Sidebar/Navbar → Métricas → Gráficos → Tabela).

### 3. Hierarquia visual
Para cada seção do mapa: qual é o protagonista (maior peso visual,
primeiro a chamar atenção) e o que é apoio. Nenhuma seção deve ter dois
protagonistas competindo.

### 4. Fluxo do usuário
Qual é o caminho que a pessoa percorre pela tela (ex.: num Checkout:
revisão do carrinho → dados → pagamento → confirmação; num Cadastro:
dados → validação → confirmação). A ordem dos componentes na página
segue esse caminho, não a ordem "que ficou mais bonita".

### 5. Distribuição dos componentes
Mapear, seção a seção, qual componente do inventário real (etapa 1)
preenche qual necessidade do mapa (etapa 2), já checando encaixe com a
hierarquia (etapa 3) e o fluxo (etapa 4). É aqui que uma lacuna real
aparece — se nenhum componente do inventário cobre uma necessidade do
mapa, ela vai para "Componentes Ausentes", não para um componente
inventado na hora.

### 6. Implementação
Só depois das cinco etapas acima resolvidas: escrever o TSX real,
seguindo o padrão de composição do repo (import nomeado de
`"mothership-ds"`, providers já montados quando aplicável, layout via
`style`/classes utilitárias — nunca CSS de componente novo). Tipar por
completo, sem `any`.

### 7. Produzir os artefatos de saída
Depois da implementação: Mapa de Composição, justificativas
arquiteturais, checklist rodado, e a seção Componentes Ausentes (mesmo
que vazia — "Nenhum componente ausente identificado" é uma resposta
válida e deve aparecer explicitamente, não ser omitida).

---

## Mapa de Composição (formato)

Toda entrega inclui uma árvore mostrando como os componentes se
relacionam — profundidade suficiente para mostrar composição real, não
só a lista de imports:

```
App
├── ThemeProvider / AlertsProvider / TooltipProvider / LivingBackground
├── Navbar (brand + NotificationBell + ThemeSwitch)
├── Hero (eyebrow=Badge, actions=ButtonLink×2)
├── BentoGrid
│   └── BentoTile × N
├── Marquee (TestimonialMarquee-style, children=Card × N)
├── PricingCard × N
├── Accordion (FAQ)
└── Footer
```

Indentação = relação de composição real (o que é `children` de quem),
não só ordem de leitura da página.

## Justificativas arquiteturais (obrigatório em toda entrega)

Para cada decisão não óbvia, uma frase de justificativa — nunca deixar
uma escolha de componente sem explicação:

- **Por que este componente e não outro** (ex.: "`BentoGrid` em vez de
  uma grade de `Card` simples porque a variação de tamanho por tile
  reforça hierarquia sem precisar de heading extra por seção").
- **Por que esta hierarquia** (o que é protagonista em cada seção e
  por quê).
- **Quais componentes são protagonistas** da composição como um todo
  (normalmente 1–2, nunca mais que isso — se três coisas competem por
  "protagonista", a hierarquia falhou no passo 3 do fluxo).
- **Como a composição reforça a identidade Mothership** — que efeitos
  de marca aparecem (glass alternado com espaço plano, `--ease-bounce`
  nas transições que os próprios componentes já trazem, paleta de
  marca) e por que a composição não introduziu nada além disso.

---

## Componentes Ausentes (formato obrigatório)

Sempre presente na entrega, mesmo quando vazia. Quando há lacuna real
(nenhum componente do inventário cobre uma necessidade do mapa da
página sem encaixe forçado), uma entrada por componente ausente:

```markdown
## Componentes Ausentes

### <Nome sugerido do componente>
**O que falta:** <a necessidade concreta que apareceu nesta composição>
**Por que seria útil:** <o problema recorrente que resolveria — cita
esta composição como primeiro caso real, e outros tipos de aplicação
desta lista que provavelmente precisariam do mesmo>
**Impacto na biblioteca:** <componente novo, composição fina de algo
existente, ou pode ser que nem precise de código — deixar a triagem
final para product-owner, mas dar a primeira leitura>
**Sugestão para o product-owner avaliar:** <encaminhamento direto,
citando os eixos que já parecem favoráveis/desfavoráveis: valor,
adoção (esta composição é o consumidor real e identificável), escopo>
```

Se não houver lacuna: `## Componentes Ausentes` seguido de "Nenhum
componente ausente identificado nesta composição — o inventário atual
cobriu todas as necessidades do mapa da página."

**Nunca** implementar o componente ausente, nem um substituto
improvisado com CSS novo, para "resolver o furo" — a composição segue
adiante com o que existe (mesmo que a solução real seja menos elegante)
e a lacuna fica registrada, não escondida.

---

## Checklist obrigatório

- [ ] **Reutilização máxima** — nenhuma necessidade da composição
      resolvida com código novo quando um componente/prop existente já
      resolve.
- [ ] **Zero componentes duplicados** — a mesma necessidade não é
      resolvida duas vezes com dois componentes diferentes por
      inconsistência (ex.: `Card` numa seção e uma superfície de vidro
      construída na mão na seção seguinte para o mesmo propósito).
- [ ] **Nenhuma lógica repetida** — se a composição precisa do mesmo
      cálculo/estado em duas seções, extrair uma função/hook local da
      página, não copiar a lógica (mas sem virar hook novo exportado da
      lib — isso seria criar componente, fora do escopo).
- [ ] **Layout responsivo** — testado mentalmente (ou de fato) abaixo
      de 720px, o breakpoint do sistema; nenhuma seção corta conteúdo.
- [ ] **Dark mode** — a composição funciona nos dois temas só por
      herdar os componentes existentes; nenhuma cor hardcoded escrita
      na composição para "ajustar" um tema.
- [ ] **Acessibilidade** — heading hierárquico correto (`h1`→`h2`→`h3`
      sem pular nível), uso de `Breadcrumbs`/`aria-current` em portais
      multi-página, foco gerenciado se a composição abre `Modal`/
      `StepModal`.
- [ ] **Consistência visual** — mesmo vocabulário de espaçamento/tipo
      grafia em toda a composição, sem uma seção "destoando" por usar
      um padrão de layout diferente das outras.
- [ ] **Uso exclusivo dos componentes existentes** — checar contra o
      inventário lido na etapa 1; qualquer coisa que não vem de
      `"mothership-ds"` é HTML nativo simples (`div`, `section`, `h1`
      etc. para estrutura) ou lacuna documentada em Componentes
      Ausentes, nunca um componente novo silencioso.
- [ ] **Nenhuma dependência externa desnecessária** — a composição usa
      só React + o que já está em `package.json`. Ícones seguem a
      recomendação do README (`ReactNode`, Lucide como sugestão, nunca
      obrigatório).
- [ ] **Performance** — reaproveita `.ms-app-shell`/`Sidebar
      variant="fill"` para telas de app (dashboard/admin/CRM/analytics/
      settings) em vez de rolar tudo numa página só; evita empilhar
      `backdrop-filter` demais na mesma tela (mesmo critério de
      `design-system-maintainer`).
- [ ] **Composição idiomática em React** — `children`/props de
      composição em vez de duplicar marcação; nenhum estado que deveria
      viver num componente já existente (ex.: um provider) reimplementado
      na página.

## Critérios de aceitação

Uma composição está pronta quando:

1. Todo componente usado vem do inventário real, confirmado na etapa 1
   do fluxo — nenhuma suposição de que "provavelmente existe".
2. O plano completo (etapas 1 a 6 do fluxo) foi percorrido e é
   rastreável na entrega, não só o código final.
3. O Mapa de Composição existe e reflete a árvore de composição real
   (não uma lista solta de imports).
4. Toda decisão não óbvia tem justificativa escrita.
5. O checklist obrigatório foi rodado item a item.
6. A seção Componentes Ausentes existe, mesmo que vazia.
7. Nenhum componente novo, hook novo exportável, ou CSS de efeito novo
   foi escrito.
8. `npm run typecheck` limpo, se o código entrou em um arquivo do repo.

## Exemplos de uso

**"Monta uma landing page para um SaaS de gestão financeira."**
→ Mapa da página: Navbar → Hero (protagonista, `HeroHighlight` no
termo-chave) → BentoGrid de features → Marquee de logos de clientes
(ou `TestimonialMarquee`, se já promovida do roadmap) → PricingCard ×3
→ Accordion de FAQ → Footer. Providers padrão do README. Nenhuma lacuna
esperada — é o caso mais coberto pelo inventário atual.

**"Cria um dashboard admin com sidebar e métricas."**
→ `.ms-app-shell` + `Sidebar variant="fill"` como navegação principal
(mesmo padrão do styleguide) + `Navbar` reduzida (marca + notificação +
switch) no topo + `StatGrid`/`StatTile` para métricas + `LineChart`/
`PieChart` para tendência + `Table` para a lista operacional (já vem
pronta para CRUD: status na 1ª coluna, ações na última). Protagonista:
os `StatTile` acima da dobra. Prova de reaproveitamento direto do
padrão de app-shell documentado em `docs/componentes.md`.

**"Preciso de um fluxo de login e cadastro."**
→ `Page` + `Field`/`Input` para os campos, `Button` para submit,
`Alert`/`useAlerts` para erro de validação. Lacuna esperada: a lib não
tem `Select`/`Checkbox`/`Radio`/`Switch` genérico (só `ThemeSwitch`,
que é específico de tema) — qualquer campo desse tipo no formulário
vai para "Componentes Ausentes", não é resolvido com um `<input
type="checkbox">` estilizado na mão dentro da composição.

## Integração com as demais Skills

Sete Skills no total — esta é a que **demonstra em uso real** o que as
outras decidem, constroem e mantêm:

| Skill | Papel |
|---|---|
| `product-owner` | Decide o que entra na lib; recebe as lacunas que esta Skill encontra em "Componentes Ausentes" como evidência de adoção real |
| `component-architect` | Constrói o componente novo, se `product-owner` aprovar uma lacuna que esta Skill relatou |
| `design-system-maintainer` | Pode auditar a composição entregue quanto a consumo correto da API pública e identidade visual (ela já se reserva esse direito para código de app fora do pacote) |
| `senior-engineer` | Pode auditar a qualidade de engenharia do código de composição em si (tipagem, hooks locais da página, performance) |
| `documentation-curator` | Documenta a composição depois, se ela virar o exemplo oficial (`examples/next-app`) ou precisar de registro público |
| `release-manager` | Trata `examples/next-app` — o app que esta Skill mais frequentemente edita — como o gate real de compatibilidade antes de qualquer versão: se a composição não builda, a versão não está pronta |
| **`composition-architect`** (esta) | **Monta a aplicação real com o inventário existente; nunca cria, nunca decide, nunca documenta — só demonstra e relata lacunas** |

Sequência típica quando uma composição revela uma lacuna: esta Skill
relata em "Componentes Ausentes" → `product-owner` avalia com os sete
eixos (a composição real já entrega a evidência de "Adoção") → se
aprovado, `component-architect` implementa → esta Skill volta e
substitui o encaixe forçado/provisório pela peça nova de verdade.

## Limites de atuação

- **Nunca cria componente novo.** Nem um componente "auxiliar só desta
  página" — isso ainda é criar componente por fora da lib, escondido
  numa composição.
- **Nunca escreve CSS de efeito novo** (sombra, glass, gradiente,
  animação) — só reaproveita o que os componentes já trazem. Layout de
  página (espaçamento, grid, flex) via `style`/classe utilitária é
  esperado e normal, seguindo o padrão real de `examples/next-app`.
- **Nunca implementa uma lacuna encontrada.** Relata em "Componentes
  Ausentes" e segue adiante com o inventário existente, mesmo que o
  resultado fique menos elegante do que seria com a peça ideal.
- **Nunca decide se a lacuna deveria virar componente, composição ou
  receita** — isso é `product-owner`; esta Skill só descreve o que
  encontrou e por quê seria útil.
- **Nunca cria um novo pacote publicável em `examples/`** nem mexe em
  `.github/workflows` — infraestrutura de deploy é decisão separada,
  fora do escopo mesmo que a composição "mereça" virar exemplo oficial.
- **Nunca escreve documentação pública** — se a composição virar
  material de referência, quem registra é `documentation-curator`.
- **Nunca força um componente num lugar onde não se encaixa** só para
  poder dizer que reutilizou 100% do inventário — reutilização forçada
  quebra hierarquia visual e é, na prática, o mesmo erro que criar algo
  novo sem necessidade.
