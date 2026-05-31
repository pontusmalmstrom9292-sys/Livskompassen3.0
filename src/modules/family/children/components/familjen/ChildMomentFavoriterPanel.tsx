import { useMemo } from 'react';
import { Heart, Sparkles } from 'lucide-react';
import { BentoCard } from '../../../../core/ui/BentoCard';
import { EmptyState } from '../../../../core/ui/EmptyState';
import type { FamiljenShell } from '../../hooks/useFamiljenShell';
import {
  categoryLabel,
  filterFavoriteLogs,
  momentBody,
} from '../../utils/childMomentHelpers';
import { formatChildLogDate } from '../../utils/logFieldUtils';

type Props = {
  shell: FamiljenShell;
};

export function ChildMomentFavoriterPanel({ shell }: Props) {
  const { activeChild, logs } = shell;

  const favorites = useMemo(
    () => filterFavoriteLogs(logs, activeChild),
    [logs, activeChild],
  );

  return (
    <div className="space-y-4">
      <BentoCard
        title="Favoriter"
        description={`Ankare och positiva stunder — ${activeChild}. Spara med kategori «Positivt ankare» eller «Positiv stund».`}
        icon={<Heart className="h-4 w-4" />}
      >
        {favorites.length === 0 ? (
          <EmptyState message="Inga favoriter ännu. Markera en stund som positiv eller ankare under Stunder." />
        ) : (
          <ul className="space-y-3">
            {favorites.map((log) => (
              <li key={log.id} className="glass-card p-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-text-dim">
                      {categoryLabel(log.category)} · {formatChildLogDate(log.createdAt, '—')}
                    </p>
                    <p className="mt-1 text-sm text-text-muted whitespace-pre-wrap">
                      {momentBody(log)}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </BentoCard>
    </div>
  );
}
