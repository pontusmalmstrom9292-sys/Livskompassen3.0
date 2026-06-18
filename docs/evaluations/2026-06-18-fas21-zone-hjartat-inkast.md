# Fas 21 — Zon 2: Hjärtat + Smart Inkast (beslutsmemo)

**Datum:** 2026-06-18 · **Status:** Godkänd för våg 21.8

G10 HITL oförändrat. Gap: Hem→Hjärtat nav-bro när inkast på; toast-paritet vs Dagbok; journal-destination via superhub-route.

## IMPLEMENTERA → våg 21.8

| Fil | Ändring |
|-----|---------|
| `homeSuperhubRoutes.ts` | `hemInkast`, ev. alias |
| `HomeAdaptiveCompass.tsx` | Länk «Full reflektion i Hjärtat»; kvälls-CTA när inkast på |
| `DagbokInputSuperModule.tsx` | Länk «Sortera till arkiv (Smart Inkast)» → `/#inkast-lite` |
| `inkastService.ts` | journal → `hjartatReflektion` superhub-route |
| `CapturePanel.tsx` / `InkastDirectPanel.tsx` | `toast.success`/`toast.info` efter persist |
| `moduleHelpRegistry.ts` | `capture:kompass` |
| `smoke_inkast_vardag.mjs` | Assert nya länkar + toast |

**MUST NOT:** `CaptureSuperModule` på Hjärtat; backend G10-ändringar.

## DEFER

Full merge · `HjartatHero.tsx` orphan · rules · auto-weave

## Smoke

`smoke:inkast-vardag`, `smoke:inkast`, `smoke:inkast-upload`, `smoke:inbox`, `smoke:speglar`, `smoke:locked-ux`

## Deploy

`hosting` only · **REK:** Alt A — Shortcut + toast
