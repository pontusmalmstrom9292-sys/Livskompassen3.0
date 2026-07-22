import { Loader2 } from 'lucide-react';
import { AgentRegistryCard } from '@/shared/agents/components/AgentRegistryCard';
import type { AgentRegistryCard as AgentCardData } from '@/shared/agents/types/agentRegistry';
import { useAgentRegistry } from '@/shared/agents/hooks/useAgentRegistry';
import { fallbackTrioAgents } from '@/shared/agents/utils/agentRegistryFallback';

const TRIO_IDS = ['agent_brusfiltret', 'agent_biff_skolden', 'agent_sannings_analytikern'] as const;

const TRIO_ACTION_LABELS: Record<(typeof TRIO_IDS)[number], string> = {
  agent_brusfiltret: 'Öppna Brusfilter',
  agent_biff_skolden: 'Öppna BIFF-svar',
  agent_sannings_analytikern: 'Öppna Sannings-Analytikern',
};

type Props = {
  onAgentAction?: (agentId: string) => void;
};

/** D17 — tre primära agenter; klickbara när onAgentAction ges. */
export function OrkesterAgentTrio({ onAgentAction }: Props) {
  const { agents, loading, agentNameById } = useAgentRegistry();

  const trioFromRegistry = agents.filter((a) =>
    TRIO_IDS.includes(a.metadata.id as (typeof TRIO_IDS)[number]),
  );
  const source = trioFromRegistry.length >= 3 ? trioFromRegistry : fallbackTrioAgents();

  const display = TRIO_IDS.map((id) => source.find((a) => a.metadata.id === id)).filter(
    (a): a is AgentCardData => Boolean(a),
  );

  if (loading && display.length === 0) {
    return (
      <p className="mb-4 flex items-center justify-center gap-2 py-4 text-xs text-text-muted">
        <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        Laddar Orkester-trio…
      </p>
    );
  }

  return (
    <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
      {display.map((agent) => {
        const actionLabel = TRIO_ACTION_LABELS[agent.metadata.id as (typeof TRIO_IDS)[number]];
        return (
          <AgentRegistryCard
            key={agent.metadata.id}
            agent={agent}
            agentNameById={agentNameById}
            compact
            onAction={onAgentAction && actionLabel ? onAgentAction : undefined}
            actionLabel={onAgentAction ? actionLabel : undefined}
          />
        );
      })}
    </div>
  );
}
