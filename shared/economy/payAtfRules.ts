/**
 * Arbetstidskonto — Livs 2,92 % (2026).
 */
import type { PayProfileContext } from './payProfileContext';

export type AtfAccrual = {
  fraction: number;
  monthlyAccrualSek: number;
  hoursEquivalent: number;
  label: string;
};

export function computeAtfAccrual(profile: PayProfileContext): AtfAccrual {
  const fraction = profile.agreementConfig.atfAccrualFraction;
  const monthlyAccrualSek = Math.round(profile.monthlySalarySek * fraction * 100) / 100;
  const hoursEquivalent =
    profile.hourlyRateSek > 0
      ? Math.round((monthlyAccrualSek / profile.hourlyRateSek) * 100) / 100
      : 0;

  return {
    fraction,
    monthlyAccrualSek,
    hoursEquivalent,
    label: fraction > 0 ? `Arbetstidskonto ${(fraction * 100).toFixed(2)} %` : 'Inget arbetstidskonto',
  };
}
