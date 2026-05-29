import { Link } from 'react-router-dom';
import { Heart, Loader2 } from 'lucide-react';
import { BentoCard } from '../../../../core/ui/BentoCard';
import { CHILD_PROFILES } from '../../constants';
import type { FamiljenShell } from '../../hooks/useFamiljenShell';
import { BalansMatare } from '../BalansMatare';
import { PhysiologicalControls } from '../PhysiologicalControls';
import {
  downloadBalansReportJson,
  exportBalansReport,
  printBalansReport,
} from '../../utils/exportBalansReport';

type Props = {
  shell: FamiljenShell;
};

export function ChildMomentOmPanel({ shell }: Props) {
  const {
    activeChild,
    signals,
    setSignals,
    balans,
    logs,
    loading,
    error,
    handleSavePhysio,
  } = shell;

  const profile = CHILD_PROFILES.find((p) => p.alias === activeChild);

  return (
    <div className="space-y-4">
      {profile && (
        <div className="elongated-module border-white/10 p-4">
          <p className="font-display text-xl text-accent">{profile.alias}</p>
          <p className="mt-1 text-sm text-text-muted">{profile.focus}</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {profile.traits.map((trait) => (
              <li
                key={trait}
                className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs text-text-muted"
              >
                {trait}
              </li>
            ))}
          </ul>
        </div>
      )}

      <BentoCard title={`Mående — ${activeChild} (7 dagar)`} icon={<Heart className="h-4 w-4" />}>
        <BalansMatare result={balans} />
        {balans.index < 45 && balans.daysWithData >= 2 && (
          <p className="mt-3 text-sm text-text-muted">
            Fysiologin har varit tyngre några dagar. Det är en signal — inte en dom.
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadBalansReportJson(exportBalansReport(activeChild, logs))}
            className="text-xs uppercase tracking-widest text-text-dim hover:text-accent"
          >
            Exportera rapport (JSON)
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
            Dossier
          </Link>
        </div>
      </BentoCard>

      <BentoCard title="Dagens signaler" description="Sömn, ångest, aptit — ett spar per dag.">
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
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      </BentoCard>
    </div>
  );
}
