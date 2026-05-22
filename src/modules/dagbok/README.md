# dagbok

> Dagbokshubben — Lager 1. Kravlös reflektion och plausible deniability.

## Syfte

Tacksamhets- och reflektionsdagbok (ACT/KBT-inspirerad). Appens oskyldiga fasad. Skild från Verklighetsvalvet (Lager 2). Del av Hjärtat-klustret.

## Route och ingång

| | |
|---|---|
| **Route** | `/dagbok` (flik `reflektion` i Hjärtat) |
| **AuthGate** | ja |
| **Dock** | BookOpen (kort klick) → dagbok |
| **Fyren** | 3s → WebAuthn → PIN → `?tab=bevis` |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/HjartatPage.tsx` | Kluster: Reflektion \| Bevis \| Speglar |
| `components/DagbokPage.tsx` | Wizard-orkestrator |
| `components/MoodStep.tsx` | Humör-pills |
| `components/ReflectionStep.tsx` | Fritext + röst |
| `components/ConfirmStep.tsx` | Preview + spara |
| `components/SavedStep.tsx` | Bekräftelse + bro Speglar |
| `components/JournalArchive.tsx` | Tidslinje, pagination |
| `hooks/useJournalFlow.ts` | Wizard-state + cleanup |
| `api/weaverService.ts` | `weaveJournalEntry` (async) |

## Data

| Collection | Innehåll |
|------------|----------|
| `journal` | mood, text, ownerId — WORM append-only |

**Kampspár:** endast med opt-in checkbox (G7) — aldrig auto.

## Beror på

- `core` — layout, auth, useSpeechToText, journalBridge
- `verklighetsvalvet` — Bevis-flik i Hjärtat
- `speglings_system` — Speglar-flik

## Kopplingar

- **mabra** — inbound `?from=mabra`
- **speglings_system** — journalContext från SavedStep
- **Vävaren** — fire-and-forget metadata till valv

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | `journal` — WORM |
| **RAG / chatt** | Nej (Vävaren → `reality_vault` metadata, ej Kunskap) |
| **PDF / samlad export** | Dossier opt-in |
| **Opt-in minne** | `journalWovenToKampspar` → `kampspar` (checkbox ConfirmStep) |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/dagbokshubben.md)
- [Dagbok-SPEC](../../../docs/specs/modules/Dagbok-SPEC.md)
