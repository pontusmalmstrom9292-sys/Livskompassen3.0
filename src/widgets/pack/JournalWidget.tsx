import { useEffect, useRef, useState } from 'react';
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
import { WidgetTouch } from '../core/WidgetTheme';
import { useStudioWidgetConfig } from '../studio/useStudioWidgetConfig';
import { widgetCardClass } from '../studio/studioIdleClass';

const WIDGET_ID = 'journal';

const DAILY_QUOTE = {
  body: 'Att förstå sig själv är början på all förändring.',
  attr: '— Okänd',
};

function BookGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

/**
 * Dagbok — check-in faces + one-line write in-widget (bible 4.2 / 6.4).
 * Mockup: quote/smoke-yta + mood + SKRIV-CTA.
 */
export function JournalWidget({
  pulseHint = false,
  autoWrite = false,
}: {
  pulseHint?: boolean;
  autoWrite?: boolean;
}) {
  const cfg = useStudioWidgetConfig(WIDGET_ID);
  const cached = getCached<{ mood?: MoodFaceId }>(`widget:${WIDGET_ID}:last`);
  const [mood, setMood] = useState<MoodFaceId | null>(cached?.mood ?? null);
  const [status, setStatus] = useState<string | null>(null);
  const [writing, setWriting] = useState(false);
  const [draft, setDraft] = useState('');
  const online = useCompanionOnline();
  const writeRan = useRef(false);

  useEffect(() => {
    if (!autoWrite || writeRan.current) return;
    writeRan.current = true;
    setWriting(true);
  }, [autoWrite]);

  useEffect(() => {
    if (pulseHint && !autoWrite) setWriting(true);
  }, [pulseHint, autoWrite]);

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
        title="Journal"
        subtitle={status ?? 'Dagens lugna check-in'}
        offline={!online}
        icon={<BookGlyph />}
      />
      {!writing ? (
        <div className="cw-quote-smoke" aria-hidden={false}>
          <p className="cw-quote-smoke__body">{DAILY_QUOTE.body}</p>
          <p className="cw-quote-smoke__attr">{DAILY_QUOTE.attr}</p>
        </div>
      ) : null}
      <WidgetMoodCheckIn value={mood} onChange={(id) => void saveMood(id)} />
      {writing ? (
        <div style={{ display: 'grid', gap: '0.55rem' }}>
          <WidgetGlass inset className="cw-glass-well" style={{ padding: '0.65rem 0.75rem' }}>
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
          Skriv i dagboken
        </WidgetButton>
      )}
      <div className="cw-trust-row" aria-live="polite">
        {status ?? (online ? 'En rad räcker · sparas tryggt' : 'Offline — sparas lokalt')}
      </div>
    </WidgetCard>
  );
}
