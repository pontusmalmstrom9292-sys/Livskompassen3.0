import { Loader2, Network, RefreshCw } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { AgentRegistryCard } from '@/shared/agents/components/AgentRegistryCard';
import { useAgentRegistry } from '@/shared/agents/hooks/useAgentRegistry';

/** Live ADK AgentCard-registret — delad fetch via AgentRegistryProvider. */
export function AdkAgentRegistryPanel() {
  const { agents, loading, error, usedFallback, reload, agentNameById } = useAgentRegistry();

  const sortedAgents = [...agents].sort((a, b) =>
    a.metadata.name.localeCompare(b.metadata.name, 'sv'),
  );

  return (
    <BentoCard
      title="Assistentroller"
      description="Live ADK-registret — vilka agenter som finns och vad de gör"
      icon={<Network className="h-4 w-4" />}
      glow="blue"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-xs text-text-muted">
          {usedFallback
            ? 'Offline-läge — visar lokal lista tills molnet svarar.'
            : 'Hämtat från backend AgentCards (A2A).'}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest disabled:opacity-50 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          onClick={() => void reload()}
          disabled={loading}
          aria-label="Uppdatera agentregistret"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          ) : (
            <RefreshCw className="h-3 w-3" aria-hidden />
          )}
          Uppdatera
        </Button>
      </div>

      {loading && agents.length === 0 && (
        <p className="flex items-center gap-2 text-sm text-text-muted" role="status">
          <Loader2 className="h-4 w-4 animate-spin shrink-0" aria-hidden />
          Laddar assistenter…
        </p>
      )}

      {error && (
        <p className="mb-3 text-xs text-danger" role="status">
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
