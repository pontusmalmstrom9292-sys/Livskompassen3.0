/** Delade journal-hjälpare för executive hem. */

export function formatJournalDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatRelativeJournalDate(date: Date): string {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const timeString = date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

  if (date.toDateString() === today.toDateString()) return `idag ${timeString}`;
  if (date.toDateString() === yesterday.toDateString()) return `igår ${timeString}`;

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}.${month}.${date.getFullYear()}`;
}

export function journalEntryDate(entry: { createdAt?: unknown }): Date {
  const raw = entry.createdAt as { toDate?: () => Date } | string | undefined;
  if (raw && typeof raw === 'object' && 'toDate' in raw && typeof raw.toDate === 'function') {
    return raw.toDate();
  }
  if (raw) return new Date(raw as string);
  return new Date();
}

export const EXEC_REFLEKTION_BG =
  "linear-gradient(to bottom, rgba(12, 12, 14, 0.35), rgba(12, 12, 14, 0.88)), url('/design/home-hero-scenic.png')";
