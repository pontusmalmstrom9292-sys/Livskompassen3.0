import { PRODUCT_AGENTS } from '@/features/lifeJournal/evidence/vault/constants/productAgents';
import type { AgentRegistryCard as AgentCardData } from '../types/agentRegistry';

export function fallbackAgentsFromProductList(): AgentCardData[] {
  return PRODUCT_AGENTS.map((agent) => ({
    metadata: {
      id: agent.id,
      name: agent.name,
      description: `${agent.role} — ${agent.focus}`,
      version: '—',
    },
    capabilities: [],
    dataAccessPolicy: { canAccessPII: false, allowedCollections: [] },
  }));
}

export function fallbackTrioAgents(): AgentCardData[] {
  const trioIds = new Set(['agent_brusfiltret', 'agent_biff_skolden', 'agent_sannings_analytikern']);
  return fallbackAgentsFromProductList().filter((a) => trioIds.has(a.metadata.id));
}
