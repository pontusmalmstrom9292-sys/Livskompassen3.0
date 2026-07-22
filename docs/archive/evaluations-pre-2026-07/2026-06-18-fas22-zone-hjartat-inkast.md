# Fas 22 — Zon 2: Hjärtat + Smart Inkast (beslutsmemo)

**Datum:** 2026-06-18 · **Läge:** READ-ONLY preflight · **Status:** Godkänd för våg 22.6 + 22.8

## Sammanfattning

Fas 21: Hem→Hjärtat genväg, journal-route, toast, `smoke:inkast-vardag` PASS. **Ny:** `biffRewriteDraft` + `BiffRewriteButton` i `ReflectionEditor` — ej deployad i fas21-leverans.

## IMPLEMENTERA

### Våg 22.6 — biffRewriteDraft deploy

| Fil | Ändring |
|-----|---------|
| `functions/src/index.ts` | redan export |
| `ReflectionEditor.tsx` | wire klar |
| deploy | `functions:biffRewriteDraft`, `hosting` |

### Våg 22.8 — Hem→Hjärtat polish (copy only, INTE full merge)

| Fil | Ändring |
|-----|---------|
| `HomeAdaptiveCompass.tsx` | CTA-copy konsistens |
| `homeSuperhubRoutes.ts` | ev. alias |

## Alternativ

| Alt | REK |
|-----|-----|
| **A** Deploy callable + hosting | **JA** |
| B | Defer | Nej |
| C | Hamn först | Onödigt |

## DEFER

Full merge · HjartatHero orphan · auto-weave · rules

## Smoke

22.6: `smoke:inkast`, `smoke:inkast-vardag`, `smoke:hamn`, `smoke:locked-ux`, `smoke:superdagbok-superhub`  
22.8: `smoke:compass`, `smoke:inkast-vardag`, `smoke:locked-ux`

## Deploy

22.6: `functions:biffRewriteDraft`, `hosting` · 22.8: `hosting`
