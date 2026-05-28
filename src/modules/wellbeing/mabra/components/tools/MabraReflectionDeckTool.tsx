import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MABRA_REFLECTION_CARDS } from '../../content/mabraReflectionCards';
import { MabraToolShell } from './MabraToolShell';

type Props = { onBack: () => void };

export function MabraReflectionDeckTool({ onBack }: Props) {
  const [index, setIndex] = useState(0);
  const card = MABRA_REFLECTION_CARDS[index];
  const total = MABRA_REFLECTION_CARDS.length;

  const prev = () => setIndex((i) => (i - 1 + total) % total);
  const next = () => setIndex((i) => (i + 1) % total);

  return (
    <MabraToolShell
      title="Frågekort"
      description={`${index + 1} / ${total} — bläddra i din egen takt`}
      onBack={onBack}
    >
      <p className="rounded-xl border border-border-strong bg-surface/40 px-4 py-5 text-base leading-relaxed text-text">
        {card?.text_sv}
      </p>
      <p className="mt-2 text-center text-[10px] uppercase tracking-wider text-text-dim">
        {card?.lens}
      </p>
      <div className="mt-4 flex gap-2">
        <button type="button" onClick={prev} className="btn-pill--ghost flex-1 text-sm">
          <ChevronLeft className="mr-1 inline h-4 w-4" />
          Förra
        </button>
        <button type="button" onClick={next} className="btn-pill--secondary flex-1 text-sm">
          Nästa
          <ChevronRight className="ml-1 inline h-4 w-4" />
        </button>
      </div>
    </MabraToolShell>
  );
}
