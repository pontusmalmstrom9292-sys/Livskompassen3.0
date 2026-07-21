import { useEffect, useRef, useState } from 'react';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetCard } from '../components/WidgetCard';
import { WidgetHeader } from '../components/WidgetHeader';
import { dispatchWidgetGesture, triggerWidgetHaptic } from '../core/WidgetActions';
import { setBreatheActive } from '../core/WidgetAnimations';
import { getCached, setCached } from '../core/WidgetCache';
import { finishCompanionCapture } from '../core/finishCompanionCapture';
import { useCompanionOnline } from '../core/useCompanionOnline';
import { queueWidgetSync } from '../core/WidgetSync';
import { routeWidgetAction } from '../core/WidgetRouter';
import { WidgetPalette, WidgetMaterial } from '../core/WidgetTheme';
import { useStudioWidgetConfig } from '../studio/useStudioWidgetConfig';
import { widgetCardClass } from '../studio/studioIdleClass';

const WIDGET_ID = 'safe_harbor';

const AFFIRMATIONS = [
  'Du behöver inte lösa allt nu.',
  'Ett andetag. Sedan nästa.',
  'Du är en trygg hamn för dig själv.',
  'Det räcker att vara här.',
  'Lugn är också en handling.',
];

function pickAffirmation(index: number): string {
  return AFFIRMATIONS[index % AFFIRMATIONS.length] ?? AFFIRMATIONS[0];
}

function initialIndex(): number {
  const cached = getCached<{ affirmation?: string; index?: number }>(
    `widget:${WIDGET_ID}:last`,
  );
  if (typeof cached?.index === 'number') {
    return ((cached.index % AFFIRMATIONS.length) + AFFIRMATIONS.length) % AFFIRMATIONS.length;
  }
  if (cached?.affirmation) {
    const found = AFFIRMATIONS.indexOf(cached.affirmation);
    if (found >= 0) return found;
  }
  const daySeed = Math.floor(Date.now() / 86_400_000);
  return daySeed % AFFIRMATIONS.length;
}

/**
 * Trygg Hamn — lotus + mening + andas-mikrosteg (bible 4.2 / 6.3).
 */
