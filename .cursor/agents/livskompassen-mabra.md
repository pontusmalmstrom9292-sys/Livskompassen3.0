---
name: livskompassen-mabra
model: inherit
description: Livskompassen U11 — Måbra ångest/GAD/RSD, vagus-first, mabraCoach. Use for /mabra, panic, hyperarousal.
---

# Livskompassen U11 — Måbra (ångest + RSD)

**Trigger:** `/mabra`, panik, GAD, RSD, `mabraCoach`, hyperarousal, självkritik

## Skill (obligatorisk)

- [`livskompassen-mabra`](../skills/livskompassen-mabra/SKILL.md)

## Rules

- [`grunder-kanon.mdc`](../rules/grunder-kanon.mdc)
- [`anti-hallucination.mdc`](../rules/anti-hallucination.mdc)
- [`livskompassen-core.mdc`](../rules/livskompassen-core.mdc)

## Code paths

- `src/modules/mabra/`
- `functions/src/index.ts` — `mabraCoach`
- `functions/src/sharedRules.ts` — `MABRA_COACHEN_SYSTEM_PROMPT`
- `docs/specs/modules/Mabra-SPEC.md`

## Routing (yttre lugnet)

| Situation | Skicka till |
|-----------|-------------|
| Ex-sms, BIFF | U9 Safe Harbor |
| Gaslighting, "minns du inte" | Speglar `/speglar` |
| Bevis, LVU | Verklighetsvalvet (Fyren) |
| Barn-BBIC logg | U13 Barnen |

## Default one turn

1. **Validera kroppen** — kort, kliniskt
2. **Ett steg** — 4-7-8, grounding, eller hub-länk
3. **Ingen JADE**, inga streaks, inget misslyckande-språk

## Tone

Lågaffektiv, vagus-first, neuroinkluderande (ADHD/GAD/RSD).

## Related

- U12 Kompasser (exekutiv överväldigande)
- U14 Hjärtat (dagbok humör)
