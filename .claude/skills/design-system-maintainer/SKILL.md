---
name: design-system-maintainer
description: Skill principal do Mothership DS — audita qualquer alteração no repo (componente novo, edição, CSS, refactor) contra a linguagem visual, arquitetura, API pública, performance e identidade da biblioteca, e produz um relatório de revisão com score, problemas, sugestões, itens obrigatórios e aprovação/reprovação. Use depois de qualquer mudança em src/, styles/ ou styleguide/stories.tsx, antes de considerar o trabalho pronto. Não usar para criar componentes novos (isso é o component-architect) nem para aplicar as correções sozinha sem pedido explícito.
---

# Design System Maintainer — Mothership DS

Skill de **guarda-chuva** do projeto: não constrói nada, **audita** o que
já foi construído ou alterado. É o portão de qualidade antes de qualquer
mudança em `src/`, `src/styles/`, `styleguide/` ou `docs/` ser considerada
pronta. Onde `component-architect` projeta e implementa, esta Skill
verifica o resultado contra tudo que o repo já decidiu — e só isso.

Ela responde, com evidência de arquivo:linha, a perguntas do tipo:
*"Isso parece um componente da Mothership?"*, *"Isso quebra a
identidade?"*, *"Isso introduz uma linguagem visual nova sem necessidade?"*

## Quando usar

- Depois de criar um componente novo (inclusive logo após
  `component-architect` terminar um) — antes de considerar o PR pronto.
- Depois de editar CSS em `src/styles/tokens.css` ou
  `src/styles/components.css`.
- Depois de qualquer refactor que toque `src/index.ts`, mova arquivos em
  `src/components/`, ou altere a assinatura pública de um componente
  existente (props adicionadas/removidas/renomeadas).
- Antes de um `git commit`/PR que toque qualquer coisa em `src/`,
  `styleguide/`, ou os `.md` de referência interna
  (ARCHITECTURE.md, TOKENS.md, ACCESSIBILITY.md, COMPONENT_GUIDELINES.md).
- Quando o pedido do usuário for literalmente "revisa essa mudança",
  "isso quebra o design system?", "isso parece Mothership?".

## Quando NÃO usar

- Para **criar** um componente novo do zero — isso é
  `component-architect`; esta Skill só entra depois que algo já existe
  para revisar.
- Para **aplicar** as correções que ela mesma encontrou, sem que o
  usuário peça explicitamente. O produto desta Skill é o relatório; agir
  sobre os itens obrigatórios é uma etapa separada e consciente.
- Para decidir roadmap (qual componente construir, prioridade) — isso é
  `product-owner`.
- Para revisar código de aplicação **fora** do pacote (ex.: código
  específico de `examples/next-app` que não usa a API pública da lib) —
  a menos que o que está sendo checado seja justamente o consumo correto
  da API pública.
- Para bump de versão ou decisão de release — classificar SemVer e
  aprovar a publicação é `release-manager`; publicar de fato é decisão
  explícita do mantenedor, registrada em CHANGELOG.md/package.json à
  parte.

## Responsabilidades

1. Identificar exatamente o que mudou (diff de `git`, ou arquivos
   apontados pelo usuário) e mapear cada mudança para as categorias de
   revisão abaixo que se aplicam a ela.
2. Percorrer cada checklist relevante com evidência concreta
   (`arquivo:linha`), nunca uma impressão vaga ("parece que talvez...").
3. Classificar cada achado como **item obrigatório** (bloqueia aprovação
   por si só) ou **sugestão** (não bloqueia, mas vale registrar).
4. Calcular um score e emitir veredito de aprovação/reprovação segundo a
   rubrica fixa desta Skill (ver "Critérios de aceitação").
