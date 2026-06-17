# Fas 19 Sprint — slutleverans

**Datum:** 2026-06-18  
**Status:** **DONE**  
**Kanon:** [`2026-06-15-fas19-masterplan-v2.md`](./2026-06-15-fas19-masterplan-v2.md)  
**State:** `.orkester/fas19-state.json` → `status: done`

---

## Vågar (alla PASS)

| Våg | Innehåll | Eval |
|-----|----------|------|
| baseline | orkester:night | — |
| 19.1 | unlockVault P0, App Check, LEG-VAULT, ParentReminderFooter | `2026-06-18-fas19-vag-19.1.md` |
| 19.2 | M3.0-B hybrid-8 + hasSeen pelarväljare | `2026-06-18-fas19-vag-19.2.md` |
| 19.3 | hex→tokens P0, typecheck:core-strict | `2026-06-18-fas19-vag-19.3.md` |
| 19.4 | JOY-17 bankId wire (VitChatFlowPanel) | `2026-06-18-fas19-vag-19.4.md` |
| 19.5 | evolution_ledger dual-write | `2026-06-18-fas19-vag-19.5.md` |
| 19.6 | arkiv-batch PMIR + orkester:night | `2026-06-18-fas19-vag-19.6.md` |

---

## Prod deploy (denna sprint)

| Resurs | Våg |
|--------|-----|
| `functions:unlockVault`, `functions:invalidateSession` | 19.1 |
| `hosting` (flera vågor) | 19.1–19.4 |
| `functions:onEvolutionHubWrite` | 19.5 |

---

## Smoke-baseline (slut)

`smoke:locked-ux` · `smoke:orkester` · `smoke:valv-security` · `smoke:inkast` · `smoke:mabra` · `smoke:innehall` · `smoke:evolution-discovery` · `smoke:design-modules` · `typecheck:core-strict`

---

## Defer (efter Fas 19 — kräver Pontus OK)

- M3.0-C Fitness/Näring (full UI)
- App Check Console Enforce (manuellt i Firebase Console)
- Gmail OAuth / Google Calendar
- BP-PUSH (Barnporten push)
- Arkiv-batch **utförande** (PMIR dokumenterad i 19.6 — ingen radering utförd)
- Genkit V1 / Dotprompt

---

## Nästa steg (Pontus)

1. **Commit + push** unstaged Fas 19-diff till `main` (PMIR före merge enligt `docs/MERGE-IMPACT-RAPPORT.md`)
2. Hard refresh webb efter deploy (`Cmd + Shift + R`)
3. Valfritt Android: `npm run build:web && npx cap sync android`
