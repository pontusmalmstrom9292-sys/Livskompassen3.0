import type { VaultLog } from '@/core/types/firestore';
import { VaultForensicPanel } from './VaultForensicPanel';
import { ValvAnalyseraZone } from './zones/ValvAnalyseraZone';
import { ValvExporteraZone } from './zones/ValvExporteraZone';
import { ValvKunskapZone } from './zones/ValvKunskapZone';
import { ValvSamlaZone } from './zones/ValvSamlaZone';
import type { VaultLogInput } from '../types/vaultEntry';
import {
  KUNSKAP_VAULT_TAB,
  type AnalyseraVaultTab,
  type ForensicVaultTab,
  type KunskapVaultTab,
  type SamlaVaultTab,
  type ValvZone,
  type VaultTab,
  isAnalyseraVaultTab,
  isForensicVaultTab,
  isKunskapVaultTab,
  isSamlaVaultTab,
} from '../utils/vaultTabs';

export type ValvSuperVariant = ValvZone;

export type ValvSuperModuleProps = {
  variant: ValvSuperVariant;
  vaultTab: VaultTab;
  userId: string;
  gateOk: boolean;
  logs: (VaultLog & { id: string })[];
  logsLoading: boolean;
  saving: boolean;
  saveError: string | null;
  highlightLogId: string | null;
  onSave: (input: VaultLogInput) => Promise<void>;
  onBevisConfirmed: (docId: string) => void | Promise<void>;
  onCitationClick: (docId: string) => void;
  onLogsRefresh: () => void;
};

/**
 * Canonical router för Valv-zoner.
 * VaultPage behåller gate + chrome (TabBar); zonsinnehåll delegeras hit.
 */
export function ValvSuperModule({
  variant,
  vaultTab,
  userId,
  gateOk,
  logs,
  logsLoading,
  saving,
  saveError,
  highlightLogId,
  onSave,
  onBevisConfirmed,
  onCitationClick,
  onLogsRefresh,
}: ValvSuperModuleProps) {
  switch (variant) {
    case 'samla': {
      const tab: SamlaVaultTab = isSamlaVaultTab(vaultTab) ? vaultTab : 'logga';
      return (
        <ValvSamlaZone
          tab={tab}
          userId={userId}
          gateOk={gateOk}
          logs={logs}
          logsLoading={logsLoading}
          saving={saving}
          saveError={saveError}
          highlightLogId={highlightLogId}
          onSave={onSave}
          onBevisConfirmed={onBevisConfirmed}
          onCitationClick={onCitationClick}
          onLogsRefresh={onLogsRefresh}
        />
      );
    }
    case 'analysera': {
      const tab: AnalyseraVaultTab = isAnalyseraVaultTab(vaultTab) ? vaultTab : 'monster';
      return <ValvAnalyseraZone tab={tab} logs={logs} />;
    }
    case 'kunskap': {
      const tab: KunskapVaultTab = isKunskapVaultTab(vaultTab) ? vaultTab : KUNSKAP_VAULT_TAB;
      return <ValvKunskapZone tab={tab} />;
    }
    case 'exportera':
      return <ValvExporteraZone />;
    case 'forensik': {
      const tab: ForensicVaultTab = isForensicVaultTab(vaultTab) ? vaultTab : 'hamn_analys';
      return <VaultForensicPanel tab={tab} />;
    }
    default:
      return null;
  }
}
