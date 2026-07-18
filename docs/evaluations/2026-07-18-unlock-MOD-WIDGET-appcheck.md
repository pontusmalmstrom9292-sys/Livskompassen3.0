# Unlock MOD-WIDGET — App Check före Valv-inspelning

**Datum:** 2026-07-18  
approved: yes  

**Varför:** Fas 24 förbättringsplan — App Check före widget Valv-analyze/commit.

## Tillåtna filer

- `src/modules/features/widgets/api/widgetVaultRecording.ts`

## MUST NOT

- Ändra widget-routes, WH1/WH2 UI, eller locked widget chrome

## Verifiering

`npm run smoke:widgets` · `npm run smoke:android-platform` · `npm run smoke:module-lock`
