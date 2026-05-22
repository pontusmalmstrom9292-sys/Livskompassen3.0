/** ISO-datum → svensk kortform (t.ex. 21 maj 2026). */
export function formatJournalDate(iso?: string): string {
  if (!iso) return '';
  const date = new Date(iso.slice(0, 10));
  if (Number.isNaN(date.getTime())) return iso.slice(0, 10);
  return date.toLocaleDateString('sv-SE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function truncateJournalText(text: string, max = 200): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}
