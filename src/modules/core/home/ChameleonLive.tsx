import { lazy, Suspense, useCallback, useEffect } from 'react';
import { clsx } from 'clsx';
import { useStore } from '@/core/store';
import { useFamiljenShell } from '@/features/family/children/hooks/useFamiljenShell';
import { MabraCheckinModal } from '@/components/mabra/MabraCheckinModal';
import { MabraReflectionSuperhubPanel } from '@/features/dailyLife/wellbeing/mabra/supermodule/MabraReflectionSuperhubPanel';
import { CaptureSuperModule } from '@/modules/capture/CaptureSuperModule';
import type { DagbokInputMode } from '@/features/lifeJournal/diary/supermodule/dagbokInputModes';
import type { PlaneringInputMode } from '@/features/admin/planning/supermodule/planeringInputModes';
import type { MabraInputMode } from '@/features/dailyLife/wellbeing/mabra/supermodule/mabraInputModes';
import type { FamiljenInputMode } from '@/features/family/children/supermodule/familjenInputModes';
import { getChameleonZone, type ChameleonZoneId } from './chameleonZones';
import {
  getDefaultTarget,
  type ChameleonTarget,
} from './chameleonBridge';
import { useChameleonMorph } from './useChameleonMorph';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';

const DagbokReflektionDelegate = lazy(() =>
  import('@/features/lifeJournal/diary/supermodule/delegates/DagbokReflektionDelegate').then((m) => ({
    default: m.DagbokReflektionDelegate,
  })),
);
const DagbokQuickMirrorDelegate = lazy(() =>
  import('@/features/lifeJournal/diary/supermodule/delegates/DagbokQuickMirrorDelegate').then((m) => ({
    default: m.DagbokQuickMirrorDelegate,
  })),
);
const DagbokArkivDelegate = lazy(() =>
  import('@/features/lifeJournal/diary/supermodule/delegates/DagbokReflektionDelegate').then((m) => ({
    default: m.DagbokArkivDelegate,
  })),
);
const PlaneringTaskQuickDelegate = lazy(() =>
  import('@/features/admin/planning/supermodule/delegates/PlaneringTaskQuickDelegate').then((m) => ({
    default: m.PlaneringTaskQuickDelegate,
  })),
);
const PlaneringInkastDelegate = lazy(() =>
  import('@/features/admin/planning/supermodule/delegates/PlaneringInkastDelegate').then((m) => ({
    default: m.PlaneringInkastDelegate,
  })),
);
const PlaneringQuickListDelegate = lazy(() =>
  import('@/features/admin/planning/supermodule/delegates/PlaneringQuickListDelegate').then((m) => ({
    default: m.PlaneringQuickListDelegate,
  })),
);
const FamiljenBarnfokusDelegate = lazy(() =>
  import('@/features/family/children/supermodule/delegates/FamiljenBarnfokusDelegate').then((m) => ({
    default: m.FamiljenBarnfokusDelegate,
  })),
);
const FamiljenLivsloggStundDelegate = lazy(() =>
  import('@/features/family/children/supermodule/delegates/FamiljenLivsloggStundDelegate').then((m) => ({
    default: m.FamiljenLivsloggStundDelegate,
  })),
);
const FamiljenFysiologiDelegate = lazy(() =>
  import('@/features/family/children/supermodule/delegates/FamiljenFysiologiDelegate').then((m) => ({
    default: m.FamiljenFysiologiDelegate,
  })),
);
const FamiljenInkastDelegate = lazy(() =>
  import('@/features/family/children/supermodule/delegates/FamiljenInkastDelegate').then((m) => ({
    default: m.FamiljenInkastDelegate,
  })),
);

type Props = {
  target: ChameleonTarget;
  onTargetChange?: (target: ChameleonTarget) => void;
  onStatus?: (msg: string) => void;
  compact?: boolean;
  /** Executive chrome v3 — skin only, delegates oförändrade */
  executiveSkin?: boolean;
};

function DelegateFallback() {
  return (
    <div className="chameleon-shell__hint p-3" aria-busy="true" aria-label="Laddar läge">
      <HubPanelSkeleton label="Laddar läge…" lines={3} />
    </div>
  );
}

function DagbokDelegate({ mode }: { mode: DagbokInputMode }) {
  switch (mode) {
    case 'reflektion':
      return <DagbokReflektionDelegate />;
    case 'quick_mirror':
      return <DagbokQuickMirrorDelegate />;
    case 'arkiv':
      return <DagbokArkivDelegate />;
    default:
      return null;
  }
}

function PlaneringDelegate({ mode }: { mode: PlaneringInputMode }) {
  switch (mode) {
    case 'task_quick':
      return <PlaneringTaskQuickDelegate />;
    case 'inkast':
      return <PlaneringInkastDelegate />;
    case 'quick_list':
      return <PlaneringQuickListDelegate />;
    default:
      return null;
  }
}

function MabraDelegate({ mode }: { mode: MabraInputMode }) {
  const user = useStore((s) => s.user);
  switch (mode) {
    case 'checkin':
      return <MabraCheckinModal isOpen variant="inline" onClose={() => undefined} />;
    case 'reflection_tool':
      return (
        <MabraReflectionSuperhubPanel
          userId={user?.uid}
          vitProjectId="self_esteem"
          onSwitchToDagbokBridge={() => undefined}
        />
      );
    case 'inkast':
      if (!user?.uid) {
        return <p className="chameleon-shell__hint text-sm text-text-dim">Logga in för inkast med granskning.</p>;
      }
      return <CaptureSuperModule variant="mabra" compact />;
    default:
      return <MabraCheckinModal isOpen variant="inline" onClose={() => undefined} />;
  }
}

