# ekonomi

> Vardagsekonomi — veckopeng, matlåda, vinst. Firestore live, inga grafer.

## Syfte

Veckopeng, matlåda-knapp, vinst-knapp, transaktionslista. Kognitiv avlastning. **Inte** Livs-Coachen (→ Kunskap).

## Route och ingång

| | |
|---|---|
| **Route** | `/ekonomi` → `/vardagen?tab=ekonomi` |
| **AuthGate** | ja (via `/vardagen`) |
| **Dock** | Map → Vardagen |

## Viktiga filer

| Fil | Roll |
|-----|------|
| `components/EconomyPage.tsx` | SaldoHero, snabbknappar, lista, profil |

## Data

| Collection | Roll |
|------------|------|
| `transactions` | WORM append-only |
| `economy_profiles` | veckobudget, matlåda-preset |

Lönespec (Fas 2): `functions/src/economy/vendor/` — ej kopplad till UI.

## Beror på

- `core` — SaldoHero, MetricTile, firestore helpers, auth

## Kopplingar

Inga datakopplingar till Valv, Dagbok eller Kunskap RAG.

## Minne / AI

| | |
|---|---|
| **Permanent lagring** | `transactions`, `economy_profiles` |
| **RAG / chatt** | Nej |
| **PDF / samlad export** | Planerat (explicit val) |

## Mer läsning

- [module_plan.md](./module_plan.md)
- [Kontext (.context)](../../../.context/modules/wellbeing/economy.md)
- [Ekonomi-SPEC](../../../docs/specs/modules/Ekonomi-SPEC.md)
