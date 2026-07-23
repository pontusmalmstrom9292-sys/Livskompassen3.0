import { useEffect, useState } from 'react';
import { WidgetPalette, WidgetTouch } from '../core/WidgetTheme';
import { triggerWidgetHaptic } from '../core/WidgetActions';
import { useWidgetSyncStatus } from '../core/useWidgetSyncStatus';

/**
 * Quiet sync chip — shows pending queue / offline / error (bible 3.4).
 * Tap retries flush. aria-live for screen readers.
 */
export function WidgetSyncStatusChip() {
  const { pending, flushing, lastError, lastFlushAt, retry } = useWidgetSyncStatus();
  const [, setTick] = useState(0);
  const [tapped, setTapped] = useState(false);
  const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
  const recentlyOk =
    !pending &&
    !flushing &&
    !lastError &&
    !offline &&
    typeof lastFlushAt === 'number' &&
    Date.now() - lastFlushAt < 4000;

  useEffect(() => {
    if (!lastFlushAt) return;
    const left = 4000 - (Date.now() - lastFlushAt);
    if (left <= 0) return;
    const t = window.setTimeout(() => setTick((n) => n + 1), left + 40);
    return () => window.clearTimeout(t);
  }, [lastFlushAt]);

  useEffect(() => {
    if (!tapped) return;
    const t = window.setTimeout(() => setTapped(false), 1600);
    return () => window.clearTimeout(t);
  }, [tapped]);

  if (!pending && !flushing && !lastError && !offline && !recentlyOk && !tapped) return null;

  const label = offline
    ? `Offline · ${pending || 0} köade`
    : flushing || tapped
      ? 'Synkar…'
      : lastError
        ? 'Synk misslyckades — tryck'
        : recentlyOk
          ? 'Synkat'
          : `${pending} väntar på synk`;

  return (
    <button
      type="button"
      disabled={flushing}
      onClick={() => {
        if (flushing) return;
        triggerWidgetHaptic('light');
        setTapped(true);
        void retry();
      }}
      aria-label={label}
      aria-busy={flushing || tapped}
      aria-live="polite"
      title={lastError ?? label}
      style={{
        border: `1px solid color-mix(in srgb, ${WidgetPalette.premiumGold} 28%, transparent)`,
        background: WidgetPalette.deepSpaceBlue,
        color: recentlyOk ? WidgetPalette.premiumGoldLight : WidgetPalette.mutedText,
        borderRadius: 999,
        padding: '0.35rem 0.7rem',
        fontSize: '0.72rem',
        letterSpacing: '0.04em',
        cursor: flushing ? 'wait' : 'pointer',
        minHeight: WidgetTouch.minDp,
        opacity: flushing ? 0.85 : 1,
      }}
    >
      {label}
    </button>
  );
}
