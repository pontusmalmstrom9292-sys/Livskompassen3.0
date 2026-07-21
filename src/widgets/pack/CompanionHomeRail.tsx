/** @locked MOD-WIDGET — låst modul; unlock via docs/evaluations/*-unlock-MOD-WIDGET.md
 *
 * Companion home rail — max 2 featured widgets (smart surface).
 * Calm, optional, offline-first boot. Live cache → AI signals.
 */

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { EmptyState } from '@/core/ui/EmptyState';
import '../companion-widgets.css';
import { WidgetSyncStatusChip } from '../components/WidgetSyncStatusChip';
import { WidgetButton } from '../components/WidgetButton';
import { bootCompanionSurface } from '../core/bootCompanionSurface';
import { subscribeWidgetCache } from '../core/WidgetCache';
import { setWidgetModuleNavigator } from '../core/WidgetRouter';
import { useCompanionSurface } from '../smart/useCompanionSurface';
import { readCompanionAiSignals } from '../smart/readCompanionSignals';
import {
  getWidgetStudioState,
  hydrateWidgetStudio,
  patchWidgetStudioConfig,
  subscribeWidgetStudio,
} from '../studio/widgetStudioStore';
import { BeaconWidget } from './BeaconWidget';
import { ChildFocusWidget } from './ChildFocusWidget';
import { CompanionDailyTasksHost } from './CompanionDailyTasksHost';
import { CompassWidget } from './CompassWidget';
import { DailyAnchorWidget } from './DailyAnchorWidget';
import { InboxWidget } from './InboxWidget';
import { JournalWidget } from './JournalWidget';
import { QuickCaptureWidget } from './QuickCaptureWidget';
import { QuickNoteWidget } from './QuickNoteWidget';
import { SafeHarborWidget } from './SafeHarborWidget';

const WIDGET_MAP = {
  quick_capture: QuickCaptureWidget,
  compass: CompassWidget,
  quick_note: QuickNoteWidget,
  inbox: InboxWidget,
  daily_anchor: DailyAnchorWidget,
  child_focus: ChildFocusWidget,
  beacon: BeaconWidget,
  daily_tasks: CompanionDailyTasksHost,
  journal: JournalWidget,
  safe_harbor: SafeHarborWidget,
} as const;

const ROOT_ID = 'cw-home-rail-root';
const COLLAPSE_KEY = 'cw_home_rail_collapsed';

