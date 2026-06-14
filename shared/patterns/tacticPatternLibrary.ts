/**
 * Kanonisk taktik-bibliotek — delad mellan frontend (Mönster) och functions (DCAP/sidecar).
 * libraryVersion: bump vid nya mönster; gamla sidecar-poster förblir giltiga.
 */

export const TACTIC_LIBRARY_VERSION = '2026.06.1';

export type VaultTechnique =
  | 'DARVO'
  | 'GASLIGHTING'
  | 'JADE_BAIT'
  | 'THREAT'
  | 'LOVE_BOMBING'
  | 'SILENT_TREATMENT'
  | 'HOOVERING'
  | 'SMEAR'
  | 'ECONOMIC_CONTROL'
  | 'MATERNAL_FACADE'
  | 'TRAUMA_BONDING'
  | 'LEGAL_PRESSURE';

export type HamnTaktikSignalId =
  | 'hoovering'
  | 'smear'
  | 'ekonomisk_kontroll'
  | 'maternal_fasad'
  | 'trauma_bonding'
  | 'juridik_hot';

export type TacticPatternDef = {
  id: string;
  technique: VaultTechnique;
  pattern: string;
  flags?: string;
  kunskapFactId?: string;
  hamnSignalId?: HamnTaktikSignalId;
  weight?: number;
};

export const TACTIC_PATTERN_DEFS: readonly TacticPatternDef[] = [
  { id: 'cn-darvo-001', technique: 'DARVO', pattern: 'du är alltid så (känslig|dramatisk|överdriftig)', flags: 'i', kunskapFactId: 'kunskap-fact-cn-004', weight: 30 },
  { id: 'cn-gaslight-001', technique: 'GASLIGHTING', pattern: 'du hittar på', flags: 'i', kunskapFactId: 'kunskap-fact-cn-002', weight: 35 },
  { id: 'cn-gaslight-002', technique: 'GASLIGHTING', pattern: 'det har aldrig (hänt|sagts|gjorts)', flags: 'i', kunskapFactId: 'kunskap-fact-cn-002', weight: 35 },
  { id: 'cn-gaslight-003', technique: 'GASLIGHTING', pattern: 'du är (galen|psykisk|instabil)', flags: 'i', kunskapFactId: 'kunskap-fact-cn-002', weight: 40 },
  { id: 'cn-jade-001', technique: 'JADE_BAIT', pattern: 'varför gör du (alltid|aldrig)', flags: 'i', kunskapFactId: 'kunskap-fact-cn-009', weight: 20 },
  { id: 'cn-jade-002', technique: 'JADE_BAIT', pattern: 'du måste (förklara|bevisa|motivera)', flags: 'i', kunskapFactId: 'kunskap-fact-cn-009', weight: 25 },
  { id: 'cn-threat-001', technique: 'THREAT', pattern: '(annars|om inte).*konsekvens', flags: 'i', weight: 50 },
  { id: 'cn-threat-002', technique: 'THREAT', pattern: 'jag ska se till att', flags: 'i', weight: 45 },
  { id: 'cn-love-001', technique: 'LOVE_BOMBING', pattern: 'ingen (älskar|förstår|vet) dig som jag', flags: 'i', kunskapFactId: 'kunskap-fact-044', weight: 30 },
  { id: 'cn-hoover-001', technique: 'HOOVERING', pattern: 'saknar\\s+dig', flags: 'i', kunskapFactId: 'kunskap-fact-cn-016', hamnSignalId: 'hoovering', weight: 25 },
  { id: 'cn-hoover-002', technique: 'HOOVERING', pattern: 'barnens\\s+skull', flags: 'i', kunskapFactId: 'kunskap-fact-cn-016', hamnSignalId: 'hoovering', weight: 25 },
  { id: 'cn-hoover-003', technique: 'HOOVERING', pattern: 'kan\\s+vi\\s+prata\\s+igen', flags: 'i', kunskapFactId: 'kunskap-fact-cn-016', hamnSignalId: 'hoovering', weight: 20 },
  { id: 'cn-smear-001', technique: 'SMEAR', pattern: 'berättat\\s+för', flags: 'i', kunskapFactId: 'kunskap-fact-cn-017', hamnSignalId: 'smear', weight: 30 },
  { id: 'cn-smear-002', technique: 'SMEAR', pattern: 'skolan\\s+vet', flags: 'i', kunskapFactId: 'kunskap-fact-cn-017', hamnSignalId: 'smear', weight: 30 },
  { id: 'cn-smear-003', technique: 'SMEAR', pattern: 'förtalskampanj', flags: 'i', kunskapFactId: 'kunskap-fact-cn-017', hamnSignalId: 'smear', weight: 35 },
  { id: 'cn-econ-001', technique: 'ECONOMIC_CONTROL', pattern: 'betala\\s+inte', flags: 'i', kunskapFactId: 'kunskap-fact-cn-021', hamnSignalId: 'ekonomisk_kontroll', weight: 35 },
  { id: 'cn-econ-002', technique: 'ECONOMIC_CONTROL', pattern: 'pengar\\s+som\\s+straff', flags: 'i', kunskapFactId: 'kunskap-fact-cn-021', hamnSignalId: 'ekonomisk_kontroll', weight: 35 },
  { id: 'cn-maternal-001', technique: 'MATERNAL_FACADE', pattern: 'perfekt\\s+(mor|mamma)', flags: 'i', kunskapFactId: 'kunskap-fact-cn-020', hamnSignalId: 'maternal_fasad', weight: 25 },
  { id: 'cn-maternal-002', technique: 'MATERNAL_FACADE', pattern: 'idealiserad\\s+(mor|mamma)', flags: 'i', kunskapFactId: 'kunskap-fact-cn-020', hamnSignalId: 'maternal_fasad', weight: 25 },
  { id: 'cn-trauma-001', technique: 'TRAUMA_BONDING', pattern: 'kan\\s+inte\\s+leva\\s+utan', flags: 'i', kunskapFactId: 'kunskap-fact-cn-019', hamnSignalId: 'trauma_bonding', weight: 30 },
  { id: 'cn-trauma-002', technique: 'TRAUMA_BONDING', pattern: 'vi\\s+hör\\s+ihop', flags: 'i', kunskapFactId: 'kunskap-fact-cn-019', hamnSignalId: 'trauma_bonding', weight: 25 },
  { id: 'cn-juridik-001', technique: 'LEGAL_PRESSURE', pattern: 'orosanmälan', flags: 'i', kunskapFactId: 'kunskap-fact-jur-004', hamnSignalId: 'juridik_hot', weight: 40 },
  { id: 'cn-juridik-002', technique: 'LEGAL_PRESSURE', pattern: 'tingsrätten', flags: 'i', kunskapFactId: 'kunskap-fact-jur-004', hamnSignalId: 'juridik_hot', weight: 40 },
  { id: 'cn-juridik-003', technique: 'LEGAL_PRESSURE', pattern: 'ensam\\s+vårdnad', flags: 'i', kunskapFactId: 'kunskap-fact-jur-004', hamnSignalId: 'juridik_hot', weight: 45 },
];

