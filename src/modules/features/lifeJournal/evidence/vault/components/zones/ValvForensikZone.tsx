import { TabBar } from '@/core/ui/TabBar';
import { getForensicVaultTabBarItems } from '@/core/navigation/tabRegistry';
import { VaultForensicPanel } from '../VaultForensicPanel';
import type { ForensicVaultTab } from '../../utils/vaultTabs';

export type ValvForensikZoneProps = {
  tab: ForensicVaultTab;
  onTabChange: (tab: ForensicVaultTab) => void;
};

export function ValvForensikZone({ tab, onTabChange }: ValvForensikZoneProps) {
  return (
    <>
      <div className="mb-3">
        <TabBar
          size="compact"
          tabs={getForensicVaultTabBarItems()}
          active={tab}
          onChange={onTabChange}
        />
      </div>
      <VaultForensicPanel tab={tab} />
    </>
  );
}
