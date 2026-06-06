import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { hjartatTabHref } from '@/core/navigation/appNavigation';
import { VAVAREN_SAVED_HINT } from '@/features/lifeJournal/evidence/vault/constants/vavarenCopy';
import type { JournalBridgeContext } from '@/core/types/journalBridge';
import { WeaverApprovalPanel } from './WeaverApprovalPanel';

type SavedStepProps = {
  onNewEntry: () => void;
  journalContext: JournalBridgeContext;
  userId?: string;
  journalEntryId?: string | null;
  showWeaverApproval?: boolean;
};

export function SavedStep({
  onNewEntry,
  journalContext,
  userId,
  journalEntryId,
  showWeaverApproval = false,
}: SavedStepProps) {
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
        <button type="button" onClick={onNewEntry} className="btn-pill--accent">
          Ny post
        </button>
        <Link
          to={hjartatTabHref('speglar')}
          state={{ journalContext }}
          className="btn-pill border-accent-secondary/40 text-accent-secondary hover:bg-accent-secondary/10"
        >
          Känns det som gaslighting? → Gå till Speglar
        </Link>
      </div>
    </>
  );
}