function FamiljenDelegate({
  mode,
  shell,
}: {
  mode: FamiljenInputMode;
  shell: ReturnType<typeof useFamiljenShell>;
}) {
  switch (mode) {
    case 'barnfokus':
      return <FamiljenBarnfokusDelegate shell={shell} />;
    case 'livslogg_stund':
      return <FamiljenLivsloggStundDelegate shell={shell} />;
    case 'fysiologi':
      return <FamiljenFysiologiDelegate shell={shell} />;
    case 'inkast':
      return <FamiljenInkastDelegate shell={shell} />;
    default:
      return <FamiljenBarnfokusDelegate shell={shell} />;
  }
}

function ChameleonDelegateBody({ target }: { target: ChameleonTarget }) {
  const shell = useFamiljenShell();

  return (
    <Suspense fallback={<DelegateFallback />}>
      {target.module === 'dagbok' ? (
        <DagbokDelegate mode={target.mode as DagbokInputMode} />
      ) : null}
      {target.module === 'planering' ? (
        <PlaneringDelegate mode={target.mode as PlaneringInputMode} />
      ) : null}
      {target.module === 'mabra' ? <MabraDelegate mode={target.mode as MabraInputMode} /> : null}
      {target.module === 'familjen' ? (
        <FamiljenDelegate mode={target.mode as FamiljenInputMode} shell={shell} />
      ) : null}
    </Suspense>
  );
}

function moduleForMode(zone: ChameleonZoneId, modeId: string): ChameleonTarget['module'] {
  if (zone === 'hjartat') return 'dagbok';
  if (zone === 'familjen') return 'familjen';
  if (modeId === 'checkin' || modeId === 'vit_card' || modeId === 'reflection_tool') return 'mabra';
  return 'planering';
}

/** Chameleon Supermodule — riktiga delegates, morph 350 ms. */
export function ChameleonLive({
  target,
  onTargetChange,
  onStatus,
  compact = false,
  executiveSkin = false,
}: Props) {
  const zoneDef = getChameleonZone(target.zone);
  const { displayed, fading, morphTo } = useChameleonMorph(target);

  useEffect(() => {
    morphTo(target);
  }, [target, morphTo]);

  const setMode = useCallback(
    (modeId: string) => {
      const module = moduleForMode(target.zone, modeId);
      const next: ChameleonTarget = { zone: target.zone, module, mode: modeId };
      onTargetChange?.(next);
      onStatus?.(`Mode: ${modeId}`);
    },
    [onStatus, onTargetChange, target.zone],
  );

  const setZone = useCallback(
    (zone: ChameleonZoneId) => {
      const next = getDefaultTarget(zone);
      onTargetChange?.(next);
      onStatus?.(`Zon: ${getChameleonZone(zone).label}`);
    },
    [onStatus, onTargetChange],
  );

  return (
    <div
      className={clsx(
        'chameleon-shell__chameleon',
        compact && 'chameleon-shell__chameleon--compact',
        executiveSkin && 'chameleon-shell__chameleon--executive',
      )}
      aria-label="Chameleon Supermodule"
    >
      {executiveSkin || !compact ? (
        <div
          className={clsx(
            'chameleon-shell__zone-nav',
            'chameleon-shell__zone-nav--inline',
            executiveSkin && 'chameleon-shell__zone-nav--exec',
          )}
        >
          {(['hjartat', 'vardagen', 'familjen'] as const).map((zoneId) => {
            const z = getChameleonZone(zoneId);
            return (
              <button
                key={zoneId}
                type="button"
                className={clsx(
                  'chameleon-shell__zone-btn chameleon-shell__zone-btn--compact min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                  executiveSkin && 'chameleon-shell__zone-btn--exec',
                  target.zone === zoneId && 'chameleon-shell__zone-btn--on',
                )}
                onClick={() => setZone(zoneId)}
                aria-pressed={target.zone === zoneId}
              >
                <span className="chameleon-shell__zone-label">{z.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div
        className={clsx(
          executiveSkin
            ? 'chameleon-shell__exec-card chameleon-shell__exec-card--chrome chameleon-shell__exec-chameleon-shell'
            : 'chameleon-shell__shell',
        )}
      >
        <p className={executiveSkin ? 'chameleon-shell__exec-label' : 'chameleon-shell__section-title'}>
          {executiveSkin ? 'Supermodul' : `${zoneDef.label} — chameleon`}
        </p>
        {!executiveSkin ? (
          <p className="chameleon-shell__hint mt-1">
            Riktiga delegates · morph 350ms · samma Firebase som prod
          </p>
        ) : (
          <p className="chameleon-shell__exec-chameleon-lead">
            {zoneDef.label} · morph 350ms · live delegate
          </p>
        )}

        <div
          className={clsx('chameleon-shell__mode-row', executiveSkin && 'chameleon-shell__mode-row--exec')}
          role="tablist"
        >
          {zoneDef.modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={displayed.mode === mode.id}
              className={clsx(
                executiveSkin ? 'chameleon-shell__exec-mode-pill' : 'chameleon-shell__mode-btn',
                'min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
                displayed.mode === mode.id &&
                  (executiveSkin
                    ? 'chameleon-shell__exec-mode-pill--on'
                    : 'chameleon-shell__mode-btn--on'),
              )}
              onClick={() => setMode(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div
          className={clsx(
            'chameleon-shell__delegate-viewport calm-scroll-island',
            executiveSkin && 'chameleon-shell__delegate-viewport--exec',
            fading && 'chameleon-shell__delegate-viewport--morph',
          )}
        >
          <ChameleonDelegateBody target={displayed} />
        </div>
      </div>
    </div>
  );
}
