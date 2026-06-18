# Fas 20 — Masterplan v2

**Datum:** 2026-06-18 · **Status:** Godkänd för implementation (7 zon-memos syntetiserade)
**Kanon:** [`.cursor/rules/fas20-masterplan-guard.mdc`](../.cursor/rules/fas20-masterplan-guard.mdc)

## Executive summary

Efter Fas 19 DONE: säkerhets-P0 (JWT lock), design P2 (planering tokens), Inkast polish, tri-gate ekonomi, repo hygiene, Android smoke. Master YOLO: commit/push/deploy efter trippel-smoke PASS.

## Vågtabell

| Våg | Scope | Smoke-extra | Deploy |
|-----|-------|-------------|--------|
| baseline | orkester:night | — | none |
| 20.1 | Doc-synk + zone memos + archive PMIR | orkester:night | none |
| 20.2 | JWT vault lock on invalidateSession | valv-security, valv-gate, locked-ux | functions:invalidateSession |
| 20.3 | hex P2 planering.css | design-modules, typecheck:core-strict | hosting |
| 20.4 | Dagbok toast polish | inkast, locked-ux | hosting |
| 20.5 | content:night baseline | content:night, innehall | none |
| 20.6 | tri-gate economy_advanced sync | evolution-discovery, ekonomi | functions:mabraEconomySync |
| 20.7 | /oversikt → /dashboard | locked-ux | hosting |
| 20.9 | Android platform smoke | android-platform, auth-login | none |
| slutrapport | fas20-leverans | tier1, orkester:night | none |

## Defer

M3.0-C full UI · BP-PUSH · Gmail OAuth · Genkit V1 · Barn-PWA rollout · App Check Console (Pontus manuellt)

## PMIR-stopp

firestore.rules · storage.rules · Barnporten kanon-UI · mass-radering · Sacred/Locked UX borttagning
