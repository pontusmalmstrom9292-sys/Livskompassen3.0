import { ChevronLeft, ChevronRight, Mic, MicOff, Sparkles } from 'lucide-react';
import { useCallback, useRef, useEffect, useState } from 'react';
import { Button, Input, TextArea } from '@/design-system';
import { useSpeechToText } from '@/core/hooks/useSpeechToText';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { getMoodDef } from '../constants/moods';
import { MABRA_BRIDGE_LABELS } from '../constants/mabraBridge';
import {
  MOOD_REFLECTION_PROMPTS,
  QUICK_WRITE_PROMPTS,
  pickRandomPrompt,
} from '../constants/moodPrompts';
import type { JournalCategoryId } from '../constants/journalCategories';
import type { PendingCaptionedMedia } from '@/modules/shared/media';
import { HandoffBox } from './HandoffBox';
import { JournalDetailsPanel } from './JournalDetailsPanel';
import { shouldShowValvHandoff } from '@/core/triggers/valvHandoff';
import { ReflectionEditor } from './ReflectionEditor';

type WriteMode = 'fritt' | 'snabb' | 'tre-ord';

type ReflectionStepProps = {
  text: string;
  mood?: string;
  category?: JournalCategoryId;
  memoryItems: PendingCaptionedMedia[];
  memoryError: string | null;
  onTextChange: (text: string) => void;
  onCategoryChange: (category: JournalCategoryId | undefined) => void;
  onMemoryItemsChange: (items: PendingCaptionedMedia[]) => void;
  onMemoryValidationError: (message: string | null) => void;
  onBack: () => void;
  onContinue: () => void;
  lowEnergyBridge?: boolean;
  lowCapacity?: boolean;
  validateOnly?: boolean;
  onValidateOnlyChange?: (val: boolean) => void;
  onSaveWithoutText?: () => void;
  saving?: boolean;
};

