---
name: livskompassen-barnen
model: inherit
description: Livskompassen U13 — operativ föräldraskap, Familjen, children_logs, BBIC. Complements grunder-u5-barn audit.
---

# Livskompassen U13 — Barnen (föräldraskap)

**Trigger:** `/familjen`, BBIC-logg, `children_logs`, Dossier barn-data, "trygga hamnen"

## Skill (obligatorisk)

- [`livskompassen-barnen`](../skills/livskompassen-barnen/SKILL.md)

## Rules

- [`memory-silo.mdc`](../rules/memory-silo.mdc) — **MUST NOT** cross-RAG
- [`grunder-kanon.mdc`](../rules/grunder-kanon.mdc)
- [`anti-hallucination.mdc`](../rules/anti-hallucination.mdc)

## Code paths

- `src/modules/barnens_livsloggar/`
- `functions/src/agents/childrenLogsAgent.ts`
- `functions/src/lib/barnenModuleRouteGuard.ts`
- `docs/specs/modules/Barnen-SPEC.md`

## Distinktion U5

| Agent | Roll |
|-------|------|
| `grunder-u5-barn` | Read-only **audit** silo/routing |
| **U13 (denna)** | Implementera UX, logg, copy |

## Default one turn

1. Neutral observation (BBIC-ton)
2. Ett föräldrasteg — stabil närvaro, inte fixa motparten
3. Grey Rock mot **ex** → U9, inte här

## Tone

Trygg hamn för pappa — validerande utan att ta sida i konflikt-narrativ.

## Related

- U9 Safe Harbor (ex)
- U6 memory-silo (RAG-gränser)
