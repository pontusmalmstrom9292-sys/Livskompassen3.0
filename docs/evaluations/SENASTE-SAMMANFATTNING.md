# Senaste sammanfattning — systemstatus

**Datum:** 2026-06-27 · **Gren:** `main` @ `b952a9311`+  
**Kanon:** [`2026-06-15-fas19-masterplan-v2.md`](./2026-06-15-fas19-masterplan-v2.md) · **Smoke:** [`SMOKE_RESULTS.md`](../SMOKE_RESULTS.md)

---

## Nuläge i en mening

**B1–B4 zon-polish DONE** · **Valv A2.1–A2.7 DONE** · **Ingest våg 1** (kunskap → `kb_docs`) kod på `main`, **deploy väntar** · `smoke:predeploy` **PASS** 2026-06-27 · Modellrouting (`@model-routing`) aktiv.

**2026-06-27 ingest deploy-prep:** `submitInkastLite` + `notifyNewFile` verifierade i `functions/src` (export + callable/onRequest finns och är deploy-klara). Obligatorisk smoke-kedja PASS: `cd functions && npm run build` + `smoke:inkast-fas2` + `smoke:innehall` + `smoke:predeploy`. **Live smoke:kunskap körs först efter Pontus OK + deploy.**

---

## 2026-06-19 leveranser

| Våg | Status | Eval |
|-----|--------|------|
| B1 MåBra | smoke PASS | [`2026-06-19-pmir-mabra-b1.md`](./2026-06-19-pmir-mabra-b1.md) |
| B2 Familjen | smoke PASS | [`2026-06-19-pmir-familjen-b2.md`](./2026-06-19-pmir-familjen-b2.md) |
| B3 Hjärtat | smoke PASS | [`2026-06-19-pmir-hjartat-b3.md`](./2026-06-19-pmir-hjartat-b3.md) |
| B4 Vardagen | smoke PASS | [`2026-06-19-pmir-vardagen-b4.md`](./2026-06-19-pmir-vardagen-b4.md) |
| Valv A2.1–A2.7 | smoke PASS | [`2026-06-19-pmir-valv-a2-7.md`](./2026-06-19-pmir-valv-a2-7.md) m.fl. |
| Ingest våg 1 | kod merged · deploy pending | [`2026-06-19-pmir-ingest-vag-1.md`](./2026-06-19-pmir-ingest-vag-1.md) |
| Modellrouting | docs merged | [`../CURSOR-YOLO-MODEL-GUIDE.md`](../CURSOR-YOLO-MODEL-GUIDE.md) |

**Nästa deploy (kräver Pontus OK):** `functions:submitInkastLite,notifyNewFile` (ingest våg 1).

---

## Fas 19 sprint (2026-06-18)

| Våg | Status | Eval |
|-----|--------|------|
| 19.1 security | **LOCK** | `2026-06-18-fas19-vag-19.1.md` |
| 19.2 MåBra hybrid-8 | smoke PASS | `2026-06-18-fas19-vag-19.2.md` |
| 19.3 hex→tokens | smoke PASS | `2026-06-18-fas19-vag-19.3.md` |
| 19.4 JOY-17 bankId | smoke PASS | `2026-06-18-fas19-vag-19.4.md` |
| 19.5 evolution_ledger | smoke PASS | `2026-06-18-fas19-vag-19.5.md` |
| 19.6 arkiv-batch | **done** | `2026-06-18-fas19-leverans.md` |

**Nästa research-våg:** `GEMINI-DEEP-RESEARCH-SYSTEM-AUDIT-MASTER` → `2026-06-18-system-gap-syntes.md`
---

## Levererat (Fas 13–23)

| Område | Status |
|--------|--------|
| WORM + vault-gate | **done** Fas 13 |
| Superhubbar Fas 6–11 | **done** |
| Fas 19 masterplan-v2 | **done** + deploy 2026-06-15 |
| Fas 20 doc-synk + arkiv-batch 2 | **done** |
| Fas 21 guards + JOY-17 + Oracle tokens | **done** + deploy 2026-06-15 |
| Fas 22 hex→tokens P0 + typecheck | **done** + hosting deploy 2026-06-15 |
| Fas 19.5 evolution_ledger dual-write | **done** 2026-06-15 |
| Fas 23 USER smoke + Valv biometri + Familjen scroll | **done** 2026-06-15 |
| Fas 19.6 arkiv-batch PMIR | **done** 2026-06-15 |
| Fas 24 Hex P2 (Barnporten + Dossier print) | **done** 2026-06-15 |
| `orkester:night` + `typecheck:core-strict` | **PASS** 2026-06-15 |

---

## Fas 23 (klart)

| Spår | Leverans |
|-----|----------|
| 23.1 | Familjen en scroll-yta på mobil · flow-hub desktop · `smoke:locked-ux` guard |
| 23.2 | Valv biometri — App Check i CI-build · WebAuthn `firebaseapp.com` · tydliga fel |
| 23.3 | USER smoke #3 + #4 **PASS** · doc-synk SMOKE_RESULTS + SENASTE + SYSTEM_PLAN_v2 |

**USER:** #3 Valv biometri + arkiv · #4 Barnen scroll + Barnfokus spara — båda **PASS** 2026-06-15.

---

## Fas 22 (klart)

| Spår | Leverans |
|-----|----------|
| 22.1 | Hex→tokens — MabraHistoryView, ArchiveHub, DailyTasksList, diary supermodule, ImmersiveExperienceShell, VisualCompassWidget |
| 22.2 | Doc-synk — SENASTE-SAMMANFATTNING, SYSTEM_PLAN_v2, SMOKE_RESULTS |
| 22.3 | `typecheck:core-strict` + `src/modules/morning/**` |

---

## Fas 19.5 (klart)

| Spår | Leverans |
|-----|----------|
| 19.5 | `evolution_ledger` dual-write — [`2026-06-15-fas19-5-evolution-ledger-dual-write.md`](./2026-06-15-fas19-5-evolution-ledger-dual-write.md) |

---

## Öppet (backlog)

| ID | Beskrivning | Gate |
|----|-------------|------|
| Hex P2 | Barnporten zon-gradient, dossier print-HTML | **done** 2026-06-15 |
| M3.0-C | Fitness/Näring | PMIR · masterplan defer |
| App Check | Console Enforce | valfritt extra lager (kod redan fail-closed) |

---

## App Check sanning

- **Kod:** `APP_CHECK_ENFORCE=true` (fail-closed) — **PÅ**
- **Console Enforce:** **INTE** på (medvetet)
- **CI hosting:** `VITE_APP_CHECK_RECAPTCHA_SITE_KEY` i workflow (Fas 23.2)
