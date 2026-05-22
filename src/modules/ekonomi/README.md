# ekonomi

> Budget och likviditet — placeholder utan Firestore-schema ännu.

## Syfte

Veckopeng, matlåda-knapp, inga grafer. Kognitiv avlastning för vardagsekonomi. **Inte** Livs-Coachen (→ Kunskap).

## Route och ingång

| | |
|---|---|
| **Route** | `/ekonomi` |
| **AuthGate** | ja |
| **Dock** | Map |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/EconomyPage.tsx` | SaldoHero + MetricTile + EmptyState (placeholder) |

## Data

Ingen Firestore-collection ännu. Data Connect avvaktas (system-plan).

## Beror på

- `core` — SaldoHero, MetricTile, layout, auth

## Kopplingar

Inga datakopplingar till Valv, Dagbok eller Kunskap.

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | `transactions`, `economy_profiles` |
| **RAG / chatt** | Nej |
| **PDF / samlad export** | — |
| **Planerat** | — |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/ekonomi.md)
- [Ekonomi-SPEC](../../../docs/specs/modules/Ekonomi-SPEC.md)
