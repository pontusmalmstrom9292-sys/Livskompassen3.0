import { lazy, Suspense } from 'react';
import { TabBar } from '@/core/ui/TabBar';
import { getAnalyseraVaultTabBarItems } from '@/core/navigation/tabRegistry';
import { useVaultStore } from '@/core/store/useVaultStore';
import { useStore } from '@/core/store';
import { PansaretHeader } from '../PansaretHeader';
import type { AnalyseraVaultTab } from '../../utils/vaultTabs';

const VaultMonsterPanel = lazy(() =>
  import('../VaultMonsterPanel').then((m) => ({ default: m.VaultMonsterPanel })),
);
const VaultOrkesterPanel = lazy(() =>
  import('../VaultOrkesterPanel').then((m) => ({ default: m.VaultOrkesterPanel })),
);

function ValvPanelFallback() {
  return <p className="py-6 text-center text-xs text-text-dim">Laddar analys…</p>;
}

export type ValvAnalyseraZoneProps = {
  tab: AnalyseraVaultTab;
  onTabChange: (tab: AnalyseraVaultTab) => void;
};

/** Locked UX — Mönster + Orkester (Pansaret). */
export function ValvAnalyseraZone({ tab, onTabChange }: ValvAnalyseraZoneProps) {
  const { logs } = useVaultStore();
  const userId = useStore((s) => s.user?.uid);

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
      <Suspense fallback={<ValvPanelFallback />}>
        {tab === 'orkester' ? (
          <VaultOrkesterPanel logs={logs} />
        ) : (
          <>
            <PansaretHeader />
            <VaultMonsterPanel logs={logs} userId={userId} />
          </>
        )}
      </Suspense>
    </>
  );
}
