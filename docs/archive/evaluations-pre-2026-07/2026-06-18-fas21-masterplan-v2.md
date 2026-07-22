# Fas 21 — Masterplan v2

**Datum:** 2026-06-18 · **Status:** Godkänd för implementation (7 zon-memos syntetiserade)
**Kanon:** [`.cursor/rules/fas21-masterplan-guard.mdc`](../.cursor/rules/fas21-masterplan-guard.mdc)

## Executive summary

Efter Fas 20 DONE: M3.0-C UI wire (PMIR-först), Kunskap våg 30 curriculum + MåBra v27 bank-wire, arkiv-batch 4, Hemkompass wire, Inkast Hem→Hjärtat genväg, App Check hårdning, Android runbook. Master YOLO: commit/push/deploy efter trippel-smoke PASS.

## Zon-memos

| Zon | Memo |
|-----|------|
| 1 Valv+Security | [fas21-zone-valv-security.md](./2026-06-18-fas21-zone-valv-security.md) |
| 2 Hjärtat+Inkast | [fas21-zone-hjartat-inkast.md](./2026-06-18-fas21-zone-hjartat-inkast.md) |
| 3 Vardagen | [fas21-zone-vardagen.md](./2026-06-18-fas21-zone-vardagen.md) |
| 4 Familjen+Hamn | [fas21-zone-familjen-hamn.md](./2026-06-18-fas21-zone-familjen-hamn.md) |
| 5 Kunskap+U6 | [fas21-zone-kunskap-innehall.md](./2026-06-18-fas21-zone-kunskap-innehall.md) |
| 6 Repo+arkiv | [fas21-zone-repo-arkiv.md](./2026-06-18-fas21-zone-repo-arkiv.md) |
| 7 Android | [fas21-zone-android-platform.md](./2026-06-18-fas21-zone-android-platform.md) |

## Vågtabell

| Våg | Scope | Smoke-extra | Deploy |
|-----|-------|-------------|--------|
| baseline | orkester:night | — | none |
| 21.1 | Fas20 post-leverans doc-synk + arkiv-batch 4a | orkester:night, locked-ux | none |
| 21.2 | M3.0-C PMIR eval doc | mabra, innehall | none |
| 21.3 | M3.0-C Phase 1 UI wire (ingen ny collection) | mabra, locked-ux, evolution-discovery | hosting |
| 21.4 | MåBra v27 bank-wire (5 ref + 3 play) | content-mabra-static, mabra, innehall | hosting,functions:mabraCoach |
| 21.5 | Content våg 30 CUR-MYNDIGHET-01 (ingen ingest) | content:night, content-waves, kunskap, locked-ux | hosting |
| 21.6 | Arkiv-batch 4b + sub-lazy Valv/Familjen | orkester:night, valv-mode, locked-ux, tier1 | hosting |
| 21.7 | Adaptiv Hemkompass wire (Forge morgon + Paralys dag) | design-modules, compass, locked-ux | hosting |
| 21.8 | Smart Inkast Hem→Hjärtat genväg + toast | inkast, inkast-vardag, locked-ux | hosting |
| 21.9 | Familjen/Hamn polish + brusfilter-wizard PMIR | hamn, grans, locked-ux | none* |
| 21.10 | App Check guard audit + JWT refresh + runbook | valv-security, auth-login, cache | functions:invalidateSession,hosting |
| 21.11 | Android doc-synk + Play Integrity runbook | android-platform, auth-login | none |
| slutrapport | fas21-leverans | tier1, orkester:night | none |

\* 21.9 wizard-impl endast om PMIR godkänd; annars SKIP + blocker-fas21-21.9.md

## Defer

M3.0-C Phase 2 Firestore · BP-PUSH · Gmail OAuth · Genkit V1 · App Check Console Enforce (Pontus) · Play Integrity Console · Hamn wizard impl (efter PMIR) · FP-TI sandbox→prod · Hem→Hjärtat full merge

## PMIR-stopp

firestore.rules · storage.rules · Barnporten kanon-UI · mass-radering · Sacred/Locked UX borttagning · Gmail · Genkit V1

## Manuella gates

[2026-06-18-fas20-manual-pontus-gates.md](./2026-06-18-fas20-manual-pontus-gates.md) (oförändrad)
