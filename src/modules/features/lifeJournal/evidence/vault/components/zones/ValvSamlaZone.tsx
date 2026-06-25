import { useEffect, useState } from 'react';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
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

const SAMLA_SECTION_LABELS = Object.fromEntries(
  getSamlaVaultTabBarItems().map((item) => [item.id, item.label]),
) as Record<SamlaVaultTab, string>;

/** En modul: inkast, granska, sök och arkivlista — utan separat TabBar. */
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
  const [searchOpen, setSearchOpen] = useState(tab === 'sok');
  const { logs, loadFirstLogsPage } = useVaultStore();
  const { techniquesByLogId } = usePatternScanMetadata(userId);

  useEffect(() => {
    if (techniqueFilter) setAnchorsOnly(false);
  }, [techniqueFilter]);

  useEffect(() => {
    if (tab === 'sok') setSearchOpen(true);
  }, [tab]);

  const handleSearchOpenChange = (open: boolean) => {
    setSearchOpen(open);
    onTabChange(open ? 'sok' : 'logga');
  };

  return (
    <HubErrorBoundary
      title="Samla kunde inte laddas"
      glow="blue"
      logTag="ValvSamlaZone"
    >
      <WeaverPendingVaultBanner userId={userId} onApproved={() => loadFirstLogsPage(userId)} />
      <VaultSamlaHub
        userId={userId}
        onBevisConfirmed={(docId) => void onBevisConfirmed(docId)}
        onOpenGranska={onOpenGranska}
        manualEntryOpen={manualEntryOpen}
        onManualEntryOpenChange={setManualEntryOpen}
      />

      <CalmCollapsible
        title={SAMLA_SECTION_LABELS.sok}
        meta="Fråga i arkivet"
        open={searchOpen}
        onOpenChange={handleSearchOpenChange}
        glow="blue"
      >
        <ValvChatPanel
          active={gateOk}
          onCitationClick={onCitationClick}
          logs={logs}
        />
      </CalmCollapsible>

      <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
        <p className="text-xs font-medium uppercase tracking-wider text-text-dim">Arkivlista</p>
        <div className="flex flex-wrap items-center gap-2">
          {techniqueFilter ? (
            <button
              type="button"
              onClick={onClearTechniqueFilter}
              className="valv-technique-filter-chip btn-pill--ghost text-xs text-accent"
              aria-pressed
            >
              Filter: #{techniqueFilter} · Rensa
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setAnchorsOnly((v) => !v)}
            className={`btn-pill--ghost text-xs ${anchorsOnly ? 'text-accent' : ''}`}
            aria-pressed={anchorsOnly}
          >
            {anchorsOnly ? 'Visa alla bevis' : 'Endast ankare'}
          </button>
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
    </HubErrorBoundary>
  );
}
