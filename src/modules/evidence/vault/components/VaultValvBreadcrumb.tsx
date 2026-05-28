import {
  forensicVaultTabLabel,
  isForensicVaultTab,
  isPansaretVaultTab,
  type ValvZone,
  type VaultTab,
} from '../utils/vaultTabs';
import { vaultMainTabLabel } from '../../../core/navigation/tabRegistry';

type VaultValvBreadcrumbProps = {
  zone: ValvZone;
  vaultTab: VaultTab;
};

/** Valv › zon › underflik — synkad med drawer-grupper (Pansaret · Kunskapsbank · Forensik). */
export function VaultValvBreadcrumb({ zone, vaultTab }: VaultValvBreadcrumbProps) {
  const parts: string[] = ['Valv'];

  if (zone === 'pansaret') {
    parts.push('Pansaret');
    if (isPansaretVaultTab(vaultTab)) parts.push(vaultMainTabLabel(vaultTab));
  } else if (zone === 'kunskap') {
    parts.push('Kunskapsbank');
  } else {
    parts.push('Forensik');
    if (isForensicVaultTab(vaultTab)) parts.push(forensicVaultTabLabel(vaultTab));
  }

  return (
    <p className="text-xs uppercase tracking-widest text-text-dim" aria-label={parts.join(', ')}>
      {parts.join(' · ')}
    </p>
  );
}
