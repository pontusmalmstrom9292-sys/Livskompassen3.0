# Synapser ingest våg 2 — widget recording design

**Datum:** 2026-06-19  
**Status:** Designbeslut / read-only underlag  
**Scope läst:** `functions/src/adk/synapses/synapseBus.ts`, `functions/src/adk/synapses/driveIngestSynapse.ts`, `functions/src/adk/manifest.ts`, `functions/src/callables/agents.ts`, `functions/src/lib/inboxPersist.ts`, `functions/src/adk/stateStore.ts`, `src/modules/features/widgets/api/widgetVaultRecording.ts`, `docs/design/HOMESCREEN-WIDGETS-SPEC.md`

---

## 1. Live-läge som påverkar beslutet

1. `SynapseBus` har i dag endast fyra live triggers: `drive_file_ingested`, `journal_woven`, `dcap_alert`, `user_overwhelm` (`functions/src/adk/synapses/synapseBus.ts:14-32`, `functions/src/adk/manifest.ts:13-17`).
2. `emitSynapse()` routar bara till handler; den skriver **inte** själv någon trace eller mutation (`functions/src/adk/synapses/synapseBus.ts:35-43`).
3. ADK trace uppstår först när `AdkOrchestrator.dispatch()` kör `appendMutation(...)`, och då lagras endast `payloadHash`, inte rå payload (`functions/src/adk/orchestrator.ts:50-55`, `functions/src/adk/stateStore.ts:29-42`).
4. Synapse-state är ephemeralt i minnet och rensas via `clearSynapseState()` (`functions/src/adk/stateStore.ts:45-47`).
5. Drive-ingest använder synapse + deterministisk routing till `routeInboxToWorm(...)` och därefter optional A2A-dispatch till Mönster-Arkivarien (`functions/src/adk/synapses/driveIngestSynapse.ts:37-52`, `:64-84`).
6. `routeInboxToWorm(...)` ger **durable provenance** via `sourceRef`, `persistedCollection`, `persistedDocId` och `inbox_queue` men är fortfarande semantiskt formad för Drive/Inkast:
   - queue-fältet heter `driveFileId` (`functions/src/lib/inboxPersist.ts:10-30`)
   - WORM-källref byggs av `driveInboxSourceRef()` och prefixar `drive:` (`functions/src/lib/inboxPersist.ts:89`, `:142`, `functions/src/lib/wormPayload.ts:56-58`)
7. Widget-flödet idag är tvåstegat:
   - callable `ingestWidgetRecording` gör bara analys/titel/sammanfattning (`functions/src/callables/agents.ts:644-666`)
   - klienten laddar upp ljudfil och gör sedan direkt WORM-save via `saveVaultLog(...)` efter metadata-steget `vem/vad/varför` (`src/modules/features/widgets/api/widgetVaultRecording.ts:96-139`)
8. Widget-specen är explicit: **WH1 går till Valvet** efter metadata-steget, inte till Kunskap (`docs/design/HOMESCREEN-WIDGETS-SPEC.md:36-69`).

---

## 2. Fråga 1 — ny trigger eller utöka `ingestWidgetRecording`?

## Alternativ A — utöka befintlig `ingestWidgetRecording` callable

**Idé:** Låt samma callable göra analys **och** commit till WORM.

### Fördelar

- Minsta diff i functions-lagret.
- Ingen ny synapse-typ behövs.
- Passar dagens widget-spec om målet fortfarande är ren Valv-save.

### Nackdelar

- Blandar två olika faser som idag är tydligt separerade i UX: `prepare` och `lock` (`src/modules/features/widgets/api/widgetVaultRecording.ts:96-139`).
- Ger ingen SynapseBus-koppling för ingest våg 2.
- Risk att callable blir både analys, auth-gate, provenance-builder och WORM-writer i ett.
- Sämre återanvändning om widget senare ska stödja HITL/queue eller fler destinationsval.

### Bedömning

**Ej rekommenderad** för ingest våg 2. Bra som kortsiktig patch, svag som arkitektur.

---

## Alternativ B — ny trigger `widget_recording_ingested` som återanvänder `routeInboxToWorm()` rakt av

**Idé:** Efter metadata-steget emitteras en synapse som kör samma routingmotor som Drive/Inkast.

### Fördelar

