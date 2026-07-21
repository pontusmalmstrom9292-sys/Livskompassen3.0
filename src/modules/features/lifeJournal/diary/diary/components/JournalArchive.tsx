import { useEffect, useMemo, useState } from 'react';
import { Pin } from 'lucide-react';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
import type { JournalEntry } from '../types/journal';
import {
  filterJournalEntries,
  groupJournalEntriesByDay,
} from '../utils/filterJournalEntries';
import { JournalArchiveToolbar, type ArchiveToolbarState } from './JournalArchiveToolbar';
import { JournalEntryCard, type JournalArchiveViewMode } from './JournalEntryCard';

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
  const [viewMode, setViewMode] = useState<JournalArchiveViewMode>('tidslinje');

  const filtered = useMemo(
    () => filterJournalEntries(entries, filters),
    [entries, filters],
  );

  const groups = useMemo(() => groupJournalEntriesByDay(filtered), [filtered]);

  const flatFiltered = useMemo(() => groups.flatMap((g) => g.entries), [groups]);

  const pinnedEntries = useMemo(() => flatFiltered.filter((e) => e.isPinned), [flatFiltered]);
  const unpinnedFlat = useMemo(() => flatFiltered.filter((e) => !e.isPinned), [flatFiltered]);

  const visible = unpinnedFlat.slice(0, visibleCount);
  const hasMore = unpinnedFlat.length > visibleCount;

  const visibleIds = new Set(visible.map((e) => e.id));
  const visibleGroups = groups
    .map((group) => ({
      ...group,
      entries: group.entries.filter((entry) => visibleIds.has(entry.id)),
    }))
    .filter((group) => group.entries.length > 0);

  useEffect(() => {
    setVisibleCount(pageSize);
  }, [filters.query, filters.mood, filters.category, pageSize, viewMode]);

  const toolbar = (
    <JournalArchiveToolbar
      state={filters}
      allEntries={entries}
      filteredCount={filtered.length}
      onChange={setFilters}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    />
  );

  const listBody =
    entries.length === 0 ? (
      <EmptyState title="Tidslinjen är tom" message="Inga poster ännu." />
    ) : filtered.length === 0 ? (
      <EmptyState
        title="Inga träffar i filtret"
        message="Inga träffar — prova ett annat sökord eller filter."
      />
    ) : (
      <>
        {pinnedEntries.length > 0 && (
          <div className="mb-8 space-y-3">
            <h3 className="flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-accent">
              <Pin className="h-3.5 w-3.5 fill-current" />
              Fästa Händelser
            </h3>
            <ul className={viewMode === 'galleri' ? 'grid gap-4 sm:grid-cols-2' : 'space-y-3'}>
              {pinnedEntries.map((entry) => (
                <JournalEntryCard key={entry.id} entry={entry} viewMode={viewMode} />
              ))}
            </ul>
          </div>
        )}
        <div className="space-y-6">
          {visibleGroups.map((group) => (
            <section key={group.dayKey} aria-labelledby={`journal-day-${group.dayKey}`}>
              <h3
                id={`journal-day-${group.dayKey}`}
                className="journal-archive-day mb-3 text-xs font-medium uppercase tracking-widest text-text-dim"
              >
                {group.label}
              </h3>
              <ul className={viewMode === 'galleri' ? 'grid gap-4 sm:grid-cols-2' : 'space-y-3'}>
                {group.entries.map((entry) => (
                  <JournalEntryCard key={entry.id} entry={entry} viewMode={viewMode} />
                ))}
              </ul>
            </section>
          ))}
        </div>
        {hasMore && (
          <Button
            type="button"
            variant="ghost"
            className="mt-6 w-full"
            onClick={() => setVisibleCount((n) => n + pageSize)}
          >
            Visa fler ({unpinnedFlat.length - visibleCount} kvar)
          </Button>
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
