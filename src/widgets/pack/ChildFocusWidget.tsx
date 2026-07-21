import { useEffect, useState } from 'react';
import { barnfokusQuestionForToday } from '@/features/family/children/constants';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetCard } from '../components/WidgetCard';
import { WidgetGlass } from '../components/WidgetGlass';
import { WidgetHeader } from '../components/WidgetHeader';
import { dispatchWidgetGesture } from '../core/WidgetActions';
import { formatBarnfokusCaptureText } from '../core/companionBarnText';
import { getCached, setCached } from '../core/WidgetCache';
import { finishCompanionCapture } from '../core/finishCompanionCapture';
import { softFocusWidgetControl } from '../core/softFocusWidgetControl';
import { useCompanionOnline } from '../core/useCompanionOnline';
import { useCompanionVoiceCapture } from '../core/useCompanionVoiceCapture';
import { queueWidgetSync } from '../core/WidgetSync';
import { routeWidgetAction } from '../core/WidgetRouter';
import { WidgetPalette, WidgetTouch } from '../core/WidgetTheme';
import { useStudioWidgetConfig } from '../studio/useStudioWidgetConfig';
import { widgetCardClass } from '../studio/studioIdleClass';

const WIDGET_ID = 'child_focus';

type LastAnswer = {
  question?: string;
  answer?: string;
  mode?: string;
  at?: number;
};

/**
 * Barnfokus — dagens låsta fråga + text/röst (bible 4.2 / locked UX).
 */
