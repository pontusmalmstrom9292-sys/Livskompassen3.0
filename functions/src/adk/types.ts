import type { AgentResponse, A2AMessage } from '../agents/types';

/** Max duration per mikrosteg (neuroinkludering / Paralys-Brytaren). */
export const MICRO_STEP_MAX_SECONDS = 30;

export interface MicroStep {
  instruction: string;
  estimatedSeconds: number;
  physicalAnchor: string;
}

export interface StateMutation {
  fromAgentId: string;
  toAgentId: string;
  intent: string;
  /** SHA-256 prefix — ingen rå PII i synapstillstånd (Zero Footprint). */
  payloadHash: string;
  timestamp: string;
}

export interface SynapseState {
  contextId: string;
  traceId: string;
  mutations: StateMutation[];
  createdAt: string;
}

export type SynapseTrigger =
  | 'drive_file_ingested'
  | 'journal_woven'
  | 'dcap_alert'
  | 'user_overwhelm';

export interface SynapseEvent {
  trigger: SynapseTrigger;
  contextId?: string;
  payload: Record<string, unknown>;
}

export interface DispatchOptions {
  ragContext?: string[];
  applyParalysBreak?: boolean;
  productAgentId?: string;
}

export interface OrchestrationResult {
  response: AgentResponse;
  microSteps?: MicroStep[];
  state: SynapseState;
  rawAgentText?: string;
}

export type ExecutorFn = (
  message: A2AMessage,
  ragContext: string[]
) => Promise<string>;

export interface DriveIngestPayload {
  fileId: string;
  fileName: string;
  mimeType: string;
  ownerId?: string;
  /** G10 — explicit opt-in för trauma/LVU auto-ingest (default false). */
  optInTrauma?: boolean;
}

export interface JournalWovenPayload {
  ownerId: string;
  journalEntryId: string;
  mood: string;
  text: string;
  optIn: boolean;
}

export interface DcapAlertPayload {
  ownerId: string;
  riskScore: number;
  recommendedAction: 'NONE' | 'COACHING' | 'ALERT';
  inputHash: string;
  detectionCount?: number;
}
