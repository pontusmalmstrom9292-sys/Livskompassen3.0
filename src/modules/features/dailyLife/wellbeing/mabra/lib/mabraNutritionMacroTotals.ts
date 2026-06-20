import { entriesForDate, readNutritionEntries } from './mabraNutritionIntakeStorage';
import { nutritionDateKey } from './mabraNutritionDayStorage';
import type { NutritionIntakeEntry, NutritionMacroGrams } from './mabraNutritionIntakeTypes';

export type NutritionMacroDayTotals = {
  proteinG: number;
  fatG: number;
  carbsG: number;
  entriesWithMacros: number;
};

export function sanitizeMacroGrams(value: unknown): number | undefined {
  if (value === '' || value === null || value === undefined) return undefined;
  const n = typeof value === 'number' ? value : Number.parseInt(String(value), 10);
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return Math.min(500, Math.round(n));
}

export function normalizeMacroInput(input?: Partial<NutritionMacroGrams>): NutritionMacroGrams | undefined {
  if (!input) return undefined;
  const proteinG = sanitizeMacroGrams(input.proteinG);
  const fatG = sanitizeMacroGrams(input.fatG);
  const carbsG = sanitizeMacroGrams(input.carbsG);
  if (proteinG === undefined && fatG === undefined && carbsG === undefined) return undefined;
  return { proteinG, fatG, carbsG };
}

export function sumMacroTotals(entries: NutritionIntakeEntry[]): NutritionMacroDayTotals {
  let proteinG = 0;
  let fatG = 0;
  let carbsG = 0;
  let entriesWithMacros = 0;

  for (const entry of entries) {
    const m = entry.macros;
    if (!m) continue;
    const p = m.proteinG ?? 0;
    const f = m.fatG ?? 0;
    const c = m.carbsG ?? 0;
    if (p + f + c <= 0) continue;
    proteinG += p;
    fatG += f;
    carbsG += c;
    entriesWithMacros += 1;
  }

  return { proteinG, fatG, carbsG, entriesWithMacros };
}

export function computeDailyMacroTotals(
  uid: string,
  dateKey = nutritionDateKey(),
): NutritionMacroDayTotals {
  return sumMacroTotals(entriesForDate(readNutritionEntries(uid), dateKey));
}
