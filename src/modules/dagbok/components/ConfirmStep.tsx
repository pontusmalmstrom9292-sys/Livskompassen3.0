import { ChevronLeft, Loader2 } from 'lucide-react';

type ConfirmStepProps = {
  mood: string;
  text: string;
  saving: boolean;
  weaveToKampspar: boolean;
  onWeaveToKampsparChange: (value: boolean) => void;
  onBack: () => void;
  onSave: () => void;
};

export function ConfirmStep({
  mood,
  text,
  saving,
  weaveToKampspar,
  onWeaveToKampsparChange,
  onBack,
  onSave,
}: ConfirmStepProps) {
  return (
    <>
      <p className="mb-2 text-xs uppercase tracking-widest text-text-dim">Steg 3 — Bekräfta</p>
      <div className="glass-card mb-4 space-y-1 p-3 text-sm">
        <p>
          <span className="text-text-dim">Humör:</span> {mood}
        </p>
        <p className="text-text-muted">{text}</p>
      </div>
      <label className="mb-4 flex cursor-pointer items-start gap-2 text-sm text-text-muted">
        <input
          type="checkbox"
          checked={weaveToKampspar}
          onChange={(e) => onWeaveToKampsparChange(e.target.checked)}
          disabled={saving}
          className="mt-0.5"
        />
        <span>
          Spara en kort sammanfattning i Minne (Kampspár) — valfritt, separat från dagboken.
        </span>
      </label>
      <div className="flex gap-2">
        <button type="button" onClick={onBack} className="btn-pill--ghost">
          <ChevronLeft className="h-4 w-4" /> Tillbaka
        </button>
        <button type="button" onClick={onSave} disabled={saving} className="btn-pill--success">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Spara post
        </button>
      </div>
    </>
  );
}