5. Produzir o relatório no formato padronizado (ver "Relatório de
   revisão") — sempre o mesmo formato, para que revisões sucessivas
   sejam comparáveis.
6. **Não corrigir nada sozinha.** Reportar. Se o usuário pedir para
   aplicar as correções depois de ver o relatório, aí sim vira uma tarefa
   separada e explícita.

## Princípios que orientam a revisão

Os mesmos princípios que orientam a criação orientam a auditoria — a
Skill mede contra eles, não contra gosto pessoal:

- **Tokens antes de valores.** Todo valor visual rastreável a
  `tokens.css`. Nenhuma exceção "só dessa vez".
- **Poucos efeitos, respiro orgânico.** Um efeito novo por componente é
  suspeito por padrão — o ônus da prova é de que ele realmente precisa
  existir, não o contrário.
- **`--ease-bounce` é a única assinatura de movimento.** Qualquer outro
  easing/overshoot é uma linguagem visual nova, não uma variação.
- **A biblioteca não invade o app.** Sem reset global, sem seletor fora
  de `.ms-page`, sem `!important` como muleta, sem dependência de
  runtime nova.
- **Performance acima de complexidade.** Memoização e otimização são
  aceitáveis quando resolvem um custo real e mensurável (valor de
  Context, transformação O(n) de dados) — precedentes reais no repo:
  `useMemo` no `value` de `ThemeProvider`/`AlertsProvider`, em
  `sortedRows` de `Table`, em `byKey` de `disclosure.tsx`. Memoização
  espalhada "por via das dúvidas" sem esses casos é complexidade sem
  ganho — sinalizar como sugestão de simplificação, não elogiar como
  boa prática por padrão.
- **Estado nunca só por cor.** Todo estado visual tem `aria-*`
  correspondente — regra que não se negocia, item obrigatório sempre
  que violada.

## Fluxo de trabalho

### 1. Delimitar o que revisar
- Se invocada após uma mudança recente: `git diff` (ou `git diff
  --staged`) para listar arquivos tocados. Preferir o diff real a
  reler o arquivo inteiro — o que importa é o que mudou.
- Se o usuário apontar arquivos/componentes específicos, revisar só
  esses, mas ainda checando consistência contra o resto do repo (ex.:
  "esse nome de prop já existe em outro componente com sentido
  diferente?").
- Ignorar mudanças fora do escopo da Skill (workflows do GitHub Actions,
  `package.json` além de export/versão, `node_modules`, `styleguide/dist/`
  gerado).

### 2. Mapear categorias aplicáveis
Nem toda mudança aciona todo checklist — mapear antes de aplicar:

| Tipo de mudança | Categorias obrigatórias |
|---|---|
| CSS novo/editado (`components.css`, `tokens.css`) | Linguagem visual, Performance (backdrop-filter/animações), Design Language |
| Componente novo ou editado (`.tsx`) | Arquitetura, APIs, Performance, Linguagem visual (se leva CSS junto), Design Language |
| `src/index.ts` tocado | Arquitetura (barrel/exports) |
| Prop renomeada/removida/com tipo alterado | APIs (breaking change) — categoria sempre obrigatória aqui |
| Só `docs/*.md` ou `styleguide/stories.tsx` | Fora do escopo funcional desta Skill — checar só consistência textual com o componente real, não é o foco |

### 3. Percorrer cada checklist com evidência
Para cada item de cada categoria aplicável (ver seções detalhadas
abaixo), registrar: passou / falhou / não se aplica, com
`arquivo:linha` como evidência sempre que falhar. Nunca marcar "falhou"
sem apontar onde.

### 4. Classificar achados
- **Item obrigatório**: viola uma regra que "não se negocia" (ver
  CLAUDE.md § Regras que não se negociam, e a lista consolidada abaixo)
  ou introduz uma *breaking change* de API não sinalizada como tal.
  Bloqueia aprovação sozinho, independente do score.
- **Sugestão**: não viola regra fixa, mas diverge de um padrão
  predominante no repo, ou é uma oportunidade de simplificação/coerência
  visual. Não bloqueia, mas entra no relatório.

### 5. Calcular score e veredito
Ver "Critérios de aceitação" — rubrica fixa, não subjetiva por revisão.

### 6. Emitir o relatório
Formato fixo (ver "Relatório de revisão"). Sempre em pt-br, tom direto,
igual ao resto da documentação do repo.

---

## Checklist — Linguagem visual

- [ ] **Espaçamento**: todo `margin`/`padding`/`gap` usa
      `var(--space-1..7)`. Nenhum valor como `10px`/`18px`/`1.5rem` solto.
- [ ] **Grid**: colunas/spans usam os mesmos padrões já em uso
      (ex.: `BentoGrid` de 4 colunas, colapso para 1 coluna abaixo de
      720px) — um grid novo com número de colunas/breakpoint diferente
      precisa de justificativa, não é automaticamente errado, mas é
      candidato a "Design Language: introduz linguagem nova?".
- [ ] **Tipografia**: família sempre `var(--font-family)`; tamanho
      sempre da escala `--text-xs` … `--text-2xl` ou os utilitários
      prontos (`.ms-h1`, `.ms-h2`, `.ms-h3`, `.ms-text-sm`,
      `.ms-text-xs`, `.ms-text-muted`). Nenhum `font-size` cru, nenhuma
      segunda família de fonte.
- [ ] **Sombras**: reaproveita os padrões de sombra já existentes
      (elevação de superfície de vidro, sombra do `.ms-hover-edge`) —
      uma sombra nova com cor/blur/espalhamento inventado do zero é
      suspeita.
- [ ] **Glass**: `backdrop-filter` usa `var(--blur-glass)` ou
      `var(--blur-soft)` — nunca um valor de blur numérico novo.
      Verificar também a armadilha de aninhamento: `backdrop-filter`
      dentro de outro `backdrop-filter` não se aplica (ver
      ARCHITECTURE.md § Portais) — se o componente novo vive dentro de
      uma superfície de vidro existente, confirmar que não é esse o
      caso, ou que já foi resolvido via portal.
- [ ] **Blur**: mesmo ponto acima — só os dois tokens de blur existentes,
      nunca um terceiro valor.
- [ ] **Motion**: toda transição usa `var(--transition-fast|base|slow)`.
      Toda animação com overshoot usa `var(--ease-bounce)` — nenhum
      outro `cubic-bezier`/`ease-in-out`/`linear` novo para esse efeito.
- [ ] **Timing**: durações batem com o vocabulário existente
      (`--transition-fast` = 0.1s outline, `--transition-base` = 0.2s
      deslizes curtos, `--transition-slow` = 0.3s fundos/cores;
      `Marquee` usa a família own de `--ms-marquee-duration`). Uma
      duração fora dessas famílias, sem ser um token novo dedicado (como
      o caso do Marquee), é bandeira vermelha.
- [ ] **Easing**: `var(--ease-bounce)` é a única assinatura de sistema —
      qualquer outro easing custom introduzido é, por definição, uma
      nova linguagem de movimento (reportar em Design Language).
- [ ] **Tokens**: rodar mentalmente (ou via grep) por qualquer valor
      hex (`#`), `px`/`rem` cru fora de `tokens.css`, ou `rgba(`
      fabricado fora de `--color-*-soft`. Qualquer ocorrência em CSS de
      componente é item obrigatório.
- [ ] **Identidade visual**: cores de marca continuam batendo com as
      paradas do gradiente da logo (`--color-accent`/`--color-pink`/
      `--color-orange`) — nenhuma cor de marca nova inventada fora da
      paleta de 8 cores existente (`accent`, `highlight`, `success`,
      `danger`, `violet`, `pink`, `orange`, `gray`).

## Checklist — Arquitetura

*Ângulo desta Skill: estrutura de projeto e convenção do repo — "está no
lugar certo, exportado do jeito certo, reaproveitando o que já existe?".
Corretude do próprio design da API/tipo (generics, SRP de um hook, etc.)
é `senior-engineer` — ver "Como esta Skill se relaciona com as outras".*

- [ ] **Estrutura de pastas**: componente entra em `src/components/`,
      arquivo por **área** (não por componente individual) — um arquivo
      novo só se a área for genuinamente nova; caso contrário deveria
      ter entrado no arquivo de área já existente. Um arquivo novo
      criado por engano quando já havia área compatível é item de
      arquitetura a sinalizar.
- [ ] **Exportações / barrel file**: `src/index.ts` é o único barrel do
      pacote. Confirmar o padrão real já em uso — arquivos de área com
      múltiplos componentes usam `export * from "./components/X"`;
      componentes isolados (`Modal`, `Loader`, `Splash`, `LogoMark`) usam
      export nomeado explícito + `export type` do tipo de props ao
      lado. Um componente novo precisa entrar no estilo certo conforme
      o arquivo em que vive, não misturar os dois estilos dentro do
      mesmo arquivo de área.
- [ ] **Organização**: ordem de `src/index.ts` segue a ordem de
      introdução das áreas (não é alfabética) — não reordenar o arquivo
      inteiro numa mudança pontual; isso infla o diff e esconde o que
      de fato mudou.
- [ ] **Consistência entre componentes**: um componente novo que
      resolve um problema já resolvido em outro lugar do repo (ex.:
      scroll-spy, hash-routing, ID de SVG) deve reaproveitar o
      hook/utilitário existente (`useScrollSpy`, `useHashRoute`,
      `React.useId()`), nunca duplicar a lógica num arquivo novo.
- [ ] **`"use client"`**: presente em todo arquivo com estado/efeito/
      ref com comportamento/handler; ausente apenas nos casos
      genuinamente apresentacionais. Hoje só `primitives.tsx` e
      `LogoMark.tsx` ficam sem — uma terceira exceção é possível, mas
      precisa ser justificada explicitamente no relatório, não apenas
      assumida.
- [ ] **Arquivos gerados**: `LogoMark.tsx` é gerado a partir de
      `assets/logo.svg` — qualquer edição manual direta nesse arquivo é
      item obrigatório (a mudança certa entra pelo SVG de origem).

## Checklist — APIs

- [ ] **Variantes**: nomes de prop reaproveitam o vocabulário já
      estabelecido (`variant`, `tone`, `size`, `inline`) antes de
      inventar um termo novo para o mesmo conceito. Um `tone` novo deve
      vir de dentro das 8 cores de marca já existentes — uma cor de
      marca inventada ad-hoc na prop é item obrigatório (ver também
      Linguagem visual § Identidade visual).
- [ ] **Breaking changes**: qualquer prop **removida**, **renomeada**,
      ou com **tipo estreitado** (união perdendo um valor, tipo
      obrigatório que era opcional) numa API pública já existente é
      item obrigatório por padrão — só deixa de ser bloqueante se o
      usuário already sinalizou explicitamente que é uma mudança de
      major/breaking intencional (e isso precisa estar registrado em
      CHANGELOG.md). Adição de prop opcional nova não é breaking change.
- [ ] **Nomenclatura**: `PascalCase` para componentes, `camelCase` para
      props e hooks (`useAlgumaCoisa`), `kebab-case` para classes CSS
      com prefixo `ms-`. Qualquer inconsistência de caixa é item de
      nomenclatura.
- [ ] **Composição**: componente aceita `children`/`ReactNode` onde
      fizer sentido em vez de props fechadas para conteúdo (precedente:
      `IconButton`/`Button`/`PricingCard` recebem `ReactNode` para ícone,
      nunca importam um ícone específico). Uma prop nova que força uma
      dependência de conteúdo específico (string fixa, ícone
      hardcoded) é candidata a virar `children` em vez de prop fechada.
- [ ] **Props sempre repassadas**: `className` aceito e mesclado via
      `[...].filter(Boolean).join(" ")`; `{...rest}` sempre espalhado no
      elemento raiz. Omitir qualquer um dos dois é item obrigatório.

## Checklist — Performance

*Ângulo desta Skill: custo do **efeito visual** (quanto `backdrop-filter`
empilhado, se a animação é essencial à identidade). Corretude da
otimização em si (a dependência do efeito está certa? a memoização
realmente evita re-render?) é `senior-engineer` — ver "Como esta Skill
se relaciona com as outras".*

- [ ] **Renders**: nenhum componente re-renderiza o restante da árvore
      desnecessariamente por causa de um valor de contexto recriado a
      cada render — `value` de um novo Provider deve ser memoizado
      (`useMemo`) só quando o valor é objeto/array recriado a cada
      chamada, seguindo o precedente de `ThemeProvider`/`AlertsProvider`.
- [ ] **Memoização**: usada de forma cirúrgica — valor de Context,
      transformação O(n)/O(n log n) de dados (`sortedRows`, `byKey`),
      nunca "porque sim" em cálculos triviais ou em componentes que já
      são baratos. Memoização sem um custo real por trás é sugestão de
      simplificação (remover), não elogio.
- [ ] **`backdrop-filter`**: é o efeito mais caro do sistema visualmente
      (49 ocorrências já no CSS) — um componente novo que empilha
      múltiplas camadas de `backdrop-filter` sobrepostas na mesma tela
      (não apenas uma superfície de vidro) é bandeira de performance,
      mesmo que cada uma isoladamente use os tokens certos.
- [ ] **Animações**: contínuas (parallax, marquee, pulsação de fundo) só
      se justificadas como parte da identidade de movimento — uma
      animação em loop infinito nova, fora do fundo vivo/marquee/splash/
      loader já existentes, é suspeita de custo de CPU/GPU sem
      necessidade. Confirmar `will-change`/`transform`/`opacity` como
      propriedades animadas (compositor), não `top`/`left`/`width` crus
      forçando reflow.
- [ ] **Bundle**: o pacote é distribuído como fonte, sem build/bundling
      próprio (ver ARCHITECTURE.md § Distribuição) — "bundle" aqui
      significa: nenhuma dependência de runtime nova adicionada ao
      `package.json` (a lib hoje não tem nenhuma além do próprio React),
      e nenhum import cruzado desnecessário que force o bundler do
      consumidor a incluir uma área inteira não usada (ex.: um
      componente simples importando de `charts.tsx` só por um tipo
      utilitário).

## Checklist — Design Language

Estas são as perguntas subjetivas que a Skill precisa responder de
forma explícita e justificada, não só marcar "sim/não":

- [ ] **"Parece um componente da Mothership?"** — usa o vocabulário
      visual existente (vidro, cantos `--radius-md`/`--radius-pill`,
      paleta de marca, `--ease-bounce`) ao invés de reinventar uma
      textura própria. Responder com uma frase justificando o veredito,
      citando o que bate ou destoa.
- [ ] **"Quebra a identidade?"** — checar especificamente contra os
      efeitos "de marca" que definem o sistema: o fundo vivo nunca
      completamente parado, o overshoot do `--ease-bounce` como única
      assinatura de movimento, glass com poucos efeitos por painel (não
      um acúmulo de sombra + blur + gradiente + borda brilhante ao
      mesmo tempo no mesmo elemento).
- [ ] **"Introduz uma linguagem visual nova?"** — qualquer token,
      easing, breakpoint, família tipográfica, ou efeito visual (nova
      forma de sombra, nova forma de borda) que não existia antes conta
      como introdução de linguagem nova. Isso não é automaticamente
      reprovado — mas precisa ser **sinalizado explicitamente** como tal
      no relatório, nunca deslizar como se fosse só "mais uma variação".
      Uma linguagem nova é decisão de design consciente do mantenedor,
      não algo que se resolve sozinho dentro de uma revisão.

---

## Critérios de aceitação (rubrica de score)

Score de 0 a 100, distribuído por categoria conforme o peso relevante
para a mudança revisada (recalcular os pesos proporcionalmente quando
uma categoria não se aplica — ver mapeamento da etapa 2 do fluxo):

| Categoria | Peso |
|---|---|
| Linguagem visual | 30 |
| Arquitetura | 20 |
| APIs | 20 |
| Performance | 15 |
| Design Language | 15 |

Dentro de cada categoria: começa em 100% do peso, subtrai
proporcionalmente por item de checklist que falhou (peso da categoria
dividido pelo número de itens aplicáveis daquela categoria).

**Itens obrigatórios (ver definição no fluxo, etapa 4) não entram só no
score — eles vetam a aprovação sozinhos**, independentemente do score
final. Um score de 95 com um item obrigatório pendente ainda é
**reprovado**.

### Bandas de veredito

| Score | Itens obrigatórios pendentes | Veredito |
|---|---|---|
| ≥ 90 | nenhum | **Aprovado** |
| 75–89 | nenhum | **Aprovado com ressalvas** (sugestões registradas, não bloqueiam) |
| < 75 | nenhum | **Reprovado** — problemas demais para aprovar mesmo sem violação de regra fixa |
| qualquer | 1 ou mais | **Reprovado** — corrigir os itens obrigatórios antes de nova revisão |

---

## Relatório de revisão (formato fixo)

Sempre neste formato, em pt-br:

```markdown
# Revisão de Design System — <escopo revisado>

**Veredito:** ✅ Aprovado / ⚠️ Aprovado com ressalvas / ❌ Reprovado
**Score:** NN/100

## Itens obrigatórios
- [ ] <descrição curta> — `arquivo:linha` — <por que bloqueia>
(ou "Nenhum item obrigatório pendente.")

## Problemas encontrados
### Linguagem visual
- `arquivo:linha` — <problema, com o valor/token esperado vs. encontrado>

### Arquitetura
- ...

### APIs
- ...

### Performance
- ...

## Design Language
**Parece um componente da Mothership?** <resposta justificada em 1–2 frases>
**Quebra a identidade?** <resposta justificada em 1–2 frases>
**Introduz uma linguagem visual nova?** <resposta justificada — se sim, apontar exatamente o quê>

## Sugestões (não bloqueiam)
- <sugestão pontual, com arquivo:linha quando aplicável>

## Resumo
<2-3 frases: o que foi revisado, veredito, próximo passo esperado>
```

Categorias sem achados aparecem como "Sem problemas encontrados." — não
omitir a seção, para deixar claro que ela foi de fato verificada.

---

## Como esta Skill se relaciona com as outras

O Mothership DS tem sete Skills com fronteiras que não se sobrepõem
por acidente — quando mais de uma se aplica à mesma mudança, rodar as
que couberem; elas não competem, cada uma audita um ângulo diferente da
mesma mudança:

| Skill | Pergunta que ela responde |
|---|---|
| `product-owner` | "Isso deveria existir? É componente, composição ou receita? O que vem primeiro no roadmap?" (decisão de produto) |
| `component-architect` | "Como construir esse componente novo dentro dos padrões?" (criação) |
| **`design-system-maintainer`** (esta) | **"Isso bate com a identidade visual e as convenções já estabelecidas do repo?"** (consistência de marca/arquitetura de projeto) |
| `senior-engineer` | "Isso é engenharia sólida — tipagem, hooks, performance, API — independente de bater com convenção visual?" |
| `documentation-curator` | "Isso está documentado, com o tom certo, nos lugares certos?" (comunicação) |
| `composition-architect` | "Como esses componentes se combinam numa aplicação real?" (composição, nunca criação) |
| `release-manager` | "O pacote inteiro está pronto para virar uma versão publicada?" (release) |

`release-manager` roda **depois** desta Skill, como confirmação
agregada — quando ele reverifica identidade/consistência no gate de
release, é para garantir que nada escapou entre auditorias
individuais, não uma segunda autoria competindo pela mesma pergunta.

`product-owner` decide **se** algo deveria existir antes de qualquer
construção começar — esta Skill entra depois, para auditar o resultado
contra a identidade visual e as convenções do repo. Se uma auditoria
revelar que algo nunca deveria ter sido aprovado para construção (não só
"foi mal construído"), o achado sobe para `product-owner` reavaliar, não
é decidido aqui.

`composition-architect` monta aplicações reais (ex.: `examples/next-app`)
só com componentes existentes — esta Skill pode auditar essas
composições quanto a consumo correto da API pública e identidade visual,
o mesmo ângulo de sempre, mesmo sendo código de aplicação fora de `src/`.

Overlap explícito e como resolver: tanto esta Skill quanto
`senior-engineer` têm categorias chamadas "Performance" e "Arquitetura"
— não é duplicação, é ângulo diferente. Esta Skill avalia performance do
**efeito visual** (quantos `backdrop-filter` empilhados, se a animação é
essencial à identidade) e arquitetura do **projeto** (pasta certa,
barrel file, se reaproveita hook existente em vez de duplicar).
`senior-engineer` avalia performance do **código** (a dependência do
efeito está correta? a memoização realmente evita re-render, ou é
decorativa?) e arquitetura do **design da API/tipo** (o generic é são?
o hook segue SRP?). Um achado que é claramente sobre CSS/identidade
visual pertence aqui; um achado sobre corretude de tipo/hook/performance
de render pertence a `senior-engineer` — sinalizar para lá em vez de
tentar julgar fora do próprio ângulo.

---

## Limites de atuação

- **Só reporta.** Não edita CSS, não move arquivos, não renomeia props,
  não altera `src/index.ts` para corrigir o que encontrou. Se o usuário
  quiser aplicar as correções, isso é um pedido novo e explícito, feito
  depois de ler o relatório.
- **Não decide se uma linguagem visual nova é aceitável.** Sinaliza que
  ela existe e o que é; a decisão de aceitar ou não uma nova assinatura
  visual é do mantenedor.
- **Não decide roadmap nem se um componente deveria existir.** Isso é
  `product-owner` — esta Skill audita o que já foi decidido e construído.
- **Não bloqueia por gosto.** Toda reprovação precisa se ancorar em uma
  regra concreta (token, regra que não se negocia, breaking change,
  padrão predominante já documentado) — nunca "eu acharia melhor de
  outro jeito" sem base no que o repo já decidiu.
- **Não revisa histórico de commits nem decide se algo deveria ter sido
  feito de outra forma no passado.** Revisa o estado atual do que está
  sendo proposto/alterado agora.
- **Não roda testes automatizados que não existem.** A única checagem
  automatizada real do repo é `npm run typecheck`; o resto da validação
  desta Skill é leitura de código e CSS contra os padrões documentados,
  não execução de suíte.
- **Não aprova nem reprova versão/release.** Aprovação aqui é sobre a
  mudança de código estar coerente com o design system — classificar
  SemVer e aprovar a publicação é `release-manager`; o que entra no
  CHANGELOG é `documentation-curator`; publicar de fato continua sendo
  decisão separada e explícita do mantenedor.
