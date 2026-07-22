import { useEffect, useRef, useCallback, useState } from 'react';
import { Mic, MicOff, Sparkles } from 'lucide-react';
import { TextArea } from '@/design-system';
import { useDiaryStore } from '../store/diaryStore';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { BiffRewriteButton } from '@/shared/ui/BiffRewriteButton';
import { fetchJournalSilentReflection } from '../api/journalSilentReflectionService';

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
  const [silentLoading, setSilentLoading] = useState(false);
  const [silentPrompt, setSilentPrompt] = useState<string | null>(null);

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

  const handleSilentReflection = useCallback(async () => {
    setSilentLoading(true);
    try {
      const prompt = await fetchJournalSilentReflection(text.slice(0, 80));
      if (prompt) {
        setSilentPrompt(prompt);
        if (!text.trim()) onChange(prompt);
      }
    } finally {
      setSilentLoading(false);
    }
  }, [text, onChange]);

  return (
    <div className="relative mt-2">
      {silentPrompt && (
        <p className="mb-2 text-xs text-text-muted italic">{silentPrompt}</p>
      )}
      <TextArea
        ref={textareaRef}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-glass w-full resize-none overflow-hidden reflektion-textarea min-h-[120px] pb-12"
      />

      <div className="absolute bottom-3 right-3 flex items-center gap-2">
        {error && <span className="text-xs text-destructive/80">{error}</span>}
        <BiffRewriteButton text={text} onRewrite={onChange} context="dagbok" />
        <button
          type="button"
          onClick={() => void handleSilentReflection()}
          disabled={silentLoading}
          className="flex min-h-11 items-center gap-1 rounded-full bg-surface/50 px-2 text-[10px] uppercase tracking-wider text-text-muted hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          title="Tyst reflektion — ephemeral, sparas inte"
          aria-label="Tyst reflektion"
        >
          {silentLoading ? <MicOff className="h-3 w-3 animate-pulse" aria-hidden /> : <Sparkles className="h-3 w-3" aria-hidden />}
          Tyst
        </button>
        {isSupported && (
          <button
            type="button"
            onClick={toggleListening}
            className={`flex min-h-11 min-w-11 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
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
