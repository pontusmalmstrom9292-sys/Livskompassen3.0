import { useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { clsx } from 'clsx';
import { Button, Input, TextArea } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { fetchMicroSteps, type MicroStep } from '../api/compassService';
import { MICRO_STEP_PANEL_TITLE } from '@/core/copy/compassWidgetLabels';

const BATCH_SIZE = 3;

type Props = {
  onDone: () => void;
  /** Inbäddad i HomeAdaptiveCompass — utan yttre BentoCard. */
  embedded?: boolean;
  /** Låg kapacitet — inget LLM-anrop, manuellt mikrosteg. */
  simplified?: boolean;
};

export function ParalysPanel({ onDone, embedded = false, simplified = false }: Props) {
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
    const form = simplified ? (
      <>
        <p className="mb-3 text-xs leading-relaxed text-text-muted">
          Kapaciteten är låg — skriv ett enda mikrosteg. Ingen AI behövs just nu.
        </p>
        <Input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Nästa minsta steg …"
          className="input-glass w-full text-sm"
        />
        <Button
          disabled={taskText.trim().length < 2}
          onClick={onDone}
          className="mt-3 w-full text-xs disabled:opacity-40"
          size="sm"
        >
          Klart för nu
        </Button>
      </>
    ) : (
      <>
        <p className="mb-3 text-xs leading-relaxed text-text-muted">
          Ett mikrosteg i taget. Ingen auto-start — du väljer när.
        </p>
        <TextArea
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="Vad känns överväldigande just nu?"
          rows={embedded ? 2 : 3}
          className="input-glass neu-inset w-full resize-none text-sm"
        />
        {error && <p className="mt-2 text-xs text-danger">{error}</p>}
        <Button
          disabled={loading}
          onClick={() => loadSteps(false)}
          className="mt-3 w-full text-xs disabled:opacity-40"
          size="sm"
        >
          {loading ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : 'Hjälp mig börja'}
        </Button>
      </>
    );

    if (embedded) return <div className="space-y-2">{form}</div>;

    return (
      <BentoCard title={MICRO_STEP_PANEL_TITLE} icon={<Zap className="h-4 w-4" />}>
        {form}
      </BentoCard>
    );
  }

  const stepsBody = (
    <>
      <div className="rounded-xl border border-accent/20 bg-accent/5 px-3 py-2 text-center text-[10px] text-text-muted">
        Steg {Math.min(cursor + 1, steps.length)} av {steps.length}
      </div>
      {visible.map((step, i) =>
        embedded ? (
          <div
            key={`${cursor}-${i}-${step.instruction.slice(0, 24)}`}
            className={clsx(
              'rounded-2xl border border-border/30 bg-surface-2/50 p-4',
              i !== 0 && 'opacity-60',
            )}
          >
            <p className="text-sm leading-relaxed text-text">{step.instruction}</p>
            <p className="mt-2 text-[10px] text-text-dim">
              ~{step.estimatedSeconds}s · {step.physicalAnchor}
            </p>
          </div>
        ) : (
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
        ),
      )}
      <div className="flex flex-col gap-2">
        {hasMore && (
          <Button variant="ghost" disabled={loading} onClick={() => setCursor((c) => c + BATCH_SIZE)} size="sm">
            Nästa steg i listan
          </Button>
        )}
        <Button variant="secondary" disabled={loading} onClick={() => loadSteps(true)} size="sm">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ge mig 3 till'}
        </Button>
        <Button variant="success" onClick={onDone} size="sm">
          Klar
        </Button>
      </div>
    </>
  );

  return embedded ? <div className="space-y-3">{stepsBody}</div> : <div className="space-y-4 opacity-100">{stepsBody}</div>;
}
