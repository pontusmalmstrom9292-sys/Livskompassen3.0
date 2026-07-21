import { useState } from 'react';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetCard } from '../components/WidgetCard';
import { WidgetHeader } from '../components/WidgetHeader';
import { dispatchWidgetGesture, triggerWidgetHaptic } from '../core/WidgetActions';
import { getCached, setCached } from '../core/WidgetCache';
import { finishCompanionCapture } from '../core/finishCompanionCapture';
import { useCompanionOnline } from '../core/useCompanionOnline';
import { queueWidgetSync } from '../core/WidgetSync';
import { WidgetPalette } from '../core/WidgetTheme';
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

/**
 * Dagens Ankare — one micro-step (bible 4.2).
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
      className={[widgetCardClass(cfg?.animation, justDone && 'cw-check-burst'), pulseHint ? 'cw-soft-focus' : ''].filter(Boolean).join(' ')}
      data-widget={WIDGET_ID}
    >
      <WidgetHeader
        title="Dagens ankare"
        subtitle={status ?? (done ? 'Klart idag' : 'Ett lugnt mikrosteg')}
        offline={!online}
      />
      <div style={{ display: 'grid', placeItems: 'center', gap: '0.55rem', flex: 1, textAlign: 'center' }}>
        <span
          style={{
            fontSize: '1.85rem',
            filter: `drop-shadow(0 0 10px color-mix(in srgb, ${WidgetPalette.premiumGold} 35%, transparent))`,
          }}
          aria-hidden
        >
          ⚓
        </span>
        <p style={{ margin: 0, color: WidgetPalette.mutedText, fontSize: '0.9rem' }}>
          {done ? 'Du klarade dagens ankare.' : 'Ett mikrosteg räcker'}
        </p>
        {done ? (
          <span
            className={justDone ? 'cw-check-burst' : 'cw-anim-open'}
            style={{ color: WidgetPalette.premiumGoldLight, fontSize: '1.1rem' }}
            aria-live="polite"
          >
            ✓ Klart
          </span>
        ) : (
          <WidgetButton
            variant="gold"
            size="premium"
            className={pulseHint && !done ? 'cw-pulse-cta' : undefined}
            onClick={() => void complete()}
          >
            Klar
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
