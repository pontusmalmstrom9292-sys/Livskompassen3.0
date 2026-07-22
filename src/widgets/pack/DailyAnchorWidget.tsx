import { useState } from 'react';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetCard } from '../components/WidgetCard';
import { WidgetHeader } from '../components/WidgetHeader';
import { dispatchWidgetGesture, triggerWidgetHaptic } from '../core/WidgetActions';
import { getCached, setCached } from '../core/WidgetCache';
import { finishCompanionCapture } from '../core/finishCompanionCapture';
import { useCompanionOnline } from '../core/useCompanionOnline';
import { queueWidgetSync } from '../core/WidgetSync';
import { useStudioWidgetConfig } from '../studio/useStudioWidgetConfig';
import { widgetCardClass } from '../studio/studioIdleClass';

const WIDGET_ID = 'daily_anchor';

function isSameLocalDay(ts: number): boolean {
  const a = new Date(ts);
  const b = new Date();
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function wasDoneToday(): boolean {
  const last = getCached<{ at?: number; type?: string }>(`widget:${WIDGET_ID}:last`);
  return Boolean(last?.at && isSameLocalDay(last.at));
}

function AnchorGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="6" r="2.2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 8v10M7 14c1.5 3 3.5 4.5 5 4.5s3.5-1.5 5-4.5M5 14h4M15 14h4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Dagens Ankare — one micro-step (bible 4.2).
 * Mockup: hero ankare + SÄTT INTENTION.
 */
export function DailyAnchorWidget({ pulseHint = false }: { pulseHint?: boolean }) {
  const cfg = useStudioWidgetConfig(WIDGET_ID);
  const [done, setDone] = useState(wasDoneToday);
  const [justDone, setJustDone] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const online = useCompanionOnline();

  const complete = async () => {
    if (done) return;
    triggerWidgetHaptic('light');
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'complete' });
    const payload = { type: 'complete', source: 'widget_anchor', at: Date.now(), doneToday: true };
    await setCached(`widget:${WIDGET_ID}:last`, payload);
    await queueWidgetSync({ type: 'complete', source: 'widget_anchor', payload });
    setDone(true);
    setJustDone(true);
    window.setTimeout(() => setJustDone(false), 1600);
    finishCompanionCapture(setStatus, 'Klart', { androidScope: 'anchor' });
  };

  return (
    <WidgetCard
      size={cfg?.size ?? 'xs'}
      material={cfg?.material ?? 'sapphire'}
      className={[
        'cw-card--hero',
        widgetCardClass(cfg?.animation, justDone && 'cw-check-burst'),
        pulseHint ? 'cw-soft-focus' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-widget={WIDGET_ID}
    >
      <WidgetHeader
        title="Dagens ankare"
        subtitle={status ?? (done ? 'Klart idag' : 'Ett lugnt mikrosteg')}
        offline={!online}
        icon={<AnchorGlyph />}
      />
      <div className="cw-anchor-hero">
        <span className="cw-anchor-hero__glyph" aria-hidden>
          ⚓
        </span>
        <p className="cw-intention-block__text" style={{ fontWeight: 500, fontSize: '0.95rem' }}>
          {done ? 'Du klarade dagens ankare.' : 'Sätt en lugn intention för dagen'}
        </p>
        {done ? (
          <span
            className={justDone ? 'cw-check-burst' : 'cw-anim-open'}
            style={{ color: 'var(--cw-gold-light, #fde68a)', fontSize: '1.1rem' }}
            aria-live="polite"
          >
            ✓ Klart
          </span>
        ) : (
          <WidgetButton
            variant="gold"
            size="premium"
            fullWidth
            className={pulseHint && !done ? 'cw-pulse-cta' : undefined}
            onClick={() => void complete()}
          >
            Sätt intention
          </WidgetButton>
        )}
      </div>
      <div className="cw-trust-row" aria-live="polite">
        {status ??
          (done
            ? online
              ? 'Bra. Vila här.'
              : 'Sparat lokalt'
            : online
              ? 'Ett mikrosteg räcker'
              : 'Offline — sparas lokalt')}
      </div>
    </WidgetCard>
  );
}
