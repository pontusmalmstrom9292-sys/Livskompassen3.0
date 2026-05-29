import { ChevronDown, Info } from 'lucide-react';
import { useState } from 'react';
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

export function JournalDetailsPanel({
  category,
  memoryFile,
  memoryError,
  disabled,
  textTouched = false,
  onCategoryChange,
  onMemoryFileChange,
  onMemoryValidationError,
}: JournalDetailsPanelProps) {
  const [open, setOpen] = useState(false);
  const [showVaultInfo, setShowVaultInfo] = useState(false);
  const expanded = open || textTouched || Boolean(memoryFile) || Boolean(category);

  return (
    <div className="journal-details mt-4">
      <button
        type="button"
        className="journal-details__toggle flex w-full items-center justify-between gap-2 rounded-lg border border-border-strong/80 bg-surface/20 px-3 py-2 text-left text-sm text-text-muted"
        aria-expanded={expanded}
        onClick={() => setOpen((v) => !v)}
      >
        <span>Lägg till detaljer</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {expanded && (
        <div className="journal-details__body mt-3 space-y-4 border-l-2 border-accent/20 pl-3">
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
              <button
                type="button"
                className="btn-pill--ghost shrink-0 p-1.5"
                aria-label="Om formellt bevis i Reality Vault"
                aria-expanded={showVaultInfo}
                onClick={() => setShowVaultInfo((v) => !v)}
              >
                <Info className="h-4 w-4 text-text-muted" aria-hidden />
              </button>
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
      )}
    </div>
  );
}
