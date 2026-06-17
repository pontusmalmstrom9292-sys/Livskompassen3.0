# Fas 19 Sprint — slutleverans

**Datum:** 2026-06-18  
**Status:** **DONE**  
**Kanon:** [`2026-06-15-fas19-masterplan-v2.md`](./2026-06-15-fas19-masterplan-v2.md)

---

## Vågar (alla PASS)

| Våg | Innehåll | Deploy prod |
|-----|----------|-------------|
| baseline | orkester:night | — |
| 19.1 | unlockVault P0, App Check guards, D14 ParentReminderFooter | `invalidateSession`, hosting |
| 19.2 | M3.0-B hybrid-8 pelarkort | hosting (via 19.1) |
| 19.3 | hex→tokens P0, typecheck:core-strict | hosting (via 19.1) |
| 19.4 | JOY-17 bankId wire (VitChatFlowPanel) | hosting |
| 19.5 | evolution_ledger dual-write trigger | `onEvolutionHubWrite` |
| 19.6 | arkiv-batch PMIR + orkester:night | — |

---

## Prod LOCK (parallellt)

- P1 Brusfilter v1+v2
- P2 Dossier v2 (AI foreword)

---

## Smoke-baseline (slut)

`smoke:locked-ux` · `smoke:orkester` · `smoke:valv-security` · `smoke:inkast` · `smoke:mabra` · `smoke:innehall` · `smoke:evolution-discovery` · `smoke:design-modules` · `typecheck:core-strict`

---

## Defer (efter Fas 19)

- M3.0-C Fitness/Näring (full UI)
- App Check Console Enforce (manuellt)
- Gmail OAuth / Calendar
- BP-PUSH
- Arkiv-batch **utförande** (PMIR i 19.6 — väntar explicit OK)

---

## Nästa rekommenderade steg

1. **Commit + push** all unstaged Fas 19-diff (32 filer)
2. Manuell Motorola-checklista om Android (`npm run build:web && npx cap sync android`)
3. Valfritt: App Check Enforce i Firebase Console efter Pontus OK
