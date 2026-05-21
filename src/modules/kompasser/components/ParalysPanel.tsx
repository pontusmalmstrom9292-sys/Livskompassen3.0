import { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { fetchMicroSteps, type MicroStep } from '../api/compassService';

const BATCH_SIZE = 3;

type Props = {
  onDone: () => void;
};

export function ParalysPanel({ onDone }: Props) {
  const [taskText, setTaskText] = useState('');
  const [steps, setSteps] = useState<MicroStep[]>([]);
  const [cursor, setCursor] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const visible = steps.slice(cursor, cursor + BATCH_SIZE);
  const hasMore = cursor + BATCH_SIZE < steps.length;

  const loadSteps = async (append: boolean) => {
    const trimmed = taskText.trim();
    if (trimmed.length < 3) {
      setError('Skriv kort vad som känns tungt.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const next = await fetchMicroSteps(trimmed);
      if (append) {
        setSteps((prev) => [...prev, ...next]);
        setCursor((prev) => prev + BATCH_SIZE);
      } else {
        setSteps(next);
        setCursor(0);
      }
    } catch {
      setError('Kunde inte hämta mikrosteg. Kontrollera inloggning och deployade functions.');
    } finally {
      setLoading(false);
    }
  };

  if (steps.length === 0) {
    return (
      <BentoCard title="Paralys-Brytaren" icon={<Zap className="h-4 w-4" />}>
        <p className="mb-3 text-sm text-text-muted">
          Ett mikrosteg i taget. Ingen auto-start — du väljer när.
        </p>
        <textarea
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Vad känns överväldigande just nu?"
          rows={3}
          className="w-full rounded-xl border border-border-strong bg-surface/50 px-4 py-3 text-sm text-text-primary placeholder:text-text-muted"
        />
        {error && <p className="mt-2 text-sm text-danger">{error}</p>}
        <button
          type="button"
          disabled={loading}
          onClick={() => loadSteps(false)}
          className="btn-pill--secondary mt-4"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Hjälp mig börja'}
        </button>
      </BentoCard>
    );
  }

  return (
    <div className="space-y-4 opacity-100">
      <div className="rounded-xl border border-accent/30 bg-accent/5 px-3 py-2 text-xs text-text-muted">
        Fokus: steg {Math.min(cursor + 1, steps.length)} av {steps.length}
      </div>
      {visible.map((step, i) => (
        <BentoCard
          key={`${cursor}-${i}-${step.instruction.slice(0, 24)}`}
          title={`Mikrosteg ${cursor + i + 1}`}
          className={i === 0 ? '' : 'opacity-60'}
        >
          <p className="text-sm text-text-primary">{step.instruction}</p>
          <p className="mt-2 text-xs text-text-muted">
            ~{step.estimatedSeconds}s · {step.physicalAnchor}
          </p>
        </BentoCard>
      ))}
      <div className="flex flex-col gap-2">
        {hasMore && (
          <button
            type="button"
            disabled={loading}
            onClick={() => setCursor((c) => c + BATCH_SIZE)}
            className="btn-pill--ghost text-sm"
          >
            Nästa steg i listan
          </button>
        )}
        <button
          type="button"
          disabled={loading}
          onClick={() => loadSteps(true)}
          className="btn-pill--secondary text-sm"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ge mig 3 till'}
        </button>
        <button type="button" onClick={onDone} className="btn-pill--success text-sm">
          Klar
        </button>
      </div>
    </div>
  );
}
