# MODULE-SNAPSHOT-MANIFESTS

Kör: `./scripts/snapshot_locked_module.sh <modul>`

Destination: `~/Livskompassen-snapshots/YYYY-MM-DD-<modul>/`

## valv

```
src/modules/features/lifeJournal/evidence/vault/
functions/src/callables/valv.ts
functions/src/callables/unlockVault.ts
functions/src/lib/vaultSessionGate.ts
src/modules/core/security/vaultWriteUnlock.ts
docs/design/VALV-HUBB-SPEC.md
docs/specs/modules/Verklighetsvalvet-SPEC.md
docs/evaluations/2026-06-06-inkast-lockdown.md
```

## inkast

```
src/modules/inkast/
src/modules/capture/
functions/src/lib/submitInkastLite.ts
functions/src/lib/inboxClassifier.ts
functions/src/lib/inboxPersist.ts
functions/src/lib/uploadInkastEvidence.ts
functions/src/lib/analyzeUploadForKnowledge.ts
functions/src/callables/inbox.ts
docs/evaluations/2026-06-06-inkast-lockdown.md
```

## synapser

```
functions/src/adk/synapses/
functions/src/adk/orchestrator.ts
functions/src/adk/stateStore.ts
functions/src/adk/types.ts
functions/src/callables/agents.ts
```

## upload-unified

```
src/modules/inkast/
src/modules/capture/
src/modules/core/firebase/storage.ts
functions/src/lib/submitInkastLite.ts
functions/src/lib/uploadInkastEvidence.ts
functions/src/adk/synapses/driveIngestSynapse.ts
```

Varje snapshot inkluderar automatiskt `SNAPSHOT-MANIFEST.md` med datum, git commit (om finns), och smoke-status från BUILD-STATE.
