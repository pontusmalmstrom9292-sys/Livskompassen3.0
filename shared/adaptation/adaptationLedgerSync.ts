/**
 * Shared adaptation_prefs → adaptation_ledger diff logic (client + Cloud Functions).
 * Append-only WORM — inga update/delete.
 */

import type {
  AdaptationLedgerSource,
  AdaptationLedgerType,
  AdaptationLedgerWriteInput,
  AdaptationPrefsDoc,
  AdaptationSilo,
} from './adaptationTypes';

/** Stabil fingerprint — skip sync när prefs oförändrade (client + server). */
export function prefsLedgerFingerprint(doc: AdaptationPrefsDoc): string {
  return JSON.stringify({
    coachTone: doc.coachTone,
    uiDensity: doc.uiDensity,
    routingDefaults: doc.routingDefaults,
    dismissedHints: doc.dismissedHints,
    inferredSignals: doc.inferredSignals,
  });
}

/** Dedup-nyckel per ledger-rad — förhindrar dubbel append. */
export function adaptationLedgerDedupKey(
  entry: Pick<
    AdaptationLedgerWriteInput,
    'type' | 'source' | 'silo' | 'rationale' | 'metadata'
  >,
): string {
  return JSON.stringify({
    type: entry.type,
    source: entry.source,
    silo: entry.silo,
    rationale: entry.rationale,
    metadata: entry.metadata,
  });
}

export function adaptationLedgerDedupKeyFromStored(data: Record<string, unknown>): string {
  return adaptationLedgerDedupKey({
    type: data.type as AdaptationLedgerType,
    source: data.source as AdaptationLedgerSource,
    silo: data.silo as AdaptationSilo,
    rationale: typeof data.rationale === 'string' ? data.rationale : '',
    metadata: (data.metadata && typeof data.metadata === 'object'
      ? data.metadata
      : {}) as Record<string, unknown>,
  });
}

function routingDefaultsChanged(
  prev: Record<string, string>,
  next: Record<string, string>,
): boolean {
  return JSON.stringify(prev) !== JSON.stringify(next);
}

function dismissedHintsAdded(prev: string[], next: string[]): string[] {
  const prevSet = new Set(prev);
  return next.filter((hint) => !prevSet.has(hint));
}

function inferredSignalChanges(
  prev: Record<string, number | string | boolean>,
  next: Record<string, number | string | boolean>,
): string[] {
  const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
  const changed: string[] = [];
  for (const key of keys) {
    if (prev[key] !== next[key]) changed.push(key);
  }
  return changed;
}

/** Pure diff — returnerar ledger-poster att append:a. Kräver prev (första prefs-skrivning loggas inte). */
export function collectLedgerEntriesFromPrefsDiff(
  userId: string,
  prev: AdaptationPrefsDoc | null,
  next: AdaptationPrefsDoc,
  source: AdaptationLedgerSource = 'user',
  silo: AdaptationSilo = 'core',
): AdaptationLedgerWriteInput[] {
  if (!prev) return [];

  const entries: AdaptationLedgerWriteInput[] = [];

  if (prev.coachTone !== next.coachTone) {
    entries.push({
      userId,
      ownerId: userId,
      type: 'pref_updated',
      source,
      silo,
      rationale: `Coach-ton ändrad: ${prev.coachTone} → ${next.coachTone}`,
      metadata: {
        field: 'coachTone',
        before: prev.coachTone,
        after: next.coachTone,
      },
    });
  }

  if (prev.uiDensity !== next.uiDensity) {
    entries.push({
      userId,
      ownerId: userId,
      type: 'pref_updated',
      source,
      silo,
      rationale: `UI-täthet ändrad: ${prev.uiDensity} → ${next.uiDensity}`,
      metadata: {
        field: 'uiDensity',
        before: prev.uiDensity,
        after: next.uiDensity,
      },
    });
  }

  if (routingDefaultsChanged(prev.routingDefaults, next.routingDefaults)) {
    entries.push({
      userId,
      ownerId: userId,
      type: 'pref_updated',
      source,
      silo,
      rationale: 'Routing-defaults uppdaterade',
      metadata: {
        field: 'routingDefaults',
        before: prev.routingDefaults,
        after: next.routingDefaults,
      },
    });
  }

  const newHints = dismissedHintsAdded(prev.dismissedHints, next.dismissedHints);
  if (newHints.length > 0) {
    entries.push({
      userId,
      ownerId: userId,
      type: 'pref_updated',
      source,
      silo,
      rationale: `Hint avfärdad: ${newHints.join(', ')}`,
      metadata: { field: 'dismissedHints', added: newHints },
    });
  }

  const signalKeys = inferredSignalChanges(prev.inferredSignals, next.inferredSignals);
  if (signalKeys.length > 0) {
    entries.push({
      userId,
      ownerId: userId,
      type: 'signal_recorded',
      source,
      silo,
      rationale: `Signal(er) uppdaterade: ${signalKeys.join(', ')}`,
      metadata: {
        field: 'inferredSignals',
        changedKeys: signalKeys,
        before: Object.fromEntries(signalKeys.map((k) => [k, prev.inferredSignals[k]])),
        after: Object.fromEntries(signalKeys.map((k) => [k, next.inferredSignals[k]])),
      },
    });
  }

  return entries;
}
