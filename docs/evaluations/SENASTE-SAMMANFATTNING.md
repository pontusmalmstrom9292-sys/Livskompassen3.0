# Senaste sammanfattning — systemstatus

**Datum:** 2026-05-24 (Del A + B)  
**Gren:** `main` · Repo: Livskompassen3.0  
**Ersätter inte** detaljrapporterna under `2026-05-23-*` — de är **historik**.

---

## Nuläge i en mening

**Fas 4 — verifiering + polish:** Arkiv G1–G16 **done** i kod; frontend MVP för alla huvudkluster; **Planering `/planering` live**; Theme Pack I på main; git **en trunk** (`main`).

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

---

## Öppet (inte “saknas i kod”)

| Punkt | Typ |
|-------|-----|
| Manuell smoke | `docs/SMOKE_CHECKLIST.md` #1–7, #18 ekonomi |
| Opt-in minne-ingest | Trauma-policy — användaren aktiverar |
| Barnporten full PWA | Spec + agents; route `/barnporten` ej full MVP |
| `feat/mabra-fragekort` | Frågekort vs KBT — produktbeslut (parked branch) |

---

## Dokumentation — vad som gäller

| Tier | Kanon |
|------|--------|
| Systemlagar | `.context/*` |
| Implementation | `docs/specs/modules/*-SPEC.md`, `Arkiv-GAP-REGISTER.md` |
| Drift live | `GCP-INVENTORY-LATEST.md` |
| Git | `GIT-LATHUND.md`, `BRANCH-KARTA.md` |
| Moduler | `MODUL-FUNKTIONS-REGISTER.md` |
| Historik | `docs/evaluations/2026-05-23-*`, `docs/archive/` |

---

## Korrigeringar mot äldre utvärderingar

Följande påståenden i **2026-05-23**-rapporter är **historiska** (fel idag):

- *"Planering endast spec, ingen route"* → **`/planering` finns** (`PlaneringPage`, kanban).
- *"Theme I bara på sidogren"* → **Theme Pack I på `main`** (PR #2 + Del A).

Se [`DOC-DRIFT-RAPPORT.md`](../DOC-DRIFT-RAPPORT.md).

---

## Nästa steg (valfritt)

- Manuell smoke 15 min  
- *"kör [GAP]"* endast om ny implementation  
- `feat/mabra` — PMIR före merge  
