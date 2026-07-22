import { useCallback, useEffect, useRef, useState } from 'react';
import { WidgetCard } from '../components/WidgetCard';
import { WidgetHeader } from '../components/WidgetHeader';
import { dispatchWidgetGesture } from '../core/WidgetActions';
import { getCached, setCached } from '../core/WidgetCache';
import { fileToPhotoPayload } from '../core/companionPhotoUpload';
import { finishCompanionCapture } from '../core/finishCompanionCapture';
import { useCompanionOnline } from '../core/useCompanionOnline';
import { useCompanionVoiceCapture } from '../core/useCompanionVoiceCapture';
import { queueWidgetSync } from '../core/WidgetSync';
import { WidgetTouch } from '../core/WidgetTheme';
import { useStudioWidgetConfig } from '../studio/useStudioWidgetConfig';
import { widgetCardClass } from '../studio/studioIdleClass';
import { patchWidgetStudioConfig } from '../studio/widgetStudioStore';

const WIDGET_ID = 'quick_note';
const PILLS = ['Tanke', 'Idé', 'Påminnelse', 'Annat'] as const;

type Draft = { text?: string; pill?: (typeof PILLS)[number] };

function PencilGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 20h4l10.5-10.5-4-4L4 16v4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M13 6.5 16.5 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CameraGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 8h3l1.5-2h7L17 8h3v11H4V8z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="13.5" r="3.2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MicGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M7 11a5 5 0 0 0 10 0M12 16v4M9 20h6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BulbGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 18h6M10 21h4M8 14c-1.5-1.2-2.5-3-2.5-5A6.5 6.5 0 0 1 18.5 9c0 2-.9 3.7-2.5 5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Snabbanteckning — text, foto och röst (alla interaktiva).
 * Mockup: glass well + pill tags + gold + dock.
 */
export function QuickNoteWidget({
  pulseHint = false,
  autoVoice = false,
  autoPhoto = false,
}: {
  pulseHint?: boolean;
  /** Deep-link `?voice=1` — start voice capture once. */
  autoVoice?: boolean;
  /** Deep-link `?photo=1` — open camera picker once. */
  autoPhoto?: boolean;
}) {
  const cfg = useStudioWidgetConfig(WIDGET_ID);
  const cachedDraft = getCached<Draft>(`widget:${WIDGET_ID}:draft`);
  const [text, setText] = useState(cachedDraft?.text ?? '');
  const [pill, setPill] = useState<(typeof PILLS)[number]>(
    cachedDraft?.pill && (PILLS as readonly string[]).includes(cachedDraft.pill)
      ? cachedDraft.pill
      : 'Tanke',
  );
  const [status, setStatus] = useState<string | null>(null);
  const [pinnedFlash, setPinnedFlash] = useState(false);
  const online = useCompanionOnline();
  const fileRef = useRef<HTMLInputElement>(null);
  const voice = useCompanionVoiceCapture('widget_note_voice');
  const draftTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoVoiceDone = useRef(false);
  const autoPhotoDone = useRef(false);

  useEffect(() => {
    if (draftTimer.current) clearTimeout(draftTimer.current);
    draftTimer.current = setTimeout(() => {
      void setCached(`widget:${WIDGET_ID}:draft`, { text, pill });
    }, 400);
    return () => {
      if (draftTimer.current) clearTimeout(draftTimer.current);
    };
  }, [text, pill]);

  const save = useCallback(async () => {
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
  }, [text, pill, cfg?.moduleKey]);

  const onPhotoPicked = useCallback(async (file: File | null) => {
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
  }, []);

  const onVoice = useCallback(async () => {
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
  }, [voice]);

  useEffect(() => {
    if (!autoVoice || autoVoiceDone.current || voice.recording) return;
    autoVoiceDone.current = true;
    const t = window.setTimeout(() => {
      void onVoice();
    }, 320);
    return () => window.clearTimeout(t);
  }, [autoVoice, onVoice, voice.recording]);

  useEffect(() => {
    if (!autoPhoto || autoPhotoDone.current) return;
    autoPhotoDone.current = true;
    const t = window.setTimeout(() => {
      fileRef.current?.click();
    }, 320);
    return () => window.clearTimeout(t);
  }, [autoPhoto]);

  const togglePin = async () => {
    const next = !(cfg?.homePin === true);
    await patchWidgetStudioConfig(WIDGET_ID, { homePin: next });
    setPinnedFlash(true);
    setStatus(next ? 'Fäst på Hem' : 'Ej fäst');
    window.setTimeout(() => {
      setPinnedFlash(false);
      setStatus(null);
    }, 1200);
  };

  const showPhoto = !cfg?.shortcuts?.length || cfg.shortcuts.includes('photo');
  const showVoice = !cfg?.shortcuts?.length || cfg.shortcuts.includes('voice');
  const pinned = cfg?.homePin === true || pinnedFlash;

  return (
    <WidgetCard
      size={cfg?.size ?? 'medium'}
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
        title="Snabba anteckningar"
        subtitle={voice.recording ? 'Spelar in…' : (status ?? 'Skriv något snabbt…')}
        offline={!online}
        icon={<PencilGlyph />}
        trailing={
          <div className="cw-header-chrome">
            <button
              type="button"
              className="cw-header-chrome__btn"
              aria-label={pinned ? 'Ta bort fästning på Hem' : 'Fäst på Hem'}
              aria-pressed={pinned}
              onClick={() => void togglePin()}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M15 4 9.5 9.5 7 9l-2 2 5 5 2-2-.5-2.5L17 17l1-1-3-5.5L20 9l-1-1-4 1z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        }
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
      <div className={['cw-note-well', pulseHint ? 'cw-soft-focus' : ''].filter(Boolean).join(' ')}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Skriv något snabbt…"
          rows={3}
          aria-label="Snabbanteckning"
          autoFocus={pulseHint && !autoVoice && !autoPhoto}
          className="cw-input"
          style={{
            fontSize: '0.95rem',
            lineHeight: 1.45,
            minHeight: WidgetTouch.minDp,
          }}
        />
      </div>
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
      <div className="cw-note-dock">
        <button
          type="button"
          className={['cw-note-tool', pill === 'Idé' ? 'cw-note-tool--active' : '']
            .filter(Boolean)
            .join(' ')}
          aria-label="Kategori Idé"
          onClick={() => setPill('Idé')}
        >
          <BulbGlyph />
        </button>
        <span className="cw-note-dock__spacer" />
        {showPhoto ? (
          <button
            type="button"
            className="cw-note-tool"
            aria-label="Bild"
            onClick={() => fileRef.current?.click()}
          >
            <CameraGlyph />
          </button>
        ) : null}
        {showVoice ? (
          <button
            type="button"
            className={[
              'cw-note-tool',
              voice.recording ? 'cw-note-tool--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-label={voice.recording ? 'Stoppa och spara röst' : 'Spela in röst'}
            onClick={() => void onVoice()}
          >
            <MicGlyph />
          </button>
        ) : null}
        <button
          type="button"
          className={['cw-note-add', pulseHint ? 'cw-pulse-cta' : ''].filter(Boolean).join(' ')}
          aria-label="Spara anteckning"
          disabled={!text.trim()}
          onClick={() => void save()}
        >
          +
        </button>
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
