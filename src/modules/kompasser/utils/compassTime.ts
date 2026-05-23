export type CompassFlow = 'morning' | 'day' | 'evening';

/** Morgon 05:00–10:59, dag 11:00–16:59, kväll övrigt (De-3-Kompasserna-SPEC §3). */
export const COMPASS_MORNING_START_HOUR = 5;
export const COMPASS_MORNING_END_HOUR = 11;
export const COMPASS_DAY_END_HOUR = 17;

export function isDayCompassUnlocked(date = new Date()): boolean {
  return date.getHours() >= COMPASS_MORNING_END_HOUR;
}

/** Tids-default per De-3-Kompasserna-SPEC §3. */
export function getDefaultCompassByTime(date = new Date()): CompassFlow {
  const h = date.getHours();
  if (h >= COMPASS_MORNING_START_HOUR && h < COMPASS_MORNING_END_HOUR) return 'morning';
  if (h >= COMPASS_MORNING_END_HOUR && h < COMPASS_DAY_END_HOUR) return 'day';
  return 'evening';
}
