import { ChevronLeft, ChevronRight, Mic, MicOff, Sparkles } from 'lucide-react';
import { useCallback, useRef, useEffect, useState } from 'react';
import { useSpeechToText } from '@/core/hooks/useSpeechToText';
import { getMoodDef } from '../constants/moods';
import { MABRA_BRIDGE_LABELS } from '../constants/mabraBridge';
import {
  MOOD_REFLECTION_PROMPTS,
  QUICK_WRITE_PROMPTS,
  pickRandomPrompt,
} from '../constants/moodPrompts';
import type { JournalCategoryId } from '../constants/journalCategories';
import { HandoffBox } from './HandoffBox';
import { JournalDetailsPanel } from './JournalDetailsPanel';
import { shouldShowValvHandoff } from '@/core/triggers/valvHandoff';
import { ReflectionEditor } from './ReflectionEditor';

type WriteMode = 'fritt' | 'snabb' | 'tre-ord';

type ReflectionStepProps = {
  text: string;
  mood?: string;
  category?: JournalCategoryId;
  memoryFile: File | null;
  memoryError: string | null;
  onTextChange: (text: string) => void;
  onCategoryChange: (category: JournalCategoryId | undefined) => void;
  onMemoryFileChange: (file: File | null) => void;
  onMemoryValidationError: (message: string | null) => void;
  onBack: () => void;
  onContinue: () => void;
  lowEnergyBridge?: boolean;
  onSaveWithoutText?: () => void;
  saving?: boolean;
};

export function ReflectionStep({
  text,
  mood = '',
  category,
  memoryFile,
  memoryError,
  onTextChange,
  onCategoryChange,
  onMemoryFileChange,
  onMemoryValidationError,
  onBack,
  onContinue,
  lowEnergyBridge = false,
  onSaveWithoutText,
  saving = false,
}: ReflectionStepProps) {
  const [mode, setMode] = useState<WriteMode>('fritt');
  const moodDef = getMoodDef(mood);
  const moodPrompt = mood && MOOD_REFLECTION_PROMPTS[mood];

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

  const applyPrompt = (prompt: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      onTextChange(`${prompt} `);
      return;
    }
    if (trimmed.includes(prompt)) return;
    onTextChange(`${trimmed}\n${prompt} `);
  };

  const canContinue =
    mode === 'tre-ord' ? text.trim().split(/\s+/).filter(Boolean).length > 0 : text.trim().length > 0;
  const showHandoff = shouldShowValvHandoff(text);

  return (
    <div className="reflektion-panel">
      <p className="reflektion-panel__lead">
        {moodDef ? (
          <>
            <span aria-hidden>{moodDef.emoji}</span> Skriv om <strong>{moodDef.label}</strong>
          </>
        ) : (
          'Skriv om dagen'
        )}
      </p>
      {moodPrompt && <p className="reflektion-panel__hint">{moodPrompt}</p>}

      <div className="reflektion-write-tabs" role="tablist" aria-label="Sätt att skriva">
        {(
          [
            { id: 'fritt' as const, label: 'Fritt' },
            { id: 'snabb' as const, label: 'Snabbstart' },
            { id: 'tre-ord' as const, label: 'Tre ord' },
          ] as const
        ).map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mode === id}
            className={`reflektion-write-tabs__tab ${mode === id ? 'reflektion-write-tabs__tab--active' : ''}`}
            onClick={() => setMode(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'fritt' && (
        <ReflectionEditor
          text={text}
          onChange={onTextChange}
          placeholder={
            lowEnergyBridge
              ? 'En kort rad räcker...'
              : moodPrompt ?? 'Skriv vad du vill – ingen perfekt text.'
          }
        />
      )}

      {mode === 'snabb' && (
        <div className="reflektion-snabb">
          <p className="reflektion-panel__hint">Tryck en start - redigera sedan om du vill.</p>
          <div className="reflektion-prompt-grid">
            {QUICK_WRITE_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                className="reflektion-prompt-chip"
                onClick={() => applyPrompt(p)}
              >
                {p}
              </button>
            ))}
            {moodPrompt && (
              <button
                type="button"
                className="reflektion-prompt-chip reflektion-prompt-chip--mood"
                onClick={() => applyPrompt(moodPrompt)}
              >
                {moodPrompt}
              </button>
            )}
          </div>
          <button
            type="button"
            className="reflektion-shuffle"
            onClick={() => applyPrompt(pickRandomPrompt())}
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Ge mig ett förslag
          </button>
          <textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Din text växer här"
            rows={3}
            className="input-glass reflektion-textarea mt-3"
          />
        </div>
      )}

      {mode === 'tre-ord' && (
        <div className="reflektion-tre-ord">
          <p className="reflektion-panel__hint">Max tre ord – det räcker.</p>
          <input
            type="text"
            value={text}
            onChange={(e) => {
              const words = e.target.value.trim().split(/\s+/).filter(Boolean);
              onTextChange(words.slice(0, 3).join(' '));
            }}
            placeholder="t.ex. trött men okej"
            className="input-glass reflektion-tre-ord__input"
            maxLength={48}
          />
          <p className="reflektion-tre-ord__count">
            {text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0}/3 ord
          </p>
        </div>
      )}

      {supported && (
        <div className="reflektion-voice">
          <button
            type="button"
            onClick={isListening ? stop : start}
            className="btn-pill--ghost"
            aria-pressed={isListening}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {isListening ? 'Stoppa' : 'Prata in'}
          </button>
          {interim && <span className="text-xs text-text-dim">Hör: {interim}</span>}
        </div>
      )}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}

      {showHandoff && <HandoffBox className="mt-4" sourceText={text} />}

      <JournalDetailsPanel
        category={category}
        memoryFile={memoryFile}
        memoryError={memoryError}
        disabled={saving}
        textTouched={text.trim().length > 0}
        onCategoryChange={onCategoryChange}
        onMemoryFileChange={onMemoryFileChange}
        onMemoryValidationError={onMemoryValidationError}
      />

      <div className="reflektion-actions">
        <button type="button" onClick={onBack} className="btn-pill--ghost">
          <ChevronLeft className="h-4 w-4" /> Tillbaka
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="btn-pill--secondary"
        >
          Nästa <ChevronRight className="h-4 w-4" />
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
    </div>
  );
}
