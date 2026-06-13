type SpeechRecognitionType = any; // Fallback for TypeScript without DOM types for SpeechRecognition

export class SpeechService {
  private recognition: SpeechRecognitionType | null = null;
  private onResultCallback: ((text: string, isFinal: boolean) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private onEndCallback: (() => void) | null = null;

  constructor() {
    this.init();
  }

  private init() {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech Recognition API is not supported in this browser.');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'sv-SE'; // Standard language

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      if (this.onResultCallback) {
        if (finalTranscript) {
          this.onResultCallback(finalTranscript, true);
        }
        if (interimTranscript) {
          this.onResultCallback(interimTranscript, false);
        }
      }
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (this.onErrorCallback) {
        this.onErrorCallback(event.error);
      }
    };

    this.recognition.onend = () => {
      if (this.onEndCallback) {
        this.onEndCallback();
      }
    };
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public start(
    onResult: (text: string, isFinal: boolean) => void,
    onError?: (error: string) => void,
    onEnd?: () => void
  ) {
    if (!this.recognition) return;

    this.onResultCallback = onResult;
    this.onErrorCallback = onError || null;
    this.onEndCallback = onEnd || null;

    try {
      this.recognition.start();
    } catch (e) {
      console.error('Failed to start speech recognition', e);
    }
  }

  public stop() {
    if (!this.recognition) return;
    this.recognition.stop();
  }

  public abort() {
    if (!this.recognition) return;
    this.recognition.abort();
  }
}

export const speechService = new SpeechService();
