import { formatJournalDate } from '../utils/formatJournalDate';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import type { JournalEntry } from '../types/journal';
import { JOURNAL_CATEGORIES } from '../constants/journalCategories';

type JournalEntryCardProps = {
  entry: JournalEntry;
};

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const tagSuffix =
    entry.tags && entry.tags.length > 0 ? ` · ${entry.tags.slice(0, 4).join(', ')}` : '';
  const categoryLabel = entry.category
    ? JOURNAL_CATEGORIES.find((c) => c.id === entry.category)?.label ?? entry.category
    : null;
  const categorySuffix = categoryLabel ? ` / ${categoryLabel}` : '';
  const attachmentLine = entry.attachment?.name ? `\n📎 ${entry.attachment.name}` : '';

  return (
    <TimelineEntry
      as="li"
      meta={`${entry.mood}${categorySuffix} · ${formatJournalDate(entry.createdAt)}${tagSuffix}`}
      body={`${entry.text ?? ''}${attachmentLine}`}
    />
  );
}
