# Unlock MOD-HJ-DAGBOK — App Check före Valv-weave

**Datum:** 2026-07-18  
approved: yes  

**Varför:** Fas 24 förbättringsplan — `awaitAppCheckReady` / `withVaultSessionPayloadReady` före weave-callables så APP_CHECK_ENFORCE inte ger 400.

## Tillåtna filer

- `src/modules/features/lifeJournal/diary/diary/api/weaverApprovalService.ts`
- `src/modules/features/lifeJournal/diary/diary/api/weaverService.ts`

## MUST NOT

- Ändra Dagbok UI / locked UX / journal WORM-schema

## Verifiering

`npm run smoke:weaver-hitl` · `npm run smoke:android-platform` · `npm run smoke:module-lock`
