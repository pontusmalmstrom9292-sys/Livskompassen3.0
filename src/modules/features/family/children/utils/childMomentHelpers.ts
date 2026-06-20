import type { LucideIcon } from 'lucide-react';
import { Anchor, Heart, School, Sparkles, Sun } from 'lucide-react';
import { LIVSLOGG_CATEGORIES, type ChildAlias, type LivsloggCategory } from '../constants';

export const STUND_MAX_CHARS = 250;

/** Kategori vid spar av «Ny stund» — ankare-växel vinner över dropdown. */
export function resolveStundCategory(
  selected: LivsloggCategory,
  saveAsAnchor: boolean,
): LivsloggCategory {
  return saveAsAnchor ? 'ankare' : selected;
}
import type { ChildrenLogEntry } from '../types';
import { coerceLogText, barnfokusDisplayText } from './logFieldUtils';

export function isFavoriteMoment(log: ChildrenLogEntry): boolean {
  if (log.category === 'positivt' || log.category === 'ankare') return true;
  const text = `${coerceLogText(log.observation)} ${coerceLogText(log.truth)}`.toLowerCase();
  return /\b(älskar|mys|skratt|stolt|kul|fin|trygg|mysig|tacksam|glad)\b/.test(text);
}

export function momentBody(log: ChildrenLogEntry): string {
  if (log.signals) {
    return `Sömn ${log.signals.somn} · Ångest ${log.signals.angest} · Aptit ${log.signals.aptit}`;
  }
  return barnfokusDisplayText(log.observation) || barnfokusDisplayText(log.truth);
}

export function categoryLabel(category?: string): string {
  const hit = LIVSLOGG_CATEGORIES.find((c) => c.value === category);
  return hit?.label ?? category ?? 'Stund';
}

export function categoryIcon(category?: string): LucideIcon {
  switch (category) {
    case 'barnfokus':
    case 'middag':
      return Sparkles;
    case 'ankare':
    case 'positivt':
      return Heart;
    case 'skola':
    case 'tredjepart':
      return School;
    case 'halsa':
      return Sun;
    default:
      return Anchor;
  }
}

export function getFeaturedMoment(
  logs: ChildrenLogEntry[],
  childAlias: ChildAlias,
): ChildrenLogEntry | null {
  const rows = logs.filter((l) => l.childAlias === childAlias && l.action === 'livslogg');
  const favorite = rows.find((l) => isFavoriteMoment(l));
  if (favorite) return favorite;
  return (
    rows.find((l) => l.category === 'barnfokus' || l.category === 'middag') ?? rows[0] ?? null
  );
}

export function filterStunderLogs(
  logs: ChildrenLogEntry[],
  childAlias: ChildAlias,
  filter: 'all' | 'positiv' | 'barnfokus' | 'skola',
): ChildrenLogEntry[] {
  let rows = logs.filter((l) => l.childAlias === childAlias && l.action === 'livslogg');
  if (filter === 'positiv') {
    rows = rows.filter(isFavoriteMoment);
  } else if (filter === 'barnfokus') {
    rows = rows.filter((l) => l.category === 'barnfokus' || l.category === 'middag');
  } else if (filter === 'skola') {
    rows = rows.filter((l) => l.category === 'skola' || l.category === 'tredjepart');
  }
  return rows.sort((a, b) => Date.parse(b.createdAt ?? '') - Date.parse(a.createdAt ?? ''));
}

export function filterFavoriteLogs(
  logs: ChildrenLogEntry[],
  childAlias: ChildAlias,
): ChildrenLogEntry[] {
  return logs
    .filter((l) => l.childAlias === childAlias && l.action === 'livslogg' && isFavoriteMoment(l))
    .sort((a, b) => Date.parse(b.createdAt ?? '') - Date.parse(a.createdAt ?? ''));
}
