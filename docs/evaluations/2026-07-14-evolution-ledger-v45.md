# Evolution ledger v45 — Build eval

**Datum:** 2026-07-14  
**Wave:** EVOLUTION-LEDGER (YOLO v45)  
**Task:** b45-build  
**Agent:** marathon-yolo-vakt  
**PMIR:** NO · **Deploy:** NONE

---

## 1. Verdict

**GO** — Evolution ledger infinite-sync implementation is architecturally sound; static + WORM smokes pass. Live hub→trigger append deferred to deploy/gate (see SKIP).

---

## 2. Scope audited

| File | Role | Status |
|------|------|--------|
| `shared/evolution/evolutionHubLedgerSync.ts` | Shared pure diff, fingerprint, dedup keys | OK |
| `functions/src/lib/evolutionHubLedgerServer.ts` | Admin SDK append-only mirror | OK |
| `functions/src/triggers/onEvolutionHubWrite.ts` | `evolution_hub/{uid}` onWrite → ledger | OK |
| `src/modules/core/firebase/evolutionLedgerFirestore.ts` | Client dual-write removed; callable discovery; `mergeEvolutionHub` | OK |
| `src/modules/core/store/useEvolutionStore.ts` | Hub snapshot only; no client ledger writes | OK |
| `src/modules/core/hooks/useEvolutionSync.ts` | AppShell hub listener | OK |
| `scripts/smoke_evolution.mjs` | WORM + static rules + optional live hub/trigger | PASS |
| `scripts/smoke_evolution_discovery.mjs` | Static wiring + rules assertions | PASS |

---

## 3. Architecture summary

```
Client                          Server (Admin SDK)
──────                          ──────────────────
mergeEvolutionHub ──write──► evolution_hub/{uid}
                                      │
useEvolutionSync / store ◄──read──────┤
                                      ▼
                              onEvolutionHubWrite
                                      │
                              collectLedgerEntriesFromHubDiff (shared)
                                      │
                              append evolution_ledger (dedup + WORM)

recordDiscoveryMilestoneIfNew ──callable──► recordDiscoveryMilestoneServer ──► evolution_ledger
```

**WORM:** `firestore.rules` — `evolution_ledger` create/update/delete `false`; client stubs in `evolutionLedgerFirestore.ts` are no-ops (P2.4).

**Dedup:** `ledgerEntryDedupKey` / `hubLedgerFingerprint` prevent duplicate appends on client+server paths.

**First write:** `collectLedgerEntriesFromHubDiff` returns `[]` when `prev === null` — initial hub creation does not flood ledger.

---

## 4. Smoke results

| Script | Exit | Notes |
|--------|------|-------|
| `npm run smoke:evolution-discovery` | **0** | Static wiring, WORM rules, no client dual-write |
| `npm run smoke:evolution` | **0** | WORM denied (create/update/delete); static rules OK |

### smoke:evolution detail

- **Test 1 (WORM):** Client create/update/delete on `evolution_ledger` — all NEKAD (OK).
- **Test 2 (hub live):** SKIPPED — permission-denied (prod rules/App Check not available for seed user in dry-run).
- **Test 3 (trigger):** SKIPPED — depends on hub live write.

---

## 5. SKIP / observations (non-blocking)

| ID | Item | Reason |
|----|------|--------|
| SKIP-1 | Live hub write + `onEvolutionHubWrite` append | Dry-run: hub live SKIPPED; trigger unverified until deploy + seed credentials with hub write |
| SKIP-2 | `evolution_ledger` read query in smoke | Permission-denied or empty collection for seed uid — expected in restricted env |
| OBS-1 | Duplicate hub listeners | `useEvolutionSync` (App.tsx) + `listenToEvolutionHub` (HomeAdaptiveCompass, HemV3DevelopmentRail) — redundant subscriptions; pre-existing, out of b45-build scope |

No PMIR files touched. No code changes required for b45-build.

---

## 6. Gate handoff

- **b45-build:** completed  
- **Next:** b45-gate — re-run `npm run smoke:evolution` after deploy if hub/trigger live path required for full GO
