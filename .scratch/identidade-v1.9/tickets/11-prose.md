# 11: Prose

Blocked by: 07
Status: review

**What to build:** `Prose` para HTML já convertido de markdown (títulos, parágrafos, listas, links, código, citações), com o ritmo vertical e a tipografia do DS. Recebe `children` ou `html`. Não converte nem sanitiza.

- [x] Exportado, documentado, com story
- [ ] Substitui o CSS provisório do Ambiente (`src/telas/prosa.css`) sem diferença visual relevante
  - Lado do DS pronto: comparado lado a lado com o `prosa.css` nos temas escuro e claro, títulos/parágrafos/listas/código batem. Diferenças intencionais: link em `--color-accent-text` (AA), última peça sem margem embaixo, código em `--font-mono`. A troca de fato fica no Ambiente, depois do push: subir o pin de `mothership-ds`, trocar `className="prosa"` por `<Prose html>` e manter só `.ms-prose h1 { display: none }` local.
