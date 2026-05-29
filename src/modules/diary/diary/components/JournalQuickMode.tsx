import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { MOOD_CATALOG, getMoodDef } from '../constants/moods';
import {
  JOURNAL_SUGGESTED_TAGS,
  JOURNAL_TAG_MAX_COUNT,
  normalizeJournalTag,
} from '../constants/journalTags';
type JournalQuickModeProps = {
  mood: string;
  tags: string[];
  saving: boolean;
  justSaved: boolean;
  onMoodChange: (mood: string) => void;
  onToggleTag: (tag: string) => void;
  onSave: (quickText: string) => void | Promise<void>;
};

export function JournalQuickMode({
  mood,
  tags,
  saving,
  justSaved,
  onMoodChange,
  onToggleTag,
  onSave,
}: JournalQuickModeProps) {
  const [quickText, setQuickText] = useState('');
  const selected = getMoodDef(mood);
  const canSave = Boolean(mood) && !saving;

  const handleSubmit = () => {
    if (!canSave) return;
    void onSave(quickText);
    setQuickText('');
  };

  return (
    <div className="reflektion-panel">
      <p className="reflektion-panel__lead">Hur känns det just nu?</p>
      <p className="reflektion-panel__hint">Välj känsla — taggar och en rad är valfritt.</p>

      <div className="reflektion-mood-grid" role="group" aria-label="Välj känsla">
        {MOOD_CATALOG.map((m) => {
          const active = mood === m.label;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onMoodChange(m.label)}
              className={`reflektion-mood-card reflektion-mood-card--${m.tone} ${
                active ? 'reflektion-mood-card--active' : ''
              }`}
              aria-pressed={active}
            >
              <span className="reflektion-mood-card__emoji" aria-hidden>
                {m.emoji}
              </span>
              <span className="reflektion-mood-card__label">{m.label}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <p className="reflektion-mood-selected">
          Vald: <strong>{selected.label}</strong>
        </p>
      )}

      <p className="reflektion-panel__hint mt-4">Välj några nyckelord (valfritt)</p>
      <div className="reflektion-prompt-grid" role="group" aria-label="Taggar">
        {JOURNAL_SUGGESTED_TAGS.map((tag) => {
          const active = tags.includes(tag);
          const atLimit = !active && tags.length >= JOURNAL_TAG_MAX_COUNT;
          return (
            <button
              key={tag}
              type="button"
              disabled={atLimit}
              className={`reflektion-prompt-chip ${active ? 'reflektion-prompt-chip--active' : ''}`}
              aria-pressed={active}
              onClick={() => onToggleTag(normalizeJournalTag(tag))}
            >
              {active ? '✓ ' : '+ '}
              {tag}
            </button>
          );
        })}
      </div>

      <label className="mt-4 block">
        <span className="sr-only">Snabb rad</span>
        <textarea
          value={quickText}
          onChange={(e) => setQuickText(e.target.value)}
          placeholder="Skriv en snabb rad (valfritt)…"
          rows={2}
          className="input-glass reflektion-textarea"
        />
      </label>

      <div className="reflektion-actions">
        <button
          type="button"
          className="btn-pill--primary w-full"
          disabled={!canSave}
          onClick={handleSubmit}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" aria-hidden />
              Sparar…
            </>
          ) : (
            'Spara tanken'
          )}
        </button>
      </div>

      {justSaved && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-sm text-accent" role="status">
          <Check className="h-4 w-4" aria-hidden />
          Sparat
        </p>
      )}
    </div>
  );
}
