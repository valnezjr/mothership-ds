# Accessibility

Checklist e padrões de acessibilidade do Mothership DS — o que
verificar ao criar ou editar um componente. Não é um documento à
parte de "boas intenções": cada regra aqui já está implementada em
algum componente existente, citado como referência.

## Princípio geral

**Estado nunca é marcado só por cor.** Todo estado visual tem também
um atributo `aria-*` correspondente. Motivo: cor sozinha não chega a
leitores de tela e falha para daltonismo.

| Componente | Estado | Atributo |
|---|---|---|
| `Accordion` | item aberto/fechado | `aria-expanded` |
| `Navbar` (hambúrguer) | menu aberto/fechado | `aria-expanded` |
| `StepModal` / `Breadcrumbs` | etapa/item atual | `aria-current` |
| `ThemeSwitch` | ligado/desligado | `aria-checked` (é `role="switch"`, não checkbox nativo) |

Ao adicionar um componente com estado visual novo, pergunte: "que
`aria-*` marca isso?" antes de estilizar.

O mesmo princípio vale para conteúdo estático, não só estado
interativo: em `PricingCard`, um recurso não incluído no plano troca o
ícone de check por um traço (forma, não só cor) **e** risca o texto —
dois sinais redundantes, igual à validação de daltonismo das cores de
dado (ver [Cor](#cor)).

Ícones puramente decorativos (as aspas do `TestimonialCard`, os ícones
de check/traço acima) levam `aria-hidden="true"` — a informação já
está no texto ao lado, repeti-la para leitor de tela seria ruído. Já
um valor visual sem texto equivalente, como as estrelas de avaliação
do `TestimonialCard`, precisa do equivalente em algum lugar: o
container leva `role="img"` e `aria-label="N de 5 estrelas"`, e cada
estrela individual fica `aria-hidden`.

## Foco

- **Foco sempre visível.** Anel accent em `:focus-visible` — o anel
  padrão do navegador some sobre as superfícies de vidro (baixo
  contraste), então o sistema define o próprio. Um controle novo deve
  herdar esse anel sem CSS adicional; se não herdar, ele está fora do
  padrão dos outros controles (investigar antes de estilizar à parte).
- **`IconButton`**: `href` e `aria-label` são obrigatórios. Um `<a>`
  sem `href` não é focável; um botão só de ícone não tem nome
  acessível sem `aria-label`.

## Modal / StepModal

Contrato de foco de qualquer overlay modal no sistema:

1. Foco entra no diálogo ao abrir.
2. Tab circula **dentro** do diálogo (focus trap) — nunca escapa para
   o resto da página enquanto aberto.
3. Foco volta ao elemento que abriu o modal, ao fechar.
4. `title` vira o alvo de `aria-labelledby` do diálogo — o título é
   sempre associado programaticamente, não só visualmente.

Um componente novo que abre um overlay modal (não um popover leve)
deve replicar esse contrato, não reinventar.

## Toasts / região viva

O container de toasts fica **sempre presente no DOM**, mesmo vazio.
Motivo: leitores de tela só anunciam conteúdo inserido em containers
de região viva (`aria-live`) que **já existiam** antes da inserção —
criar o container junto com o toast faz o anúncio ser perdido.

## Movimento

Tudo que anima respeita `prefers-reduced-motion: reduce`:

- Fundo (`LivingBackground`): deriva e pulsação desligam.
- `Splash`: piscada do olho e flutuação do dirigível desligam.
- `Loader`: onda do preenchimento desliga.
- `Modal` / `Splash`: transições encurtadas.
- **Exceção deliberada**: o parallax do mouse no fundo **permanece**
  mesmo com `reduce` — é resposta direta a uma ação do usuário, não
  uma animação ambiente.

Componente novo com animação: testar com
`prefers-reduced-motion: reduce` ligado (DevTools → Rendering → Emulate
CSS media feature) antes de considerar pronto.

## Cor

Toda cor de **dado** (série de gráfico) nova precisa passar, validado
por script, separadamente em cada tema:

- separação sob daltonismo (protanopia/deuteranopia): ΔE ≥ 8
- distinção em visão normal: ΔE ≥ 15
- contraste contra a superfície do tema: ≥ 3:1

Detalhe de implementação em [TOKENS.md](TOKENS.md#cores-de-dados-gráficos).
Cores semânticas de sucesso/erro ficam reservadas para status e nunca
entram como cor de série.

## Checklist rápido para um componente novo

- [ ] Estado visual tem `aria-*` correspondente (não só cor).
- [ ] Focável via teclado, com o anel `:focus-visible` padrão visível.
- [ ] Se é overlay modal: focus trap + retorno de foco + `aria-labelledby`.
- [ ] Se é ícone sozinho como controle: `aria-label` obrigatório.
- [ ] Se anima: comportamento sob `prefers-reduced-motion: reduce` definido.
- [ ] Se introduz cor de dado nova: validada (ΔE CVD ≥ 8, ΔE ≥ 15, contraste ≥ 3:1).
- [ ] Testado em tela estreita (abaixo de 720px) e nos dois temas.
