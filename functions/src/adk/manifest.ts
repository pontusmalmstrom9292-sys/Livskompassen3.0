/**
 * Master Integration Manifest — backend runtime mirror.
 * Kanon: docs/architecture/MASTER-INTEGRATION-MANIFEST.md
 *
 * Wired into `registry.ts` (collection access) and `orchestrator.ts` (silo isolation).
 */

/** U1 silo identifiers — no fourth RAG silo. */
export type SiloId = 'kunskap' | 'valv' | 'barnen' | 'vardag' | 'core';

export type DomainId = 'K' | 'V' | 'F' | 'L' | 'C';

export type SynapseTrigger =
  | 'drive_file_ingested'
  | 'journal_woven'
  | 'dcap_alert'
  | 'user_overwhelm'
  | 'widget_recording_ingested'
  | 'kasam_aggregation';

export interface BackendDomainContract {
  readonly id: DomainId;
  readonly silo: SiloId;
  readonly wormCollections: readonly string[];
  readonly mutableCollections: readonly string[];
  readonly adminOnlyCollections: readonly string[];
  readonly allowedCrossReads: readonly SiloId[];
  readonly requiresVaultUnlock: boolean;
}

/** Minimal backend manifest — collection ownership for assertCollectionAccess extension. */
export const BACKEND_MANIFEST: Readonly<Record<DomainId, BackendDomainContract>> = {
  K: {
    id: 'K',
    silo: 'kunskap',
    wormCollections: ['kampspar', 'kb_docs', 'routines'],
    mutableCollections: [],
    adminOnlyCollections: [],
    allowedCrossReads: [],
    requiresVaultUnlock: false,
  },
  V: {
    id: 'V',
    silo: 'valv',
    wormCollections: [
      'reality_vault',
      'dossier_snapshots',
      'dcap_alerts',
      'entity_profiles',
      'system_synapses',
      'vault',
      'insight_summaries',
      'allocation_proposals',
      'payslip_snapshots',
    ],
    mutableCollections: [],
    adminOnlyCollections: [
      'dcap_alerts',
      'dossier_snapshots',
      'entity_profiles',
      'system_synapses',
      'insight_summaries',
      'allocation_proposals',
      'payslip_snapshots',
    ],
    allowedCrossReads: [],
    requiresVaultUnlock: true,
  },
  F: {
    id: 'F',
    silo: 'barnen',
    wormCollections: ['children_logs'],
    mutableCollections: [],
    adminOnlyCollections: [
      'barnporten_pairings',
      'barnporten_devices',
      'inbox_queue',
    ],
    allowedCrossReads: [],
    requiresVaultUnlock: false,
  },
  L: {
    id: 'L',
    silo: 'vardag',
    wormCollections: [
      'journal',
      'mabra_sessions',
      'vit_entries',
      'emotional_memory',
      'transactions',
      'checkins',
    ],
    mutableCollections: [
      'mabra_progress',
      'user_daily_focus',
      'vit_hub',
      'planning_tasks',
      'projects',
      'project_blocks',
      'planning_email_rules',
      'project_rules',
      'routine_templates',
      'material_pack_overrides',
      'economy_profiles',
      'economy_ledger',
      'economy_fixed_bills',
      'budget_savings',
      'budgets',
      'economy_impulse_queue',
      'time_entries',
      'user_widgets',
      'user_tags',
      'user_insights',
    ],
    adminOnlyCollections: ['user_economy_status', 'user_capability_state'],
    allowedCrossReads: [],
    requiresVaultUnlock: false,
  },
  C: {
    id: 'C',
    silo: 'core',
    wormCollections: ['evolution_ledger', 'adaptation_ledger'],
    mutableCollections: ['evolution_hub', 'adaptation_prefs', 'adaptation_semantic_profile'],
    adminOnlyCollections: [
      '_rate_limits',
      'access_tokens_economy',
      'context_cache_registry',
      'weaver_pending',
    ],
    allowedCrossReads: ['kunskap', 'valv', 'barnen', 'vardag'],
    requiresVaultUnlock: false,
  },
} as const;

const SILO_ISOLATED: readonly DomainId[] = ['K', 'V', 'F'];

export class BackendManifestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BackendManifestError';
  }
}

/** Lookup domain that owns a collection. */
export function resolveBackendCollectionDomain(
  collection: string,
): BackendDomainContract | undefined {
  for (const contract of Object.values(BACKEND_MANIFEST)) {
    if (
      contract.wormCollections.includes(collection) ||
      contract.mutableCollections.includes(collection) ||
      contract.adminOnlyCollections.includes(collection)
    ) {
      return contract;
    }
  }
  return undefined;
}

/** Assert U1 — no cross-RAG between isolated silos. */
export function assertBackendSiloIsolation(fromSilo: SiloId, toSilo: SiloId): void {
  if (fromSilo === toSilo || fromSilo === 'core' || toSilo === 'core') return;

  const fromDomain = Object.values(BACKEND_MANIFEST).find((d) => d.silo === fromSilo);
  if (
    fromDomain &&
    SILO_ISOLATED.includes(fromDomain.id) &&
    fromDomain.allowedCrossReads.length === 0
  ) {
    throw new BackendManifestError(
      `Cross-RAG forbidden: ${fromSilo} → ${toSilo} (U1)`,
    );
  }
}

/** Assert collection is WORM — reject update/delete. */
export function assertBackendWorm(
  collection: string,
  operation: 'update' | 'delete',
): boolean {
  const domain = resolveBackendCollectionDomain(collection);
  if (!domain?.wormCollections.includes(collection)) return false;
  throw new BackendManifestError(
    `WORM collection "${collection}" forbids ${operation}`,
  );
}

/** Check agent card allowedCollections against manifest domain. */
export function assertBackendCollectionAccess(
  domainId: DomainId,
  collection: string,
): boolean {
  const contract = BACKEND_MANIFEST[domainId];
  const allowed = [
    ...contract.wormCollections,
    ...contract.mutableCollections,
    ...contract.adminOnlyCollections,
  ];
  return allowed.includes(collection);
}

/** All WORM collections (deduplicated) for smoke:manifest alignment. */
export function getBackendWormCollections(): string[] {
  const seen = new Set<string>();
  for (const contract of Object.values(BACKEND_MANIFEST)) {
    for (const col of contract.wormCollections) {
      seen.add(col);
    }
  }
  return [...seen];
}
