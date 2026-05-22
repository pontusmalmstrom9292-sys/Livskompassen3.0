---
name: livskompassen-memory-silo-guard
description: Enforces three knowledge silos — blocks cross-RAG between Kunskap, Valv-Chat, and Barnen. Use in any PR touching RAG, queries, or Firestore reads for AI.
---

# Memory Silo Guard

## Three silos (MUST NOT mix RAG)

| Silo | Collections | Callable |
|------|-------------|----------|
| Kunskap | `kampspar`, `kb_docs` | `knowledgeVaultQuery` |
| Valv | `reality_vault` | `valvChatQuery` |
| Barnen | `children_logs` | `childrenLogsQuery` (G8) |

## Red flags (block merge)

- `knowledgeVaultQuery` reading `reality_vault` or `children_logs`
- `valvChatQuery` reading `kampspar` or `children_logs`
- Single "search everything" UI without silo labels
- Shared vector namespace mixing bevis + livsminne without isolation

## Allowed cross-reads (not user RAG)

- **Vävaren** (`kampsparRag.ts`): journal+valv+kampspar for metadata tagging only
- **Dossier**: explicit user-selected sources in wizard
- **Speglar**: client token-match on valv — Zero Footprint, not stored RAG

## References

- [`.context/arkitektur-beslut.md`](../../.context/arkitektur-beslut.md) §1.5
- [`.context/arkiv-minne.md`](../../.context/arkiv-minne.md)

When in doubt, escalate to `livskompassen-arkiv-master` skill.
