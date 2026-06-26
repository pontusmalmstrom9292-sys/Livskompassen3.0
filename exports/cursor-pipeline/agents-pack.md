This file is a merged representation of a subset of the codebase, containing specifically included files, combined into a single document by Repomix.
The content has been processed where comments have been removed, empty lines have been removed, content has been compressed (code blocks are separated by ⋮---- delimiter).

# File Summary

## Purpose
This file contains a packed representation of a subset of the repository's contents that is considered the most important context.
It is designed to be easily consumable by AI systems for analysis, code review,
or other automated processes.

## File Format
The content is organized as follows:
1. This summary section
2. Repository information
3. Directory structure
4. Repository files (if enabled)
5. Multiple file entries, each consisting of:
  a. A header with the file path (## File: path/to/file)
  b. The full contents of the file in a code block

## Usage Guidelines
- This file should be treated as read-only. Any changes should be made to the
  original repository files, not this packed version.
- When processing this file, use the file path to distinguish
  between different files in the repository.
- Be aware that this file may contain sensitive information. Handle it with
  the same level of security as you would the original repository.

## Notes
- Some files may have been excluded based on .gitignore rules and Repomix's configuration
- Binary files are not included in this packed representation. Please refer to the Repository Structure section for a complete list of file paths, including binary files
- Only files matching these patterns are included: .context/agents.md, AGENTS.md, docs/pipeline-studio/tools/*.json, functions/src/adk/**, functions/src/agents/**, functions/src/callables/agents.ts, functions/src/callables/pipelineStudio.ts, functions/src/lib/pipelineRunStore.ts, scripts/pipeline-studio/**, scripts/smoke_orkester_wiring.mjs, scripts/smoke_agents_ui.mjs, scripts/smoke_synapse_triggers.mjs
- Files matching patterns in .gitignore are excluded
- Files matching default ignore patterns are excluded
- Code comments have been removed from supported file types
- Empty lines have been removed from all files
- Content has been compressed - code blocks are separated by ⋮---- delimiter
- Files are sorted by Git change count (files with more changes are at the bottom)

# Files

## File: .context/agents.md
```markdown
# Agentroller (Canonical)

## Produktroller
- Sannings-Analytikern: klinisk bevisanalys med strikt JSON.
- Brusfiltret: tvattar affektivt brus till fakta och tidslinje.
- BIFF-Skolden: producerar Brief, Informative, Friendly, Firm svar.
- Paralys-Brytaren: ett mikrosteg for exekutiv avlastning.
- RSD-Kylaren: rationella alternativ vid avvisningstriggers.
- Uppgifts-Krossaren: atomiserar uppgifter till testbara steg.
- Speglings-Coachen: validerar utan fixande.
- Monster-Arkivarien: forensisk langtidanalys av bevismaterial.

## Runtime-koppling
- Agent cards: `functions/src/agents/cards/index.ts`
- ADK (orkestrering, synapser, executors): `functions/src/adk/` — `synapseBus.ts` + `emitSynapse`; Cursor-regel `.cursor/rules/synapser-adk.mdc`
- Supervisor-routing: `functions/src/agents/kompis-supervisor.ts` → `AdkOrchestrator`
- Centrala AI-regler: `functions/src/sharedRules.ts` (`getAgentSystemPrompt`)

## Hard rules
- Ingen hardkodad prompt utanfor `functions/src/sharedRules.ts`.
- Ingen LLM-baserad auktorisationslogik.
- Bevara WORM, CMEK och Zero Footprint.
```

## File: docs/pipeline-studio/tools/flow_biff_rewrite.json
```json
{
  "toolId": "flow_biff_rewrite",
  "version": "1.0.0",
  "title": "BIFF inline-tvätt",
  "silo": "hamn",
  "callable": "biffRewriteDraft",
  "model": "gemini-2.5-flash",
  "schemaModule": "functions/src/schemas/biffRewrite.ts",
  "responseSchemaExport": "BIFF_REWRITE_RESPONSE_SCHEMA",
  "nodeGraph": ["trigger:user_draft", "callable:biffRewriteDraft", "response:json"],
  "smoke": ["npm run smoke:locked-ux"],
  "pmirStatus": "approved",
  "lockedUx": ["Trygg Hamn BIFF panel"],
  "costNote": "Ephemeral — ingen WORM"
}
```

## File: docs/pipeline-studio/tools/flow_brusfilter.json
```json
{
  "toolId": "flow_brusfilter",
  "version": "1.0.0",
  "title": "Brusfilter — textnormalisering före Valv",
  "silo": "valv",
  "callable": "processBrusfilter",
  "model": "gemini-2.5-flash",
  "schemaModule": "functions/src/schemas/brusfilter.ts",
  "responseSchemaExport": "BRUSFILTER_RESPONSE_SCHEMA",
  "nodeGraph": ["trigger:inkast_text", "dcap:implicit", "callable:processBrusfilter", "response:json"],
  "smoke": ["npm run smoke:orkester"],
  "pmirStatus": "approved",
  "lockedUx": [],
  "costNote": "~1 Flash call per preview; vault session required"
}
```

## File: docs/pipeline-studio/tools/flow_dossier_foreword.json
```json
{
  "toolId": "flow_dossier_foreword",
  "version": "1.0.0",
  "title": "Dossier AI-försätt + tidslinje",
  "silo": "valv",
  "callable": "generateDossier",
  "model": "gemini-2.5-flash",
  "schemaModule": "functions/src/schemas/dossierForeword.ts",
  "responseSchemaExport": "DOSSIER_FOREWORD_RESPONSE_SCHEMA",
  "nodeGraph": ["trigger:dossier_wizard", "dcap:vault_session", "callable:generateDossier", "response:json"],
  "smoke": ["npm run smoke:orkester"],
  "pmirStatus": "approved",
  "lockedUx": ["Dossier generator"],
  "costNote": "Flash; max 80 entries summarized"
}
```

## File: docs/pipeline-studio/tools/flow_inkast_classify.json
```json
{
  "toolId": "flow_inkast_classify",
  "version": "1.0.0",
  "title": "Inkast G10-klassificering",
  "silo": "multi",
  "callable": "previewInboxClassification",
  "model": "gemini-2.5-flash",
  "schemaModule": "functions/src/schemas/inkastClassify.ts",
  "responseSchemaExport": "validateInkastClassifyResponse",
  "nodeGraph": ["trigger:inkast_upload", "heuristic:heuristicInboxClassify", "llm:classifyInboxDocument", "route:silo", "hitl:inbox_queue"],
  "smoke": ["npm run smoke:orkester"],
  "pmirStatus": "approved",
  "lockedUx": ["CaptureSuperModule", "Barnporten HITL"],
  "costNote": "Heuristic fail-safe before LLM"
}
```

## File: docs/pipeline-studio/tools/flow_pattern_assist.json
```json
{
  "toolId": "flow_pattern_assist",
  "version": "1.0.0",
  "title": "Mönster metadata-assist",
  "silo": "valv",
  "callable": "assistPatternMetadata",
  "model": "gemini-2.5-flash",
  "schemaModule": "functions/src/schemas/patternAssist.ts",
  "responseSchemaExport": "PATTERN_ASSIST_RESPONSE_SCHEMA",
  "nodeGraph": ["trigger:pattern_scan", "dcap:gatePatternAssist", "callable:assistPatternMetadata", "response:json"],
  "smoke": ["npm run smoke:orkester"],
  "pmirStatus": "approved",
  "lockedUx": ["VaultMonsterPanel"],
  "costNote": "Closed catalog only — no free-form labels"
}
```

## File: docs/pipeline-studio/tools/flow_valv_chat.json
```json
{
  "toolId": "flow_valv_chat",
  "version": "1.0.0",
  "title": "Valv-Chat RAG",
  "silo": "valv",
  "callable": "valvChatQuery",
  "model": "gemini-2.5-flash",
  "schemaModule": "functions/src/schemas/valvChat.ts",
  "responseSchemaExport": "VALV_CHAT_READ_TOOLS",
  "nodeGraph": ["trigger:user_question", "rag:fetchVaultEvidenceForQuery", "tools:refine_vault_search_readonly", "callable:valvChatQuery", "response:json"],
  "smoke": ["npm run smoke:orkester"],
  "pmirStatus": "approved",
  "lockedUx": ["Valv kunskapsbank chat"],
  "costNote": "Max 1 refine_vault_search tool round"
}
```

## File: functions/src/adk/synapses/driveIngestSynapse.ts
```typescript
import { analyzeDriveFile } from '../../agents/documentAgent';
import { MonsterArkivarienCard } from '../../agents/cards';
import type { A2AMessage } from '../../agents/types';
import type { AdkOrchestrator } from '../orchestrator';
import type { DriveIngestPayload } from '../types';
import { classifyInboxDocument, applyInkastConfidenceGate } from '../../lib/inboxClassifier';
import { routeInboxToWorm } from '../../lib/inboxPersist';
⋮----
export async function handleDriveIngest(
  orchestrator: AdkOrchestrator,
  payload: DriveIngestPayload
): Promise<
⋮----
function isHeavyResponse(text: string): boolean
```

## File: functions/src/adk/synapses/journalWovenSynapse.ts
```typescript
import { generateEmbeddingInternal } from '../../lib/generateEmbeddingInternal';
import { upsertKampsparVector } from '../../lib/vectorSearchClient';
⋮----
export interface JournalWovenPayload {
  ownerId: string;
  journalEntryId: string;
  mood: string;
  text: string;
  optIn: boolean;
}
⋮----
export interface JournalWovenResult {
  kampsparDocId: string;
  embeddingDim: number | null;
}
⋮----
export async function handleJournalWoven(payload: JournalWovenPayload): Promise<JournalWovenResult>
```

## File: functions/src/adk/synapses/widgetRecordingIngestSynapse.ts
```typescript
import { MonsterArkivarienCard } from '../../agents/cards';
import type { A2AMessage } from '../../agents/types';
import type { AdkOrchestrator } from '../orchestrator';
import type { WidgetRecordingIngestedPayload } from '../types';
import {
  buildInboxClassifyBlob,
  classifyInboxDocument,
  applyInkastConfidenceGate,
  type InboxClassification,
} from '../../lib/inboxClassifier';
import { routeInboxToWorm } from '../../lib/inboxPersist';
import {
  blockWidgetKunskapRouting,
  buildWidgetVaultTruth,
} from '../../lib/widgetRecordingCommit';
⋮----
export interface WidgetRecordingIngestResult {
  analysis: { title: string; summary: string; category: string };
  classification: InboxClassification;
  action: 'queued' | 'persisted';
  collection?: string;
  docId?: string;
  queueId?: string;
}
⋮----
export async function handleWidgetRecordingIngest(
  orchestrator: AdkOrchestrator,
  payload: WidgetRecordingIngestedPayload,
  geminiApiKey?: string,
): Promise<WidgetRecordingIngestResult>
```

## File: functions/src/adk/index.ts
```typescript

```

## File: functions/src/adk/manifest.ts
```typescript
export type SiloId = 'kunskap' | 'valv' | 'barnen' | 'vardag' | 'core';
⋮----
export type DomainId = 'K' | 'V' | 'F' | 'L' | 'C';
⋮----
export type SynapseTrigger =
  | 'drive_file_ingested'
  | 'journal_woven'
  | 'dcap_alert'
  | 'user_overwhelm'
  | 'widget_recording_ingested';
⋮----
export interface BackendDomainContract {
  readonly id: DomainId;
  readonly silo: SiloId;
  readonly wormCollections: readonly string[];
  readonly mutableCollections: readonly string[];
  readonly adminOnlyCollections: readonly string[];
  readonly allowedCrossReads: readonly SiloId[];
  readonly requiresVaultUnlock: boolean;
}
⋮----
export class BackendManifestError extends Error
⋮----
constructor(message: string)
⋮----
export function resolveBackendCollectionDomain(
  collection: string,
): BackendDomainContract | undefined
⋮----
export function assertBackendSiloIsolation(fromSilo: SiloId, toSilo: SiloId): void
⋮----
export function assertBackendWorm(
  collection: string,
  operation: 'update' | 'delete',
): boolean
⋮----
export function assertBackendCollectionAccess(
  domainId: DomainId,
  collection: string,
): boolean
⋮----
export function getBackendWormCollections(): string[]
```

## File: functions/src/adk/registry.ts
```typescript
import {
  AvailableAgents,
  resolveExecutorId,
  type SupervisorRoute,
  routeFromDcap,
} from '../agents/cards';
import type { AgentCard } from '../agents/types';
import {
  assertBackendCollectionAccess,
  assertBackendSiloIsolation,
  resolveBackendCollectionDomain,
  type SiloId,
} from './manifest';
⋮----
export function getAgentCard(agentId: string): AgentCard | undefined
⋮----
export function listAgentCards(): AgentCard[]
⋮----
export function validateIntent(agentId: string, intent: string): boolean
⋮----
export function assertCollectionAccess(agentId: string, collection: string): boolean
```

## File: functions/src/agents/cards/index.ts
```typescript
import { AgentCard } from '../types';
⋮----
export function resolveExecutorId(productAgentId: string): string
⋮----
export type SupervisorRoute = {
  productAgentId: string;
  executorId: string;
  intent: string;
};
⋮----
export function routeFromDcap(
  riskScore: number,
  recommendedAction: 'NONE' | 'COACHING' | 'ALERT'
): SupervisorRoute
```

## File: functions/src/agents/childrenLogsAgent.ts
```typescript
import { MONSTER_ARKIVARIEN_BARNEN_SYSTEM_PROMPT } from '../sharedRules';
import { loadBarnenEntityBundle } from '../lib/entityProfileStore';
import { fetchChildrenLogsForQuery } from '../lib/childrenLogsQueryRag';
import { createGenAI } from '../lib/genaiClient';
⋮----
export interface ChildrenLogCitation {
  docId: string;
  childAlias: string;
  date: string;
  excerpt: string;
}
⋮----
export interface ChildrenLogsQueryResult {
  answer: string;
  citations: ChildrenLogCitation[];
  silo: 'barnen';
}
⋮----
function buildContextBlock(chunks: Awaited<ReturnType<typeof fetchChildrenLogsForQuery>>): string
⋮----
function parseChildrenLogsJson(
  raw: string,
  allowed: Map<string, ChildrenLogCitation>
): ChildrenLogsQueryResult | null
⋮----
function buildDegradedResponse(
  chunks: Awaited<ReturnType<typeof fetchChildrenLogsForQuery>>
): ChildrenLogsQueryResult
⋮----
export async function askChildrenLogsQuery(
  uid: string,
  question: string,
  childAlias?: string,
  geminiApiKey?: string
): Promise<ChildrenLogsQueryResult>
```

## File: functions/src/agents/documentAgent.ts
```typescript
import { google, drive_v3 } from 'googleapis';
import { LIVSKOMPASSEN_SYSTEM_CONFIG } from '../sharedRules';
import { createGenAI } from '../lib/genaiClient';
⋮----
async function downloadDriveFileBuffer(
  drive: drive_v3.Drive,
  fileId: string,
  mimeType: string
): Promise<
⋮----
export const analyzeDriveFile = async (fileId: string, fileName: string, mimeType: string): Promise<string> =>
```

## File: functions/src/agents/gransArkitektenAgent.ts
```typescript
import type { DcapResult } from './DCAP';
import { GRANS_ARKITEKTEN_SYSTEM_PROMPT } from '../sharedRules';
import { createGenAI } from '../lib/genaiClient';
⋮----
export interface GransArkitektenResult {
  cleanFacts: string[];
  emotionalBait: string[];
  greyRockReply: string;
  techniques: string[];
  coachingNote: string;
  theoryWithoutEvidence?: boolean;
}
⋮----
export function parseGransJson(raw: string, dcap: DcapResult): GransArkitektenResult
⋮----
function buildFallback(dcap: DcapResult): GransArkitektenResult
⋮----
export async function askGransArkitekten(
  message: string,
  dcap: DcapResult,
  geminiApiKey?: string
): Promise<GransArkitektenResult>
```

## File: functions/src/agents/knowledgeVaultAgent.ts
```typescript
import { LIVS_ARKIVARIEN_SYSTEM_PROMPT } from '../sharedRules';
import { createGenAI } from '../lib/genaiClient';
import { loadKunskapEntityBundle } from '../lib/entityProfileStore';
import { fetchKampsparEvidenceForQuery } from '../lib/kampsparQueryRag';
⋮----
export interface KnowledgeVaultCitation {
  docId: string;
  collection: 'kampspar' | 'kb_docs';
  date: string;
  title: string;
  excerpt: string;
}
⋮----
export interface KnowledgeVaultResult {
  answer: string;
  citations: KnowledgeVaultCitation[];
  moduleRoute?: {
    path: string;
    label: string;
    silo: 'barnen';
  };
}
⋮----
function buildContextBlock(chunks: Awaited<ReturnType<typeof fetchKampsparEvidenceForQuery>>): string
⋮----
function citationKey(c: KnowledgeVaultCitation): string
⋮----
function parseKnowledgeVaultJson(
  raw: string,
  allowed: Map<string, KnowledgeVaultCitation>
): KnowledgeVaultResult | null
⋮----
function buildDegradedResponse(chunks: KampsparEvidenceChunk[]): KnowledgeVaultResult
⋮----
type KampsparEvidenceChunk = Awaited<ReturnType<typeof fetchKampsparEvidenceForQuery>>[number];
⋮----
export async function askKnowledgeVaultWithRag(
  uid: string,
  question: string,
  geminiApiKey?: string
): Promise<KnowledgeVaultResult>
```

## File: functions/src/agents/kompis-supervisor.ts
```typescript
import {
  AvailableAgents,
  EXECUTOR_AGENT_IDS,
  GransArkitektenCard,
  routeFromDcap,
} from './cards';
import type { AgentResponse } from './types';
import { GCP_PROJECT_ID } from '../config';
import { analyzeDcap, DcapResult } from './DCAP';
import { askGransArkitekten, parseGransJson, type GransArkitektenResult } from './gransArkitektenAgent';
import { resolveHamnTheoryWithoutEvidence } from '../lib/epistemicGuard';
import { getOrCreateCache, invalidateCachesForUser } from '../lib/vertexCache';
import { KOMPIS_SYSTEM_PROMPT } from '../sharedRules';
import { adkOrchestrator } from '../adk/orchestrator';
import { emitSynapse } from '../adk/synapses/synapseBus';
import { hashPayload } from '../adk/stateStore';
import type { DcapAlertResult } from '../adk/synapses/dcapAlertSynapse';
⋮----
export class KompisSupervisor
⋮----
public async handleUserRequest(
    userInput: string,
    userId: string,
    ragContext: string[] = [],
    options?: { preferGransArkitekten?: boolean }
): Promise<AgentResponse &
⋮----
public async invalidateUserSession(userId: string): Promise<void>
```

## File: functions/src/agents/types.ts
```typescript
export interface AgentMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
}
⋮----
export interface AgentCapability {
  name: string;
  description: string;
  parameters: Record<string, any>;
}
⋮----
export interface AgentCard {
  metadata: AgentMetadata;
  capabilities: AgentCapability[];
  dataAccessPolicy: {
    canAccessPII: boolean;
    allowedCollections: string[];
  };
}
⋮----
export interface A2AMessage {
  fromAgentId: string;
  toAgentId: string;
  timestamp: string;
  intent: string;
  payload: Record<string, any>;
  contextId?: string;
}
⋮----
export interface AgentResponse {
  agentId: string;
  status: 'SUCCESS' | 'ERROR' | 'DELEGATED';
  data?: any;
  error?: string;
  delegatedTo?: string;
}
```

## File: functions/src/callables/pipelineStudio.ts
```typescript
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { appendPipelineRun, type PipelineRunStatus } from '../lib/pipelineRunStore';
```

## File: functions/src/lib/pipelineRunStore.ts
```typescript
import { getFirestore, FieldValue, type FieldValue as FieldValueType } from 'firebase-admin/firestore';
⋮----
export type PipelineRunStatus = 'spawned' | 'PASS' | 'FAIL' | 'validated' | 'exported';
⋮----
export interface PipelineRunRecord {
  userId: string;
  ownerId: string;
  toolId: string;
  status: PipelineRunStatus;
  schemaVersion: string;
  smokeTier?: number;
  commitSha?: string;
  errorCode?: string;
  createdAt: FieldValueType;
}
⋮----
export async function appendPipelineRun(
  uid: string,
  data: Omit<PipelineRunRecord, 'userId' | 'ownerId' | 'createdAt'>,
): Promise<string>
```

## File: scripts/pipeline-studio/lib/ftdLoader.mjs
```javascript
/** Load P1 Flow Tool Definitions from docs/pipeline-studio/tools/ */
⋮----
/**
 * @param {string} [toolId]
 */
export function loadFtd(toolId)
⋮----
export function loadAllFtd()
⋮----
export function listToolIds()
```

## File: scripts/pipeline-studio/cursor_pack.mjs
```javascript
/** npm run pipeline:cursor-pack -- <toolId> */
```

## File: scripts/pipeline-studio/export.mjs
```javascript
/** npm run pipeline:export -- <toolId> */
```

## File: scripts/pipeline-studio/run_smoke.mjs
```javascript
/** npm run pipeline:run-smoke -- <toolId> */
```

## File: scripts/pipeline-studio/validate.mjs
```javascript
/** npm run pipeline:validate [-- toolId] */
```

## File: scripts/pipeline-studio/worktree_spawn.mjs
```javascript
/** npm run pipeline:worktree -- <toolId> */
```

## File: scripts/smoke_agents_ui.mjs
```javascript
/**
 * Static + unit smoke: Agent UX P0/P1 wiring.
 * Usage: npm run smoke:agents-ui
 */
⋮----
function assert(condition, message)
⋮----
function read(relPath)
⋮----
function mustInclude(relPath, ...needles)
```

## File: scripts/smoke_orkester_wiring.mjs
```javascript
/**
 * Static smoke: ADK synapse wiring + orkester integration (no Firebase).
 * Usage: npm run smoke:orkester
 */
⋮----
function assert(condition, message)
⋮----
function read(relPath)
⋮----
function mustInclude(relPath, ...needles)
⋮----
function mustNotInclude(relPath, ...needles)
⋮----
function run(cmd, cwd = root)
⋮----
function main()
⋮----
// W3: legacy shim redirects frånvaro/lön via vaultRedirectSearch; canonical Valv-länkar i supermodule.
```

## File: AGENTS.md
```markdown
# Livskompassen Cursor Agent Brief

## Project Overview

Livskompassen v2 is a Life OS and multi-agent ecosystem for Lagen om Autonomi, Clean Input, cognitive offloading, and secure evidence handling. Kompis is the user-facing AI navigator; the backend protects user data through Layered Defense, deterministic code, Firebase, Google Cloud, and Vertex/Gemini.

This repository is the current source of truth for React/Vite frontend work, Firebase configuration, Cloud Functions, Data Connect output, and AI-agent orchestration. Legacy Express routes live in `docs/archive/server-legacy/` only.

## Before Writing Code

1. Read `.context/system-plan.md` to confirm the current phase and active risks.
2. Read `.context/domän-covert-narcissism.md` when working on Valv, Inkast, Hamn, Mönster, or upload routing (~80% HCF/covert bevis-prior).
3. Read `.context/arkiv-minne.md` for Hela arkivet / permanent minne / three silos (required for RAG, Dossier, or cross-module memory work).
4. Read `.context/architecture.md`, `.context/arkitektur-beslut.md`, `.context/security.md`, `.context/database.md`, `.context/design-language.md`, and `.context/agents.md`.
5. Apply the relevant `.cursor/rules/*.mdc` files before editing.
6. For substantial changes, prepare a REASONS plan: Requirements, Entities, Approach, Structure, Operations, Norms, Safeguards.
7. Preserve Sacred Features: Verklighetsvalvet, Sanningens Sköld, Morgonkompassen, Dossier-Generator, Speglings-Systemet, Draft Layer, and Device Clear. Kill Switch (shake-to-kill) removed 2026-06-01 — see `.context/security.md`.
8. Preserve **Locked UX Features** (do not remove): Middagsfrågan; Valv **Mönster** + **Orkester**; design locks for **Planering**, **Fyren widget**, **Barnporten** (barn PWA + egen Orkester + Valv HITL). Register: [`.context/locked-ux-features.md`](.context/locked-ux-features.md). Verify: `npm run smoke:locked-ux`.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Zustand.
- Backend: Firebase Cloud Functions, Google Cloud, Vertex AI, Gemini.
- Data: Firestore/Data Connect, RAG-oriented evidence structures, immutable snapshots.
- AI: Kompis Supervisor, A2A agent cards, DCAP, shared prompt rules in `functions/src/sharedRules.ts`.
- Tooling: Cursor rules/hooks/MCP and Firebase plugin in `.cursor/settings.json`.

## Development

- **Frontend:** `npm run dev` from repo root (Vite, port 5173).
- **Functions:** `npm run build` from `functions/` compiles TypeScript.
- **Lint:** `npx eslint .` from repo root (`eslint.config.js`).

## Cursor Cloud specific instructions

- The startup dependency refresh uses `npm ci --legacy-peer-deps` at the repo root because current npm strict peer resolution rejects the existing `firebase@12` and `@capacitor-firebase/authentication@6` peer range combination. Do not remove that flag until those package ranges are aligned.
- Cloud shells may resolve `node` through `/exec-daemon` even after `nvm use`; when testing Functions runtime behavior, put the Node 20 nvm binary first in `PATH` before running `functions` commands.
- Local app smoke tests need the ignored `.env` Firebase Web SDK values from `.env.example` / the active Firebase app config; do not commit `.env`.
- Android Gradle builds need `ANDROID_HOME` / `ANDROID_SDK_ROOT`; in Cursor Cloud the SDK is under `$HOME/android-sdk` when present.

## Cursor Subagents

Built-in: `explore`, `bash`, `browser` — use for research, shell, browser (do not duplicate).

### Orkester (nattpass)

`npm run orkester:night` eller Conductor — [`docs/ORKESTER-AUTORUN.md`](docs/ORKESTER-AUTORUN.md) · [`.cursor/agents/orkester-conductor.md`](.cursor/agents/orkester-conductor.md)

| Fas | Agent | Trigger |
|-----|-------|---------|
| 1–4 | ux-guardian, adk-weaver, security-auditor, smoke-runner | orkester nattpass |
| 5 | Zone-builders (Z1, Z3+6, Z5+2, Z4) | `/specialist-valv-builder` etc. |
| 6 | `specialist-verifier` | `/specialist-verifier` |
| 7 | Conductor rapport | — |

### Slutbygge (zon)

| Agent | Zon | Trigger |
|-------|-----|---------|
| `specialist-valv-builder` | Z1 Valv | `/specialist-valv-builder` |
| `specialist-hjartat-inkast-builder` | Z3+6 Hjärtat+Inkast | `/specialist-hjartat-inkast-builder` |
| `specialist-familjen-hamn-builder` | Z5+2 Familjen+Hamn | `/specialist-familjen-hamn-builder` |
| `specialist-vardagen-builder` | Z4 Vardagen | `/specialist-vardagen-builder` |
| `specialist-verifier` | Alla (efter build) | `/specialist-verifier` |

Deploy efter PASS: skill [`.cursor/skills/livskompassen-deploy/SKILL.md`](.cursor/skills/livskompassen-deploy/SKILL.md) — inte subagent.

### Innehåll (routing)

- **`specialist-innehall-dirigent`** — klassar FACT/REFLECTION/PLAY/EVIDENCE; kanon [`docs/INNEHALL-REGISTER.md`](docs/INNEHALL-REGISTER.md)
- **MåBra-innehåll:** `specialist-mabra-curator` — REFLECTION/PLAY → [`docs/specs/modules/Mabra-CONTENT-BANK.md`](docs/specs/modules/Mabra-CONTENT-BANK.md).
- **Kunskap-fakta:** `specialist-kunskap-seed` — FACT → [`docs/specs/modules/Kunskap-CONTENT-SEED.md`](docs/specs/modules/Kunskap-CONTENT-SEED.md) (ingest separat).
- Keep direct edits in the parent agent unless a separate isolated exploration is clearly useful.

### CTO Custom Modes (2026-06 audit)

Pontus-godkända dagliga bollplank — regler i `.cursor/rules/backend-ingest-logic.mdc`, `chameleon-ui-modularity.mdc`, `ai-cognitive-companion.mdc`.

| Agent | Slash-kommando (syns i `/`-menyn) | Subagent | Fokus |
|-------|-----------------------------------|----------|-------|
| YOLO-vakt | `/yolo-vakt` | `.cursor/agents/yolo-vakt.md` | Read-only säkerhetsaudit |
| Minnes-Arkitekten | `/minnes-arkitekten` | `.cursor/agents/minnes-arkitekten.md` | Auto kunskaps-ingest |
| Design-Labbet | `/design-labbet` | `.cursor/agents/design-labbet.md` | Chameleon UI |
| Android-Kompis | `/android-kompis` | `.cursor/agents/android-kompis.md` | G85, cap sync, deploy |

**Viktigt:** `/`-menyn läser **`.cursor/commands/*.md`**. `.cursor/agents/` är subagents (Task-delegation). Båda pekar på samma roll — använd slash-kommandot i chatten.

## Skills & rules (uppgift → vägledning)

| Uppgift | Skill | Cursor rule |
| --- | --- | --- |
| ADK synapser, auto-ingest | `livskompassen-synapser-adk` | `synapser-adk.mdc` |
| RAG, silo, cross-read | `livskompassen-memory-silo-guard`, `livskompassen-rag-retrieval` | `memory-silo.mdc` |
| Vector Search ANN | `livskompassen-vector-search` | — |
| Hela arkivet / Dossier-minne | `livskompassen-arkiv-master` | `livskompassen-core.mdc` |
| Agent cards / prompts | `livskompassen-memory-agents` | `backend-agents.mdc` |
| Deploy / Firebase | plugin `firebase-basics` | `firebase-workflow.mdc`, **`deploy-paminnelser.mdc`** |
| Planering / dubbelarbete | — | **`planering-kanon-guard.mdc`** |
| Firestore rules / WORM | plugin `firebase-firestore-standard` | `security-firestore.mdc` |
| Natt-/batch-autorun | — | `orkester-autorun.mdc`, `grunder-kanon.mdc`, `anti-hallucination.mdc` |
| Innehåll fakta/lek (U6) | — | `innehall-register.mdc`, `grunder-kanon.mdc` |
| Modulutökning (cursor-plan) | — | [`docs/evaluations/MALL-cursor-plan.md`](docs/evaluations/MALL-cursor-plan.md) + `*-SPEC.md` + `module_plan.md` |

Kanon för arkitektur och säkerhet: `.context/` (system-plan, arkiv-minne, security). Dokumentationsindex: [`docs/README.md`](docs/README.md). **Systemkontroll / röda tråden:** [`docs/SYSTEMKONTROLL.md`](docs/SYSTEMKONTROLL.md). **Fas 19 gate (pre-flight):** [`.cursor/rules/fas19-masterplan-guard.mdc`](.cursor/rules/fas19-masterplan-guard.mdc) · [`docs/prompts/FAS19-PREFLIGHT-SUPERPROMPT.md`](docs/prompts/FAS19-PREFLIGHT-SUPERPROMPT.md).  
Live GCP-sanning: [`docs/GCP-INVENTORY-LATEST.md`](docs/GCP-INVENTORY-LATEST.md).  
GCP-konsolidering: [`docs/GCP-KONSOLIDERING-BESLUT.md`](docs/GCP-KONSOLIDERING-BESLUT.md).

## Product Agent Roles

| Role | Responsibility |
| --- | --- |
| Sannings-Analytikern | Clinical evidence analysis and strict JSON output. |
| Brusfiltret | Converts emotionally loaded input into clean facts and timeline data. |
| BIFF-Skölden | Produces Brief, Informative, Friendly, Firm Grey Rock communication. |
| Paralys-Brytaren | Reduces executive dysfunction by showing exactly one micro-step. |
| RSD-Kylaren | Provides rational alternatives for rejection-sensitive triggers. |
| Uppgifts-Krossaren | Breaks overwhelming tasks into small, testable action atoms. |
| Speglings-Coachen | Validates without fixing and separates emotion from evidence. |
| Mönster-Arkivarien | Performs forensic long-term pattern analysis across evidence and Drive inputs. |

These roles are project terminology in Cursor now. Runtime backend implementation happens through `functions/src/agents/`, `functions/src/agents/cards/`, and `functions/src/sharedRules.ts`.

## Git & merge (HARD)

- **Single trunk:** develop on `main`; push only `origin` (Livskompassen3.0). Never push `origin-old`.
- Before merge/branch delete: write **Pre-Merge Impact Report** per [`docs/MERGE-IMPACT-RAPPORT.md`](docs/MERGE-IMPACT-RAPPORT.md) (följer med / försvinner / regelanalys).
- Analyze: `.context/system-plan.md`, `grunder-kanon.mdc`, `locked-ux-features.md`, `.context/security.md` (Sacred, WORM, silos).
- Run `npm run smoke:locked-ux` on `main` before calling merge complete.
- **Wait for user OK** ("godkänn merge") before merge, push, or `git push origin --delete`.
- Rule: [`.cursor/rules/git-main-trunk.mdc`](.cursor/rules/git-main-trunk.mdc) (`alwaysApply`). Quick ref: [`docs/GIT-LATHUND.md`](docs/GIT-LATHUND.md). Branches: [`docs/BRANCH-KARTA.md`](docs/BRANCH-KARTA.md).

## Hard Rules

- Do not commit secrets, `.env`, service-account keys, OAuth tokens, or credential JSON files.
- Do not hardcode agent prompts outside `functions/src/sharedRules.ts`.
- Do not use LLM output as the source of truth for authorization, data ownership, or immutable evidence decisions.
- Do not degrade Sacred Features or weaken Device Clear, Draft Layer, or Verklighetsvalvet behavior.
- Do not introduce nature-themed UI. Use Obsidian Calm and Nordic Dusk.
- Keep changes tightly scoped to the requested task and preserve unrelated user work.
```

## File: functions/src/adk/synapses/dcapAlertSynapse.ts
```typescript
import { hashPayload } from '../stateStore';
import { analyzeDcapTrend, type EscalationResult } from '../../lib/dcapEscalation';
import { monitor } from '../../lib/monitoring';
⋮----
export interface DcapAlertPayload {
  ownerId: string;
  riskScore: number;
  recommendedAction: 'NONE' | 'COACHING' | 'ALERT';
  inputHash: string;
  detectionCount?: number;
}
⋮----
export interface DcapAlertResult {
  alertId: string;
  hitlRequired: boolean;
  escalation?: EscalationResult;
}
⋮----
export async function handleDcapAlert(payload: DcapAlertPayload): Promise<DcapAlertResult>
```

## File: functions/src/adk/synapses/kasamAggregationSynapse.ts
```typescript
export interface KasamAggregationPayload {
  ownerId: string;
  triggerSource: string;
}
⋮----
export interface KasamAggregationResult {
  docId: string;
  aggregatedAt: string;
}
⋮----
export async function handleKasamAggregation(payload: KasamAggregationPayload): Promise<KasamAggregationResult>
```

## File: functions/src/adk/synapses/paralysBrytarenSynapse.ts
```typescript
import { createGenAI } from '../../lib/genaiClient';
import { GEMINI_FLASH } from '../../lib/modelRouter';
import { PARALYS_BRYTAREN_SYSTEM_PROMPT } from '../../sharedRules';
import { MICRO_STEP_MAX_SECONDS, type MicroStep } from '../types';
⋮----
export function isHeavyResponse(text: string): boolean
⋮----
function clampSeconds(n: number): number
⋮----
export function breakIntoMicroStepsDeterministic(text: string): MicroStep[]
⋮----
function inferPhysicalAnchor(instruction: string): string
⋮----
export async function breakIntoMicroSteps(text: string): Promise<MicroStep[]>
⋮----
export async function applyParalysBreak(agentText: string): Promise<MicroStep[]>
```

## File: functions/src/adk/synapses/synapseBus.ts
```typescript
import type { SynapseEvent, SynapseTrigger } from '../types';
import type { AdkOrchestrator } from '../orchestrator';
import { handleDriveIngest } from './driveIngestSynapse';
import { handleDcapAlert } from './dcapAlertSynapse';
import { handleJournalWoven } from './journalWovenSynapse';
import { handleWidgetRecordingIngest } from './widgetRecordingIngestSynapse';
import { applyParalysBreak } from './paralysBrytarenSynapse';
import { handleKasamAggregation } from './kasamAggregationSynapse';
import type {
  DriveIngestPayload,
  JournalWovenPayload,
  DcapAlertPayload,
  WidgetRecordingIngestedPayload,
  KasamAggregationPayload,
} from '../types';
⋮----
type SynapseHandler = (
  orchestrator: AdkOrchestrator,
  event: SynapseEvent
) => Promise<unknown>;
⋮----
export async function emitSynapse(
  orchestrator: AdkOrchestrator,
  event: SynapseEvent
): Promise<unknown>
```

## File: functions/src/adk/orchestrator.ts
```typescript
import type { A2AMessage } from '../agents/types';
import { resolveExecutorId } from '../agents/cards';
import { runExecutor } from './executors/runExecutor';
import { validateIntent, getAgentCard, assertCollectionAccess } from './registry';
import { appendMutation, createTrace, clearSynapseState } from './stateStore';
import { applyParalysBreak, isHeavyResponse } from './synapses/paralysBrytarenSynapse';
import { assertBackendSiloIsolation, type SiloId } from './manifest';
import type { DispatchOptions, OrchestrationResult } from './types';
⋮----
function gatekeeperSanitize(text: string): string
⋮----
export class AdkOrchestrator
⋮----
async dispatch(message: A2AMessage, options: DispatchOptions =
⋮----
async dispatchFromSupervisor(
    route: { productAgentId: string; executorId: string; intent: string },
    userInput: string,
    userId: string,
    ragContext: string[],
    dcapPayload: Record<string, unknown>
): Promise<OrchestrationResult>
⋮----
async clearContext(contextId: string): Promise<void>
⋮----
private intentAllowed(productAgentId: string, executorId: string, intent: string): boolean
⋮----
private enforceManifestPolicy(
    executorId: string,
    message: A2AMessage,
    options: DispatchOptions,
): void
⋮----
async initTrace(contextId: string)
⋮----
private async errorResult(contextId: string, agentId: string, error: string): Promise<OrchestrationResult>
```

## File: functions/src/adk/stateStore.ts
```typescript
import crypto from 'crypto';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import type { StateMutation, SynapseState } from './types';
⋮----
export function hashPayload(payload: Record<string, unknown>): string
⋮----
export async function createTrace(contextId: string): Promise<SynapseState>
⋮----
export async function getTrace(contextId: string): Promise<SynapseState | undefined>
⋮----
export async function appendMutation(
  contextId: string,
  mutation: Omit<StateMutation, 'timestamp' | 'payloadHash'> & { payload: Record<string, unknown> }
): Promise<SynapseState>
⋮----
export async function clearSynapseState(contextId: string): Promise<void>
```

## File: functions/src/adk/types.ts
```typescript
import type { AgentResponse, A2AMessage } from '../agents/types';
⋮----
export interface MicroStep {
  instruction: string;
  estimatedSeconds: number;
  physicalAnchor: string;
}
⋮----
export interface StateMutation {
  fromAgentId: string;
  toAgentId: string;
  intent: string;
  payloadHash: string;
  timestamp: string;
}
⋮----
export interface SynapseState {
  contextId: string;
  traceId: string;
  mutations: StateMutation[];
  createdAt: string;
}
⋮----
export type SynapseTrigger =
  | 'drive_file_ingested'
  | 'journal_woven'
  | 'dcap_alert'
  | 'user_overwhelm'
  | 'widget_recording_ingested'
  | 'kasam_aggregation';
⋮----
export interface SynapseEvent {
  trigger: SynapseTrigger;
  contextId?: string;
  payload: Record<string, unknown>;
}
⋮----
export interface DispatchOptions {
  ragContext?: string[];
  applyParalysBreak?: boolean;
  productAgentId?: string;
  targetCollections?: string[];
}
⋮----
export interface OrchestrationResult {
  response: AgentResponse;
  microSteps?: MicroStep[];
  state: SynapseState;
  rawAgentText?: string;
}
⋮----
export type ExecutorFn = (
  message: A2AMessage,
  ragContext: string[]
) => Promise<string>;
⋮----
export interface DriveIngestPayload {
  fileId: string;
  fileName: string;
  mimeType: string;
  ownerId?: string;
  optInTrauma?: boolean;
}
⋮----
export interface JournalWovenPayload {
  ownerId: string;
  journalEntryId: string;
  mood: string;
  text: string;
  optIn: boolean;
}
⋮----
export interface DcapAlertPayload {
  ownerId: string;
  riskScore: number;
  recommendedAction: 'NONE' | 'COACHING' | 'ALERT';
  inputHash: string;
  detectionCount?: number;
}
⋮----
export interface WidgetRecordingIngestedPayload {
  ownerId: string;
  transcript: string;
  recordedAtIso: string;
  durationSeconds?: number;
  evidenceUrl: string;
  sourceRef: string;
  storagePath?: string;
  analysis: { title: string; summary: string; category: string };
  metadata: { vem: string; vad: string; varfor: string };
  hasVaultSession: boolean;
}
⋮----
export interface KasamAggregationPayload {
  ownerId: string;
  triggerSource: string;
}
```

## File: functions/src/agents/DCAP.ts
```typescript
import { genkit, z } from 'genkit';
import { vertexAI, gemini15Flash } from '@genkit-ai/vertexai';
import { DCAP_SEMANTIC_LAYER_SYSTEM_PROMPT } from '../sharedRules';
import { scanTextForTactics, type VaultTechnique } from '../lib/tacticPatternLibrary';
⋮----
export type ManipulationTechnique =
  | 'DARVO'
  | 'GASLIGHTING'
  | 'LOVE_BOMBING'
  | 'SILENT_TREATMENT'
  | 'JADE_BAIT'
  | 'THREAT'
  | 'HOOVERING'
  | 'SMEAR'
  | 'ECONOMIC_CONTROL'
  | 'MATERNAL_FACADE'
  | 'TRAUMA_BONDING'
  | 'LEGAL_PRESSURE'
  | 'UNKNOWN';
⋮----
function vaultTechniqueToDcap(technique: VaultTechnique): ManipulationTechnique
⋮----
export interface DcapDetection {
  technique: ManipulationTechnique;
  matchedPattern: string;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  layer: 'REGEX' | 'SEMANTIC';
}
⋮----
export interface DcapResult {
  riskScore: number;
  detections: DcapDetection[];
  greyRockResponse?: string;
  recommendedAction: 'NONE' | 'COACHING' | 'ALERT';
}
⋮----
function runRegexLayer(text: string):
⋮----
async function runSemanticLayer(
  text: string,
  projectId: string
): Promise<
⋮----
export async function analyzeDcap(text: string, projectId: string): Promise<DcapResult>
```

## File: functions/src/agents/valvChatAgent.ts
```typescript
import { SANNING_ANALYTIKERN_SYSTEM_PROMPT } from '../sharedRules';
import { loadEntityProfileBundle } from '../lib/entityProfileStore';
import { fetchVaultEvidenceForQuery } from '../lib/vaultRag';
import { createGenAI } from '../lib/genaiClient';
import { GEMINI_PRO } from '../lib/modelRouter';
import {
  VALV_CHAT_READ_TOOLS,
  validateValvChatResponse,
  type ValvChatCitation,
  type ValvChatResponse,
} from '../schemas/valvChat';
⋮----
function buildContextBlock(
  chunks: Awaited<ReturnType<typeof fetchVaultEvidenceForQuery>>,
): string
⋮----
function buildPrompt(question: string, entityBlock: string, contextBlock: string): string
⋮----
async function runValvChatGeneration(
  prompt: string,
  allowedDocIds: Set<string>,
  uid: string,
  enableTools: boolean,
): Promise<ValvChatResponse>
⋮----
function tryParseJson(raw: string): unknown
⋮----
export async function askValvChat(uid: string, question: string): Promise<ValvChatResponse>
```

## File: functions/src/agents/vertexAgent.ts
```typescript
import {
  DAGBOK_SNABB_COACHEN_SYSTEM_PROMPT,
  LIVSKOMPASSEN_SYSTEM_CONFIG,
  KBT_TRANSFORMATOR_SYSTEM_PROMPT,
  MABRA_COACHEN_SYSTEM_PROMPT,
  VIT_CHAT_COACH_SYSTEM_PROMPT,
  SPEGLINGS_COACHEN_SYSTEM_PROMPT,
  UPPGIFTS_KROSSAREN_SYSTEM_PROMPT,
  VOICE_TO_VAULT_SYSTEM_PROMPT,
  MABRA_NUTRITION_COACH_SYSTEM_PROMPT,
  MABRA_MOVEMENT_COACH_SYSTEM_PROMPT,
} from '../sharedRules';
import { createGenAI } from '../lib/genaiClient';
import { GEMINI_PRO, GEMINI_FLASH } from '../lib/modelRouter';
import { appendAdaptationSemanticContext } from '../lib/adaptationSemanticContext';
import {
  journalQuickMirrorFallback,
  parseJournalQuickMirrorJson,
  type JournalQuickMirrorResult,
} from '../lib/journalQuickMirrorParse';
import {
  kbtTransformFallback,
  parseKbtTransformJson,
  type KbtTransformResult,
} from '../lib/kbtTransformatorParse';
import {
  type MabraCoachBankEntry,
  type MabraCoachExercise,
  type MabraCoachHub,
  parafraseCoachFromBank,
} from '../lib/mabraContentBank';
import type { CoachTone } from '../../../shared/adaptation/adaptationTypes';
⋮----
export const askKnowledgeVault = async (prompt: string): Promise<string> =>
⋮----
function mirrorFeelingFallback(reflection: string): string
⋮----
export function isSpeglingsFallback(text: string, reflection: string): boolean
⋮----
function vitChatFallback(projectId: string, bankEntry?: MabraCoachBankEntry): string
⋮----
export const askVitChatCoach = async (
  projectId: string,
  userMessage: string,
  bankEntry: MabraCoachBankEntry | undefined,
  geminiApiKey?: string,
): Promise<string> =>
⋮----
export const askMabraCoach = async (
  hubSymptom: MabraCoachHub,
  exerciseType: MabraCoachExercise,
  bankEntry: MabraCoachBankEntry,
  optionalNote?: string,
  geminiApiKey?: string,
  adaptationContext?: string | null,
  coachTone: CoachTone = 'standard',
): Promise<string> =>
⋮----
export const askMabraNutritionCoach = async (
  message: string,
  geminiApiKey?: string,
): Promise<string> =>
⋮----
export const askMabraMovementCoach = async (
  message: string,
  geminiApiKey?: string,
): Promise<string> =>
⋮----
export const askKbtTransformator = async (
  thought: string,
  geminiApiKey?: string,
): Promise<KbtTransformResult> =>
⋮----
export const askSpeglingsCoach = async (
  reflection: string,
  mood?: string,
  geminiApiKey?: string
): Promise<string> =>
⋮----
export const askDagbokSnabbCoach = async (
  mood: string,
  tags: string[],
  optionalText?: string,
  geminiApiKey?: string,
): Promise<JournalQuickMirrorResult> =>
⋮----
export const askUppgiftsKrossaren = async (
  task: string,
  geminiApiKey?: string,
): Promise<string[]> =>
⋮----
export interface VoiceToVaultResult {
  intent: 'task' | 'vault_fact';
  summary: string;
  confidence: number;
  originalText: string;
}
⋮----
export const askVoiceParser = async (
  transcribedText: string,
  geminiApiKey?: string,
): Promise<VoiceToVaultResult> =>
```

## File: functions/src/agents/weaverAgent.ts
```typescript
import { VÄVAREN_SYSTEM_PROMPT } from '../sharedRules';
import { fetchWeaverRagContext } from '../lib/kampsparRag';
import { createGenAI } from '../lib/genaiClient';
import { GEMINI_PRO } from '../lib/modelRouter';
import { createWeaverPending } from '../lib/weaverPending';
⋮----
export type ThreatLevel = 'none' | 'low' | 'medium' | 'high';
⋮----
export interface WeaverResult {
  emotions: string[];
  actors: string[];
  threatLevel: ThreatLevel;
  threatScore?: number;
  ragAnchors: { source: string; docId: string; excerpt?: string }[];
}
⋮----
async function fetchRagContext(uid: string, text: string): Promise<string>
⋮----
function parseWeaverJson(raw: string): WeaverResult | null
⋮----
export async function weaveJournalEntry(
  uid: string,
  journalEntryId: string,
  mood: string,
  text: string
): Promise<
```

## File: scripts/smoke_synapse_triggers.mjs
```javascript
/**
 * Smoke: SynapseBus — 5 triggers registrerade (static).
 * Usage: npm run smoke:synapse-triggers
 */
⋮----
function assert(condition, message)
⋮----
function mustInclude(relPath, ...needles)
⋮----
function main()
```

## File: functions/src/callables/agents.ts
```typescript
import { onCall, HttpsError } from 'firebase-functions/v2/https';
⋮----
import {
  askMabraCoach,
  askVitChatCoach,
  askKbtTransformator,
  askSpeglingsCoach,
  askDagbokSnabbCoach,
  askUppgiftsKrossaren,
} from '../agents/vertexAgent';
import { weaveJournalEntry as runWeaver } from '../agents/weaverAgent';
import { approveWeaverPending, rejectWeaverPending } from '../lib/weaverPending';
import { adkOrchestrator, listAgentCards } from '../adk';
import type { MicroStep } from '../adk/types';
import { emitSynapse } from '../adk/synapses/synapseBus';
import {
  generatePayslipInternal,
  generatePayslipsForAllProfiles,
} from '../economy/generatePayslipInternal';
import {
  MABRA_SPEGLAR_REDIRECT_MESSAGE,
  shouldRedirectMabraCoachToSpeglar,
} from '../lib/mabraCoachGuard';
import { analyzeWidgetRecording } from '../lib/widgetRecordingAnalyze';
import { type WidgetRecordingMetadata } from '../lib/widgetRecordingCommit';
import { revokeVaultSession, readVaultSessionToken, assertVaultSession } from '../lib/vaultSessionGate';
import {
  claimBarnportenPairingForUser,
  createBarnportenPairingForUser,
} from '../lib/barnportenPairing';
import { supervisor, trimSpeglingsMirror } from './shared';
import { guardSensitiveCallableV2 } from '../lib/callableGuards';
import { resolveCoachToneForUser } from '../lib/adaptationCoachTone';
import { loadAdaptationSemanticContext } from '../lib/adaptationSemanticContext';
import {
  fetchUserCapacityScore,
  parafraseCoachFromBankWithCapacity,
  toCapacityBand,
} from '../lib/mabraCapacityParafras';
import {
  getMabraCoachBankEntry,
  parafraseGoalAssist,
  parafraseRsdErrorFromBank,
  resolveBankParafrasBankId,
  resolveCoachBankId,
  resolveGoalAssistBankId,
  resolveRsdErrorBankId,
  resolveVitChatBankId,
  type MabraCoachExercise,
  type MabraCoachHub,
} from '../lib/mabraContentBank';
⋮----
function invalidBankIdError(message: string): HttpsError
⋮----
async function clearVaultJwtClaims(uid: string): Promise<void>
```

## File: functions/src/adk/executors/runExecutor.ts
```typescript
import type { A2AMessage } from '../../agents/types';
import { getAgentSystemPrompt } from '../../sharedRules';
import { createGenAI } from '../../lib/genaiClient';
import { selectModel, autoSelectTier } from '../../lib/modelRouter';
import { getOrCreateCache, generateWithCache } from '../../lib/vertexCache';
⋮----
function buildUserPrompt(message: A2AMessage): string
⋮----
export async function runExecutor(
  executorId: string,
  message: A2AMessage,
  ragContext: string[] = []
): Promise<string>
```
