/** @locked MOD-SHARED-MEDIA */
import { useEffect, useMemo, useState } from 'react';
import { FileText, Pin } from 'lucide-react';
import { formatJournalDate } from '../utils/formatJournalDate';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import type { JournalEntry } from '../types/journal';
import { useStore } from '@/core/store';
import { toggleJournalEntryPin } from '@/core/firebase/firestore';
import { JOURNAL_CATEGORIES } from '../constants/journalCategories';
import { resolveJournalAttachments } from '../types/journalAttachment';
import { JournalMediaLightbox } from './JournalMediaLightbox';

export type JournalArchiveViewMode = 'tidslinje' | 'galleri';

type JournalEntryCardProps = {
  entry: JournalEntry;
  viewMode?: JournalArchiveViewMode;
};

export function JournalEntryCard({ entry, viewMode = 'tidslinje' }: JournalEntryCardProps) {
  const user = useStore((s) => s.user);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const attachments = useMemo(
    () => resolveJournalAttachments(entry),
    [entry],
  );

  const handleTogglePin = async () => {
    if (!user) return;
    try {
      await toggleJournalEntryPin(entry.id, entry.isPinned ?? false);
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
  const meta = `${entry.mood}${categorySuffix} · ${formatJournalDate(entry.createdAt)}${tagSuffix}`;

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const mediaFooter =
    attachments.length > 0 ? (
      <div className={`flex gap-2 ${viewMode === 'galleri' ? 'flex-col' : 'flex-row flex-wrap'}`}>
        {attachments.map((att, i) => {
          const isImage = att.mimeType.startsWith('image/');
          return (
            <button
              key={`${att.storagePath}-${i}`}
              type="button"
              className={
                viewMode === 'galleri'
                  ? 'journal-entry-card__media min-h-11 w-full overflow-hidden rounded-xl border border-border/50 text-left transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40'
                  : 'journal-entry-card__media min-h-11 shrink-0 overflow-hidden rounded-lg border border-border/50 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40'
              }
              onClick={() => openLightbox(i)}
              aria-label={att.caption || att.name || 'Visa bild'}
            >
              {isImage ? (
                <img
                  src={att.url}
                  alt=""
                  className={
                    viewMode === 'galleri'
                      ? 'max-h-56 w-full object-cover'
                      : 'h-14 w-14 object-cover'
                  }
                />
              ) : (
                <div
                  className={
                    viewMode === 'galleri'
                      ? 'flex min-h-[8rem] items-center justify-center gap-2 bg-surface/50 px-3 py-6 text-sm text-text-muted'
                      : 'flex h-14 w-14 items-center justify-center bg-surface/50'
                  }
                >
                  <FileText className="h-5 w-5 text-accent" aria-hidden />
                  {viewMode === 'galleri' && <span>PDF</span>}
                </div>
              )}
              {viewMode === 'galleri' && att.caption && (
                <p className="px-3 py-2 text-sm text-text-muted">{att.caption}</p>
              )}
            </button>
          );
        })}
      </div>
    ) : null;

  const pinAction = (
    <button
      type="button"
      onClick={handleTogglePin}
      className={`journal-entry-card__pin flex min-h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
        entry.isPinned
          ? 'bg-accent/10 text-accent hover:bg-accent/20'
          : 'text-text-muted hover:text-text hover:bg-surface-3'
      }`}
      aria-label={entry.isPinned ? 'Ta bort markering' : 'Fäst i toppen'}
      title={entry.isPinned ? 'Ta bort markering' : 'Fäst i toppen'}
    >
      <Pin className={`h-3.5 w-3.5 ${entry.isPinned ? 'fill-current' : ''}`} aria-hidden />
    </button>
  );

  useEffect(() => {
    if (!lightboxOpen) setLightboxIndex(0);
  }, [lightboxOpen]);

  if (viewMode === 'galleri') {
    return (
      <li className="journal-entry-card glass-card overflow-hidden p-3 text-sm">
        <div className="flex items-start justify-between gap-2">
          <p className="text-[10px] uppercase tracking-widest text-text-muted">{meta}</p>
          {pinAction}
        </div>
        {mediaFooter}
        <p className="mt-3 text-text-muted">{entry.text ?? ''}</p>
        {entry.tags && entry.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {entry.tags.slice(0, 6).map((t) => (
              <span
                key={t}
                className="rounded-md border border-border/40 px-2 py-0.5 text-[10px] text-text-muted"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <JournalMediaLightbox
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          items={attachments}
          initialIndex={lightboxIndex}
          meta={meta}
          createdAt={entry.createdAt}
        />
      </li>
    );
  }

  return (
    <>
      <TimelineEntry
        as="li"
        className="journal-entry-card"
        meta={meta}
        body={entry.text ?? ''}
        action={pinAction}
        footer={mediaFooter}
      />
      <JournalMediaLightbox
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        items={attachments}
        initialIndex={lightboxIndex}
        meta={meta}
        createdAt={entry.createdAt}
      />
    </>
  );
}
