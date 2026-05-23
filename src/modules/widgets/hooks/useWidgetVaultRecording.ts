import { useCallback, useRef, useState } from 'react';
import { useAudioRecorder } from '../../core/hooks/useAudioRecorder';
import { useSpeechToText } from '../../core/hooks/useSpeechToText';
import { ingestWidgetRecordingToVault } from '../api/widgetVaultRecording';

type Phase = 'idle' | 'recording' | 'processing' | 'done' | 'error';

export function useWidgetVaultRecording(userId: string | undefined) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    title: string;
    summary: string;
    vaultId: string;
  } | null>(null);
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
        setError('Logga in för att låsa inspelningen i Valvet.');
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
        const { vaultId, analysis } = await ingestWidgetRecordingToVault(
          userId,
          file,
          transcript,
          recordedAt,
          durationSeconds,
        );
        setResult({
          title: analysis.title,
          summary: analysis.summary,
          vaultId,
        });
        setPhase('done');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Kunde inte spara i Valvet.');
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

  const reset = useCallback(() => {
    speech.stop();
    transcriptParts.current = [];
    startedAt.current = null;
    setPhase('idle');
    setError(null);
    setResult(null);
  }, [speech]);

  return {
    phase,
    error,
    result,
    isRecording: phase === 'recording' && audio.isRecording,
    interim: speech.interim,
    audioError: audio.error,
    speechSupported: speech.supported,
    recordSupported: audio.supported,
    start,
    stop,
    reset,
  };
}
