# ekonomi — module plan

## Overview

Personal economy module: liquidity, transactions, savings goals — aligned with Livskompassen "Life OS" budget tracking.

## Files

| Path | Role |
|------|------|
| `components/EconomyPage.tsx` | SaldoHero + MetricTile + EmptyState placeholder |

## Status

| Area | Status |
|------|--------|
| EconomyPage layout (design-master §10) | **partial** — UI shell, no data |
| SaldoHero + MetricTile | **done** — placeholder values |
| Transaction CRUD | **missing** |
| Firestore integration | **missing** |

## Dependencies

- `core/ui`: `SaldoHero`, `MetricTile`, `BentoCard`, `EmptyState`, `TimelineEntry` (planned for list)

## Next steps

1. Define Firestore schema for transactions/budgets (or Data Connect).
2. Wire `TimelineEntry` for transaction list; `btn-pill--success` on save.
3. Optional: export for legal/economy evidence (vault handoff).

## Security notes

- Financial data is PII — uid-scoped rules, no cross-user reads.
- Consider separate collection from vault logs with explicit user export.
