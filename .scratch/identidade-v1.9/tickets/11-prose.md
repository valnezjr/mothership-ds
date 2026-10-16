# 11: Prose

Blocked by: 07
Status: done

**What to build:** `Prose` para HTML já convertido de markdown (títulos, parágrafos, listas, links, código, citações), com o ritmo vertical e a tipografia do DS. Recebe `children` ou `html`. Não converte nem sanitiza.

- [x] Exportado, documentado, com story
- [x] Substitui o CSS provisório do Ambiente (`src/telas/prosa.css`) sem diferença visual relevante
  - Ambiente em `78f87a1` (commit `20265c8` lá): `Prosa` renderiza `<Prose className="prosa" html>`, `prosa.css` ficou só com o `h1` escondido. Diferenças intencionais: link em `--color-accent-text` (AA), última peça sem margem embaixo, código em `--font-mono`. Achado na troca: a cor do texto precisava ficar fixa (`78f87a1`), senão herdava o muted da prévia de rotina.
