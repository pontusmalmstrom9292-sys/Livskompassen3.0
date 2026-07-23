import { useEffect, useRef, useState } from 'react';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetCard } from '../components/WidgetCard';
import { WidgetHeader } from '../components/WidgetHeader';
import { WidgetProgress } from '../components/WidgetProgress';
import { dispatchWidgetGesture } from '../core/WidgetActions';
import { setBreatheActive } from '../core/WidgetAnimations';
import { getCached, setCached } from '../core/WidgetCache';
import { finishCompanionCapture } from '../core/finishCompanionCapture';
import { useCompanionOnline } from '../core/useCompanionOnline';
import { queueWidgetSync } from '../core/WidgetSync';
import { routeWidgetAction } from '../core/WidgetRouter';
import { useStudioWidgetConfig } from '../studio/useStudioWidgetConfig';
import { widgetCardClass } from '../studio/studioIdleClass';
import { getWidgetStudioConfig } from '../studio/widgetStudioStore';
import { LighthouseArtwork } from '../art/LighthouseArtwork';

const WIDGET_ID = 'beacon';

export type BeaconMetrics = {
  energy: number;
  stress: number;
  capacity: number;
  sleep: number;
};

const DEFAULT: BeaconMetrics = { energy: 72, stress: 35, capacity: 68, sleep: 67 };

type MetricKey = keyof BeaconMetrics;

function BeaconGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v4M9 9h6l1 3H8l1-3zM10 12v6M14 12v6M7 21h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="7.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

function capacityState(value: number): string {
  if (value >= 70) return 'Stabil';
  if (value >= 45) return 'Lugn';
  return 'Vila';
}

/**
 * Fyren — justera dagsform i widgeten (tryck på rad), spara lokalt + synk.
 * Mockup: capacity-ring + centrumtext + energi/fokus/återhämtning.
 */
