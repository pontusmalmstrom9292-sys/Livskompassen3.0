import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { speglarTabHref } from '../../core/navigation/appNavigation';
import type { JournalBridgeContext } from '../../core/types/journalBridge';
import { DAGBOK_MABRA_RETURN_URL, MABRA_BRIDGE_LABELS } from '../constants/mabraBridge';

type SavedStepProps = {
  onNewEntry: () => void;
  journalContext: JournalBridgeContext;
  showMabraReturn?: boolean;
};

export function SavedStep({ onNewEntry, journalContext, showMabraReturn = false }: SavedStepProps) {
  return (
    <>
      <div className="mb-2 flex items-center gap-2 text-success">
        <Check className="h-5 w-5" />
        <span className="text-sm">Sparad. Vävaren taggar i bakgrunden.</span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onNewEntry} className="btn-pill--accent">
          Ny post
        </button>
        <Link
          to={speglarTabHref()}
          state={{ journalContext }}
          className="btn-pill border-accent-secondary/40 text-accent-secondary hover:bg-accent-secondary/10"
        >
          Känns det som gaslighting? → Gå till Speglar
        </Link>
        {showMabraReturn && (
          <Link to={DAGBOK_MABRA_RETURN_URL} className="btn-pill--ghost text-sm">
            {MABRA_BRIDGE_LABELS.returnToMabra}
          </Link>
        )}
      </div>
    </>
  );
}
