import { useEffect, useRef, useState } from 'react';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetCard } from '../components/WidgetCard';
import { WidgetGlass } from '../components/WidgetGlass';
import { WidgetHeader } from '../components/WidgetHeader';
import { WidgetQuickAction } from '../components/WidgetQuickAction';
import { dispatchWidgetGesture } from '../core/WidgetActions';
import { setCached } from '../core/WidgetCache';
import { fileToPhotoPayload } from '../core/companionPhotoUpload';
import { finishCompanionCapture } from '../core/finishCompanionCapture';
import { softFocusWidgetControl } from '../core/softFocusWidgetControl';
import { useCompanionOnline } from '../core/useCompanionOnline';
import { useCompanionVoiceCapture } from '../core/useCompanionVoiceCapture';
import { queueWidgetSync } from '../core/WidgetSync';
import { WidgetPalette } from '../core/WidgetTheme';
import { useStudioWidgetConfig } from '../studio/useStudioWidgetConfig';
import { widgetCardClass } from '../studio/studioIdleClass';
import { getWidgetStudioConfig } from '../studio/widgetStudioStore';
import type { StudioShortcutId } from '../studio/widgetStudioTypes';

const WIDGET_ID = 'inbox';

type InboxKind = 'text' | 'voice' | 'photo' | 'link' | 'video';

const LABELS: Record<InboxKind, { label: string; icon: string }> = {
  text: { label: 'Text', icon: '✏️' },
  voice: { label: 'Röst', icon: '🎤' },
  photo: { label: 'Foto', icon: '📷' },
  link: { label: 'Länk', icon: '🔗' },
  video: { label: 'Video', icon: '🎬' },
};

/**
 * Inkast — text/länk inline, röst, foto, video — allt klickbart och sparande.
 */
