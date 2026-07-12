# Unlock MOD-VARD-LAUNCH — Android redirect-fix

**Datum:** 2026-07-12  
approved: yes  
**Scope:** Legacy redirect-map för inkast/planering tabs + hash→route.

## Tillåtna filer

- `src/modules/shell/livLauncherRoutes.ts`

## MUST NOT

- Ändra launcher-grid layout eller locked UX

## Verifiering

`npm run smoke:life-os-links` + manuell `/vardagen` navigation
