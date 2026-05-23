# ekonomi — module plan

**Canonical spec:** [`docs/specs/modules/Ekonomi-SPEC.md`](../../docs/specs/modules/Ekonomi-SPEC.md) · **Context:** [`.context/modules/ekonomi.md`](../../.context/modules/ekonomi.md)

## Overview

Personal economy module: liquidity, transactions, weekly budget presets — aligned with Livskompassen "Life OS" budget tracking. No graphs, no LLM.

## Files

| Path | Role |
|------|------|
| `components/EconomyPage.tsx` | SaldoHero, MetricTile, quick-add, vinst, TimelineEntry, profil |
| `../../core/firebase/firestore.ts` | `saveEconomyTransaction`, `getEconomyTransactions`, `economy_profiles` |

## Status

| Area | Kod | Status |
|------|-----|--------|
| UI shell (SaldoHero, tiles) | Ja | **done** |
| Veckopeng / matlåda | Ja | **done** |
| Vinst-knapp | Ja | **done** |
| Firestore transactions + profiles | Ja | **done** |
| Spar-bekräftelse | Ja | **done** |
| `budgets` / “kvar av budget” | Nej | **planned** |
| Lönespec (`economy/vendor`) | Backend Fas 2 | **planned** |
| Livs-Coachen här | Nej | **avvisat** |

## Dependencies

- `core/ui`: `SaldoHero`, `MetricTile`, `BentoCard`, `EmptyState`, `TimelineEntry`
- `core/firebase/firestore.ts`, `AuthGate` via `/vardagen`

## Next steps

1. Optional: `budgets` eller tydlig “kvar av veckobudget”-semantik i UI.
2. Optional: explicit export till valv (användarval).
3. Fas 2: callable `generatePayslip` från `functions/src/economy/vendor/` (server-only, tester mot skattetabell).

## Security notes

- Financial data is PII — uid-scoped rules, no cross-user reads.
- Separate collection from `reality_vault`; no RAG.
- `transactions` on retention WORM allowlist.
