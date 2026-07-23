import { useState, useRef, useEffect } from 'react';
import { Button } from '@/design-system';
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
      <p className="text-xs text-text-muted">
        {label}
        {invertHint && <span className="ml-1 text-text-muted/70">({invertHint})</span>}
      </p>
      <div className="flex gap-1" role="group" aria-label={label}>
        {scales.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={value === s}
            onClick={() => onSelect(s)}
            className={`min-h-11 flex-1 rounded-lg border text-xs tabular-nums focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 ${
              value === s ? 'chip--active border-accent/40 bg-surface-3 text-accent' : 'chip--idle border-transparent text-text-muted hover:border-border hover:bg-surface-3 hover:text-text'
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
  
  const signals = shell.signals;
  const setSignals = shell.setSignals;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const successTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (successTimerRef.current != null) {
        window.clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await onSave();
      setSuccess(true);
      onSaved?.();

      if (successTimerRef.current != null) {
        window.clearTimeout(successTimerRef.current);
      }
      successTimerRef.current = window.setTimeout(() => {
        setSuccess(false);
        successTimerRef.current = null;
      }, 3000);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : '';
      if (message.includes('Offline')) {
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
        <p className="text-xs uppercase tracking-widest text-text-muted">
          Mätvärden ({childAlias})
        </p>
        <p className="text-xs text-text-muted">
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

      <Button
        type="button"
        variant="accent"
        onClick={handleSave}
        disabled={loading}
        className="mt-2 min-h-11 w-full disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        Spara mätvärden till loggen
      </Button>

      {success && (
        <p className="mt-2 text-center text-sm text-success" role="status">
          Fysiologi sparad för {childAlias}.
        </p>
      )}
      {error && (
        <p className="mt-2 text-center text-sm text-danger" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
