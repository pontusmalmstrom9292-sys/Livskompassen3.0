import { Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
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

  return (
    <div className="reflektion-panel" role="region" aria-labelledby="mood-step-title">
      <p id="mood-step-title" className="reflektion-panel__lead">Hur känns det just nu?</p>
      <p className="reflektion-panel__hint">Välj en känsla — sedan kan du skriva eller spara direkt.</p>

      <label className="reflektion-field">
        <span className="reflektion-field__label">Känsla</span>
        <select
          value={mood}
          onChange={(e) => onMoodChange(e.target.value)}
          className="reflektion-feeling-select"
          aria-label="Välj känsla"
        >
          <option value="">Välj känsla…</option>
          {MOOD_CATALOG.map((m) => (
            <option key={m.id} value={m.label}>
              {m.label}
            </option>
          ))}
        </select>
      </label>

      {selected && (
        <p className="reflektion-mood-selected">
          Vald: <strong>{selected.label}</strong>
        </p>
      )}

      <div className="reflektion-actions">
        <button
          type="button"
          disabled={!mood}
          onClick={onContinue}
          aria-keyshortcuts="Enter"
          className="od-depth__cta reflektion-actions__primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
        >
          {lowEnergyBridge ? (
            <>
              {MABRA_BRIDGE_LABELS.continueOptional} <ChevronRight className="h-4 w-4" aria-hidden />
            </>
          ) : (
            <>
              Nästa: skriv lite <ChevronRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>

        {(lowEnergyBridge || showMoodOnlyButton) && onSaveMoodOnly && (
          <button
            type="button"
            disabled={!mood || saving}
            onClick={onSaveMoodOnly}
            className="reflektion-actions__ghost text-sm"
          >
            {saving ? (
              <Loader2 className="mx-auto h-4 w-4 animate-spin" aria-hidden />
            ) : lowEnergyBridge ? (
              MABRA_BRIDGE_LABELS.saveMoodOnly
            ) : (
              'Bara känslan räcker — spara'
            )}
          </button>
        )}

        {!lowEnergyBridge && mood && HEAVY_MOODS.has(mood) && (
          <Link to="/vardagen?tab=mabra" className="reflektion-link-mabra">
            Kroppen behöver paus först? → MåBra
          </Link>
        )}
      </div>
    </div>
  );
}
