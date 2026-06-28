/** Pure routing label — testbar utan React. */
export function formatAgentRoutingLabel(input: {
  productAgentName?: string | null;
  executorName?: string | null;
  agentName?: string | null;
}): string | null {
  const product = input.productAgentName?.trim();
  const executor = input.executorName?.trim();
  const legacy = input.agentName?.trim();

  if (!product && !executor && !legacy) return null;

  const displayName = product ?? legacy ?? '';
  const showExecutor =
    Boolean(product && executor && product.toLowerCase() !== executor.toLowerCase()) ||
    Boolean(!product && legacy && executor);

  if (showExecutor && executor) {
    return `Dirigerad av ${displayName} via ${executor}`;
  }
  return `Dirigerad av ${displayName}`;
}
