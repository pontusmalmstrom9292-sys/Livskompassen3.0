# P3 — Design-debt baseline (gate-marker)

**Datum:** 2026-07-13  
**Plattform:** Cursor Agent  
**Task:** `p3-design-debt` (Cursor YOLO v5, parallell fas)  
**Status:** **DONE** — metrics inspelade, smoke PASS  
**Scope:** `npm run smoke:design-debt` → `docs/DASHBOARD.md`. Inga produktändringar.

---

## Metrics (`smoke:design-debt`)

**Timestamp:** `2026-07-13T11:38:19.704Z`

| Metric | Värde | Target / notering |
|--------|-------|-------------------|
| btnPillFiles | **0** | 0 new after start ✓ |
| dsBtnFiles | **1** | 1 kvar (legacy bridge) |
| designSystemImportFiles | **250** | DS adoption |
| adHocDialogFiles | **3** | ≤3 documented ✓ (sandbox×2, ResurserOverlay locked) |
| indexCssLoc | **61** | ≤120 ✓ |

```json
{
  "btnPillFiles": 0,
  "dsBtnFiles": 1,
  "designSystemImportFiles": 250,
  "adHocDialogFiles": 3,
  "indexCssLoc": 61,
  "generatedAt": "2026-07-13T11:38:19.704Z"
}
```

---

## Smoke

| Kommando | Resultat |
|----------|----------|
| `npm run smoke:design-debt` | **PASS** |
| `npm run smoke:governance` | **PASS** |

---

## Gate

Denna fil är **gate-artifact** för `p3-design-debt` i `scripts/cursor_yolo.mjs` (`GATE_ARTIFACTS`).

Nästa steg efter P1–P3 gate: `npm run cursor:yolo -- gate` / `gate-pass` → sekventiell fas P4+.

---

## Dashboard

Metrics speglade i [`docs/DASHBOARD.md`](../DASHBOARD.md) (Program metrics + design-debt-rad).
