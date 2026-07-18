/** @locked MOD-SHARED-MEDIA */
import { Search, LayoutList, Images } from 'lucide-react';
import { Input } from '@/design-system';
import { MOOD_CATALOG } from '../constants/moods';
import { JOURNAL_CATEGORIES } from '../constants/journalCategories';
import type { JournalEntry } from '../types/journal';
import { journalCategoriesInEntries } from '../utils/filterJournalEntries';
import type { JournalArchiveViewMode } from './JournalEntryCard';

export type ArchiveToolbarState = {
  query: string;
  mood: string | null;
  category: string | null;
};

type JournalArchiveToolbarProps = {
  state: ArchiveToolbarState;
  allEntries: JournalEntry[];
  filteredCount: number;
  onChange: (next: ArchiveToolbarState) => void;
  viewMode: JournalArchiveViewMode;
  onViewModeChange: (mode: JournalArchiveViewMode) => void;
};

export function JournalArchiveToolbar({
  state,
  allEntries,
  filteredCount,
  onChange,
  viewMode,
  onViewModeChange,
}: JournalArchiveToolbarProps) {
  const categoryIds = journalCategoriesInEntries(allEntries);
  const categoryOptions = JOURNAL_CATEGORIES.filter((c) => categoryIds.includes(c.id));

  const setMood = (mood: string | null) => onChange({ ...state, mood });
  const setCategory = (category: string | null) => onChange({ ...state, category });

  return (
    <div className="journal-archive-toolbar space-y-4">
      <div
        className="flex rounded-xl border border-border/50 bg-surface/40 p-1"
        role="group"
        aria-label="Arkivvy"
      >
        <button
          type="button"
          className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg text-sm transition-colors ${
            viewMode === 'tidslinje'
              ? 'bg-accent/15 text-accent'
              : 'text-text-dim hover:text-text'
          }`}
          aria-pressed={viewMode === 'tidslinje'}
          onClick={() => onViewModeChange('tidslinje')}
        >
          <LayoutList className="h-4 w-4" aria-hidden />
          Tidslinje
        </button>
        <button
          type="button"
          className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg text-sm transition-colors ${
            viewMode === 'galleri'
              ? 'bg-accent/15 text-accent'
              : 'text-text-dim hover:text-text'
          }`}
          aria-pressed={viewMode === 'galleri'}
          onClick={() => onViewModeChange('galleri')}
        >
          <Images className="h-4 w-4" aria-hidden />
          Bild + text
        </button>
      </div>

      <label className="journal-archive-search relative block">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim"
          aria-hidden
        />
        <Input
          type="search"
          value={state.query}
          onChange={(e) => onChange({ ...state, query: e.target.value })}
          placeholder="Sök bland dina tankar…"
          className="input-glass w-full py-2.5 pl-10 pr-3 text-sm"
          aria-label="Sök i dagboken"
        />
      </label>

      <div>
        <p className="reflektion-panel__hint mb-2">Filtrera på känsla</p>
        <div className="journal-archive-scroll" role="group" aria-label="Humörfilter">
          <button
            type="button"
            className={`reflektion-prompt-chip min-h-[44px] shrink-0 ${!state.mood ? 'reflektion-prompt-chip--active' : ''}`}
            aria-pressed={!state.mood}
            onClick={() => setMood(null)}
          >
            Alla
          </button>
          {MOOD_CATALOG.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`reflektion-prompt-chip min-h-[44px] shrink-0 ${state.mood === m.label ? 'reflektion-prompt-chip--active' : ''}`}
              aria-pressed={state.mood === m.label}
              onClick={() => setMood(state.mood === m.label ? null : m.label)}
            >
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>

      {categoryOptions.length > 0 && (
        <div>
          <p className="reflektion-panel__hint mb-2">Filtrera på kategori</p>
          <div className="journal-archive-scroll" role="group" aria-label="Kategorifilter">
            <button
              type="button"
              className={`reflektion-prompt-chip min-h-[44px] shrink-0 ${!state.category ? 'reflektion-prompt-chip--active' : ''}`}
              aria-pressed={!state.category}
              onClick={() => setCategory(null)}
            >
              Alla
            </button>
            {categoryOptions.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`reflektion-prompt-chip min-h-[44px] shrink-0 ${state.category === c.id ? 'reflektion-prompt-chip--active' : ''}`}
                aria-pressed={state.category === c.id}
                onClick={() => setCategory(state.category === c.id ? null : c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {allEntries.length > 0 && (
        <p className="border-t border-border/30 pt-4 mt-2 text-center text-xs text-text-dim" aria-live="polite">
          Visar {filteredCount} av {allEntries.length}
        </p>
      )}
    </div>
  );
}
