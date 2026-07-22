import { formatAgentRoutingLabel } from '../utils/routingBadgeText';

type Props = {
  /** Produktroll som användaren möter (t.ex. BIFF-Skölden). */
  productAgentName?: string | null;
  /** Runtime-executor om den skiljer sig från produktrollen. */
  executorName?: string | null;
  /** Legacy Hamn/Orkester — endast executor-namn. */
  agentName?: string | null;
  className?: string;
};

/** Lugn etikett: vilken assistent som dirigerade svaret. */
export function AgentRoutingBadge({
  productAgentName,
  executorName,
  agentName,
  className = '',
}: Props) {
  const label = formatAgentRoutingLabel({ productAgentName, executorName, agentName });
  if (!label) return null;

  const product = productAgentName?.trim();
  const executor = executorName?.trim();
  const legacy = agentName?.trim();
  const showExecutor =
    Boolean(product && executor && product.toLowerCase() !== executor.toLowerCase()) ||
    Boolean(!product && legacy && executor);

  return (
    <p
      className={`text-[10px] uppercase tracking-widest text-text-muted ${className}`.trim()}
      role="status"
    >
      Dirigerad av{' '}
      <span className="text-accent">{product ?? legacy}</span>
      {showExecutor && executor ? (
        <>
          {' '}
          via <span className="text-text-muted normal-case tracking-normal">{executor}</span>
        </>
      ) : null}
    </p>
  );
}
