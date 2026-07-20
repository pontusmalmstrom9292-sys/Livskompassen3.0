/**
 * Barn-incident heuristik (Barnen-silo) — beteendemönster, aldrig diagnos.
 * Form speglar tacticPatternLibrary; tags är bh-* (inte cn-*).
 * libraryVersion: bump vid nya mönster.
 */

export const BARN_INCIDENT_LIBRARY_VERSION = '2026.07.1';

export type BarnIncidentTag =
  | 'triangulering'
  | 'loyalty_conflict'
  | 'parental_alienation_pattern'
  | 'contact_fear_relay'
  | 'blame_relay'
  | 'separation_anxiety_signal'
  | 'unclear_source';

/** UI-etiketter — parental_alienation_pattern får aldrig visas som diagnos. */
export const BARN_INCIDENT_TAG_LABELS: Record<BarnIncidentTag, string> = {
  triangulering: 'Triangulering (budskap via barnet)',
  loyalty_conflict: 'Lojalitetskonflikt',
  parental_alienation_pattern: 'Observerat kommunikationsmönster (beteende)',
  contact_fear_relay: 'Kontaktångest vidarebefordrad',
  blame_relay: 'Skuld/ansvar vidarebefordrat',
  separation_anxiety_signal: 'Oro kring överlämning',
  unclear_source: 'Osäkert citat vs tolkning',
};

export type BarnIncidentPatternDef = {
  id: string;
  tag: BarnIncidentTag;
  pattern: string;
  flags?: string;
  weight?: number;
  /** Frågekort-id från incidentSupportBank */
  questionCardId?: string;
  /** Script-id max 32 tecken (firestore bankId) */
  scriptBankId?: string;
};

export const BARN_INCIDENT_PATTERN_DEFS: readonly BarnIncidentPatternDef[] = [
  {
    id: 'bh-tri-001',
    tag: 'triangulering',
    pattern: '(mamma|pappa|henne|honom).{0,40}(sa|sagt|säger|berättat).{0,40}(att|om)',
    flags: 'i',
    weight: 40,
    questionCardId: 'bh-r4-hande-04',
    scriptBankId: 'BP-CRISIS-05',
  },
  {
    id: 'bh-tri-002',
    tag: 'triangulering',
    pattern: 'sa att (mamma|pappa).{0,30}(sagt|sa)',
    flags: 'i',
    weight: 42,
    questionCardId: 'bh-r4-hande-04',
    scriptBankId: 'BP-CRISIS-05',
  },
  {
    id: 'bh-loy-001',
    tag: 'loyalty_conflict',
    pattern: '(vem tycker du|måste välja|välja sida|älskar du mest|ska jag bo)',
    flags: 'i',
    weight: 35,
    questionCardId: 'bh-r4-hande-05',
    scriptBankId: 'BP-CRISIS-06',
  },
  {
    id: 'bh-pap-001',
    tag: 'parental_alienation_pattern',
    pattern: '(vill inte träffa|bryr dig inte|hatar dig|dålig (pappa|mamma)|skyller på dig)',
    flags: 'i',
    weight: 35,
    questionCardId: 'bh-r4-akut-03',
    scriptBankId: 'BP-PARENT-07',
  },
  {
    id: 'bh-gate-001',
    tag: 'contact_fear_relay',
    pattern: '(inte vill träffa|vill inte träffa|du bryr dig inte|vill inte komma)',
    flags: 'i',
    weight: 30,
    questionCardId: 'bh-r4-hande-05',
    scriptBankId: 'BP-CRISIS-05',
  },
  {
    id: 'bh-blame-001',
    tag: 'blame_relay',
    pattern: '(det är ditt fel|du förstörde|på grund av dig|skyller på)',
    flags: 'i',
    weight: 30,
    questionCardId: 'bh-r4-pappa-01',
    scriptBankId: 'BP-PARENT-01',
  },
  {
    id: 'bh-anx-001',
    tag: 'separation_anxiety_signal',
    pattern: '(överlämning|hämtning|lämning|innan (hen|han|hon) åkte|efter skolan).{0,40}(orolig|ledsen|rädd|grät)',
    flags: 'i',
    weight: 20,
    questionCardId: 'bh-r4-sig-03',
    scriptBankId: 'BP-CRISIS-01',
  },
  {
    id: 'bh-unc-001',
    tag: 'unclear_source',
    pattern: '(tror att|känns som|verkar som|kanske sa)',
    flags: 'i',
    weight: 10,
    questionCardId: 'bh-r4-akut-04',
    scriptBankId: 'BP-PARENT-01',
  },
];

export type BarnIncidentMatch = {
  patternId: string;
  tag: BarnIncidentTag;
  matchedText: string;
  weight: number;
  questionCardId?: string;
  scriptBankId?: string;
  label: string;
};

function compile(def: BarnIncidentPatternDef): RegExp {
  return new RegExp(def.pattern, def.flags ?? 'i');
}

/** Deterministisk scan — ingen LLM. */
export function scanBarnIncidentText(text: string): BarnIncidentMatch[] {
  const raw = text.trim();
  if (!raw) return [];

  const byTag = new Map<BarnIncidentTag, BarnIncidentMatch>();

  for (const def of BARN_INCIDENT_PATTERN_DEFS) {
    const re = compile(def);
    const m = raw.match(re);
    if (!m) continue;
    const weight = def.weight ?? 20;
    const prev = byTag.get(def.tag);
    if (prev && prev.weight >= weight) continue;
    byTag.set(def.tag, {
      patternId: def.id,
      tag: def.tag,
      matchedText: m[0].slice(0, 80),
      weight,
      questionCardId: def.questionCardId,
      scriptBankId: def.scriptBankId,
      label: BARN_INCIDENT_TAG_LABELS[def.tag],
    });
  }

  return [...byTag.values()].sort((a, b) => b.weight - a.weight);
}

export function formatIncidentMetaTruth(tags: readonly BarnIncidentMatch[]): string {
  const ids = tags.map((t) => t.patternId).slice(0, 8);
  if (ids.length === 0) return '[incident_meta] tags=none v=' + BARN_INCIDENT_LIBRARY_VERSION;
  return `[incident_meta] tags=${ids.join(',')} v=${BARN_INCIDENT_LIBRARY_VERSION}`;
}
