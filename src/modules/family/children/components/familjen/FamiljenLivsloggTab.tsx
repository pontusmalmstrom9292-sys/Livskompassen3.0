import { Link } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import { BentoCard } from '../../../../core/ui/BentoCard';
import { EmptyState } from '../../../../core/ui/EmptyState';
import { TimelineEntry } from '../../../../core/ui/TimelineEntry';
import { ChildSubLogPanel } from '../ChildSubLogPanel';
import { PhysiologicalControls } from '../PhysiologicalControls';
import { SaveAsEvidencePrompt } from '../SaveAsEvidencePrompt';
import type { FamiljenShell } from '../../hooks/useFamiljenShell';

type Props = {
  shell: FamiljenShell;
};

export function FamiljenLivsloggTab({ shell }: Props) {
  const {
    user,
    activeChild,
    signals,
    setSignals,
    loading,
    error,
    logFilter,
    setLogFilter,
    childLogs,
    evidenceForLogId,
    setEvidenceForLogId,
    handleSavePhysio,
    handleSaveObservation,
  } = shell;

  if (!user) return null;

  return (
    <div className="space-y-4">
      <BentoCard title={`Dagens signaler — ${activeChild}`}>
        <PhysiologicalControls signals={signals} onChange={setSignals} />
        <button
          type="button"
          onClick={() => void handleSavePhysio()}
          disabled={loading}
          className="btn-pill--accent mt-4 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Spara dagens signaler
        </button>
        <ChildSubLogPanel
          key={activeChild}
          childAlias={activeChild}
          userId={user.uid}
          onSave={handleSaveObservation}
        />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </BentoCard>

      <BentoCard title={`Tidslinje — ${activeChild}`} icon={<Heart className="h-4 w-4" />}>
        <div className="mb-3 flex flex-wrap gap-2">
          {(
            [
              { id: 'all' as const, label: 'Alla' },
              { id: 'livslogg' as const, label: 'Livslogg' },
              { id: 'skola' as const, label: 'Skola / tredjepart' },
            ] as const
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setLogFilter(f.id)}
              className={`rounded-full border px-3 py-1 text-xs ${
                logFilter === f.id ? 'chip--active' : 'chip--idle'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        {childLogs.length === 0 ? (
          <EmptyState message="Inga loggar i detta filter." />
        ) : (
          <ul className="space-y-3">
            {childLogs.map((log) => (
              <li key={log.id}>
                <TimelineEntry
                  as="div"
                  meta={`${log.action ?? 'livslogg'}${log.category ? ` · ${log.category}` : ''} · ${(log.createdAt ?? '').slice(0, 10)}`}
                  body={
                    log.signals
                      ? `Sömn ${log.signals.somn} · Ångest ${log.signals.angest} · Aptit ${log.signals.aptit}`
                      : (log.observation ?? log.truth ?? '')
                  }
                  truncateAt={0}
                />
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
              </li>
            ))}
          </ul>
        )}
      </BentoCard>

      <p className="text-center text-xs text-text-dim">
        <Link to="/dagbok?tab=bevis" className="hover:text-accent">
          Öppna Valv för WORM-bevis och Valv-Chat →
        </Link>
      </p>
    </div>
  );
}
