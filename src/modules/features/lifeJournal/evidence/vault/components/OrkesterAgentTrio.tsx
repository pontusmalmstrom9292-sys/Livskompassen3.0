import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { fetchAgentRegistry } from '@/shared/agents/api/agentRegistryService';
import { AgentRegistryCard } from '@/shared/agents/components/AgentRegistryCard';
import type { AgentRegistryCard as AgentCardData } from '@/shared/agents/types/agentRegistry';
import { PRODUCT_AGENTS } from '../constants/productAgents';

const TRIO_IDS = ['agent_brusfiltret', 'agent_biff_skolden', 'agent_sannings_analytikern'] as const;

const TRIO_ACTION_LABELS: Record<(typeof TRIO_IDS)[number], string> = {
  agent_brusfiltret: 'Öppna Brusfilter',
  agent_biff_skolden: 'Öppna Brusfilter',
  agent_sannings_analytikern: 'Öppna Sannings-Analytikern',
};

type Props = {
  onAgentAction?: (agentId: string) => void;
};

function fallbackTrio(): AgentCardData[] {
  return PRODUCT_AGENTS.filter((a) =>
    TRIO_IDS.includes(a.id as (typeof TRIO_IDS)[number]),
  ).map((agent) => ({
    metadata: {
      id: agent.id,
      name: agent.name,
      description: agent.focus,
      version: '—',
    },
    capabilities: [],
    dataAccessPolicy: { canAccessPII: false, allowedCollections: [] },
  }));
}

/** D17 — tre primära agenter; klickbara när onAgentAction ges. */
export function OrkesterAgentTrio({ onAgentAction }: Props) {
  const [agents, setAgents] = useState<AgentCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchAgentRegistry();
        if (cancelled) return;
        const trio = data.agents.filter((a) =>
          TRIO_IDS.includes(a.metadata.id as (typeof TRIO_IDS)[number]),
        );
        setAgents(trio.length >= 3 ? trio : fallbackTrio());
      } catch {
        if (!cancelled) setAgents(fallbackTrio());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const agentNameById = useMemo(
    () => new Map(agents.map((a) => [a.metadata.id, a.metadata.name])),
    [agents],
  );

  const display =
    agents.length >= 3
      ? TRIO_IDS.map((id) => agents.find((a) => a.metadata.id === id)).filter(
          (a): a is AgentCardData => Boolean(a),
        )
      : agents;

  const handleAction = useCallback(
    (agentId: string) => {
      onAgentAction?.(agentId);
    },
    [onAgentAction],
  );

  if (loading && display.length === 0) {
    return (
      <p className="mb-4 flex items-center justify-center gap-2 py-4 text-xs text-text-dim">
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
            onAction={onAgentAction && actionLabel ? handleAction : undefined}
            actionLabel={onAgentAction ? actionLabel : undefined}
          />
        );
      })}
    </div>
  );
}
