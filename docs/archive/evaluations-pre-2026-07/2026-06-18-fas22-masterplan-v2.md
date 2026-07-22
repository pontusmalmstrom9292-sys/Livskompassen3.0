# Fas 22 — Masterplan v2

**Datum:** 2026-06-18 · **Status:** Godkänd för implementation (7 zon-memos syntetiserade)
**Kanon:** [`.cursor/rules/fas22-masterplan-guard.mdc`](../.cursor/rules/fas22-masterplan-guard.mdc)

## Executive summary

Efter Fas 21 DONE: M3.0-C Phase 2 Firestore (PMIR-först), Hamn brusfilter-wizard Alt A, Kunskap våg 30 FACT ingest, biffRewriteDraft deploy, Valv coach/App Check readiness, Android gates, Hem→Hjärtat polish. FP-TI sandbox parallellt utanför sprint. Master YOLO: commit/push/deploy efter trippel-smoke PASS.

## Zon-memos

| Zon | Memo |
|-----|------|
| 1 Valv+Security | [fas22-zone-valv-security.md](./2026-06-18-fas22-zone-valv-security.md) |
| 2 Hjärtat+Inkast | [fas22-zone-hjartat-inkast.md](./2026-06-18-fas22-zone-hjartat-inkast.md) |
| 3 Vardagen | [fas22-zone-vardagen.md](./2026-06-18-fas22-zone-vardagen.md) |
| 4 Familjen+Hamn | [fas22-zone-familjen-hamn.md](./2026-06-18-fas22-zone-familjen-hamn.md) |
| 5 Kunskap+U6 | [fas22-zone-kunskap-innehall.md](./2026-06-18-fas22-zone-kunskap-innehall.md) |
| 6 Repo+arkiv | [fas22-zone-repo-arkiv.md](./2026-06-18-fas22-zone-repo-arkiv.md) |
| 7 Android | [fas22-zone-android-platform.md](./2026-06-18-fas22-zone-android-platform.md) |

## Vågtabell

| Våg | Scope | Smoke-extra | Deploy | PMIR-stopp |
|-----|-------|-------------|--------|------------|
| baseline | orkester:night | — | none | — |
| 22.1 | Fas21→22 doc-synk + sprint-infra | orkester:night, tier1 | none | mass-radering |
| 22.2 | M3.0-C Phase 2 PMIR (rules-eval ONLY) | mabra, innehall | none | firestore.rules doc only |
| 22.3 | M3.0-C Phase 2 Firestore wire | mabra, modulvaljare, evolution-discovery, locked-ux, innehall | firestore:rules, hosting | BLOCKER utan 22.2 OK |
| 22.4 | Hamn brusfilter-wizard Alt A | hamn, grans, locked-ux, design-modules | hosting | Barnporten UI |
| 22.5 | Content våg 30 FACT ingest | content:night, content-waves, kunskap, innehall, locked-ux | seed only | ingen ny FACT utan bank |
| 22.6 | biffRewriteDraft deploy + Hjärtat polish | inkast, inkast-vardag, hamn, locked-ux, superdagbok-superhub | biffRewriteDraft, hosting | Sacred UX |
| 22.7 | Valv coach WORM hygiene | valv-security, valv-gate, pattern-metadata, locked-ux, cache, mabra | mabraCoach | firestore.rules |
| 22.8 | Hem→Hjärtat genväg polish | compass, inkast-vardag, locked-ux | hosting | full merge |
| 22.9 | Android gate-checklist | android-platform, auth-login | none | Console Pontus |
| 22.10 | App Check enforce-readiness | valv-security, auth-login, cache | none | APP_CHECK_ENFORCE Pontus |
| slutrapport | fas22-leverans | tier1, orkester:night | per log | — |

**specialist-verifier:** 22.3, 22.10

## Defer

FP-TI sandbox→prod · Hem→Hjärtat full merge · BP-PUSH · Gmail · Genkit V1 · Barnporten kanon-UI · M3.0-E · movement_reminders · mass-radering

## PMIR-stopp

firestore.rules (utan 22.2 PMIR) · storage.rules · Barnporten kanon-UI · mass-radering · Sacred/Locked UX · Gmail · Genkit V1

## Manuella gates

[2026-06-18-fas20-manual-pontus-gates.md](./2026-06-18-fas20-manual-pontus-gates.md)
