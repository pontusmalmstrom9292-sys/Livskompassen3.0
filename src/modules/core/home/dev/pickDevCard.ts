/**
 * Deterministisk KEEP-pick för Utvecklingskort — FNV + excludeIds (aldrig igen).
 * Ingen LLM, ingen RAG.
 */
import { resolveDiscoveryBankCard, type DiscoveryResolvedCard } from '@/features/dailyLife/wellbeing/compasses/lib/discoveryBankResolver';
import type { DevCategoryResolved } from './devCategoryBankMap';

function fnv1a(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function localDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function pickFromPool<T>(pool: readonly T[], seed: string): T | null {
  if (pool.length === 0) return null;
  return pool[fnv1a(seed) % pool.length] ?? null;
}

export type DevCardPick = {
  categoryId: string;
  discoveryCategoryId: string;
  bankId: string;
  dateKey: string;
  card: DiscoveryResolvedCard;
  /** true när KEEP-pool tömd — visa fallbackBody */
  exhausted: boolean;
};

/**
 * Välj fråga från kategori-pool, exkludera completed bankIds.
 * Om pool tom → exhausted (soft fallback i UI).
 */
export function pickDevCard(options: {
  category: DevCategoryResolved;
  uid?: string;
  date?: Date;
  excludeIds?: ReadonlySet<string> | readonly string[];
}): DevCardPick | null {
  const { category } = options;
  const dateKey = localDateKey(options.date);
  const uid = options.uid ?? 'anon';
  const exclude = options.excludeIds
    ? options.excludeIds instanceof Set
      ? options.excludeIds
      : new Set(options.excludeIds)
    : new Set<string>();

  const available = category.bankIds.filter((id) => {
    if (exclude.has(id)) return false;
    return Boolean(resolveDiscoveryBankCard(id));
  });

  if (available.length === 0) {
    return {
      categoryId: category.id,
      discoveryCategoryId: category.discoveryCategoryId,
      bankId: '',
      dateKey,
      card: {
        bankId: '',
        content_class: 'REFLECTION',
        body_sv: category.body,
      },
      exhausted: true,
    };
  }

  const seed = `${dateKey}|${uid}|hem_dev|${category.id}`;
  const bankId = pickFromPool(available, seed);
  if (!bankId) return null;
  const card = resolveDiscoveryBankCard(bankId);
  if (!card) return null;

  return {
    categoryId: category.id,
    discoveryCategoryId: category.discoveryCategoryId,
    bankId,
    dateKey,
    card,
    exhausted: false,
  };
}

/** Test/helper: filtrera pool utan att picka. */
export function filterAvailableBankIds(
  bankIds: readonly string[],
  excludeIds: ReadonlySet<string> | readonly string[],
): string[] {
  const exclude = excludeIds instanceof Set ? excludeIds : new Set(excludeIds);
  return bankIds.filter((id) => !exclude.has(id) && Boolean(resolveDiscoveryBankCard(id)));
}
