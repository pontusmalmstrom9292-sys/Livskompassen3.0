import { useState } from 'react';
import { Button } from '@/design-system';
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
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowAllTabs(true)} className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
            Visa fler
          </Button>
        ) : (
          <Button type="button" variant="ghost" size="sm" onClick={() => setShowAllTabs(false)} className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40">
            Färre flikar
          </Button>
        )}
      </div>
      <section className="valv-zone-stack mb-4" aria-label="DCAP säkerhetsgranskning">
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
