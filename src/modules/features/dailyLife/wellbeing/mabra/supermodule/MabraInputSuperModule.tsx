import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
import { useStore } from '@/core/store';
import { MabraCheckinModal } from '@/components/mabra/MabraCheckinModal';
import { EmotionalMemoryView } from '../components/EmotionalMemoryView';
import { VitCardFlowPanel } from '../components/VitCardFlowPanel';
import { VitChatFlowPanel } from '../components/VitChatFlowPanel';
import { VitMemoryFlowPanel } from '../components/VitMemoryFlowPanel';
import { MABRA_PROJECTS, type MabraProjectId } from '../constants/mabraProjects';
import { MabraDagbokBridgePanel } from './MabraDagbokBridgePanel';
import { MabraExerciseNotePanel } from './MabraExerciseNotePanel';
import { MabraReflectionSuperhubPanel } from './MabraReflectionSuperhubPanel';
import {
  DEFAULT_MABRA_INPUT_MODE,
  MABRA_INPUT_MODES_FAS6D,
  MABRA_INPUT_MODES_MORE,
  MABRA_INPUT_MODES_MORE_ALL,
  MABRA_INPUT_MODES_PRIMARY,
  parseMabraInputMode,
  resolveProjectIdForMode,
  shouldUseEmotionalMemoryDelegate,
  type MabraInputMode,
} from './mabraInputModes';

export type MabraInputSuperModuleProps = {
  /** Optional project context (e.g. embed from `/mabra/projekt/:projectId`). */
  projectId?: MabraProjectId;
};

function parseProjectId(value: string | null): MabraProjectId | undefined {
  if (!value) return undefined;
  return MABRA_PROJECTS.some((project) => project.id === value)
    ? (value as MabraProjectId)
    : undefined;
}

/**
 * Canonical router for MåBra Universal Input Hub (Fas 6A→6D).
 * Thin delegate — no direct Firestore writes in this file.
 */
