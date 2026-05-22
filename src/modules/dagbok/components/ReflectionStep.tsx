import { ChevronLeft, ChevronRight, Mic, MicOff } from 'lucide-react';
import { useCallback, useRef, useEffect } from 'react';
import { useSpeechToText } from '../../core/hooks/useSpeechToText';
import { MABRA_BRIDGE_LABELS } from '../constants/mabraBridge';
import { JadeGuardBanner } from '../../core/ui/JadeGuardBanner';
import { MOOD_REFLECTION_PROMPTS } from '../constants/moodPrompts';

type ReflectionStepProps = {
  text: string;
  mood?: string;
  onTextChange: (text: string) => void;
  onBack: () => void;
  onContinue: () => void;
  lowEnergyBridge?: boolean;
  onSaveWithoutText?: () => void;
  saving?: boolean;
};

export function ReflectionStep({
  text,
  mood = '',
  onTextChange,
  onBack,
  onContinue,
  lowEnergyBridge = false,
  onSaveWithoutText,
  saving = false,
}: ReflectionStepProps) {
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
      <p className="mb-2 text-xs uppercase tracking-widest text-text-dim">
        Steg 2 — Reflektion{lowEnergyBridge ? ' (valfritt)' : ''}
      </p>
      {mood && MOOD_REFLECTION_PROMPTS[mood] && (
        <p className="mb-2 text-sm text-text-muted">{MOOD_REFLECTION_PROMPTS[mood]}</p>
      )}
      <textarea
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        placeholder={
          lowEnergyBridge
            ? 'En kort rad räcker…'
            : mood && MOOD_REFLECTION_PROMPTS[mood]
              ? MOOD_REFLECTION_PROMPTS[mood]
              : 'Kort reflektion...'
        }
        rows={4}
        className="input-glass"
      />
      <JadeGuardBanner text={text} className="mt-2" />
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
        {lowEnergyBridge && onSaveWithoutText && (
          <button
            type="button"
            disabled={saving}
            onClick={onSaveWithoutText}
            className="btn-pill--ghost text-sm"
          >
            {MABRA_BRIDGE_LABELS.skipText}
          </button>
        )}
      </div>
    </>
  );
}
