# Dagbokshubben

**Kanonisk kod:** `src/modules/features/lifeJournal/diary/diary/`  
**Route:** `/hjartat?tab=reflektion` · **Legacy:** `/dagbok` → redirect · **AuthGate:** ja  
**Spec (konsoliderad):** [`docs/specs/modules/Dagbok-SPEC.md`](../../docs/specs/modules/Dagbok-SPEC.md)

## Syfte

**Lager 1** — kravlös tacksamhets- och reflektionsdagbok. Appens oskyldiga fasad (plausible deniability). Skild från Verklighetsvalvet (Lager 2). ACT/KBT-inspirerad identitetsrekonstruktion — inte forensik.

## UI (idag)

| Komponent | Roll |
|-----------|------|
| `HjartatPage` | Kluster: Reflektion \| Speglar (ingen Bevis-flik — Valv är separat silo) |
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
| Drawer / Dock BookOpen | `/hjartat` |
| **Fyren** (3s long-press BookOpen) | WebAuthn → PIN → `/valvet` |
| `/dagbok` | Redirect → `/hjartat` (eller `/valvet` om `?tab=bevis`) |
| `/dagbok?tab=bevis` | Redirect → `/valvet?vaultTab=…` |

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

## Säkerhet

- AuthGate, WORM rules
- Röst: browser-only, ingen Blob till Storage
- Device Clear global; wizard cleanup vid unmount

## Vision (bevara)

- Plausible deniability, positivt ACT-rum
- Vävaren asynkron — Lager 1 förblir mjukt

Kod: `src/modules/features/lifeJournal/diary/diary/` · Plan: [`src/modules/features/lifeJournal/diary/diary/module_plan.md`](../../src/modules/features/lifeJournal/diary/diary/module_plan.md)
