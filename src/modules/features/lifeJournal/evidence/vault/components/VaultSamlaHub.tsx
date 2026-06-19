import { memo, useCallback, useEffect, useState } from 'react';
import { Inbox } from 'lucide-react';
import './valv.css';
import { fetchInboxQueue } from '../../kompis/api/inboxService';
import { listDraftsByStatus } from '@/modules/capture/draftQueue';
import { useVaultStore } from '@/core/store/useVaultStore';
import { VaultEntryForm } from './VaultEntryForm';
import { VaultInkastCompact } from './VaultInkastCompact';
import { VaultSamlaDriveHint } from './VaultSamlaDriveHint';

type Props = {
  userId: string;
  onBevisConfirmed: (docId: string) => void;
  /** Canonical väg till granskningskö (ValvInputSuperModule). */
  onOpenGranska?: () => void;
};

export const VaultSamlaHub = memo(function VaultSamlaHub({
  userId,
  onBevisConfirmed,
  onOpenGranska,
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

      {onOpenGranska && pendingTotal > 0 ? (
        <button
          type="button"
          className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface-2/80 px-3 py-2 text-left text-xs text-text-muted transition-colors hover:border-accent/30 hover:bg-surface-3"
          onClick={openReview}
        >
          <span className="inline-flex items-center gap-2">
            <Inbox className="h-3.5 w-3.5 text-accent" aria-hidden />
            Väntar granskning
          </span>
          <span className="font-medium text-accent">{pendingTotal}</span>
        </button>
      ) : null}

      <VaultSamlaDriveHint pendingCount={pendingInbox ?? undefined} onOpenQueue={openReview} />

      <details className="rounded-xl border border-border bg-surface-2/60">
        <summary className="cursor-pointer px-3 py-2 text-xs font-medium uppercase tracking-wider text-text-muted">
          Manuell post
        </summary>
        <div id="vault-samla-entry" className="border-t border-border px-3 py-3">
          <p className="mb-3 text-xs text-text-dim">Append-only bevis — tvåspalt eller enkel text.</p>
          <VaultEntryForm userId={userId} saving={saving} onSave={(input) => saveLog(userId, input)} />
          {saveError ? <p className="mt-2 text-sm text-danger">{saveError}</p> : null}
        </div>
      </details>
    </div>
  );
});
