import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button, TextArea } from '@/design-system';
import { MOOD_CATALOG, getMoodDef } from '../constants/moods';
import {
  JOURNAL_SUGGESTED_TAGS,
  JOURNAL_TAG_MAX_COUNT,
  normalizeJournalTag,
} from '../constants/journalTags';
import { HandoffBox } from './HandoffBox';
import { shouldShowValvHandoff } from '@/core/triggers/valvHandoff';
import type { JournalQuickMirrorResponse } from '../api/journalQuickMirrorService';

type JournalQuickModeProps = {
  mood: string;
  tags: string[];
  saving: boolean;
  justSaved: boolean;
  mirror: JournalQuickMirrorResponse | null;
  mirrorLoading?: boolean;
  onMoodChange: (mood: string) => void;
  onToggleTag: (tag: string) => void;
  onSave: (quickText: string, options?: { alsoToArkiv?: boolean }) => void | Promise<void>;
};

export function JournalQuickMode({
  mood,
  tags,
  saving,
  justSaved,
  mirror,
  mirrorLoading = false,
  onMoodChange,
  onToggleTag,
  onSave,
}: JournalQuickModeProps) {
  const [quickText, setQuickText] = useState('');
  const [alsoToArkiv, setAlsoToArkiv] = useState(false);
  const selected = getMoodDef(mood);
  const canSave = Boolean(mood) && !saving;
  const showHandoff = shouldShowValvHandoff(quickText);

  const handleSubmit = () => {
    if (!canSave) return;
    void onSave(quickText, { alsoToArkiv });
    setQuickText('');
    setAlsoToArkiv(false);
  };

  return (
    <div className="reflektion-panel">
      <p className="reflektion-panel__lead">Hur känns det just nu?</p>
      <p className="reflektion-panel__hint">Välj känsla — taggar och en rad är valfritt.</p>

      <label className="reflektion-field">
        <span className="reflektion-field__label">Känsla</span>
        <select
          value={mood}
          onChange={(e) => onMoodChange(e.target.value)}
          className="reflektion-feeling-select"
          aria-label="Välj känsla"
        >
          <option value="">Välj känsla…</option>
          {MOOD_CATALOG.map((m) => (
            <option key={m.id} value={m.label}>
              {m.label}
            </option>
          ))}
        </select>
      </label>

      {selected && (
        <p className="reflektion-mood-selected">
          Vald: <strong>{selected.label}</strong>
        </p>
      )}

      <label className="reflektion-field mt-3">
        <span className="reflektion-field__label">
          Nyckelord (valfritt, max {JOURNAL_TAG_MAX_COUNT})
        </span>
        <select
          className="reflektion-feeling-select"
          value=""
          disabled={tags.length >= JOURNAL_TAG_MAX_COUNT}
          onChange={(e) => {
            const raw = normalizeJournalTag(e.target.value);
            if (raw && !tags.includes(raw)) onToggleTag(raw);
          }}
          aria-label="Lägg till tagg"
        >
          <option value="">Lägg till tagg…</option>
          {JOURNAL_SUGGESTED_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </label>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="chip--active text-xs"
              onClick={() => onToggleTag(tag)}
            >
              {tag} ×
            </button>
          ))}
        </div>
      )}

      <label className="mt-4 block">
        <span className="sr-only">Snabb rad</span>
        <TextArea
          value={quickText}
          onChange={(e) => setQuickText(e.target.value)}
          placeholder="Skriv en snabb rad (valfritt)…"
          rows={2}
          className="input-glass reflektion-textarea"
        />
      </label>

      {showHandoff && <HandoffBox className="mt-4" sourceText={quickText} />}

      {quickText.trim().length >= 3 && (
        <label className="mt-3 flex items-start gap-2 text-xs text-text-muted">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={alsoToArkiv}
            onChange={(e) => setAlsoToArkiv(e.target.checked)}
          />
          <span>Känsligt — sortera även till arkiv (granskning vid osäkerhet)</span>
        </label>
      )}

      <div className="reflektion-actions">
        <Button type="button" variant="accent" className="w-full" disabled={!canSave} onClick={handleSubmit}>
          {saving ? (
            <>
              <Loader2 className="mr-2 inline h-4 w-4 animate-spin" aria-hidden />
              Sparar…
            </>
          ) : (
            'Spara tanken'
          )}
        </Button>
      </div>

      {justSaved && (
        <div className="mt-3 space-y-2" role="status">
          <p className="flex items-center justify-center gap-1.5 text-sm text-accent">
            <Check className="h-4 w-4" aria-hidden />
            Sparat
          </p>
          {(mirror?.mirrorLine || mirrorLoading) && (
            <p className="rounded-xl border border-border-strong bg-surface/30 px-3 py-2 text-center text-sm text-text-muted">
              {mirror?.mirrorLine ??
                'Ett ögonblick — speglingen kommer strax.'}
            </p>
          )}
          {mirror?.microStep && (
            <p className="text-center text-xs text-text-muted">{mirror.microStep}</p>
          )}
          {mirror?.suggestMode === 'reflektera' && (
            <p className="text-center text-xs text-accent">Vill du skriva mer kan du byta till Reflektera.</p>
          )}
        </div>
      )}
    </div>
  );
}
