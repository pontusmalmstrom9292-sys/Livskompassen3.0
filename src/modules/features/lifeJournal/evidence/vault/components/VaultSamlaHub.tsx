import { memo, useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import './valv.css';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { fetchInboxQueue } from '../../kompis/api/inboxService';
import { listDraftsByStatus } from '@/modules/capture/draftQueue';
import { useVaultStore } from '@/core/store/useVaultStore';
import { VaultEntryForm } from './VaultEntryForm';
import { VaultInkastCompact } from './VaultInkastCompact';
import { VaultSamlaDriveHint } from './VaultSamlaDriveHint';
import { InboxReviewQueue } from '@/modules/inkast/components/InboxReviewQueue';

type Props = {
  userId: string;
  onBevisConfirmed: (docId: string) => void;
  /** Canonical väg till granskningskö (ValvInputSuperModule). */
  onOpenGranska?: () => void;
  manualEntryOpen?: boolean;
  onManualEntryOpenChange?: (open: boolean) => void;
};

/** A2.1 — primär: Inkast + granska. Sekundär: manuell post + Drive (CalmCollapsible). */
export const VaultSamlaHub = memo(function VaultSamlaHub({
  userId,
  onBevisConfirmed,
  onOpenGranska,
  manualEntryOpen,
  onManualEntryOpenChange,
}: Props) {
  const [pendingInbox, setPendingInbox] = useState<number | null>(null);
  const [localPending, setLocalPending] = useState(0);
  const { saving, error: saveError, saveLog } = useVaultStore();

  const refreshPendingCount = useCallback(async () => {
    try {
      const items = await fetchInboxQueue();
      setPendingInbox(items.length);
    } catch {
      setPendingInbox(null);
    }
  }, []);

  useEffect(() => {
    void refreshPendingCount();
    void (async () => {
      try {
        const [pending, review, failed] = await Promise.all([
          listDraftsByStatus('pending'),
          listDraftsByStatus('review'),
          listDraftsByStatus('failed'),
        ]);
        setLocalPending(pending.length + review.length + failed.length);
      } catch {
        setLocalPending(0);
      }
    })();
  }, [refreshPendingCount]);

  const handleBevisConfirmed = (docId: string) => {
    onBevisConfirmed(docId);
    void refreshPendingCount();
  };

  const openReview = () => {
    onOpenGranska?.();
  };

  const pendingTotal = (pendingInbox ?? 0) + localPending;

  return (
    <div className="valv-samla-panel space-y-4">
      <VaultInkastCompact
        onQueued={openReview}
        onPersistedBevis={handleBevisConfirmed}
      />

      {onOpenGranska && pendingInbox === null ? (
        <p className="flex items-center gap-2 text-xs text-text-dim">
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
          Räknar väntande poster…
        </p>
      ) : null}

      {pendingTotal > 0 ? (
        <InboxReviewQueue
          compact={false}
          prioritizeBevis
          onBevisConfirmed={handleBevisConfirmed}
        />
      ) : null}

      <CalmCollapsible
        title="Manuell post"
        meta="Append-only"
        defaultOpen={false}
        open={manualEntryOpen}
        onOpenChange={onManualEntryOpenChange}
        glow="blue"
      >
        <div id="vault-samla-entry" className="space-y-3">
          <p className="text-xs text-text-dim">Tvåspalt eller enkel text — sparas oföränderligt i arkivet.</p>
          <VaultEntryForm userId={userId} saving={saving} onSave={(input) => saveLog(userId, input)} />
          {saveError ? <p className="text-sm text-danger">{saveError}</p> : null}
        </div>
      </CalmCollapsible>

      <CalmCollapsible
        title="Drive & oklara filer"
        meta={pendingInbox != null && pendingInbox > 0 ? `${pendingInbox} i kö` : 'Manuellt godkännande'}
        defaultOpen={false}
        glow="blue"
      >
        <VaultSamlaDriveHint
          embedded
          pendingCount={pendingInbox ?? undefined}
          onOpenQueue={openReview}
        />
      </CalmCollapsible>
    </div>
  );
});
