---
name: livskompassen-rag-retrieval
description: Kunskapsvalvet RAG — kampsparQueryRag, knowledgeVaultQuery, citations JSON. Use when editing retrieval, not Vector index provisioning.
---

# RAG Retrieval (Kunskap)

## Scope

- [`functions/src/lib/kampsparQueryRag.ts`](../../functions/src/lib/kampsparQueryRag.ts)
- [`functions/src/agents/knowledgeVaultAgent.ts`](../../functions/src/agents/knowledgeVaultAgent.ts)
- Callable: `knowledgeVaultQuery`

## MUST

- Retrieve only from `kampspar` + `kb_docs` for user-facing Kunskap chat.
- Return JSON `{ answer, citations[] }` grounded in fetched chunks.
- Keep prompts in `functions/src/sharedRules.ts` only.

## MUST NOT

- Query `reality_vault` in Kunskap path.
- Use LLM output as authorization.

## Status (2026-05-21)

- Prod: **token-match** — smoke PASS
- ANN: stub until Vector endpoint wired (GAP G2)

## Acceptanskriterier

- Citations reference valid docIds from allowed collections.
- Empty retrieval → explicit "ingen träff" behaviour, no hallucinated sources.
