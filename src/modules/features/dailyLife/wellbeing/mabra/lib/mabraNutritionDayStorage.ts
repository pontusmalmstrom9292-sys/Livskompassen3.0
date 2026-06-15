const PREFIX = 'mabra_nutrition_day_';

export type NutritionDayState = {
  waterGlasses: number;
  proteinMarked: boolean;
  omega3Marked: boolean;
  mealMarked: boolean;
};

export function nutritionDateKey(now = new Date()): string {
  return now.toISOString().slice(0, 10);
}

function storageKey(uid: string, dateKey: string): string {
  return `${PREFIX}${uid}_${dateKey}`;
}

const EMPTY: NutritionDayState = {
  waterGlasses: 0,
  proteinMarked: false,
  omega3Marked: false,
  mealMarked: false,
};

export function readNutritionDay(uid: string, dateKey = nutritionDateKey()): NutritionDayState {
  if (typeof localStorage === 'undefined') return { ...EMPTY };
  try {
    const raw = localStorage.getItem(storageKey(uid, dateKey));
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Partial<NutritionDayState>;
    const water = typeof parsed.waterGlasses === 'number' ? parsed.waterGlasses : 0;
    return {
      waterGlasses: Math.min(12, Math.max(0, Math.floor(water))),
      proteinMarked: parsed.proteinMarked === true,
      omega3Marked: parsed.omega3Marked === true,
      mealMarked: parsed.mealMarked === true,
    };
  } catch {
    return { ...EMPTY };
  }
}

export function writeNutritionDay(
  uid: string,
  state: NutritionDayState,
  dateKey = nutritionDateKey(),
): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(
    storageKey(uid, dateKey),
    JSON.stringify({
      waterGlasses: Math.min(12, Math.max(0, Math.floor(state.waterGlasses))),
      proteinMarked: state.proteinMarked,
      omega3Marked: state.omega3Marked,
      mealMarked: state.mealMarked,
    }),
  );
}
