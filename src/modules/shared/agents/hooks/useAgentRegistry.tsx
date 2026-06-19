import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { fetchAgentRegistry } from '../api/agentRegistryService';
import type { AgentRegistryCard as AgentCardData } from '../types/agentRegistry';
import { fallbackAgentsFromProductList } from '../utils/agentRegistryFallback';

export type AgentRegistryState = {
  agents: AgentCardData[];
  loading: boolean;
  error: string | null;
  usedFallback: boolean;
  reload: () => Promise<void>;
  agentNameById: Map<string, string>;
};

const AgentRegistryContext = createContext<AgentRegistryState | null>(null);

export function AgentRegistryProvider({ children }: { children: ReactNode }) {
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

  const value = useMemo(
    () => ({
      agents,
      loading,
      error,
      usedFallback,
      reload: load,
      agentNameById,
    }),
    [agents, loading, error, usedFallback, load, agentNameById],
  );

  return (
    <AgentRegistryContext.Provider value={value}>{children}</AgentRegistryContext.Provider>
  );
}

export function useAgentRegistry(): AgentRegistryState {
  const ctx = useContext(AgentRegistryContext);
  if (!ctx) {
    throw new Error('useAgentRegistry måste användas inom AgentRegistryProvider.');
  }
  return ctx;
}
