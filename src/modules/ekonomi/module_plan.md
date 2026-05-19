# ekonomi — module plan

## Overview

Personal economy module: liquidity, transactions, savings goals — aligned with Livskompassen "Life OS" budget tracking.

## Files

| Path | Role |
|------|------|
| `components/EconomyPage.tsx` | Economy bento card (placeholder) |

## Status

| Area | Status |
|------|--------|
| EconomyPage | **partial** — static placeholder |
| Transaction CRUD | **missing** |
| Firestore integration | **missing** |

## Dependencies

- `core/ui/BentoCard`

## Next steps

1. Define Firestore schema for transactions/budgets (or Data Connect).
2. Build list + summary views; link from FloatingDock if needed.
3. Optional: export for legal/economy evidence (vault handoff).

## Security notes

- Financial data is PII — uid-scoped rules, no cross-user reads.
- Consider separate collection from vault logs with explicit user export.
