# Dagbokshubben

**Route:** `/dagbok` (flik `reflektion` i Hjärtat) · **AuthGate:** ja  
**Spec (konsoliderad):** [`docs/specs/incoming/Dagbok-SPEC.md`](../../docs/specs/incoming/Dagbok-SPEC.md)

## Syfte

**Lager 1** — kravlös tacksamhets- och reflektionsdagbok. Appens oskyldiga fasad (plausible deniability). Skild från Verklighetsvalvet (Lager 2). ACT/KBT-inspirerad identitetsrekonstruktion — inte forensik.

## UI (idag)

| Komponent | Roll |
|-----------|------|
| `HjartatPage` | Kluster: Reflektion \| Bevis \| Speglar |
| `DagbokPage` | Wizard-orkestrator |
| `MoodStep` | Humör-pills |
| `ReflectionStep` | Fritext + Web Speech sv-SE |
| `ConfirmStep` | Preview + spara |
| `SavedStep` | Bekräftelse + bro Speglar |
| `JournalArchive` | Tidslinje, pagination 5 ("Visa fler") — synlig endast steg 1 |

**Wizard:** humör → text → bekräfta → sparad. Spar kräver fritext idag.

## Navigation

| Ingång | Beteende |
|--------|----------|
| Dock BookOpen (kort klick) | `/dagbok` |
| **Fyren** (3s long-press BookOpen) | WebAuthn → PIN → `/dagbok?tab=bevis` |
| `/valv` | Redirect → `?tab=bevis` |

## Datamodell (WORM)

- **`journal`:** ownerId, userId, mood, text, createdAt — append-only

## Backend

| Callable | Data |
|----------|------|
| Klient save | `journal` |
| `weaveJournalEntry` (fire-and-forget) | → `reality_vault` (`vävaren_metadata`) |

**Inte:** Firestore-trigger; **inte** auto-write till `kampspar`.

## Status

| Klart | Delvis | Planerat |
|-------|--------|----------|
| Wizard, journal, WORM, Vävaren, Speglar-bro, röst, Fyren, arkiv pagination, unmount cleanup | Zero Footprint audit | Måbra-bro, KBT-frågor, villkorlig Speglar, humör-only, KASAM-kväll |

## Säkerhet

- AuthGate, WORM rules
- Röst: browser-only, ingen Blob till Storage
- Kill Switch global; wizard cleanup vid unmount

## Vision (bevara)

- Plausible deniability, positivt ACT-rum
- Vävaren asynkron — Lager 1 förblir mjukt

Kod: `src/modules/dagbok/` · Plan: [`src/modules/dagbok/module_plan.md`](../../src/modules/dagbok/module_plan.md) · Prompter: [`docs/specs/ai-prompts-moduler-master.md`](../../docs/specs/ai-prompts-moduler-master.md)
