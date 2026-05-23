import type { VaultLog } from '../../core/types/firestore';

export type VaultTechnique =
  | 'DARVO'
  | 'GASLIGHTING'
  | 'JADE_BAIT'
  | 'THREAT'
  | 'LOVE_BOMBING';

const SCAN_PATTERNS: { pattern: RegExp; technique: VaultTechnique }[] = [
  { pattern: /du är alltid så (känslig|dramatisk|överdriftig)/i, technique: 'DARVO' },
  { pattern: /du hittar på/i, technique: 'GASLIGHTING' },
  { pattern: /det har aldrig (hänt|sagts|gjorts)/i, technique: 'GASLIGHTING' },
  { pattern: /du är (galen|psykisk|instabil)/i, technique: 'GASLIGHTING' },
  { pattern: /varför gör du (alltid|aldrig)/i, technique: 'JADE_BAIT' },
  { pattern: /du måste (förklara|bevisa|motivera)/i, technique: 'JADE_BAIT' },
  { pattern: /(annars|om inte).*konsekvens/i, technique: 'THREAT' },
  { pattern: /jag ska se till att/i, technique: 'THREAT' },
  { pattern: /ingen (älskar|förstår|vet) dig som jag/i, technique: 'LOVE_BOMBING' },
];

function logText(log: VaultLog): string {
  return [
    log.truth,
    log.theirVersion,
    log.myReality,
    log.shieldWhat,
    log.shieldFeeling,
    log.shieldBoundary,
    ...(log.bodySignals ?? []),
  ]
    .filter(Boolean)
    .join('\n');
}

export type VaultFrequencyReport = {
  totalPosts: number;
  smsLikePosts: number;
  techniqueCounts: Record<VaultTechnique, number>;
  categoryCounts: Record<string, number>;
  monthlyCounts: { month: string; count: number }[];
  topTechniques: { technique: VaultTechnique; count: number }[];
};

export function buildVaultFrequencyReport(
  logs: (VaultLog & { id: string })[],
): VaultFrequencyReport {
  const techniqueCounts = Object.fromEntries(
    SCAN_PATTERNS.map((p) => [p.technique, 0]),
  ) as Record<VaultTechnique, number>;
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

    for (const { pattern, technique } of SCAN_PATTERNS) {
      if (pattern.test(text)) {
        techniqueCounts[technique] += 1;
      }
    }
  }

  const monthlyCounts = [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, count]) => ({ month, count }));

  const topTechniques = (Object.entries(techniqueCounts) as [VaultTechnique, number][])
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([technique, count]) => ({ technique, count }));

  return {
    totalPosts: logs.length,
    smsLikePosts,
    techniqueCounts,
    categoryCounts,
    monthlyCounts,
    topTechniques,
  };
}

/** D19/D20 — teknik-taggar för en enskild post (deterministiskt). */
export function scanTechniquesForLog(log: VaultLog): VaultTechnique[] {
  const text = logText(log);
  const found = new Set<VaultTechnique>();
  for (const { pattern, technique } of SCAN_PATTERNS) {
    if (pattern.test(text)) found.add(technique);
  }
  return [...found];
}
