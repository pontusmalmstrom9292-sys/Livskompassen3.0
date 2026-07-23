import { useMemo, useState } from 'react';
import { Button } from '@/design-system';
import { MABRA_REFLECTION_CARDS } from '../../content/mabraReflectionCards';
import { MabraToolShell } from './MabraToolShell';

const RESPONSES = [
  { id: 'yes', label: 'Stämmer för mig' },
  { id: 'part', label: 'Delvis' },
  { id: 'skip', label: 'Inte just nu' },
] as const;

type Props = { onBack: () => void };

export function MabraSelfQuizTool({ onBack }: Props) {
  const [seed, setSeed] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);
  const [note, setNote] = useState('');

  const card = useMemo(() => {
    const i = Math.abs(seed) % MABRA_REFLECTION_CARDS.length;
    return MABRA_REFLECTION_CARDS[i];
  }, [seed]);

  const nextQuestion = () => {
    setAnswered(null);
    setNote('');
    setSeed((s) => s + 1);
  };

  return (
    <MabraToolShell
      title="Själv-frågesport"
      description="Ett kort i taget — ingen poäng, inget fel"
      onBack={onBack}
    >
      <p className="rounded-xl border border-accent/20 bg-accent/5 px-4 py-4 text-sm leading-relaxed text-text">
        {card.text_sv}
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {RESPONSES.map((r) => (
          <Button
            key={r.id}
            variant="ghost"
            className={`min-h-11 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${answered === r.id ? 'border-accent/40 text-accent' : ''}`}
            disabled={answered !== null}
            onClick={() => setAnswered(r.id)}
          >
            {r.label}
          </Button>
        ))}
      </div>
      {answered && (
        <>
          <label className="mt-4 block text-xs text-text-muted">
            Vill du skriva mer? (valfritt)
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="input-glass mt-2 w-full text-sm"
              placeholder="Ett ord räcker…"
            />
          </label>
          <Button
            variant="secondary"
            className="mt-4 min-h-11 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
            onClick={nextQuestion}
          >
            Nästa fråga
          </Button>
        </>
      )}
    </MabraToolShell>
  );
}
