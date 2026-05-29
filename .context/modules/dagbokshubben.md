# Dagbokshubben

**Kanonisk kod:** `src/modules/diary/diary/` (legacy alias: `modules/dagbok` shim)  
**Route:** `/dagbok` (flik `reflektion` i Hjärtat) · **AuthGate:** ja  
**Spec (konsoliderad):** [`docs/specs/modules/Dagbok-SPEC.md`](../../docs/specs/modules/Dagbok-SPEC.md)

## Syfte

**Lager 1** — kravlös tacksamhets- och reflektionsdagbok. Appens oskyldiga fasad (plausible deniability). Skild från Verklighetsvalvet (Lager 2). ACT/KBT-inspirerad identitetsrekonstruktion — inte forensik.

## UI (idag)

| Komponent | Roll |
|-----------|------|
| `HjartatPage` | Kluster: Reflektion \| Bevis \| Speglar |
| `DagbokRememberCard` | IHÅG: Dagbok (privat) vs Valv (bevis) — ihopfällbar |
| `DagbokPage` | Sub-nav Snabb \| Reflektera \| Arkiv + wizard |
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
| Wizard, journal, WORM, Vävaren, Speglar-bro, röst, Fyren, arkiv pagination, unmount cleanup, inbound Måbra-bro (`?from=mabra`) | Vävaren auto utan godkännande | Outbound Måbra-länk, KBT-frågor, villkorlig Speglar, generellt humör-only |

## Kladd 2026-05-21

- **Roll:** Lager 1 fasad — plausible deniability; Fyren → valv.
- **Brus i Kladd:** People-pleasing, skam — **ej** valv; dagbok/Måbra.
- **Gap:** Subjektiv utmattning → dagbok OK; kliniska PDF → valv.

## Säkerhet

- AuthGate, WORM rules
- Röst: browser-only, ingen Blob till Storage
- Kill Switch global; wizard cleanup vid unmount

## Vision (bevara)

- Plausible deniability, positivt ACT-rum
- Vävaren asynkron — Lager 1 förblir mjukt

Kod: `src/modules/dagbok/` · Plan: [`src/modules/dagbok/module_plan.md`](../../src/modules/dagbok/module_plan.md) · Prompter: [`docs/specs/ai-prompts-moduler-master.md`](../../docs/specs/ai-prompts-moduler-master.md)