export function ReflectionStep({
  text,
  mood = '',
  category,
  memoryItems,
  memoryError,
  onTextChange,
  onCategoryChange,
  onMemoryItemsChange,
  onMemoryValidationError,
  onBack,
  onContinue,
  lowEnergyBridge = false,
  lowCapacity = false,
  validateOnly = false,
  onValidateOnlyChange,
  onSaveWithoutText,
  saving = false,
}: ReflectionStepProps) {
  const [mode, setMode] = useState<WriteMode>(lowCapacity ? 'tre-ord' : 'fritt');
  const moodDef = getMoodDef(mood);
  const moodPrompt = mood && MOOD_REFLECTION_PROMPTS[mood];

  useEffect(() => {
    if (lowCapacity && mode === 'fritt') {
      setMode('tre-ord');
    }
  }, [lowCapacity, mode]);

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

  const writeModes = [
    { id: 'fritt' as const, label: 'Fritt' },
    { id: 'snabb' as const, label: 'Snabbstart' },
    { id: 'tre-ord' as const, label: 'Tre ord' },
  ] as const;

  const handleWriteTabKeyDown = (event: React.KeyboardEvent, tabId: WriteMode) => {
    const index = writeModes.findIndex((m) => m.id === tabId);
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      const delta = event.key === 'ArrowRight' ? 1 : -1;
      const next = writeModes[(index + delta + writeModes.length) % writeModes.length]!;
      setMode(next.id);
      const tabEl = document.getElementById(`reflektion-write-tab-${next.id}`);
      tabEl?.focus();
    }
  };

  return (
    <div className="reflektion-panel" role="region" aria-labelledby="reflection-step-title">
      <p id="reflection-step-title" className="reflektion-panel__lead">
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
        {writeModes.map(({ id, label }) => (
          <button
            key={id}
            id={`reflektion-write-tab-${id}`}
            type="button"
            role="tab"
            aria-selected={mode === id}
            aria-controls={`reflektion-write-panel-${id}`}
            tabIndex={mode === id ? 0 : -1}
            className={`reflektion-write-tabs__tab min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${mode === id ? 'reflektion-write-tabs__tab--active' : ''}`}
            onClick={() => setMode(id)}
            onKeyDown={(e) => handleWriteTabKeyDown(e, id)}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'fritt' && (
        <div id="reflektion-write-panel-fritt" role="tabpanel" aria-labelledby="reflektion-write-tab-fritt">
        <ReflectionEditor
          text={text}
          onChange={onTextChange}
          placeholder={
            lowCapacity
              ? 'Vad är det minsta som skaver just nu?'
              : lowEnergyBridge
                ? 'En kort rad räcker...'
                : moodPrompt ?? 'Skriv vad du vill – ingen perfekt text.'
          }
        />
        </div>
      )}

      {mode === 'snabb' && (
        <div id="reflektion-write-panel-snabb" role="tabpanel" aria-labelledby="reflektion-write-tab-snabb">
        <div className="reflektion-snabb">
          <p className="reflektion-panel__hint">Tryck en start - redigera sedan om du vill.</p>
          <div className="reflektion-prompt-grid">
            {QUICK_WRITE_PROMPTS.map((p) => (
              <button
                key={p}
                type="button"
                className="reflektion-prompt-chip min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                onClick={() => applyPrompt(p)}
              >
                {p}
              </button>
            ))}
            {moodPrompt && (
              <button
                type="button"
                className="reflektion-prompt-chip reflektion-prompt-chip--mood min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                onClick={() => applyPrompt(moodPrompt)}
              >
                {moodPrompt}
              </button>
            )}
          </div>
          <button
            type="button"
            className="reflektion-shuffle min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            onClick={() => applyPrompt(pickRandomPrompt())}
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Ge mig ett förslag
          </button>
          <TextArea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Din text växer här"
            rows={3}
            className="input-glass neu-inset reflektion-textarea mt-3 resize-none"
          />
        </div>
        </div>
      )}

      {mode === 'tre-ord' && (
        <div id="reflektion-write-panel-tre-ord" role="tabpanel" aria-labelledby="reflektion-write-tab-tre-ord">
        <div className="reflektion-tre-ord">
          <p className="reflektion-panel__hint">Max tre ord – det räcker.</p>
          <Input
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
        </div>
      )}

      {supported && (
        <CalmCollapsible title="Röstinmatning" meta="Valfritt" defaultOpen={false} glow="gold">
          <div className="reflektion-voice">
            <Button
              type="button"
              variant="ghost"
              className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
              onClick={isListening ? stop : start}
              aria-pressed={isListening}
              aria-label={isListening ? 'Stoppa röstinmatning' : 'Prata in'}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              {isListening ? 'Stoppa' : 'Prata in'}
            </Button>
            {interim && <span className="text-xs text-text-muted">Hör: {interim}</span>}
          </div>
          {error ? <p className="mt-1 text-xs text-danger" role="alert">{error}</p> : null}
        </CalmCollapsible>
      )}

      {showHandoff && (
        <CalmCollapsible title="Vid gaslighting" meta="Valv-handoff" defaultOpen={false} glow="gold">
          <HandoffBox sourceText={text} />
        </CalmCollapsible>
      )}

      <JournalDetailsPanel
        category={category}
        memoryItems={memoryItems}
        memoryError={memoryError}
        disabled={saving}
        textTouched={text.trim().length > 0}
        onCategoryChange={onCategoryChange}
        onMemoryItemsChange={onMemoryItemsChange}
        onMemoryValidationError={onMemoryValidationError}
      />

      <div className="mt-4 mb-4 flex items-center justify-center gap-2">
        <input
          type="checkbox"
          id="validateOnly"
          checked={validateOnly}
          onChange={(e) => onValidateOnlyChange?.(e.target.checked)}
          className="checkbox-glass"
        />
        <label htmlFor="validateOnly" className="text-sm text-text-muted cursor-pointer select-none">
          Bara lyssna (inga råd eller lösningar)
        </label>
      </div>

      <div className="reflektion-actions">
        <Button type="button" variant="ghost" className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" /> Tillbaka
        </Button>
        <Button type="button" variant="secondary" className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" disabled={!canContinue} onClick={onContinue} aria-keyshortcuts="Enter">
          Nästa <ChevronRight className="h-4 w-4" />
        </Button>
        {lowEnergyBridge && onSaveWithoutText && (
          <Button type="button" variant="ghost" size="sm" className="min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40" disabled={saving} onClick={onSaveWithoutText}>
            {MABRA_BRIDGE_LABELS.skipText}
          </Button>
        )}
      </div>
    </div>
  );
}
