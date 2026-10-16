# 05: Migrar os componentes para os gestos

Blocked by: 04
Status: ready-for-agent

**What to build:** todo componente com entrada/saída (Modal, StepModal, toast, histórico de alertas, Drawer, Popover, DropdownMenu, Select/Combobox, Tooltip, menu da Navbar, Dock, Accordion, Gallery) usa os tokens de gesto: entra com assentar, sai com recolher. Microinterações de clique usam pulso. Nenhuma transição solta sobra fora dos tokens.

- [ ] Auditoria listada no ticket (componente → gesto antes/depois)
- [ ] Nenhuma saída com overshoot
- [ ] `prefers-reduced-motion` respeitado em todos
- [ ] Conferido no styleguide nos três temas

**Decidir antes de migrar:** o par `--transition-spatial`/`--ease-spatial` (gaveta, câmera do 3D, sem overshoot) não é um dos quatro gestos. Drawer, Dock e Grafo3D usam esse par — vira exceção documentada ou é absorvido por assentar/recolher? (Levantado na revisão do 04; ver TOKENS.md § Gestos.)
