/**
 * Singleton Web Speech session — WebKit/Safari crashes with multiple instances.
 * One recognition object per app; lokalt only (ingen ljud-Blob).
 */

/** Minimal Web Speech API shapes — not in all TS lib.dom versions. */
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
  abort?: () => void;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

type SpeechRecognitionCtor = new () => SpeechRecognition;

type SessionHandlers = {
  onFinal?: (transcript: string) => void;
  onInterim?: (transcript: string) => void;
  onError?: (message: string) => void;
  onEnd?: () => void;
};

let recognition: SpeechRecognition | null = null;
let handlers: SessionHandlers | null = null;

function getCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

function getResultTranscript(result: SpeechRecognitionResult | undefined): string {
  if (!result || result.length === 0) return '';
  return result[0]?.transcript?.trim() ?? '';
}

function readResultAt(
  results: SpeechRecognitionResultList,
  index: number,
): SpeechRecognitionResult | undefined {
  try {
    return typeof results.item === 'function' ? results.item(index) : results[index];
  } catch {
    return undefined;
  }
}

function friendlySpeechError(code?: string): string {
  switch (code) {
    case 'not-allowed':
    case 'service-not-allowed':
      return 'Mikrofon nekad. Tillåt mikrofon i webbläsaren eller skriv manuellt.';
    case 'no-speech':
      return 'Inget tal hördes. Försök igen eller skriv manuellt.';
    case 'network':
      return 'Nätverksfel för röst. Skriv manuellt.';
    default:
      return 'Kunde inte ta emot röst. Försök igen eller skriv manuellt.';
  }
}

function ensureRecognition(): SpeechRecognition | null {
  const Ctor = getCtor();
  if (!Ctor) return null;

  if (recognition) return recognition;

  const instance = new Ctor();

  instance.onresult = (event: SpeechRecognitionEvent) => {
    const active = handlers;
    if (!active) return;

    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const result = readResultAt(event.results, i);
      const transcript = getResultTranscript(result);
      if (!transcript || !result) continue;

      if (result.isFinal) {
        try {
          active.onFinal?.(transcript);
        } catch {
          active.onError?.('Kunde inte spara rösttext. Skriv manuellt.');
        }
        active.onInterim?.('');
      } else {
        active.onInterim?.(transcript);
      }
    }
  };

  instance.onerror = (event: SpeechRecognitionErrorEvent) => {
    const active = handlers;
    if (!active || event.error === 'aborted') return;
    handlers = null;
    active.onError?.(friendlySpeechError(event.error));
  };

  instance.onend = () => {
    const active = handlers;
    handlers = null;
    active?.onEnd?.();
  };

  recognition = instance;
  return instance;
}

export function isSpeechRecognitionSupported(): boolean {
  return getCtor() !== null;
}

export function startSpeechSession(lang: string, nextHandlers: SessionHandlers): boolean {
  const instance = ensureRecognition();
  if (!instance || handlers) return false;

  handlers = nextHandlers;
  instance.lang = lang;
  instance.continuous = false;
  instance.interimResults = false;

  try {
    instance.start();
    return true;
  } catch {
    handlers = null;
    return false;
  }
}

export function stopSpeechSession() {
  const active = handlers;
  handlers = null;
  if (!recognition || !active) return;

  try {
    recognition.stop();
  } catch {
    try {
      recognition.abort?.();
    } catch {
      // ignore
    }
  }

  active.onEnd?.();
}
