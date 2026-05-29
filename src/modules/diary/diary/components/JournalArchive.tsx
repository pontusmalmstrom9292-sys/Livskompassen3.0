import { useState } from 'react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { EmptyState } from '../../../core/ui/EmptyState';
import type { JournalEntry } from '../types/journal';
import { JournalEntryCard } from './JournalEntryCard';

type JournalArchiveProps = {
  entries: JournalEntry[];
  pageSize?: number;
  /** Inbäddad i Dagbok-kort utan extra BentoCard. */
  bare?: boolean;
};

export function JournalArchive({ entries, pageSize = 5, bare = false }: JournalArchiveProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const visible = entries.slice(0, visibleCount);
  const hasMore = entries.length > visibleCount;

  const body =
    visible.length === 0 ? (
      <EmptyState message="Inga poster ännu." />
    ) : (
      <>
        <ul className="space-y-3">
          {visible.map((entry) => (
            <JournalEntryCard key={entry.id} entry={entry} />
          ))}
        </ul>
        {hasMore && (
          <button
            type="button"
            onClick={() => setVisibleCount((n) => n + pageSize)}
            className="btn-pill--ghost mt-4"
          >
            Visa fler ({entries.length - visibleCount} kvar)
          </button>
        )}
      </>
    );

  if (bare) return body;

  return <BentoCard title="Tidslinje">{body}</BentoCard>;
}
