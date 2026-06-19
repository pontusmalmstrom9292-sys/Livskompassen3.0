import { TabBar } from '@/core/ui/TabBar';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { getKunskapVaultTabBarItems } from '@/core/navigation/tabRegistry';
import { VaultAktorskartaPanel } from '../../../knowledge/components/VaultAktorskartaPanel';
import { VaultKanonDocsPanel } from '../../../knowledge/components/VaultKanonDocsPanel';
import { VaultKunskapsbankPanel } from '../../../knowledge/components/VaultKunskapsbankPanel';
import {
  AKTORSKARTA_VAULT_TAB,
  DOCS_VAULT_TAB,
  KUNSKAP_VAULT_TAB,
  type KunskapVaultTab,
} from '../../utils/vaultTabs';

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
      <div className="mb-3">
        <TabBar
          size="compact"
          tabs={getKunskapVaultTabBarItems()}
          active={tab}
          onChange={onTabChange}
        />
      </div>
      {tab === AKTORSKARTA_VAULT_TAB ? (
        <VaultAktorskartaPanel />
      ) : tab === DOCS_VAULT_TAB ? (
        <VaultKanonDocsPanel />
      ) : tab === KUNSKAP_VAULT_TAB ? (
        <VaultKunskapsbankPanel />
      ) : null}
    </HubErrorBoundary>
  );
}
