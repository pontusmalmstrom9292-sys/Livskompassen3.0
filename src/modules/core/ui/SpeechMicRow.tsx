import { Mic, MicOff } from 'lucide-react';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { Button } from '@/design-system';

type Props = {
  onAppend: (transcript: string) => void;
  className?: string;
};

/** Delad mikrofon-rad — använder singleton speech session. */
export function SpeechMicRow({ onAppend, className = '' }: Props) {
  const { supported, isListening, interim, error, start, stop } = useSpeechToText({
    lang: 'sv-SE',
    onFinal: onAppend,
  });

  if (!supported) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <Button type="button" onClick={isListening ? stop : start} variant="ghost" className="--ghost text-sm" aria-pressed={isListening}>
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        {isListening ? 'Stoppa röst' : 'Tala in (sv-SE)'}
      </Button>
      {interim && <span className="text-xs text-text-muted">Hör: {interim}</span>}
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
