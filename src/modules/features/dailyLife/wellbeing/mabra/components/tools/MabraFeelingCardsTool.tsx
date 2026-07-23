import { useState } from 'react';
import { FEELING_CARDS_LABEL } from '@/core/copy/compassWidgetLabels';
import { MABRA_FEELING_CARDS } from '../../content/mabraFeelingCards';
import { MabraToolShell } from './MabraToolShell';

type Props = { onBack: () => void };

export function MabraFeelingCardsTool({ onBack }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const selected = MABRA_FEELING_CARDS.find((c) => c.id === selectedId);

  return (
    <MabraToolShell
      title={FEELING_CARDS_LABEL}
      description="Tryck en känsla — inget rätt svar"
      onBack={onBack}
    >
      <div className="mabra-feel-grid" role="group" aria-label="Känslor">
        {MABRA_FEELING_CARDS.map((card) => (
          <button
            key={card.id}
            type="button"
            className={`mabra-feel-card min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${selectedId === card.id ? 'mabra-feel-card--active' : ''}`}
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
        <>
          <p className="mt-4 rounded-xl border border-accent/25 bg-accent/5 px-3 py-3 text-sm text-text-muted">
            <span className="font-medium text-accent">{selected.label}:</span> {selected.prompt_sv}
          </p>
          <label className="mt-3 block text-xs text-text-muted">
            Ditt svar (valfritt)
            <textarea
              value={notes[selected.id] ?? ''}
              onChange={(e) =>
                setNotes((prev) => ({ ...prev, [selected.id]: e.target.value }))
              }
              rows={2}
              className="input-glass mt-2 w-full text-sm"
              placeholder="Ett ord räcker…"
            />
          </label>
        </>
      ) : (
        <p className="mt-3 text-xs text-text-muted">Välj ett kort för en kort reflektion.</p>
      )}
    </MabraToolShell>
  );
}
