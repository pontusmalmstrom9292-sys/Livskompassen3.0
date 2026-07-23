import { ChevronLeft, Loader2, Paperclip } from 'lucide-react';
import { Button } from '@/design-system';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { VAVAREN_CONFIRM_HINT } from '@/features/lifeJournal/evidence/vault/constants/vavarenCopy';
import { getMoodDef } from '../constants/moods';

type ConfirmStepProps = {
  mood: string;
  text: string;
  memorySummaries?: string[];
  memoryError?: string | null;
  categoryLabel?: string | null;
  saving: boolean;
  weaveToKampspar: boolean;
  showWeaveOptIn?: boolean;
  onWeaveToKampsparChange: (value: boolean) => void;
  tags?: string[];
  onToggleTag?: (tag: string) => void;
  onBack: () => void;
  onSave: () => void | Promise<void>;
};

export function ConfirmStep({
  mood,
  text,
  memorySummaries = [],
  memoryError,
  categoryLabel,
  saving,
  weaveToKampspar,
  showWeaveOptIn = false,
  onWeaveToKampsparChange,
  tags = [],
  onToggleTag,
  onBack,
  onSave,
}: ConfirmStepProps) {
  const moodDef = getMoodDef(mood);

  return (
    <div className="reflektion-panel" role="region" aria-labelledby="confirm-step-title">
      <p id="confirm-step-title" className="reflektion-panel__lead">Stämmer det här?</p>
      <p className="reflektion-panel__hint">Du kan gå tillbaka och ändra innan du sparar.</p>

      <div className="reflektion-preview">
        <p className="reflektion-preview__mood">
          {moodDef && <span aria-hidden>{moodDef.emoji} </span>}
          <span className="text-text-muted">Känsla:</span> {mood}
        </p>
        <p className="reflektion-preview__text">{text}</p>
        {categoryLabel && (
          <p className="mt-2 text-xs text-text-muted">
            <span className="text-text-muted">Kategori:</span> {categoryLabel}
          </p>
        )}
        {memorySummaries.length > 0 && (
          <ul className="mt-2 space-y-1">
            {memorySummaries.map((line) => (
              <li key={line} className="flex items-center gap-1.5 text-xs text-accent">
                <Paperclip className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        )}
      </div>

      {(showWeaveOptIn || onToggleTag) && (
        <CalmCollapsible title="Märkning & Minne" meta="Valfritt" defaultOpen={false} glow="gold">
          {showWeaveOptIn && VAVAREN_CONFIRM_HINT ? (
            <p className="mb-3 text-xs text-text-muted">{VAVAREN_CONFIRM_HINT}</p>
          ) : null}

          {onToggleTag && (
            <div className="reflektion-radar mb-4 rounded-xl border border-border bg-surface-2/40 p-4">
              <p className="mb-3 text-sm font-medium text-text-muted">Märkning (Röd Flagg-Radar)</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onToggleTag('red_flag')}
                  aria-pressed={tags.includes('red_flag')}
                  className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 ${
                    tags.includes('red_flag')
                      ? 'border-danger/50 bg-danger/20 text-danger shadow-[0_0_10px_color-mix(in_srgb,var(--danger)_20%,transparent)]'
                      : 'border-border bg-surface-2/60 text-text-muted hover:bg-surface-3'
                  }`}
                >
                  🚩 Röd Flagg / Övertramp
                </button>
                <button
                  type="button"
                  onClick={() => onToggleTag('insight')}
                  aria-pressed={tags.includes('insight')}
                  className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 ${
                    tags.includes('insight')
                      ? 'border-accent/50 bg-accent/20 text-accent-light shadow-[0_0_10px_color-mix(in_srgb,var(--accent)_20%,transparent)]'
                      : 'border-border bg-surface-2/60 text-text-muted hover:bg-surface-3'
                  }`}
                >
                  💡 Insikt
                </button>
                <button
                  type="button"
                  onClick={() => onToggleTag('boundary')}
                  aria-pressed={tags.includes('boundary')}
                  className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 ${
                    tags.includes('boundary')
                      ? 'border-success/50 bg-success/20 text-success shadow-[0_0_10px_color-mix(in_srgb,var(--success)_20%,transparent)]'
                      : 'border-border bg-surface-2/60 text-text-muted hover:bg-surface-3'
                  }`}
                >
                  🛡️ Gränssättning
                </button>
              </div>
            </div>
          )}

          {showWeaveOptIn && (
            <label className="reflektion-weave-opt flex min-h-11 cursor-pointer items-start gap-3 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={weaveToKampspar}
                onChange={(e) => onWeaveToKampsparChange(e.target.checked)}
                disabled={saving}
                className="mt-1 h-4 w-4 accent-[var(--accent)]"
              />
              <span>
                Spara också en kort rad i Minne (valfritt — dagboken sparas oavsett).
              </span>
            </label>
          )}
        </CalmCollapsible>
      )}

      <div className="reflektion-actions flex flex-wrap gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          className="min-h-[var(--ds-touch-target,2.75rem)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          onClick={onBack}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden /> Ändra
        </Button>
        <Button
          type="button"
          variant="success"
          onClick={() => void onSave()}
          disabled={saving || Boolean(memoryError)}
          className="min-h-[var(--ds-touch-target,2.75rem)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          aria-keyshortcuts="Enter"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          Spara i dagboken
        </Button>
      </div>
      {memoryError && (
        <p
          className="mt-2 rounded-lg border border-danger/25 bg-danger/10 px-3 py-2 text-sm text-danger"
          role="alert"
        >
          {memoryError}
        </p>
      )}
    </div>
  );
}
