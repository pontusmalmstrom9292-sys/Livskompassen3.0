import { PRODUCT_AGENTS } from '../constants/productAgents';

const TRIO_IDS = ['agent_brusfiltret', 'agent_biff_skolden', 'agent_sannings_analytikern'] as const;

/** D17 — tre primära agenter i Orkester-vyn. */
export function OrkesterAgentTrio() {
  const trio = PRODUCT_AGENTS.filter((a) => TRIO_IDS.includes(a.id as (typeof TRIO_IDS)[number]));
  const display = trio.length >= 3 ? trio.slice(0, 3) : PRODUCT_AGENTS.slice(0, 3);

  return (
    <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
      {display.map((agent) => (
        <div key={agent.id} className="elongated-module p-3 text-center">
          <p className="text-xs font-medium text-accent">{agent.name}</p>
          <p className="mt-1 text-[10px] text-text-dim">{agent.role}</p>
        </div>
      ))}
    </div>
  );
}
