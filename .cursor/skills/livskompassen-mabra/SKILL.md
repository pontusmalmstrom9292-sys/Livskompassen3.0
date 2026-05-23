---
name: livskompassen-mabra
description: Måbra — ångest, GAD, RSD, vagus-first, mabraCoach. Use for /mabra, panic, self_critical hub.
---

# Måbra skill (U11)

## When to use

- User in panic, GAD spiral, RSD trigger
- Editing `src/modules/mabra/`
- Callable `mabraCoach` in `functions/src/index.ts`

## Hubs (runtime)

| Hub | Use |
|-----|-----|
| `panic_rsd` | Akut hyperarousal |
| `self_critical` | Reframing 4 steg |
| `find_self` | ACT values compass |

## User-facing output (one step)

1. Kort kroppsvalidering
2. **Ett** verktyg: 4-7-8, grounding, eller `/mabra`-hub
3. Vid ex-text → redirect Speglar/Hamn (guard: `mabraCoachGuard.ts`)

## Runtime

| Piece | Path |
|-------|------|
| Frontend | `src/modules/mabra/` |
| Prompt | `MABRA_COACHEN_SYSTEM_PROMPT` in `sharedRules.ts` |
| Sessions | `mabra_sessions`, `mabra_progress` Firestore |

## MUST

- Kravlöst — no streaks, no failure language
- Vagus before cognitive reframe when arousal high
- Progressive disclosure — one step

## MUST NOT

- BIFF/Grey Rock (→ Safe Harbor)
- Valv forensic tone
- Auto-ingest Måbra data to kampspar
- JADE

## Related

- Agent: `.cursor/agents/livskompassen-mabra` (U11)
- SPEC: `docs/specs/modules/Mabra-SPEC.md`