export function InboxWidget({ pulseHint = false }: { pulseHint?: boolean }) {
  const cfg = useStudioWidgetConfig(WIDGET_ID) ?? getWidgetStudioConfig(WIDGET_ID);
  const shortcuts = (cfg?.shortcuts?.length
    ? cfg.shortcuts
    : (['text', 'voice', 'photo', 'link'] as StudioShortcutId[])) as InboxKind[];
  const size = cfg?.size ?? 'small';
  const [panel, setPanel] = useState<'text' | 'link' | null>(null);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const online = useCompanionOnline();
  const photoRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const voice = useCompanionVoiceCapture('widget_inbox_voice');

  useEffect(() => {
    if (!pulseHint) return;
    setPanel((prev) => prev ?? 'text');
  }, [pulseHint]);

  useEffect(() => {
    if (!panel) return;
    return softFocusWidgetControl({
      rootSelector: `[data-widget="${WIDGET_ID}"]`,
      focusSelector: '#cw-inbox-draft',
      attempts: 3,
      delayMs: 60,
    });
  }, [panel]);

  const queueCapture = async (
    source: string,
    payload: Record<string, unknown>,
    okMsg: string,
  ) => {
    await setCached(`widget:${WIDGET_ID}:last`, { ...payload, at: Date.now() });
    await queueWidgetSync({ type: 'capture', source, payload });
    finishCompanionCapture(setStatus, okMsg, { androidScope: 'inbox' });
  };

  const saveTextOrLink = async () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const kind = panel === 'link' ? 'link' : 'text';
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'primary' });
    await queueCapture(
      `widget_inbox_${kind}`,
      {
        kind,
        text: trimmed,
        silo: 'inkast',
        source: `widget_inbox_${kind}`,
      },
      kind === 'link' ? 'Länk sparad' : 'Text sparad',
    );
    setDraft('');
    setPanel(null);
  };

  const onPhoto = async (file: File | null) => {
    if (!file) return;
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'primary' });
    try {
      const photoPayload = await fileToPhotoPayload(file, 'widget_inbox_photo');
      await queueCapture('widget_inbox_photo', photoPayload as unknown as Record<string, unknown>, 'Foto → Inkast');
    } catch {
      setStatus('Kunde inte läsa foto');
    }
  };

  const onVideo = async (file: File | null) => {
    if (!file) return;
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'primary' });
    try {
      /* Video goes same Inkast path as photo (base64). */
      const photoPayload = await fileToPhotoPayload(file, 'widget_inbox_video');
      await queueCapture(
        'widget_inbox_video',
        { ...photoPayload, kind: 'photo', source: 'widget_inbox_video' } as unknown as Record<string, unknown>,
        'Video → Inkast',
      );
    } catch {
      setStatus('Kunde inte läsa video');
    }
  };

  const onVoice = async () => {
    await dispatchWidgetGesture({
      widgetId: WIDGET_ID,
      gesture: 'tap',
      action: 'primary_capture',
    });
    const payload = await voice.toggle();
    if (!payload) {
      setStatus(voice.status);
      return;
    }
    await queueCapture(
      'widget_inbox_voice',
      payload as unknown as Record<string, unknown>,
      'Röst uppladdad',
    );
  };

  const fire = async (kind: InboxKind) => {
    if (kind === 'voice') {
      await onVoice();
      return;
    }
    if (kind === 'photo') {
      photoRef.current?.click();
      return;
    }
    if (kind === 'video') {
      videoRef.current?.click();
      return;
    }
    if (kind === 'text' || kind === 'link') {
      setPanel(kind);
      setDraft('');
      await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'primary' });
      return;
    }
  };

  return (
    <WidgetCard
      size={size}
      material={cfg?.material ?? 'sapphire'}
      className={widgetCardClass(cfg?.animation)}
      data-widget={WIDGET_ID}
    >
      <WidgetHeader
        title="Inkast"
        subtitle={
          voice.recording
            ? 'Spelar in… tryck Röst igen'
            : status ?? 'Ett tryck. Klart.'
        }
        offline={!online}
        icon={<span aria-hidden>📥</span>}
      />
      <input
        ref={photoRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          e.target.value = '';
          void onPhoto(file);
        }}
      />
      <input
        ref={videoRef}
        type="file"
        accept="video/*"
        capture="environment"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          e.target.value = '';
          void onVideo(file);
        }}
      />
      {voice.recording ? (
        <div className="cw-waveform" aria-hidden style={{ marginBottom: 4 }}>
          <span /><span /><span /><span /><span />
        </div>
      ) : null}
      {panel ? (
        <WidgetGlass inset style={{ padding: '0.7rem', marginBottom: '0.5rem' }}>
          <label className="sr-only" htmlFor="cw-inbox-draft">
            {panel === 'link' ? 'Länk' : 'Text'}
          </label>
          <input
            id="cw-inbox-draft"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={panel === 'link' ? 'Klistra in länk…' : 'Skriv kort…'}
            inputMode={panel === 'link' ? 'url' : 'text'}
            autoFocus
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              color: WidgetPalette.textPrimary,
              fontSize: '0.95rem',
              minHeight: 44,
            }}
          />
          <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.45rem' }}>
            <WidgetButton variant="quiet" size="min" onClick={() => setPanel(null)}>
              Avbryt
            </WidgetButton>
            <WidgetButton variant="gold" size="premium" fullWidth onClick={() => void saveTextOrLink()}>
              Spara
            </WidgetButton>
          </div>
        </WidgetGlass>
      ) : null}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: shortcuts.length === 1 ? '1fr' : '1fr 1fr',
          gap: '0.55rem',
          flex: 1,
        }}
      >
        {shortcuts.map((kind) => {
          const meta = LABELS[kind] ?? LABELS.text;
          const activeVoice = kind === 'voice' && voice.recording;
          return (
            <WidgetQuickAction
              key={kind}
              widgetId={WIDGET_ID}
              label={activeVoice ? 'Stoppa' : meta.label}
              icon={meta.icon}
              className={pulseHint && !panel && kind === shortcuts[0] ? 'cw-pulse-cta' : undefined}
              onClick={() => void fire(kind)}
              style={
                activeVoice
                  ? {
                      color: WidgetPalette.etherealBlue,
                      borderColor: `color-mix(in srgb, ${WidgetPalette.etherealBlue} 45%, transparent)`,
                    }
                  : undefined
              }
            />
          );
        })}
      </div>
      <div className="cw-trust-row" aria-live="polite">
        {status ? (
          <span>{status}</span>
        ) : (
          <>
            <span>End-to-end krypterad</span>
            <span>Helt privat</span>
            <span>Endast du har åtkomst</span>
          </>
        )}
      </div>
    </WidgetCard>
  );
}
