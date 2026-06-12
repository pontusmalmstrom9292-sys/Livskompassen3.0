import { useEffect, useRef } from 'react';
import { Mic } from 'lucide-react';
import { useDiaryStore } from '../store/diaryStore';

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

  // Auto-expand textarea baserat på innehåll
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

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
      
      {/* Framtida röstinmatning platsmarkör */}
      <div className="absolute bottom-3 right-3 flex items-center">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-surface/50 text-text-muted hover:bg-surface hover:text-accent transition-colors"
          title="Röstinmatning kommer snart"
          aria-label="Röstinmatning"
        >
          <Mic className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