- Konsekvent med north star: nya källor går via SynapseBus.
- Återanvänder queue/HITL-mönster och WORM-routing.
- Ger gemensam plats för framtida widget-ingestregler.

### Nackdelar

- `routeInboxToWorm()` är idag Drive/Inkast-formad, inte generisk:
  - queue använder `driveFileId` (`functions/src/lib/inboxPersist.ts:12-14`, `:43-46`)
  - `sourceRef` blir `drive:...` via `driveInboxSourceRef()` (`functions/src/lib/wormPayload.ts:56-58`)
- Widget-provenance skulle därför bli tekniskt fungerande men semantiskt fel (`drive:widget_...`).
- För WH1 är primär destination redan låst till Valvet i specen; full klassificeringsmotor är överdimensionerad i första vågen.

### Bedömning

**Delvis rätt riktning, men ej ren nog i nuvarande kodbas.** Kräver först genericering av source-modellen.

---

## Alternativ C — rekommenderad hybrid

**Idé:** Behåll `ingestWidgetRecording` som ren **prepare/analyze**-callable. Lägg till en separat commit-väg som efter metadata-steget emitterar en ny trigger `widget_recording_ingested`. Den triggen använder **widget-specifik provenance** och server-side WORM-write till Valvet. Genericering av `routeInboxToWorm()` tas i nästa steg om fler icke-Drive-källor ska dela samma lane.

### Fördelar

- Bevarar dagens låsta UX: analys först, metadata sedan, därefter låsning i Valvet.
- Ger en riktig SynapseBus-entry för ingest våg 2.
- Håller prepare/commit separerade.
- Gör provenance korrekt för widget i stället för att låtsas att widget är Drive.
- Gör det möjligt att senare flytta över till en generisk `routeInboxToWorm()` utan att bryta widget-kontraktet.

### Nackdelar

- En extra callable eller commit-handler behövs.
- Lite mer backend-yta än alternativ A.

### Rekommendation

**Välj C.**  
Motiv: ingest våg 2 behöver en riktig synapse, men widget bör inte återanvända Drive-provenance som den ser ut idag. Först separera commit till servern och ge widget ett korrekt `sourceRef`; genericera därefter den gemensamma ingest-lanen om fler källor kräver det.

---

## 3. Fråga 2 — hur provenance flödar via `emitSynapse` vs direkt `routeInboxToWorm`

## A. `emitSynapse(...)`

`emitSynapse()` är en **orchestration envelope**, inte ett durable provenance-lager (`functions/src/adk/synapses/synapseBus.ts:35-43`).

### Vad den ger

- trigger → handler routing
- möjlighet till ADK trace **om** handlern senare kör `orchestrator.dispatch(...)`
- session-koppling via `contextId`

### Vad den inte ger

- ingen WORM-post
- inget `sourceRef`
- ingen köpost
- ingen durable audit trail i Firestore

### Viktig detalj

Om handlern **inte** kör `orchestrator.dispatch(...)`, uppstår ingen mutation i state store alls. `emitSynapse()` ensam räcker alltså inte som provenance.

---

## B. Direkt `routeInboxToWorm(...)`

`routeInboxToWorm()` är i dag den väg som faktiskt materialiserar provenance i data (`functions/src/lib/inboxPersist.ts:281-440`).

### Vad den ger

- `sourceRef` på WORM-dokument
- queue-post för HITL
- `persistedCollection` / `persistedDocId` efter confirm
- fail-closed till `inbox_queue` vid osäker routing

### Begränsning idag

Den är fortfarande källmässigt biasad mot Drive/Inkast genom `driveFileId` och `drive:`-prefix.

---

## Slutsats om provenance

För widget bör provenance delas i två lager:

1. **Runtime provenance:** `emitSynapse(..., { contextId: uid, ... })`
2. **Durable provenance:** `sourceRef`, `evidenceUrl`, server timestamp och eventuell queue-post

**Regel:** använd inte ADK state som enda källa för provenance. Den rensas vid logout och är inte WORM (`functions/src/adk/stateStore.ts:45-47`).

---

## 4. Fråga 3 — `hashPayload` krav för widget-transkript

`hashPayload()` gör SHA-256 av JSON och behåller ett kort prefix (`functions/src/adk/stateStore.ts:6-11`). För widget-transkript gäller:

### MUST

