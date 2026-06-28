import { useEffect, useMemo, useState } from 'react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
import type { JournalEntry } from '../types/journal';
import {
  filterJournalEntries,
  groupJournalEntriesByDay,
} from '../utils/filterJournalEntries';
import { JournalArchiveToolbar, type ArchiveToolbarState } from './JournalArchiveToolbar';
import { JournalEntryCard } from './JournalEntryCard';
import { Pin } from 'lucide-react';

const DEFAULT_FILTERS: ArchiveToolbarState = {
  query: '',
  mood: null,
  category: null,
};

type JournalArchiveProps = {
  entries: JournalEntry[];
  pageSize?: number;
  /** Inbäddad i Dagbok-kort utan extra BentoCard. */
  bare?: boolean;
};

export function JournalArchive({ entries, pageSize = 5, bare = false }: JournalArchiveProps) {
  const [filters, setFilters] = useState<ArchiveToolbarState>(DEFAULT_FILTERS);
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const filtered = useMemo(
    () => filterJournalEntries(entries, filters),
    [entries, filters],
  );

  const groups = useMemo(() => groupJournalEntriesByDay(filtered), [filtered]);

  const flatFiltered = useMemo(() => groups.flatMap((g) => g.entries), [groups]);
  
  const pinnedEntries = useMemo(() => flatFiltered.filter(e => e.isPinned), [flatFiltered]);
  const unpinnedFlat = useMemo(() => flatFiltered.filter(e => !e.isPinned), [flatFiltered]);
  
  const visible = unpinnedFlat.slice(0, visibleCount);
  const hasMore = unpinnedFlat.length > visibleCount;

  const visibleIds = new Set(visible.map((e) => e.id));

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [filters.query, filters.mood, filters.category, pageSize]);

  const toolbar = (
    <JournalArchiveToolbar
      state={filters}
      allEntries={entries}
      filteredCount={filtered.length}
      onChange={setFilters}
    />
  );

  const listBody =
    entries.length === 0 ? (
      <EmptyState message="Inga poster ännu." />
    ) : filtered.length === 0 ? (
      <EmptyState message="Inga träffar — prova ett annat sökord eller filter." />
    ) : (
      <>
        {pinnedEntries.length > 0 && (
          <div className="mb-8 space-y-3">
            <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-accent">
              <Pin className="h-3.5 w-3.5 fill-current" />
              Fästa Händelser
            </h3>
            <ul className="space-y-3">
              {pinnedEntries.map((entry) => (
                <JournalEntryCard key={entry.id} entry={entry} />
              ))}
            </ul>
          </div>
        )}
        <div className="space-y-6">
          {groups.map((group) => {
            const groupVisible = group.entries.filter((e) => visibleIds.has(e.id));
            if (groupVisible.length === 0) return null;
            return (
              <section key={group.dayKey} aria-labelledby={`journal-day-${group.dayKey}`}>
                <h3
                  id={`journal-day-${group.dayKey}`}
                  className="journal-archive-day mb-3 text-xs font-medium uppercase tracking-widest text-text-dim"
                >
                  {group.label}
                </h3>
                <ul className="space-y-3">
                  {groupVisible.map((entry) => (
                    <JournalEntryCard key={entry.id} entry={entry} />
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
        {hasMore && (
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + pageSize)}
            className="ds-btn ds-btn--ghost mt-6 w-full"
          >
            Visa fler ({unpinnedFlat.length - visibleCount} kvar)
          </button>
        )}
      </>
    );

  const body = (
    <>
      {toolbar}
      <div className="mt-4">{listBody}</div>
    </>
  );

  if (bare) return body;

  return <BentoCard title="Tidslinje">{body}</BentoCard>;
}
