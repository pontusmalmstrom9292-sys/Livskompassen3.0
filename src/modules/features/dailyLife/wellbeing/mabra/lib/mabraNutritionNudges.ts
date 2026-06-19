import { entriesForDate, entriesInLastDays } from './mabraNutritionIntakeStorage';
import { nutritionDateKey, type NutritionDayState } from './mabraNutritionDayStorage';
import type { NutritionIntakeEntry, NutritionNudge, NutritionPrefs } from './mabraNutritionIntakeTypes';

const DISMISSED_PREFIX = 'mabra_nutrition_nudge_dismissed_';

function dismissedKey(uid: string, nudgeId: string, dateKey: string): string {
  return `${DISMISSED_PREFIX}${uid}_${nudgeId}_${dateKey}`;
}

export function dismissNutritionNudge(uid: string, nudgeId: string, dateKey = nutritionDateKey()): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(dismissedKey(uid, nudgeId, dateKey), '1');
}

function isDismissed(uid: string, nudgeId: string, dateKey: string): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(dismissedKey(uid, nudgeId, dateKey)) === '1';
}

export function computeNutritionNudges(
  uid: string,
  entries: NutritionIntakeEntry[],
  dayState: NutritionDayState,
  prefs: NutritionPrefs,
  now = new Date(),
): NutritionNudge[] {
  if (!prefs.gentleNudges) return [];

  const dateKey = nutritionDateKey(now);
  const todayEntries = entriesForDate(entries, dateKey);
  const nudges: NutritionNudge[] = [];

  const lastEntry = todayEntries[0];
  if (
    lastEntry?.quality === 'poor' &&
    !isDismissed(uid, 'after-poor', dateKey)
  ) {
    nudges.push({
      id: 'after-poor',
      tone: 'care',
      message:
        'Senaste var tungt. Nästa steg kan vara ett glas vatten och något med protein — utan stress.',
    });
  }

  const hour = now.getHours();
  const hasMealSignal =
    dayState.mealMarked || todayEntries.some((e) => e.kind === 'food');
  if (
    prefs.mealReminders &&
    hour >= 14 &&
    !hasMealSignal &&
    !isDismissed(uid, 'meal-reminder', dateKey)
  ) {
    nudges.push({
      id: 'meal-reminder',
      tone: 'info',
      message: 'Har du ätit något idag? En liten bit räcker — kroppen behöver bränsle.',
    });
  }

  if (prefs.trendView) {
    const week = entriesInLastDays(entries, 7, now);
    const poorCount = week.filter((e) => e.quality === 'poor').length;
    if (poorCount >= 3 && !isDismissed(uid, 'week-pattern', dateKey)) {
      nudges.push({
        id: 'week-pattern',
        tone: 'care',
        message: `${poorCount} tunga val denna vecka. Mönster, inte misslyckande — vill du planera en enkel måltid imorgon?`,
      });
    }
  }

  return nudges.slice(0, 2);
}
