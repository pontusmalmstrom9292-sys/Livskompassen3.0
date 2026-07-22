# Backend Våg 3 — säkerhet + hygiene — 2026-06-16

**Fortsätter:** [`2026-06-15-backend-djupanalys.md`](./2026-06-15-backend-djupanalys.md) §7 · [`2026-06-15-backend-vag2-hardening.md`](./2026-06-15-backend-vag2-hardening.md)  
**Status:** Deployad 2026-06-16 (rules + `generateWeeklyInsights`) · smoke PASS

---

## PMIR (kort) — ej Sacred/WORM

| Ändring | Följer med | Försvinner | Risk |
|---------|------------|------------|------|
| `firestore.rules` `inbox_rules` + `daily_intentions` | Owner-scoped CRUD (redan i repo `2449600c0`) | Öppen default-deny lucka | Låg |
| `generateWeeklyInsights` vault-gate | Journal-only utan token; valv med `vaultSessionGrantsVaultRead` | Direkt `reality_vault`-läs utan session | Medel → stängd |
| JWT vs server session dokumentation | Beslut rad nedan | — | Ingen kodändring |
| GCP inventory refresh | Live `functions:list` 2026-06-16 | Stale 49-fn-rad | Ingen kod |

**Ej rört:** `reality_vault`, `children_logs`, `journal`, `kampspar`, `evolution_ledger` rules.

---

## 1. Firestore rules — `inbox_rules` + `daily_intentions`

**Audit (2026-06-16):** Regler finns i `firestore.rules` (commit `2449600c0`). Validering matchar klient:

| Collection | Klient | Rules |
|------------|--------|-------|
| `inbox_rules` | `inboxRulesApi.ts` — label, matchType, pattern, targetTags, targetRouting, priority, enabled | `isOwner` read/update/delete; create via `isOwnerCreate` + fältvalidators |
| `daily_intentions` | `CompassService.ts` — legacy read/write; kanon = `user_daily_focus` | read/create/update owner-scoped; **delete: false** (append-only profil) |

**Smoke:** `smoke:valv-security` inkluderar nu rules-strängar för båda collections.

**Deploy:** `firebase deploy --only firestore:rules`

---

## 2. `generateWeeklyInsights` — vault-gate

| Lager | Fil | Beteende |
|-------|-----|----------|
| Server | `functions/src/callables/generateWeeklyInsights.ts` | `vaultSessionGrantsVaultRead(uid, request.data)` före `reality_vault`-query |
| Klient | `src/modules/reflection/components/WeeklySummary.tsx` | `withVaultSessionPayload({})` |

Utan giltig Valv-session: callable kör fortfarande (insikter + `user_daily_focus`), men **exkluderar** valv-poster — samma mönster som `generateWeeklySummary` / `generateCompassInsight`.

**Deploy:** `firebase deploy --only functions:generateWeeklyInsights` (om prod saknar gate)

---

## 3. Beslut — JWT vs server Valv-session (ingen breaking change)

| Lager | TTL vid unlock | Förnyelse | Syfte |
|-------|----------------|-----------|-------|
| **Server session** (`vaultSessionToken` → `users/{uid}/private/vault_session`) | 1 h (`VAULT_SESSION_IDLE_MS`) | **Sliding** — varje `assertVaultSession` förlänger | Cloud Functions + inkast bevis-routing |
| **JWT claims** (`vaultUnlocked` / `vaultExpiresAt` via `unlockVault`) | 1 h (samma konstant sedan `f11d2c946`) | Endast vid ny `unlockVault` (kräver giltig server-session) | Direkt Firestore `reality_vault` read/write i rules |

**Tidigare gap (djupanalys):** JWT 15 min vs session 1 h — **stängt i kod** (`unlockVault.ts` + `vaultSessionGate.ts` kommentarer).

**Kvarvarande asymmetri (medveten):** JWT förnyas inte vid sliding server-session. Användaren kan förlora Firestore vault-access (~JWT utgång) medan callables fortfarande fungerar tills server-token också går ut.

**Rekommendation (DEFER, PMIR):** Automatisk JWT-förnyelse vid `assertVaultSession` eller klient-side `unlockVault`-retry — **ej implementerat** i våg 3 (breaking risk + auth churn).

---

## 4. Split-brain — `CompassService` vs `user_daily_focus`

| Väg | Status våg 3 |
|-----|----------------|
| Morgonkompass UI (`MorningCompass.tsx`) | Skriver via `morningStore.saveFocus` → **`user_daily_focus`** ✅ |
| `CompassService.saveDailyIntention` | Legacy; **ej anropad** från UI — behålls för migrering |
| `CompassService.getDailyIntentions` | Read-only fallback om kanon tom |
| `OracleService` | Läser fortfarande `daily_intentions` — **DEFER** (Oracle P5+) |

Ingen kodändring våg 3 — dokumenterat för Fas 19+ Morgonkompass-spår.

---

## 5. GCP inventory

Uppdaterad [`docs/GCP-INVENTORY-LATEST.md`](../GCP-INVENTORY-LATEST.md) — **50 functions live** (2026-06-16), inkl. `crushTask`, `weaveJournalEntry`, `onInkastEvidenceFinalized` (Storage trigger, us-east1).

---

## Smoke (agent)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0/functions && npm run build
cd .. && npm run build
npm run smoke:valv-security
npm run smoke:locked-ux
npm run smoke:orkester
npm run smoke:inkast
```

---

## Deploy (efter smoke PASS)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
firebase deploy --only firestore:rules,functions:generateWeeklyInsights
```

---

## Skjutet till våg 4+

- JWT sliding-sync med server-session (PMIR)
- `OracleService` → `user_daily_focus/history` (P5)
- CMEK runtime-verifiering
- Native biometric hardening vs WebAuthn
