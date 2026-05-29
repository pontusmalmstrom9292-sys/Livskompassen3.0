import type { JournalEntry } from '../types/journal';

export type JournalArchiveFilters = {
  query: string;
  mood: string | null;
  category: string | null;
};

function normalizeQuery(q: string): string {
  return q.trim().toLowerCase();
}

/** Klientsides sök + filter (ingen RAG, ingen server-query). */
export function filterJournalEntries(
  entries: JournalEntry[],
  filters: JournalArchiveFilters,
): JournalEntry[] {
  const q = normalizeQuery(filters.query);
  return entries.filter((entry) => {
    if (filters.mood && entry.mood !== filters.mood) return false;
    if (filters.category && entry.category !== filters.category) return false;
    if (!q) return true;
    const haystack = [
      entry.text,
      entry.mood,
      entry.category,
      ...(entry.tags ?? []),
      entry.attachment?.name,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function journalCategoriesInEntries(entries: JournalEntry[]): string[] {
  const ids = new Set<string>();
  for (const e of entries) {
    if (e.category) ids.add(e.category);
  }
  return [...ids];
}

export type JournalDayGroup = {
  dayKey: string;
  label: string;
  entries: JournalEntry[];
};

/** Gruppera filtrerade poster per kalenderdag (fallande). */
export function groupJournalEntriesByDay(entries: JournalEntry[]): JournalDayGroup[] {
  const byDay = new Map<string, JournalEntry[]>();

  for (const entry of entries) {
    const dayKey = entry.createdAt?.slice(0, 10) ?? 'unknown';
    const list = byDay.get(dayKey) ?? [];
    list.push(entry);
    byDay.set(dayKey, list);
  }

  const sortedKeys = [...byDay.keys()].sort((a, b) => b.localeCompare(a));

  return sortedKeys.map((dayKey) => {
    const dayEntries = byDay.get(dayKey) ?? [];
    const label =
      dayKey === 'unknown'
        ? 'Tid okänd'
        : formatDayHeading(dayKey);
    return { dayKey, label, entries: dayEntries };
  });
}

function formatDayHeading(isoDate: string): string {
  const date = new Date(`${isoDate}T12:00:00`);
  if (Number.isNaN(date.getTime())) return isoDate;

  const today = new Date();
  const todayKey = toLocalDayKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = toLocalDayKey(yesterday);

  if (isoDate === todayKey) return 'Idag';
  if (isoDate === yesterdayKey) return 'Igår';

  return date
    .toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' })
    .toUpperCase();
}

function toLocalDayKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
