import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import type { ChildAlias } from '../constants';
import type { ChildrenLogEntry } from '../types';
import { isFavoriteMoment, momentBody } from '../utils/childMomentHelpers';

type Props = {
  logs: ChildrenLogEntry[];
  childAlias: ChildAlias;
};

/** D13 — positiva minnesankare per barn. */
export function PositivaMinnesankare({ logs, childAlias }: Props) {
  const anchors = useMemo(
    () =>
      logs
        .filter((l) => l.childAlias === childAlias && isFavoriteMoment(l))
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
            <p className="mt-1 whitespace-pre-wrap">{momentBody(log) || '—'}</p>
          </li>
        ))}
      </ul>
    </BentoCard>
  );
}
