import { ValvAnalyseraZone } from './zones/ValvAnalyseraZone';
import { ValvExporteraZone } from './zones/ValvExporteraZone';
import { ValvForensikZone } from './zones/ValvForensikZone';
import { ValvKunskapZone } from './zones/ValvKunskapZone';
import { ValvSamlaZone } from './zones/ValvSamlaZone';
import { ValvVitZone } from './zones/ValvVitZone';
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
  highlightLogId: string | null;
  onBevisConfirmed: (docId: string) => void | Promise<void>;
  onCitationClick: (docId: string) => void;
  onVaultTabChange: (tab: VaultTab) => void;
  /** Öppna granskningskö (ValvInputSuperModule granska-läge). */
  onOpenGranska?: () => void;
  techniqueFilter?: string | null;
  onTechniqueSelect?: (technique: string) => void;
  onClearTechniqueFilter?: () => void;
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
  highlightLogId,
  onBevisConfirmed,
  onCitationClick,
  onVaultTabChange,
  onOpenGranska,
  techniqueFilter,
  onTechniqueSelect,
  onClearTechniqueFilter,
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
          highlightLogId={highlightLogId}
          onBevisConfirmed={onBevisConfirmed}
          onCitationClick={onCitationClick}
          onOpenGranska={onOpenGranska}
          techniqueFilter={techniqueFilter}
          onClearTechniqueFilter={onClearTechniqueFilter}
        />
      );
    }
    case 'analysera': {
      const tab: AnalyseraVaultTab = isAnalyseraVaultTab(vaultTab) ? vaultTab : 'monster';
      return <ValvAnalyseraZone tab={tab} onTabChange={onVaultTabChange} onTechniqueSelect={onTechniqueSelect} />;
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
      return <ValvForensikZone tab={tab} onTabChange={onVaultTabChange} gateOk={gateOk} />;
    }
    default:
      return null;
  }
}
