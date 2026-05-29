import { formatJournalDate } from '../utils/formatJournalDate';
import { TimelineEntry } from '../../../core/ui/TimelineEntry';
import type { JournalEntry } from '../types/journal';

type JournalEntryCardProps = {
  entry: JournalEntry;
};

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const tagSuffix =
    entry.tags && entry.tags.length > 0 ? ` · ${entry.tags.slice(0, 4).join(', ')}` : '';
  const categorySuffix = entry.category ? ` / ${entry.category}` : '';

  return (
    <TimelineEntry
      as="li"
      meta={`${entry.mood}${categorySuffix} · ${formatJournalDate(entry.createdAt)}${tagSuffix}`}
      body={entry.text ?? ''}
    />
  );
}
