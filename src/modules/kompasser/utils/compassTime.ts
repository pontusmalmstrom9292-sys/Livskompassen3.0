export type CompassFlow = 'morning' | 'day' | 'evening';

/** Tids-default per De-3-Kompasserna-SPEC §3 (morgon 05–11, dag 11–17, kväll övrigt). */
export function getDefaultCompassByTime(date = new Date()): CompassFlow {
  const h = date.getHours();
  if (h >= 5 && h < 12) return 'morning';
  if (h >= 12 && h < 17) return 'day';
  return 'evening';
}
