import { Link } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { EmptyState } from '../../../core/ui/EmptyState';
import { TimelineEntry } from '../../../core/ui/TimelineEntry';
import { BarnfokusFraganPanel } from './BarnfokusFraganPanel';
import { ChildProfileCards } from './ChildProfileCards';
import { PositivaMinnesankare } from './PositivaMinnesankare';
import { ParentReminderFooter } from './ParentReminderFooter';
import type { ChildAlias } from '../constants';
import { BalansMatare } from './BalansMatare';
import { PhysiologicalControls } from './PhysiologicalControls';
import { ChildSubLogPanel } from './ChildSubLogPanel';
import { SaveAsEvidencePrompt } from './SaveAsEvidencePrompt';
import { ChildrenLogsChat } from './ChildrenLogsChat';
import { useFamiljenShell } from '../hooks/useFamiljenShell';
import {
  downloadBalansReportJson,
  exportBalansReport,
  printBalansReport,
} from '../utils/exportBalansReport';
import { coerceLogText, formatChildLogDate } from '../utils/logFieldUtils';
import { momentBody } from '../utils/childMomentHelpers';

type BarnensPageProps = {
  embedded?: boolean;
};

/** @deprecated embedded — använd `/familjen` med underflikar. Behålls för smoke + legacy embed. */
export function BarnensPage({ embedded: _embedded = false }: BarnensPageProps) {
  const shell = useFamiljenShell();

  if (!shell.user) {
    return <p className="text-sm text-text-muted">Logga in för att spara livsloggar.</p>;
  }

  const {
    activeChild,
    setActiveChild,
    balans,
    barnfokusMemory,
    logs,
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
    handleSaveBarnfokus,
  } = shell;

  return (
    <div className="space-y-4">
      <ChildProfileCards
        selected={activeChild as ChildAlias}
        onSelect={(alias) => setActiveChild(alias)}
      />

      <BarnfokusFraganPanel
        key={`barnfokus-${activeChild}`}
        childAlias={activeChild}
        memoryRows={barnfokusMemory}
        onSave={handleSaveBarnfokus}
      />

      <PositivaMinnesankare logs={logs} childAlias={activeChild as ChildAlias} />

      <BentoCard title={`${activeChild} — Balans`} icon={<Heart className="h-4 w-4" />}>
        <BalansMatare result={balans} />
        {balans.index < 45 && balans.daysWithData >= 2 && (
          <p className="mt-3 text-sm text-text-muted">
            Senaste dagarna ser tyngre ut i fysiologin. Det är en signal — inte en dom. Ett kort
            samtal eller vila kan räcka.
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadBalansReportJson(exportBalansReport(activeChild, logs))}
            className="text-xs uppercase tracking-widest text-text-dim hover:text-accent"
          >
            Exportera stabilitetsrapport (JSON)
          </button>
          <button
            type="button"
            onClick={() => printBalansReport(exportBalansReport(activeChild, logs))}
            className="text-xs uppercase tracking-widest text-text-dim hover:text-accent"
          >
            Skriv ut / PDF
          </button>
          <Link
            to={`/dossier?sources=children_logs&child=${encodeURIComponent(activeChild)}`}
            className="text-xs uppercase tracking-widest text-text-dim hover:text-accent"
          >
            Skapa dossier (samlad export)
          </Link>
        </div>
      </BentoCard>

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
          userId={shell.user.uid}
          onSave={handleSaveObservation}
        />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </BentoCard>

      <ChildrenLogsChat activeChild={activeChild} />

      <BentoCard title={`Tidslinje — ${activeChild}`}>
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
                  meta={`${log.action ?? 'livslogg'}${log.category ? ` · ${log.category}` : ''} · ${formatChildLogDate(log.createdAt, '—')}`}
                  body={
                    log.signals
                      ? `Sömn ${log.signals.somn} · Ångest ${log.signals.angest} · Aptit ${log.signals.aptit}`
                      : momentBody(log)
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
                    userId={shell.user.uid}
                    childAlias={activeChild}
                    childrenLogId={log.id}
                    observation={coerceLogText(log.observation) || coerceLogText(log.truth)}
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

      <ParentReminderFooter />
    </div>
  );
}
