# Fas 22 — Zon 1: Valv + Security (beslutsmemo)

**Datum:** 2026-06-18 · **Läge:** READ-ONLY preflight · **Status:** Godkänd för våg 22.7 + 22.10

## Sammanfattning

Fas 21 levererade JWT `getIdToken(true)` efter `invalidateSession`, App Check/Play Integrity runbooks, och `smoke:valv-security` PASS. **Kvar:** `biffRewriteDraft` callable i kod men ej i fas21 deploy-logg · `coachConversation` skrivs till `mabra_sessions` (mutable, ej WORM-journal) · App Check Console Enforce = Pontus manuellt.

## Inventering

| Område | Nuläge |
|--------|--------|
| Callable-guard | `guardSensitiveCallableV2` på känsliga callables inkl. `biffRewriteDraft` |
| coach WORM | `mabraCoach` nutrition/movement modes skriver `coachConversation` till `mabra_sessions` |
| biffRewriteDraft | Export i `functions/src/index.ts`; Zero Footprint, ingen WORM |
| ValvAnalyseraZone | Valv-route oförändrad; plausible deniability via `vaultSessionOpen` |
| App Check | Runbook `docs/APP-CHECK-ENFORCE-RUNBOOK.md`; enforce ej aktiv i prod |

## IMPLEMENTERA

### Våg 22.7 — Coach WORM-hygien (kod, ej rules)

| # | Scope | Filer |
|---|-------|-------|
| A | Begränsa `coachConversation` till tillåtna nycklar i `mabra_sessions` create | `functions/src/callables/agents.ts` |
| B | Eval-notering | `docs/evaluations/2026-06-18-fas22-vag-22.7.md` |

### Våg 22.10 — App Check enforce-readiness (docs + smoke)

| # | Scope | Filer |
|---|-------|-------|
| A | Staging-checklist i runbook | `docs/APP-CHECK-ENFORCE-RUNBOOK.md` |
| B | Smoke JWT + auth | `smoke:valv-security`, `smoke:auth-login`, `smoke:cache` |

**INGEN** Console Enforce utan Pontus.

## Alternativ — coach WORM-hygien

| Alt | Beskrivning | REK |
|-----|-------------|-----|
| **A** | Enum-validering + trim `coachConversation` keys | **JA** |
| B | Ephemeral RAM-only coach | Bryter MåBra-historik |
| C | Defer | Läckage kvar |

## DEFER

`firestore.rules` · Console Enforce (Pontus) · Play Integrity Console · BP-PUSH · Gmail

## Smoke

22.7: `smoke:valv-security`, `smoke:valv-gate`, `smoke:pattern-metadata`, `smoke:locked-ux`, `smoke:cache`, `smoke:mabra`  
22.10: `smoke:valv-security`, `smoke:auth-login`, `smoke:cache`

## Deploy

22.7: `functions:mabraCoach` (om coach-fix) · 22.10: none
