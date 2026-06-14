import { useCallback, useMemo } from 'react';
import { Archive } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { InboxReviewQueue } from '@/modules/inkast/components/InboxReviewQueue';
import { ValvSuperModule } from '../components/ValvSuperModule';
import { ValvInputModePicker } from './ValvInputModePicker';
import {
  DEFAULT_VALV_INPUT_MODE,
  valvInputModeDef,
  VALV_INPUT_MODES_PRIMARY,
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
}: ValvInputSuperModuleProps) {
  const activeDef = useMemo(() => valvInputModeDef(activeMode), [activeMode]);
  void VALV_INPUT_MODES_PRIMARY;

  const setMode = useCallback(
    (mode: ValvInputMode) => {
      writeValvLastInputMode(mode);
      onModeChange(mode);
    },
    [onModeChange],
  );

  return (
    <BentoCard
      title="Valv"
      icon={<Archive className="h-4 w-4" />}
      glow="blue"
      className="overflow-hidden !p-4 sm:!p-5"
    >
      <header className="mb-3 space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Sanningsarkiv
        </p>
        <h2 className="font-display-serif text-base uppercase tracking-[0.2em] text-text">
          {activeDef.label}
        </h2>
        <p className="text-xs text-text-dim">{activeDef.description}</p>
      </header>

      <ValvInputModePicker activeMode={activeMode} onChange={setMode} />

      <div className="calm-scroll-island mt-4 max-h-[min(75vh,720px)] overflow-y-auto pr-1">
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
            variant={activeDef.zone}
            vaultTab={vaultTab}
            userId={userId}
            gateOk={gateOk}
            highlightLogId={highlightLogId}
            onBevisConfirmed={onBevisConfirmed}
            onCitationClick={onCitationClick}
            onVaultTabChange={onVaultTabChange}
            onOpenGranska={() => setMode('granska')}
          />
        )}
      </div>
    </BentoCard>
  );
}
