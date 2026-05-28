import { useState } from 'react';
import { MABRA_FEELING_CARDS } from '../../content/mabraFeelingCards';
import { MabraToolShell } from './MabraToolShell';

type Props = { onBack: () => void };

export function MabraFeelingCardsTool({ onBack }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = MABRA_FEELING_CARDS.find((c) => c.id === selectedId);

  return (
    <MabraToolShell
      title="Känslokort"
      description="Tryck en känsla — inget rätt svar"
      onBack={onBack}
    >
      <div className="mabra-feel-grid" role="group" aria-label="Känslor">
        {MABRA_FEELING_CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`mabra-feel-card ${selectedId === card.id ? 'mabra-feel-card--active' : ''}`}
            aria-pressed={selectedId === card.id}
            onClick={() => setSelectedId(card.id)}
          >
            <span className="mabra-feel-card__emoji" aria-hidden>
              {card.emoji}
            </span>
            <span className="mabra-feel-card__label">{card.label}</span>
          </button>
        ))}
      </div>
      {selected ? (
        <p className="mt-4 rounded-xl border border-accent/25 bg-accent/5 px-3 py-3 text-sm text-text-muted">
          <span className="font-medium text-accent">{selected.label}:</span> {selected.prompt_sv}
        </p>
      ) : (
        <p className="mt-3 text-xs text-text-dim">Välj ett kort för en kort reflektion.</p>
      )}
    </MabraToolShell>
  );
}
