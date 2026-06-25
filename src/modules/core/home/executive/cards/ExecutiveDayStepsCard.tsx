import { HomeBrassDaySteps } from '../../HomeBrassDaySteps';

/** Dagens steg — executive skin via befintlig planerings-hook. */
export function ExecutiveDayStepsCard() {
  return (
    <div className="exec-home-card exec-home-card--steps p-0 overflow-hidden">
      <HomeBrassDaySteps variant="executive" />
    </div>
  );
}
