import type { VaultLog } from '@/core/types/firestore';
import { ValvAnalyseraZone } from './zones/ValvAnalyseraZone';
import { ValvExporteraZone } from './zones/ValvExporteraZone';
import { ValvForensikZone } from './zones/ValvForensikZone';
import { ValvKunskapZone } from './zones/ValvKunskapZone';
import { ValvSamlaZone } from './zones/ValvSamlaZone';
import { ValvVitZone } from './zones/ValvVitZone';
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
  logsHasMore?: boolean;
  loadingMore?: boolean;
  onLoadMoreLogs?: () => void;
  saving: boolean;
  saveError: string | null;
  highlightLogId: string | null;
  onSave: (input: VaultLogInput) => Promise<void>;
  onBevisConfirmed: (docId: string) => void | Promise<void>;
  onCitationClick: (docId: string) => void;
  onLogsRefresh: () => void;
  onVaultTabChange: (tab: VaultTab) => void;
};

/**
 * Canonical router för Valv-zoner.
 * VaultPage behåller gate + zon-TabBar; sub-TabBar lever i zoner (Fas 2).
 */
export function ValvSuperModule({
  variant,
  vaultTab,
  userId,
  gateOk,
  logs,
  logsLoading,
  logsHasMore,
  loadingMore,
  onLoadMoreLogs,
  saving,
  saveError,
  highlightLogId,
  onSave,
  onBevisConfirmed,
  onCitationClick,
  onLogsRefresh,
  onVaultTabChange,
}: ValvSuperModuleProps) {
  switch (variant) {
    case 'samla': {
      const tab: SamlaVaultTab = isSamlaVaultTab(vaultTab) ? vaultTab : 'logga';
      return (
        <ValvSamlaZone
          tab={tab}
          onTabChange={(next) => onVaultTabChange(next)}
          userId={userId}
          gateOk={gateOk}
          logs={logs}
          logsLoading={logsLoading}
          logsHasMore={logsHasMore}
          loadingMore={loadingMore}
          onLoadMoreLogs={onLoadMoreLogs}
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
      return <ValvAnalyseraZone tab={tab} onTabChange={onVaultTabChange} logs={logs} />;
    }
    case 'kunskap': {
      const tab: KunskapVaultTab = isKunskapVaultTab(vaultTab) ? vaultTab : KUNSKAP_VAULT_TAB;
      return <ValvKunskapZone tab={tab} onTabChange={onVaultTabChange} />;
    }
    case 'vit':
      return <ValvVitZone userId={userId} />;
    case 'exportera':
      return <ValvExporteraZone />;
    case 'forensik': {
      const tab: ForensicVaultTab = isForensicVaultTab(vaultTab) ? vaultTab : 'hamn_analys';
      return <ValvForensikZone tab={tab} onTabChange={onVaultTabChange} />;
    }
    default:
      return null;
  }
}
