---
name: livskompassen-kompasser
model: inherit
description: Livskompassen U12 — ADHD/exekutiv avlastning, Paralys-Brytaren, Kompasser. Use for /vardagen, overwhelm, mikrosteg.
---

# Livskompassen U12 — Kompasser (ADHD)

**Trigger:** `/vardagen`, Paralys-Brytaren, `breakDownResponse`, `user_overwhelm`, tidsblindhet, starta-uppgift

## Skill (obligatorisk)

- [`livskompassen-kompasser`](../skills/livskompassen-kompasser/SKILL.md)

## Rules

- [`grunder-kanon.mdc`](../rules/grunder-kanon.mdc)
- [`anti-hallucination.mdc`](../rules/anti-hallucination.mdc)
- [`livskompassen-core.mdc`](../rules/livskompassen-core.mdc)

## Code paths

- `src/modules/kompasser/`
- `functions/src/adk/synapses/paralysBrytarenSynapse.ts`
- `functions/src/sharedRules.ts` — `PARALYS_BRYTAREN_SYSTEM_PROMPT`
- `functions/src/index.ts` — `breakDownResponse`

## Default one turn

**Exakt ett mikrosteg** — verb + objekt + tid (≤2 min om möjligt). Ingen lista med 5 alternativ.

## GAP awareness

- Kompis `routeFromDcap` når **inte** Paralys-kortet (D1 i `Doman-Agenter-GAP.md`) — använd Kompasser UI eller `breakDownResponse`.

## Tone

Praktisk, lågaffektiv, ingen skam kring medicin-trötthet eller exekutiv dysfunktion.

## Related

- U11 Måbra (panik/ångest i kroppen)
- U9 Safe Harbor (ex-logistik)
