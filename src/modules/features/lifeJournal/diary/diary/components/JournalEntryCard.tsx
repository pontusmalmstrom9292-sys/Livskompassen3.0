import { formatJournalDate } from '../utils/formatJournalDate';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import type { JournalEntry } from '../types/journal';
import { Pin } from 'lucide-react';
import { useStore } from '@/core/store';
import { toggleJournalEntryPin } from '@/core/firebase/firestore';
import { JOURNAL_CATEGORIES } from '../constants/journalCategories';

type JournalEntryCardProps = {
  entry: JournalEntry;
};

export function JournalEntryCard({ entry }: JournalEntryCardProps) {
  const user = useStore((s) => s.user);
  
  const handleTogglePin = async () => {
    if (!user) return;
    try {
      await toggleJournalEntryPin(entry.id, entry.isPinned ?? false);
      // NOTE: Parent might not auto-refresh, but next load will have it pinned.
      // In a more complex app we'd pass onToggle up or have a real-time listener.
    } catch (e) {
      console.error('Failed to toggle pin', e);
    }
  };

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
      action={
        <button
          type="button"
          onClick={handleTogglePin}
          className={`flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors ${
            entry.isPinned
              ? 'bg-accent/10 text-accent hover:bg-accent/20'
              : 'text-text-dim hover:text-text hover:bg-surface-3'
          }`}
          aria-label={entry.isPinned ? "Ta bort markering" : "Fäst i toppen"}
          title={entry.isPinned ? "Ta bort markering" : "Fäst i toppen"}
        >
          <Pin className={`h-3.5 w-3.5 ${entry.isPinned ? 'fill-current' : ''}`} aria-hidden />
        </button>
      }
    />
  );
}
