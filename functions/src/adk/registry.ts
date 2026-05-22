import {
  AvailableAgents,
  resolveExecutorId,
  type SupervisorRoute,
  routeFromDcap,
} from '../agents/cards';
import type { AgentCard } from '../agents/types';

export { AvailableAgents, resolveExecutorId, routeFromDcap };
export type { SupervisorRoute };

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
  if (card.dataAccessPolicy.allowedCollections.length === 0) return true;
  return card.dataAccessPolicy.allowedCollections.includes(collection);
}
