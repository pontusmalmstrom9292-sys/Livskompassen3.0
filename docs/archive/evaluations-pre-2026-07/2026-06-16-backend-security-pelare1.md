# Backend säkerhet — pelare 1 verifiering

**Datum:** 2026-06-16 · **Status:** PASS (befintlig kod + minimal guard-fix)

## Redan implementerat (ingen kodändring krävdes)

| Gap (djupanalys) | Verifierat |
|------------------|------------|
| `inbox_rules` Firestore rules | `firestore.rules` L988–1032 |
| `daily_intentions` Firestore rules | `firestore.rules` L1034–1049 |
| `generateWeeklyInsights` vault-gate | `vaultSessionGrantsVaultRead` i callable |
| JWT vs session TTL | Dokumenterat i `vaultSessionGate.ts` (1h båda) |

## Implementerat nu

| Ändring | Fil |
|---------|-----|
| `guardSensitiveCallableV2` på `calculateSmartAllocation` | `functions/src/economy/calculateSmartAllocation.ts` |

## Smoke

```bash
npm run smoke:vault-worm
npm run smoke:valv-gate
```
