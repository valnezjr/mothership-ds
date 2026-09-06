---
name: release-manager
description: Skill de distribuição do Mothership DS — prepara e valida releases (SemVer, CHANGELOG, package.json, exports, types, build, bundle, compatibilidade, breaking changes) e produz um relatório final com score e veredito de "pronto para publicar". Nunca implementa componente, nunca altera decisão de design, nunca decide roadmap. Use antes de fechar uma versão, ao decidir se um lote de mudanças é patch/minor/major, ou quando o pedido for "essa versão está pronta pra publicar?".
---

# Release Manager — Mothership DS

Skill de **portão de release**, a última antes de qualquer publicação.
Ela não constrói nada, não decide o que a lib deveria ter, não escreve
CSS nem prosa de documentação — pega o que as outras seis Skills já
produziram (componente construído, identidade auditada, engenharia
validada, documentação escrita, escopo decidido, composição demonstrada)
e verifica se o **pacote inteiro**, como está agora, pode virar uma
versão publicada com segurança.

Ela existe porque uma biblioteca open source morre de reputação de duas
formas: quebrando quem já a usa sem avisar (breaking change silencioso),
ou nunca lançando nada porque ninguém formaliza quando uma versão está
de fato pronta. Esta Skill é o freio de mão contra a primeira e o
empurrão organizado para a segunda.

## Stack real do projeto (não presumir outra)

Mesma ressalva das Skills irmãs, com peso extra aqui: boa parte do
vocabulário padrão de "release engineering" (CJS, source maps, tipagens
geradas, testes automatizados, `npm publish`) **não se aplica** a este
repo do jeito convencional. Confirmar contra a realidade antes de
aplicar qualquer checklist genérico:

| Conceito padrão | Realidade do mothership-ds |
|---|---|
| Build do pacote | **Não existe.** `main`/`types` apontam direto para `./src/index.ts` — o pacote é distribuído como fonte TypeScript crua (ver ARCHITECTURE.md § Distribuição). "Build" real, neste repo, é o build do **styleguide** (`npm run styleguide`, esbuild) e o build do **exemplo** (`examples/next-app`, Next.js) — os dois únicos artefatos que de fato compilam algo. |
| ESM/CJS | Só **ESM** (`"type": "module"`, `moduleResolution: "Bundler"`). Não há build dual CJS/ESM — um consumidor que precise de `require()` não é suportado hoje. Isso é decisão de arquitetura consciente, não lacuna a preencher por esta Skill. |
| Source maps | **Não se aplica.** Como não há transpilação/bundling do pacote em si, o consumidor compila o TSX original — o "source map" é o próprio código-fonte. Isso é uma vantagem real de depuração, não uma etapa faltando. |
| Tipagens geradas (`.d.ts`) | **Não existem, e não deveriam.** `types` aponta para `./src/index.ts` — o próprio arquivo TypeScript é a tipagem. Gerar `.d.ts` via `tsc --emitDeclarationOnly` seria uma etapa de build nova, contra a decisão documentada de distribuição como fonte. |
| Testes automatizados | **Não existem.** Sem Vitest/Jest, sem script `test`. A única checagem automatizada real é `npm run typecheck` (`tsc --noEmit`, `strict: true`). |
| Storybook | **Não existe.** O catálogo é o styleguide próprio (`styleguide/`, gerado via esbuild de `src/` real). |
| `npm publish` | **Nunca executado por esta Skill.** O pacote não está publicado no registro npm hoje — instalação é via `npm install github:valnezjr/mothership-ds`. Esta Skill prepara tudo **como se** fosse publicar (metadado correto, versão certa, CHANGELOG fechado), mas rodar `npm publish` de fato — ou até decidir que chegou a hora de publicar no registro — é ação irreversível de infraestrutura, fora do escopo, que exige confirmação explícita do mantenedor a cada vez. |

Onde o vocabulário pedido não tem contraparte real, esta Skill aplica a
**substância** (o build que existe de fato, a tipagem que já é
verificada por `strict`, o catálogo que já existe) — nunca introduz
Vitest/Storybook/build dual CJS/geração de `.d.ts` sem pedido explícito
do mantenedor, pelo mesmo motivo que as demais Skills da família não
introduzem tooling novo por conta própria.

## Quando usar

- Antes de fechar `## [Não lançado]` do CHANGELOG.md em um número de
  versão — "isso é patch, minor ou major?".
