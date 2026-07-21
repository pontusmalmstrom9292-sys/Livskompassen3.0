import { useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
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
import {
  epistemicKindLabel,
  parseEpistemicKindFromObservation,
} from '../../utils/childObservationEpistemics';
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

  if (!user) {
    return <EmptyState message="Logga in för att se stunderna för barnet." />;
  }

  return (
    <BentoCard glow="blue" title="Senaste stunder" description={activeChild} className="familjen-tab-surface !p-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrera stunder">
        {FILTER_CHIPS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`inline-flex min-h-11 items-center rounded-full border px-3 text-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 ${
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
        <ul className="mt-4 space-y-3">
          {stunder.map((log) => {
            const Icon = categoryIcon(log.category);
            const favorite = isFavoriteMoment(log);
            const epistemicKind = parseEpistemicKindFromObservation(
              String(log.observation ?? log.truth ?? ''),
            );
            return (
              <li
                key={log.id}
                className="rounded-xl border border-border/30 bg-surface-2/40 p-3"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-3/40 text-accent"
                    aria-hidden
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[10px] uppercase tracking-widest text-text-dim">
                        {categoryLabel(log.category)} · {formatChildLogDate(log.createdAt, '—')}
                        {epistemicKind ? (
                          <span className="ml-2 text-accent-secondary/90">
                            · {epistemicKindLabel(epistemicKind)}
                          </span>
                        ) : null}
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
                    {log.mediaUrl ? (
                      <figure className="mt-3 overflow-hidden rounded-xl border border-border/40">
                        <img
                          src={log.mediaUrl}
                          alt={log.mediaCaption || 'Foto från livslogg'}
                          className="max-h-48 w-full object-cover"
                        />
                        {log.mediaCaption ? (
                          <figcaption className="px-3 py-2 text-xs text-text-dim">
                            {log.mediaCaption}
                          </figcaption>
                        ) : null}
                      </figure>
                    ) : null}
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
    </BentoCard>
  );
}
