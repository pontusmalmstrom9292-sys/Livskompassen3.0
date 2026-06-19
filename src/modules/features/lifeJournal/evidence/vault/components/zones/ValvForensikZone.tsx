import { useState } from 'react';
import { TabBar } from '@/core/ui/TabBar';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { getForensicVaultTabBarItems } from '@/core/navigation/tabRegistry';
import { VaultForensicPanel } from '../VaultForensicPanel';
import type { ForensicVaultTab } from '../../utils/vaultTabs';

export type ValvForensikZoneProps = {
  tab: ForensicVaultTab;
  onTabChange: (tab: ForensicVaultTab) => void;
};

/** Progressive disclosure — visa aktiv flik + expandera till alla 6 vid behov. */
export function ValvForensikZone({ tab, onTabChange }: ValvForensikZoneProps) {
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
      <VaultForensicPanel tab={tab} />
    </HubErrorBoundary>
  );
}
