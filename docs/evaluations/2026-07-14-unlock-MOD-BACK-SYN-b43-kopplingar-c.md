# Unlock — MOD-BACK-SYN + MOD-VALV-ORKESTER (B43 Kopplingar C)

**Datum:** 2026-07-14  
**Modul:** MOD-BACK-SYN · MOD-VALV-ORKESTER  
**Våg:** YOLO v43 — B43 Kopplingar C — ADK/synapse wiring  
**Status:** unlocked  
approved: yes  
**Godkänd av:** YOLO v43 build scope (drive ingest dry-run, journal_woven optIn, synapse fortifikation)

---

## Syfte

Tillåt minimal additiv diff i låst ADK/synapse-lager för B43: drive ingest `dryRun`-gren, optIn-kedja oförändrad men verifierad, ingen cross-RAG eller auto-kampspar från Drive.

## Scope (tillåtet)

- `functions/src/adk/synapses/driveIngestSynapse.ts` — `dryRun` klassificerar utan persist/dispatch
- `functions/src/adk/types.ts` — `dryRun?: boolean` på `DriveIngestPayload`
- `functions/src/callables/agents.ts` — `notifyNewFile` accepterar `dryRun: true`
- `scripts/smoke_drive_ingest.mjs` + `package.json` script `smoke:drive-ingest`

## Utanför scope

- `firestore.rules`, `storage.rules`, `sharedRules.ts`
- AppRoutes, Barnporten kanon-UI
- Live Kunskap-ingest (`--apply`), deploy
- Borttagning av synapse-triggers eller journal_woven optIn-gate
- Auto-routa Drive → `kampspar`

## DoD

- [x] `journal_woven` kräver `optIn === true` (synapse + callable + frontend)
- [x] `dcap_alert` → WORM `dcap_alerts` oförändrat
- [x] Drive G10 → `kb_docs` / `reality_vault` / `inbox_queue` — inte kampspar
- [x] `npm run smoke:orkester` PASS
- [x] `npm run smoke:dcap-routing` PASS
- [x] `npm run smoke:drive-ingest` PASS
- [x] `smoke:module-lock` PASS (via denna unlock-doc)

## Re-lock

Efter b43-vakt GO: behåll lås; diff är additiv och inom kanon.
