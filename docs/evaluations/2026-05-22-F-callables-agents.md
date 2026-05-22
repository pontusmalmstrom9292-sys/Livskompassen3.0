# Backend — Callables, agenter, ADK — 2026-05-22

**Trigger:** Byggpass Fas 3  
**Källor:** `functions/src/index.ts`, `functions/src/agents/`, `functions/src/adk/`, `functions/src/lib/*Rag*.ts`

## Sammanfattning

22 HTTPS exports. Auth på alla callables utom `notifyNewFile` (webhook secret). Silo-RAG **PASS**. P0 på `analyzeMessage` (ragContext) och `notifyNewFile` (ownerId). DCAP har inline prompt — **P1**.

## Callable-tabell

| Export | Auth | Silo/WORM | Status | Risk |
|--------|------|-----------|--------|------|
| `generateEmbedding` | Auth | Kunskap | PASS | P2 |
| `analyzeMessage` | Auth | Multi (DCAP) | **GAP** | **P0** client ragContext |
| `invalidateSession` | Auth | Zero Footprint | PASS | — |
| `scheduledRetentionJob` | Scheduler | G5 allowlist | PASS | — |
| `notifyNewFile` | Webhook secret | Drive ingest | **GAP** | **P0** ownerId body |
| `knowledgeVaultQuery` | Auth | Kunskap | PASS | — |
| `childrenLogsQuery` | Auth | Barnen | PASS | — |
| `getEntityProfileRegistry` | Auth | Metadata G9 | PASS | — |
| `getInboxQueue` | Auth | Inbox G10 | PASS | — |
| `confirmInboxItem` | Auth | HITL | PASS | — |
| `dismissInboxItem` | Auth | HITL | PASS | — |
| `previewInboxClassification` | Auth | Dev/smoke | PASS | P2 LLM input |
| `getContextCacheStatus` | Auth | G12 cache | PASS | — |
| `ingestKampsparEntry` | Auth | Kunskap WORM | PASS | — |
| `valvChatQuery` | Auth | Valv only | PASS | — |
| `weaveJournalEntry` | Auth | Journal→vault tag | PASS | Undantag |
| `journalWovenToKampspar` | Auth | Opt-in G7 | PASS | — |
| `getAgentRegistry` | Auth | A2A cards | PASS | — |
| `speglingsMirror` | Auth | Speglar | PASS | — |
| `mabraCoach` | Auth | Måbra | PASS | — |
| `generateDossier` | Auth | WORM read/write | PASS | — |
| `breakDownResponse` | Auth | Paralys | PASS | — |

## Agenter — prompts

| Agent | sharedRules | Status |
|-------|-------------|--------|
| kompis-supervisor | KOMPIS_SYSTEM_PROMPT | PASS |
| knowledgeVaultAgent | LIVS_ARKIVARIEN | PASS |
| valvChatAgent | SANNING_ANALYTIKERN | PASS |
| childrenLogsAgent | MONSTER_ARKIVARIEN_BARNEN | PASS |
| gransArkitektenAgent | GRANS_ARKITEKTEN | PASS |
| weaverAgent | VÄVAREN | PASS |
| documentAgent | LIVSKOMPASSEN_SYSTEM_CONFIG | PASS |
| vertexAgent (mabra/speglar) | MABRA/SPEGLINGS | PASS |
| **DCAP.ts** | **inline L89** | **GAP P1** |

## ADK / synapses

| Synapse | Trigger | Routing | Status |
|---------|---------|---------|--------|
| driveIngestSynapse | notifyNewFile | bevis→valv, kunskap→kb_docs, barnen→children_logs | PASS G10 |
| journalWovenSynapse | journal | opt-in kampspar | PASS G7 |
| dcapAlertSynapse | DCAP HITL | dcap_alerts WORM | PASS |
| synapseBus | Kill Switch | clearSynapseState | PASS |

## RAG-lib silo

| Lib | Collection | Cross-silo |
|-----|--------------|------------|
| kampsparQueryRag | kampspar, kb_docs | **Nej** |
| vaultRag / valvChat | reality_vault | **Nej** |
| childrenLogsQueryRag | children_logs | **Nej** |

## REFACTOR (pass 2)

Planera `functions/src/callables/*.ts` — tunna `index.ts` re-exports.

## Rekommenderat

P0: `analyzeMessage` server-side RAG. P0: `notifyNewFile` bind ownerId.
