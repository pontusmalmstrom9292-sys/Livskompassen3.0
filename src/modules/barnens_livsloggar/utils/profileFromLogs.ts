import type { ChildAlias } from '../constants';
import { CHILD_PROFILE_SEEDS, type ChildProfileSeed } from '../constants/childProfiles';
import type { ChildrenLogEntry } from '../types';
import { excerptForProfile } from './livsloggQuestion';

export function getProfileSeed(alias: ChildAlias): ChildProfileSeed {
  return CHILD_PROFILE_SEEDS.find((p) => p.alias === alias) ?? CHILD_PROFILE_SEEDS[0]!;
}

/** F-B12.4 — senaste livsloggar, seed som fallback. */
export function profileObservationsFromLogs(
  alias: ChildAlias,
  logs: ChildrenLogEntry[],
): [string, string] {
  const seed = getProfileSeed(alias);
  const fromLogs = logs
    .filter(
      (l) =>
        l.childAlias === alias &&
        l.action === 'livslogg' &&
        (l.observation?.trim() || l.truth?.trim()),
    )
    .map((l) => excerptForProfile(l.observation ?? l.truth ?? ''))
    .filter((line) => line.length > 0)
    .slice(0, 2);

  const merged: string[] = [...fromLogs];
  for (const seedLine of seed.observations) {
    if (merged.length >= 2) break;
    if (!merged.some((m) => m === seedLine || m.startsWith(seedLine.slice(0, 20)))) {
      merged.push(seedLine);
    }
  }

  return [merged[0] ?? seed.observations[0], merged[1] ?? seed.observations[1]];
}
