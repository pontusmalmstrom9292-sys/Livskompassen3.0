import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { BarnfokusReglerCard } from './BarnfokusReglerCard';
import { KanslotempletParentCard } from './KanslotempletParentCard';
import { PositivaMinnesankare } from '../PositivaMinnesankare';
import { ChildProfileCards } from '../ChildProfileCards';
import type { ChildAlias } from '../../constants';
import { BalansMatare } from '../BalansMatare';
import { ChildrenLogsChat } from '../ChildrenLogsChat';
import { FamiljenInputSuperModule } from '../../supermodule';
import {
  downloadBalansReportJson,
  exportBalansReport,
  printBalansReport,
} from '../../utils/exportBalansReport';
import type { FamiljenShell } from '../../hooks/useFamiljenShell';

type Props = {
  shell: FamiljenShell;
};

/** Reflektion per barn — barnfokus, balans, frågor mot livslogg-silon. */
export function FamiljenReflektionTab({ shell }: Props) {
  const {
    activeChild,
    setActiveChild,
    balans,
    logs,
    handleSaveObservation,
  } = shell;

  return (
    <div className="space-y-4">
      <ChildProfileCards
        selected={activeChild}
        onSelect={setActiveChild}
      />

      <div className="familjen-barnfokus-wrap">
        <FamiljenInputSuperModule shell={shell} />
      </div>

      <BarnfokusReglerCard
        key={`regler-${activeChild}`}
        childAlias={activeChild}
        onSaveLog={handleSaveObservation}
      />

      <KanslotempletParentCard
        key={`kanslo-${activeChild}`}
        activeChild={activeChild}
        userId={shell.user?.uid ?? ''}
      />

      <PositivaMinnesankare logs={logs} childAlias={activeChild as ChildAlias} />

      <BentoCard title={`${activeChild} — mående (7 dagar)`} icon={<Heart className="h-4 w-4" />}>
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

      <ChildrenLogsChat activeChild={activeChild} />
    </div>
  );
}
