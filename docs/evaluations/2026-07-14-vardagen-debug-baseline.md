# Vardagen debug — baseline (Fas 0)

**Datum:** 2026-07-14  
**Plattform:** Cursor YOLO v14  
**Enhet:** Motorola G85 (Capacitor) — hypotes P0 viewport-lock

## Statiska smokes (Mac)

| Smoke | Resultat | Notering |
|-------|----------|----------|
| smoke:superhub | FAIL pre-fix | AppRoutes använder VardagenRoutePage |
| smoke:design-modules | PASS efter våg 1 | |
| smoke:locked-ux | PASS efter våg 1 | |

## G85 testmatris

| # | Väg | Baseline pre-fix | Hypotes |
|---|-----|------------------|---------|
| 1-2 | /vardagen | A vit skärm | P0 viewport-lock |
| 3 | ?tab=ekonomi | A/C | P1 tung chunk |
| 4 | ?tab=mabra | A/B | P3 project redirect |
| 5-7 | externa/legacy | okänd | P4-P5 |