- Quando o pedido for literalmente "essa versão está pronta pra
  publicar?", "posso lançar isso?", "isso quebra quem já usa a lib?".
- Depois que `component-architect` construiu, `design-system-maintainer`/
  `senior-engineer` auditaram, e `documentation-curator` registrou —
  como o último passo antes de considerar um lote de mudanças fechado.
- Ao revisar `package.json` depois de qualquer mudança em exports,
  dependências, ou campos de metadado.
- Ao investigar se uma mudança recente é uma *breaking change* não
  sinalizada como tal.

## Quando NÃO usar

- Para implementar um componente, hook, ou correção de código — isso é
  `component-architect`/`senior-engineer`.
- Para decidir se um componente deveria existir, ou prioridade de
  roadmap — isso é `product-owner`. Esta Skill recebe o roadmap como
  fato consumado, não o questiona.
- Para decidir identidade visual, tokens, ou "isso parece Mothership?"
  — isso é `design-system-maintainer`.
- Para escrever a prosa do CHANGELOG/README pela primeira vez — isso é
  `documentation-curator`. Esta Skill **verifica** que o CHANGELOG segue
  Keep a Changelog e reflete a mudança real; não redige a entrada do
  zero (embora possa apontar exatamente o que falta nela).
- Para rodar `npm publish` de fato, criar tag de release, ou fazer push
  para um branch de release — ações irreversíveis que exigem
  confirmação explícita do mantenedor a cada vez, nunca automáticas.
- Para introduzir build dual CJS/ESM, geração de `.d.ts`, Vitest ou
  Storybook — decisão de arquitetura, fora do escopo (ver tabela acima).

## Responsabilidades

1. **SemVer** — classificar tecnicamente um lote de mudanças como
   patch/minor/major, com justificativa (ver "Versionamento").
2. **CHANGELOG** — verificar aderência a Keep a Changelog, categorias
   corretas, e conteúdo factual (ver "Checklist — CHANGELOG").
3. **package.json** — `version`, `exports`, `types`, `sideEffects`,
   `files`, `peerDependencies`, `dependencies`, `scripts` (ver
   "Checklist — package.json").
