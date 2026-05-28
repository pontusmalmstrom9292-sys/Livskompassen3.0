import { useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Mic, MicOff } from 'lucide-react';
import { useSpeechToText } from '../../../core/hooks/useSpeechToText';
import { fetchMabraCoach } from '../api/mabraCoachService';
import { MABRA_COACH_COPY, MABRA_SPEGLAR_REDIRECT_MESSAGE } from '../constants';
import { shouldRedirectMabraCoachToSpeglar } from '../lib/mabraCoachGuard';
import type { MabraExerciseType, MabraSymptomHub } from '../types';

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
  const [redirectToSpeglar, setRedirectToSpeglar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requested, setRequested] = useState(false);
  const noteRef = useRef(optionalNote);

  noteRef.current = optionalNote;

  const appendNoteTranscript = useCallback((chunk: string) => {
    if (!chunk) return;
    const current = noteRef.current.trim();
    const next = current ? `${current} ${chunk}` : chunk;
    setOptionalNote(next.slice(0, NOTE_MAX));
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

  const handleCoach = async () => {
    stopSpeech();
    setLoading(true);
    setError(null);
    setRequested(true);
    setRedirectToSpeglar(false);

    const note = optionalNote.trim() || undefined;

    if (shouldRedirectMabraCoachToSpeglar(note)) {
      setCoachText(MABRA_SPEGLAR_REDIRECT_MESSAGE);
      setUsedAi(false);
      setRedirectToSpeglar(true);
      setLoading(false);
      return;
    }

    try {
      const result = await fetchMabraCoach(hub, exerciseType, note);
      setCoachText(result.coach);
      setRedirectToSpeglar(result.redirectToSpeglar);
      setUsedAi(!result.redirectToSpeglar);
    } catch {
      setCoachText(MABRA_COACH_COPY.offlineFallback);
      setUsedAi(false);
      setError(MABRA_COACH_COPY.offlineHint);
    } finally {
      setLoading(false);
    }
  };

  const showAiAccent = usedAi || redirectToSpeglar;

  return (
    <div className="mt-4 w-full max-w-sm space-y-3 text-left">
      <p className="text-center text-xs text-text-dim">{MABRA_COACH_COPY.hint}</p>

      {!requested && (
        <>
          <textarea
            value={optionalNote}
            onChange={(e) => setOptionalNote(e.target.value.slice(0, NOTE_MAX))}
            placeholder={MABRA_COACH_COPY.notePlaceholder}
            rows={2}
            className="input-glass text-left"
            aria-label="Valfri rad till Måbra-coach"
          />
          {speechSupported && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={isListening ? stopSpeech : startSpeech}
                className="btn-pill--ghost text-sm"
                aria-pressed={isListening}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isListening ? 'Stoppa röst' : 'Tala in (sv-SE)'}
              </button>
            </div>
          )}
          {speechError && <p className="text-center text-xs text-danger">{speechError}</p>}
          <p className="text-center text-[10px] text-text-dim">{MABRA_COACH_COPY.noteHint}</p>
          <button
            type="button"
            onClick={handleCoach}
            disabled={loading}
            className="btn-pill--secondary w-full disabled:opacity-50"
          >
            {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : MABRA_COACH_COPY.buttonLabel}
          </button>
        </>
      )}

      {requested && (
        <div
          className={`glass-card p-4 ${showAiAccent ? 'glass-card--ai border-accent-ai/30' : 'border-border-strong'}`}
        >
          <p className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-text-dim">
            {MABRA_COACH_COPY.responseLabel}
            {usedAi && <span className="text-accent-ai">AI</span>}
            {redirectToSpeglar && <span className="text-accent-ai">Speglar</span>}
          </p>
          {loading ? (
            <p className="text-sm text-text-dim">{MABRA_COACH_COPY.loading}</p>
          ) : (
            <p className={`text-sm leading-relaxed ${showAiAccent ? 'text-accent-ai' : 'text-text-muted'}`}>
              {coachText}
            </p>
          )}
          {redirectToSpeglar && !loading && (
            <Link to="/speglar" className="btn-pill--ghost mt-3 w-full text-sm">
              {MABRA_COACH_COPY.speglarLinkLabel}
            </Link>
          )}
          {error && <p className="mt-2 text-xs text-text-dim">{error}</p>}
        </div>
      )}
    </div>
  );
}
