import { useMemo, useState } from 'react';
import { clsx } from 'clsx';
import { EmptyState } from '../../core/ui/EmptyState';
import { MOOD_OPTIONS } from '../constants/moods';
import type { JournalEntry } from '../types/journal';
import { JournalEntryCard } from './JournalEntryCard';

type JournalArchiveProps = {
  entries: JournalEntry[];
  pageSize?: number;
};

export function JournalArchive({ entries, pageSize = 8 }: JournalArchiveProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const [filter, setFilter] = useState<string | 'all'>('all');

  const filtered = useMemo(() => {
    if (filter === 'all') return entries;
    return entries.filter((e) => e.mood === filter);
  }, [entries, filter]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = filtered.length > visibleCount;

  return (
    <section className="dagbok-archive glass-card p-4" aria-label="Tidslinje">
      <div className="dagbok-archive__head">
        <h2 className="font-display text-sm font-semibold text-accent">Tidslinje</h2>
        <p className="text-xs text-text-dim">{entries.length} poster totalt</p>
      </div>

      <div className="dagbok-archive__filters" role="group" aria-label="Filtrera humör">
        <button
          type="button"
          className={clsx('dagbok-filter-chip', filter === 'all' && 'dagbok-filter-chip--active')}
          onClick={() => {
            setFilter('all');
            setVisibleCount(pageSize);
          }}
        >
          Alla
        </button>
        {MOOD_OPTIONS.map((m) => (
          <button
            key={m}
            type="button"
            className={clsx(
              'dagbok-filter-chip',
              filter === m && 'dagbok-filter-chip--active',
            )}
            onClick={() => {
              setFilter(m);
              setVisibleCount(pageSize);
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <EmptyState message={filter === 'all' ? 'Inga poster ännu.' : `Inga poster med humör ${filter}.`} />
      ) : (
        <>
          <ul className="dagbok-archive__list">
            {visible.map((entry) => (
              <JournalEntryCard key={entry.id} entry={entry} />
            ))}
          </ul>
          {hasMore && (
            <button
              type="button"
              onClick={() => setVisibleCount((n) => n + pageSize)}
              className="btn-pill--ghost mt-4 w-full text-sm"
            >
              Visa fler ({filtered.length - visibleCount} kvar)
            </button>
          )}
        </>
      )}
    </section>
  );
}
