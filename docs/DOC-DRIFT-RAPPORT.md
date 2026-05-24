# DOC-DRIFT-rapport — 2026-05-24 (Del B)

**Metod:** Jämförelse kod (`AppRoutes`, GAP-register, smoke) mot markdown. Inga filer raderade — historik behållen.

---

## Åtgärdat i Del B

| Drift | Åtgärd |
|-------|--------|
| Moduler saknades i `src/modules/README.md` | Uppdaterad — planering, projekt, barnporten, register-länk |
| Ingen samlad modulöversikt | Ny [`MODUL-FUNKTIONS-REGISTER.md`](./MODUL-FUNKTIONS-REGISTER.md) |
| Utvärderingar säger "Planering ej implementerad" | [`SENASTE-SAMMANFATTNING.md`](./evaluations/SENASTE-SAMMANFATTNING.md) markerar historik |
| Dubbla GAP/register i `docs/specs/incoming/` | Flyttade till [`archive/specs-incoming-duplicates-2026-05/`](./archive/specs-incoming-duplicates-2026-05/) |
| `arkiv-minme` typo risk | Register pekar på `arkiv-minne.md` (korrekt fil) |

---

## Kvar som historisk (medvetet ej ändrat)

| Fil | Varför |
|-----|--------|
| `docs/evaluations/2026-05-23-A-helhetsstatus-v2.md` | Snapshot 2026-05-23 — läs `SENASTE-SAMMANFATTNING` |
| `docs/evaluations/2026-05-23-E-kaos.md` | Samma |
| `docs/archive/repomix/*` | Baseline-analys — archive |
| `docs/archive/GCP-INVENTORY-2026-05-21.md` | Ersatt av `GCP-INVENTORY-LATEST.md` (redan noterat i GAP) |
| Theme J–O specs | Lab/mockups — inte production; index i `docs/design/themes/` |

---

## Kod vs doc — PASS (spot check)

| Påstående | Verifiering |
|-----------|-------------|
| `/planering` route | `AppRoutes.tsx` L95–100 |
| Barnfokus `lara_kanna` | `BARNFOKUS_QUESTIONS` + smoke:locked-ux PASS |
| driveIngestSynapse | `synapseBus.ts` + smoke:orkester PASS |
| G1–G16 done | `Arkiv-GAP-REGISTER.md` |

---

## Rekommendation

Vid framtida utvärderingar: skapa ny fil `docs/evaluations/YYYY-MM-DD-*.md` — uppdatera inte gamla snapshots. Uppdatera alltid `SENASTE-SAMMANFATTNING.md` + `MODUL-FUNKTIONS-REGISTER.md` vid större leverans.
