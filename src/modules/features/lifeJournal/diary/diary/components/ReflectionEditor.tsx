import { useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useDiaryStore } from '../store/diaryStore';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { BiffRewriteButton } from '@/shared/ui/BiffRewriteButton';

interface ReflectionEditorProps {
  text: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function ReflectionEditor({ 
  text, 
  onChange, 
  placeholder = 'Skriv vad du vill – ingen perfekt text.' 
}: ReflectionEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const setDiaryDraft = useDiaryStore((s) => s.setDiaryDraft);

  const handleFinalTranscript = useCallback((finalText: string) => {
    onChange(text ? `${text} ${finalText}` : finalText);
  }, [text, onChange]);

  const {
    isListening,
    interimText,
    isSupported,
    error,
    toggleListening
  } = useSpeechToText({
    onFinalTranscript: handleFinalTranscript
  });

  // Auto-expand textarea baserat på innehåll
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text, interimText]);

  // Avstudsad autosparning till Zustand (500ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDiaryDraft(text);
    }, 500);

    return () => clearTimeout(handler);
  }, [text, setDiaryDraft]);

  return (
    <div className="relative mt-2">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-glass w-full resize-none overflow-hidden reflektion-textarea min-h-[120px] pb-12"
      />

      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        {error && <span className="text-xs text-destructive/80">{error}</span>}
        <BiffRewriteButton text={text} onRewrite={onChange} context="dagbok" />
        {isSupported && (
          <button
            type="button"
            onClick={toggleListening}
            className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
              isListening
                ? 'bg-accent/20 text-accent animate-pulse'
                : 'bg-surface/50 text-text-muted hover:bg-surface hover:text-accent'
            }`}
            title={isListening ? 'Sluta lyssna' : 'Starta röstinmatning'}
            aria-label="Röstinmatning"
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </button>
        )}
      </div>

      {interimText && (
        <div className="mt-2 text-sm text-text-muted italic px-2">
          {interimText}...
        </div>
      )}
    </div>
  );
}