export function MabraInputSuperModule({ projectId: projectIdProp }: MabraInputSuperModuleProps) {
  const user = useStore((s) => s.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showMoreModes, setShowMoreModes] = useState(false);

  const projectId = useMemo(
    () => projectIdProp ?? parseProjectId(searchParams.get('projectId')),
    [projectIdProp, searchParams],
  );

  const activeMode = useMemo(
    () => parseMabraInputMode(searchParams.get('inputMode')),
    [searchParams],
  );

  const setActiveMode = useCallback(
    (mode: MabraInputMode) => {
      const next = new URLSearchParams(searchParams);
      if (mode === DEFAULT_MABRA_INPUT_MODE) {
        next.delete('inputMode');
      } else {
        next.set('inputMode', mode);
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const resolvedProjectId = resolveProjectIdForMode(activeMode, projectId);
  const vitProjectId = projectId ?? 'self_esteem';
  const reflectionBankId = searchParams.get('initialBankId') ?? undefined;

  const isMoreModeActive = MABRA_INPUT_MODES_MORE_ALL.some((mode) => mode.id === activeMode);

  return (
    <section
      className="calm-card glow-bottom-green overflow-hidden rounded-2xl border border-border bg-surface-2/70 p-4 sm:p-5"
      aria-label="MåBra inmatningshub"
    >
      <header className="supermodule-hub-chrome mb-4 space-y-1 rounded-xl px-3 py-3 sm:px-4">
        <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
          Universal Input
        </p>
        <h2 className="font-display-serif text-base uppercase tracking-[0.2em] text-text">
          Ett läge i taget
        </h2>
        <p className="text-xs text-text-dim">
          Byt läge utan att lämna sidan — molnet sparas endast när du trycker explicit.
        </p>
        {projectId ? (
          <p className="text-[10px] uppercase tracking-wider text-text-dim">
            Projektkontext: {MABRA_PROJECTS.find((p) => p.id === projectId)?.title ?? projectId}
          </p>
        ) : null}
      </header>

      <nav
        className="mb-5 flex flex-wrap gap-2 rounded-xl border border-border bg-surface-2 p-1"
        aria-label="Inmatningslägen"
      >
        {MABRA_INPUT_MODES_PRIMARY.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => setActiveMode(mode.id)}
              aria-pressed={isActive}
              className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                isActive
                  ? 'border border-accent/40 bg-surface-3 text-accent'
                  : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
              }`}
            >
              <span className="block font-medium">{mode.label}</span>
              <span className="block text-[10px] text-text-dim">{mode.description}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowMoreModes((open) => !open)}
          aria-expanded={showMoreModes || isMoreModeActive}
          className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
            isMoreModeActive
              ? 'border border-accent/40 bg-surface-3 text-accent'
              : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
          }`}
        >
          <span className="block font-medium">Mer…</span>
          <span className="block text-[10px] text-text-dim">Reflektion, dagbok & inkast</span>
        </button>

        {(showMoreModes || isMoreModeActive) &&
          MABRA_INPUT_MODES_MORE.map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(mode.id)}
                aria-pressed={isActive}
                className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                  isActive
                    ? 'border border-accent/40 bg-surface-3 text-accent'
                    : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
                }`}
              >
                <span className="block font-medium">{mode.label}</span>
                <span className="block text-[10px] text-text-dim">{mode.description}</span>
              </button>
            );
          })}

        {(showMoreModes || isMoreModeActive) &&
          MABRA_INPUT_MODES_FAS6D.map((mode) => {
            const isActive = activeMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setActiveMode(mode.id)}
                aria-pressed={isActive}
                className={`rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                  isActive
                    ? 'border border-accent/40 bg-surface-3 text-accent'
                    : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
                }`}
              >
                <span className="block font-medium">{mode.label}</span>
                <span className="block text-[10px] text-text-dim">{mode.description}</span>
              </button>
            );
          })}
      </nav>

      <div className="calm-scroll-island max-h-[min(70vh,640px)] overflow-y-auto pr-1">
        <MabraInputModeDelegate
          mode={activeMode}
          userId={user?.uid}
          projectId={resolvedProjectId}
          vitProjectId={vitProjectId}
          reflectionBankId={reflectionBankId}
          onSwitchToDagbokBridge={() => setActiveMode('dagbok_bridge')}
        />
      </div>
    </section>
  );
}

type DelegateProps = {
  mode: MabraInputMode;
  userId: string | undefined;
  projectId: MabraProjectId | undefined;
  vitProjectId: MabraProjectId;
  reflectionBankId?: string;
  onSwitchToDagbokBridge: () => void;
};

function MabraInputModeDelegate({
  mode,
  userId,
  projectId,
  vitProjectId,
  reflectionBankId,
  onSwitchToDagbokBridge,
}: DelegateProps) {
  if (shouldUseEmotionalMemoryDelegate(mode, projectId)) {
    if (!projectId) {
      return <p className="text-sm text-text-muted">Känslominne kräver projektkontext.</p>;
    }
    return <EmotionalMemoryView userId={userId} projectId={projectId} compact />;
  }

  switch (mode) {
    case 'checkin':
      return <MabraCheckinModal isOpen={true} variant="inline" onClose={() => undefined} />;

    case 'reflection_tool':
      return (
        <MabraReflectionSuperhubPanel
          userId={userId}
          vitProjectId={vitProjectId}
          initialBankId={reflectionBankId}
          onSwitchToDagbokBridge={onSwitchToDagbokBridge}
        />
      );

    case 'exercise_note':
      return (
        <MabraExerciseNotePanel
          userId={userId}
          vitProjectId={vitProjectId}
          onSwitchToDagbokBridge={onSwitchToDagbokBridge}
        />
      );

    case 'dagbok_bridge':
      return <MabraDagbokBridgePanel />;

    case 'inkast':
      if (!userId) {
        return <p className="text-sm text-text-muted">Logga in för att använda inkast med granskning.</p>;
      }
      return (
        <div className="space-y-3">
          <p className="text-xs text-text-dim">
            Tematisk reflektion — AI föreslår arkiv. Du godkänner alltid innan spar (HITL).
          </p>
          <CaptureSuperModule variant="mabra" compact />
        </div>
      );

    case 'vit_card':
    case 'vit_chat':
    case 'vit_memory':
      if (!projectId) {
        return <p className="text-sm text-text-muted">Det här läget kräver projektkontext.</p>;
      }
      if (mode === 'vit_card') {
        return <VitCardFlowPanel userId={userId} projectId={projectId} />;
      }
      if (mode === 'vit_chat') {
        return <VitChatFlowPanel userId={userId} projectId={projectId} />;
      }
      return <VitMemoryFlowPanel userId={userId} projectId={projectId} />;

    default:
      return null;
  }
}
