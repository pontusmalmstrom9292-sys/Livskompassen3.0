import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Network, RefreshCw } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { fetchAgentRegistry } from '@/shared/agents/api/agentRegistryService';
import { AgentRegistryCard } from '@/shared/agents/components/AgentRegistryCard';
import type { AgentRegistryCard as AgentCardData } from '@/shared/agents/types/agentRegistry';
import { PRODUCT_AGENTS } from '@/features/lifeJournal/evidence/vault/constants/productAgents';

function fallbackAgentsFromProductList(): AgentCardData[] {
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

/** Live ADK AgentCard-registret — ersätter statisk PRODUCT_AGENTS-lista. */
export function AdkAgentRegistryPanel() {
  const [agents, setAgents] = useState<AgentCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usedFallback, setUsedFallback] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAgentRegistry();
      setAgents(data.agents);
      setUsedFallback(false);
    } catch (err) {
      setAgents(fallbackAgentsFromProductList());
      setUsedFallback(true);
      setError(err instanceof Error ? err.message : 'Kunde inte ladda registret.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const agentNameById = useMemo(
    () => new Map(agents.map((a) => [a.metadata.id, a.metadata.name])),
    [agents],
  );

  const sortedAgents = useMemo(
    () =>
      [...agents].sort((a, b) => a.metadata.name.localeCompare(b.metadata.name, 'sv')),
    [agents],
  );

  return (
    <BentoCard
      title="Assistentroller"
      description="Live ADK-registret — vilka agenter som finns och vad de gör"
      icon={<Network className="h-4 w-4" />}
      glow="gold"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs text-text-dim">
          {usedFallback
            ? 'Offline-läge — visar lokal lista tills molnet svarar.'
            : 'Hämtat från backend AgentCards (A2A).'}
        </p>
        <button
          type="button"
          onClick={() => void load()}
          disabled={loading}
          className="btn-pill--ghost inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest disabled:opacity-50"
          aria-label="Uppdatera agentregistret"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          ) : (
            <RefreshCw className="h-3 w-3" aria-hidden />
          )}
          Uppdatera
        </button>
      </div>

      {loading && agents.length === 0 && (
        <p className="flex items-center gap-2 text-sm text-text-muted" role="status">
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
          Laddar assistenter…
        </p>
      )}

      {error && (
        <p className="mb-3 text-xs text-amber-400/90" role="status">
          {error}
        </p>
      )}

      {!loading || agents.length > 0 ? (
        <ul className="space-y-2">
          {sortedAgents.map((agent) => (
            <li key={agent.metadata.id}>
              <AgentRegistryCard agent={agent} agentNameById={agentNameById} />
            </li>
          ))}
        </ul>
      ) : null}
    </BentoCard>
  );
}
