/**
 * Deterministisk JADE-detektor (ingen LLM).
 * Varnar när text inbjuder till försvar/förklaring — särskilt i reflektion och spegling.
 */

const JADE_PATTERNS: { pattern: RegExp; label: string }[] = [
  { pattern: /\beftersom\b/i, label: 'eftersom' },
  { pattern: /\bförlåt\b/i, label: 'förlåt' },
  { pattern: /\bforlat\b/i, label: 'förlåt' },
  { pattern: /\bför att\b/i, label: 'för att' },
  { pattern: /\bfor att\b/i, label: 'för att' },
  { pattern: /\bdu måste förstå\b/i, label: 'du måste förstå' },
  { pattern: /\bjag ville bara\b/i, label: 'jag ville bara' },
  { pattern: /\bdet var inte meningen\b/i, label: 'det var inte meningen' },
  { pattern: /\bjag försvarar\b/i, label: 'jag försvarar' },
  { pattern: /\bjag förklarar\b/i, label: 'jag förklarar' },
  { pattern: /\bjag förklarade\b/i, label: 'jag förklarade' },
  { pattern: /\bmen jag\b/i, label: 'men jag' },
  { pattern: /\bdu förstår inte\b/i, label: 'du förstår inte' },
  { pattern: /\bdu förstår väl\b/i, label: 'du förstår väl' },
  { pattern: /\bursäkta\b/i, label: 'ursäkta' },
  { pattern: /\bursakt\b/i, label: 'ursäkta' },
  { pattern: /\bsnälla förstå\b/i, label: 'snälla förstå' },
  { pattern: /\bjag lovar att\b/i, label: 'jag lovar att' },
  { pattern: /\bdet handlar inte om\b/i, label: 'det handlar inte om' },
  { pattern: /\bjag menar inte\b/i, label: 'jag menar inte' },
];

export type JadeRiskResult = {
  hasRisk: boolean;
  triggers: string[];
};

export function detectJadeRisk(text: string): JadeRiskResult {
  const trimmed = text.trim();
  if (!trimmed) return { hasRisk: false, triggers: [] };

  const triggers: string[] = [];
  for (const { pattern, label } of JADE_PATTERNS) {
    if (pattern.test(trimmed)) triggers.push(label);
  }

  return {
    hasRisk: triggers.length > 0,
    triggers: [...new Set(triggers)],
  };
}

export const JADE_GUARD_MESSAGE =
  'JADE-risk upptäckt. Stryk allt som förklarar varför — behåll endast fakta eller känsla utan försvar.';
