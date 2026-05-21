import { ChevronRight } from 'lucide-react';
import { MOOD_OPTIONS } from '../constants/moods';

type MoodStepProps = {
  mood: string;
  onMoodChange: (mood: string) => void;
  onContinue: () => void;
};

export function MoodStep({ mood, onMoodChange, onContinue }: MoodStepProps) {
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
      <button type="button" disabled={!mood} onClick={onContinue} className="btn-pill--secondary">
        Fortsätt <ChevronRight className="h-4 w-4" />
      </button>
    </>
  );
}