export type TacticMatch = {
  patternId: string;
  technique: VaultTechnique;
  matchedText: string;
  kunskapFactId?: string;
  weight: number;
};

export function compileTacticPatterns(
  defs: readonly TacticPatternDef[] = TACTIC_PATTERN_DEFS,
): { def: TacticPatternDef; re: RegExp }[] {
  return defs.map((def) => ({
    def,
    re: new RegExp(def.pattern, def.flags ?? 'i'),
  }));
}

export function scanTextForTactics(text: string): TacticMatch[] {
  const trimmed = text.trim();
  if (trimmed.length < 4) return [];

  const matches: TacticMatch[] = [];
  for (const { def, re } of compileTacticPatterns()) {
    const m = trimmed.match(re);
    if (m) {
      matches.push({
        patternId: def.id,
        technique: def.technique,
        matchedText: m[0],
        kunskapFactId: def.kunskapFactId,
        weight: def.weight ?? 20,
      });
    }
  }
  return matches;
}

export function uniqueTechniques(matches: TacticMatch[]): VaultTechnique[] {
  return [...new Set(matches.map((m) => m.technique))];
}

export function uniqueKunskapFactIds(matches: TacticMatch[]): string[] {
  return [...new Set(matches.map((m) => m.kunskapFactId).filter(Boolean) as string[])];
}

export function patternIdsHash(patternIds: string[]): string {
  return [...patternIds].sort().join('|');
}
