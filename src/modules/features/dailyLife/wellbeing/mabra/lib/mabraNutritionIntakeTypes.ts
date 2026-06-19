/** Diskret näringsintag — typer (lokal lagring, ej WORM). */

export type NutritionIntakeKind = 'food' | 'drink';

/** Energikänsla — inte moral. */
export type NutritionQuality = 'good' | 'ok' | 'poor';

export type NutritionIntakeEntry = {
  id: string;
  at: string;
  kind: NutritionIntakeKind;
  note: string;
  quality: NutritionQuality;
};

export type NutritionPrefs = {
  gentleNudges: boolean;
  mealReminders: boolean;
  trendView: boolean;
  detailedAnalysis: boolean;
  macroTracking: boolean;
};

export type NutritionNudge = {
  id: string;
  message: string;
  tone: 'info' | 'care';
};

export const NUTRITION_QUALITY_LABELS: Record<NutritionQuality, string> = {
  good: 'Bra energi',
  ok: 'Okej',
  poor: 'Tungt / socker',
};

export const DEFAULT_NUTRITION_PREFS: NutritionPrefs = {
  gentleNudges: true,
  mealReminders: true,
  trendView: false,
  detailedAnalysis: false,
  macroTracking: false,
};
