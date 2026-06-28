import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hjartatTabHref } from '@/core/navigation/appNavigation';
import { VAVAREN_SAVED_HINT } from '@/features/lifeJournal/evidence/vault/constants/vavarenCopy';
import type { JournalBridgeContext } from '@/core/types/journalBridge';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { WeaverApprovalPanel } from './WeaverApprovalPanel';
import { DAGBOK_TYST_DONE_LABEL } from '@/features/lifeJournal/diary/supermodule/dagbokTystCopy';

type SavedStepProps = {
  onNewEntry: () => void;
  journalContext: JournalBridgeContext;
  userId?: string;
  journalEntryId?: string | null;
  showWeaverApproval?: boolean;
  /** Fas 23E — primär «Klart», valfria steg i fold. */
  minimalDone?: boolean;
};

export function SavedStep({
  onNewEntry,
  journalContext,
  userId,
  journalEntryId,
  showWeaverApproval = false,
  minimalDone = false,
}: SavedStepProps) {
  if (minimalDone) {
    return (
      <>
        <div className="mb-3 flex items-center gap-2 text-success">
          <Check className="h-5 w-5" />
          <span className="text-sm">{DAGBOK_TYST_DONE_LABEL}</span>
        </div>
        <button type="button" onClick={onNewEntry} className="ds-btn ds-btn--accent w-full sm:w-auto">
          Klart
        </button>
        <CalmCollapsible title="Om du vill …" meta="Valfritt" defaultOpen={false} glow="gold">
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onNewEntry} className="ds-btn ds-btn--ghost text-sm">
              Ny post
            </button>
            <Link
              to={hjartatTabHref('speglar')}
              state={{ journalContext }}
              className="ds-btn ds-btn--ghost text-sm"
            >
              Känslospegeln
            </Link>
          </div>
        </CalmCollapsible>
      </>
    );
  }

  return (
    <>
      <div className="mb-2 flex items-center gap-2 text-success">
        <Check className="h-5 w-5" />
        <span className="text-sm">{VAVAREN_SAVED_HINT}</span>
      </div>
      {showWeaverApproval && userId && journalEntryId ? (
        <WeaverApprovalPanel
          userId={userId}
          journalEntryId={journalEntryId}
          enabled={showWeaverApproval}
        />
      ) : null}
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={onNewEntry} className="ds-btn ds-btn--accent">
          Ny post
        </button>
        <Link
          to={hjartatTabHref('speglar')}
          state={{ journalContext }}
          className="ds-btn ds-btn--ghost border-accent-secondary/40 text-accent-secondary hover:bg-accent-secondary/10"
        >
          Känns det som gaslighting? → Gå till Speglar
        </Link>
      </div>
    </>
  );
}
