/**
 * @locked MOD-SHARED-MEDIA
 * Fullscreen lightbox for journal captioned images.
 */
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, FileText, X } from 'lucide-react';
import { Button, Modal } from '@/design-system';
import type { CaptionedAttachment } from '@/modules/shared/media';
import { formatJournalDate } from '../utils/formatJournalDate';

type JournalMediaLightboxProps = {
  open: boolean;
  onClose: () => void;
  items: CaptionedAttachment[];
  initialIndex?: number;
  meta?: string;
  createdAt?: string;
};

export function JournalMediaLightbox({
  open,
  onClose,
  items,
  initialIndex = 0,
  meta,
  createdAt,
}: JournalMediaLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const safeItems = items.filter(Boolean);

  useEffect(() => {
    if (open) setIndex(Math.min(Math.max(0, initialIndex), Math.max(0, safeItems.length - 1)));
  }, [open, initialIndex, safeItems.length]);

  const current = safeItems[Math.min(Math.max(0, index), Math.max(0, safeItems.length - 1))];

  if (!open || !current) return null;

  const isImage = current.mimeType.startsWith('image/');
  const canPrev = safeItems.length > 1 && index > 0;
  const canNext = safeItems.length > 1 && index < safeItems.length - 1;

  return (
    <Modal
      open={open}
      onClose={onClose}
      ariaLabel="Bildvisning"
      hideHeader
      panelClassName="max-w-lg w-[min(100%,28rem)] bg-surface/95 p-0 overflow-hidden"
    >
      <div className="relative">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 min-h-11 min-w-11 bg-surface/80"
          aria-label="Stäng"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        {isImage ? (
          <img
            src={current.url}
            alt={current.caption || current.name}
            className="max-h-[60vh] w-full object-contain bg-black/40"
          />
        ) : (
          <div className="flex min-h-[12rem] flex-col items-center justify-center gap-3 bg-surface/60 px-6 py-10">
            <FileText className="h-10 w-10 text-accent" aria-hidden />
            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent underline"
            >
              Öppna {current.name}
            </a>
          </div>
        )}

        {safeItems.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1 pointer-events-none">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="pointer-events-auto min-h-11 min-w-11 bg-surface/70 disabled:opacity-30"
              aria-label="Föregående bild"
              disabled={!canPrev}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="pointer-events-auto min-h-11 min-w-11 bg-surface/70 disabled:opacity-30"
              aria-label="Nästa bild"
              disabled={!canNext}
              onClick={() => setIndex((i) => Math.min(safeItems.length - 1, i + 1))}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2 px-4 py-4">
        {(meta || createdAt) && (
          <p className="text-[10px] uppercase tracking-widest text-text-muted">
            {[meta, createdAt ? formatJournalDate(createdAt) : null].filter(Boolean).join(' · ')}
          </p>
        )}
        {current.caption && <p className="text-sm text-text-muted">{current.caption}</p>}
        {!current.caption && <p className="text-xs text-text-muted">{current.name}</p>}
        {safeItems.length > 1 && (
          <p className="text-center text-xs text-text-muted">
            {index + 1} / {safeItems.length}
          </p>
        )}
      </div>
    </Modal>
  );
}
