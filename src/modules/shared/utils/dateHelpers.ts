export const TIMEZONE = 'Europe/Stockholm';

const DATE_FMT = new Intl.DateTimeFormat('sv-SE', {
  timeZone: TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** YYYY-MM-DD in Europe/Stockholm (ekonomi/stämpel-kanon). */
export function formatDateLocal(date = new Date()): string {
  const parts = DATE_FMT.formatToParts(date);
  const y = parts.find((p) => p.type === 'year')?.value ?? '0000';
  const m = parts.find((p) => p.type === 'month')?.value ?? '01';
  const d = parts.find((p) => p.type === 'day')?.value ?? '01';
  return `${y}-${m}-${d}`;
}

/** Alias for {@link formatDateLocal}. */
export function formatDate(date = new Date()): string {
  return formatDateLocal(date);
}

/** ISO date string (YYYY-MM-DD, UTC slice — not timezone-aware). */
export function toISODate(input: Date | number = Date.now()): string {
  const d = typeof input === 'number' ? new Date(input) : input;
  return d.toISOString().slice(0, 10);
}

/** Human-readable date (sv-SE by default). */
export function formatDisplayDate(
  input: Date | number | string,
  locale = 'sv-SE',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(locale, options).format(d);
}
