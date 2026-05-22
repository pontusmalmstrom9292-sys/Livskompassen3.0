import { StepIndicator } from '../../core/ui/StepIndicator';
import { JOURNAL_STEPS } from '../constants/moods';
import type { JournalStep } from '../types/journal';

type DagbokStepIndicatorProps = {
  currentStep: JournalStep;
};

export function DagbokStepIndicator({ currentStep }: DagbokStepIndicatorProps) {
  return (
    <StepIndicator
      steps={JOURNAL_STEPS.map(({ key, label }) => ({ key, label }))}
      currentKey={currentStep}
    />
  );
}
