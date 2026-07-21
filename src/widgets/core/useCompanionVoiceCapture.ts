/**
 * Shared voice capture for Companion widgets — record → Blob → voice payload.
 */

import { useCallback, useRef, useState } from 'react';
import { blobToVoicePayload, type CompanionVoicePayload } from './companionVoiceUpload';
import { ensureWidgetMedia, releaseMediaStream } from './WidgetPermissions';

export type CompanionVoiceSession = {
  recording: boolean;
  status: string | null;
  start: () => Promise<void>;
  stop: () => Promise<CompanionVoicePayload | null>;
  toggle: () => Promise<CompanionVoicePayload | null>;
};

export function useCompanionVoiceCapture(source: string): CompanionVoiceSession {
  const [recording, setRecording] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startedAtRef = useRef(0);

  const stop = useCallback(async (): Promise<CompanionVoicePayload | null> => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      setRecording(false);
      return null;
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
    setRecording(false);

    if (blob.size < 32) {
      setStatus('För kort');
      return null;
    }

    const durationSeconds = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
    setStatus(navigator.onLine ? 'Laddar upp röst…' : 'Röst sparad lokalt');
    return blobToVoicePayload(blob, {
      source,
      durationSeconds,
      transcript: '',
    });
  }, [source]);

  const start = useCallback(async () => {
    try {
      const { stream } = await ensureWidgetMedia('microphone');
      streamRef.current = stream;
      chunksRef.current = [];
      startedAtRef.current = Date.now();
      const mime = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : undefined;
      const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.start(250);
      setRecording(true);
      setStatus('Spelar in… tryck igen för att spara');
    } catch {
      setRecording(false);
      setStatus('Mikrofon behövs');
    }
  }, []);

  const toggle = useCallback(async () => {
    if (recording) return stop();
    await start();
    return null;
  }, [recording, start, stop]);

  return { recording, status, start, stop, toggle };
}
