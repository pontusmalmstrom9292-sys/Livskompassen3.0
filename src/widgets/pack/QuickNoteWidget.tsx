import { useEffect, useRef, useState } from 'react';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetCard } from '../components/WidgetCard';
import { WidgetGlass } from '../components/WidgetGlass';
import { WidgetHeader } from '../components/WidgetHeader';
import { dispatchWidgetGesture } from '../core/WidgetActions';
import { getCached, setCached } from '../core/WidgetCache';
import { fileToPhotoPayload } from '../core/companionPhotoUpload';
import { finishCompanionCapture } from '../core/finishCompanionCapture';
import { useCompanionOnline } from '../core/useCompanionOnline';
import { useCompanionVoiceCapture } from '../core/useCompanionVoiceCapture';
import { queueWidgetSync } from '../core/WidgetSync';
import { WidgetPalette, WidgetMaterial, WidgetTouch } from '../core/WidgetTheme';
import { useStudioWidgetConfig } from '../studio/useStudioWidgetConfig';
import { widgetCardClass } from '../studio/studioIdleClass';

const WIDGET_ID = 'quick_note';
const PILLS = ['Tanke', 'Idé', 'Påminnelse'] as const;

type Draft = { text?: string; pill?: (typeof PILLS)[number] };

/**
 * Snabbanteckning — text, foto och röst (alla interaktiva).
 */
export function QuickNoteWidget({ pulseHint = false }: { pulseHint?: boolean }) {
  const cfg = useStudioWidgetConfig(WIDGET_ID);
  const cachedDraft = getCached<Draft>(`widget:${WIDGET_ID}:draft`);
  const [text, setText] = useState(cachedDraft?.text ?? '');
  const [pill, setPill] = useState<(typeof PILLS)[number]>(
    cachedDraft?.pill && PILLS.includes(cachedDraft.pill) ? cachedDraft.pill : 'Tanke',
  );
  const [status, setStatus] = useState<string | null>(null);
  const online = useCompanionOnline();
  const fileRef = useRef<HTMLInputElement>(null);
  const voice = useCompanionVoiceCapture('widget_note_voice');
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      void setCached(`widget:${WIDGET_ID}:draft`, { text, pill });
    }, 400);
    return () => {
      if (draftTimer.current) clearTimeout(draftTimer.current);
    };
  }, [text, pill]);

  const save = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'primary' });
    const payload = {
      type: 'capture',
      source: 'widget_note',
      text: trimmed,
      category: pill,
      at: Date.now(),
      silo: (cfg?.moduleKey === 'dagbok' ? 'dagbok' : 'inkast') as 'inkast' | 'dagbok',
    };
    await setCached(`widget:${WIDGET_ID}:draft`, { text: '', pill });
    await setCached(`widget:${WIDGET_ID}:last`, payload);
    await queueWidgetSync({ type: 'capture', source: 'widget_note', payload });
    setText('');
    finishCompanionCapture(setStatus, 'Anteckning sparad', { androidScope: 'note' });
  };

  const onPhotoPicked = async (file: File | null) => {
    if (!file) return;
    await dispatchWidgetGesture({
      widgetId: WIDGET_ID,
      gesture: 'tap',
      action: 'secondary',
      detail: { media: 'photo' },
    });
    try {
      const photoPayload = await fileToPhotoPayload(file, 'widget_note_photo');
      await setCached(`widget:${WIDGET_ID}:last`, {
        kind: 'photo',
        fileName: photoPayload.fileName,
        at: Date.now(),
      });
      await queueWidgetSync({
        type: 'capture',
        source: 'widget_note_photo',
        payload: photoPayload,
      });
      finishCompanionCapture(setStatus, 'Foto → Inkast', { androidScope: 'note' });
    } catch {
      setStatus('Kunde inte läsa foto');
    }
  };

  const onVoice = async () => {
    await dispatchWidgetGesture({
      widgetId: WIDGET_ID,
      gesture: 'tap',
      action: 'secondary',
      detail: { media: 'voice' },
    });
    const payload = await voice.toggle();
    if (!payload) {
      setStatus(voice.status);
      return;
    }
    await setCached(`widget:${WIDGET_ID}:last`, {
      kind: 'voice',
      source: 'widget_note_voice',
      at: Date.now(),
    });
    await queueWidgetSync({
      type: 'capture',
      source: 'widget_note_voice',
      payload,
    });
    finishCompanionCapture(setStatus, 'Röst uppladdad', { androidScope: 'note' });
  };

  const showPhoto = !cfg?.shortcuts?.length || cfg.shortcuts.includes('photo');
  const showVoice = !cfg?.shortcuts?.length || cfg.shortcuts.includes('voice');

  return (
    <WidgetCard
      size={cfg?.size ?? 'small'}
      material={cfg?.material ?? 'sapphire'}
      className={widgetCardClass(cfg?.animation)}
      data-widget={WIDGET_ID}
    >
      <WidgetHeader
        title="Snabba anteckningar"
        subtitle={voice.recording ? 'Spelar in…' : status ?? 'Skriv något snabbt…'}
        offline={!online}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          e.target.value = '';
          void onPhotoPicked(file);
        }}
      />
      <WidgetGlass
        inset
        className={pulseHint ? 'cw-soft-focus' : undefined}
        style={{ padding: '0.7rem 0.8rem' }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Skriv något snabbt..."
          rows={3}
          aria-label="Snabbanteckning"
          autoFocus={pulseHint}
          style={{
            width: '100%',
            resize: 'none',
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: WidgetPalette.textPrimary,
            fontSize: '0.95rem',
            lineHeight: 1.45,
            minHeight: WidgetTouch.minDp,
          }}
        />
      </WidgetGlass>
      <div className="cw-pill-row" role="group" aria-label="Kategori">
        {PILLS.map((p) => (
          <button
            key={p}
            type="button"
            className={['cw-pill', pill === p && 'cw-pill--active'].filter(Boolean).join(' ')}
            onClick={() => setPill(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        {showPhoto ? (
          <WidgetButton
            variant="ghost"
            size="min"
            aria-label="Bild"
            onClick={() => fileRef.current?.click()}
          >
            📷
          </WidgetButton>
        ) : null}
        {showVoice ? (
          <WidgetButton
            variant={voice.recording ? 'gold' : 'ghost'}
            size="min"
            aria-label={voice.recording ? 'Stoppa och spara röst' : 'Spela in röst'}
            onClick={() => void onVoice()}
          >
            {voice.recording ? '⏹' : '🎤'}
          </WidgetButton>
        ) : null}
        <WidgetButton
          variant="gold"
          size="premium"
          fullWidth
          aria-label="Spara anteckning"
          className={pulseHint ? 'cw-pulse-cta' : undefined}
          onClick={() => void save()}
          style={{ boxShadow: WidgetMaterial.glassLip }}
        >
          +
        </WidgetButton>
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
