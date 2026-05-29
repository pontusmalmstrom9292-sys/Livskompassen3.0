import { useMemo, useState } from 'react';
import { Heart, Loader2, Plus } from 'lucide-react';
import { BentoCard } from '../../../../core/ui/BentoCard';
import { EmptyState } from '../../../../core/ui/EmptyState';
import { ChildSubLogPanel } from '../ChildSubLogPanel';
import { SaveAsEvidencePrompt } from '../SaveAsEvidencePrompt';
import type { FamiljenShell } from '../../hooks/useFamiljenShell';
import {
  categoryIcon,
  categoryLabel,
  filterStunderLogs,
  isFavoriteMoment,
  momentBody,
} from '../../utils/childMomentHelpers';

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

export function ChildMomentStunderPanel({ shell }: Props) {
  const {
    user,
    activeChild,
    logs,
    loading,
    error,
    evidenceForLogId,
    setEvidenceForLogId,
    handleSaveObservation,
  } = shell;

  const [filter, setFilter] = useState<StunderFilter>('all');
  const [showNew, setShowNew] = useState(false);

  const stunder = useMemo(
    () => filterStunderLogs(logs, activeChild, filter),
    [logs, activeChild, filter],
  );

  if (!user) return null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs uppercase tracking-widest text-text-dim">Senaste stunder</p>
        <button
          type="button"
          onClick={() => setShowNew((v) => !v)}
          className="inline-flex items-center gap-1 rounded-full border border-accent/30 px-3 py-1 text-xs text-accent hover:bg-accent/10"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Ny stund
        </button>
      </div>

      {showNew && (
        <BentoCard title="Ny stund" description={`Vad vill du minnas om ${activeChild}?`}>
          <ChildSubLogPanel
            key={`stund-${activeChild}`}
            childAlias={activeChild}
            userId={user.uid}
            onSave={async (data) => {
              const id = await handleSaveObservation(data);
              setShowNew(false);
              return id;
            }}
          />
        </BentoCard>
      )}

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
                        {categoryLabel(log.category)} · {(log.createdAt ?? '').slice(0, 10)}
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

      {loading && (
        <p className="flex items-center gap-2 text-xs text-text-dim">
          <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
          Sparar…
        </p>
      )}
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
