import { useCallback, useRef, useState } from 'react';
import { useAudioRecorder } from '@/core/hooks/useAudioRecorder';
import { useSpeechToText } from '@/core/hooks/useSpeechToText';
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
    queued?: boolean;
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
        const lockResult = await lockWidgetRecordingToVault(userId, prepared, metadata);
        setResult({
          title: lockResult.title,
          summary: lockResult.summary,
          vaultId: lockResult.vaultId ?? lockResult.docId ?? lockResult.queueId ?? '',
          queued: lockResult.action === 'queued',
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
