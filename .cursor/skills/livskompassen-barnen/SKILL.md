---
name: livskompassen-barnen
description: Barnen — parallel parenting, BBIC logs, children_logs silo. Use for /familjen, childrenLogsQuery.
---

# Barnen skill (U13)

## When to use

- BBIC-style observation logging
- Editing `src/modules/barnens_livsloggar/`
- `childrenLogsQuery` RAG chat in Familjen
- Dossier child-related export

## Silo rules (critical)

- **MUST NOT** read `reality_vault` or `kampspar` in Barnen RAG
- **MUST NOT** route Barnen queries via `valvChatQuery`
- Evidence about children in valv → separate silo, user merges mentally

## User-facing output

1. Neutral observation template (who, what, when, behavior, context)
2. One parenting micro-step ("trygga hamnen")
3. Ex conflict → U9 Safe Harbor, not parenting coach tone

## Runtime

| Piece | Path |
|-------|------|
| Frontend | `src/modules/barnens_livsloggar/` |
| RAG | `childrenLogsAgent.ts`, `childrenLogsQuery` |
| Prompt | `MONSTER_ARKIVARIEN_BARNEN_SYSTEM_PROMPT` |
| Guard | `barnenModuleRouteGuard.ts` |

## MUST

- WORM append-only `children_logs`
- Child-first, low conflict narrative in logs

## MUST NOT

- Grey Rock scripts here (Hamn)
- Cross-silo RAG
- Gamification (G42 avvisat)

## Related

- Audit: `kör grunder U5` (readonly)
- Agent: `.cursor/agents/livskompassen-barnen` (U13)
- SPEC: `docs/specs/modules/Barnen-SPEC.md`
