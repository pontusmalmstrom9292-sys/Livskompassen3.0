import { Suspense, lazy } from 'react';
import { TabBar } from '@/core/ui/TabBar';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { getKunskapVaultTabBarItems } from '@/core/navigation/tabRegistry';
import {
  AKTORSKARTA_VAULT_TAB,
  DOCS_VAULT_TAB,
  KUNSKAP_VAULT_TAB,
  type KunskapVaultTab,
} from '../../utils/vaultTabs';

const VaultAktorskartaPanel = lazy(() =>
  import('../../../knowledge/components/VaultAktorskartaPanel').then((m) => ({
    default: m.VaultAktorskartaPanel,
  })),
);
const VaultKanonDocsPanel = lazy(() =>
  import('../../../knowledge/components/VaultKanonDocsPanel').then((m) => ({
    default: m.VaultKanonDocsPanel,
  })),
);
const VaultKunskapsbankPanel = lazy(() =>
  import('../../../knowledge/components/VaultKunskapsbankPanel').then((m) => ({
    default: m.VaultKunskapsbankPanel,
  })),
);

export type ValvKunskapZoneProps = {
  tab: KunskapVaultTab;
  onTabChange: (tab: KunskapVaultTab) => void;
};

/** Locked UX — Kunskapsbank + Aktörskarta (G9) + Kanon docs (A2.7). */
export function ValvKunskapZone({ tab, onTabChange }: ValvKunskapZoneProps) {
  return (
    <HubErrorBoundary
      title="Kunskap kunde inte laddas"
      glow="blue"
      logTag="ValvKunskapZone"
    >
      <div className="valv-zone-stack mb-3 space-y-3">
        <TabBar
          size="compact"
          tabs={getKunskapVaultTabBarItems()}
          active={tab}
          onChange={onTabChange}
        />
        <Suspense fallback={<HubPanelSkeleton label="Laddar kunskap…" lines={4} />}>
          {tab === AKTORSKARTA_VAULT_TAB ? (
            <VaultAktorskartaPanel />
          ) : tab === DOCS_VAULT_TAB ? (
            <VaultKanonDocsPanel />
          ) : tab === KUNSKAP_VAULT_TAB ? (
            <VaultKunskapsbankPanel />
          ) : null}
        </Suspense>
      </div>
    </HubErrorBoundary>
  );
}
