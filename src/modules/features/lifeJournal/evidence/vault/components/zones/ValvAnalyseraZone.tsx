import { lazy, Suspense } from 'react';
import { TabBar } from '@/core/ui/TabBar';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
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
  return <HubPanelSkeleton label="Laddar analys…" lines={5} />;
}

export type ValvAnalyseraZoneProps = {
  tab: AnalyseraVaultTab;
  onTabChange: (tab: AnalyseraVaultTab) => void;
  onTechniqueSelect?: (technique: string) => void;
};

/** Locked UX — Mönster + Orkester (Pansaret). */
export function ValvAnalyseraZone({ tab, onTabChange, onTechniqueSelect }: ValvAnalyseraZoneProps) {
  const { logs } = useVaultStore();
  const userId = useStore((s) => s.user?.uid);

  return (
    <HubErrorBoundary
      title="Analys kunde inte laddas"
      glow="blue"
      logTag="ValvAnalyseraZone"
    >
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
            <CalmCollapsible
              title="Vad betyder Pansaret?"
              meta="Kort förklaring"
              defaultOpen={false}
              glow="gold"
            >
              <PansaretHeader />
            </CalmCollapsible>
            <VaultMonsterPanel
              logs={logs}
              userId={userId}
              onTechniqueSelect={onTechniqueSelect}
            />
          </>
        )}
      </Suspense>
    </HubErrorBoundary>
  );
}
