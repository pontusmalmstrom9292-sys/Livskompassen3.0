# DOC-DRIFT-rapport — 2026-05-24 (Del B)

**Metod:** Jämförelse kod (`AppRoutes`, GAP-register, smoke) mot markdown. Inga filer raderade — historik behållen.

---

## Åtgärdat i Del B

| Drift | Åtgärd |
|-------|--------|
| Moduler saknades i `src/modules/README.md` | Uppdaterad — planering, projekt, barnporten, register-länk |
| Ingen samlad modulöversikt | Ny [`MODUL-FUNKTIONS-REGISTER.md`](./MODUL-FUNKTIONS-REGISTER.md) |
| Utvärderingar säger "Planering ej implementerad" | [`SENASTE-SAMMANFATTNING.md`](./evaluations/SENASTE-SAMMANFATTNING.md) markerar historik |
| Dubbla GAP/register i `docs/specs/incoming/` | Flyttade till `archive/specs-incoming-duplicates-2026-05/` — **raderat 2026-05-30** (dublett README pekade på kanon) |
| `arkiv-minme` typo risk | Register pekar på `arkiv-minne.md` (korrekt fil) |

---

## Kvar som historisk (medvetet ej ändrat)

| Fil | Varför |
|-----|--------|
| `docs/archive/evaluations-2026-05-23/*` | Flyttat 2026-05-30 — läs `SENASTE-SAMMANFATTNING` |
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

Vid framtida utvärderingar: skapa ny fil `docs/evaluations/YYYY-MM-DD-*.md` — uppdatera inte gamla snapshots. Uppdatera alltid `SENASTE-SAMMANFATTNING.md` + `MODUL-GAP-OVERSIKT.md` + `SESSION-INDEX.md` vid större leverans.

---

## Del C — Doc-städ Fas 1 (2026-05-30)

| Åtgärd | Detalj |
|--------|--------|
| Raderat | `docs/GIT_WORKFLOW.md`, `docs/archive/specs-incoming-duplicates-2026-05/`, `2026-05-23-A-helhetsstatus.md` (v1) |
| Arkiv | 12× `2026-05-23-*` → `docs/archive/evaluations-2026-05-23/` |
| Arkiv root | `CONSOLIDATION-PLAN`, `CHAT-ANALYS`, `WAVE4_DEFERRED` → `docs/archive/` |
| Repomix | `.gitignore` `exports/gemini-handoff/repomix/`; git rm 3× pack (~380 KB) |
| Rolling | `ORKESTER-NATT-ROLLING.md`, `CONTENT-AUTORUN-ROLLING.md`; stubs i evaluations |
| Ny index | `docs/evaluations/SESSION-INDEX.md` |

---

## Del D — Doc-städ Fas 2 (2026-05-30)

| Åtgärd | Detalj |
|--------|--------|
| Raderat ikon-batch | `2026-05-26/`, `2026-05-26-remaining/`, `2026-05-26-v3-chassis/` (~120 filer) |
| Behåll ikon | `v2-premium`, `v4-round2-dna`, `gold-hub-v5` |
| PNG | `galleri/planering-variants/` bort; P3/P4 kanon-dupes i `planering/variants/`; `PLANERING-P1-KANON.png` (0 refs) |
| Tema docs | `themes/README.md` prod = Pack **I** |
| Färg | `COLOR-POLICY` → `PROMPTS.md`, `ui-design.mdc`, `design-master.md` |
| Ikondocs | `ICON-STYLE-GUIDE`, `IKON-WIDGET-MASTER`, `CHROME-POLICY`, `ICON-DECISIONS`, `.context/design-language` |

---

## Del E — Doc-städ Fas 3 (2026-05-30)

| Åtgärd | Detalj |
|--------|--------|
| `status: closed` | 7× cursor-plan + dagbok-vertex-plan + kompass-snabbstart |
| Valv | `valv-samla` closed (delvis kod); `valv-privacy` closed deferred |
| Arkiv | `evaluations-closed-2026-05-29/` — vertex-spec, pmir-dagbok-planering, pmir-max-byggplan |
| Stubs | Samma filnamn i `evaluations/` för PMIR + vertex-spec + kunskap-seed-draft |
| Kanon öppet | Endast [`MODUL-GAP-OVERSIKT.md`](./MODUL-GAP-OVERSIKT.md) + [`2026-05-29-smoke-manuell.md`](./evaluations/2026-05-29-smoke-manuell.md) + content ingest |

---

## Del F — Doc-synk projektgranskning (2026-05-31)

| Åtgärd | Detalj |
|--------|--------|
| Smoke sanning | [`SMOKE_RESULTS.md`](./SMOKE_RESULTS.md) tabell **Current truth** |
| Hub | [`SENASTE-SAMMANFATTNING.md`](./evaluations/SENASTE-SAMMANFATTNING.md), [`SESSION-INDEX.md`](./evaluations/SESSION-INDEX.md) S8, [`SYSTEMKONTROLL.md`](./SYSTEMKONTROLL.md), [`.context/system-plan.md`](../.context/system-plan.md) |
| Moln live audit | [`GCP-INVENTORY-LATEST.md`](./GCP-INVENTORY-LATEST.md) — 33 fn, **173 vectors**, Vävaren callables |
| Projektrot 3.0 | [`DEPLOY.md`](./DEPLOY.md), [`FIREBASE_SYNC.md`](./FIREBASE_SYNC.md), [`GCP-FAS4-RUNBOOK.md`](./GCP-FAS4-RUNBOOK.md), [`DRIVE_AUTOMATION.md`](./DRIVE_AUTOMATION.md) |
| Modulregister | [`MODUL-GAP-OVERSIKT.md`](./MODUL-GAP-OVERSIKT.md), [`MODUL-FUNKTIONS-REGISTER.md`](./MODUL-FUNKTIONS-REGISTER.md) |
| Säkerhet | [`.context/security.md`](../.context/security.md) Zero Footprint faktiskt beteende |
| Eval A | [`evaluations/2026-05-31-A-helhetsstatus.md`](./evaluations/2026-05-31-A-helhetsstatus.md) |
