import { useCallback, useEffect, useRef, useState } from 'react';
import {
  isSpeechRecognitionSupported,
  startSpeechSession,
  stopSpeechSession,
} from '../lib/speechRecognitionSession';

type UseSpeechToTextOptions = {
  lang?: string;
  onFinal?: (transcript: string) => void;
};

export function useSpeechToText({ lang = 'sv-SE', onFinal }: UseSpeechToTextOptions = {}) {
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const listeningRef = useRef(false);
  const supported = isSpeechRecognitionSupported();

  const onFinalRef = useRef(onFinal);
  onFinalRef.current = onFinal;

  const stop = useCallback(() => {
    listeningRef.current = false;
    stopSpeechSession();
    if (mountedRef.current) {
      setIsListening(false);
      setInterim('');
    }
  }, []);

  const start = useCallback(() => {
    if (!supported || listeningRef.current) return;

    const started = startSpeechSession(lang, {
      onFinal: (transcript) => {
        onFinalRef.current?.(transcript);
      },
      onInterim: (transcript) => {
        if (mountedRef.current) setInterim(transcript);
      },
      onError: (message) => {
        listeningRef.current = false;
        if (mountedRef.current) {
          setError(message);
          setIsListening(false);
          setInterim('');
        }
      },
      onEnd: () => {
        listeningRef.current = false;
        if (mountedRef.current) {
          setIsListening(false);
          setInterim('');
        }
      },
    });

    if (!started) {
      if (mountedRef.current) {
        setError('Kunde inte starta röst. Försök igen eller skriv manuellt.');
        setIsListening(false);
      }
      return;
    }

    listeningRef.current = true;
    if (mountedRef.current) {
      setError(null);
      setIsListening(true);
    }
  }, [lang, supported]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (listeningRef.current) stopSpeechSession();
      listeningRef.current = false;
    };
  }, []);

  return { supported, isListening, interim, error, start, stop };
};
