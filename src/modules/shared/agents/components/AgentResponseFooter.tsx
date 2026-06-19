import { AgentRoutingBadge } from './AgentRoutingBadge';

type Props = {
  productAgentName?: string | null;
  executorName?: string | null;
  agentName?: string | null;
  className?: string;
};

/** Footer under assistent-svar — agentidentitet utan att dominera bubblan. */
export function AgentResponseFooter(props: Props) {
  return <AgentRoutingBadge {...props} className={props.className ?? 'mt-2'} />;
}
