# Module-lock audit — YOLO v7 P25

**Datum:** 2026-07-13  
**Plattform:** Cursor Agent  
**Agent:** specialist-verifier (read-only inventering)

---

## Register-sammanfattning

| Fält | Värde |
|------|-------|
| Register | `.context/module-lock-register.json` |
| Version | 1 |
| Uppdaterad | 2026-07-12 |
| Totalt moduler | **22** |
| Locked | **21** |
| Developing | **1** (`MOD-WIDGET`) |

---

## Locked moduler (21)

| ID | Zon | Entry file | @locked header |
|----|-----|------------|----------------|
| MOD-CORE-NAV | Core | `AppRoutes.tsx` | PASS (`PROTECTED CORE` + `@locked MOD-CORE-NAV`) |
| MOD-CORE-CHROME | Core | `FloatingDock.tsx` | PASS |
| MOD-HJ-DAGBOK | Hjärtat | `DagbokPage.tsx` | PASS |
| MOD-HJ-INPUT | Hjärtat | `DagbokInputSuperModule.tsx` | PASS |
| MOD-HJ-SPEGLAR | Hjärtat | `SpeglarSuperModule.tsx` | PASS |
| MOD-VALV-HUB | Valv | `VaultPage.tsx` | PASS |
| MOD-VALV-INKAST | Valv | `InkastDirectPanel.tsx` | PASS |
| MOD-VALV-ORKESTER | Valv | `VaultOrkesterPanel.tsx` | PASS (`@locked-ux` fallback) |
| MOD-VARD-LAUNCH | Vardagen | `LivLauncherPage.tsx` | PASS |
| MOD-VARD-MABRA | Vardagen | `MabraHubView.tsx` | PASS |
| MOD-VARD-PLAN | Vardagen | `PlaneringPage.tsx` | PASS |
| MOD-VARD-EKO | Vardagen | `EkonomiInputSuperModule.tsx` | PASS |
| MOD-VARD-ARB | Vardagen | `ArbetslivHubPage.tsx` | PASS |
| MOD-FAM-HUB | Familjen | `FamiljenPage.tsx` | PASS |
| MOD-FAM-BARN | Familjen | `FamiljenBarnfokusDelegate.tsx` | PASS |
| MOD-FAM-HAMN | Familjen | `BiffPublicPanel.tsx` | PASS |
| MOD-FAM-BPORT | Familjen | `barnportenRollout.ts` | PASS |
| MOD-FAM-DROG | Familjen | `DrogfrihetHubPage.tsx` | PASS |
| MOD-BACK-SYN | Backend | `synapseBus.ts` | PASS |
| MOD-BACK-DCAP | Backend | `dcapEscalation.ts` | PASS |
| MOD-BACK-WORM | Backend | `wormHashChain.ts` | PASS |

**Saknade headers:** 0 — ingen additiv ändring krävdes.

---

## Developing modul

| ID | Status | Unlock-doc | Notering |
|----|--------|------------|----------|
| MOD-WIDGET | developing | `docs/evaluations/2026-07-12-unlock-MOD-WIDGET.md` | Fyren + widget-routes aktiv utveckling |

---

## Unlock-doc hygien

9 unlock-dokument i `docs/evaluations/*-unlock-MOD-*.md`.  
`MOD-WIDGET` har aktiv unlock med `approved: yes` (2026-07-12).

Historiska unlocks (v5/v6 polish, android-viewport) — arkiverade, ej aktiva diff.

---

## Smoke

| Smoke | Resultat |
|-------|----------|
| `smoke:module-lock` | **PASS** — register OK, diff guard OK |
| `smoke:governance` | **PASS** — 20 filer, 10 copilot phrases |

---

## Kodändringar

**Inga** — alla entryFiles hade redan `@locked MOD-XXX` (eller godkänd fallback `@locked-ux` / `PROTECTED CORE`).

---

## Slutsats

**P25 PASS** — register komplett, headers kompletta, diff guard aktiv.

**Nästa:** P26 — Locked UX + Sacred Features snapshot (`smoke:locked-ux`, `smoke:e2e-locked-ux`, `smoke:plausible-deniability`, `smoke:basta-dock-lock`).
