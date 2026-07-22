# Fas 19.5 — evolution_ledger dual-write

**Datum:** 2026-06-15 · **Status:** **done**  
**Kanon:** `[INFINITE_EVOLUTION.md](../architecture/INFINITE_EVOLUTION.md)` · `[infinite-evolution.mdc](../../.cursor/rules/infinite-evolution.mdc)`

---

## Leverans


| Spår              | Implementation                                                      |
| ----------------- | ------------------------------------------------------------------- |
| Hub → ledger sync | `syncEvolutionHubToLedger` i `evolutionLedgerFirestore.ts`          |
| Listener-väg      | `useEvolutionSync` → `useEvolutionStore.setDoc` (fingerprint dedup) |
| Hub-skrivning     | `mergeEvolutionHub` (dev/orkester-kompatibel)                       |
| Orkester          | `orkester_barnporten_evaluator.mjs` — kanoniskt ledger-schema       |
| Discovery         | `recordDiscoveryMilestoneIfNew` (kompass-deck, oförändrad)          |


---

## Dual-write triggers


| Händelse                    | Ledger-typ                               |
| --------------------------- | ---------------------------------------- |
| Pelare `level` ökar         | `capacity_increased`                     |
| Ny `unlockedFeatureFlags`   | `milestone_unlocked`                     |
| Barn `currentBracket` byte  | `child_age_milestone`                    |
| Root `barnportenLevel` ökar | `capacity_increased`                     |
| Nytt `unlockedPacks`        | `milestone_unlocked`                     |
| Första kompass-deck-spar    | `milestone_unlocked` (kompass_discovery) |


---

## WORM

- `evolution_ledger`: create-only i `firestore.rules` (`update`/`delete` = false)
- Offline: `assertOfflineWriteAllowed` före client-append

---

## Smoke

```bash
npm run smoke:evolution-discovery
npm run smoke:orkester   # inkluderar functions build
npm run typecheck:core-strict
```

---

## Ej scope (defer)

- Cloud Function trigger på `evolution_hub` onWrite (server-side mirror)
- `user_capability_state` → hub sync (admin-only collection)
- M3.0-C Fitness/Näring

