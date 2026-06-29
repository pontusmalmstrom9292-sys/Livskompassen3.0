import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { SIGNAL_LABELS } from '../../constants';
import type { SignalScale } from '../../types';
import type { FamiljenDelegateBaseProps } from './familjenDelegateTypes';

const scales: SignalScale[] = [1, 2, 3, 4, 5];

function SignalRow({
  label,
  value,
  onSelect,
  invertHint,
}: {
  label: string;
  value: SignalScale;
  onSelect: (v: SignalScale) => void;
  invertHint?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-text-dim">
        {label}
        {invertHint && <span className="ml-1 text-text-dim/70">({invertHint})</span>}
      </p>
      <div className="flex gap-1">
        {scales.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSelect(s)}
            className={`flex-1 rounded-lg border py-2 text-xs tabular-nums ${
              value === s ? 'chip--active text-accent border-accent/40 bg-surface-3' : 'chip--idle text-text-muted border-transparent hover:border-border hover:bg-surface-3 hover:text-text'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FamiljenFysiologiDelegate({ shell, onSaved }: FamiljenDelegateBaseProps) {
  const childAlias = shell.activeChild;
  const onSave = shell.handleSavePhysio;
  
  // Use shell state for these so they don't get lost, but manage loading/error locally
  const signals = shell.signals;
  const setSignals = shell.setSignals;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSave();
      setSuccess(true);
      onSaved?.();
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      if (e.message?.includes('Offline')) {
        setError('Du är offline. Mätvärdena kunde inte sparas just nu.');
      } else {
        setError('Kunde inte spara mätvärdena. Försök igen.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 pt-2">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-widest text-text-dim">
          Mätvärden ({childAlias})
        </p>
        <p className="text-xs text-text-dim">
          Spåra mönster i sömn, oro och mat. Spara när du känner att dagens bild är tydlig.
        </p>
      </div>

      <div className="space-y-4">
        <SignalRow
          label={SIGNAL_LABELS.somn}
          value={signals.somn}
          onSelect={(somn) => setSignals({ ...signals, somn })}
          invertHint="1=dålig, 5=god"
        />
        <SignalRow
          label={SIGNAL_LABELS.angest}
          value={signals.angest}
          onSelect={(angest) => setSignals({ ...signals, angest })}
          invertHint="1=låg, 5=hög"
        />
        <SignalRow
          label={SIGNAL_LABELS.aptit}
          value={signals.aptit}
          onSelect={(aptit) => setSignals({ ...signals, aptit })}
          invertHint="1=dålig, 5=god"
        />
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="ds-btn ds-btn--accent w-full disabled:opacity-50 mt-2"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Spara mätvärden till loggen
      </button>

      {success && <p className="mt-2 text-sm text-success text-center">Fysiologi sparad för {childAlias}.</p>}
      {error && <p className="mt-2 text-sm text-danger text-center">{error}</p>}
    </div>
  );
}
