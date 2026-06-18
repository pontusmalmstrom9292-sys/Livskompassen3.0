# Fas 22 — Zon 3: Vardagen / M3.0-C (beslutsmemo)

**Datum:** 2026-06-18 · **Läge:** READ-ONLY preflight · **Status:** Godkänd för våg 22.2 + 22.3

## Sammanfattning

Phase 1 DONE: explore Firestore när uid · nutrition localStorage. **Gap:** `mabra_nutrition_log` saknas i rules.

## PMIR 22.2 → docs/evaluations/2026-06-18-mabra-3.0-c-phase2-pmir.md

Schema `mabra_nutrition_log/{uid}` doc per user med `days` map ELLER subcollection — se PMIR. BLOCKER utan OK → `blocker-fas22-22.3.md`.

## IMPLEMENTERA 22.3

Rules + `mabraNutritionLogService` + wire `MabraNutritionPanel` + manifest/offline policy.

## Alternativ

| Alt | REK |
|-----|-----|
| **A** Hybrid nutrition FS + explore polish | **JA** |
| B | Nutrition only | Halv |
| C | Defer | Nej |

## Smoke

22.2: `smoke:mabra`, `smoke:innehall`  
22.3: `smoke:mabra`, `smoke:modulvaljare`, `smoke:evolution-discovery`, `smoke:locked-ux`, `smoke:innehall`

## Deploy

22.3: `firestore:rules`, `hosting`
