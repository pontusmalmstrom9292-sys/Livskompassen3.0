import { Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { MOOD_OPTIONS } from '../constants/moods';
import { MABRA_BRIDGE_LABELS } from '../constants/mabraBridge';

const MABRA_OUTBOUND_MOODS = new Set(['Låg', 'Spänd']);

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
  return (
    <>
      <p className="mb-2 text-xs uppercase tracking-widest text-text-dim">Steg 1 — Humör</p>
      <div className="mb-4 flex flex-wrap gap-2">
        {MOOD_OPTIONS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onMoodChange(m)}
            className={mood === m ? 'chip--active' : 'chip--idle'}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <button type="button" disabled={!mood} onClick={onContinue} className="btn-pill--secondary">
          {lowEnergyBridge ? (
            <>
              {MABRA_BRIDGE_LABELS.continueOptional} <ChevronRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Fortsätt <ChevronRight className="h-4 w-4" />
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
              'Spara bara humör'
            )}
          </button>
        )}
        {!lowEnergyBridge && mood && MABRA_OUTBOUND_MOODS.has(mood) && (
          <Link to="/mabra" className="text-center text-xs text-accent-secondary hover:underline">
            Behöver du reglera kroppen först? → Måbra
          </Link>
        )}
      </div>
    </>
  );
}
