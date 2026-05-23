export type CompassFlow = 'morning' | 'day' | 'evening';

/** Morgon 05–10, dag 11–17, kväll 18–04 (De-3-Kompasserna-SPEC §3). */
export const COMPASS_MORNING_START_HOUR = 5;
export const COMPASS_MORNING_END_HOUR = 11;
export const COMPASS_DAY_END_HOUR = 18;
export const COMPASS_EVENING_START_HOUR = 18;

export function isDayCompassUnlocked(date = new Date()): boolean {
  return date.getHours() >= COMPASS_MORNING_END_HOUR;
}

/** Kvällsflik från 18:00 tills morgonkompassen börjar (inkl. natt). */
export function isEveningCompassUnlocked(date = new Date()): boolean {
  const h = date.getHours();
  return h >= COMPASS_EVENING_START_HOUR || h < COMPASS_MORNING_START_HOUR;
}

/** Tids-default per De-3-Kompasserna-SPEC §3. */
export function getDefaultCompassByTime(date = new Date()): CompassFlow {
  const h = date.getHours();
  if (h >= COMPASS_MORNING_START_HOUR && h < COMPASS_MORNING_END_HOUR) return 'morning';
  if (h >= COMPASS_MORNING_END_HOUR && h < COMPASS_DAY_END_HOUR) return 'day';
  return 'evening';
}
