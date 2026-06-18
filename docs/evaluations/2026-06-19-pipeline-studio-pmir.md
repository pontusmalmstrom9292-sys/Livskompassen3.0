# Pre-Merge Impact Report — Pipeline Studio (M0)

**Datum:** 2026-06-19  
**Status:** APPROVED WITH CHANGES — implementera Fas 0–2 utan prod-beteendeändring i P1 FTD  
**Scope:** Vertex/AI Studio agent-flöden + intern Pipeline Studio + schema registry  
**PMIR-stopp respekterade:** Genkit V1, Gmail OAuth, Barnporten kanon-UI — **ej berörda**

---

## 1. Sammanfattning

Pipeline Studio introducerar deterministisk export mellan AI Studio, schema registry och Cursor — utan att ersätta AdkOrchestrator eller migrera till Genkit Flow runtime. P1 fas dokumenterar sex befintliga Flow-verktyg (FTD) och centraliserar JSON-scheman.

**Backend impact:** Låg i Fas 1 (schema-extraktion, import-refactor). Medel i Fas 3 (read-only Gemini tools på valvChatQuery).  
**Frontend impact:** Låg (capture tactile UX, dev-only /dev/pipeline-studio deferred).  
**Rules impact:** Mini-PMIR — append-only pipeline_runs (metadata only, no PII).

---

## 2. Callable-inventering (Gemini / AI)

| Export | Fil | Modell | Schema | Silo |
|--------|-----|--------|--------|------|
| processBrusfilter | callables/processBrusfilter.ts | gemini-2.5-flash | native | valv |
| biffRewriteDraft | callables/biffRewriteDraft.ts | gemini-2.5-flash | native | hamn/ephemeral |
| assistPatternMetadata | lib/patternMetadataAssist.ts | gemini-2.5-flash | native | valv |
| generateDossier (AI foreword) | lib/dossierAiForeword.ts | gemini-2.5-flash | native | valv |
| valvChatQuery | agents/valvChatAgent.ts | gemini-2.5-flash | prompt-JSON | valv |
| classifyInboxDocument | lib/inboxClassifier.ts | gemini-2.5-flash | prompt-JSON | multi→route |
| knowledgeVaultQuery | agents/knowledgeVaultAgent.ts | gemini-2.5-flash | prompt-JSON | kunskap |
| childrenLogsQuery | agents/childrenLogsAgent.ts | gemini-2.5-flash | prompt-JSON | barnen |
| analyzeMessage | callables/agents.ts → ADK | gemini-2.5-flash | prompt-JSON | multi |
| mabraCoach | agents/vertexAgent.ts | gemini-2.5-flash | prompt-JSON | vit |

SynapseBus: drive_file_ingested, journal_woven, dcap_alert, user_overwhelm.

---

## 3. P1 Flow Tool Definitions (FTD)

| toolId | callable | silo | smoke |
|--------|----------|------|-------|
| flow_brusfilter | processBrusfilter | valv | smoke:orkester |
| flow_biff_rewrite | biffRewriteDraft | hamn | smoke:locked-ux |
| flow_dossier_foreword | generateDossier | valv | smoke:orkester |
| flow_pattern_assist | assistPatternMetadata | valv | smoke:orkester |
| flow_inkast_classify | previewInboxClassification | multi | smoke:orkester |
| flow_valv_chat | valvChatQuery | valv | smoke:orkester |

---

## 4. Beslut

- Pipeline Studio UI: CLI först
- Genkit V1: SKIP
- Schema: functions/src/schemas/
- pipeline_runs: append-only Firestore + .orkester/pipeline-runs/

---

## 5. Smoke

cd functions && npm run build && npm run pipeline:validate && npm run smoke:orkester

**Godkännandestatus:** APPROVED WITH CHANGES
