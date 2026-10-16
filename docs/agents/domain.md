# Domain Docs (layout Mothership)

How the engineering skills consume this repo's domain documentation. This repo keeps its own format: follow it, don't create `GLOSSARY.md` or `docs/adr/`.

## Before exploring, read these

- **Decisions:** `docs/decisoes.md` (created with the first decision), one file, each decision a `## D<N> — <AAAA-MM-DD> — <título>` section, newest at the end. Read the ones that touch the area you're working in (search by keyword; the file is long, the newest are at the end).
- **Glossary:** `docs/glossario.md` if it exists.
- **Repo rules:** `CLAUDE.md` at the root (and in subprojects).

If the glossary doesn't exist, proceed silently; `/domain-modeling` creates it in the repo's format when the first term is resolved.

## Writing

- A new decision is appended at the end of the decisions file with the next number, in Portuguese, in the same shape as the existing ones (what was asked, the choice, why, what was verified).
- Also add a line to the changelog in `CLAUDE.md` ("Não lançado") when the decision changes something a consumer of the package sees.

## Use the glossary's vocabulary

When your output names a domain concept, use the term as the glossary defines it. If it isn't there yet, either you're inventing language (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag decision conflicts

If your output contradicts an existing decision, say so explicitly instead of silently overriding:

> _Contradiz a D47 (sem variante para o ultrawide), mas vale reabrir porque…_
