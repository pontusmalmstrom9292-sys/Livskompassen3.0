import { useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import { EmptyState } from '@/core/ui/EmptyState';
import { SaveAsEvidencePrompt } from '../SaveAsEvidencePrompt';
import type { FamiljenShell } from '../../hooks/useFamiljenShell';
import {
  categoryIcon,
  categoryLabel,
  filterStunderLogs,
  isFavoriteMoment,
  momentBody,
} from '../../utils/childMomentHelpers';
import { formatChildLogDate } from '../../utils/logFieldUtils';

type Props = {
  shell: FamiljenShell;
};

type StunderFilter = 'all' | 'positiv' | 'barnfokus' | 'skola';

const FILTER_CHIPS: { id: StunderFilter; label: string }[] = [
  { id: 'all', label: 'Alla' },
  { id: 'positiv', label: 'Positiva' },
  { id: 'barnfokus', label: 'Barnfokus' },
  { id: 'skola', label: 'Skola' },
];

/** Read-only stund-tidslinje — inmatning sker via FamiljenInputSuperModule (Fas 7E). */
export function ChildMomentStunderPanel({ shell }: Props) {
  const {
    user,
    activeChild,
    logs,
    evidenceForLogId,
    setEvidenceForLogId,
  } = shell;

  const [filter, setFilter] = useState<StunderFilter>('all');

  const stunder = useMemo(
    () => filterStunderLogs(logs, activeChild, filter),
    [logs, activeChild, filter],
  );

  if (!user) return null;

  return (
    <div className="space-y-4">
      <p className="text-xs uppercase tracking-widest text-text-dim">Senaste stunder</p>

      <div className="flex flex-wrap gap-2">
        {FILTER_CHIPS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-3 py-1 text-xs ${
              filter === f.id ? 'chip--active' : 'chip--idle'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {stunder.length === 0 ? (
        <EmptyState message="Inga stunder i detta filter ännu." />
      ) : (
        <ul className="space-y-3">
          {stunder.map((log) => {
            const Icon = categoryIcon(log.category);
            const favorite = isFavoriteMoment(log);
            return (
              <li key={log.id} className="glass-card p-3">
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent"
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[10px] uppercase tracking-widest text-text-dim">
                        {categoryLabel(log.category)} · {formatChildLogDate(log.createdAt, '—')}
                      </p>
                      {favorite && (
                        <Heart
                          className="h-4 w-4 shrink-0 fill-accent/80 text-accent"
                          aria-label="Favorit"
                        />
                      )}
                    </div>
                    <p className="mt-1 text-sm text-text-muted whitespace-pre-wrap">
                      {momentBody(log)}
                    </p>
                    {log.action === 'livslogg' && log.id && evidenceForLogId !== log.id && (
                      <button
                        type="button"
                        onClick={() => setEvidenceForLogId(log.id!)}
                        className="mt-2 text-xs uppercase tracking-widest text-text-dim hover:text-gold"
                      >
                        Spara som bevis?
                      </button>
                    )}
                    {evidenceForLogId === log.id && log.id && (
                      <SaveAsEvidencePrompt
                        userId={user.uid}
                        childAlias={activeChild}
                        childrenLogId={log.id}
                        observation={log.observation ?? log.truth ?? ''}
                        category={log.category ?? 'vardag'}
                        childrenImpact={log.childrenImpact}
                        onDone={() => setEvidenceForLogId(null)}
                      />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