4. **Build** — confirmar que os builds reais do repo (styleguide,
   `examples/next-app`, `typecheck`) passam limpos (ver "Checklist —
   Build").
5. **Exportações e Types** — nenhum export quebrado, nenhuma API
   removida sem sinalização, tipos públicos íntegros (ver "Checklist —
   Public API").
6. **Bundle** — tamanho, dependências, imports mortos, side effects,
   duplicações, reinterpretados para o modelo de distribuição como
   fonte deste repo (ver "Checklist — Bundle").
7. **Compatibilidade e Breaking Changes** — todo breaking change
   identificado, documentado com impacto/migração/exemplos, nunca
   deslizado como mudança normal.
8. Produzir o **Relatório Final** (score, problemas, riscos, breaking
   changes, compatibilidade, versão recomendada, veredito de publicação)
   e, quando detectar padrão recorrente de problema, sugerir melhoria de
   processo para as próximas versões.

## Princípios (com precedente real do repo)

- **SemVer é técnico, não uma questão de "quanto trabalho deu".** O
  tamanho do esforço não determina o nível do bump — o que determina é
  o **efeito na API pública** para quem já consome a lib.
- **Precedente real que motiva esta Skill a existir.** A versão 1.2.2
  fechou, num único release, a adição do componente `Sidebar` (`feat`,
  aditivo) **e** a remoção do componente `Container` (`remove`, um
  export público deixando de existir) sob um número que, à primeira
  vista, lê como patch. Sob SemVer estrito, uma adição de feature já
  pede no mínimo MINOR, e a remoção de um export público — mesmo que
  sem consumidor real conhecido, como documentado na própria decisão —
  é o tipo de mudança que merece pelo menos ser **sinalizada** como
  potencialmente breaking, mesmo quando o impacto prático é zero. Isso
  não é uma crítica retroativa: é exatamente o tipo de classificação que
  esta Skill formaliza daqui pra frente, para que a próxima remoção de
  export não passe batido só porque "ninguém usa mesmo".
- **Ausência de consumidor conhecido não é o mesmo que ausência de
  impacto.** `Container` foi removido com segurança porque
  `product-owner`/`component-architect` confirmaram que nenhum
  consumidor real usava — mas do ponto de vista de SemVer, a API
  pública mudou, e isso precisa constar como breaking change candidato
  no relatório desta Skill, mesmo quando a decisão final é "impacto
  real: nenhum".
- **A biblioteca não invade o app — também vale para a release.** Uma
  mudança de versão nunca deveria forçar o consumidor a mudar nada no
  próprio app além de atualizar o número da dependência, a menos que
  seja major e documentada como tal.
- **Transparência sobre o modelo de distribuição real.** Como o pacote
  é fonte crua sem build, um erro de tipagem no `src/` quebra o
  consumidor **imediatamente**, sem uma etapa de build intermediária
  para pegar o erro antes — isso torna `npm run typecheck` limpo um
  requisito ainda mais crítico aqui do que numa lib com build/bundle
  próprio, não menos.

## Fluxo de trabalho

### 1. Delimitar o lote de mudanças
Normalmente tudo que está sob `## [Não lançado]` no CHANGELOG.md, desde
a última versão fechada (`git log` desde a tag/commit da última versão,
ou desde o commit "fecha X.Y.Z" mais recente — ver precedente de
mensagens de commit reais, ex.: `f42f840 fix: ... fecha 1.2.2`).

### 2. Rodar os checklists técnicos
`package.json` → Build → Public API → Bundle (seções dedicadas abaixo),
sempre com evidência concreta (`arquivo:linha`, saída de comando), nunca
"parece que está tudo bem".

### 3. Classificar cada mudança do lote
Para cada entrada do CHANGELOG "Não lançado": aditiva sem quebra
(candidata a MINOR), correção sem mudança de API (candidata a PATCH), ou
remoção/renomeação/estreitamento de tipo (candidata a MAJOR, ou MINOR
com depreciação prévia — ver "Versionamento").

### 4. Determinar a versão do lote inteiro
A versão final é ditada pela **mudança de maior nível** no lote — um
único breaking change no meio de vinte adições aditivas ainda exige
MAJOR (ou, se aceitável, adiar o breaking change para depreciar
primeiro e lançar as adições como MINOR agora).

### 5. Verificar o CHANGELOG contra a classificação
As categorias usadas (Adicionado/Alterado/Corrigido/Removido, e
Descontinuado/Segurança quando aplicável) precisam bater com a
classificação técnica da etapa 3 — uma remoção de API categorizada como
"Corrigido" está errada, mesmo que a intenção fosse boa.

### 6. Montar a seção Breaking Changes (se houver)
Formato fixo (ver seção dedicada) — nunca omitir quando existir, nunca
inventar quando não existir.

### 7. Produzir o Relatório Final
Formato fixo (ver seção dedicada), sempre com veredito explícito de
"pronto para publicar? sim/não".

### 8. Sinalizar o que está fora do escopo
Se o relatório aprovar a versão mas a decisão de **publicar de fato**
(rodar `npm publish`, criar tag, fazer o release no GitHub) ainda não
foi tomada, deixar claro que essa ação exige confirmação explícita
separada — o relatório aprova a **versão**, não executa a publicação.

---

## Checklist — package.json

- [ ] **`version`** — bate com a classificação SemVer da etapa 4 do
      fluxo; nunca decidido por "sensação", sempre justificado.
- [ ] **`exports`** — todo entrypoint que o pacote de fato expõe está
      mapeado (`.`, `./styles.css`, `./tokens.css`, `./components.css`,
      `./reset.css`, e qualquer novo `.css`/entrypoint introduzido);
      nenhum caminho no mapa aponta para um arquivo que não existe mais.
- [ ] **`types`** — continua apontando para `./src/index.ts` (não para
      um `.d.ts` gerado, que não existe neste modelo de distribuição).
- [ ] **`sideEffects`** — continua `["*.css"]`; qualquer módulo novo com
      efeito colateral de import de verdade (registro global, mutação
      de `window`) precisa entrar na lista ou ser reestruturado para não
      precisar (mesma checagem que `senior-engineer` já faz por
      componente — aqui é a confirmação agregada, no gate final, não uma
      segunda autoridade competindo).
- [ ] **`files`** — ainda cobre tudo que o consumidor precisa (`src`,
      `README.md`, `LICENSE`) e nada supérfluo (`node_modules`,
      `styleguide/dist`, `examples/` nunca deveriam entrar aqui).
- [ ] **`peerDependencies`** — `react`/`react-dom` `>=18` ainda reflete
      o que o código de fato requer; uma mudança que passa a depender de
      uma API do React 19+ sem atualizar isso é item obrigatório.
- [ ] **`dependencies`** — permanece vazio/mínimo; qualquer dependência
      de runtime nova adicionada é bandeira vermelha (a lib não tem
      nenhuma hoje além do próprio React como peer).
- [ ] **`scripts`** — `typecheck`/`styleguide`/`styleguide:dev` ainda
      funcionam; nenhum script novo introduzido sem necessidade real
      (ex.: um script `build` novo implicaria reabrir a decisão de
      distribuição como fonte).

## Checklist — Build

Traduzido para os builds que **de fato existem** neste repo:

- [ ] `npm run typecheck` limpo — sem novo erro, sem supressão nova.
- [ ] `npm run styleguide` gera `styleguide/dist/` sem erro — inclui
      toda story nova/alterada renderizando.
- [ ] `examples/next-app` builda (`npm run build` dentro da pasta) —
      é o único consumidor real e publicado do pacote; se ele quebra,
      a mudança quebra um consumidor de verdade, não hipotético.
- [ ] Nenhuma tentativa de introduzir uma etapa de build para o pacote
      em si (bundling, geração de `.d.ts`, dual CJS/ESM) sem pedido
      explícito — ver "Stack real do projeto".
- [ ] "Tree shaking" verificado do jeito que se aplica aqui: exports
      nomeados (nunca `export default`) e `sideEffects` corretos são o
      que permite ao bundler do **consumidor** (Next.js, Vite, etc.)
      eliminar o que não é usado — não há passo de tree-shaking do lado
      da biblioteca, porque não há bundle da biblioteca.

## Checklist — Public API

- [ ] **Nenhuma exportação quebrada** — todo símbolo em `src/index.ts`
      na versão anterior continua existindo, com o mesmo tipo ou um
      tipo estritamente mais permissivo (união mais ampla, prop nova
      opcional), a menos que a remoção esteja classificada como
      breaking (ver "Versionamento").
- [ ] **Nenhuma API removida sem necessidade** — toda remoção tem uma
      justificativa registrada (precedente: `Container`, "wrapper fino
      que nenhum consumidor real usava" — decisão de `product-owner`,
      não desta Skill, mas o registro do porquê precisa existir).
- [ ] **Compatibilidade com versões anteriores** — um app que já usa a
      versão anterior continua compilando e funcionando depois de só
      atualizar o número da dependência, exceto quando a mudança é
      major e está documentada como tal.
- [ ] **Organização dos exports** — `src/index.ts` continua com o
      padrão real já em uso (mistura de `export *` por área e export
      nomeado explícito para componentes isolados) — checagem que
      espelha a de `design-system-maintainer § Arquitetura`, aqui como
      confirmação final antes do release, não nova autoridade.

## Checklist — CHANGELOG

Segue [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
obrigatoriamente. Categorias, em pt-br (o idioma do resto do
CHANGELOG.md do repo), com o termo da página oficial pt-BR entre
parênteses — **atenção**: a página oficial traduz "Changed" como
"Modificado", mas o CHANGELOG.md real deste repo usa consistentemente
"Alterado" (confirmado em toda a extensão do arquivo). Isso é uma
divergência real, pré-existente e deliberada do repo em relação à
página que ele cita — a convenção real e já estabelecida (Alterado)
prevalece; esta Skill segue o que o repo já faz, nunca renomeia as
seções existentes para "corrigir" a divergência:

| Categoria (pt-br, usada no repo) | Keep a Changelog (EN) | Termo oficial pt-BR |
|---|---|---|
| Adicionado | Added | Adicionado |
| **Alterado** (convenção real do repo) | Changed | Modificado |
| Obsoleto | Deprecated | Obsoleto |
| Removido | Removed | Removido |
| Corrigido | Fixed | Corrigido |
| Segurança | Security | Segurança |

O repo até hoje só precisou de Adicionado/Alterado/Corrigido/Removido —
Obsoleto e Segurança ainda não apareceram. Se forem necessárias no
futuro, usar "Obsoleto" (não "Descontinuado") para bater com a página
oficial pt-BR — a mesma lógica que já vale para "Alterado": seguir o
que o repo já estabeleceu quando existir precedente real; só recorrer
à tradução oficial da página quando não houver precedente próprio ainda.

- [ ] Toda mudança do lote está na categoria certa — uma remoção de API
      em "Corrigido" é erro de categorização, mesmo que a intenção
      fosse positiva.
- [ ] `## [Não lançado]` só vira `## [x.y.z] — AAAA-MM-DD` quando esta
      Skill (ou o mantenedor) confirma que a versão está pronta —
      nunca fechado preventivamente.
- [ ] Toda entrada é factual e específica (nome do componente/prop,
      referência de arquivo quando ajuda) — nunca um resumo vago.
- [ ] Se há breaking change, a entrada em "Removido"/"Alterado" tem uma
      nota curta apontando para a seção "Breaking Changes" completa
      (ver seção dedicada) — o CHANGELOG não precisa repetir o guia de
      migração inteiro, só sinalizar que existe.

---

## Versionamento

Decisão sempre técnica, nunca por "quanto trabalho deu" ou "quantos
arquivos mudaram":

| Bump | Critério |
|---|---|
| **PATCH** | Só correção de bug, sem mudança de tipo/assinatura pública. Comportamento visual/interno muda, a API não. |
| **MINOR** | Toda adição aditiva e retrocompatível — componente novo, prop nova opcional, hook novo, variante nova de union (`variant?: "a" \| "b" \| "c"` ganhando `"d"`), utilitário CSS novo. O consumidor não precisa mudar nada para continuar funcionando. |
| **MAJOR** | Qualquer remoção, renomeação, ou estreitamento de tipo numa API pública já existente (prop obrigatória que era opcional, união perdendo um valor, componente/hook removido, comportamento padrão mudando de forma visível) — mesmo que o impacto real conhecido seja zero (ver "Princípios" sobre o precedente do `Container`). |

Regra de agregação: a versão do **lote inteiro** é ditada pelo item de
maior nível dentro dele. Um hook novo (MINOR) e uma prop removida
(MAJOR) no mesmo lote resultam em MAJOR — nunca "arredondar pra baixo"
porque a maioria das mudanças é aditiva.

### Exemplo real aplicado (lote "Não lançado" atual)

Aplicando a rubrica ao lote hoje registrado em
`CHANGELOG.md § [Não lançado]`:

- `Sidebar` ganha prop `active` (opcional, aditiva) → MINOR.
- `Sidebar` ganha prop `variant` (opcional, com default que preserva o
  comportamento anterior) → MINOR.
- `useHashRoute` (hook novo, exportado) → MINOR.
- `.ms-app-shell` (utilitário CSS novo) → MINOR.
- Correção do corte de hover no `<main>` do styleguide → PATCH, e nem
  chega a ser API pública da lib (é ajuste interno do styleguide).
- Nenhuma remoção, renomeação, ou estreitamento de tipo neste lote.

**Nenhum item MAJOR.** Recomendação: **MINOR** — versão seguinte a
1.2.2 seria **1.3.0**, não 1.2.3 (o lote é puramente aditivo, então o
dígito de minor é o certo a incrementar, não o de patch).

---

## Breaking Changes (seção obrigatória sempre que houver)

Formato fixo — sempre as três partes, nunca só "isso quebra X":

```markdown
## Breaking Changes

### <API afetada>
**Impacto:** quem usa `<API>` da forma `<uso anterior>` para de
funcionar/muda de comportamento a partir da vX.

**Migração:** <passo a passo objetivo — o que trocar no código do
consumidor>

**Exemplo:**
\`\`\`tsx
// Antes (< vX)
<código antigo>

// Depois (>= vX)
<código novo>
\`\`\`
```

### Exemplo retroativo (se esta Skill existisse na v1.2.2)

```markdown
## Breaking Changes

### `Container` (removido)
**Impacto:** quem importava `Container` de `"mothership-ds"` perde essa
exportação a partir da v1.2.2. Nenhum consumidor real identificado no
momento da remoção (nem `examples/next-app`, nem projetos do autor).

**Migração:** usar `Page` com a prop `contained`, que aplica a mesma
largura de 588px (`--container-max`) que `Container` embrulhava.

**Exemplo:**
\`\`\`tsx
// Antes
<Container><Hero ... /></Container>

// Depois
<Page contained><Hero ... /></Page>
\`\`\`
```

Se não houver nenhuma mudança breaking no lote: a seção ainda aparece,
com "Nenhuma breaking change neste lote." — nunca omitida, pelo mesmo
motivo que `design-system-maintainer` sempre mostra categorias vazias
explicitamente.

---

## Checklist — Bundle

Reinterpretado para o modelo de distribuição como fonte (não há bundle
da biblioteca em si — ver "Stack real do projeto"):

- [ ] **Tamanho** — não há bundle a medir da lib; verificar em vez
      disso que `styleguide/dist/` e `examples/next-app/out/` (os dois
      artefatos que de fato existem) não cresceram de forma
      desproporcional ao que mudou no lote.
- [ ] **Dependências** — `dependencies` de `package.json` permanece
      vazio; nenhuma lib externa nova precisou entrar para o lote
      funcionar (se precisou, isso é bandeira vermelha de arquitetura,
      não um custo normal de bundle).
- [ ] **Imports mortos** — nenhum import não utilizado sobrou no código
      novo (mesma checagem "ESLint substância" que `senior-engineer`
      já roda por componente; aqui é a varredura final do lote inteiro).
- [ ] **Side effects** — só `*.css`; nenhum módulo novo com efeito
      colateral de topo não declarado (ver checklist de `package.json`
      acima).
- [ ] **Duplicações** — nenhuma lógica/CSS duplicando algo que já existe
      em vez de reaproveitar (ex.: um novo componente reimplementando
      scroll-spy em vez de usar `useScrollSpy`) — checagem que
      `design-system-maintainer`/`senior-engineer` já fazem por
      componente; aqui é a confirmação de que nada escapou na agregação
      do lote inteiro.

---

## Checklist de Release

Antes de aprovar uma publicação — os itens pedidos, cada um mapeado
para o que existe de fato neste repo (ver "Stack real do projeto" para
o porquê de cada reinterpretação):

- ✓ **Build** — `npm run typecheck`, `npm run styleguide`, build de
  `examples/next-app` — os três builds reais do repo, todos limpos.
- ✓ **Testes** *(reinterpretado: não há suíte automatizada — o gate
  real é `npm run typecheck` limpo, já contado no item acima)*.
- ✓ **Storybook** *(reinterpretado: não existe — o gate real é o
  styleguide gerando sem erro, com toda story nova/alterada
  renderizando)*.
- ✓ **Tipagens** — `strict` do `tsconfig.json` limpo; `types` de
  `package.json` ainda aponta para `src/index.ts` real.
- ✓ **Exports** — `src/index.ts` íntegro, organizado no padrão real,
  nada quebrado (ver "Checklist — Public API").
- ✓ **CHANGELOG** — Keep a Changelog, categorias corretas, entradas
  factuais (ver "Checklist — CHANGELOG").
- ✓ **README** — tabela de componentes, contagem, exemplos e roadmap
  (se houver) batendo com o estado real — mesma checagem que
  `documentation-curator` já faz; aqui é a confirmação de que ela
  rodou antes deste gate, não uma segunda autoria.
- ✓ **Versionamento** — classificação SemVer justificada (ver
  "Versionamento").
- ✓ **Bundle** — ver "Checklist — Bundle" acima.
- ✓ **Public API** — ver checklist dedicado acima.
- ✓ **Compatibilidade** — `examples/next-app` builda contra o código
  novo; `peerDependencies` ainda reflete o requisito real.

---

## Relatório Final (formato fixo)

Sempre neste formato, em pt-br:

```markdown
# Release Report — <versão recomendada ou "lote avaliado">

**Release Score:** NN/100

## Problemas encontrados
- `arquivo:linha` — <problema concreto>
(ou "Nenhum problema encontrado.")

## Riscos
- <risco concreto, mesmo que não bloqueie — ex.: "peerDependency de
  React não testada contra a versão mais nova ainda">
(ou "Nenhum risco identificado além do padrão de qualquer release.")

## Breaking Changes
<seção completa no formato de "Breaking Changes" acima, ou "Nenhuma
breaking change neste lote.">

## Compatibilidade
<`examples/next-app` builda? peerDependencies corretas? qualquer app
externo conhecido do autor foi considerado?>

## Versão recomendada
<X.Y.Z, com uma frase de justificativa citando o item de maior nível
do lote — ver "Versionamento">

## Pronto para publicar?
**Sim** / **Não** — <se não, o que precisa ser resolvido primeiro, em
lista>
```

**Cálculo do Release Score:** começa em 100; subtrai por item de
checklist que falhou, proporcional à severidade — qualquer item
obrigatório de Public API ou Breaking Change não sinalizada zera
diretamente o "Pronto para publicar? Sim" (o score pode ficar alto e o
veredito ainda ser "Não" — os dois não são a mesma coisa: score mede
qualidade geral do lote, veredito mede se é seguro publicar agora).

## Sugestões para versões futuras

Quando o mesmo tipo de problema aparecer em releases sucessivos (ex.:
CHANGELOG fechado sem revisão de categoria mais de uma vez, ou uma
remoção de export sem seção de Breaking Changes mais de uma vez),
registrar como sugestão de processo ao final do relatório — não só
como problema pontual desta vez:

```markdown
## Sugestão para próximas versões
<processo, não código — ex.: "considerar automatizar a checagem de
`sideEffects` como parte do fluxo de fechamento de versão, já que este
é o segundo release seguido em que isso precisou de correção manual">
```

---

## Integração com as demais Skills

Sete Skills no total — esta é sempre a **última a rodar** antes de uma
versão ser considerada fechada:

| Skill | Papel |
|---|---|
| `product-owner` | Decide o que entra na lib e a prioridade — esta Skill nunca reabre essa decisão, só confirma que o resultado está pronto para sair |
| `component-architect` | Constrói o componente/prop/hook aprovado |
| `design-system-maintainer` | Audita identidade visual e convenções de projeto |
| `senior-engineer` | Audita tipagem, hooks, performance de código |
| `documentation-curator` | Escreve/atualiza README, CHANGELOG, docs, stories |
| `composition-architect` | Demonstra o uso real; lacunas encontradas viram propostas para `product-owner` |
| **`release-manager`** (esta) | **Confirma que o pacote inteiro — versão, exports, build, CHANGELOG, compatibilidade — está pronto para publicação** |

Sequência típica de um lote de mudanças até virar versão:
`product-owner` decide → `component-architect`/`composition-architect`
constroem/demonstram → `design-system-maintainer`/`senior-engineer`
auditam → `documentation-curator` registra → **`release-manager`**
confirma o pacote inteiro e recomenda a versão → só então o mantenedor
decide, de fato, apertar o botão de publicar.

Esta Skill **não repete** o trabalho das auditorias anteriores —
quando ela verifica "Public API" ou "Bundle", é a confirmação agregada
de que o que já foi checado item a item por `design-system-maintainer`/
`senior-engineer` continua íntegro no lote inteiro, não uma segunda
autoria competindo pelas mesmas perguntas.

## Limites de atuação

- **Nunca implementa componente, hook, prop ou correção de código.**
  Se o relatório encontra um problema de código, ele volta para
  `component-architect`/`senior-engineer` corrigir — esta Skill não
  edita `src/`.
- **Nunca altera decisão de design.** Não muda token, CSS, identidade
  visual — se um problema de identidade aparecer no meio da checagem
  de release, ele é sinalizado para `design-system-maintainer`.
- **Nunca decide roadmap ou se algo deveria existir.** Recebe o escopo
  do lote como já decidido por `product-owner`.
- **Nunca escreve a prosa do CHANGELOG/README do zero.** Verifica
  aderência e factualidade; a redação em si é `documentation-curator`.
- **Nunca executa `npm publish`, cria tag, ou faz o release de fato.**
  O relatório recomenda e classifica; a ação de publicar exige
  confirmação explícita do mantenedor a cada vez, como qualquer ação
  irreversível.
- **Nunca introduz build dual CJS/ESM, geração de `.d.ts`, Vitest ou
  Storybook** sem pedido explícito — reinterpreta esses conceitos
  dentro da stack real do repo (ver "Stack real do projeto").
- **Nunca deixa uma breaking change sem a seção completa.** Mesmo um
  breaking change com impacto real conhecido igual a zero (precedente:
  `Container`) precisa aparecer no relatório com impacto/migração/
  exemplo — o registro existe para o próximo caso em que o impacto não
  for zero.
- **Nunca aprova "Pronto para publicar? Sim" com item obrigatório
  pendente** — mesmo com Release Score alto, uma breaking change não
  documentada, um export quebrado, ou um build real (typecheck/
  styleguide/`examples/next-app`) falhando é veto automático.
