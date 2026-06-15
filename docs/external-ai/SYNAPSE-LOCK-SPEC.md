# SYNAPSE-LOCK-SPEC

Syfte: Dokumentera och härda synapse-kedjan i Livskompassen v2, med fokus på säkerhet, siloskydd, idempotens och korrekt hantering av edge cases.

Kanon: `functions/src/adk/synapses/` · smoke: `npm run smoke:orkester`

---

## 1. Synapse-trigger till handler till silo

| Trigger (SynapseEvent) | Handler Function | Target Silo / Collection |
|------------------------|------------------|--------------------------|
| `drive_file_ingested` | `handleDriveIngest` | `kb_docs` (Kunskap), `reality_vault` (Valv), `children_logs` (Barnen), `inbox_queue` (trauma/LVU) |
| `dcap_alert` | `handleDcapAlert` | `dcap_alerts` (WORM, Valv ownership) |
| `journal_woven` | `handleJournalWoven` | `kampspar` (Kunskap, WORM create only) |
| `user_overwhelm` | `applyParalysBreak` | Mikrosteg (session/ephemeral — Paralys-Brytaren) |

Koppling: `notifyNewFile` → `emitSynapse(..., drive_file_ingested)`.

---

## 2. Edge cases i synapseflödet

- **Bevis utan aktiv vault session:**  
  Drive background ingest sätter `hasVaultSession: false` → `routeInboxToWorm` köar bevis till `inbox_queue` tills användaren bekräftar med öppet Valv (HITL via `confirmInboxQueueItem`). Ingen direkt skrivning till `reality_vault` utan session.

- **Trauma, LVU eller osäkra inkast:**  
  `requiresHumanReview` + `classifyInboxDocument` → `inbox_queue`. Ingen automatisk placering i `kb_docs` eller `reality_vault`.

- **Ingen cross-silo auto-promote:**  
  Barnlogg (`children_logs`) får ej autotransfereras till Valv eller Kunskap utan explicit HITL.

- **WORM-skydd:**  
  `reality_vault`, `children_logs`, `journal`, `dossier_snapshots`, `dcap_alerts` — append-only. Uppdateringar och borttagningar förbjudna via klient.

- **Bevis → aldrig kb_docs:**  
  G10: bevis-routing går till `reality_vault` eller kö — **MUST NOT** auto `kb_docs` för bevis.

---

## 3. Idempotens och deduplicering

- `hashPayload(payload)` i `stateStore.ts` — SHA-256 prefix (16 tecken), ingen rå PII i synapstillstånd.

- **Drive ingest:** `persistVaultFromInbox` deduplicerar via `sourceRef` (drive file id).

- **DCAP alert:** deduplicering via `ownerId` + `inputHash` före insert i `dcap_alerts`.

- **Journal woven:** deduplicering via `ownerId` + `journalEntryId` + `source: journal_woven` före insert i `kampspar`.

- **Inbox queue:** deduplicering via `ownerId` + `driveFileId` + `status: pending`.

---

## 4. DCAP-flödet och eskalering

- DCAP analyserar input före LLM (`routeFromDcap`, `classifyInboxDocument`).

- Vid risk ≥70 eller `recommendedAction === 'ALERT'` → WORM-post i `dcap_alerts` med `hitlRequired`.

- `user_overwhelm` / Paralys-Brytaren: mikrosteg vid tungt agentsvar (orchestrator + `breakDownResponse` callable).

- DCAP har högsta prioritet — LLM får inte styra WORM-routing eller auth.

---

## Sammanfattning

- Fyra synapse-triggers: `drive_file_ingested`, `dcap_alert`, `journal_woven`, `user_overwhelm`
- Varje trigger → dedikerad handler med tydliga silo-gränser
- Edge case: bevis utan vault session → `inbox_queue`; trauma → HITL
- Idempotens: hash + collection-specifika dedup-nycklar
- DCAP eskalerar till `dcap_alerts` WORM vid tröskel

---

## Referensfiler

- `functions/src/adk/synapses/synapseBus.ts`
- `functions/src/adk/synapses/driveIngestSynapse.ts`
- `functions/src/adk/synapses/dcapAlertSynapse.ts`
- `functions/src/adk/synapses/journalWovenSynapse.ts`
- `functions/src/adk/synapses/paralysBrytarenSynapse.ts`
- `functions/src/adk/stateStore.ts`
- `functions/src/lib/inboxPersist.ts` (`routeInboxToWorm`)
- `functions/src/lib/vaultSessionGate.ts`
- `firestore.rules` (WORM)
- `.context/security.md`
