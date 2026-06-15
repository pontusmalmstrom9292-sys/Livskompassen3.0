/**
 * Shared evolution_hub → evolution_ledger diff logic (client + Cloud Functions).
 * Append-only WORM — inga update/delete.
 */

export type EvolutionLedgerType =
  | 'milestone_unlocked'
  | 'capacity_increased'
  | 'child_age_milestone'
  | 'pillar_rebalance';

export type EvolutionPillar =
  | 'kognitiv'
  | 'emotionell'
  | 'vardag'
  | 'relationell'
  | 'valv'
  | 'system';

export interface EvolutionPillarState {
  level: number;
  score: number;
}

export interface ChildAgeState {
  ageYears?: number;
  currentBracket: 'toddler_preschool' | 'early_school' | 'pre_teen' | 'teen';
  lastUpdated?: string;
  barnportenLevel?: number;
  birthDate?: string;
}

export interface EvolutionHubDoc {
  userId?: string;
  ownerId?: string;
  updatedAt?: string;
  barnportenLevel?: number;
  pillars?: {
    kognitiv: EvolutionPillarState;
    emotionell: EvolutionPillarState;
    vardag: EvolutionPillarState;
    relationell: EvolutionPillarState;
    valv: EvolutionPillarState;
  };
  childrenAgeState?: Record<string, ChildAgeState>;
  unlockedFeatureFlags?: string[];
  unlockedPacks?: string[];
}

export type LedgerWriteInput = {
  userId: string;
  type: EvolutionLedgerType;
  pillar: EvolutionPillar;
  levelBefore: number;
  levelAfter: number;
  rationale: string;
  metadata: Record<string, unknown>;
};

const HUB_PILLAR_KEYS = [
  'kognitiv',
  'emotionell',
  'vardag',
  'relationell',
  'valv',
] as const satisfies readonly EvolutionPillar[];

/** Stabil fingerprint — skip sync när hub-state oförändrad (client + server). */
export function hubLedgerFingerprint(doc: EvolutionHubDoc): string {
  return JSON.stringify({
    pillars: doc.pillars,
    flags: doc.unlockedFeatureFlags,
    packs: doc.unlockedPacks,
    children: doc.childrenAgeState,
    barnportenLevel: doc.barnportenLevel,
  });
}

/** Dedup-nyckel per ledger-rad — förhindrar dubbel append (client + server). */
export function ledgerEntryDedupKey(entry: Pick<LedgerWriteInput, 'type' | 'pillar' | 'levelBefore' | 'levelAfter' | 'metadata'>): string {
  return JSON.stringify({
    type: entry.type,
    pillar: entry.pillar,
    levelBefore: entry.levelBefore,
    levelAfter: entry.levelAfter,
    metadata: entry.metadata,
  });
}

export function ledgerEntryDedupKeyFromStored(data: Record<string, unknown>): string {
  return ledgerEntryDedupKey({
    type: data.type as EvolutionLedgerType,
    pillar: data.pillar as EvolutionPillar,
    levelBefore: typeof data.levelBefore === 'number' ? data.levelBefore : 0,
    levelAfter: typeof data.levelAfter === 'number' ? data.levelAfter : 0,
    metadata: (data.metadata && typeof data.metadata === 'object'
      ? data.metadata
      : {}) as Record<string, unknown>,
  });
}

/** Pure diff — returnerar ledger-poster att append:a. Kräver prev (första hub-skrivning loggas inte). */
export function collectLedgerEntriesFromHubDiff(
  userId: string,
  prev: EvolutionHubDoc | null,
  next: EvolutionHubDoc,
): LedgerWriteInput[] {
  if (!prev) return [];

  const entries: LedgerWriteInput[] = [];

  if (prev.pillars && next.pillars) {
    for (const pillar of HUB_PILLAR_KEYS) {
      const before = prev.pillars[pillar]?.level ?? 0;
      const after = next.pillars[pillar]?.level ?? 0;
      if (after > before) {
        entries.push({
          userId,
          type: 'capacity_increased',
          pillar,
          levelBefore: before,
          levelAfter: after,
          rationale: `Kapacitet ökad i pelare ${pillar}`,
          metadata: { source: 'evolution_hub', pillar },
        });
      }
    }
  }

  const beforeFlags = new Set(prev.unlockedFeatureFlags ?? []);
  for (const flag of next.unlockedFeatureFlags ?? []) {
    if (beforeFlags.has(flag)) continue;
    entries.push({
      userId,
      type: 'milestone_unlocked',
      pillar: 'system',
      levelBefore: beforeFlags.size,
      levelAfter: (next.unlockedFeatureFlags ?? []).length,
      rationale: `Feature-flag upplåst: ${flag}`,
      metadata: { source: 'evolution_hub', flag },
    });
  }

  const prevChildren = prev.childrenAgeState;
  const nextChildren = next.childrenAgeState;
  if (nextChildren) {
    for (const alias of Object.keys(nextChildren)) {
      const before = prevChildren?.[alias]?.currentBracket;
      const after = nextChildren[alias]?.currentBracket;
      if (!after || before === after) continue;
      entries.push({
        userId,
        type: 'child_age_milestone',
        pillar: 'relationell',
        levelBefore: 0,
        levelAfter: 1,
        rationale: `Barn ${alias} byte till segment ${after}`,
        metadata: {
          source: 'evolution_hub',
          childAlias: alias,
          bracket: after,
          bracketBefore: before ?? null,
        },
      });
    }
  }

  const beforeRootLevel = prev.barnportenLevel ?? 1;
  const afterRootLevel = next.barnportenLevel ?? 1;
  if (afterRootLevel > beforeRootLevel) {
    entries.push({
      userId,
      type: 'capacity_increased',
      pillar: 'relationell',
      levelBefore: beforeRootLevel,
      levelAfter: afterRootLevel,
      rationale: `Barnporten global nivå ${beforeRootLevel} → ${afterRootLevel}`,
      metadata: { source: 'evolution_hub', field: 'barnportenLevel' },
    });
  }

  const beforePacks = new Set(prev.unlockedPacks ?? []);
  for (const packId of next.unlockedPacks ?? []) {
    if (beforePacks.has(packId)) continue;
    entries.push({
      userId,
      type: 'milestone_unlocked',
      pillar: 'relationell',
      levelBefore: beforePacks.size,
      levelAfter: (next.unlockedPacks ?? []).length,
      rationale: `Material-pack upplåst: ${packId}`,
      metadata: { source: 'evolution_hub', packId },
    });
  }

  return entries;
}
