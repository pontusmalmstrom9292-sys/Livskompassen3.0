import { useState } from 'react';
import { TabBar } from '@/core/ui/TabBar';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { getForensicVaultTabBarItems } from '@/core/navigation/tabRegistry';
import { VaultForensicPanel } from '../VaultForensicPanel';
import { VaultDcapAlertsPanel } from '../VaultDcapAlertsPanel';
import type { ForensicVaultTab } from '../../utils/vaultTabs';

export type ValvForensikZoneProps = {
  tab: ForensicVaultTab;
  onTabChange: (tab: ForensicVaultTab) => void;
  gateOk: boolean;
};

/** Progressive disclosure — visa aktiv flik + expandera till alla 6 vid behov. */
export function ValvForensikZone({ tab, onTabChange, gateOk }: ValvForensikZoneProps) {
  const [showAllTabs, setShowAllTabs] = useState(false);
  const allTabs = getForensicVaultTabBarItems();
  const visibleTabs = showAllTabs ? allTabs : allTabs.filter((t) => t.id === tab);

  return (
    <HubErrorBoundary
      title="Forensik kunde inte laddas"
      glow="blue"
      logTag="ValvForensikZone"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <TabBar
          size="compact"
          tabs={visibleTabs}
          active={tab}
          onChange={onTabChange}
        />
        {!showAllTabs ? (
          <button
            type="button"
            className="btn-pill--ghost text-xs"
            onClick={() => setShowAllTabs(true)}
          >
            Visa fler
          </button>
        ) : (
          <button
            type="button"
            className="btn-pill--ghost text-xs"
            onClick={() => setShowAllTabs(false)}
          >
            Färre flikar
          </button>
        )}
      </div>
      <section
        className="mb-4 rounded-xl border border-[0.5px] border-border/30 bg-surface-2/50 p-4"
        aria-label="DCAP säkerhetsgranskning"
      >
        <p className="mb-2 font-display-serif text-xs uppercase tracking-[0.2em] text-accent-dim">
          Säkerhetsgranskning
        </p>
        <p className="mb-3 text-xs text-text-muted">
          Väntande DCAP-eskaleringar — granska manuellt innan åtgärd. Hash-only logg.
        </p>
        <VaultDcapAlertsPanel gateOk={gateOk} />
      </section>
      <VaultForensicPanel tab={tab} />
    </HubErrorBoundary>
  );
}
