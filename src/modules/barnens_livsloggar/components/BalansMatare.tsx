import type { BalansResult } from '../types';
import { TRUST_GOLD, TRUST_LAVENDER } from '../constants';

interface Props {
  result: BalansResult;
}

export function BalansMatare({ result }: Props) {
  const pct = Math.min(100, Math.max(0, result.index));

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest" style={{ color: TRUST_LAVENDER }}>
        Balansmätare — 7-dagarsaggregering
      </p>
      <div
        className="h-3 w-full rounded-full overflow-hidden"
        style={{ backgroundColor: `${TRUST_LAVENDER}33` }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: TRUST_GOLD }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-slate-400">
          {result.daysWithData} / {7} dagar med data
        </span>
        <span style={{ color: TRUST_GOLD }}>{result.index}/100</span>
      </div>
      <p className="text-sm text-slate-300">{result.label}</p>
      <p className="text-[10px] text-slate-500 italic">
        Neutral aggregering för Den trygga hamnen — inte en dom.
      </p>
    </div>
  );
}
