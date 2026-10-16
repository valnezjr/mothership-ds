# 05: Migrar os componentes para os gestos

Blocked by: 04
Status: ready-for-agent

**What to build:** todo componente com entrada/saída (Modal, StepModal, toast, histórico de alertas, Drawer, Popover, DropdownMenu, Select/Combobox, Tooltip, menu da Navbar, Dock, Accordion, Gallery) usa os tokens de gesto: entra com assentar, sai com recolher. Microinterações de clique usam pulso. Nenhuma transição solta sobra fora dos tokens.

- [ ] Auditoria listada no ticket (componente → gesto antes/depois)
- [ ] Nenhuma saída com overshoot
- [ ] `prefers-reduced-motion` respeitado em todos
- [ ] Conferido no styleguide nos três temas

**Decidido (D1, `docs/decisoes.md`):** o par `--transition-spatial`/`--ease-spatial` fica como exceção para transformação em cena. Expandir/recolher do Dock, câmera e legenda do Grafo3D **não** migram. O `Drawer` (hoje `0.35s var(--ease-bounce)` na entrada e na saída) migra: assentar ao abrir, recolher ao fechar.
