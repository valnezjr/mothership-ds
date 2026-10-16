# Spec: identidade v1.9 do Mothership DS

Status: ready-for-agent
Criado: 2026-10-16 · Origem: grilling com o Valnez (sessão em `~/`, 2026-10-16). Par no Shell: `~/dotfiles/.scratch/identidade-v1.9/spec.md`.

## Problem Statement

Glassmorphism com fundo de aurora é a estética de base do DS, e sozinha ela lê como genérica (tendência de 2021–22). O que é só do Mothership (paleta tirada do gradiente da logo, bounce, mascote, tema creme) aparece pouco ou sem regra. O Shell herda do DS, então qualquer reforço de identidade precisa nascer aqui.

## Solution

Ordem: **identidade → qualidade → cobertura**, depois de lançar a v1.8 com o que já está pronto.

1. **v1.8:** lança o que está em "Não lançado", limpa a documentação desatualizada, e `Select`/`Combobox` passam a usar o portal do `Popover`.
2. **Gradiente da logo = "ativo/selecionado"**, e só isso. Token `--gradient-active` por tema (paradas `-600`/`-700` no claro, `-500` no escuro/Darker). Estático no DS. O anel de foco continua sólido (`--color-accent-text`). Usos: indicador das `Tabs`, item atual de `Navbar`/`Sidebar`/`Dock`, ponto ativo do `StepIndicator`, card selecionado, `Switch` ligado.
3. **Vocabulário de movimento**, com tokens `--motion-<gesto>-ease`/`-duration`:
   | Gesto | Curva | Duração | Uso |
   |---|---|---|---|
   | assentar | `--ease-bounce` | 0.3s | entrada de modal, toast, popover, janela |
   | recolher | ease-in, sem overshoot | 0.15s | saída de qualquer coisa |
   | pulso | `--ease-bounce` | 0.2s | confirmação de clique |
   | deriva | linear, contínuo | — | fundo vivo, giro de borda |
   Todos os componentes existentes migram: assentar ao entrar, recolher ao sair.
4. **Mascote** (`Mascote`, prop `expressao`: `piscando`, `procurando`, `confuso`, `pensando`; `dormindo` saiu, D6), derivada do olho de `assets/logo.svg`. Aparece em transições e estados vazios, nunca em elemento que fica sempre visível. Esboço em SVG pelo agente, refinado pelo Valnez no Figma.
5. **Peso de exibição:** `--font-weight-display: 600` e `--text-display: 48px`, só para números grandes e títulos de herói.
6. **Tema claro como assinatura:** toda mudança é validada no claro com o mesmo cuidado do escuro; o escuro continua padrão.
7. **Qualidade:** auditoria (`axe-core`, contraste) do que a identidade mexeu.
8. **Cobertura:** `EmptyState` (mascote por padrão, aceita qualquer ilustração), `Prose`, `Tooltip` como componente (mesmo renderizador do `TooltipProvider`; o `data-tip` continua). As composições de marquee saem do roadmap. `Timeline`/`Toolbar`/`FilterBar` ficam para depois.

Versão: **v1.9** (sem quebra de API). Toda mudança respeita `prefers-reduced-motion`.

## Fora do escopo

- Trocar a fonte (Outfit fica).
- `Timeline`, `Toolbar`, `FilterBar`, `Meter` absoluto.
