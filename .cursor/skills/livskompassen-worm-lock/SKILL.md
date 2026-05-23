---
name: livskompassen-worm-lock
description: WORM Firestore rules, isLocked payloads, Admin-only callables, Kill Switch, Zero Footprint. G17 valv PIN documented as GAP.
---

# WORM, låsning och Zero Footprint

Rule: [`.cursor/rules/worm-zero-footprint.mdc`](../../rules/worm-zero-footprint.mdc)  
Firestore skill: plugin `firebase-firestore-standard`

## Layers

| Layer | What | Evidence |
|-------|------|----------|
| Firestore WORM | Client `update`/`delete` denied on evidence | `firestore.rules` — e.g. `reality_vault`, `dcap_alerts`, `payslip_snapshots`, `inbox_queue`, `system_synapses` |
| Semantic `isLocked` | Create-only payload guard | `src/modules/core/firebase/firestore.ts` — `assertWormPayload`, `saveVaultLog` |
| Admin-only writes | Payslip, dossier, inbox confirm, DCAP alerts | `generatePayslipInternal.ts`, `inboxPersist.ts`, `dcapAlertSynapse.ts` |
| Kill Switch | Logout clears caches + ADK state | `invalidateSession` callable → `kompis-supervisor.invalidateUserSession` → `clearSynapseState` |
| Retention | WORM collections never purged | `functions/src/jobs/retentionJob.ts` — `WORM_COLLECTIONS_NEVER_PURGE` |

## Intentionally mutable (owner CRUD)

- `time_entries`, `economy_ledger`, `economy_fixed_bills`, `budget_savings`, `economy_profiles`
- Client path: [`timeEconomyFirestore.ts`](../../../src/modules/core/firebase/timeEconomyFirestore.ts) with `ownerId` checks

## Callable auth pattern (PASS)

All HTTPS callables in [`functions/src/index.ts`](../../../functions/src/index.ts) require `context.auth` and scope work to `context.auth.uid` (audited 2026-05-23):

`generateEmbedding`, `analyzeMessage`, `invalidateSession`, `generatePayslip`, `ingestKampsparEntry`, `weaveJournalEntry`, `journalWovenToKampspar`, `getAgentRegistry`, `speglingsMirror`, `mabraCoach`, `generateDossier`, `breakDownResponse`

Exceptions (server trust, no user JWT):

- `notifyNewFile` — HTTP + `X-Livskompassen-Webhook-Secret`; prod fail-closed without secret (`index.ts` ~213–224)
- `scheduledRetentionJob`, `scheduledGeneratePayslip` — scheduler

**GAP:** `emailVerified` is **not** enforced in `firestore.rules` today — do not claim PASS for verified-email writes.

## GAP G17 — Valv / Barnen gate (open)

| Mechanism | Status |
|-----------|--------|
| Firebase Auth | **PASS** — gates Firestore + callables |
| `VITE_VAULT_PIN` / localStorage PIN | **GAP** — client-only (`VaultPage.tsx`) |
| WebAuthn | **GAP** — no server assertion (`webauthn.ts`) |
| `isVaultUnlocked` (Zustand) | UI only |

Trigger server work: `kör G17` — [`G17-Server-PIN-WebAuthn-GAP.md`](../../../docs/specs/modules/G17-Server-PIN-WebAuthn-GAP.md).

## Smoke

- Logout → `invalidateSession` (Kill Switch uses same path)
- Synapse emit sites: see [`livskompassen-synapse-connections`](../livskompassen-synapse-connections/SKILL.md)
- Checklist row in [`docs/SMOKE_CHECKLIST.md`](../../../docs/SMOKE_CHECKLIST.md) #22

## Related

- [`livskompassen-synapser-adk`](../livskompassen-synapser-adk/SKILL.md) — `clearSynapseState`
- Grunder U2 agent — Kill Switch, `dcap_alert` HITL
