import type { DiscoveryCategoryId } from '../content/discoveryBentoCatalog';
import { getDiscoveryCategory } from '../content/discoveryBentoCatalog';
import { resolveDiscoveryBankCard, type DiscoveryResolvedCard } from './discoveryBankResolver';

function fnv1a(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function localDateKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function pickFromPool<T>(pool: readonly T[], seed: string): T | null {
  if (pool.length === 0) return null;
  return pool[fnv1a(seed) % pool.length] ?? null;
}

export type DiscoveryCardPick = {
  dateKey: string;
  categoryId: DiscoveryCategoryId;
  bankId: string;
  card: DiscoveryResolvedCard;
};

/**
 * Deterministiskt kort per dag + kategori — samma kort hela dagen, ny vid midnatt.
 * Ingen streak, ingen Kunskap-RAG.
 */
export function pickDiscoveryCard(options: {
  categoryId: DiscoveryCategoryId;
  uid?: string;
  date?: Date;
}): DiscoveryCardPick | null {
  const category = getDiscoveryCategory(options.categoryId);
  if (!category) return null;

  const dateKey = localDateKey(options.date);
  const uid = options.uid ?? 'anon';
  const seed = `${dateKey}|${uid}|disc|${options.categoryId}`;
  const bankId = pickFromPool(category.bankIds, seed);
  if (!bankId) return null;

  const card = resolveDiscoveryBankCard(bankId);
  if (!card) return null;

  return { dateKey, categoryId: options.categoryId, bankId, card };
}
