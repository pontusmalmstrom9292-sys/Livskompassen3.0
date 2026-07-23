import { useEffect, useRef, useState } from 'react';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetCard } from '../components/WidgetCard';
import { WidgetHeader } from '../components/WidgetHeader';
import { WidgetProgress } from '../components/WidgetProgress';
import {
  createLongPressController,
  dispatchWidgetGesture,
} from '../core/WidgetActions';
import { playCompassRotate, setBreatheActive } from '../core/WidgetAnimations';
import { getCached, setCached } from '../core/WidgetCache';
import { finishCompanionCapture } from '../core/finishCompanionCapture';
import { useCompanionOnline } from '../core/useCompanionOnline';
import { queueWidgetSync } from '../core/WidgetSync';
import { routeWidgetAction } from '../core/WidgetRouter';
import { useStudioWidgetConfig } from '../studio/useStudioWidgetConfig';
import { widgetCardClass } from '../studio/studioIdleClass';
import { resolveDayPeriod, type DayPeriod } from '../smart/smartTimeContext';
import { FacetedCompassRose } from '../art/FacetedCompassRose';

const WIDGET_ID = 'compass';

const CHECKINS: { id: DayPeriod | 'now'; label: string }[] = [
  { id: 'morning', label: 'Morgon' },
  { id: 'midday', label: 'Dag' },
  { id: 'evening', label: 'Kväll' },
  { id: 'now', label: 'Nu' },
];

const QUICK_MENU: { label: string; moduleKey: string }[] = [
  { label: 'Inkast', moduleKey: 'inkast' },
  { label: 'Dagbok', moduleKey: 'dagbok' },
  { label: 'Hamn', moduleKey: 'hamn' },
  { label: 'Planering', moduleKey: 'planering' },
];

const INTENTIONS: Record<string, string> = {
  morning: 'Närvaro i det jag gör',
  midday: 'Ett steg i taget',
  evening: 'Lugn avslutning',
  night: 'Vila utan krav',
  now: 'Närvaro i det jag gör',
};

function CompassGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      <path d="m12 7 2.2 5.2L12 17l-2.2-4.8L12 7z" fill="currentColor" opacity="0.85" />
    </svg>
  );
}

/**
 * Kompassen — check-in i widgeten + öppna modul (bible 4.2 / 6.3).
 * Mockup: guldring + cyan bloom + intention-CTA.
 */
