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

export { AvailableAgents, resolveExecutorId, routeFromDcap };
export type { SupervisorRoute };

const EXECUTOR_SILO: Partial<Record<string, SiloId>> = {
  agent_sannings_analytikern: 'valv',
  agent_monster_arkivarien: 'valv',
};

export function getAgentCard(agentId: string): AgentCard | undefined {
  return AvailableAgents[agentId];
}

export function listAgentCards(): AgentCard[] {
  return Object.values(AvailableAgents);
}

export function validateIntent(agentId: string, intent: string): boolean {
  const card = getAgentCard(agentId);
  if (!card) return false;
  return card.capabilities.some((c) => c.name === intent);
}

export function assertCollectionAccess(agentId: string, collection: string): boolean {
  const card = getAgentCard(agentId);
  if (!card) return false;
  if (
    card.dataAccessPolicy.allowedCollections.length > 0 &&
    !card.dataAccessPolicy.allowedCollections.includes(collection)
  ) {
    return false;
  }

  const owner = resolveBackendCollectionDomain(collection);
  if (!owner) return true;
  if (!assertBackendCollectionAccess(owner.id, collection)) return false;

  const executorSilo = EXECUTOR_SILO[agentId];
  if (executorSilo) {
    assertBackendSiloIsolation(executorSilo, owner.silo);
  }
  return true;
}
