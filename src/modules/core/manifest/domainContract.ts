/**
 * Master Integration Manifest — domain contract types.
 * Kanon: docs/architecture/MASTER-INTEGRATION-MANIFEST.md
 * Fas 1: inert skelett — importeras ej av runtime än.
 */

/** The five agent domains (hybrid: 4 data/silo-zon + 1 Core spine). */
export type DomainId = 'K' | 'V' | 'F' | 'L' | 'C';

/** U1 silo identifiers — no fourth RAG silo permitted. */
export type SiloId = 'kunskap' | 'valv' | 'barnen' | 'vardag' | 'core';

/** ADK synapse triggers (mirrors functions/src/adk/types.ts). */
export type SynapseTrigger =
  | 'drive_file_ingested'
  | 'journal_woven'
  | 'dcap_alert'
  | 'user_overwhelm'
  | 'widget_recording_ingested';

/** WORM mutation policy inherited by every collection in wormCollections. */
export interface WormPolicy {
  /** Firestore: update and delete MUST be denied. */
  readonly immutable: true;
  /** Create must pass keys().hasOnly when schema is locked. */
  readonly keysOnlyEnforced: boolean;
  /** Server timestamp required; no client updatedAt. */
  readonly serverTimestampRequired: boolean;
}

/** Default WORM policy applied to all wormCollections entries. */
export const DEFAULT_WORM_POLICY: WormPolicy = {
  immutable: true,
  keysOnlyEnforced: true,
  serverTimestampRequired: true,
} as const;

/**
 * Typed contract every agent domain MUST declare.
 * New modules register against one domain and inherit its policies.
 */
export interface DomainContract {
  readonly id: DomainId;
  readonly label: string;
  readonly silo: SiloId;
  /** Append-only collections — update/delete forbidden. */
  readonly wormCollections: readonly string[];
  /** User-mutable collections within the domain. */
  readonly mutableCollections: readonly string[];
  /** Admin SDK / Cloud Functions only — no client write. */
  readonly adminOnlyCollections: readonly string[];
  /**
   * Cross-silo RAG reads — MUST be empty [] for K, V, F (U1).
   * Only Core (C) may coordinate synapses across silos (never via RAG).
   */
  readonly allowedCrossReads: readonly SiloId[];
  readonly requiresVaultUnlock: boolean;
  readonly requiresVerifiedEmail: boolean;
  readonly synapseEmits: readonly SynapseTrigger[];
  readonly synapseConsumes: readonly SynapseTrigger[];
  /** Callable function names this domain may invoke. */
  readonly callables: readonly string[];
  /** Product agent IDs (AGENTS.md) bound to this domain. */
  readonly productAgentIds: readonly string[];
}

/** Map of all registered domains — single source of truth. */
export type MasterManifest = Readonly<Record<DomainId, DomainContract>>;

/** Domains that MUST have empty allowedCrossReads (U1 silo isolation). */
export const SILO_ISOLATED_DOMAINS: readonly DomainId[] = ['K', 'V', 'F'] as const;

/** Canonical WORM collections across the system (U3). */
export const CANONICAL_WORM_COLLECTIONS: readonly string[] = [
  'reality_vault',
  'children_logs',
  'journal',
  'evolution_ledger',
  'dossier_snapshots',
  'kampspar',
  'kb_docs',
  'dcap_alerts',
  'entity_profiles',
  'system_synapses',
  'insight_summaries',
  'allocation_proposals',
  'payslip_snapshots',
  'routines',
  'mabra_sessions',
  'vit_entries',
  'emotional_memory',
  'transactions',
  'checkins',
] as const;
