# mabra

> MåBra-sidan — proaktiv rehab (KBT/ACT, vagus, självmedkänsla).

## Syfte

Kravlösa övningar: panik/RSD, självkritik, grounding. Ett steg i taget. **Inte** gaslighting-försvar (→ Speglar), **inte** ex (→ Hamn), **inte** daglig logg (→ Dagbok).

## Route och ingång

| | |
|---|---|
| **Route** | `/mabra` |
| **AuthGate** | ja |
| **Kluster** | hem (Måbra) |
| **Dock** | ej i FloatingDock |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/MabraPage.tsx` | Orchestrator per symptom-hub |
| `components/SymptomHub.tsx` | Panik/RSD, Självkritik, Hitta mig |
| `components/BreathingExercise.tsx` | 4-7-8 |
| `components/GroundingExercise.tsx` | 5-4-3-2-1 |
| `components/ReframingExercise.tsx` | Thought record (RAM) |
| `components/ValuesCompass.tsx` | ACT värderingar |
| `components/MabraCoachPanel.tsx` | Opt-in AI-coach |
| `api/mabraCoachService.ts` | `mabraCoach` callable |
| `lib/mabraCoachGuard.ts` | Speglar-vakt vid ex-text |

## Data

| Collection | Innehåll |
|------------|----------|
| `mabra_sessions` | exerciseType, duration — WORM |
| `mabra_progress` | coreValues[] — mutable per user |

## Beror på

- `core` — layout, auth, Web Speech
- `functions/` — `MABRA_COACHEN_SYSTEM_PROMPT` i `sharedRules.ts`

## Kopplingar

- **dagbok** — länk efter övning (`?from=mabra`)
- **kompasser** — länk kväll (planerat)
- **speglings_system** — guardrail vid ex-text
- **Hamn / Valv / Kunskap** — ingen datakoppling

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | `mabra_sessions`, `mabra_progress` |
| **RAG / chatt** | Nej — `mabraCoach` opt-in, ej livsminne |
| **PDF / samlad export** | — |
| **Planerat** | — |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/wellbeing/mabra_sidan.md)
- [Mabra-SPEC](../../../docs/specs/modules/Mabra-SPEC.md)

**Deploy:** `firebase deploy --only firestore` för rules i prod.
