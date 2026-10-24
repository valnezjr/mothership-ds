# 05: Styleguide, exemplo e documentação

Blocked by: 03, 04, 08, 10
Status: review

**What to build:** styleguide e `examples/next-app` na API nova (`ThemeMenu` no cabeçalho com os oito pares), story de tema mostrando a grade 4×2, `docs/tokens.md`/`docs/componentes.md`/README atualizados com os nomes Mothership Glass/Cream/Paperpen/Flat, a receita de carregar as fontes do Paperpen só quando o tema é usado, guia de migração v1 → v2 (valores antigos → pares novos, `toggle` → `toggleMode`, classes → atributos) e CHANGELOG § 2.0.0.

- [x] Nenhuma menção a "claro"/"Darker" como nome de tema sobrando nas docs públicas
- [x] Guia de migração com tabela de equivalência
- [x] CLAUDE.md: seção v2.0.0 e regras atualizadas

## Notas

- Grade 4×2 na story "Temas" (Fundações): linha = tema, coluna = modo, um `<iframe>` por par com os atributos no próprio `<html>` (os tokens do Glass base moram no `:root`, então um par não se aplica a um trecho da página). Uma coluna abaixo de ~576px.
- Fontes do Paperpen: receita em `docs/tokens.md` § Fontes do Paperpen (link sempre, o arquivo só baixa com o tema aplicado; ou `PaperpenFonts` com `useTheme` para nem pedir o CSS). Exemplo usa o link.
- Guia em `docs/migracao-v2.md`; CHANGELOG § 2.0.0 absorve o "Não lançado". Data fica para o ticket 06.
- De passagem: `src/reset.css` sem o Flat e com o Cream base em `#ffffff` (antes do off-white da v1.8) — corrigido.
- Docs do "Seguir o sistema" do `ThemeMenu` (decisão do ticket 03) incluídas; o código pendente dele entra no mesmo commit.
- `revisao-spec` (2026-10-24): corrigidos tabela quebrada e contagem de tokens em `docs/tokens.md`, fallback das fontes, grade que não alinhava tema × modo, tipos e título do `ThemeFrame`. Ficam abertos, sem mudar comportamento: os smells do ticket 03 (regra do ícone em `modeIcon` + `tokens.css` + docs, tema+modo sem tipo próprio, `["base", "dark"]` literal no menu e na story, nome `lerSalvo`, rótulos dos temas repetidos entre `THEME_LABELS` e a story). Tratar num refactor à parte antes do 06 ou junto dele.
- Pedido do Valnez na validação (2026-10-24): textos das stories revistos para os quatro temas. Tipografia, raios e efeitos das Fundações passam a ler os valores do par atual na tela (tamanho/peso/família, `--radius-*`, `--blur-*`, `--shadow-md`); Cores ganha Campo e Ativo e explica o accent por tema; textos de Alert, Loader, Navbar, Botões, Card, Campos, Hero, StatTile, Prose, PricingCard, Bento e Skeleton sem assumir vidro, ciano ou dois temas.

