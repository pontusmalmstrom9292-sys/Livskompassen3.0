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
import { WidgetPalette, WidgetMaterial, WidgetTouch } from '../core/WidgetTheme';

const WIDGET_ID = 'quick_capture';
const SWIPE_CANCEL_PX = 56;

/**
 * Quick Capture — voice first, silent long-press, Valv upload via sync (bible 4.2 / 6.4).
 */
export function QuickCaptureWidget({ pulseHint = false }: { pulseHint?: boolean }) {
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
    if (!pulseHint || recording) return;
    return softFocusWidgetControl({
      rootSelector: `[data-widget="${WIDGET_ID}"]`,
      focusSelector: 'button[aria-label*="inspelning"]',
      attempts: 4,
      delayMs: 120,
    });
  }, [pulseHint, recording]);

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

  const startRecording = useCallback(async (asSilent: boolean) => {
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
      const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
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
  }, [recording]);

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
      size={cfg?.size ?? 'small'}
      material={cfg?.material ?? 'sapphire'}
      className={widgetCardClass(cfg?.animation)}
      data-widget={WIDGET_ID}
    >
      <WidgetHeader
        title="Hemlig inspelning"
        subtitle={
          recording
            ? silent
              ? 'Tyst… svep eller Avbryt'
              : 'Spelar in… svep eller Avbryt'
            : status ?? (pulseHint
              ? 'Tryck här för att spela in'
              : 'Tryck · dubbeltryck Senaste · håll för tyst')
        }
        offline={!online}
        icon={<span aria-hidden>🎙</span>}
      />
      <div style={{ display: 'grid', placeItems: 'center', gap: '0.75rem', flex: 1 }}>
        <button
          ref={micBtnRef}
          type="button"
          aria-label={recording ? 'Stoppa och spara inspelning' : 'Starta röstinspelning'}
          className={pulseHint && !recording ? 'cw-pulse-cta' : undefined}
          onClick={() => {
            if (recording) {
              void stopAndSave();
              return;
            }
            doubleTapRef.current.onActivate();
          }}
          style={{
            width: 92,
            height: 92,
            borderRadius: '50%',
            border: `1px solid ${WidgetPalette.premiumGold}`,
            background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${WidgetPalette.premiumGold} 18%, transparent), ${WidgetPalette.deepSpaceBlue} 70%)`,
            boxShadow: `${WidgetMaterial.insetShadow}, 0 0 20px color-mix(in srgb, ${WidgetPalette.premiumGold} 16%, transparent)`,
            color: WidgetPalette.premiumGold,
            fontSize: '2rem',
            minWidth: WidgetTouch.premiumMaxDp,
            minHeight: WidgetTouch.premiumMaxDp,
            cursor: 'pointer',
            touchAction: 'none',
          }}
        >
          🎤
        </button>
        {recording ? (
          <>
            <div className="cw-waveform" aria-hidden>
              <span /><span /><span /><span /><span /><span /><span />
            </div>
            <WidgetButton
              variant="ghost"
              size="min"
              onClick={() => {
                void cancelRecording();
              }}
            >
              Avbryt
            </WidgetButton>
          </>
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
