# 05: Migrar os componentes para os gestos

Blocked by: 04
Status: done

**What to build:** todo componente com entrada/saída (Modal, StepModal, toast, histórico de alertas, Drawer, Popover, DropdownMenu, Select/Combobox, Tooltip, menu da Navbar, Dock, Accordion, Gallery) usa os tokens de gesto: entra com assentar, sai com recolher. Microinterações de clique usam pulso. Nenhuma transição solta sobra fora dos tokens.

- [x] Auditoria listada no ticket (componente → gesto antes/depois)
- [x] Nenhuma saída com overshoot
- [x] `prefers-reduced-motion` respeitado em todos
- [x] Conferido no styleguide nos três temas (validado pelo Valnez em 2026-10-16; Playwright conferiu durações/curvas e redução de movimento)

**Decidido (D1, `docs/decisoes.md`):** o par `--transition-spatial`/`--ease-spatial` fica como exceção para transformação em cena. Expandir/recolher do Dock, câmera e legenda do Grafo3D **não** migram. O `Drawer` (hoje `0.35s var(--ease-bounce)` na entrada e na saída) migra: assentar ao abrir, recolher ao fechar.

## Auditoria (componente → gesto antes/depois)

A = assentar (`0.3s --ease-bounce`), R = recolher (`0.15s`, ease-in sem overshoot), P = pulso (`0.2s --ease-bounce`).

| Componente | Entrada antes → depois | Saída antes → depois |
|---|---|---|
| Modal / StepModal (véu + painel) | `0.25s ease` / `0.4s bounce` → A | `0.2s ease` → R (timer JS via `recolherMs()`) |
| Troca de etapa do StepModal | `0.35s bounce` → A | some na hora (sem mudança) |
| Toast | `0.35s bounce` → A | `0.3s ease` (timer 320ms) → R |
| Histórico de alertas | `0.25s ease` → A | sumia na hora → R (`usePresence`) |
| Drawer (painel + véu) | `0.35s bounce` / `0.3s` → A | `0.35s bounce` (overshoot) / `0.3s` → R |
| Menu da Navbar | `0.35s bounce` + `0.3s` opacity → A | mesmo (overshoot) → R |
| Popover | `0.15s bounce` → A | sumia na hora → R (`usePresence`) |
| DropdownMenu | `0.15s bounce` → A | sumia na hora → R (`usePresence`) |
| Select / Combobox (lista) | `0.15s bounce` → A | sumia na hora → R (`usePresence`) |
| Tooltip | `0.15s` opacity → A | `0.15s` opacity → R |
| Accordion (corpo) | `0.4s bounce` → A | `0.4s bounce` (overshoot) → R |
| Gallery (item) | `0.35s bounce` → A | sumia na hora → R, a leva toda antes da nova montar (D2) |
| Dock mobile | usa o Drawer → A | usa o Drawer → R |
| Dock expandir/recolher | par espacial (D1, não migra) | par espacial |

Cliques → P: seta do Accordion (`0.4s bounce`), hambúrguer ⇄ X (Navbar, Sidebar, Dock; antes `0.3s bounce`), polegar do ThemeSwitch (`0.2s ease`) e do Switch (`0.2s bounce`), marca do Checkbox/Radio (`0.1s bounce`), seta do Select (`0.2s bounce`), indicador das Tabs (`0.3s bounce`), bullets do Carousel e pontos do StepIndicator (`0.3s bounce`).

Deriva (curva `--motion-deriva-ease`): Marquee, onda do Loader.

Resolvido no D2: contorno reativo (`.ms-hover-edge`, item da Gallery, bolinhas e fatias dos gráficos; antes `0.3s`/`0.25s bounce` nos dois sentidos) → A ao crescer, R ao voltar. Trilho do Carousel (`0.5s bounce`) → par espacial, sem animação sob redução de movimento.

**Fora, de propósito** (não são entrada, saída nem clique):
- Valores de gráfico (barras `0.6s`, anel `0.8s`) e nível do Loader (`0.7s`): dado mudando, não gesto.
- Splash (coreografia própria), piscada do olho, flutuação do dirigível, Skeleton (`ease-in-out`, pulso de carregamento, não clique), barra de tempo do toast (contagem regressiva linear).
- Cor/fundo em hover seguem em `--transition-fast/base/slow`.

**Aprovado como está:** a etapa que sai do StepModal segue instantânea (a nova entra por cima com A).
