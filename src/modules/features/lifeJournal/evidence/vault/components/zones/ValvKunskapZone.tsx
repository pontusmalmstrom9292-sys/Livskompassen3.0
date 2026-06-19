import { TabBar } from '@/core/ui/TabBar';
import { getKunskapVaultTabBarItems } from '@/core/navigation/tabRegistry';
import { VaultAktorskartaPanel } from '../../../knowledge/components/VaultAktorskartaPanel';
import { VaultKunskapsbankPanel } from '../../../knowledge/components/VaultKunskapsbankPanel';
import { AKTORSKARTA_VAULT_TAB, KUNSKAP_VAULT_TAB, type KunskapVaultTab } from '../../utils/vaultTabs';

export type ValvKunskapZoneProps = {
  tab: KunskapVaultTab;
  onTabChange: (tab: KunskapVaultTab) => void;
};

/** Locked UX — Kunskapsbank + Aktörskarta (G9). */
export function ValvKunskapZone({ tab, onTabChange }: ValvKunskapZoneProps) {
  return (
    <>
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
      ) : tab === KUNSKAP_VAULT_TAB ? (
        <VaultKunskapsbankPanel />
      ) : null}
    </>
  );
}