export function BeaconWidget({
  metrics: initial,
  pulseHint = false,
}: {
  metrics?: BeaconMetrics;
  pulseHint?: boolean;
}) {
  const ringRef = useRef<HTMLDivElement>(null);
  const cfg = useStudioWidgetConfig(WIDGET_ID) ?? getWidgetStudioConfig(WIDGET_ID);
  const cached = getCached<BeaconMetrics>(`widget:${WIDGET_ID}:metrics`);
  const [metrics, setMetrics] = useState<BeaconMetrics>(cached ?? initial ?? DEFAULT);
  const [status, setStatus] = useState<string | null>(null);
  const online = useCompanionOnline();
  const info = cfg?.info ?? {
    showEnergy: true,
    showStress: true,
    showCapacity: true,
    showSleep: true,
  };
  const size = cfg?.size ?? 'medium';
  const breathe = (cfg?.animation ?? 'breathe') === 'breathe';
  const fokus = Math.max(5, Math.min(100, 100 - metrics.stress));

  useEffect(() => {
    setBreatheActive(ringRef.current, breathe);
    return () => setBreatheActive(ringRef.current, false);
  }, [breathe]);

  const nudge = async (key: MetricKey) => {
    await dispatchWidgetGesture({
      widgetId: WIDGET_ID,
      gesture: 'tap',
      action: 'primary',
      detail: { metric: key },
    });
    setMetrics((prev) => {
      const step = key === 'stress' ? -8 : 8;
      const nextVal = Math.max(5, Math.min(100, prev[key] + step));
      const next = { ...prev, [key]: nextVal };
      void setCached(`widget:${WIDGET_ID}:metrics`, next);
      return next;
    });
    setStatus('Hem uppdateras…');
    window.setTimeout(() => setStatus(null), 1200);
  };

  const save = async () => {
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'complete' });
    await setCached(`widget:${WIDGET_ID}:metrics`, metrics);
    await setCached(`widget:${WIDGET_ID}:last`, { ...metrics, at: Date.now() });
    await queueWidgetSync({
      type: 'capture',
      source: 'widget_beacon_checkin',
      payload: {
        ...metrics,
        text: `Dagsform · energi ${metrics.energy} · stress ${metrics.stress} · sömn ${metrics.sleep}`,
        silo: 'mabra',
        at: Date.now(),
      },
    });
    finishCompanionCapture(setStatus, 'Sparat', { androidScope: 'beacon' });
  };

  const open = async () => {
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'open_module' });
    await routeWidgetAction(
      { widgetId: WIDGET_ID, action: 'open_module', detail: { moduleKey: cfg?.moduleKey ?? 'fyren' } },
      { moduleKey: cfg?.moduleKey ?? 'fyren' },
    );
  };

  const sleepHours = 5 + Math.round((metrics.sleep / 100) * 4);
  const sleepMins = Math.round((metrics.sleep % 25) * 2.3);
  const sleepLabel = `${sleepHours}h ${String(sleepMins).padStart(2, '0')}m`;
  const rows = (
    [
      info.showEnergy ? (['energy', 'Energi', metrics.energy, metrics.energy >= 60 ? 'Bra' : 'Låg'] as const) : null,
      info.showStress
        ? ([
            'stress',
            'Stress',
            metrics.stress,
            metrics.stress <= 40 ? 'Låg' : metrics.stress <= 65 ? 'Måttlig' : 'Hög',
          ] as const)
        : null,
      info.showSleep ? (['sleep', 'Sömn', metrics.sleep, sleepLabel] as const) : null,
    ] as const
  ).filter(Boolean) as Array<readonly [MetricKey, string, number, string]>;

  return (
    <WidgetCard
      size={size}
      material={cfg?.material ?? 'sapphire'}
      className={[
        'cw-card--hero',
        widgetCardClass(cfg?.animation),
        pulseHint ? 'cw-soft-focus' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-widget={WIDGET_ID}
    >
      <WidgetHeader
        title="Fyren"
        subtitle={status ?? 'Din inre kompass för kapacitet och balans'}
        offline={!online}
        icon={<BeaconGlyph />}
      />
      <div className="cw-pack-stage cw-beacon-stage">
        <div className="cw-beacon-stage__art" aria-hidden>
          <LighthouseArtwork />
        </div>
        <div className="cw-pack-stage__glow" aria-hidden />
        {info.showCapacity ? (
          <button
            type="button"
            className="cw-metric-hit cw-metric-hit--ring cw-beacon-stage__ring min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            onClick={() => void nudge('capacity')}
            aria-label={`Justera kapacitet, nu ${metrics.capacity}`}
          >
            <div ref={ringRef} className="cw-capacity-ring" style={{ width: 112, height: 112 }}>
              <WidgetProgress variant="circular" value={metrics.capacity} label="Kapacitet" size={112} />
              <div className="cw-capacity-ring__center" aria-hidden>
                <span className="cw-capacity-ring__pct">{Math.round(metrics.capacity)}%</span>
                <span className="cw-capacity-ring__state">{capacityState(metrics.capacity)}</span>
              </div>
            </div>
          </button>
        ) : (
          <div ref={ringRef} />
        )}
      </div>
      <div className="cw-metric-stack cw-metric-stack--gs-row" role="group" aria-label="Dagsform">
        {rows.map(([key, label, value, display]) => (
          <button
            key={key}
            type="button"
            className={`cw-metric-hit cw-metric-hit--gs min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${key === 'energy' ? 'cw-metric-hit--ethereal' : key === 'stress' ? 'cw-metric-hit--gold' : ''}`}
            onClick={() => void nudge(key)}
            aria-label={`Justera ${label}, nu ${value}`}
          >
            <div className="cw-metric-label">
              <span>{label}</span>
              <span className="cw-metric-display">{display}</span>
            </div>
            <WidgetProgress value={key === 'stress' ? fokus : value} label={label} />
          </button>
        ))}
      </div>
      <div className="cw-glass-well cw-beacon-advice" aria-live="polite">
        <span className="cw-beacon-advice__label">Fyrens råd</span>
        <p className="cw-beacon-advice__body">
          {metrics.capacity >= 70
            ? 'Du är på rätt väg. Fortsätt lyfta blicken.'
            : metrics.capacity >= 45
              ? 'Håll tempot lugnt. Ett steg i taget räcker.'
              : 'Vila är också riktning. Skydda din energi idag.'}
        </p>
      </div>
      <div className="cw-actions-row">
        <WidgetButton
          variant="gold"
          size="premium"
          fullWidth
          className={pulseHint ? 'cw-pulse-cta' : undefined}
          onClick={() => void save()}
        >
          Spara
        </WidgetButton>
        <WidgetButton variant="ghost" size="min" onClick={() => void open()} aria-label="Visa mer i Fyren">
          Visa mer
        </WidgetButton>
      </div>
      <div className="cw-trust-row" aria-live="polite">
        {status ?? (online ? 'Ett tryck · Hem uppdateras' : 'Offline — sparas lokalt')}
      </div>
    </WidgetCard>
  );
}
