import {
  forensicVaultTabLabel,
  isAnalyseraVaultTab,
  isExporteraVaultTab,
  isForensicVaultTab,
  isKunskapVaultTab,
  isVitVaultTab,
  isSamlaVaultTab,
  type ValvZone,
  type VaultTab,
} from '../utils/vaultTabs';
import { VIT_VAULT_TAB_LABEL } from '@/core/copy/valvNavCopy';
import { getVaultZoneTabBarItems, vaultMainTabLabel } from '@/core/navigation/tabRegistry';

type VaultValvBreadcrumbProps = {
  zone: ValvZone;
  vaultTab: VaultTab;
};

const ZONE_LABEL = Object.fromEntries(
  getVaultZoneTabBarItems().map((z) => [z.id, z.label]),
) as Record<ValvZone, string>;

/** Valv › zon › underflik — synkad med drawer-grupper. */
export function VaultValvBreadcrumb({ zone, vaultTab }: VaultValvBreadcrumbProps) {
  const parts: string[] = ['Valv', ZONE_LABEL[zone] ?? zone];

  if (isSamlaVaultTab(vaultTab) || isAnalyseraVaultTab(vaultTab) || isExporteraVaultTab(vaultTab)) {
    parts.push(vaultMainTabLabel(vaultTab));
  } else if (isKunskapVaultTab(vaultTab)) {
    parts.push(vaultMainTabLabel(vaultTab));
  } else if (isVitVaultTab(vaultTab)) {
    parts.push(VIT_VAULT_TAB_LABEL);
  } else if (isForensicVaultTab(vaultTab)) {
    parts.push(forensicVaultTabLabel(vaultTab));
  }

  return (
    <p className="text-xs uppercase tracking-widest text-text-dim" aria-label={parts.join(', ')}>
      {parts.join(' · ')}
    </p>
  );
}
