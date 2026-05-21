import { ChevronLeft, ChevronRight, Mic, MicOff } from 'lucide-react';
import { useCallback, useRef, useEffect } from 'react';
import { useSpeechToText } from '../../core/hooks/useSpeechToText';

type ReflectionStepProps = {
  text: string;
  onTextChange: (text: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function ReflectionStep({ text, onTextChange, onBack, onContinue }: ReflectionStepProps) {
  const textRef = useRef(text);
  useEffect(() => {
    textRef.current = text;
  }, [text]);

  const appendTranscript = useCallback(
    (chunk: string) => {
      if (!chunk) return;
      const current = textRef.current.trim();
      onTextChange(current ? `${current} ${chunk}` : chunk);
    },
    [onTextChange],
  );

  const { supported, isListening, interim, error, start, stop } = useSpeechToText({
    lang: 'sv-SE',
    onFinal: appendTranscript,
  });

  return (
    <>
      <p className="mb-2 text-xs uppercase tracking-widest text-text-dim">Steg 2 — Reflektion</p>
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder="Kort reflektion..."
        rows={4}
        className="input-glass"
      />
      {supported && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={isListening ? stop : start}
            className="btn-pill--ghost"
            aria-pressed={isListening}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? 'Stoppa röst' : 'Tala in (sv-SE)'}
          </button>
          {interim && <span className="text-xs text-text-dim">Hör: {interim}</span>}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={onBack} className="btn-pill--ghost">
          <ChevronLeft className="h-4 w-4" /> Tillbaka
        </button>
        <button type="button" disabled={!text.trim()} onClick={onContinue} className="btn-pill--secondary">
          Fortsätt <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </>
  );
}
