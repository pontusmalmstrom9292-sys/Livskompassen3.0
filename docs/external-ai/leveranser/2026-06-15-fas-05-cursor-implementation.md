# PHASE-05 Synapse lock — Cursor-implementering (CP-5)

**Datum:** 2026-06-15  
**Resultat:** **PASS** (minimal diff — live-kod redan G10/G7/U2.5-komplett)

---

## Filer ändrade

| Fil | Ändring |
|-----|---------|
| `functions/src/adk/synapses/journalWovenSynapse.ts` | Idempotens: dedup via `ownerId` + `journalEntryId` + `source: journal_woven` före kampspar-insert |
| `functions/src/adk/synapses/dcapAlertSynapse.ts` | Idempotens: dedup via `ownerId` + `inputHash` före dcap_alerts-insert |
| `docs/external-ai/SYNAPSE-LOCK-SPEC.md` | Ny kanon (korrigerade trigger-namn mot live-kod) |
| `docs/external-ai/CHECKPOINT-LOG.md` | CP-5 PASS |
| `docs/external-ai/LIFE-OS-BUILD-STATE.md` | SynapseBus → LOCK |

**Ej ändrade (redan korrekta):** `synapseBus.ts`, `driveIngestSynapse.ts`, `stateStore.ts`, `vaultSessionGate.ts`, `inboxPersist.ts`, `firestore.rules`

---

## ChatBox-förslag som hoppades över

### `driveIngestSynapse.ts` (helomskrivning) — **SKIP**

- Live har redan G10: `classifyInboxDocument` → `applyInkastConfidenceGate` → `routeInboxToWorm`.
- `hasVaultSession: false` för Drive background är **korrekt** — bevis köas till `inbox_queue` (spec §2), inte `assertVaultSession` (saknar token i webhook).
- ChatBox använder fel API: `classifyInboxDocument(payload)`, `routeInboxToWorm('reality_vault', ...)`, rekursiv `emitSynapse`, trigger `drive_ingest` (live: `drive_file_ingested`).
- `orchestrator.checkPayloadHashExists` finns inte i kodbasen.

### `dcapAlertSynapse.ts` (stub-helpers) — **SKIP**

- Live har redan Admin SDK WORM-write, `hitlRequired`, `hashPayload`.
- ChatBox `saveDcapAlert` / `checkExistingDcapAlert` returnerade hårdkodade stubs (`'new-dcap-alert-id'`, `null`).
- Endast verifierad lucka applicerad: Firestore dedup på `inputHash`.

### `journalWovenSynapse.ts` (stub-helpers) — **SKIP**

- Live har redan opt-in, embedding, `kampspar` + vector upsert.
- ChatBox `upsertJournalToKampspar` / `checkDuplicateJournalEntry` var EJ VERIFIERAT-stubs.
- Endast verifierad lucka: dedup på `journalEntryId`.

### `synapseBus.ts` — **SKIP**

- Live trigger-map korrekt: `drive_file_ingested`, `journal_woven`, `dcap_alert`, `user_overwhelm`.
- ChatBox bytte till `drive_ingest`, `paralys_brytaren`, `event.type` — bryter smoke + callables.

### `stateStore.ts` — **SKIP**

- `hashPayload` finns redan (16-teckens SHA-256 prefix + `appendMutation`).
- ChatBox ändrade hash-format (full hex, sorterade keys) — onödig breaking change.

### `vaultSessionGate.ts` — **SKIP**

- Live använder `users/{uid}/private/vault_session` med sliding TTL.
- ChatBox föreslog `vault_sessions`-collection — fel schema, bryter unlock/callables.

---

## Verify

```bash
cd functions && npm run build   # PASS
npm run smoke:orkester          # PASS
```

---

## Snapshot (Pontus kör vid LOCK)

```bash
./scripts/snapshot_locked_module.sh synapser
```
