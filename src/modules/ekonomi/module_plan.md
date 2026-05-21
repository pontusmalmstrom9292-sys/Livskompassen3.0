# ekonomi — module plan

**Canonical spec:** [`docs/specs/incoming/Ekonomi-SPEC.md`](../../docs/specs/incoming/Ekonomi-SPEC.md) · **Context:** [`.context/modules/ekonomi.md`](../../.context/modules/ekonomi.md)

## Overview

Personal economy module: liquidity, transactions, savings goals — aligned with Livskompassen "Life OS" budget tracking.

## Files

| Path | Role |
|------|------|
| `components/EconomyPage.tsx` | SaldoHero + MetricTile + EmptyState placeholder |

## Status

| Area | Kladd 2026-05-21 | Kod | Status |
|------|------------------|-----|--------|
| UI shell (SaldoHero, tiles) | Inga grafer | Ja | **partial** |
| Veckopeng / matlåda | Notebook | Nej | **planned** |
| Vinst-knapp | Kladd | Nej | **planned** |
| Firestore / DC schema | System-plan | Nej | **planned** |
| Livs-Coachen här | **Avvisat** | Nej | **avvisat** |

**Källa:** [`Kladd-2026-05-21-PERSONAL-MASTER.md`](../../docs/specs/incoming/Kladd-2026-05-21-PERSONAL-MASTER.md)

## Dependencies

- `core/ui`: `SaldoHero`, `MetricTile`, `BentoCard`, `EmptyState`, `TimelineEntry` (planned for list)

## Next steps

1. Define Firestore schema for transactions/budgets (or Data Connect).
2. Wire `TimelineEntry` for transaction list; `btn-pill--success` on save.
3. Optional: export for legal/economy evidence (vault handoff).

## Security notes

- Financial data is PII — uid-scoped rules, no cross-user reads.
- Consider separate collection from vault logs with explicit user export.
