import { useCallback, lazy, Suspense, type ReactNode } from 'react';
import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { BentoCard } from '@/shared/ui/BentoCard';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import '../components/valv.css';
import { ValvInputModePicker } from './ValvInputModePicker';
import {
  DEFAULT_VALV_INPUT_MODE,
  valvInputModeDef,
  type ValvInputMode,
} from './valvInputModes';
import { writeValvLastInputMode } from './valvLastModeStorage';
import type { VaultTab } from '../utils/vaultTabs';

const InboxReviewQueue = lazy(() =>
  import('@/modules/inkast/components/InboxReviewQueue').then((m) => ({ default: m.InboxReviewQueue })),
);
const InkastDirectPanel = lazy(() =>
  import('@/modules/capture/InkastDirectPanel').then((m) => ({ default: m.InkastDirectPanel })),
);
const ValvSuperModule = lazy(() =>
  import('../components/ValvSuperModule').then((m) => ({ default: m.ValvSuperModule })),
);

function ValvZoneSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<HubPanelSkeleton lines={5} />}>{children}</Suspense>;
}

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
        <ValvZoneSuspense>
          <InboxReviewQueue
            prioritizeBevis
            onBevisConfirmed={(docId) => {
              void onBevisConfirmed(docId);
              setMode(DEFAULT_VALV_INPUT_MODE);
            }}
            onBack={() => setMode('spara')}
          />
        </ValvZoneSuspense>
      );
    }

    if (activeMode === 'spara') {
      return (
        <ValvZoneSuspense>
          <InkastDirectPanel
            tone="valv"
            sourceModule="valv_samla"
            onQueued={() => setMode('granska')}
            onPersistedBevis={(docId) => void onBevisConfirmed(docId)}
            queueHintAsButton
          />
        </ValvZoneSuspense>
      );
    }

    return (
      <ValvZoneSuspense>
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
      </ValvZoneSuspense>
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
      <div className="mb-3 flex min-w-0 items-center justify-between gap-2">
        <ValvInputModePicker activeMode={activeMode} onChange={setMode} />
        <ModuleHelpFromRegistry moduleId="valv" mode={activeMode} className="shrink-0" />
      </div>

      <div className="mt-2 pr-1">
        {renderZoneContent()}
      </div>
    </BentoCard>
    </HubErrorBoundary>
  );
}
