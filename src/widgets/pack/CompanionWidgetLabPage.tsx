import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../companion-widgets.css';
import { WidgetSyncStatusChip } from '../components/WidgetSyncStatusChip';
import { bootWidgetFramework, setFrameworkTransport } from '../core/WidgetFramework';
import { createCompanionSyncTransport } from '../core/companionSyncTransport';
import { softFocusWidgetControl } from '../core/softFocusWidgetControl';
import { setWidgetModuleNavigator } from '../core/WidgetRouter';
import { applyWidgetTheme, WidgetPalette } from '../core/WidgetTheme';
import { useCompanionSurface } from '../smart/useCompanionSurface';
import type { WidgetAiSignals } from '../smart/widgetAiContext';
import { DEFAULT_AI_SIGNALS } from '../smart/widgetAiContext';
import { hydrateWidgetStudio } from '../studio/widgetStudioStore';
import { BeaconWidget } from './BeaconWidget';
import { ChildFocusWidget } from './ChildFocusWidget';
import { CompassWidget } from './CompassWidget';
import { CompanionDailyTasksHost } from './CompanionDailyTasksHost';
import { DailyAnchorWidget } from './DailyAnchorWidget';
import { InboxWidget } from './InboxWidget';
import { JournalWidget } from './JournalWidget';
import { QuickCaptureWidget } from './QuickCaptureWidget';
import { QuickNoteWidget } from './QuickNoteWidget';
import { registerCorePack } from './registerCorePack';
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

type DemoPreset = 'normal' | 'stress' | 'overload' | 'barn' | 'low';

const DEMO_SIGNALS: Record<DemoPreset, WidgetAiSignals> = {
  normal: DEFAULT_AI_SIGNALS,
  stress: { ...DEFAULT_AI_SIGNALS, stress: 78, energy: 45 },
  overload: { ...DEFAULT_AI_SIGNALS, openTaskCount: 8 },
  barn: { ...DEFAULT_AI_SIGNALS, isBarnvecka: true },
  low: { ...DEFAULT_AI_SIGNALS, energy: 25, sleep: 35 },
};

/**
 * Dev lab — core pack + Kapitel 5 smart surface.
 */
export function CompanionWidgetLabPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [demo, setDemo] = useState<DemoPreset>('normal');
  const [pulseDemo, setPulseDemo] = useState(false);
  const signals = DEMO_SIGNALS[demo];
  const surface = useCompanionSurface(signals);

  useEffect(() => {
    const root = document.getElementById('cw-lab-root');
    applyWidgetTheme(root);
    setWidgetModuleNavigator((path) => {
      navigate(path);
    });
    registerCorePack();
    setFrameworkTransport(createCompanionSyncTransport());
    void (async () => {
      await hydrateWidgetStudio();
      await bootWidgetFramework({ root });
      setReady(true);
    })();
  }, [navigate]);

  const ordered = useMemo(
    () => surface.visibleWidgetIds.filter((id) => id in WIDGET_MAP),
    [surface.visibleWidgetIds],
  );

  useEffect(() => {
    if (!ready || ordered.length === 0) return;
    const first = ordered[0];
    return softFocusWidgetControl({
      rootSelector: '#cw-lab-root',
      focusSelector: `[data-widget="${first}"]`,
      attempts: 4,
      delayMs: 520,
    });
  }, [ready, ordered]);

  return (
    <div
      id="cw-lab-root"
      style={{
        minHeight: '100dvh',
        padding: '1.25rem 1rem 3rem',
        background: `radial-gradient(ellipse at top, #0b1220 0%, ${WidgetPalette.obsidian} 55%)`,
        color: WidgetPalette.textPrimary,
        opacity: surface.dimVisual ? 0.92 : 1,
        transition: 'opacity 480ms ease',
      }}
    >
      <header style={{ marginBottom: '1rem' }}>
        <p
          style={{
            margin: 0,
            fontSize: '0.7rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: WidgetPalette.premiumGold,
          }}
        >
          Companion Widget OS
        </p>
        <h1 style={{ margin: '0.35rem 0 0', fontSize: '1.35rem', fontWeight: 600 }}>
          Lab — smart yta
        </h1>
        <p style={{ margin: '0.4rem 0 0', color: WidgetPalette.mutedText, fontSize: '0.9rem' }}>
          {ready ? 'Motor igång' : 'Startar…'} · {surface.time.focusLabel}
          {surface.banner ? ` · ${surface.banner}` : ''}
        </p>
        <div
          style={{
            marginTop: '0.55rem',
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          {surface.mode !== 'normal' ? (
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
          <WidgetSyncStatusChip />
          <Link to="/installningar/widget-studio" style={{ color: WidgetPalette.premiumGold, fontSize: '0.8rem' }}>
            Widget Studio
          </Link>
          <Link to="/" style={{ color: WidgetPalette.mutedText, fontSize: '0.8rem' }}>
            Hem
          </Link>
        </div>
      </header>

      <div className="cw-pill-row" style={{ marginBottom: '1rem' }} role="group" aria-label="Demo AI-läge">
        {(
          [
            ['normal', 'Normalt'],
            ['stress', 'Hög stress'],
            ['overload', 'Överlast'],
            ['barn', 'Barnvecka'],
            ['low', 'Låg energi'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={['cw-pill', demo === id && 'cw-pill--active'].filter(Boolean).join(' ')}
            onClick={() => setDemo(id)}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          className={['cw-pill', pulseDemo && 'cw-pill--active'].filter(Boolean).join(' ')}
          onClick={() => setPulseDemo((v) => !v)}
          aria-pressed={pulseDemo}
        >
          Pulse CTA
        </button>
      </div>

      <div className="cw-lab-grid">
        {ordered.map((id) => {
          const Cmp = WIDGET_MAP[id as keyof typeof WIDGET_MAP];
          if (!Cmp) return null;
          const pulseHint = pulseDemo && ordered[0] === id;
          if (id === 'daily_tasks') {
            return (
              <CompanionDailyTasksHost
                key={id}
                maxVisible={surface.mode === 'single_task' ? 1 : 3}
                pulseHint={pulseHint}
              />
            );
          }
          if (id === 'beacon') {
            return (
              <BeaconWidget
                key={id}
                pulseHint={pulseHint}
                metrics={{
                  energy: signals.energy,
                  stress: signals.stress,
                  capacity: Math.round((signals.energy + (100 - signals.stress)) / 2),
                  sleep: signals.sleep,
                }}
              />
            );
          }
          return <Cmp key={id} pulseHint={pulseHint} />;
        })}
      </div>
      <p className="cw-signature">Designad för lugn, fokus och trygghet</p>
    </div>
  );
}
