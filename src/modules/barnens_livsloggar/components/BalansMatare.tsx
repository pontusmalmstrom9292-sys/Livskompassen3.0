import type { BalansResult } from '../types';

interface Props {
  result: BalansResult;
}

export function BalansMatare({ result }: Props) {
  const pct = Math.min(100, Math.max(0, result.index));

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest text-accent">Balansmätare — 7-dagarsaggregering</p>
      <div className="h-3 w-full overflow-hidden rounded-full bg-accent/20">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-text-dim tabular-nums">
          {result.daysWithData} / {7} dagar med data
        </span>
        <span className="tabular-nums text-accent">{result.index}/100</span>
      </div>
      <p className="text-sm text-text-muted">{result.label}</p>
      <p className="text-[10px] italic text-text-dim">
        Neutral aggregering för Den trygga hamnen — inte en dom.
      </p>
    </div>
  );
}
