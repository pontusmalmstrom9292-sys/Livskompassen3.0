import { ChevronLeft, Loader2, Paperclip } from 'lucide-react';
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

      {showWeaveOptIn && VAVAREN_CONFIRM_HINT ? (
        <p className="mb-3 text-xs text-text-dim">{VAVAREN_CONFIRM_HINT}</p>
      ) : null}
      {showWeaveOptIn && (
        <label className="reflektion-weave-opt mb-4 flex cursor-pointer items-start gap-2 text-sm text-text-muted">
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

      <div className="reflektion-actions">
        <button type="button" onClick={onBack} className="btn-pill--ghost">
          <ChevronLeft className="h-4 w-4" /> Ändra
        </button>
        <button
          type="button"
          onClick={() => void onSave()}
          disabled={saving || Boolean(memoryError)}
          className="btn-pill--success"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Spara i dagboken
        </button>
      </div>
      {memoryError && (
        <p className="mt-2 text-sm text-danger" role="alert">
          {memoryError}
        </p>
      )}
    </div>
  );
}
