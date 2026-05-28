import { useMemo, useState } from 'react';
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

  const card = useMemo(() => {
    const i = Math.abs(seed) % MABRA_REFLECTION_CARDS.length;
    return MABRA_REFLECTION_CARDS[i];
  }, [seed]);

  const nextQuestion = () => {
    setAnswered(null);
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
          <button
            key={r.id}
            type="button"
            disabled={answered !== null}
            className={`btn-pill--ghost text-sm ${answered === r.id ? 'border-accent/40 text-accent' : ''}`}
            onClick={() => setAnswered(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>
      {answered && (
        <button type="button" onClick={nextQuestion} className="btn-pill--secondary mt-4 w-full">
          Nästa fråga
        </button>
      )}
    </MabraToolShell>
  );
}
