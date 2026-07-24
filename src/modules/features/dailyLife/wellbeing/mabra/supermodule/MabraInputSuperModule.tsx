import { ModuleHelpFromRegistry } from '@/core/help/ModuleHelpFromRegistry';
import { useCallback, useMemo, useState, lazy, Suspense, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { useStore } from '@/core/store';
import { MABRA_PROJECTS, type MabraProjectId } from '../constants/mabraProjects';
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

const MabraCheckinModal = lazy(() =>
  import('@/components/mabra/MabraCheckinModal').then((m) => ({ default: m.MabraCheckinModal })),
);
const EmotionalMemoryView = lazy(() =>
  import('../components/EmotionalMemoryView').then((m) => ({ default: m.EmotionalMemoryView })),
);
const VitCardFlowPanel = lazy(() =>
  import('../components/VitCardFlowPanel').then((m) => ({ default: m.VitCardFlowPanel })),
);
const VitChatFlowPanel = lazy(() =>
  import('../components/VitChatFlowPanel').then((m) => ({ default: m.VitChatFlowPanel })),
);
const VitMemoryFlowPanel = lazy(() =>
  import('../components/VitMemoryFlowPanel').then((m) => ({ default: m.VitMemoryFlowPanel })),
);
const MabraDagbokBridgePanel = lazy(() =>
  import('./MabraDagbokBridgePanel').then((m) => ({ default: m.MabraDagbokBridgePanel })),
);
const MabraExerciseNotePanel = lazy(() =>
  import('./MabraExerciseNotePanel').then((m) => ({ default: m.MabraExerciseNotePanel })),
);
const MabraReflectionSuperhubPanel = lazy(() =>
  import('./MabraReflectionSuperhubPanel').then((m) => ({ default: m.MabraReflectionSuperhubPanel })),
);
const CaptureSuperModule = lazy(() =>
  import('@/modules/capture/CaptureSuperModule').then((m) => ({ default: m.CaptureSuperModule })),
);

const MODE_BUTTON_BASE =
  'min-h-[44px] rounded-lg px-3 py-2 text-left text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2';

function modeButtonClass(isActive: boolean) {
  return `${MODE_BUTTON_BASE} ${
    isActive
      ? 'border border-accent/40 bg-surface-3 text-accent'
      : 'border border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
  }`;
}

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
 * Canonical router for Mabra Universal Input Hub (Fas 6A→6D).
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
      aria-label="Mabra inmatningshub"
    >
      <header className="supermodule-hub-chrome mb-4 flex items-start justify-between gap-3 rounded-2xl px-3 py-3 sm:px-4">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="od-depth__eyebrow font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
            Universal Input
          </p>
          <h2 className="font-display-serif text-base uppercase tracking-[0.2em] text-text">
            Ett läge i taget
          </h2>
          <p className="text-xs text-text-muted">
            Byt läge utan att lämna sidan — molnet sparas endast när du trycker explicit.
          </p>
          {projectId ? (
            <p className="text-[10px] uppercase tracking-wider text-text-muted">
              Projektkontext: {MABRA_PROJECTS.find((p) => p.id === projectId)?.title ?? projectId}
            </p>
          ) : null}
        </div>
        <ModuleHelpFromRegistry moduleId="mabra" mode={activeMode} />
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
              className={modeButtonClass(isActive)}
            >
              <span className="block font-medium">{mode.label}</span>
              <span className="block text-[10px] text-text-muted">{mode.description}</span>
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => setShowMoreModes((open) => !open)}
          aria-expanded={showMoreModes || isMoreModeActive}
          className={modeButtonClass(isMoreModeActive)}
        >
          <span className="block font-medium">Mer…</span>
          <span className="block text-[10px] text-text-muted">Reflektion, dagbok & inkast</span>
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
                className={modeButtonClass(isActive)}
              >
                <span className="block font-medium">{mode.label}</span>
                <span className="block text-[10px] text-text-muted">{mode.description}</span>
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
                className={modeButtonClass(isActive)}
              >
                <span className="block font-medium">{mode.label}</span>
                <span className="block text-[10px] text-text-muted">{mode.description}</span>
              </button>
            );
          })}
      </nav>

      <div className="calm-scroll-island superhub-scroll-island pr-1">
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
    return (
      <Suspense fallback={<HubPanelSkeleton lines={4} />}>
        <EmotionalMemoryView userId={userId} projectId={projectId} compact />
      </Suspense>
    );
  }

  let content: ReactNode = null;

  switch (mode) {
    case 'checkin':
      content = <MabraCheckinModal isOpen={true} variant="inline" onClose={() => undefined} />;
      break;

    case 'reflection_tool':
      content = (
        <MabraReflectionSuperhubPanel
          userId={userId}
          vitProjectId={vitProjectId}
          initialBankId={reflectionBankId}
          onSwitchToDagbokBridge={onSwitchToDagbokBridge}
        />
      );
      break;

    case 'exercise_note':
      content = (
        <MabraExerciseNotePanel
          userId={userId}
          vitProjectId={vitProjectId}
          onSwitchToDagbokBridge={onSwitchToDagbokBridge}
        />
      );
      break;

    case 'dagbok_bridge':
      content = <MabraDagbokBridgePanel />;
      break;

    case 'inkast':
      if (!userId) {
        return <p className="text-sm text-text-muted">Logga in för att använda inkast med granskning.</p>;
      }
      content = (
        <div className="space-y-3">
          <p className="text-xs text-text-muted">
            Tematisk reflektion — AI föreslår arkiv. Du godkänner alltid innan spar (HITL).
          </p>
          <CaptureSuperModule variant="mabra" compact />
        </div>
      );
      break;

    case 'vit_card':
    case 'vit_chat':
    case 'vit_memory':
      if (!projectId) {
        return <p className="text-sm text-text-muted">Det här läget kräver projektkontext.</p>;
      }
      if (mode === 'vit_card') {
        content = <VitCardFlowPanel userId={userId} projectId={projectId} />;
      } else if (mode === 'vit_chat') {
        content = <VitChatFlowPanel userId={userId} projectId={projectId} />;
      } else {
        content = <VitMemoryFlowPanel userId={userId} projectId={projectId} />;
      }
      break;

    default:
      return null;
  }

  return <Suspense fallback={<HubPanelSkeleton lines={4} />}>{content}</Suspense>;
}
