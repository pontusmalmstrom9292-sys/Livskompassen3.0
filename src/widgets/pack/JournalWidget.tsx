import { useEffect, useState } from 'react';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetCard } from '../components/WidgetCard';
import { WidgetGlass } from '../components/WidgetGlass';
import { WidgetHeader } from '../components/WidgetHeader';
import {
  moodFaceLabel,
  WidgetMoodCheckIn,
  type MoodFaceId,
} from '../components/WidgetMoodCheckIn';
import { dispatchWidgetGesture } from '../core/WidgetActions';
import { getCached, setCached } from '../core/WidgetCache';
import { finishCompanionCapture } from '../core/finishCompanionCapture';
import { softFocusWidgetControl } from '../core/softFocusWidgetControl';
import { useCompanionOnline } from '../core/useCompanionOnline';
import { queueWidgetSync } from '../core/WidgetSync';
import { routeWidgetAction } from '../core/WidgetRouter';
import { WidgetPalette, WidgetTouch } from '../core/WidgetTheme';
import { useStudioWidgetConfig } from '../studio/useStudioWidgetConfig';
import { widgetCardClass } from '../studio/studioIdleClass';

const WIDGET_ID = 'journal';

/**
 * Dagbok — check-in faces + one-line write in-widget (bible 4.2 / 6.4).
 */
export function JournalWidget({ pulseHint = false }: { pulseHint?: boolean }) {
  const cfg = useStudioWidgetConfig(WIDGET_ID);
  const cached = getCached<{ mood?: MoodFaceId }>(`widget:${WIDGET_ID}:last`);
  const [mood, setMood] = useState<MoodFaceId | null>(cached?.mood ?? null);
  const [status, setStatus] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState('');
  const online = useCompanionOnline();

  useEffect(() => {
    if (!writing) return;
    return softFocusWidgetControl({
      rootSelector: `[data-widget="${WIDGET_ID}"]`,
      focusSelector: 'textarea[aria-label="Snabb dagboksrad"]',
      attempts: 3,
      delayMs: 60,
    });
  }, [writing]);

  const saveMood = async (id: MoodFaceId) => {
    setMood(id);
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'primary' });
    const payload = {
      type: 'capture',
      source: 'widget_journal_mood',
      mood: id,
      moodLabel: moodFaceLabel(id),
      text: `Känsla: ${moodFaceLabel(id)}`,
      silo: 'dagbok' as const,
      at: Date.now(),
    };
    await setCached(`widget:${WIDGET_ID}:last`, payload);
    await queueWidgetSync({ type: 'capture', source: 'widget_journal_mood', payload });
    finishCompanionCapture(setStatus, 'Sparat', { androidScope: 'journal' });
  };

  const saveLine = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'primary' });
    const payload = {
      type: 'capture',
      source: 'widget_journal_line',
      mood: mood ?? undefined,
      moodLabel: mood ? moodFaceLabel(mood) : undefined,
      text: trimmed,
      silo: 'dagbok' as const,
      at: Date.now(),
    };
    await setCached(`widget:${WIDGET_ID}:last`, {
      ...payload,
      mood: mood ?? undefined,
    });
    await queueWidgetSync({ type: 'capture', source: 'widget_journal_line', payload });
    setDraft('');
    setWriting(false);
    finishCompanionCapture(setStatus, 'Rad sparad', { androidScope: 'journal' });
  };

  const openFull = async () => {
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'open_module' });
    await routeWidgetAction(
      {
        widgetId: WIDGET_ID,
        action: 'open_module',
        detail: { moduleKey: cfg?.moduleKey ?? 'dagbok' },
      },
      { moduleKey: cfg?.moduleKey ?? 'dagbok' },
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
        title="Dagbok"
        subtitle={status ?? 'Dagens lugna check-in'}
        offline={!online}
        icon={<span aria-hidden>📓</span>}
      />
      <WidgetMoodCheckIn value={mood} onChange={(id) => void saveMood(id)} />
      <p style={{ margin: 0, color: WidgetPalette.mutedText, fontSize: '0.9rem' }}>
        {mood ? `Senaste känsla: ${moodFaceLabel(mood)}` : 'Reflektera i en minut.'}
      </p>
      {writing ? (
        <div style={{ display: 'grid', gap: '0.55rem' }}>
          <WidgetGlass inset style={{ padding: '0.65rem 0.75rem' }}>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="En rad räcker…"
              rows={2}
              aria-label="Snabb dagboksrad"
              autoFocus
              className="cw-input"
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.4,
                minHeight: WidgetTouch.minDp * 0.85,
              }}
            />
          </WidgetGlass>
          <div className="cw-actions-row">
            <WidgetButton
              variant="gold"
              size="premium"
              fullWidth
              onClick={() => void saveLine()}
              disabled={!draft.trim()}
            >
              Spara rad
            </WidgetButton>
            <WidgetButton variant="quiet" size="min" onClick={() => void openFull()}>
              Öppna hela
            </WidgetButton>
            <WidgetButton
              variant="ghost"
              size="min"
              onClick={() => {
                setWriting(false);
                setDraft('');
              }}
            >
              Avbryt
            </WidgetButton>
          </div>
        </div>
      ) : (
        <WidgetButton
          variant="gold"
          size="premium"
          fullWidth
          className={pulseHint && !writing ? 'cw-pulse-cta' : undefined}
          onClick={() => setWriting(true)}
        >
          Skriv
        </WidgetButton>
      )}
      <div className="cw-trust-row" aria-live="polite">
        {status ?? (online ? 'En rad räcker · sparas tryggt' : 'Offline — sparas lokalt')}
      </div>
    </WidgetCard>
  );
}
