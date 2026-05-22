/**
 * Deterministisk JADE-detektor (ingen LLM).
 * Varnar när text inbjuder till försvar/förklaring — särskilt i reflektion och spegling.
 */

type PatternTier = 'strong' | 'weak';

const JADE_PATTERNS: { pattern: RegExp; label: string; tier: PatternTier }[] = [
  { pattern: /\beftersom\b/i, label: 'eftersom', tier: 'strong' },
  { pattern: /\bdu måste förstå\b/i, label: 'du måste förstå', tier: 'strong' },
  { pattern: /\bjag ville bara\b/i, label: 'jag ville bara', tier: 'strong' },
  { pattern: /\bdet var inte meningen\b/i, label: 'det var inte meningen', tier: 'strong' },
  { pattern: /\bjag försvarar\b/i, label: 'jag försvarar', tier: 'strong' },
  { pattern: /\bjag förklarar\b/i, label: 'jag förklarar', tier: 'strong' },
  { pattern: /\bjag förklarade\b/i, label: 'jag förklarade', tier: 'strong' },
  { pattern: /\bmen jag har rätt\b/i, label: 'men jag har rätt', tier: 'strong' },
  { pattern: /\bmen jag försökte\b/i, label: 'men jag försökte', tier: 'strong' },
  { pattern: /\bmen jag menade\b/i, label: 'men jag menade', tier: 'strong' },
  { pattern: /\bmen jag måste förklara\b/i, label: 'men jag måste förklara', tier: 'strong' },
  { pattern: /\bmen jag vill bara förklara\b/i, label: 'men jag vill förklara', tier: 'strong' },
  { pattern: /\bdu förstår inte\b/i, label: 'du förstår inte', tier: 'strong' },
  { pattern: /\bdu förstår väl\b/i, label: 'du förstår väl', tier: 'strong' },
  { pattern: /\bsnälla förstå\b/i, label: 'snälla förstå', tier: 'strong' },
  { pattern: /\bjag lovar att\b/i, label: 'jag lovar att', tier: 'strong' },
  { pattern: /\bdet handlar inte om\b/i, label: 'det handlar inte om', tier: 'strong' },
  { pattern: /\bjag menar inte\b/i, label: 'jag menar inte', tier: 'strong' },
  { pattern: /\bförlåt\b/i, label: 'förlåt', tier: 'weak' },
  { pattern: /\bforlat\b/i, label: 'förlåt', tier: 'weak' },
  { pattern: /\bursäkta\b/i, label: 'ursäkta', tier: 'weak' },
  { pattern: /\bursakt\b/i, label: 'ursäkta', tier: 'weak' },
  { pattern: /\bför att\b/i, label: 'för att', tier: 'weak' },
  { pattern: /\bfor att\b/i, label: 'för att', tier: 'weak' },
];

export type JadeRiskResult = {
  hasRisk: boolean;
  triggers: string[];
};

export function detectJadeRisk(text: string): JadeRiskResult {
  const trimmed = text.trim();
  if (!trimmed) return { hasRisk: false, triggers: [] };

  const triggers: string[] = [];
  let hasStrong = false;
  let weakCount = 0;

  for (const { pattern, label, tier } of JADE_PATTERNS) {
    if (!pattern.test(trimmed)) continue;
    triggers.push(label);
    if (tier === 'strong') hasStrong = true;
    else weakCount += 1;
  }

  const unique = [...new Set(triggers)];
  /** Svaga signaler ensamma (t.ex. bara "förlåt" i dagbok) ska inte larma. */
  const hasRisk = hasStrong || weakCount >= 2;

  return { hasRisk, triggers: unique };
}

export const JADE_GUARD_MESSAGE =
  'JADE-risk: texten förklarar eller ber om förståelse. Behåll känsla eller fakta — stryk försvar riktat mot motpart.';
