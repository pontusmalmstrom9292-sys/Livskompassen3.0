/** Deterministisk produktroll → runtime-executor (speglar functions resolveExecutorId). */

const GRANS_EXECUTOR_ID = 'agent_grans_arkitekten';
const LIVS_EXECUTOR_ID = 'agent_livs_arkivarien';

export function resolveExecutorId(productAgentId: string): string {
  switch (productAgentId) {
    case 'agent_biff_skolden':
    case 'agent_brusfiltret':
    case 'agent_sannings_analytikern':
      return GRANS_EXECUTOR_ID;
    case 'agent_monster_arkivarien':
    case 'agent_paralys_brytaren':
    case 'agent_uppgifts_krossaren':
    case 'agent_rsd_kylaren':
    case 'agent_speglings_coachen':
      return LIVS_EXECUTOR_ID;
    default:
      return productAgentId;
  }
}

export function resolveExecutorDisplayName(
  productAgentId: string,
  agentNameById: Map<string, string>,
): string | null {
  const executorId = resolveExecutorId(productAgentId);
  if (executorId === productAgentId) return null;
  return agentNameById.get(executorId) ?? null;
}