export function ChildFocusWidget({
  question: questionProp,
  pulseHint = false,
}: {
  question?: string;
  pulseHint?: boolean;
}) {
  const cfg = useStudioWidgetConfig(WIDGET_ID);
  const question = questionProp ?? barnfokusQuestionForToday('Kasper').text;
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState('');
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [status, setStatus] = useState<string | null>(null);
  const [showRecent, setShowRecent] = useState(false);
  const online = useCompanionOnline();
  const voice = useCompanionVoiceCapture('widget_barnfokus_voice');
  const last = getCached<LastAnswer>(`widget:${WIDGET_ID}:last`);

  useEffect(() => {
    if (!open || mode !== 'text') return;
    return softFocusWidgetControl({
      rootSelector: `[data-widget="${WIDGET_ID}"]`,
      focusSelector: 'textarea[aria-label="Svar"]',
      attempts: 3,
      delayMs: 80,
    });
  }, [open, mode]);

  useEffect(() => {
    if (!pulseHint) return;
    setOpen(true);
  }, [pulseHint]);

  const submitText = async () => {
    const trimmed = answer.trim();
    if (!trimmed) return;
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'primary' });
    const payload = {
      type: 'capture',
      source: 'widget_barnfokus',
      question,
      answer: trimmed,
      text: formatBarnfokusCaptureText(question, trimmed),
      mode: 'text' as const,
      silo: 'barn' as const,
      childAlias: 'Kasper',
      at: Date.now(),
    };
    await setCached(`widget:${WIDGET_ID}:last`, payload);
    await queueWidgetSync({ type: 'capture', source: 'widget_barnfokus', payload });
    setAnswer('');
    setOpen(false);
    finishCompanionCapture(setStatus, 'Sparat', { androidScope: 'child' });
  };

  const submitVoice = async () => {
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'primary_capture' });
    const voicePayload = await voice.toggle();
    if (!voicePayload) {
      setStatus(voice.status);
      return;
    }
    const payload = {
      ...voicePayload,
      question,
      silo: 'barn' as const,
      childAlias: 'Kasper',
      source: 'widget_barnfokus_voice',
    };
    await setCached(`widget:${WIDGET_ID}:last`, {
      question,
      answer: '[röst]',
      mode: 'voice',
      at: Date.now(),
    });
    await queueWidgetSync({
      type: 'capture',
      source: 'widget_barnfokus_voice',
      payload,
    });
    setOpen(false);
    finishCompanionCapture(setStatus, 'Röst sparad', { androidScope: 'child' });
  };

  const openRecent = async () => {
    await dispatchWidgetGesture({
      widgetId: WIDGET_ID,
      gesture: 'doubleTap',
      action: 'open_recent',
    });
    if (last?.answer) {
      setShowRecent(true);
      return;
    }
    await routeWidgetAction(
      {
        widgetId: WIDGET_ID,
        action: 'open_module',
        detail: { moduleKey: cfg?.moduleKey ?? 'barn' },
      },
      { moduleKey: cfg?.moduleKey ?? 'barn' },
    );
  };

  return (
    <WidgetCard
      size={cfg?.size ?? 'medium'}
      material={cfg?.material ?? 'sapphire'}
      className={[widgetCardClass(cfg?.animation), pulseHint ? 'cw-soft-focus' : ''].filter(Boolean).join(' ')}
      data-widget={WIDGET_ID}
    >
      <WidgetHeader
        title="Barnfokus"
        subtitle={status ?? (voice.recording ? 'Spelar in…' : 'Dagens fråga')}
        offline={!online}
        icon={<span aria-hidden>👦</span>}
      />
      <p className="cw-eyebrow" style={{ letterSpacing: '0.08em', color: WidgetPalette.premiumGoldDim }}>
        Dagens fråga
      </p>
      <p style={{ margin: 0, color: WidgetPalette.textPrimary, fontSize: '1.05rem', lineHeight: 1.4 }}>
        {question}
      </p>
      {showRecent && last?.answer ? (
        <WidgetGlass inset style={{ padding: '0.75rem', marginTop: '0.5rem' }}>
          <p style={{ margin: 0, color: WidgetPalette.mutedText, fontSize: '0.85rem' }}>Senaste</p>
          <p style={{ margin: '0.35rem 0 0', color: WidgetPalette.textPrimary, fontSize: '0.95rem' }}>
            {last.answer}
          </p>
          <WidgetButton
            variant="quiet"
            size="min"
            onClick={() => setShowRecent(false)}
            style={{ marginTop: '0.5rem' }}
          >
            Stäng
          </WidgetButton>
        </WidgetGlass>
      ) : null}
      {!open ? (
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <WidgetButton
            variant="gold"
            size="premium"
            fullWidth
            className={pulseHint && !open ? 'cw-pulse-cta' : undefined}
            onClick={() => setOpen(true)}
          >
            Svara
          </WidgetButton>
          <WidgetButton variant="ghost" size="min" aria-label="Senaste logg" onClick={() => void openRecent()}>
            Senaste
          </WidgetButton>
        </div>
      ) : (
        <WidgetGlass inset className="cw-anim-open" style={{ padding: '0.75rem', marginTop: 'auto' }}>
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.5rem' }}>
            <WidgetButton
              variant={mode === 'text' ? 'gold' : 'quiet'}
              size="min"
              onClick={() => setMode('text')}
            >
              Text
            </WidgetButton>
            <WidgetButton
              variant={mode === 'voice' ? 'gold' : 'quiet'}
              size="min"
              onClick={() => setMode('voice')}
            >
              Röst
            </WidgetButton>
          </div>
          {mode === 'text' ? (
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder='Skriv kort… (exakt citat: "…")'
              rows={2}
              aria-label="Svar"
              autoFocus
              className="cw-input"
              style={{ minHeight: WidgetTouch.minDp }}
            />
          ) : (
            <p style={{ color: WidgetPalette.mutedText, margin: '0 0 0.5rem', fontSize: '0.85rem' }}>
              {voice.recording
                ? 'Spelar in… tryck Spara för att stoppa.'
                : 'Tryck Spara för att spela in röstsvar.'}
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <WidgetButton variant="quiet" size="min" onClick={() => setOpen(false)}>
              Stäng
            </WidgetButton>
            <WidgetButton
              variant="gold"
              size="premium"
              fullWidth
              onClick={() => void (mode === 'voice' ? submitVoice() : submitText())}
            >
              {mode === 'voice' && voice.recording ? 'Stoppa' : 'Spara'}
            </WidgetButton>
          </div>
        </WidgetGlass>
      )}
      <div className="cw-trust-row" aria-live="polite">
        {status ?? (online ? 'Ett kort svar räcker · Valvet väntar' : 'Offline — sparas lokalt')}
      </div>
    </WidgetCard>
  );
}
