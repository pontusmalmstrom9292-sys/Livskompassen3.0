/**
 * Smart time context — WIDGET_BIBLE 5.3
 * No polling: resolve on demand / visibility / next boundary.
 */

export type DayPeriod = 'morning' | 'midday' | 'evening' | 'night';

export type SmartTimeSnapshot = {
  period: DayPeriod;
  hour: number;
  focusLabel: string;
  suggestedWidgetIds: string[];
  message: string;
};

/** Period boundaries (local time): morning 07, midday 12, evening 18, night 22. */
export function resolveDayPeriod(date = new Date()): DayPeriod {
  const h = date.getHours();
  if (h >= 22 || h < 7) return 'night';
  if (h >= 18) return 'evening';
  if (h >= 12) return 'midday';
  return 'morning';
}

export function resolveSmartTime(date = new Date()): SmartTimeSnapshot {
  const period = resolveDayPeriod(date);
  const hour = date.getHours();

  switch (period) {
    case 'morning':
      return {
        period,
        hour,
        focusLabel: 'Framåtblick',
        suggestedWidgetIds: ['daily_tasks', 'daily_anchor', 'compass'],
        message: 'Dagens plan — tre viktiga steg räcker.',
      };
    case 'midday':
      return {
        period,
        hour,
        focusLabel: 'Paus & återhämtning',
        suggestedWidgetIds: ['daily_anchor', 'safe_harbor', 'beacon'],
        message: 'Lunch, vatten eller ett mikrosteg mot stress.',
      };
    case 'evening':
      return {
        period,
        hour,
        focusLabel: 'Närvaro',
        suggestedWidgetIds: ['child_focus', 'safe_harbor', 'inbox'],
        message: 'Familjen först — arbetet får vila.',
      };
    case 'night':
    default:
      return {
        period,
        hour,
        focusLabel: 'Nedvarvning',
        suggestedWidgetIds: ['journal', 'safe_harbor', 'daily_anchor'],
        message: 'Reflektera i en minut — eller bara andas.',
      };
  }
}

/** Ms until next period change — schedule one timeout, never setInterval. */
export function msUntilNextPeriod(date = new Date()): number {
  const h = date.getHours();
  const m = date.getMinutes();
  const s = date.getSeconds();
  const ms = date.getMilliseconds();
  const elapsedToday = ((h * 60 + m) * 60 + s) * 1000 + ms;

  const boundariesMin = [7 * 60, 12 * 60, 18 * 60, 22 * 60, 24 * 60 + 7 * 60];
  const nowMin = h * 60 + m;
  let nextMin = boundariesMin.find((b) => b > nowMin);
  if (nextMin === undefined) nextMin = 24 * 60 + 7 * 60;

  const nextMs = nextMin * 60 * 1000;
  const dayMs = 24 * 60 * 60 * 1000;
  const until = nextMs - elapsedToday;
  return until > 0 ? until : dayMs + until;
}