export function SafeHarborWidget({
  text,
  pulseHint = false,
}: {
  text?: string;
  pulseHint?: boolean;
}) {
  const cfg = useStudioWidgetConfig(WIDGET_ID);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(initialIndex);
  const [status, setStatus] = useState<string | null>(null);
  const [breathing, setBreathing] = useState(false);
  const line = text ?? pickAffirmation(index);
  const breathe = (cfg?.animation ?? 'breathe') === 'breathe';
  const online = useCompanionOnline();

  useEffect(() => {
    setBreatheActive(bodyRef.current, breathe || breathing);
    return () => setBreatheActive(bodyRef.current, false);
  }, [breathe, breathing]);

  const cycle = async () => {
    triggerWidgetHaptic('light');
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'primary' });
    const next = (index + 1) % AFFIRMATIONS.length;
    setIndex(next);
    await setCached(`widget:${WIDGET_ID}:last`, {
      affirmation: pickAffirmation(next),
      index: next,
      at: Date.now(),
    });
  };

  const breatheOnce = async () => {
    if (breathing) return;
    triggerWidgetHaptic('softFade');
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'complete' });
    setBreathing(true);
    setStatus('Andas in…');
    await setCached(`widget:${WIDGET_ID}:breath`, { at: Date.now() });
    await queueWidgetSync({
      type: 'complete',
      source: 'widget_harbor_breath',
      payload: {
        text: 'Hamn · ett andetag',
        silo: 'hamn',
        at: Date.now(),
      },
    });
    window.setTimeout(() => setStatus('Andas ut…'), 2200);
    window.setTimeout(() => {
      setBreathing(false);
      finishCompanionCapture(setStatus, 'Lugnare', { clearMs: 1600, androidScope: 'harbor' });
    }, 4400);
  };

  const open = async () => {
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'open_module' });
    await routeWidgetAction(
      {
        widgetId: WIDGET_ID,
        action: 'open_module',
        detail: { moduleKey: cfg?.moduleKey ?? 'hamn' },
      },
      { moduleKey: cfg?.moduleKey ?? 'hamn' },
    );
  };

  return (
    <WidgetCard
      size={cfg?.size ?? 'small'}
      material={cfg?.material ?? 'sapphire'}
      className={[widgetCardClass(cfg?.animation), pulseHint ? 'cw-soft-focus' : ''].filter(Boolean).join(' ')}
      data-widget={WIDGET_ID}
    >
      <WidgetHeader
        title="Trygg Hamn"
        subtitle={status ?? 'Tryck · nästa lugna mening'}
        offline={!online}
        icon={<span aria-hidden>❤️</span>}
      />
      <button
        type="button"
        className="cw-row-hit"
        onClick={() => void cycle()}
        aria-label="Byt mening"
        style={{
          width: '100%',
          flex: 1,
          padding: 0,
        }}
      >
        <div
          ref={bodyRef}
          className={breathing ? 'cw-lotus-wrap cw-anim-breathe' : 'cw-lotus-wrap'}
          style={{
            padding: '1rem',
            borderRadius: 16,
            background: WidgetMaterial.glassFillStrong,
            boxShadow: WidgetMaterial.insetShadow,
            border: `1px solid color-mix(in srgb, ${WidgetPalette.premiumGold} 18%, transparent)`,
            minHeight: 108,
            display: 'grid',
            gap: '0.65rem',
            placeItems: 'center',
          }}
        >
          <svg
            className="cw-lotus"
            width="56"
            height="56"
            viewBox="0 0 64 64"
            aria-hidden
          >
            <defs>
              <linearGradient id="cw-lotus-gold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={WidgetPalette.premiumGoldLight} />
                <stop offset="100%" stopColor={WidgetPalette.premiumGold} />
              </linearGradient>
              <radialGradient id="cw-lotus-core" cx="50%" cy="55%" r="45%">
                <stop offset="0%" stopColor={WidgetPalette.etherealBlue} stopOpacity="0.55" />
                <stop offset="100%" stopColor={WidgetPalette.deepSpaceBlue} stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="32" cy="34" r="18" fill="url(#cw-lotus-core)" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <ellipse
                key={deg}
                cx="32"
                cy="22"
                rx="7"
                ry="14"
                fill="url(#cw-lotus-gold)"
                opacity={0.72}
                transform={`rotate(${deg} 32 34)`}
              />
            ))}
            <circle cx="32" cy="34" r="5" fill={WidgetPalette.deepSpaceBlue} stroke={WidgetPalette.premiumGold} strokeWidth="1.2" />
          </svg>
          <p
            style={{
              margin: 0,
              color: WidgetPalette.mutedText,
              fontSize: '1.02rem',
              lineHeight: 1.55,
              textAlign: 'center',
            }}
          >
            {line}
          </p>
        </div>
      </button>
      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap' }}>
        <WidgetButton
          variant="ethereal"
          size="min"
          className={pulseHint && !breathing ? 'cw-pulse-cta' : undefined}
          onClick={() => void breatheOnce()}
          disabled={breathing}
        >
          {breathing ? 'Andas…' : 'Andas'}
        </WidgetButton>
        <WidgetButton variant="quiet" size="min" onClick={() => void cycle()}>
          Byt mening
        </WidgetButton>
        <WidgetButton variant="gold" size="min" fullWidth onClick={() => void open()}>
          Öppna Hamn
        </WidgetButton>
      </div>
      <div className="cw-trust-row" aria-live="polite">
        {status ?? (online ? 'Andas här · ingen press' : 'Offline — sparas lokalt')}
      </div>
    </WidgetCard>
  );
}
