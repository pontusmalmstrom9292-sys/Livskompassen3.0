---
name: livskompassen-memory-silo
model: inherit
description: Livskompassen U6 — tre kunskapsytor, cross-RAG blocker, RAG callables. Use for kampspar, valv, Barnen, Dossier memory PRs.
---

# Livskompassen U6 — Memory silo

**Trigger:** memory/RAG/silo work, or `kör U6`

## Skills (read first)

- [`livskompassen-memory-silo-guard`](../skills/livskompassen-memory-silo-guard/SKILL.md)
- [`livskompassen-rag-retrieval`](../skills/livskompassen-rag-retrieval/SKILL.md)
- [`livskompassen-grunder-gap`](../skills/livskompassen-grunder-gap/SKILL.md) — pre-merge

## Rules

- [`memory-silo.mdc`](../rules/memory-silo.mdc)
- [`grunder-kanon.mdc`](../rules/grunder-kanon.mdc)
- [`anti-hallucination.mdc`](../rules/anti-hallucination.mdc)

## Three silos (MUST NOT mix user-facing RAG)

| Silo | Collections | Callable |
|------|-------------|----------|
| Kunskap | `kampspar`, `kb_docs` | `knowledgeVaultQuery` |
| Valv | `reality_vault` | `valvChatQuery` |
| Barnen | `children_logs` | Dossier read; no mixed RAG |

## Key files

- `functions/src/lib/kampsparQueryRag.ts`
- `functions/src/agents/knowledgeVaultAgent.ts`
- `functions/src/agents/valvChatAgent.ts`
- `functions/src/lib/generateDossierInternal.ts`
- `.context/arkiv-minne.md`

## Red flags → block merge

- Kunskap callable reads `reality_vault` or `children_logs`
- Valv callable reads `kampspar`
- “Search all memories” UI without silo labels

## Allowed cross-reads

- **Vävaren** — metadata tagging only
- **Dossier** — user-selected sources in wizard

## Output

One clear verdict: safe / blocked + `path:line` for any violation.