function readCollapsed(): boolean {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Shows up to two Companion widgets based on time/AI Studio settings.
 */
function CompanionHomeRailBody({ max = 2 }: { max?: number }) {
  const navigate = useNavigate();
  const [signals, setSignals] = useState(() => readCompanionAiSignals());
  const surface = useCompanionSurface(signals);
  const [ready, setReady] = useState(false);
  const [studioTick, setStudioTick] = useState(0);
  const [collapsed, setCollapsed] = useState(readCollapsed);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0');
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  useEffect(() => {
    setWidgetModuleNavigator((path) => {
      navigate(path);
    });
    bootCompanionSurface(ROOT_ID);
    void hydrateWidgetStudio().then(() => {
      setSignals(readCompanionAiSignals());
      setReady(true);
    });

    const refreshSignals = () => {
      setSignals(readCompanionAiSignals());
    };

    const unsubCache = subscribeWidgetCache(() => refreshSignals());
    const unsubStudio = subscribeWidgetStudio(() => {
      setStudioTick((n) => n + 1);
      refreshSignals();
    });
    const onVis = () => {
      if (document.visibilityState === 'visible') refreshSignals();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      unsubCache();
      unsubStudio();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [navigate]);

  const featured = useMemo(() => {
    const ids = (
      surface.featuredWidgetIds.length
        ? surface.featuredWidgetIds
        : surface.visibleWidgetIds
    ).filter((id) => id in WIDGET_MAP);
    return ids.slice(0, Math.max(1, Math.min(2, max)));
  }, [surface.featuredWidgetIds, surface.visibleWidgetIds, max]);

  return (
    <section
      id={ROOT_ID}
      className="cw-home-rail"
      aria-label="Companion just nu"
      style={{
        display: 'grid',
        gap: '0.75rem',
        opacity: surface.dimVisual ? 0.88 : 1,
      }}
    >
      <div className="cw-home-rail__head">
        <p className="cw-home-rail__title">
          <span>Companion · {surface.time.focusLabel}</span>
          {surface.smartTimeEnabled ? (
            <span
              className="cw-mode-badge cw-mode-badge--period"
              aria-label={`Tid ${surface.period}`}
            >
              {surface.period === 'morning'
                ? 'Morgon'
                : surface.period === 'midday'
                  ? 'Dag'
                  : surface.period === 'evening'
                    ? 'Kväll'
                    : 'Natt'}
            </span>
          ) : null}
          {surface.smartAiEnabled && surface.mode !== 'normal' ? (
            <span className="cw-mode-badge" aria-label={`Läge ${surface.mode}`}>
              {surface.mode === 'harbor'
                ? 'Hamn'
                : surface.mode === 'anchor_only'
                  ? 'Ankare'
                  : surface.mode === 'single_task'
                    ? 'Ett steg'
                    : surface.mode === 'family'
                      ? 'Barn'
                      : surface.mode}
            </span>
          ) : null}
        </p>
        <div className="cw-home-rail__actions">
          <WidgetSyncStatusChip />
          <button
            type="button"
            className="cw-chrome-btn"
            onClick={toggleCollapsed}
            aria-expanded={!collapsed}
            aria-controls="cw-home-rail-body"
          >
            {collapsed ? 'Visa' : 'Dölj'}
          </button>
          <Link to="/installningar/widget-studio" className="cw-chrome-link cw-chrome-link--gold">
            Studio
          </Link>
          {import.meta.env.DEV ? (
            <Link to="/dev/companion-widgets" className="cw-chrome-link">
              Labb
            </Link>
          ) : null}
        </div>
      </div>
      {collapsed ? (
        <button
          type="button"
          id="cw-home-rail-body"
          className="cw-home-rail-collapsed"
          onClick={toggleCollapsed}
        >
          {ready
            ? featured.length > 0
              ? `${featured.length} widget${featured.length === 1 ? '' : 's'} vilande · Visa`
              : 'Companion vilande · Visa eller öppna Studio'
            : 'Laddar…'}
        </button>
      ) : (
        <div id="cw-home-rail-body" className="cw-home-rail__body">
      {surface.banner || (surface.smartTimeEnabled && surface.time.message) ? (
        <p className="cw-home-rail__banner">
          {surface.banner || surface.time.message}
        </p>
      ) : null}
      {ready && featured.length === 0 ? (
        <EmptyState
          title="Companion"
          message="Inga Companion-widgets är på. Slå på två lugna defaults, eller öppna Studio."
          className="cw-empty"
          action={
            <div className="cw-empty__actions">
              <WidgetButton
                variant="gold"
                size="min"
                onClick={() => {
                  void (async () => {
                    await patchWidgetStudioConfig('quick_capture', { enabled: true });
                    await patchWidgetStudioConfig('safe_harbor', { enabled: true });
                    setSignals(readCompanionAiSignals());
                  })();
                }}
              >
                Slå på Capture + Hamn
              </WidgetButton>
              <Link to="/installningar/widget-studio" className="cw-chrome-link cw-chrome-link--gold">
                Öppna Studio
              </Link>
            </div>
          }
        />
      ) : null}
      {!ready ? (
        <p className="cw-home-rail__banner" aria-live="polite">
          Laddar Companion…
        </p>
      ) : null}
      {ready
        ? featured.map((id) => {
            const Comp = WIDGET_MAP[id as keyof typeof WIDGET_MAP];
            if (!Comp) return null;
            void studioTick;
            const pinned = getWidgetStudioState().widgets[id]?.homePin === true;
            const inner =
              id === 'daily_tasks' ? (
                <CompanionDailyTasksHost maxVisible={surface.mode === 'single_task' ? 1 : 2} />
              ) : (
                <Comp />
              );
            return (
              <div key={id} className="cw-home-pin-wrap" style={{ position: 'relative' }}>
                {pinned ? (
                  <span className="cw-home-pin-badge" aria-label="Fäst på Hem" title="Fäst på Hem">
                    ✦ Fäst
                  </span>
                ) : null}
                {inner}
              </div>
            );
          })
        : null}
        </div>
      )}
    </section>
  );
}

function CompanionHomeRailInner({ max = 2 }: { max?: number }) {
  return (
    <HubErrorBoundary
      title="Companion"
      logTag="companion-home-rail"
      glow="gold"
      backTo="/"
      backLabel="Hem"
      retryLabel="Försök igen"
    >
      <CompanionHomeRailBody max={max} />
    </HubErrorBoundary>
  );
}

/** Public export — error boundary around live rail. */
export function CompanionHomeRail({ max = 2 }: { max?: number }) {
  return <CompanionHomeRailInner max={max} />;
}
