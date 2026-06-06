import { useState } from 'react';
import type { VaultLog } from '@/core/types/firestore';
import { ValvChatPanel } from '@/features/lifeJournal/evidence/vaultChat';
import { VaultLogList } from '../VaultLogList';
import { VaultSamlaHub } from '../VaultSamlaHub';
import { WeaverPendingVaultBanner } from '../WeaverPendingVaultBanner';
import type { VaultLogInput } from '../../types/vaultEntry';
import type { SamlaVaultTab } from '../../utils/vaultTabs';

export type ValvSamlaZoneProps = {
  tab: SamlaVaultTab;
  userId: string;
  gateOk: boolean;
  logs: (VaultLog & { id: string })[];
  logsLoading: boolean;
  saving: boolean;
  saveError: string | null;
  highlightLogId: string | null;
  onSave: (input: VaultLogInput) => Promise<void>;
  onBevisConfirmed: (docId: string) => void | Promise<void>;
  onCitationClick: (docId: string) => void;
  onLogsRefresh: () => void;
};

export function ValvSamlaZone({
  tab,
  userId,
  gateOk,
  logs,
  logsLoading,
  saving,
  saveError,
  highlightLogId,
  onSave,
  onBevisConfirmed,
  onCitationClick,
  onLogsRefresh,
}: ValvSamlaZoneProps) {
  const [anchorsOnly, setAnchorsOnly] = useState(false);

  if (tab === 'sok') {
    return (
      <ValvChatPanel
        active={gateOk}
        onCitationClick={onCitationClick}
        logs={logs}
      />
    );
  }

  return (
    <>
      <WeaverPendingVaultBanner userId={userId} onApproved={onLogsRefresh} />
      <VaultSamlaHub
        userId={userId}
        saving={saving}
        saveError={saveError}
        onSave={onSave}
        onBevisConfirmed={(docId) => void onBevisConfirmed(docId)}
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setAnchorsOnly((v) => !v)}
          className={`btn-pill--ghost text-xs ${anchorsOnly ? 'text-gold' : ''}`}
          aria-pressed={anchorsOnly}
        >
          {anchorsOnly ? 'Visa alla bevis' : 'Endast ankare'}
        </button>
      </div>
      <VaultLogList
        logs={logs}
        loading={logsLoading}
        highlightLogId={highlightLogId}
        anchorsOnly={anchorsOnly}
        onLogFirstBevis={() =>
          document.getElementById('vault-samla-entry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      />
    </>
  );
}
