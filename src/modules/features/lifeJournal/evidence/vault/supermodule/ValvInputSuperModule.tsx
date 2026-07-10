import { useCallback } from 'react';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { BentoCard } from '@/shared/ui/BentoCard';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import '../components/valv.css';
import { InboxReviewQueue } from '@/modules/inkast/components/InboxReviewQueue';
import { InkastDirectPanel } from '@/modules/capture/InkastDirectPanel';
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
 * Spara (B1): InkastDirectPanel direkt — unified "en väg in", WORM-only append.
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

  const renderZoneContent = () => {
    if (activeMode === 'granska') {
      return (
        <InboxReviewQueue
          prioritizeBevis
          onBevisConfirmed={(docId) => {
            void onBevisConfirmed(docId);
            setMode(DEFAULT_VALV_INPUT_MODE);
          }}
          onBack={() => setMode('spara')}
        />
      );
    }

    if (activeMode === 'spara') {
      return (
        <InkastDirectPanel
          tone="valv"
          sourceModule="valv_samla"
          onQueued={() => setMode('granska')}
          onPersistedBevis={(docId) => void onBevisConfirmed(docId)}
          queueHintAsButton
        />
      );
    }

    return (
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
    );
  };

  return (
    <HubErrorBoundary
      title="Valv-inmatning kunde inte laddas"
      glow="blue"
      backTo="/valvet"
      backLabel="Till Valvet"
      logTag="ValvInputSuperModule"
    >
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
        {renderZoneContent()}
      </div>
    </BentoCard>
    </HubErrorBoundary>
  );
}
