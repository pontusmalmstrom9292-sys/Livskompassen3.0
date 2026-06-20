import { nutritionDateKey } from './mabraNutritionDayStorage';
import { normalizeMacroInput } from './mabraNutritionMacroTotals';
import type { NutritionIntakeEntry, NutritionMacroGrams, NutritionQuality } from './mabraNutritionIntakeTypes';

const PREFIX = 'mabra_nutrition_entries_';
const MAX_ENTRIES = 500;
const MAX_NOTE = 120;

function storageKey(uid: string): string {
  return `${PREFIX}${uid}`;
}

function sanitizeEntry(raw: Partial<NutritionIntakeEntry>): NutritionIntakeEntry | null {
  if (typeof raw.id !== 'string' || typeof raw.at !== 'string') return null;
  const kind = raw.kind === 'drink' ? 'drink' : 'food';
  const quality: NutritionQuality =
    raw.quality === 'good' || raw.quality === 'ok' || raw.quality === 'poor'
      ? raw.quality
      : 'ok';
  const note =
    typeof raw.note === 'string' ? raw.note.trim().slice(0, MAX_NOTE) : '';
  const macros = normalizeMacroInput(raw.macros as Partial<NutritionMacroGrams> | undefined);
  return macros ? { id: raw.id, at: raw.at, kind, note, quality, macros } : { id: raw.id, at: raw.at, kind, note, quality };
}

export function readNutritionEntries(uid = 'local'): NutritionIntakeEntry[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(storageKey(uid));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Partial<NutritionIntakeEntry>[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(sanitizeEntry)
      .filter((e): e is NutritionIntakeEntry => e !== null)
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

function writeNutritionEntries(uid: string, entries: NutritionIntakeEntry[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(storageKey(uid), JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

export function appendNutritionEntry(
  uid: string,
  input: {
    kind: NutritionIntakeEntry['kind'];
    note: string;
    quality: NutritionQuality;
    at?: string;
    macros?: Partial<NutritionMacroGrams>;
  },
): NutritionIntakeEntry {
  const macros = normalizeMacroInput(input.macros);
  const entry: NutritionIntakeEntry = {
    id: crypto.randomUUID(),
    at: input.at ?? new Date().toISOString(),
    kind: input.kind,
    note: input.note.trim().slice(0, MAX_NOTE),
    quality: input.quality,
    ...(macros ? { macros } : {}),
  };
  const existing = readNutritionEntries(uid);
  writeNutritionEntries(uid, [entry, ...existing]);
  return entry;
}

export function entriesForDate(
  entries: NutritionIntakeEntry[],
  dateKey = nutritionDateKey(),
): NutritionIntakeEntry[] {
  return entries.filter((e) => e.at.slice(0, 10) === dateKey);
}

export function entriesInLastDays(
  entries: NutritionIntakeEntry[],
  days: number,
  now = new Date(),
): NutritionIntakeEntry[] {
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  const cutoffIso = cutoff.toISOString();
  return entries.filter((e) => e.at >= cutoffIso);
}

export type NutritionTrendDay = {
  dateKey: string;
  good: number;
  ok: number;
  poor: number;
  total: number;
};

export function buildSevenDayTrend(
  entries: NutritionIntakeEntry[],
  now = new Date(),
): NutritionTrendDay[] {
  const days: NutritionTrendDay[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateKey = nutritionDateKey(d);
    const dayEntries = entriesForDate(entries, dateKey);
    days.push({
      dateKey,
      good: dayEntries.filter((e) => e.quality === 'good').length,
      ok: dayEntries.filter((e) => e.quality === 'ok').length,
      poor: dayEntries.filter((e) => e.quality === 'poor').length,
      total: dayEntries.length,
    });
  }
  return days;
}
