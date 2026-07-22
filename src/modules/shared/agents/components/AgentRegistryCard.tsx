import { Cpu } from 'lucide-react';
import type { AgentRegistryCard as AgentCardData } from '../types/agentRegistry';
import { getProductAgentUiMeta } from '../utils/productAgentUiMeta';
import { resolveExecutorId } from '../utils/resolveExecutorDisplay';
import { Button } from '@/design-system';

type Props = {
  agent: AgentCardData;
  agentNameById: Map<string, string>;
  compact?: boolean;
  onAction?: (agentId: string) => void;
  actionLabel?: string;
};

export function AgentRegistryCard({
  agent,
  agentNameById,
  compact = false,
  onAction,
  actionLabel,
}: Props) {
  const ui = getProductAgentUiMeta(agent.metadata.id);
  const executorId = resolveExecutorId(agent.metadata.id);
  const executorName =
    executorId !== agent.metadata.id ? agentNameById.get(executorId) : undefined;
  const capabilityCount = agent.capabilities.length;

  return (
    <article
      className={`calm-card glow-bottom-blue border border-border/30 bg-surface-2/50 p-3 ${
        compact ? 'text-center' : ''
      }`}
    >
      <div className={compact ? '' : 'flex items-start justify-between gap-2'}>
        <div className={compact ? '' : 'min-w-0 flex-1'}>
          <p className="text-xs font-medium text-accent">{agent.metadata.name}</p>
          {ui && (
            <p className="mt-1 text-[10px] text-text-muted">
              {ui.role} · {ui.focus}
            </p>
          )}
          {!compact && (
            <p className="mt-2 text-xs leading-relaxed text-text-muted">
              {agent.metadata.description}
            </p>
          )}
        </div>
        {!compact && (
          <span className="shrink-0 rounded-full border border-border/40 px-2 py-0.5 text-[10px] text-text-muted">
            v{agent.metadata.version}
          </span>
        )}
      </div>

      {!compact && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-text-muted">
          {ui?.zoneLabel ? (
            <span className="rounded-full border border-border/30 px-2 py-0.5">{ui.zoneLabel}</span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <Cpu className="h-3 w-3 opacity-70" aria-hidden />
            {capabilityCount} {capabilityCount === 1 ? 'förmåga' : 'förmågor'}
          </span>
          {executorName ? (
            <span className="normal-case tracking-normal text-text-muted">
              via {executorName}
            </span>
          ) : null}
        </div>
      )}

      {onAction && actionLabel ? (
        <Button type="button" onClick={() => onAction(agent.metadata.id)} variant="ghost" className="--ghost mt-3 w-full text-[10px] uppercase tracking-widest">
          {actionLabel}
        </Button>
      ) : null}
    </article>
  );
}
