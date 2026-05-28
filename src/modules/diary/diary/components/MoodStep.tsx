import { Link } from 'react-router-dom';
import { ChevronRight, Loader2, Shuffle } from 'lucide-react';
import { HEAVY_MOODS, MOOD_CATALOG, getMoodDef } from '../constants/moods';
import { MABRA_BRIDGE_LABELS } from '../constants/mabraBridge';

type MoodStepProps = {
  mood: string;
  onMoodChange: (mood: string) => void;
  onContinue: () => void;
  lowEnergyBridge?: boolean;
  saving?: boolean;
  onSaveMoodOnly?: () => void;
  showMoodOnlyButton?: boolean;
};

export function MoodStep({
  mood,
  onMoodChange,
  onContinue,
  lowEnergyBridge = false,
  saving = false,
  onSaveMoodOnly,
  showMoodOnlyButton = false,
}: MoodStepProps) {
  const selected = getMoodDef(mood);

  const pickRandom = () => {
    const pick = MOOD_CATALOG[Math.floor(Math.random() * MOOD_CATALOG.length)];
    if (pick) onMoodChange(pick.label);
  };

  return (
    <div className="reflektion-panel">
      <p className="reflektion-panel__lead">Hur känns det just nu?</p>
      <p className="reflektion-panel__hint">Tryck en liten ruta — eller slumpa.</p>

      <div className="reflektion-mood-grid" role="group" aria-label="Välj känsla">
        {MOOD_CATALOG.map((m) => {
          const active = mood === m.label;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onMoodChange(m.label)}
              className={`reflektion-mood-card reflektion-mood-card--${m.tone} ${
                active ? 'reflektion-mood-card--active' : ''
              }`}
              aria-pressed={active}
            >
              <span className="reflektion-mood-card__emoji" aria-hidden>
                {m.emoji}
              </span>
              <span className="reflektion-mood-card__label">{m.label}</span>
            </button>
          );
        })}
      </div>

      <button type="button" onClick={pickRandom} className="reflektion-shuffle">
        <Shuffle className="h-3.5 w-3.5" aria-hidden />
        Slumpa
      </button>

      {selected && (
        <p className="reflektion-mood-selected">
          <span aria-hidden>{selected.emoji}</span> Du valde <strong>{selected.label}</strong>
        </p>
      )}

      <div className="reflektion-actions">
        <button type="button" disabled={!mood} onClick={onContinue} className="btn-pill--secondary">
          {lowEnergyBridge ? (
            <>
              {MABRA_BRIDGE_LABELS.continueOptional} <ChevronRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Nästa: skriv lite <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>

        {(lowEnergyBridge || showMoodOnlyButton) && onSaveMoodOnly && (
          <button
            type="button"
            disabled={!mood || saving}
            onClick={onSaveMoodOnly}
            className="btn-pill--ghost text-sm"
          >
            {saving ? (
              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
            ) : lowEnergyBridge ? (
              MABRA_BRIDGE_LABELS.saveMoodOnly
            ) : (
              'Bara känslan räcker — spara'
            )}
          </button>
        )}

        {!lowEnergyBridge && mood && HEAVY_MOODS.has(mood) && (
          <Link to="/mabra" className="reflektion-link-mabra">
            Kroppen behöver paus först? → MåBra
          </Link>
        )}
      </div>
    </div>
  );
}
