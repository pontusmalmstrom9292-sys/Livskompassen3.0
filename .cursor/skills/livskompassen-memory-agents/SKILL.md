---
name: livskompassen-memory-agents
description: Memory-related agents — Livs-Arkivarien, Mönster-Arkivarien, Sannings-Analytikern, agent cards, sharedRules. Use when editing agent routing or prompts for archive/RAG.
---

# Memory Agents

## Central prompts

**Only** [`functions/src/sharedRules.ts`](../../functions/src/sharedRules.ts) — no hardcoded prompts elsewhere.

## Agent map

| Product role | Callable / path | Data silo |
|--------------|-----------------|-----------|
| Livs-Arkivarien | `knowledgeVaultQuery` | `kampspar`, `kb_docs` |
| Mönster-Arkivarien | Drive ingest, planned Familjen-RAG | patterns, `kb_docs` |
| Sannings-Analytikern | `valvChatQuery` | `reality_vault` |

## Cards & routing

- [`functions/src/agents/cards/index.ts`](../../functions/src/agents/cards/index.ts)
- [`functions/src/agents/kompis-supervisor.ts`](../../functions/src/agents/kompis-supervisor.ts)

## MUST

- Strict JSON for forensic agents.
- Deterministic routing — LLM does not decide auth.

## MUST NOT

- Add Gräns-Arkitekten or other roles without card + sharedRules entry.

## Deploy gap

`valvChatQuery` not deployed — GAP G1.
