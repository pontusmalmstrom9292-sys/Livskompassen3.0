import { formatJournalDate } from '../utils/formatJournalDate';
import { TimelineEntry } from '../../core/ui/TimelineEntry';
import type { JournalEntry } from '../types/journal';

type JournalEntryCardProps = {
  entry: JournalEntry;
};

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  return (
    <TimelineEntry
      as="li"
      meta={`${entry.mood} · ${formatJournalDate(entry.createdAt)}`}
      body={entry.text ?? ''}
    />
  );
}
