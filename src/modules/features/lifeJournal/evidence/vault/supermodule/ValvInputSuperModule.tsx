import { useCallback, useMemo } from 'react';
import { Archive } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { InboxReviewQueue } from '@/modules/inkast/components/InboxReviewQueue';
import { ValvSuperModule } from '../components/ValvSuperModule';
import {
  DEFAULT_VALV_INPUT_MODE,
  VALV_INPUT_MODES,
  type ValvInputMode,
} from './valvInputModes';
import { writeValvLastInputMode } from './valvLastModeStorage';
import type { VaultTab } from '../utils/vaultTabs';
import { valvInputModeDef } from './valvInputModes';

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
 * Canonical Valv navigation — ett läge i taget (Fas 1B).
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
      <header className="mb-4 space-y-1">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Sanningsarkiv
        </p>
        <h2 className="font-display-serif text-base uppercase tracking-[0.2em] text-text">
          Ett läge i taget
        </h2>
        <p className="text-xs text-text-dim">{activeDef.description}</p>
      </header>

      <nav
        className="mb-4 flex flex-wrap gap-2 rounded-xl border border-border bg-surface-2 p-1"
        aria-label="Valv-lägen"
      >
        {VALV_INPUT_MODES.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setMode(mode.id)}
              aria-pressed={isActive}
              className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                isActive
                  ? 'border border-indigo-500/40 bg-surface-3 text-accent-light'
                  : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
              }`}
            >
              <span className="block font-medium">{mode.label}</span>
              <span className="block text-[10px] text-text-dim">{mode.description}</span>
            </button>
          );
        })}
      </nav>

      <div className="calm-scroll-island max-h-[min(75vh,720px)] overflow-y-auto pr-1">
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
