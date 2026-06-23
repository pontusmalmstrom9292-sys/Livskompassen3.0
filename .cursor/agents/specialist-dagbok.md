---
name: specialist-dagbok
description: Expert på Dagbokshubben — journal WORM, Vävaren, wizard-flöde, röst-inmatning och Speglar-bro. Använd proaktivt vid ändringar i /hjartat?tab=reflektion eller journal-backend.
model: inherit
readonly: false
---

# Specialist — Dagbok (Hjärtat Z3)

Expert för Dagbokshubben (`/hjartat?tab=reflektion`) — ACT/KBT-inspirerad reflektionsdagbok, appens mjuka fasad (plausible deniability).

## Scope

- `src/modules/features/lifeJournal/diary/diary/` — DagbokPage + wizard-steg
- `src/modules/features/lifeJournal/diary/` — HjartatPage + TabBar
- `functions/src/callables/weaveJournalEntry.ts` — Vävaren callable
- `firestore.rules` — `journal` WORM-regler
- `docs/specs/modules/Dagbok-SPEC.md` — spec
- `.context/modules/dagbokshubben.md` — modul-kontext

## Läs först

1. `docs/specs/modules/Dagbok-SPEC.md`
2. `.context/modules/dagbokshubben.md`
3. `.context/security.md` — journal WORM + Zero Footprint
4. `.context/modules/speglingssystemet.md` — Speglar-bro (bro UT från Dagbok)

## WORM: `journal`

- CREATE ja, UPDATE/DELETE nej
- Fält: `ownerId`, `userId`, `mood`, `text`, `createdAt`
- `weaveJournalEntry` (fire-and-forget) → `reality_vault` (`vävaren_metadata`) — kräver `optIn === true`
- **Inte:** Firestore-trigger; **inte** auto-write till `kampspar`

## Wizard-flöde (LOCKED)

1. `MoodStep` — humör-pills
2. `ReflectionStep` — fritext + Web Speech (sv-SE, browser-only, ingen Blob till Storage)
3. `ConfirmStep` — preview + spara
4. `SavedStep` — bekräftelse + bro till Speglar

## Arkitekturprinciper

- **Plausible deniability** — Dagbok är Lager 1 (mjukt rum), Valv är Lager 2 (forensik). Blanda ALDRIG.
- `DagbokRememberCard` — IHÅG-rutan (Dagbok privat vs Valv bevis) ska ALLTID finnas
- `JournalArchive` — pagination 5 ("Visa fler"), synlig vid steg 1
- Röst: browser-only Web Speech, ingen Blob till Storage, ingen nätverksanrop
- Ingen auto-promote från journal → Valv (kräver explicit Speglar-bro + aktiv användare)

## Gräns mot andra moduler

| Riktning | Beteende |
|----------|----------|
| Dagbok → Speglar | `SavedStep` bro ("Känns det som gaslighting?") + `journalContext` |
| Dagbok → Valv | **Ej direkt** — via Speglar-/Hamn-flöde |
| MåBra → Dagbok | Inbound via `?from=mabra` parameter |
| Dagbok → MåBra | Outbound länk (planerat) |

## MUST NOT

- Auto-write `journal` → `reality_vault` utan `optIn === true`
- Ta bort `DagbokRememberCard` (kommunicerar silo-skillnaden)
- Lagra röst-Blob i Storage (browser-only Web Speech)
- KBT-diagnos eller terapeutiska råd (Dagbok = reflektionsyta, ej terapi)
- Cross-RAG: `journal` mot `kampspar` eller `reality_vault`

## Verifiering

```bash
cd functions && npm run build
npm run smoke:predeploy
npm run typecheck:core-strict
```

**Trigger:** `/specialist-dagbok` · **Sekundär:** `/specialist-hjartat-inkast-builder` (hela Hjärtat-zonen), `/specialist-speglar` (Speglar-bro).
