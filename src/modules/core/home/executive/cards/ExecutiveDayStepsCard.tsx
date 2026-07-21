import { HomeBrassDaySteps } from '../../HomeBrassDaySteps';

/** Dagens steg — executive skin via befintlig planerings-hook. */
export function ExecutiveDayStepsCard() {
  return (
    <div
      className="calm-card exec-home-card exec-home-card--steps overflow-hidden p-0"
      aria-label="Dagens steg"
    >
      <HomeBrassDaySteps variant="executive" />
    </div>
  );
}
