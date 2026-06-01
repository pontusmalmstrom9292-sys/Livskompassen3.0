/** ISO date string (YYYY-MM-DD). */
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
