import { useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/design-system';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import {
  MediaAttachWithCaption,
  type PendingCaptionedMedia,
} from '@/modules/shared/media';
import { validateJournalMemoryFile } from '../utils/journalUploadHelper';
import { JOURNAL_CATEGORIES, type JournalCategoryId } from '../constants/journalCategories';
import { HandoffBox } from './HandoffBox';

type JournalDetailsPanelProps = {
  category?: string;
  memoryItems: PendingCaptionedMedia[];
  memoryError: string | null;
  disabled?: boolean;
  textTouched?: boolean;
  onCategoryChange: (category: JournalCategoryId | undefined) => void;
  onMemoryItemsChange: (items: PendingCaptionedMedia[]) => void;
  onMemoryValidationError: (message: string | null) => void;
};

/** B3 — sekundär: kategori & minne i CalmCollapsible (öppnas vid val/bilaga). */
export function JournalDetailsPanel({
  category,
  memoryItems,
  memoryError,
  disabled,
  textTouched: _textTouched = false,
  onCategoryChange,
  onMemoryItemsChange,
  onMemoryValidationError,
}: JournalDetailsPanelProps) {
  const [manualOpen, setManualOpen] = useState(false);
  const [showVaultInfo, setShowVaultInfo] = useState(false);
  const hasSelection = memoryItems.length > 0 || Boolean(category);
  const open = manualOpen || hasSelection;

  const meta = category
    ? JOURNAL_CATEGORIES.find((c) => c.id === category)?.label ?? 'Valfritt'
    : memoryItems.length > 0
      ? `${memoryItems.length} bilaga${memoryItems.length > 1 ? 'r' : ''}`
      : 'Valfritt';

  return (
    <CalmCollapsible
      title="Kategori & minne"
      meta={meta}
      open={open}
      onOpenChange={setManualOpen}
      glow="gold"
    >
      <div className="space-y-4">
        <div>
          <p className="reflektion-panel__hint mb-2">Kategori (valfritt)</p>
          <div className="reflektion-prompt-grid" role="group" aria-label="Kategori">
            {JOURNAL_CATEGORIES.map((c) => {
              const active = category === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  disabled={disabled}
                  className={`reflektion-prompt-chip ${active ? 'reflektion-prompt-chip--active' : ''}`}
                  aria-pressed={active}
                  onClick={() => onCategoryChange(active ? undefined : c.id)}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between gap-2">
            <p className="reflektion-panel__hint">Lägg till minne (max 2)</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 min-h-11 min-w-11"
              aria-label="Om formellt bevis i arkiv"
              aria-expanded={showVaultInfo}
              onClick={() => setShowVaultInfo((v) => !v)}
            >
              <Info className="h-4 w-4 text-text-muted" aria-hidden />
            </Button>
          </div>
          {showVaultInfo && <HandoffBox className="mb-3" />}
          <MediaAttachWithCaption
            disabled={disabled}
            items={memoryItems}
            onChange={onMemoryItemsChange}
            onValidationError={onMemoryValidationError}
            validateFile={validateJournalMemoryFile}
            helperText="Personligt minne — inte juridiskt bevis. Valfri bildtext."
            captionPlaceholder="Bildtext (valfritt), t.ex. vad bilden betyder för dig…"
          />
          {memoryError && (
            <p className="mt-2 text-sm text-accent" role="alert">
              {memoryError}
            </p>
          )}
        </div>
      </div>
    </CalmCollapsible>
  );
}
