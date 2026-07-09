import { useCallback, useRef, useState } from 'react';
import { Loader2, Mic, MicOff } from 'lucide-react';
import { Button } from '@/design-system';
import { useSpeechToText } from '@/core/hooks/useSpeechToText';
import { fetchMabraCoach, fetchRsdErrorCoach } from '../api/mabraCoachService';
import { MABRA_COACH_COPY } from '../constants';
import { getMabraRsdErrorCopy } from '../lib/mabraRsdErrorCopy';
import { shouldRedirectMabraCoachToSpeglar } from '../lib/mabraCoachGuard';
import type { MabraExerciseType, MabraSymptomHub } from '../types';
import { MabraSpeglarGuardHint } from './MabraSpeglarGuardHint';

const NOTE_MAX = 500;

type Props = {
  hub: MabraSymptomHub;
  exerciseType: MabraExerciseType;
};

export function MabraCoachPanel({ hub, exerciseType }: Props) {
  const [optionalNote, setOptionalNote] = useState('');
  const [coachText, setCoachText] = useState('');
  const [loading, setLoading] = useState(false);
  const [usedAi, setUsedAi] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);
  const [guardDismissed, setGuardDismissed] = useState(false);
  const [showGuardPrompt, setShowGuardPrompt] = useState(false);
  const noteRef = useRef(optionalNote);

  noteRef.current = optionalNote;

  const noteTrimmed = optionalNote.trim();
  const guardActive = shouldRedirectMabraCoachToSpeglar(noteTrimmed) && !guardDismissed;

  const appendNoteTranscript = useCallback((chunk: string) => {
    if (!chunk) return;
    const current = noteRef.current.trim();
    const next = current ? `${current} ${chunk}` : chunk;
    setOptionalNote(next.slice(0, NOTE_MAX));
    setGuardDismissed(false);
  }, []);

  const {
    supported: speechSupported,
    isListening,
    error: speechError,
    start: startSpeech,
    stop: stopSpeech,
  } = useSpeechToText({
    lang: 'sv-SE',
    onFinal: appendNoteTranscript,
  });

  const handleNoteChange = (value: string) => {
    setOptionalNote(value.slice(0, NOTE_MAX));
    setGuardDismissed(false);
    setShowGuardPrompt(false);
  };

  const handleCoach = async () => {
    stopSpeech();
    if (shouldRedirectMabraCoachToSpeglar(noteTrimmed) && !guardDismissed) {
      setShowGuardPrompt(true);
      return;
    }

    setLoading(true);
    setError(null);
    setRequested(true);
    setShowGuardPrompt(false);

    const note = noteTrimmed || undefined;

    try {
      const result = await fetchMabraCoach(hub, exerciseType, note);
      if (result.redirectToSpeglar) {
        setRequested(false);
        setShowGuardPrompt(true);
        setGuardDismissed(false);
        setCoachText('');
        setUsedAi(false);
        return;
      }
      setCoachText(result.coach);
      setUsedAi(true);
    } catch {
      setCoachText(MABRA_COACH_COPY.offlineFallback);
      setUsedAi(false);
      try {
        const rsd = await fetchRsdErrorCoach();
        setError(rsd.coach);
      } catch {
        setError(getMabraRsdErrorCopy());
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 w-full max-w-sm space-y-3 text-left">
      <p className="text-center text-xs text-text-dim">{MABRA_COACH_COPY.hint}</p>

      {!requested && (
        <>
          <textarea
            value={optionalNote}
            onChange={(e) => handleNoteChange(e.target.value)}
            placeholder={MABRA_COACH_COPY.notePlaceholder}
            rows={2}
            className="input-glass text-left"
            aria-label="Valfri rad till Måbra-coach"
          />
          {(showGuardPrompt || guardActive) && (
            <MabraSpeglarGuardHint
              onStay={() => {
                setGuardDismissed(true);
                setShowGuardPrompt(false);
              }}
            />
          )}
          {speechSupported && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                variant="ghost"
                className="text-sm"
                onClick={isListening ? stopSpeech : startSpeech}
                aria-pressed={isListening}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isListening ? 'Stoppa röst' : 'Tala in (sv-SE)'}
              </Button>
            </div>
          )}
          {speechError && <p className="text-center text-xs text-danger">{speechError}</p>}
          <p className="text-center text-[10px] text-text-dim">{MABRA_COACH_COPY.noteHint}</p>
          <Button
            variant="secondary"
            className="w-full disabled:opacity-50"
            onClick={() => void handleCoach()}
            disabled={loading}
          >
            {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : MABRA_COACH_COPY.buttonLabel}
          </Button>
        </>
      )}

      {requested && (
        <div
          className={`glass-card p-4 ${usedAi ? 'glass-card--ai border-accent-ai/30' : 'border-border-strong'}`}
        >
          <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-dim">
            {MABRA_COACH_COPY.responseLabel}
            {usedAi && <span className="text-accent-ai">AI</span>}
          </p>
          {loading ? (
            <p className="text-sm text-text-dim">{MABRA_COACH_COPY.loading}</p>
          ) : (
            <p className={`text-sm leading-relaxed ${usedAi ? 'text-accent-ai' : 'text-text-muted'}`}>
              {coachText}
            </p>
          )}
          {error && <p className="mt-2 text-xs text-text-dim">{error}</p>}
        </div>
      )}
    </div>
  );
}
