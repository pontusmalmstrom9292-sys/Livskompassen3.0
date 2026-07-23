import { useCallback, useEffect, useRef, useState } from 'react';
import { WidgetButton } from '../components/WidgetButton';
import { WidgetCard } from '../components/WidgetCard';
import { WidgetHeader } from '../components/WidgetHeader';
import {
  createDoubleTapController,
  createLongPressController,
  dispatchWidgetGesture,
} from '../core/WidgetActions';
import { getCached, setCached } from '../core/WidgetCache';
import { blobToVoicePayload } from '../core/companionVoiceUpload';
import { finishCompanionCapture } from '../core/finishCompanionCapture';
import {
  ensureWidgetMedia,
  releaseMediaStream,
} from '../core/WidgetPermissions';
import { softFocusWidgetControl } from '../core/softFocusWidgetControl';
import { useCompanionOnline } from '../core/useCompanionOnline';
import { routeWidgetAction } from '../core/WidgetRouter';
import { queueWidgetSync } from '../core/WidgetSync';
import { useStudioWidgetConfig } from '../studio/useStudioWidgetConfig';
import { widgetCardClass } from '../studio/studioIdleClass';

const WIDGET_ID = 'quick_capture';
const SWIPE_CANCEL_PX = 56;
const WAVE_BARS = 21;

function LockGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M8 11V8a4 4 0 0 1 8 0v3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MicGlyph() {
  return (
    <svg className="cw-capture-mic__glyph" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M7 11a5 5 0 0 0 10 0M12 16v4M9 20h6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Quick Capture — voice first, silent long-press, Valv upload via sync (bible 4.2 / 6.4).
 * Mockup: gold mic ring + ethereal waveform + trust row.
 */
export function QuickCaptureWidget({
  pulseHint = false,
  autostart = false,
}: {
  pulseHint?: boolean;
  /** Deep-link `?autostart=1` — start recording once (like WidgetRecordPage). */
  autostart?: boolean;
}) {
  const [recording, setRecording] = useState(false);
  const [silent, setSilent] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const online = useCompanionOnline();
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef<number>(0);
  const pointerStartYRef = useRef<number | null>(null);
  const cancelSwipeRef = useRef(false);
  const micBtnRef = useRef<HTMLButtonElement>(null);
  const autostarted = useRef(false);
  const doubleTapRef = useRef(
    createDoubleTapController({
      onSingle: () => {
        /* wired in effect */
      },
      onDouble: () => {
        /* wired in effect */
      },
    }),
  );
  const cfg = useStudioWidgetConfig(WIDGET_ID);

  useEffect(() => {
    return () => {
      releaseMediaStream(streamRef.current);
    };
  }, []);

  useEffect(() => {
    if (!pulseHint || recording || autostart) return;
    return softFocusWidgetControl({
      rootSelector: `[data-widget="${WIDGET_ID}"]`,
      focusSelector: 'button[aria-label*="inspelning"]',
      attempts: 4,
      delayMs: 120,
    });
  }, [pulseHint, recording, autostart]);

  const openRecent = useCallback(async () => {
    const last = getCached<{ at?: number; kind?: string; source?: string }>(
      `widget:${WIDGET_ID}:last`,
    );
    if (!last?.at) {
      setStatus('Ingen inspelning ännu');
      window.setTimeout(() => setStatus(null), 1400);
      return;
    }
    await dispatchWidgetGesture({
      widgetId: WIDGET_ID,
      gesture: 'doubleTap',
      action: 'open_recent',
    });
    await routeWidgetAction(
      {
        widgetId: WIDGET_ID,
        action: 'open_recent',
        detail: { moduleKey: 'valv', path: '/valvet' },
      },
      { moduleKey: 'valv' },
    );
  }, []);

  const cancelRecording = useCallback(async () => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      try {
        recorder.ondataavailable = null;
        recorder.onstop = null;
        recorder.stop();
      } catch {
        /* ignore */
      }
    }
    chunksRef.current = [];
    releaseMediaStream(streamRef.current);
    streamRef.current = null;
    recorderRef.current = null;
    setRecording(false);
    setSilent(false);
    setStatus('Avbruten');
    window.setTimeout(() => setStatus(null), 1200);
    await dispatchWidgetGesture({
      widgetId: WIDGET_ID,
      gesture: 'swipe',
      action: 'cancel',
    });
  }, []);

  const stopAndSave = useCallback(async () => {
    if (cancelSwipeRef.current) {
      cancelSwipeRef.current = false;
      await cancelRecording();
      return;
    }
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      setRecording(false);
      setSilent(false);
      return;
    }
    await new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
      recorder.stop();
    });
    const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
    chunksRef.current = [];
    releaseMediaStream(streamRef.current);
    streamRef.current = null;
    recorderRef.current = null;
    const wasSilent = silent;
    setRecording(false);
    setSilent(false);

    if (blob.size < 32) {
      setStatus('För kort — försök igen');
      return;
    }

    const durationSeconds = Math.max(
      1,
      Math.round((Date.now() - (startedAtRef.current || Date.now())) / 1000),
    );
    const source = wasSilent ? 'widget_voice_silent' : 'widget_voice';
    const voicePayload = await blobToVoicePayload(blob, {
      source,
      silent: wasSilent,
      durationSeconds,
      transcript: '',
    });

    await setCached(`widget:${WIDGET_ID}:last`, {
      kind: 'voice',
      source,
      size: blob.size,
      durationSeconds,
      silent: wasSilent,
      at: Date.now(),
      queued: true,
    });
    await queueWidgetSync({
      type: 'capture',
      source,
      payload: voicePayload,
    });
    finishCompanionCapture(setStatus, 'Uppladdad till Valvet', {
      clearMs: 2000,
      androidScope: 'capture',
    });
    await dispatchWidgetGesture({ widgetId: WIDGET_ID, gesture: 'tap', action: 'primary' });
  }, [silent, cancelRecording]);

  const startRecording = useCallback(
    async (asSilent: boolean) => {
      if (recording) return;
      try {
        const { stream } = await ensureWidgetMedia('microphone');
        streamRef.current = stream;
        chunksRef.current = [];
        startedAtRef.current = Date.now();
        cancelSwipeRef.current = false;
        pointerStartYRef.current = null;
        const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
          ? 'audio/webm;codecs=opus'
          : undefined;
        const recorder = mime
          ? new MediaRecorder(stream, { mimeType: mime })
          : new MediaRecorder(stream);
        recorderRef.current = recorder;
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data);
        };
        recorder.start(250);
        setSilent(asSilent);
        setRecording(true);
        setStatus(null);
        await dispatchWidgetGesture({
          widgetId: WIDGET_ID,
          gesture: asSilent ? 'longPress' : 'tap',
          action: 'primary_capture',
        });
      } catch {
        setRecording(false);
        setSilent(false);
        setStatus('Mikrofon behövs för inspelning');
      }
    },
    [recording],
  );

  /** Deep-link autostart — same intent as WidgetRecordPage `?autostart=1`. */
  useEffect(() => {
    if (!autostart || recording || autostarted.current) return;
    autostarted.current = true;
    const t = window.setTimeout(() => {
      void startRecording(false);
    }, 280);
    return () => window.clearTimeout(t);
  }, [autostart, recording, startRecording]);

  useEffect(() => {
    const el = micBtnRef.current;
    if (!el) return;
    const ctl = createLongPressController({
      widgetId: WIDGET_ID,
      ms: 480,
      onFire: () => {
        void startRecording(true);
      },
    });
    doubleTapRef.current.dispose();
    doubleTapRef.current = createDoubleTapController({
      onSingle: () => {
        if (recording) void stopAndSave();
        else void startRecording(false);
      },
      onDouble: () => {
        if (!recording) void openRecent();
      },
    });
    const down = (e: PointerEvent) => {
      pointerStartYRef.current = e.clientY;
      cancelSwipeRef.current = false;
      ctl.onPointerDown(e);
    };
    const move = (e: PointerEvent) => {
      const startY = pointerStartYRef.current;
      if (startY == null || !recording || cancelSwipeRef.current) return;
      if (Math.abs(e.clientY - startY) >= SWIPE_CANCEL_PX) {
        cancelSwipeRef.current = true;
        void cancelRecording();
      }
    };
    const up = () => {
      ctl.onPointerUp();
      /* Silent long-press: release saves. Tap-stop uses onClick. */
      if (recording && silent && !cancelSwipeRef.current) {
        void stopAndSave();
      }
      pointerStartYRef.current = null;
    };
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', ctl.onPointerCancel);
    return () => {
      ctl.dispose();
      doubleTapRef.current.dispose();
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', ctl.onPointerCancel);
    };
  }, [recording, silent, startRecording, stopAndSave, openRecent, cancelRecording]);

  const hasRecent = Boolean(getCached(`widget:${WIDGET_ID}:last`));

  return (
    <WidgetCard
      size={cfg?.size ?? 'xs'}
      material={cfg?.material ?? 'sapphire'}
      className={[
        'cw-card--hero',
        'cw-card--capture-xs',
        widgetCardClass(cfg?.animation),
        pulseHint && !autostart ? 'cw-soft-focus' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      data-widget={WIDGET_ID}
    >
      <WidgetHeader
        title="Hemlig inspelning"
        subtitle={
          recording
            ? silent
              ? 'Tyst… svep uppåt eller Avbryt'
              : 'Spelar in… svep uppåt eller Avbryt'
            : (status ?? 'Tryck mic · inspelning startar')
        }
        offline={!online}
        icon={<LockGlyph />}
      />
      <div className="cw-capture-stage">
        <div
          className={['cw-capture-wave', recording ? 'cw-capture-wave--live' : '']
            .filter(Boolean)
            .join(' ')}
          aria-hidden
        >
          {Array.from({ length: WAVE_BARS }, (_, i) => (
            <span key={i} style={{ animationDelay: `${(i % 7) * 0.08}s` }} />
          ))}
        </div>
        <button
          ref={micBtnRef}
          type="button"
          aria-label={recording ? 'Stoppa och spara inspelning' : 'Starta röstinspelning'}
          className={[
            'cw-capture-mic',
            recording ? 'cw-capture-mic--live' : '',
            pulseHint && !recording && !autostart ? 'cw-pulse-cta' : '',
            'min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() => {
            if (recording) {
              void stopAndSave();
              return;
            }
            doubleTapRef.current.onActivate();
          }}
        >
          <MicGlyph />
        </button>
      </div>
      {!recording ? (
        <div className="cw-capture-hold-hint" aria-hidden>
          <svg viewBox="0 0 14 10" fill="none">
            <path
              d="M1 7.5 7 2.5l6 5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Håll intryckt i 2 sekunder</span>
        </div>
      ) : null}
      <div className="cw-actions-row" style={{ justifyContent: 'center' }}>
        {recording ? (
          <WidgetButton
            variant="ghost"
            size="min"
            onClick={() => {
              void cancelRecording();
            }}
          >
            Avbryt
          </WidgetButton>
        ) : (
          <WidgetButton
            variant="ghost"
            size="min"
            aria-label="Öppna senaste inspelning"
            onClick={() => void openRecent()}
            style={{ opacity: hasRecent ? 1 : 0.55 }}
          >
            Senaste
          </WidgetButton>
        )}
      </div>
      <div className="cw-trust-row cw-capture-trust" aria-live="polite">
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
