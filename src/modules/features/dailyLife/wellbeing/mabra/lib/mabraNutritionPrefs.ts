import {
  DEFAULT_NUTRITION_PREFS,
  type NutritionPrefs,
} from './mabraNutritionIntakeTypes';

const PREFIX = 'mabra_nutrition_prefs_';

function storageKey(uid: string): string {
  return `${PREFIX}${uid}`;
}

function parsePrefs(raw: Partial<NutritionPrefs>): NutritionPrefs {
  return {
    gentleNudges: raw.gentleNudges !== false,
    mealReminders: raw.mealReminders !== false,
    trendView: raw.trendView === true,
    detailedAnalysis: raw.detailedAnalysis === true,
    macroTracking: raw.macroTracking === true,
  };
}

export function readNutritionPrefs(uid = 'local'): NutritionPrefs {
  if (typeof localStorage === 'undefined') return { ...DEFAULT_NUTRITION_PREFS };
  try {
    const raw = localStorage.getItem(storageKey(uid));
    if (!raw) return { ...DEFAULT_NUTRITION_PREFS };
    return parsePrefs(JSON.parse(raw) as Partial<NutritionPrefs>);
  } catch {
    return { ...DEFAULT_NUTRITION_PREFS };
  }
}

export function writeNutritionPrefs(uid: string, prefs: NutritionPrefs): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(storageKey(uid), JSON.stringify(parsePrefs(prefs)));
}

export function patchNutritionPrefs(
  uid: string,
  patch: Partial<NutritionPrefs>,
): NutritionPrefs {
  const next = parsePrefs({ ...readNutritionPrefs(uid), ...patch });
  writeNutritionPrefs(uid, next);
  return next;
}
