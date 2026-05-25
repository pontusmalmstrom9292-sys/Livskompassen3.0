import { useCallback, useEffect, useRef, useState } from 'react';
import { useAudioRecorder } from '../../core/hooks/useAudioRecorder';
import { useSpeechToText } from '../../core/hooks/useSpeechToText';
import { KILL_SWITCH_EVENT } from '../../core/security/killSwitch';
import {
  lockWidgetRecordingToVault,
  prepareWidgetRecording,
  type PreparedWidgetRecording,
  type WidgetRecordingMetadata,
} from '../api/widgetVaultRecording';

type Phase = 'idle' | 'recording' | 'processing' | 'metadata' | 'done' | 'error';

export function useWidgetVaultRecording(userId: string | undefined) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    title: string;
    summary: string;
    vaultId: string;
  } | null>(null);
  const [prepared, setPrepared] = useState<PreparedWidgetRecording | null>(null);
  const transcriptParts = useRef<string[]>([]);
  const startedAt = useRef<Date | null>(null);

  const speech = useSpeechToText({
    lang: 'sv-SE',
    onFinal: (line) => {
      if (line.trim()) transcriptParts.current.push(line.trim());
    },
  });

  const onRecorded = useCallback(
    async (file: File) => {
      if (!userId) {
        setError('Logga in för att spara i Valvet.');
        setPhase('error');
        return;
      }

      setPhase('processing');
      setError(null);

      const recordedAt = startedAt.current ?? new Date();
      const durationSeconds = startedAt.current
        ? Math.round((Date.now() - startedAt.current.getTime()) / 1000)
        : undefined;
      const transcript = transcriptParts.current.join(' ').trim();

      try {
        const prep = await prepareWidgetRecording(
          userId,
          file,
          transcript,
          recordedAt,
          durationSeconds,
        );
        setPrepared(prep);
        setPhase('metadata');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kunde inte förbereda sparning.');
        setPhase('error');
      }
    },
    [userId],
  );

  const audio = useAudioRecorder({ onRecorded });

  const start = useCallback(async () => {
    if (!userId) {
      setError('Logga in först.');
      setPhase('error');
      return;
    }
    setError(null);
    setResult(null);
    setPrepared(null);
    transcriptParts.current = [];
    startedAt.current = new Date();
    setPhase('recording');
    speech.start();
    await audio.start();
  }, [audio, speech, userId]);

  const stop = useCallback(() => {
    speech.stop();
    audio.stop();
  }, [audio, speech]);

  const lockWithMetadata = useCallback(
    async (metadata: WidgetRecordingMetadata) => {
      if (!userId || !prepared) return;
      setPhase('processing');
      setError(null);
      try {
        const vaultId = await lockWidgetRecordingToVault(userId, prepared, metadata);
        setResult({
          title: prepared.analysis.title,
          summary: prepared.analysis.summary,
          vaultId,
        });
        setPrepared(null);
        setPhase('done');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kunde inte låsa i Valvet.');
        setPhase('metadata');
      }
    },
    [prepared, userId],
  );

  const reset = useCallback(() => {
    speech.stop();
    audio.abort();
    transcriptParts.current = [];
    startedAt.current = null;
    setPrepared(null);
    setPhase('idle');
    setError(null);
    setResult(null);
  }, [audio, speech]);

  const abort = useCallback(() => {
    speech.stop();
    audio.abort();
    transcriptParts.current = [];
    startedAt.current = null;
    setPrepared(null);
    setPhase('idle');
    setError(null);
    setResult(null);
  }, [audio, speech]);

  useEffect(() => {
    const onKill = () => abort();
    window.addEventListener(KILL_SWITCH_EVENT, onKill);
    return () => window.removeEventListener(KILL_SWITCH_EVENT, onKill);
  }, [abort]);

  return {
    phase,
    error,
    result,
    prepared,
    isRecording: phase === 'recording' && audio.isRecording,
    interim: speech.interim,
    audioError: audio.error,
    speechSupported: speech.supported,
    recordSupported: audio.supported,
    start,
    stop,
    reset,
    abort,
    lockWithMetadata,
  };
}
