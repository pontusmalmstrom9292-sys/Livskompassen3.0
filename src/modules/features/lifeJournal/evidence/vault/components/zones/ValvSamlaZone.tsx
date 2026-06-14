import { useState } from 'react';
import { TabBar } from '@/core/ui/TabBar';
import { getSamlaVaultTabBarItems } from '@/core/navigation/tabRegistry';
import { useVaultStore } from '@/core/store/useVaultStore';
import { ValvChatPanel } from '@/features/lifeJournal/evidence/vaultChat';
import { VaultLogList } from '../VaultLogList';
import { VaultSamlaHub } from '../VaultSamlaHub';
import { WeaverPendingVaultBanner } from '../WeaverPendingVaultBanner';
import type { SamlaVaultTab } from '../../utils/vaultTabs';

export type ValvSamlaZoneProps = {
  tab: SamlaVaultTab;
  onTabChange: (tab: SamlaVaultTab) => void;
  userId: string;
  gateOk: boolean;
  highlightLogId: string | null;
  onBevisConfirmed: (docId: string) => void | Promise<void>;
  onCitationClick: (docId: string) => void;
  onOpenGranska?: () => void;
};

export function ValvSamlaZone({
  tab,
  onTabChange,
  userId,
  gateOk,
  highlightLogId,
  onBevisConfirmed,
  onCitationClick,
  onOpenGranska,
}: ValvSamlaZoneProps) {
  const [anchorsOnly, setAnchorsOnly] = useState(false);
  const { logs, loadFirstLogsPage } = useVaultStore();

  return (
    <>
      <div className="mb-3">
        <TabBar
          size="compact"
          tabs={getSamlaVaultTabBarItems()}
          active={tab}
          onChange={onTabChange}
        />
      </div>
      {tab === 'sok' ? (
        <ValvChatPanel
          active={gateOk}
          onCitationClick={onCitationClick}
          logs={logs}
        />
      ) : (
        <>
          <WeaverPendingVaultBanner userId={userId} onApproved={() => loadFirstLogsPage(userId)} />
          <VaultSamlaHub
            userId={userId}
            onBevisConfirmed={(docId) => void onBevisConfirmed(docId)}
            onOpenGranska={onOpenGranska}
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
            highlightLogId={highlightLogId}
            anchorsOnly={anchorsOnly}
            onLogFirstBevis={() =>
              document.getElementById('vault-samla-entry')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          />
        </>
      )}
    </>
  );
}
