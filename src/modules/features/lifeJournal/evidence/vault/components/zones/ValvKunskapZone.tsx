import { VaultAktorskartaPanel } from '../../../knowledge/components/VaultAktorskartaPanel';
import { VaultKunskapsbankPanel } from '../../../knowledge/components/VaultKunskapsbankPanel';
import { AKTORSKARTA_VAULT_TAB, KUNSKAP_VAULT_TAB, type KunskapVaultTab } from '../../utils/vaultTabs';

export type ValvKunskapZoneProps = {
  tab: KunskapVaultTab;
};

/** Locked UX — Kunskapsbank + Aktörskarta (G9). */
export function ValvKunskapZone({ tab }: ValvKunskapZoneProps) {
  if (tab === AKTORSKARTA_VAULT_TAB) {
    return <VaultAktorskartaPanel />;
  }

  if (tab === KUNSKAP_VAULT_TAB) {
    return <VaultKunskapsbankPanel />;
  }

  return null;
}
