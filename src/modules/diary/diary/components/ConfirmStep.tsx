import { ChevronLeft, Loader2 } from 'lucide-react';
import { getMoodDef } from '../constants/moods';

type ConfirmStepProps = {
  mood: string;
  text: string;
  saving: boolean;
  weaveToKampspar: boolean;
  showWeaveOptIn?: boolean;
  onWeaveToKampsparChange: (value: boolean) => void;
  onBack: () => void;
  onSave: () => void;
};

export function ConfirmStep({
  mood,
  text,
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
      </div>

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
        <button type="button" onClick={onSave} disabled={saving} className="btn-pill--success">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Spara i dagboken
        </button>
      </div>
    </div>
  );
}
