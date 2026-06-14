import { memo, useCallback, useEffect, useState } from 'react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { fetchInboxQueue } from '../../kompis/api/inboxService';
import { useVaultStore } from '@/core/store/useVaultStore';
import { VaultEntryForm } from './VaultEntryForm';
import { VaultInkastCompact } from './VaultInkastCompact';
import { VaultSamlaDriveHint } from './VaultSamlaDriveHint';
import { VaultOverviewPanel } from './VaultOverviewPanel';

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
  }, [refreshPendingCount]);

  const handleBevisConfirmed = (docId: string) => {
    onBevisConfirmed(docId);
    void refreshPendingCount();
  };

  const openReview = () => {
    onOpenGranska?.();
  };

  return (
    <div className="space-y-4">
      <VaultOverviewPanel pendingInbox={pendingInbox} onOpenReview={openReview} />
      <VaultInkastCompact
        onQueued={openReview}
        onPersistedBevis={handleBevisConfirmed}
      />
      <VaultSamlaDriveHint pendingCount={pendingInbox ?? undefined} onOpenQueue={openReview} />
      <div id="vault-samla-entry">
        <BentoCard title="Ny post" description="Append-only bevis" glow="gold">
          <VaultEntryForm userId={userId} saving={saving} onSave={(input) => saveLog(userId, input)} />
          {saveError && <p className="mt-2 text-sm text-danger">{saveError}</p>}
        </BentoCard>
      </div>
      {onOpenGranska ? (
        <div className="flex justify-end">
          <button type="button" className="btn-pill--ghost text-xs" onClick={openReview}>
            Granskningskö
            {pendingInbox != null && pendingInbox > 0 ? ` (${pendingInbox})` : ''}
          </button>
        </div>
      ) : null}
    </div>
  );
});
