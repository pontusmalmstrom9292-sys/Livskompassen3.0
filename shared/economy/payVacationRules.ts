/**
 * Semesterersättning — 13,2 % (Livs) vs 12 % (lag).
 */
import type { PayProfileContext } from './payProfileContext';

export type VacationAccrual = {
  fraction: number;
  monthlyAccrualSek: number;
  dailyVacationPaySek: number;
  label: string;
};

export function computeVacationAccrual(profile: PayProfileContext): VacationAccrual {
  const fraction = profile.agreementConfig.vacationPayFraction;
  const monthlyAccrualSek = Math.round(profile.monthlySalarySek * fraction * 100) / 100;
  const dailyVacationPaySek =
    Math.round((monthlyAccrualSek / profile.agreementConfig.vacationDayDivisor) * 100) / 100;

  return {
    fraction,
    monthlyAccrualSek,
    dailyVacationPaySek,
    label:
      fraction >= 0.132
        ? 'Semester 13,2 % (kollektivavtal)'
        : 'Semester 12 % (lag)',
  };
}