1. **Ingen rå transkripttext i synapse-state.**  
   ADK-mutationer får bara bära `payloadHash`, inte transcript som läsbart state (`functions/src/adk/types.ts:12-26`).

2. **Hasha normaliserad payload, inte bara titel.**  
   Rekommenderad hash-bas:
   - `transcript` (trim + whitespace-normaliserad)
   - `recordedAt`
   - `durationSeconds`
   - `sourceRef` eller `recordingId`

3. **Särhåll two uses:**
   - `transcriptHash` för lineage/idempotens
   - `sourceRef` för durable WORM-koppling

4. **Rå transkript får finnas endast transient i handlern** när den bygger `truth` eller klassificerar, inte i state store, inte i action-strängar, inte i debug-loggar.

### SHOULD

- lagra `transcriptChars`, `hasTranscript`, `durationSeconds` och `recordedAt` som ofarlig metadata
- använda samma hash för eventuell duplicate-detection på widget-nivå

### SHOULD NOT

- hash en redan sammanfattad text och kalla det transcript lineage
- lägga `evidenceUrl` i hash om URL-token kan rotera; använd hellre stabil `recordingId` / `sourceRef`

---

## 5. Rekommenderad handler-skiss

```ts
// ny callable efter metadata-steget
commitWidgetRecordingIngest({
  recordingId,
  transcript,
  recordedAt,
  durationSeconds,
  evidenceUrl,
  metadata: { vem, vad, varfor },
})
  -> assertVaultSession(uid)
  -> const transcriptHash = hashPayload({
       transcript: normalizeTranscript(transcript),
       recordedAt,
       durationSeconds: durationSeconds ?? null,
       recordingId,
     })
  -> emitSynapse(adkOrchestrator, {
       trigger: 'widget_recording_ingested',
       contextId: uid,
       payload: {
         ownerId: uid,
         recordingId,
         // raw transcript transient only inside handler path
         transcript,
         transcriptHash,
         recordedAt,
         durationSeconds,
         evidenceUrl,
         metadata,
       },
     })

// ny synapse-handler
handleWidgetRecordingIngest(payload)
  -> sourceRef = `widget_recording:${recordingId}`
  -> build truth from analysis + metadata + transcript + evidenceUrl
  -> assertServerWormPayload(...)
  -> write reality_vault with createdAt: serverTimestamp()
  -> optional: dispatch pattern scan / archivist with sourceRef + transcriptHash only
  -> return { collection: 'reality_vault', sourceRef, transcriptHash, docId }
```

### Kommentar till skissen

- För **våg 2** bör default-route vara **Valv/bevis** enligt widget-spec (`docs/design/HOMESCREEN-WIDGETS-SPEC.md:43-52`).
- Om senare widget ska kunna gå till `children_logs` eller `journal`, gör det via **explicit HITL** eller först efter genericering av `routeInboxToWorm()`.
- Om man vill återanvända queue-semantik redan nu: genericera först `driveFileId` → `sourceId` och `driveInboxSourceRef()` → `buildInboxSourceRef(sourceKind, sourceId)`.

---

## 6. MUST NOT

- **MUST NOT** lägga widget-bevis i `kb_docs` eller `kampspar`.
- **MUST NOT** använda `routeInboxToWorm()` oförändrad och skriva `drive:widget_...` som provenance.
- **MUST NOT** lagra rått widget-transkript i ADK state, mutation logs eller debug-loggar.
- **MUST NOT** göra `ingestWidgetRecording` till både prepare- och commit-endpoint om målet är ingest våg 2.
- **MUST NOT** låta LLM bestämma auth, vault unlock eller slutlig WORM-destination.
- **MUST NOT** bypassa vault unlock för widget som ska till `reality_vault`.
- **MUST NOT** auto-promota widget-inspelning till `children_logs` eller annan silo utan explicit designad HITL.
- **MUST NOT** hardkoda nya prompts utanför `functions/src/sharedRules.ts`.

---

## 7. Ett nästa steg

**Nästa steg:** genericera provenance-helpern innan implementation:

- `driveInboxSourceRef()` → `buildInboxSourceRef(sourceKind, sourceId)`
- `driveFileId` i `inbox_queue` → neutral `sourceId` / `sourceKind`

Det gör `widget_recording_ingested` möjlig utan semantisk skuld i provenance-lagret.
