---
name: livskompassen-anti-hallucination
description: Evidence protocol — PASS needs file:line; label VISION/SPEC/GAP. Use before claiming features exist, security is live, or Grunder slides are shipped.
---

# Anti-hallucination skill

## When to use

- “Is X implemented?” / pre-merge review / architecture answers
- Any PASS/FAIL on security, silos, DCAP, Genkit, HITL

## Rule

Read [`.cursor/rules/anti-hallucination.mdc`](../../rules/anti-hallucination.mdc) and apply on every claim.

## Claim labels

| Label | Evidence |
|-------|----------|
| PASS (runtime) | `path:line` citation + behavior matches |
| DELVIS | Layer 1 cites + explicit GAP list |
| SPEC | SPEC / `.context` only |
| VISION | `INVENTAR.md` vision-only |
| AVVISAT | G05, G42 |
| GAP | `Arkiv-GAP-REGISTER.md` or missing code |

## Forbidden claims (common hallucinations)

- Genkit is the production supervisor (runtime: ADK + `kompis-supervisor.ts`)
- Cross-silo “search everything” RAG
- Gamification / plant progress (G05, G42)
- Slides = shipped features

## If uncertain

Grep → read file → if no match output **GAP**, do not invent paths or GCP names. Use [`docs/GCP-INVENTORY-LATEST.md`](../../../docs/GCP-INVENTORY-LATEST.md) for infra.

## Pre-merge

Delegate deep check to agent `livskompassen-kanon-vakt` or skill `livskompassen-grunder-gap`.
