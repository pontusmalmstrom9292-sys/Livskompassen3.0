# Backend Våg 4 — Oracle fix + evolution_hub server-mirror — 2026-06-16

**Fortsätter:** [`2026-06-16-backend-vag3-security-hygiene.md`](./2026-06-16-backend-vag3-security-hygiene.md) · [`2026-06-15-fas19-5-evolution-ledger-dual-write.md`](./2026-06-15-fas19-5-evolution-ledger-dual-write.md)  
**Status:** Implementerad · smoke PASS · deploy `onEvolutionHubWrite` väntar godkännande

---

## PMIR (kort) — ej Sacred/WORM rules

| Ändring | Följer med | Försvinner | Risk |
|---------|------------|------------|------|
| `OracleService` → `user_daily_focus/history` | Kanonisk 7-dagars fokus + legacy `daily_intentions` per dag | Oracle läser inte längre enbart legacy | Låg |
| `onEvolutionHubWrite` (europe-west1) | Server-side `syncEvolutionHubToLedger` + dedup | — | Låg (dedup mot dubbel client+server) |
| `shared/evolution/evolutionHubLedgerSync.ts` | Fingerprint + diff-logik delad client/functions | Duplicerad diff i store/ledger | Låg |

**Ej rört:** `firestore.rules`, Valv-UI, JWT sliding-sync, CMEK, locked UX.

---

## 1. OracleService → `user_daily_focus`

| Väg | Före | Efter |
|-----|------|-------|
| Primär | `daily_intentions` query 7 d | `user_daily_focus/{uid}/history` + root (idag) |
| Fallback | — | `daily_intentions` read-only per dag utan kanon-rad (samma mönster som `CompassService`) |

**Fil:** `src/modules/oracle/services/OracleService.ts` — ingen Oracle UI/design ändrad.

---

## 2. `onEvolutionHubWrite` — server mirror

| Lager | Fil | Beteende |
|-------|-----|----------|
| Trigger | `functions/src/triggers/onEvolutionHubWrite.ts` | `evolution_hub/{uid}` onWrite, region `europe-west1` |
| Sync | `functions/src/lib/evolutionHubLedgerServer.ts` | `syncEvolutionHubToLedgerServer` — append-only |
| Delad diff | `shared/evolution/evolutionHubLedgerSync.ts` | `hubLedgerFingerprint`, `collectLedgerEntriesFromHubDiff`, `ledgerEntryDedupKey` |
| Client | `evolutionLedgerFirestore.ts` + `useEvolutionStore.ts` | Importerar delad modul; client dedup vid append |

**WORM:** `evolution_ledger` — endast `add`/`create`; inga update/delete (rules oförändrade).

**Dubbelväg:** Client (`useEvolutionSync` → `syncEvolutionHubToLedger`) + server trigger. Dedup-nyckel per ledger-rad förhindrar dubbel append vid samma hub-diff.

---

## Smoke

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0/functions && npm run build
cd .. && npm run build
npm run smoke:evolution-discovery
npm run smoke:orkester
npm run smoke:locked-ux
```

---

## Deploy (efter smoke PASS)

```bash
cd /Users/Livskompassen/StudioProjects/Livskompassen3.0
firebase deploy --only functions:onEvolutionHubWrite
```

Frontend (`OracleService`) kräver endast `npm run build` + hosting om prod ska få Oracle-fix direkt — **ingen** ny callable.

---

## Skjutet (oförändrat)

- JWT sliding-sync med server-session (PMIR)
- CMEK runtime-verifiering
- Native biometric hardening vs WebAuthn
