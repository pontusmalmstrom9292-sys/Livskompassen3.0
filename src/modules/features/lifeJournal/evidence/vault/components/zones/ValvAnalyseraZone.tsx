import { TabBar } from '@/core/ui/TabBar';
import { getAnalyseraVaultTabBarItems } from '@/core/navigation/tabRegistry';
import { useVaultStore } from '@/core/store/useVaultStore';
import { PansaretHeader } from '../PansaretHeader';
import { VaultMonsterPanel } from '../VaultMonsterPanel';
import { VaultOrkesterPanel } from '../VaultOrkesterPanel';
import type { AnalyseraVaultTab } from '../../utils/vaultTabs';

export type ValvAnalyseraZoneProps = {
  tab: AnalyseraVaultTab;
  onTabChange: (tab: AnalyseraVaultTab) => void;
};

/** Locked UX — Mönster + Orkester (Pansaret). */
export function ValvAnalyseraZone({ tab, onTabChange }: ValvAnalyseraZoneProps) {
  const { logs } = useVaultStore();
  
  return (
    <>
      <div className="mb-3">
        <TabBar
          size="compact"
          tabs={getAnalyseraVaultTabBarItems()}
          active={tab}
          onChange={onTabChange}
        />
      </div>
      {tab === 'orkester' ? (
        <VaultOrkesterPanel logs={logs} />
      ) : (
        <>
          <PansaretHeader />
          <VaultMonsterPanel logs={logs} />
        </>
      )}
    </>
  );
}
