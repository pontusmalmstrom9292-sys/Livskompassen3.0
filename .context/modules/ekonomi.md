# Ekonomi

**Kanonisk kod:** `src/modules/features/dailyLife/wellbeing/economy/`  
**Route:** `/vardagen?tab=ekonomi` · **Legacy:** `/ekonomi` → redirect · **Dock:** via Vardagen

Blueprint: veckopeng, matlåda, vinst — inga grafer. Firestore `transactions` (WORM) + `economy_profiles`.

Valv-side panel (PIN): `src/modules/valv_ekonomi/` → `VaultEconomyPanel`.

## Status

| Klart | Planerat |
|-------|----------|
| EconomyPage, Firestore, rules, retention allowlist | `budgets`, lönespec Fas 2 (vendor parity) |

**Spec:** [`docs/specs/modules/Ekonomi-SPEC.md`](../../docs/specs/modules/Ekonomi-SPEC.md)

Kod: `src/modules/features/dailyLife/wellbeing/economy/` · Plan: [`src/modules/features/dailyLife/wellbeing/economy/module_plan.md`](../../src/modules/features/dailyLife/wellbeing/economy/module_plan.md)
