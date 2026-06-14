import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { CHILD_PROFILES } from '../../constants';
import type { FamiljenShell } from '../../hooks/useFamiljenShell';
import { BalansMatare } from '../BalansMatare';
import {
  downloadBalansReportJson,
  exportBalansReport,
  printBalansReport,
} from '../../utils/exportBalansReport';

type Props = {
  shell: FamiljenShell;
};

/** Read-only profil + balans — fysio-inmatning sker via FamiljenInputSuperModule (Fas 7E). */
export function ChildMomentOmPanel({ shell }: Props) {
  const {
    activeChild,
    balans,
    logs,
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
    </div>
  );
}
