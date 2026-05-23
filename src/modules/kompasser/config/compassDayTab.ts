import type { LucideIcon } from 'lucide-react';
import { Cloud } from 'lucide-react';
import type { CompassOptionTone } from './compassOptionMeta';
import { getCompassOptionMeta } from './compassOptionMeta';

export type DayFlowTabPresentation = {
  label: string;
  ariaLabel: string;
  icon: LucideIcon;
  tone: CompassOptionTone | null;
};

/** Flik för dagskompass — neutral tills humör/kroppscheck är sparad idag. */
export function getDayFlowTabPresentation(moodOption: string | null): DayFlowTabPresentation {
  if (!moodOption) {
    return {
      label: 'Dag',
      ariaLabel: 'Dagskompass — hur mår kroppen?',
      icon: Cloud,
      tone: null,
    };
  }

  const meta = getCompassOptionMeta(moodOption);
  return {
    label: moodOption,
    ariaLabel: `Dagskompass — ${moodOption}`,
    icon: meta?.icon ?? Cloud,
    tone: meta?.tone ?? null,
  };
}
