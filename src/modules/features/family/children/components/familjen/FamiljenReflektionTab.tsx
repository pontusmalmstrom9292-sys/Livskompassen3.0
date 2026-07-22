import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { KanslotempletParentCard } from './KanslotempletParentCard';
import { PositivaMinnesankare } from '../PositivaMinnesankare';
import { ChildProfileCards } from '../ChildProfileCards';
import { ChildIncidentPulse } from '../ChildIncidentPulse';
import { ParentMerPanel } from '../ParentMerPanel';
import type { ChildAlias } from '../../constants';
import { BalansMatare } from '../BalansMatare';
import { ChildrenLogsChat } from '../ChildrenLogsChat';
import {
  downloadBalansReportJson,
  exportBalansReport,
  printBalansReport,
} from '../../utils/exportBalansReport';
import type { FamiljenShell } from '../../hooks/useFamiljenShell';

type Props = {
  shell: FamiljenShell;
};

/** Reflektion per barn — read-only efter Superhub (Fas 7E). */
export function FamiljenReflektionTab({ shell }: Props) {
  const {
    activeChild,
    setActiveChild,
    balans,
    logs,
  } = shell;

  return (
    <div className="familjen-tab-surface space-y-4">
      <ChildProfileCards
        selected={activeChild}
        onSelect={setActiveChild}
      />

      <ChildIncidentPulse
        childAlias={activeChild}
        logs={logs}
        balansIndex={balans.index}
        balansDays={balans.daysWithData}
      />

      <ParentMerPanel childAlias={activeChild} logs={logs} />

      <KanslotempletParentCard
        key={`kanslo-${activeChild}`}
        activeChild={activeChild}
        userId={shell.user?.uid ?? ''}
      />

      <PositivaMinnesankare logs={logs} childAlias={activeChild as ChildAlias} />

      <BentoCard
        glow="blue"
        title={`${activeChild} — mående (7 dagar)`}
        icon={<Heart className="h-4 w-4" />}
      >
        <BalansMatare result={balans} />
        {balans.index < 45 && balans.daysWithData >= 2 && (
          <p className="mt-3 text-sm text-text-muted">
            Fysiologin har varit tyngre några dagar. Det är en signal — inte en dom. Ett kort samtal
            eller vila kan räcka.
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => downloadBalansReportJson(exportBalansReport(activeChild, logs))}
            className="inline-flex min-h-11 items-center text-xs uppercase tracking-widest text-text-muted hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
          >
            Exportera rapport (JSON)
          </button>
          <button
            type="button"
            onClick={() => printBalansReport(exportBalansReport(activeChild, logs))}
            className="inline-flex min-h-11 items-center text-xs uppercase tracking-widest text-text-muted hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
          >
            Skriv ut / PDF
          </button>
          <Link
            to={`/dossier?sources=children_logs&child=${encodeURIComponent(activeChild)}`}
            className="inline-flex min-h-11 items-center text-xs uppercase tracking-widest text-text-muted hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
          >
            Dossier
          </Link>
        </div>
      </BentoCard>

      <ChildrenLogsChat activeChild={activeChild} />
    </div>
  );
}
