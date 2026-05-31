# Pre-Merge Impact Report (PMIR) — session `2026-05-31-rniv`

**Datum:** 2026-05-31  
**Gren:** `2026-05-31-rniv` → **`main`**  
**Agent / session:** Cursor git-trunk konsolidering

---

## Följer med till main

- [x] Drawer L2-ikoner, `useWeaverPendingCount`, Valv badge (`7586a28b`, `4c02f2d8`)
- [x] Apps Script sorter trigger helpers (`0d67a413`)
- [x] **Vävaren HITL:** `weaver_pending`, `approveWeaverMetadata`, `rejectWeaverMetadata`, `WeaverApprovalPanel`, `WeaverPendingVaultBanner` (`bce4c976`)
- [x] Gemini handoff docs + `exports/gemini-handoff/valv-upload/` (`9c2e7f8d`)
- [x] `firestore.rules` + `firestore.indexes.json` för `weaver_pending`
- [x] Smoke-skript uppdateringar (`smoke_locked_ux`, `smoke_orkester_wiring`)

**Commits (5):** `0d67a413` … `9c2e7f8d`

---

## Försvinner (vid gren-radering)

| Vad | Detalj |
|-----|--------|
| Gren `2026-05-31-rniv` (lokal) | Efter ff-merge till `main` |
| Kod kvar endast på grenen | Inget unikt efter merge |

---

## Regelanalys

| Lager | Källor | Status |
|-------|--------|--------|
| **System** | U1 tre silos; Vävaren skriver inte direkt till `reality_vault` utan HITL | **PASS** |
| **Design** | Locked UX: Barnfokus, Valv Mönster/Orkester, drawer Vardag/Valv | **PASS** (smoke:locked-ux) |
| **Säkerhet** | `weaver_pending` append-only; approve skapar vault metadata via callable | **PASS** — rules deploy krävs |

---

## Smoke (på `main` efter merge)

| Kommando | Resultat |
|----------|----------|
| `npm run build` | _(fylls efter merge)_ |
| `npm run smoke:locked-ux` | _(fylls efter merge)_ |
| `npm run smoke:orkester` | _(fylls efter merge)_ |

---

## Deploy efter merge

| Resurs | Kommando |
|--------|----------|
| Rules + indexes | `firebase deploy --only firestore:rules,firestore:indexes` |
| Functions | `approveWeaverMetadata`, `rejectWeaverMetadata`, `weaveJournalEntry` (om ändrad) |
| Hosting | `firebase deploy --only hosting` |

---

## Blockers

- Ingen kod-blocker före merge.
- Prod kräver deploy av rules/functions efter push.

---

**Användaren:** ☑ godkänn merge (plan implementerad 2026-05-31)  
**Åtgärd:** ff-merge `2026-05-31-rniv` → `main`, smoke, push `origin main`
