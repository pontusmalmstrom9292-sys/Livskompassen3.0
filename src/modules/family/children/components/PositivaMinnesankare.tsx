import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import type { ChildAlias } from '../constants';
import type { ChildrenLogEntry } from '../types';

type Props = {
  logs: ChildrenLogEntry[];
  childAlias: ChildAlias;
};

function isPositiveAnchor(log: ChildrenLogEntry): boolean {
  if (log.category === 'positivt' || log.category === 'ankare') return true;
  const text = `${log.observation ?? ''} ${log.truth ?? ''}`.toLowerCase();
  return /\b(älskar|mys|skratt|stolt|kul|fin|trygg|mysig)\b/.test(text);
}

/** D13 — positiva minnesankare per barn. */
export function PositivaMinnesankare({ logs, childAlias }: Props) {
  const anchors = useMemo(
    () =>
      logs
        .filter((l) => l.childAlias === childAlias && isPositiveAnchor(l))
        .slice(0, 5),
    [logs, childAlias],
  );

  if (anchors.length === 0) return null;

  return (
    <BentoCard
      title="Positiva minnesankare"
      description={`Små ljuspunkter — ${childAlias}`}
      icon={<Sparkles className="h-4 w-4" />}
    >
      <ul className="space-y-2">
        {anchors.map((log) => (
          <li key={log.id} className="glass-card p-3 text-sm text-text-muted">
            <p className="text-[10px] uppercase tracking-widest text-text-dim">
              {log.category ?? 'minne'}
            </p>
            <p className="mt-1 whitespace-pre-wrap">
              {log.observation ?? log.truth ?? '—'}
            </p>
          </li>
        ))}
      </ul>
    </BentoCard>
  );
}
