import { useState } from 'react';
import { Info } from 'lucide-react';
import { Button } from '@/design-system';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { JOURNAL_CATEGORIES, type JournalCategoryId } from '../constants/journalCategories';
import { HandoffBox } from './HandoffBox';
import { JournalMemoryPicker } from './JournalMemoryPicker';

type JournalDetailsPanelProps = {
  category?: string;
  memoryFile: File | null;
  memoryError: string | null;
  disabled?: boolean;
  textTouched?: boolean;
  onCategoryChange: (category: JournalCategoryId | undefined) => void;
  onMemoryFileChange: (file: File | null) => void;
  onMemoryValidationError: (message: string | null) => void;
};

/** B3 — sekundär: kategori & minne i CalmCollapsible (öppnas vid val/bilaga). */
export function JournalDetailsPanel({
  category,
  memoryFile,
  memoryError,
  disabled,
  textTouched: _textTouched = false,
  onCategoryChange,
  onMemoryFileChange,
  onMemoryValidationError,
}: JournalDetailsPanelProps) {
  const [manualOpen, setManualOpen] = useState(false);
  const [showVaultInfo, setShowVaultInfo] = useState(false);
  const hasSelection = Boolean(memoryFile) || Boolean(category);
  const open = manualOpen || hasSelection;

  const meta = category
    ? JOURNAL_CATEGORIES.find((c) => c.id === category)?.label ?? 'Valfritt'
    : memoryFile
      ? '1 bilaga'
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
            <p className="reflektion-panel__hint">Lägg till ett minne (max 1)</p>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              aria-label="Om formellt bevis i arkiv"
              aria-expanded={showVaultInfo}
              onClick={() => setShowVaultInfo((v) => !v)}
            >
              <Info className="h-4 w-4 text-text-muted" aria-hidden />
            </Button>
          </div>
          {showVaultInfo && <HandoffBox className="mb-3" />}
          <JournalMemoryPicker
            disabled={disabled}
            file={memoryFile}
            onFileChange={onMemoryFileChange}
            onValidationError={onMemoryValidationError}
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
