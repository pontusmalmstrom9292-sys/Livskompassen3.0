import type { KampsparEntryRow } from '../../../core/types/firestore';

export type TidshjulRing = 'dåtid' | 'nutid' | 'framtid';

export interface TidshjulPartitions {
  dåtid: KampsparEntryRow[];
  nutid: KampsparEntryRow[];
  framtid: KampsparEntryRow[];
}

const NUTID_DAYS = 14;
const MAX_PER_RING = { dåtid: 10, nutid: 6, framtid: 4 } as const;

function parseEffectiveDate(entry: KampsparEntryRow): Date {
  const raw = entry.eventDate?.trim() || entry.createdAt?.trim() || '';
  const parsed = Date.parse(raw);
  return Number.isNaN(parsed) ? new Date(0) : new Date(parsed);
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** G13 — partition live kampspar by eventDate (not static mock ring). */
export function partitionKampsparForTidshjulet(entries: KampsparEntryRow[]): TidshjulPartitions {
  const today = startOfLocalDay(new Date());
  const nutidCutoff = new Date(today);
  nutidCutoff.setDate(nutidCutoff.getDate() - NUTID_DAYS);

  const sorted = [...entries].sort(
    (a, b) => parseEffectiveDate(b).getTime() - parseEffectiveDate(a).getTime()
  );

  const dåtid: KampsparEntryRow[] = [];
  const nutid: KampsparEntryRow[] = [];
  const framtid: KampsparEntryRow[] = [];

  for (const entry of sorted) {
    const effective = startOfLocalDay(parseEffectiveDate(entry));
    if (effective.getTime() > today.getTime()) {
      if (framtid.length < MAX_PER_RING.framtid) framtid.push(entry);
    } else if (effective.getTime() >= nutidCutoff.getTime()) {
      if (nutid.length < MAX_PER_RING.nutid) nutid.push(entry);
    } else {
      if (dåtid.length < MAX_PER_RING.dåtid) dåtid.push(entry);
    }
  }

  return { dåtid, nutid, framtid };
}

export function formatTidshjulLabel(entry: KampsparEntryRow): string {
  return entry.eventDate?.slice(0, 10) || entry.createdAt?.slice(0, 10) || '—';
}

/** Lightweight Mönster-Arkivarien-hint utan extra LLM-anrop. */
export function buildTidshjulPatternHint(entries: KampsparEntryRow[]): string | null {
  if (entries.length === 0) return null;

  const now = Date.now();
  const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
  const recent = entries.filter((e) => parseEffectiveDate(e).getTime() >= thirtyDaysAgo);

  const categoryCount = new Map<string, number>();
  const tagCount = new Map<string, number>();
  for (const e of entries) {
    if (e.category) {
      categoryCount.set(e.category, (categoryCount.get(e.category) ?? 0) + 1);
    }
    for (const t of e.tags ?? []) {
      tagCount.set(t, (tagCount.get(t) ?? 0) + 1);
    }
  }

  const topCategory = [...categoryCount.entries()].sort((a, b) => b[1] - a[1])[0];
  const topTag = [...tagCount.entries()].sort((a, b) => b[1] - a[1])[0];

  const parts: string[] = [
    `${entries.length} poster i Minne`,
    `${recent.length} senaste 30 dagarna`,
  ];
  if (topCategory) parts.push(`vanligaste kategori: ${topCategory[0]} (${topCategory[1]})`);
  if (topTag) parts.push(`tagg: ${topTag[0]}`);

  return parts.join(' · ');
}
