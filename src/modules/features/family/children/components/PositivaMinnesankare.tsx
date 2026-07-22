import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
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

  return (
    <BentoCard
      glow="blue"
      title="Positiva minnesankare"
      description={`Små ljuspunkter — ${childAlias}`}
      icon={<Sparkles className="h-4 w-4" />}
    >
      {anchors.length === 0 ? (
        <EmptyState message="Inga positiva minnesankare ännu. En liten fin stund räcker för att börja." />
      ) : (
        <ul className="space-y-2">
          {anchors.map((log) => (
            <li
              key={log.id}
              className="rounded-xl border border-border/30 bg-surface-2/40 p-3 text-sm text-text-muted"
            >
              <p className="text-[10px] uppercase tracking-widest text-text-muted">
                {log.category ?? 'minne'}
              </p>
              <p className="mt-1 whitespace-pre-wrap">{momentBody(log) || '—'}</p>
            </li>
          ))}
        </ul>
      )}
    </BentoCard>
  );
}
