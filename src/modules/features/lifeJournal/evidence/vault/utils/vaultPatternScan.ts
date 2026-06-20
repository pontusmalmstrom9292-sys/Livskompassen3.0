import type { VaultLog } from '@/core/types/firestore';
import {
  scanTextForTactics,
  type VaultTechnique,
  TACTIC_LIBRARY_VERSION,
} from '@/shared/patterns/tacticPatternLibrary';
import { normalizeStringArray } from './normalizeVaultLog';

export type { VaultTechnique };
export { TACTIC_LIBRARY_VERSION };

function logText(log: VaultLog): string {
  return [
    log.truth,
    log.theirVersion,
    log.myReality,
    log.shieldWhat,
    log.shieldFeeling,
    log.shieldBoundary,
    ...(normalizeStringArray(log.bodySignals)),
  ]
    .filter(Boolean)
    .join('\n');
}

export type VaultFrequencyReport = {
  totalPosts: number;
  smsLikePosts: number;
  techniqueCounts: Record<string, number>;
  categoryCounts: Record<string, number>;
  monthlyCounts: { month: string; count: number }[];
  topTechniques: { technique: string; count: number }[];
  libraryVersion: string;
};

export function buildVaultFrequencyReport(
  logs: (VaultLog & { id: string })[],
  persistedTechniquesByLogId?: ReadonlyMap<string, readonly string[]>,
): VaultFrequencyReport {
  const techniqueCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};
  const monthMap = new Map<string, number>();
  let smsLikePosts = 0;

  for (const log of logs) {
    const text = logText(log);
    const category = log.category || 'okategoriserad';
    categoryCounts[category] = (categoryCounts[category] ?? 0) + 1;

    const month = (log.createdAt ?? '').slice(0, 7) || 'okänd';
    monthMap.set(month, (monthMap.get(month) ?? 0) + 1);

    if (/sms|mejl|meddelande|kommunikation/i.test(`${category} ${log.action}`)) {
      smsLikePosts += 1;
    }

    const techniques = new Set<string>();
    for (const m of scanTextForTactics(text)) {
      techniques.add(m.technique);
    }
    const persisted = persistedTechniquesByLogId?.get(log.id);
    if (persisted) {
      for (const t of persisted) techniques.add(t);
    }

    for (const technique of techniques) {
      techniqueCounts[technique] = (techniqueCounts[technique] ?? 0) + 1;
    }
  }

  const monthlyCounts = [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, count]) => ({ month, count }));

  const topTechniques = Object.entries(techniqueCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([technique, count]) => ({ technique, count }));

  return {
    totalPosts: logs.length,
    smsLikePosts,
    techniqueCounts,
    categoryCounts,
    monthlyCounts,
    topTechniques,
    libraryVersion: TACTIC_LIBRARY_VERSION,
  };
}

export function scanTechniquesForLog(log: VaultLog): VaultTechnique[] {
  const matches = scanTextForTactics(logText(log));
  return [...new Set(matches.map((m) => m.technique))];
}

export function scanTechniquesForText(text: string): VaultTechnique[] {
  return [...new Set(scanTextForTactics(text).map((m) => m.technique))];
}

/** True om posten matchar taktik (live-regex + valfri sidecar-metadata). */
export function logHasTechnique(
  log: VaultLog & { id: string },
  technique: string,
  persistedTechniquesByLogId?: ReadonlyMap<string, readonly string[]>,
): boolean {
  const techniques = new Set<string>(scanTechniquesForLog(log));
  const persisted = persistedTechniquesByLogId?.get(log.id);
  if (persisted) {
    for (const t of persisted) techniques.add(t);
  }
  return techniques.has(technique);
}
