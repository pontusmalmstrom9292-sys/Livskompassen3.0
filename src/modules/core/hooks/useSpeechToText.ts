import { useCallback, useEffect, useRef, useState } from 'react';

type SpeechRecognitionCtor = new () => SpeechRecognition;

function getSpeechRecognition(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

type UseSpeechToTextOptions = {
  lang?: string;
  onFinal?: (transcript: string) => void;
};

export function useSpeechToText({ lang = 'sv-SE', onFinal }: UseSpeechToTextOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const supported = getSpeechRecognition() !== null;

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setInterim('');
  }, []);

  const start = useCallback(() => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      setError('Röst-till-text stöds inte i denna webbläsare.');
      return;
    }

    setError(null);
    stop();

    const recognition = new Ctor();
    recognition.lang = lang;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let chunk = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        chunk += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          onFinal?.(chunk.trim());
          setInterim('');
        } else {
          setInterim(chunk.trim());
        }
      }
    };

    recognition.onerror = () => {
      setError('Kunde inte ta emot röst. Försök igen eller skriv manuellt.');
      stop();
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterim('');
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [lang, onFinal, stop]);

  useEffect(() => () => stop(), [stop]);

  return { supported, isListening, interim, error, start, stop };
}
