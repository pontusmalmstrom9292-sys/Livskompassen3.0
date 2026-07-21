import { JOURNAL_STEPS } from '../constants/moods';
import type { JournalStep } from '../types/journal';

type DagbokWizardProgressProps = {
  step: JournalStep;
};

/** Synlig stegindikator för reflektion-wizard — kompletterar sr-only i DagbokPage. */
export function DagbokWizardProgress({ step }: DagbokWizardProgressProps) {
  const activeIndex = JOURNAL_STEPS.findIndex((s) => s.key === step);

  return (
    <nav aria-label="Steg i dagboken" className="reflektion-wizard-progress">
      <ol className="reflektion-wizard-progress__list">
        {JOURNAL_STEPS.map((s, index) => {
          if (s.key === 'done' && step !== 'done') return null;

          const state =
            index < activeIndex ? 'done' : index === activeIndex ? 'current' : 'upcoming';

          return (
            <li
              key={s.key}
              className={`reflektion-wizard-progress__step reflektion-wizard-progress__step--${state}`}
              aria-current={state === 'current' ? 'step' : undefined}
            >
              <span className="reflektion-wizard-progress__marker" aria-hidden>
                {state === 'done' ? '✓' : s.emoji}
              </span>
              <span className="reflektion-wizard-progress__label">{s.label}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
