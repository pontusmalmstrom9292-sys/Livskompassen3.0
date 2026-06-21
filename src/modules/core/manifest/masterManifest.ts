/**
 * Master Integration Manifest — the five agent domains.
 * Kanon: docs/architecture/MASTER-INTEGRATION-MANIFEST.md
 * Fas 1: inert skelett — not wired into runtime yet.
 */

import type { DomainContract, MasterManifest } from './domainContract';

/** K — Kunskap (FACT/RAG silo). */
const KUNSKAP_DOMAIN = {
  id: 'K',
  label: 'Kunskap',
  silo: 'kunskap',
  wormCollections: ['kampspar', 'kb_docs', 'routines'],
  mutableCollections: [],
  adminOnlyCollections: [],
  allowedCrossReads: [],
  requiresVaultUnlock: false,
  requiresVerifiedEmail: false,
  synapseEmits: [],
  synapseConsumes: ['journal_woven', 'drive_file_ingested'],
  callables: ['knowledgeVaultQuery'],
  productAgentIds: [
    'agent_livs_arkivarien',
    'agent_monster_arkivarien',
  ],
} as const satisfies DomainContract;

/** V — Valv (WORM evidence silo). */
const VALV_DOMAIN = {
  id: 'V',
  label: 'Valv',
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
  requiresVerifiedEmail: true,
  synapseEmits: [],
  synapseConsumes: ['drive_file_ingested', 'dcap_alert', 'widget_recording_ingested'],
  callables: ['valvChatQuery', 'analyzeMessage'],
  productAgentIds: ['agent_sannings_analytikern', 'agent_monster_arkivarien'],
} as const satisfies DomainContract;

/** F — Familj/Barn (children silo + HITL). */
const FAMILJ_DOMAIN = {
  id: 'F',
  label: 'Familj/Barn',
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
  requiresVerifiedEmail: true,
  synapseEmits: [],
  synapseConsumes: ['drive_file_ingested', 'widget_recording_ingested'],
  callables: ['childrenLogsQuery'],
  productAgentIds: [
    'agent_grans_arkitekten',
    'agent_biff_skolden',
    'agent_brusfiltret',
  ],
} as const satisfies DomainContract;

/** L — Vardag / Life-OS (capacity-gated mutable state). */
const VARDAG_DOMAIN = {
  id: 'L',
  label: 'Vardag / Life-OS',
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
    'mabra_explore_queue',
    'mabra_nutrition_log',
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
  requiresVerifiedEmail: true,
  synapseEmits: ['journal_woven', 'user_overwhelm', 'widget_recording_ingested'],
  synapseConsumes: [],
  callables: ['ingestWidgetRecording'],
  productAgentIds: [
    'agent_paralys_brytaren',
    'agent_speglings_coachen',
    'agent_rsd_kylaren',
    'agent_uppgifts_krossaren',
  ],
} as const satisfies DomainContract;

/** C — Core / Evolution spine (inherited by K, V, F, L). */
const CORE_DOMAIN = {
  id: 'C',
  label: 'Core / Evolution-ryggrad',
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
  requiresVerifiedEmail: false,
  synapseEmits: [
    'drive_file_ingested',
    'journal_woven',
    'dcap_alert',
    'user_overwhelm',
    'widget_recording_ingested',
  ],
  synapseConsumes: [
    'drive_file_ingested',
    'journal_woven',
    'dcap_alert',
    'user_overwhelm',
    'widget_recording_ingested',
  ],
  callables: [
    'getAdaptationProfile',
    'recordAdaptationSignal',
    'getAdaptationSemanticProfile',
    'rebuildAdaptationSemanticProfile',
  ],
  productAgentIds: [],
} as const satisfies DomainContract;

/**
 * Master Integration Manifest — single registration point for all domains.
 * firestore.rules, AgentCards, and smoke:manifest MUST align with this map.
 */
export const MASTER_MANIFEST = {
  K: KUNSKAP_DOMAIN,
  V: VALV_DOMAIN,
  F: FAMILJ_DOMAIN,
  L: VARDAG_DOMAIN,
  C: CORE_DOMAIN,
} as const satisfies MasterManifest;

/** Ordered domain list for iteration in guards and smoke. */
export const DOMAIN_IDS = ['K', 'V', 'F', 'L', 'C'] as const;

/** Resolve a domain contract by ID. */
export function getDomainContract(id: keyof typeof MASTER_MANIFEST): DomainContract {
  return MASTER_MANIFEST[id];
}

/** All WORM collections across every domain (deduplicated). */
export function getAllWormCollections(): readonly string[] {
  const seen = new Set<string>();
  for (const domainId of DOMAIN_IDS) {
    for (const col of MASTER_MANIFEST[domainId].wormCollections) {
      seen.add(col);
    }
  }
  return [...seen];
}

function collectionOwnedByDomain(
  contract: DomainContract,
  collection: string,
): boolean {
  const lists = [
    contract.wormCollections,
    contract.mutableCollections,
    contract.adminOnlyCollections,
  ] as const;
  return lists.some((list) => list.some((col) => col === collection));
}

/** Lookup which domain owns a Firestore collection (first match wins). */
export function resolveCollectionDomain(collection: string): DomainContract | undefined {
  for (const domainId of DOMAIN_IDS) {
    const contract = MASTER_MANIFEST[domainId];
    if (collectionOwnedByDomain(contract, collection)) {
      return contract;
    }
  }
  return undefined;
}
