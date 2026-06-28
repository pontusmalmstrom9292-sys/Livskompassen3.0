import { useEffect, useState } from 'react';
import { Button } from '@/design-system';
import { TabBar } from '@/core/ui/TabBar';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { getSamlaVaultTabBarItems } from '@/core/navigation/tabRegistry';
import { useVaultStore } from '@/core/store/useVaultStore';
import { ValvChatPanel } from '@/features/lifeJournal/evidence/vaultChat';
import { VaultLogList } from '../VaultLogList';
import { VaultSamlaHub } from '../VaultSamlaHub';
import { WeaverPendingVaultBanner } from '../WeaverPendingVaultBanner';
import { usePatternScanMetadata } from '../../hooks/usePatternScanMetadata';
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
  techniqueFilter?: string | null;
  onClearTechniqueFilter?: () => void;
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
  techniqueFilter = null,
  onClearTechniqueFilter,
}: ValvSamlaZoneProps) {
  const [anchorsOnly, setAnchorsOnly] = useState(false);
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const { logs, loadFirstLogsPage } = useVaultStore();
  const { techniquesByLogId } = usePatternScanMetadata(userId);

  useEffect(() => {
    if (techniqueFilter) setAnchorsOnly(false);
  }, [techniqueFilter]);

  return (
    <HubErrorBoundary
      title="Samla kunde inte laddas"
      glow="blue"
      logTag="ValvSamlaZone"
    >
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
            manualEntryOpen={manualEntryOpen}
            onManualEntryOpenChange={setManualEntryOpen}
          />
          <div className="valv-samla-filter-row flex flex-wrap items-center justify-between gap-2 px-0.5">
            <p className="text-xs font-medium uppercase tracking-wider text-text-dim">Arkivlista</p>
            <div className="flex flex-wrap items-center gap-2">
              {techniqueFilter ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="valv-technique-filter-chip text-accent"
                  aria-pressed
                  onClick={onClearTechniqueFilter}
                >
                  Filter: #{techniqueFilter} · Rensa
                </Button>
              ) : null}
              <Button
                variant="ghost"
                size="sm"
                className={anchorsOnly ? 'text-accent' : undefined}
                aria-pressed={anchorsOnly}
                onClick={() => setAnchorsOnly((v) => !v)}
              >
                {anchorsOnly ? 'Visa alla bevis' : 'Endast ankare'}
              </Button>
            </div>
          </div>
          <VaultLogList
            highlightLogId={highlightLogId}
            anchorsOnly={anchorsOnly}
            techniqueFilter={techniqueFilter}
            persistedTechniquesByLogId={techniquesByLogId}
            onLogFirstBevis={() => {
              setManualEntryOpen(true);
              requestAnimationFrame(() => {
                document.getElementById('vault-samla-entry')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              });
            }}
          />
        </>
      )}
    </HubErrorBoundary>
  );
}
