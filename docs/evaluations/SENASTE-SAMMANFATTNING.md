# Senaste sammanfattning — systemstatus

**Datum:** 2026-05-31 (doc-synk efter Vävaren HITL merge) · tidigare 2026-05-29  
**Gren:** `main` · Repo: Livskompassen3.0  
**Ersätter inte** detaljrapporterna under [`archive/evaluations-2026-05-23/`](../archive/evaluations-2026-05-23/) — de är **historik**.  
**Senaste session:** S8 Vävaren HITL — [`2026-05-31-pmir-session-rniv.md`](./2026-05-31-pmir-session-rniv.md)

---

## Nuläge i en mening

**Fas 4 — verifiering + polish:** Arkiv G1–G16 **done** i kod; frontend MVP för alla huvudkluster; **Planering `/planering` live**; **Vävaren HITL** på `main` (2026-05-31); git **en trunk** (`main`).

---

## Vad som är byggt och ska bevaras

| Område | Status |
|--------|--------|
| Tre silos (Kunskap / Valv / Barnen) | Kod + regler — **aldrig cross-RAG** |
| Drive självsortering | `notifyNewFile` → `driveIngestSynapse` → `kb_docs` (G6 done) |
| SynapseBus | 4 triggers live (se [`MODUL-FUNKTIONS-REGISTER.md`](../MODUL-FUNKTIONS-REGISTER.md)) |
| Låst UX | Barnfokus (inkl. lära känna), Valv Mönster/Orkester, Planering kanban, Fyren, Barnporten agents |
| Sacred + WORM | `reality_vault`, `children_logs`, `journal`, `dossier_snapshots` |
| Orkester natt | `npm run orkester:night` + specialister |
| Entiteter / inkorg | G9–G10 done |
| Vävaren HITL | `weaver_pending` + approve/reject — kod + functions **deployade**; rules/hosting vid behov |

---

## Öppet (inte “saknas i kod”)

| Punkt | Typ |
|-------|-----|
| Manuell smoke (app) | #3 Valv, #4 Barnen, #2d bilaga, projektbild — se [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md) **Current truth** |
| Manuell smoke (klart) | #1 Auth, #2 Dagbok, #18 Ekonomi **PASS** 2026-05-27 · #19–20 **STATIC PASS** 2026-05-29 |
| Opt-in minne-ingest | Trauma-policy — användaren aktiverar |
| Barnporten full PWA | Spec + agents; route `/barnporten` ej full MVP |
| `feat/mabra-fragekort` | Frågekort vs KBT — produktbeslut (parked branch) |

---

## Dokumentation — vad som gäller

**Utskrift (1 sida):** [`KOMPASS-MINNESKARTA.md`](../KOMPASS-MINNESKARTA.md)

| Tier | Kanon |
|------|--------|
| Systemlagar | `.context/*` |
| Implementation | `docs/specs/modules/*-SPEC.md`, `Arkiv-GAP-REGISTER.md` |
| Drift live | `GCP-INVENTORY-LATEST.md` |
| Git | `GIT-LATHUND.md`, `BRANCH-KARTA.md` |
| Moduler | `MODUL-FUNKTIONS-REGISTER.md` |
| Historik | [`archive/evaluations-2026-05-23/`](../archive/evaluations-2026-05-23/), [`SESSION-INDEX.md`](./SESSION-INDEX.md), `docs/archive/` |

---

## Korrigeringar mot äldre utvärderingar

Följande påståenden i **2026-05-23**-rapporter är **historiska** (fel idag):

- *"Planering endast spec, ingen route"* → **`/planering` finns** (`PlaneringPage`, kanban).
- *"Theme I bara på sidogren"* → **Theme Pack I på `main`** (PR #2 + Del A).

Se [`DOC-DRIFT-RAPPORT.md`](../DOC-DRIFT-RAPPORT.md).

---

## Nästa steg (valfritt)

- Manuell smoke #3, #4, #2d (15 min) — [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md)  
- Deploy rules/hosting om `weaver_pending` UI ska live i prod  
- *"kör [GAP]"* endast om ny implementation  
- `feat/mabra` — PMIR före merge  
