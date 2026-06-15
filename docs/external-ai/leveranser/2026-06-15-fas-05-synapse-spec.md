# SYNAPSE-LOCK-SPEC

Syfte: Dokumentera och härda synapse-kedjan i Livskompassen v2, med fokus på säkerhet, siloskydd, idempotens och korrekt hantering av edge cases.

---

## 1. Synapse-trigger till handler till silo

| Trigger (SynapseEvent)         | Handler Function           | Target Silo / Collection          |
|-------------------------------|----------------------------|----------------------------------|
| `drive_ingest`                 | `handleDriveIngest`         | `kb_docs` (Kunskap), `reality_vault` (Valv), `children_logs` (Barnen), `inbox_queue` (trauma/LVU) |
| `dcap_alert`                  | `handleDcapAlert`           | `dcap_alerts` (WORM, Valv ownership) |
| `journal_woven`                | `handleJournalWoven`        | `kampspar` (Kunskap, WORM create only) |
| `paralys_brytaren`            | `applyParalysBreak`         | Microsteps for Paralysis Break process (internal orchestration) |

---

## 2. Edge cases i synapseflödet

- **Bevis utan aktiv vault session:**  
  Skall nekas skrivning till `reality_vault` om Vault-session ej autentiserad/säkerställd. Append-only WORM. Gäller strikt vault session-verifiering (se `vaultSessionGate.ts`).

- **Trauma, LVU eller osäkra inkast:**  
  Dessa skall routas via `classifyInboxDocument` till `inbox_queue` för Human-In-The-Loop-granskning. Ingen automatisk placering i `kb_docs` eller `reality_vault`.

- **Ingen cross-silo auto-promote:**  
  Exempel: Barnlogg (children_logs) får ej autotransfereras till Valv eller Kunskap utan explicit HITL.

- **WORM-skydd:**  
  All skapande av poster i `reality_vault`, `children_logs`, `journal` och `dossier_snapshots` är append-only. Uppdateringar och borttagningar är förbjudna via klient och styrs strikt i Firestore-regler.

---

## 3. Idempotens och deduplicering

- Funktion `hashPayload(payload: Record<string, unknown>)` (definierad i `stateStore.ts`) används för att generera konsekvent hash av synapse-payloads.

- Hashen används för att kontrollera att inga dubbla WORM-poster skapas vid synapse-events, säkerställande av idempotens och skydd mot dubblett-insert.

- Vid mottagande av synapse-event kontrolleras att samma payloadHash inte redan finns i append-only-collection.

- Detta gäller särskilt för kritiska WORM-silos som `reality_vault` och `children_logs`.

---

## 4. DCAP-flödet och eskalering

- DCAP (Digital Conversation Analysis Pipeline) analyserar input explicit och implicit enligt regler för att upptäcka risk/missbruk.

- Vid detektion skapas en `dcap_alert`-post i `dcap_alerts`-collection (WORM), med data: riskScore, rekommenderad åtgärd (`NONE`, `COACHING`, `ALERT`), inputHash mm.

- `handleDcapAlert` hanterar skapande av alert, beslutar om Human-In-The-Loop tröskel och vidare vägledning.

- Vid höga risker initieras `paralysBrytarenSynapse` via `applyParalysBreak` för att styra finkornad stegvis (microstep) behandling.

- DCAP har högsta prioritet innan LLM-analys och routing fattas (se `routeFromDcap`), med strikt förbud mot att LLM styr WORM-routing eller auth.

---

## Sammanfattning

- Fyra synapse-triggers: drive_ingest, dcap_alert, journal_woven, paralys_brytaren  
- Varje dispatchad till dedikerad handler, vars output berör en silo med tydliga säkerhets- och append-only-gränser  
- Edge case-hantering för bevis utan vault session och trauma via inkorg (HITL)  
- Idempotens med payload-hash för att undvika dubbletter i WORM-silos  
- DCAP-flödet eskalerar vid risk och initierar mikroprocesser via paralysBrytaren

---

För detaljerad implementation, se:

- `functions/src/adk/synapses/synapseBus.ts`
- `functions/src/adk/synapses/driveIngestSynapse.ts`
- `functions/src/adk/synapses/dcapAlertSynapse.ts`
- `functions/src/adk/synapses/journalWovenSynapse.ts`
- `functions/src/adk/synapses/paralysBrytarenSynapse.ts`
- `functions/src/adk/stateStore.ts` (hashPayload)
- `firestore.rules` (WORM och silo-begränsningar)
- `.context/security.md` (synapse säkerhetsprinciper)

---

Jämför dina ändringar mot hela projektets kontext. Arbeta autonomt och sluta inte förrän koden är helt felfri och appen går att använda.
