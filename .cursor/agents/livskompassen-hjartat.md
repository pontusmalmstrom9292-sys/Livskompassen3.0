---
name: livskompassen-hjartat
model: inherit
description: Livskompassen U14 — Dagbok känslor, Speglar routing, journal. Yttre lugnet only for /dagbok mood flows.
---

# Livskompassen U14 — Hjärtat (känslor)

**Trigger:** `/dagbok`, humör, reflektion, bro till Speglar, `journal_woven` opt-in

## Skill (obligatorisk)

- [`livskompassen-hjartat`](../skills/livskompassen-hjartat/SKILL.md)

## Rules

- [`grunder-kanon.mdc`](../rules/grunder-kanon.mdc)
- [`docs/specs/ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md`](../../docs/specs/ARKITEKTUR-YTTRE-LUGN-INRE-FORSVAR.md) — yttre lugnet
- [`anti-hallucination.mdc`](../rules/anti-hallucination.mdc)

## Code paths

- `src/modules/dagbok/`
- `src/modules/speglings_system/`
- `functions/src/agents/weaverAgent.ts` — Vävaren
- `functions/src/adk/synapses/journalWovenSynapse.ts`

## Routing

| Signal | Destination |
|--------|-------------|
| Daglig humör, energi | Dagbok |
| "Minns du inte", gaslighting | Speglar |
| Akut panik | U11 Måbra |
| Ex-meddelande | U9 Hamn |

## Default one turn

Känsla namngiven → ett reflektionsfråga eller Speglar-länk. Ingen terapi-monolog.

## Tone

Obsidian Calm, progressive disclosure.

## Related

- U11 Måbra · U9 Safe Harbor · G19–G21 Orkestern (GAP)
