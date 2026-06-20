import { useCallback } from 'react';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { BentoCard } from '@/shared/ui/BentoCard';
import '../components/valv.css';
import { InboxReviewQueue } from '@/modules/inkast/components/InboxReviewQueue';
import { ValvSuperModule } from '../components/ValvSuperModule';
import { ValvInputModePicker } from './ValvInputModePicker';
import {
  DEFAULT_VALV_INPUT_MODE,
  valvInputModeDef,
  type ValvInputMode,
} from './valvInputModes';
import { writeValvLastInputMode } from './valvLastModeStorage';
import type { VaultTab } from '../utils/vaultTabs';

export type ValvInputSuperModuleProps = {
  activeMode: ValvInputMode;
  onModeChange: (mode: ValvInputMode) => void;
  vaultTab: VaultTab;
  userId: string;
  gateOk: boolean;
  highlightLogId: string | null;
  onBevisConfirmed: (docId: string) => void | Promise<void>;
  onCitationClick: (docId: string) => void;
  onVaultTabChange: (tab: VaultTab) => void;
  techniqueFilter?: string | null;
  onTechniqueSelect?: (technique: string) => void;
  onClearTechniqueFilter?: () => void;
};

/**
 * Canonical Valv navigation — primära lägen + «Mer…» (Fas 1B).
 * Granska ersätter separat inbox-zon och `?samlaView=granska`.
 */
export function ValvInputSuperModule({
  activeMode,
  onModeChange,
  vaultTab,
  userId,
  gateOk,
  highlightLogId,
  onBevisConfirmed,
  onCitationClick,
  onVaultTabChange,
  techniqueFilter,
  onTechniqueSelect,
  onClearTechniqueFilter,
}: ValvInputSuperModuleProps) {
  const setMode = useCallback(
    (mode: ValvInputMode) => {
      writeValvLastInputMode(mode);
      onModeChange(mode);
    },
    [onModeChange],
  );

  return (
    <BentoCard
      glow="blue"
      depth
      noHover
      bare
      className="!p-4 sm:!p-5"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <ValvInputModePicker activeMode={activeMode} onChange={setMode} />
        <ModuleHelpFromRegistry moduleId="valv" mode={activeMode} />
      </div>

      <div className="mt-2 pr-1">
        {activeMode === 'granska' ? (
          <InboxReviewQueue
            prioritizeBevis
            onBevisConfirmed={(docId) => {
              void onBevisConfirmed(docId);
              setMode(DEFAULT_VALV_INPUT_MODE);
            }}
            onBack={() => setMode('spara')}
          />
        ) : (
          <ValvSuperModule
            variant={valvInputModeDef(activeMode).zone}
            vaultTab={vaultTab}
            userId={userId}
            gateOk={gateOk}
            highlightLogId={highlightLogId}
            onBevisConfirmed={onBevisConfirmed}
            onCitationClick={onCitationClick}
            onVaultTabChange={onVaultTabChange}
            onOpenGranska={() => setMode('granska')}
            techniqueFilter={techniqueFilter}
            onTechniqueSelect={onTechniqueSelect}
            onClearTechniqueFilter={onClearTechniqueFilter}
          />
        )}
      </div>
    </BentoCard>
  );
}
