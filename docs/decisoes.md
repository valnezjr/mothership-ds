# Decisões

Registro das decisões do Mothership DS. Uma seção por decisão, a mais
nova no fim.

## D1 — 2026-10-16 — Par espacial fica fora dos gestos de movimento

**Pergunta.** A v1.9 criou quatro gestos de movimento (assentar,
recolher, pulso, deriva), e a spec diz que todo componente migra para
eles. Só que o par `--transition-spatial`/`--ease-spatial` (0.45s, sem
overshoot), criado na v1.8, não é nenhum dos quatro. Ele é absorvido
pelos gestos, vira um quinto gesto ou fica como exceção?

**Escolha.** Exceção documentada, com um critério: entrou ou saiu de
cena, é gesto; já estava na tela e se transformou, é o par espacial.
Nenhum token muda de nome.

**Por quê.** Nenhum uso do par é entrada ou saída: o `Dock` expandindo
e recolhendo a coluna, a câmera do `Grafo3D` e a legenda escurecendo ao
filtrar são objetos grandes que já estão em cena e mudam de forma.
Absorver em assentar poria overshoot neles, o que já foi testado e
descartado na v1.8 (lê como solavanco). Um quinto gesto ("transformar")
seria coerente, mas muda o vocabulário de quatro que a spec fixou e
renomearia tokens que o `cena.ts` lê pelo nome, sem ganho prático.

**Verificado.** Busca por `--transition-spatial`/`--ease-spatial` em
`src/`: só `.ms-dock*`, a legenda do `Grafo3D` e `src/3d/cena.ts`. O
`Drawer` não usa o par (entra e sai com `0.35s var(--ease-bounce)`),
então migra para assentar/recolher no ticket 05.
