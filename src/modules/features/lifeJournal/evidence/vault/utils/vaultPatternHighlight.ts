/**
 * vaultPatternHighlight.ts
 * Klientsides mönster-highlight för VaultLogList (Fas 3 / Obsidian Calm-palett).
 * Rör INTE Firestore, WORM, eller säkerhetssilor.
 */

export type HighlightCategory = 'stress' | 'calm' | 'danger' | 'anchor' | 'gaslighting';

interface PatternGroup {
  category: HighlightCategory;
  /** Tailwind-klasser applicerade på matchad span */
  className: string;
  terms: readonly string[];
}

/**
 * Kurerat ordbibliotek — Obsidian Calm-palett.
 * Amber/röd = stress/fara, Blå/grön = lugn/ankare, Violett = manipulation.
 */
const PATTERN_GROUPS: PatternGroup[] = [
  {
    category: 'stress',
    // Dämpad bärnstensgul — varningssignal utan skrik
    className: 'bg-amber-900/30 text-amber-200 rounded px-0.5',
    terms: [
      'ångest', 'stress', 'panik', 'rädsla', 'orolig', 'oro', 'spänd',
      'ilska', 'arg', 'frustrerad', 'utmattad', 'överväldigad', 'ensam',
      'hopplös', 'hjälplös', 'skam', 'skuld', 'fel', 'misslyckad',
    ],
  },
  {
    category: 'danger',
    // Dämpad rosaröd — konkret hotindikator
    className: 'bg-rose-900/30 text-rose-200 rounded px-0.5',
    terms: [
      'hot', 'hotade', 'rädd', 'slag', 'slår', 'skrek', 'skrek åt',
      'kränkning', 'kränkte', 'förnedring', 'tvingas', 'tvingade',
      'kontroll', 'isolering', 'förbjöd', 'nekade', 'bestraffning',
    ],
  },
  {
    category: 'gaslighting',
    // Dämpad lila — kognitiv manipulation
    className: 'bg-violet-900/30 text-violet-200 rounded px-0.5',
    terms: [
      'inbillar dig', 'inbillar', 'du hittar på', 'hittar på',
      'överdrivet', 'dramatiserar', 'dramatisk', 'paranoid',
      'minns fel', 'minns inte', 'det hände inte',
      'det sa jag aldrig', 'du missförstår',
    ],
  },
  {
    category: 'calm',
    // Dämpad cyan — återhämtning och lugn
    className: 'bg-cyan-900/25 text-cyan-200 rounded px-0.5',
    terms: [
      'lugnare', 'lugn', 'vila', 'sov', 'sömn', 'avslappnad',
      'trygg', 'trygghet', 'ro', 'bättre', 'glad', 'lättad',
      'tacksamhet', 'tacksam', 'hopp',
    ],
  },
  {
    category: 'anchor',
    // Dämpad grön — sanningsankare
    className: 'bg-emerald-900/25 text-emerald-200 rounded px-0.5',
    terms: [
      'bevis', 'vittne', 'vittnen', 'dokumenterat', 'dokumenterade',
      'sant', 'sanning', 'faktum', 'fakta', 'verkligen', 'verklig',
      'skärmdump', 'inspelning', 'logg',
    ],
  },
];

// Pre-compiled regex per grupp för prestanda
const COMPILED_GROUPS = PATTERN_GROUPS.map((group) => ({
  ...group,
  regex: new RegExp(
    `\\b(${group.terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'gi',
  ),
}));

export type HighlightSpan = {
  text: string;
  className?: string;
  category?: HighlightCategory;
};

/**
 * Delar upp `text` i spans med highlight-klasser där mönsterord matchar.
 * Returnerar en array av { text, className? } som renderas som <span>-element.
 */
export function highlightPatterns(text: string): HighlightSpan[] {
  if (!text) return [{ text }];

  // Samla alla matchningar med deras position
  type Match = { start: number; end: number; className: string; category: HighlightCategory };
  const matches: Match[] = [];

  for (const group of COMPILED_GROUPS) {
    group.regex.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = group.regex.exec(text)) !== null) {
      // Undvik överlappning — ta bara den grupp som träffar först
      const start = m.index;
      const end = m.index + m[0].length;
      const overlap = matches.some((ex) => ex.start < end && ex.end > start);
      if (!overlap) {
        matches.push({ start, end, className: group.className, category: group.category });
      }
    }
  }

  if (matches.length === 0) return [{ text }];

  matches.sort((a, b) => a.start - b.start);

  const spans: HighlightSpan[] = [];
  let cursor = 0;
  for (const match of matches) {
    if (match.start > cursor) {
      spans.push({ text: text.slice(cursor, match.start) });
    }
    spans.push({
      text: text.slice(match.start, match.end),
      className: match.className,
      category: match.category,
    });
    cursor = match.end;
  }
  if (cursor < text.length) {
    spans.push({ text: text.slice(cursor) });
  }

  return spans;
}