export function CompassWidget({ pulseHint = false }: { pulseHint?: boolean }) {
  const roseRef = useRef<HTMLDivElement>(null);
  const roseBtnRef = useRef<HTMLButtonElement>(null);
  const cfg = useStudioWidgetConfig(WIDGET_ID);
  const size = cfg?.size ?? 'large';
  const animation = cfg?.animation ?? 'slow_rotate';
  const period = resolveDayPeriod();
  const [picked, setPicked] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const online = useCompanionOnline();
  const intention = INTENTIONS[picked ?? period] ?? INTENTIONS.now;
  const progress = picked ? 86 : period === 'morning' ? 42 : period === 'evening' ? 78 : 72;

  useEffect(() => {
    if (animation === 'breathe') setBreatheActive(roseRef.current, true);
    return () => setBreatheActive(roseRef.current, false);
  }, [animation]);

  const checkIn = async (id: string) => {
    playCompassRotate(roseRef.current);
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'primary' });
    setPicked(id);
    const label = CHECKINS.find((c) => c.id === id)?.label ?? id;
    const payload = {
      type: 'capture',
      source: 'widget_compass_checkin',
      period: id === 'now' ? period : id,
      text: `Kompass-checkin: ${label}`,
      silo: 'mabra' as const,
      at: Date.now(),
    };
    await setCached(`widget:${WIDGET_ID}:last`, payload);
    await queueWidgetSync({ type: 'capture', source: 'widget_compass_checkin', payload });
    finishCompanionCapture(setStatus, `${label} sparad`, { androidScope: 'compass' });
  };

  const openModule = async (moduleKey?: string) => {
    playCompassRotate(roseRef.current);
    const key = moduleKey ?? cfg?.moduleKey ?? 'kompass';
    await dispatchWidgetGesture({
      widgetId: WIDGET_ID,
      gesture: moduleKey ? 'longPress' : 'tap',
      action: 'open_module',
    });
    setMenuOpen(false);
    await routeWidgetAction(
      {
        widgetId: WIDGET_ID,
        action: 'open_module',
        detail: { moduleKey: key },
      },
      { moduleKey: key },
    );
  };

  const setIntention = async () => {
    await checkIn('now');
    await openModule('kompass');
  };

  useEffect(() => {
    const last = getCached<{ period?: string }>(`widget:${WIDGET_ID}:last`);
    if (last?.period) setPicked(String(last.period) === period ? 'now' : String(last.period));
  }, [period]);

  useEffect(() => {
    const el = roseBtnRef.current;
    if (!el) return;
    const ctl = createLongPressController({
      widgetId: WIDGET_ID,
      ms: 480,
      onFire: () => {
        setMenuOpen(true);
        setStatus('Snabbmeny');
      },
    });
    const down = (e: PointerEvent) => ctl.onPointerDown(e);
    const up = () => ctl.onPointerUp();
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', ctl.onPointerCancel);
    return () => {
      ctl.dispose();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', ctl.onPointerCancel);
    };
  }, []);

  const discSize = size === 'large' ? 152 : 128;
  const roseAngle =
    (picked ?? period) === 'morning'
      ? 12
      : (picked ?? period) === 'midday'
        ? 78
        : (picked ?? period) === 'evening'
          ? 168
          : (picked ?? period) === 'night'
            ? 248
            : 28;

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
        title="Dagens fokus"
        subtitle={status ?? (menuOpen ? 'Välj riktning' : 'Din kompass för idag')}
        offline={!online}
        icon={<CompassGlyph />}
      />
      <div className="cw-pack-stage" style={{ minHeight: size === 'large' ? 168 : 148 }}>
        <div className="cw-pack-stage__glow" aria-hidden />
        <button
          ref={roseBtnRef}
          className="cw-compass-rose-btn cw-metric-hit cw-metric-hit--ring min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          type="button"
          aria-label="Öppna kompassen"
          onClick={() => {
            if (menuOpen) {
              setMenuOpen(false);
              setStatus(null);
              return;
            }
            void openModule();
          }}
        >
          <div
            ref={roseRef}
            className="cw-compass-disc cw-compass-disc--hero"
            style={{ width: discSize, height: discSize }}
          >
            <FacetedCompassRose angle={roseAngle} size={discSize} className="cw-compass-rose-art" />
          </div>
        </button>
      </div>
      <div className="cw-intention-block">
        <p className="cw-intention-block__label">Fokus för idag</p>
        <p className="cw-intention-block__text">{intention}</p>
        <WidgetProgress value={progress} label="Dagens fokus" />
      </div>
      {menuOpen ? (
        <div className="cw-pill-row" role="menu" aria-label="Kompass snabbmeny">
          {QUICK_MENU.map((item) => (
            <button
              key={item.moduleKey}
              type="button"
              className="cw-pill cw-pill--active min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              onClick={() => void openModule(item.moduleKey)}
            >
              {item.label}
            </button>
          ))}
          <WidgetButton
            variant="ghost"
            size="min"
            onClick={() => {
              setMenuOpen(false);
              setStatus(null);
            }}
          >
            Stäng
          </WidgetButton>
        </div>
      ) : (
        <div className="cw-pill-row" role="group" aria-label="Check-in">
          {CHECKINS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={[
                'cw-pill',
                (picked === c.id || (!picked && c.id === period)) && 'cw-pill--active',
                pulseHint && !menuOpen && c.id === 'now' && 'cw-pulse-cta',
                'min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => void checkIn(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
      <WidgetButton
        variant="gold"
        size="premium"
        fullWidth
        className={pulseHint && !menuOpen ? 'cw-pulse-cta' : undefined}
        onClick={() => void setIntention()}
      >
        Sätt intention
      </WidgetButton>
      <div className="cw-trust-row" aria-live="polite">
        {status ?? (online ? 'Håll för snabbmeny · lugnt' : 'Offline — sparas lokalt')}
      </div>
    </WidgetCard>
  );
}
