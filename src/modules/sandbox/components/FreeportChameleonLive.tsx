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
import { getFreeportZone, type FreeportZoneId } from '../freeportZones';
import {
  getDefaultTarget,
  type FreeportChameleonTarget,
} from '../freeportChameleonBridge';
import { useFreeportMorph } from '../hooks/useFreeportMorph';

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
  target: FreeportChameleonTarget;
  onTargetChange?: (target: FreeportChameleonTarget) => void;
  onStatus?: (msg: string) => void;
  compact?: boolean;
  /** Executive chrome v3 — skin only, delegates oförändrade */
  executiveSkin?: boolean;
};

function DelegateFallback() {
  return <p className="design-freeport__hint p-3">Laddar läge…</p>;
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
        return <p className="design-freeport__hint text-sm">Logga in för inkast med granskning.</p>;
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

function ChameleonDelegateBody({ target }: { target: FreeportChameleonTarget }) {
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

function moduleForMode(zone: FreeportZoneId, modeId: string): FreeportChameleonTarget['module'] {
  if (zone === 'hjartat') return 'dagbok';
  if (zone === 'familjen') return 'familjen';
  if (modeId === 'checkin' || modeId === 'vit_card' || modeId === 'reflection_tool') return 'mabra';
  return 'planering';
}

/** Chameleon Supermodule — riktiga delegates, morph 350 ms. */
export function FreeportChameleonLive({
  target,
  onTargetChange,
  onStatus,
  compact = false,
  executiveSkin = false,
}: Props) {
  const zoneDef = getFreeportZone(target.zone);
  const { displayed, fading, morphTo } = useFreeportMorph(target);

  useEffect(() => {
    morphTo(target);
  }, [target, morphTo]);

  const setMode = useCallback(
    (modeId: string) => {
      const module = moduleForMode(target.zone, modeId);
      const next: FreeportChameleonTarget = { zone: target.zone, module, mode: modeId };
      onTargetChange?.(next);
      onStatus?.(`Mode: ${modeId}`);
    },
    [onStatus, onTargetChange, target.zone],
  );

  const setZone = useCallback(
    (zone: FreeportZoneId) => {
      const next = getDefaultTarget(zone);
      onTargetChange?.(next);
      onStatus?.(`Zon: ${getFreeportZone(zone).label}`);
    },
    [onStatus, onTargetChange],
  );

  return (
    <div
      className={clsx(
        'design-freeport__chameleon',
        compact && 'design-freeport__chameleon--compact',
        executiveSkin && 'design-freeport__chameleon--executive',
      )}
      aria-label="Chameleon Supermodule"
    >
      {executiveSkin || !compact ? (
        <div
          className={clsx(
            'design-freeport__zone-nav',
            'design-freeport__zone-nav--inline',
            executiveSkin && 'design-freeport__zone-nav--exec',
          )}
        >
          {(['hjartat', 'vardagen', 'familjen'] as const).map((zoneId) => {
            const z = getFreeportZone(zoneId);
            return (
              <button
                key={zoneId}
                type="button"
                className={clsx(
                  'design-freeport__zone-btn design-freeport__zone-btn--compact',
                  executiveSkin && 'design-freeport__zone-btn--exec',
                  target.zone === zoneId && 'design-freeport__zone-btn--on',
                )}
                onClick={() => setZone(zoneId)}
              >
                <span className="design-freeport__zone-label">{z.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      <div
        className={clsx(
          executiveSkin
            ? 'design-freeport__exec-card design-freeport__exec-card--chrome design-freeport__exec-chameleon-shell'
            : 'design-freeport__shell',
        )}
      >
        <p className={executiveSkin ? 'design-freeport__exec-label' : 'design-freeport__section-title'}>
          {executiveSkin ? 'Supermodul' : `${zoneDef.label} — chameleon`}
        </p>
        {!executiveSkin ? (
          <p className="design-freeport__hint mt-1">
            Riktiga delegates · morph 350ms · samma Firebase som prod
          </p>
        ) : (
          <p className="design-freeport__exec-chameleon-lead">
            {zoneDef.label} · morph 350ms · live delegate
          </p>
        )}

        <div
          className={clsx('design-freeport__mode-row', executiveSkin && 'design-freeport__mode-row--exec')}
          role="tablist"
        >
          {zoneDef.modes.map((mode) => (
            <button
              key={mode.id}
              type="button"
              role="tab"
              aria-selected={displayed.mode === mode.id}
              className={clsx(
                executiveSkin ? 'design-freeport__exec-mode-pill' : 'design-freeport__mode-btn',
                displayed.mode === mode.id &&
                  (executiveSkin
                    ? 'design-freeport__exec-mode-pill--on'
                    : 'design-freeport__mode-btn--on'),
              )}
              onClick={() => setMode(mode.id)}
            >
              {mode.label}
            </button>
          ))}
        </div>

        <div
          className={clsx(
            'design-freeport__delegate-viewport calm-scroll-island',
            executiveSkin && 'design-freeport__delegate-viewport--exec',
            fading && 'design-freeport__delegate-viewport--morph',
          )}
        >
          <ChameleonDelegateBody target={displayed} />
        </div>
      </div>
    </div>
  );
}
