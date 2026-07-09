import { ChevronLeft, Loader2, Paperclip } from 'lucide-react';
import { Button } from '@/design-system';
import { CalmCollapsible } from '@/core/ui/CalmCollapsible';
import { VAVAREN_CONFIRM_HINT } from '@/features/lifeJournal/evidence/vault/constants/vavarenCopy';
import { getMoodDef } from '../constants/moods';

type ConfirmStepProps = {
  mood: string;
  text: string;
  memoryFileName?: string | null;
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
  memoryFileName,
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
    <div className="reflektion-panel">
      <p className="reflektion-panel__lead">Stämmer det här?</p>
      <p className="reflektion-panel__hint">Du kan gå tillbaka och ändra innan du sparar.</p>

      <div className="reflektion-preview">
        <p className="reflektion-preview__mood">
          {moodDef && <span aria-hidden>{moodDef.emoji} </span>}
          <span className="text-text-dim">Känsla:</span> {mood}
        </p>
        <p className="reflektion-preview__text">{text}</p>
        {categoryLabel && (
          <p className="mt-2 text-xs text-text-muted">
            <span className="text-text-dim">Kategori:</span> {categoryLabel}
          </p>
        )}
        {memoryFileName && (
          <p className="mt-2 flex items-center gap-1.5 text-xs text-accent">
            <Paperclip className="h-3.5 w-3.5" aria-hidden />
            {memoryFileName}
          </p>
        )}
      </div>

      {(showWeaveOptIn || onToggleTag) && (
        <CalmCollapsible title="Märkning & Minne" meta="Valfritt" defaultOpen={false} glow="gold">
          {showWeaveOptIn && VAVAREN_CONFIRM_HINT ? (
            <p className="mb-3 text-xs text-text-dim">{VAVAREN_CONFIRM_HINT}</p>
          ) : null}

          {onToggleTag && (
            <div className="reflektion-radar mb-4 rounded-xl border border-border bg-surface-2/40 p-4">
              <p className="mb-3 text-sm font-medium text-text-muted">Märkning (Röd Flagg-Radar)</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onToggleTag('red_flag')}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    tags.includes('red_flag')
                      ? 'border-rose-500/50 bg-rose-500/20 text-rose-300 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                      : 'border-border bg-surface-2/60 text-text-dim hover:bg-surface-3'
                  }`}
                >
                  🚩 Röd Flagg / Övertramp
                </button>
                <button
                  type="button"
                  onClick={() => onToggleTag('insight')}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    tags.includes('insight')
                      ? 'border-amber-500/50 bg-amber-500/20 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : 'border-border bg-surface-2/60 text-text-dim hover:bg-surface-3'
                  }`}
                >
                  💡 Insikt
                </button>
                <button
                  type="button"
                  onClick={() => onToggleTag('boundary')}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                    tags.includes('boundary')
                      ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                      : 'border-border bg-surface-2/60 text-text-dim hover:bg-surface-3'
                  }`}
                >
                  🛡️ Gränssättning
                </button>
              </div>
            </div>
          )}

          {showWeaveOptIn && (
            <label className="reflektion-weave-opt flex cursor-pointer items-start gap-2 text-sm text-text-muted">
              <input
                type="checkbox"
                checked={weaveToKampspar}
                onChange={(e) => onWeaveToKampsparChange(e.target.checked)}
                disabled={saving}
                className="mt-0.5"
              />
              <span>
                Spara också en kort rad i Minne (valfritt — dagboken sparas oavsett).
              </span>
            </label>
          )}
        </CalmCollapsible>
      )}

      <div className="reflektion-actions">
        <Button type="button" variant="ghost" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" /> Ändra
        </Button>
        <Button
          type="button"
          variant="success"
          onClick={() => void onSave()}
          disabled={saving || Boolean(memoryError)}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Spara i dagboken
        </Button>
      </div>
      {memoryError && (
        <p className="mt-2 text-sm text-danger" role="alert">
          {memoryError}
        </p>
      )}
    </div>
  );
}
