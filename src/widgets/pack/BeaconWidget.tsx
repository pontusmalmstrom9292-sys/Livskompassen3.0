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

const WIDGET_ID = 'beacon';

export type BeaconMetrics = {
  energy: number;
  stress: number;
  capacity: number;
  sleep: number;
};

const DEFAULT: BeaconMetrics = { energy: 62, stress: 38, capacity: 55, sleep: 70 };

type MetricKey = keyof BeaconMetrics;

/**
 * Fyren — justera dagsform i widgeten (tryck på rad), spara lokalt + synk.
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
      /* Cache immediately so home rail AI reacts without waiting for Spara. */
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

  const rows = (
    [
      info.showEnergy ? (['energy', 'Energi', metrics.energy] as const) : null,
      info.showStress ? (['stress', 'Stress', metrics.stress] as const) : null,
      info.showSleep ? (['sleep', 'Sömn', metrics.sleep] as const) : null,
    ] as const
  ).filter(Boolean) as Array<readonly [MetricKey, string, number]>;

  return (
    <WidgetCard
      size={size}
      material={cfg?.material ?? 'sapphire'}
      className={[widgetCardClass(cfg?.animation), pulseHint ? 'cw-soft-focus' : ''].filter(Boolean).join(' ')}
      data-widget={WIDGET_ID}
    >
      <WidgetHeader
        title="Fyren"
        subtitle={status ?? 'Tryck en rad · justera lugnt'}
        offline={!online}
        icon={<span aria-hidden>💙</span>}
      />
      {info.showCapacity ? (
        <button
          type="button"
          className="cw-metric-hit cw-metric-hit--ring"
          onClick={() => void nudge('capacity')}
          aria-label={`Justera kapacitet, nu ${metrics.capacity}`}
        >
          <div ref={ringRef} style={{ position: 'relative', width: 96, height: 96 }}>
            <WidgetProgress variant="circular" value={metrics.capacity} label="Kapacitet" size={96} />
          </div>
        </button>
      ) : (
        <div ref={ringRef} />
      )}
      <div style={{ width: '100%', display: 'grid', gap: '0.55rem' }}>
        {rows.map(([key, label, value]) => (
          <button
            key={key}
            type="button"
            className="cw-metric-hit"
            onClick={() => void nudge(key)}
            aria-label={`Justera ${label}, nu ${value}`}
          >
            <div className="cw-metric-label">
              <span>{label}</span>
              <span>{value}</span>
            </div>
            <WidgetProgress value={value} label={label} />
          </button>
        ))}
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
        <WidgetButton variant="ghost" size="min" onClick={() => void open()} aria-label="Öppna Fyren">
          Öppna
        </WidgetButton>
      </div>
      <div className="cw-trust-row" aria-live="polite">
        {status ?? (online ? 'Ett tryck · Hem uppdateras' : 'Offline — sparas lokalt')}
      </div>
    </WidgetCard>
  );
}
