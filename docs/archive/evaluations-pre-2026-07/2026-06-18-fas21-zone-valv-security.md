# Fas 21 — Zon 1: Valv + Security (beslutsmemo)

**Datum:** 2026-06-18 · **Läge:** READ-ONLY preflight · **Status:** Godkänd för våg 21.10

## Sammanfattning

Callable-skydd 44/44 PASS. Fas 20 JWT lock server-side PASS; **GAP:** klient saknar `getIdToken(true)` efter `invalidateSession`. PMIR-A Mönster Flow-metadata **IMPLEMENTERAD**. App Check Console Enforce = Pontus manuellt.

## IMPLEMENTERA → våg 21.10

| # | Scope | Filer |
|---|-------|-------|
| A | `getIdToken(true)` efter invalidate | `src/modules/core/auth/sessionService.ts` |
| B | Smoke JWT-rensning | `scripts/smoke_valv_security.mjs` |
| C | App Check runbook (docs) | `docs/APP-CHECK-ENFORCE-RUNBOOK.md` |
| D | Deploy om ej live | `functions:invalidateSession`, `functions:assistPatternMetadata` |

## DEFER

Console Enforce · Play Integrity (Pontus) · `firestore.rules` · v1→v2 ingest migration · BP-PUSH · Gmail

## Smoke

`smoke:valv-security`, `smoke:pattern-metadata`, `smoke:valv-gate`, `smoke:locked-ux`, `smoke:cache`, `smoke:vault-worm`

## Deploy

`functions:invalidateSession,functions:assistPatternMetadata,functions:rescanPatternMetadata,functions:writePatternScanMetadataCallable,hosting`

## REKOMMENDATION

**Alt A — Hårdning först** (client token refresh + smoke + deploy) → staging App Check → ej deploy-only.
