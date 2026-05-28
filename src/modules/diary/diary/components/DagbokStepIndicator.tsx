import { Check } from 'lucide-react';
import { JOURNAL_STEPS } from '../constants/moods';
import type { JournalStep } from '../types/journal';

type DagbokStepIndicatorProps = {
  currentStep: JournalStep;
};

export function DagbokStepIndicator({ currentStep }: DagbokStepIndicatorProps) {
  const currentIdx = JOURNAL_STEPS.findIndex((s) => s.key === currentStep);

  return (
    <nav aria-label="Steg i dagboken" className="reflektion-steps mb-5">
      {JOURNAL_STEPS.map(({ key, label, emoji }, idx) => {
        const isActive = key === currentStep;
        const isComplete = idx < currentIdx;

        return (
          <div
            key={key}
            className={`reflektion-steps__item ${
              isActive
                ? 'reflektion-steps__item--active'
                : isComplete
                  ? 'reflektion-steps__item--done'
                  : ''
            }`}
          >
            <span className="reflektion-steps__bubble" aria-hidden>
              {isComplete ? <Check className="h-3.5 w-3.5" /> : emoji}
            </span>
            <span className="reflektion-steps__label">{label}</span>
          </div>
        );
      })}
    </nav>
  );
}
