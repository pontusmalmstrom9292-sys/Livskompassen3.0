import { memo, useCallback, useEffect, useState, startTransition } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BentoCard } from '@/shared/ui/BentoCard';
import { InboxReviewQueue } from '@/modules/inkast/components/InboxReviewQueue';
import { fetchInboxQueue } from '../../kompis/api/inboxService';
import { VaultEntryForm } from './VaultEntryForm';
import { VaultInkastCompact } from './VaultInkastCompact';
import { VaultSamlaDriveHint } from './VaultSamlaDriveHint';
import { VaultOverviewPanel } from './VaultOverviewPanel';
import type { VaultLogInput } from '../types/vaultEntry';

export type SamlaView = 'logga' | 'granska';

function parseSamlaView(raw: string | null): SamlaView {
  return raw === 'granska' ? 'granska' : 'logga';
}

type Props = {
  userId: string;
  saving: boolean;
  saveError: string | null;
  onSave: (input: VaultLogInput) => Promise<void>;
  onBevisConfirmed: (docId: string) => void;
};

export const VaultSamlaHub = memo(function VaultSamlaHub({ userId, saving, saveError, onSave, onBevisConfirmed }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [pendingInbox, setPendingInbox] = useState<number | null>(null);
  const samlaView = parseSamlaView(searchParams.get('samlaView'));

  const setSamlaView = useCallback(
    (view: SamlaView) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          params.set('tab', 'bevis');
          params.set('vaultTab', 'logga');
          if (view === 'granska') params.set('samlaView', 'granska');
          else params.delete('samlaView');
          return params;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const refreshPendingCount = useCallback(async () => {
    try {
      const items = await fetchInboxQueue();
      setPendingInbox(items.length);
    } catch {
      setPendingInbox(null);
    }
  }, []);

  useEffect(() => {
    if (samlaView !== 'granska') {
      void refreshPendingCount();
    }
  }, [refreshPendingCount, samlaView]);

  const handleBevisConfirmed = (docId: string) => {
    onBevisConfirmed(docId);
    startTransition(() => {
      setSamlaView('logga');
    });
    void refreshPendingCount();
  };

  if (samlaView === 'granska') {
    return (
      <div className="space-y-4">
        <InboxReviewQueue
          prioritizeBevis
          onBevisConfirmed={handleBevisConfirmed}
          onBack={() => setSamlaView('logga')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <VaultOverviewPanel
        pendingInbox={pendingInbox}
        onOpenReview={() => setSamlaView('granska')}
      />
      <VaultInkastCompact
        onQueued={() => setSamlaView('granska')}
        onPersistedBevis={handleBevisConfirmed}
      />
      <VaultSamlaDriveHint
        pendingCount={pendingInbox ?? undefined}
        onOpenQueue={() => setSamlaView('granska')}
      />
      <div id="vault-samla-entry">
        <BentoCard title="Ny post" description="Append-only bevis" glow="gold">
          <VaultEntryForm userId={userId} saving={saving} onSave={onSave} />
          {saveError && <p className="mt-2 text-sm text-danger">{saveError}</p>}
        </BentoCard>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          className="btn-pill--ghost text-xs"
          onClick={() => setSamlaView('granska')}
        >
          Granskningskö
          {pendingInbox != null && pendingInbox > 0 ? ` (${pendingInbox})` : ''}
        </button>
      </div>
    </div>
  );
});
