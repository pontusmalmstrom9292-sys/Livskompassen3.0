import { Search } from 'lucide-react';
import { Input } from '@/design-system';
import { MOOD_CATALOG } from '../constants/moods';
import { JOURNAL_CATEGORIES } from '../constants/journalCategories';
import type { JournalEntry } from '../types/journal';
import { journalCategoriesInEntries } from '../utils/filterJournalEntries';

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
};

export function JournalArchiveToolbar({
  state,
  allEntries,
  filteredCount,
  onChange,
}: JournalArchiveToolbarProps) {
  const categoryIds = journalCategoriesInEntries(allEntries);
  const categoryOptions = JOURNAL_CATEGORIES.filter((c) => categoryIds.includes(c.id));

  const setMood = (mood: string | null) => onChange({ ...state, mood });
  const setCategory = (category: string | null) => onChange({ ...state, category });

  return (
    <div className="journal-archive-toolbar space-y-4">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/30 pt-4 mt-2">
          <p className="text-center text-xs text-text-dim" aria-live="polite">
            Visar {filteredCount} av {allEntries.length}
          </p>
          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-surface-3/30 px-3 py-1.5 text-xs text-text-muted transition-colors hover:border-accent/30 hover:text-text opacity-50 cursor-not-allowed"
            title="Exportera dagbok som PDF (Kommer snart)"
            disabled
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Exportera PDF
          </button>
        </div>
      )}
    </div>
  );
}
