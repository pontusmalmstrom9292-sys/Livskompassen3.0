/** Deterministisk taktik-signal i Hamn — ingen LLM, ingen cross-RAG. */

export type HamnTaktikSignalId =
  | 'written_only_escalation'
  | 'hoovering'
  | 'smear'
  | 'ekonomisk_kontroll'
  | 'maternal_fasad'
  | 'trauma_bonding'
  | 'juridik_hot';

export type HamnTaktikSignal = {
  id: HamnTaktikSignalId;
  label: string;
  hint: string;
};

const SIGNALS: ReadonlyArray<{
  id: HamnTaktikSignalId;
  label: string;
  hint: string;
  patterns: RegExp[];
}> = [
  {
    id: 'written_only_escalation',
    label: 'Skrift-eskalering',
    hint:
      'Telefon eller "vi måste prata" eskalerar ofta konflikt — svara skriftligt (BIFF). Referens cop-007 i Taktik-lexikon; inget JADE.',
    patterns: [
      /ring\s+(?:mig|nu|direkt)/i,
      /(?:svara|ta)\s+(?:i\s+)?telefon/i,
      /vi\s+måste\s+prata(?:\s+nu)?/i,
      /(?:måste|behöver)\s+prata\s+(?:i\s+)?(?:telefon|muntligt)/i,
      /hör\s+av\s+dig\s+(?:nu|direkt|i\s+telefon)/i,
      /(?:kan|vill)\s+du\s+ringa/i,
      /svara\s+när\s+jag\s+ringer/i,
      /(?:träffas|ses)\s+(?:nu|idag|imorgon)\s+(?:och\s+)?prata/i,
    ],
  },
  {
    id: 'hoovering',
    label: 'Hoovering',
    hint: 'Återkontakt efter gräns — håll svar kort (BIFF). Referens i Taktik-lexikon.',
    patterns: [
      /hoover/i,
      /saknar\s+dig/i,
      /barnens\s+skull/i,
      /kan\s+vi\s+prata\s+igen/i,
      /glöm\s+(allt|det\s+vi)/i,
      /ge\s+mig\s+en\s+chans/i,
      /nostalgi/i,
      /kom\s+tillbaka/i,
      /längtar\s+efter/i,
      /behöver\s+prata\s+med\s+dig/i,
      /jag\s+ångrar/i,
      /(?:gåva|present)\s+(?:till|från)/i,
      /brådskande/i,
    ],
  },
  {
    id: 'smear',
    label: 'Smear campaign',
    hint: 'Systematiskt narrativ mot tredje part — logga vem, vad och när i Valv.',
    patterns: [
      /smear/i,
      /förtalskampanj/i,
      /flying\s+monkey/i,
      /alla\s+vet/i,
      /berättat\s+för/i,
      /(?:pratat|berättat)\s+(?:illa|negativt)\s+om/i,
      /sprider\s+(?:lögn|rykten)/i,
      /skolan\s+vet/i,
      /(?:rektor|förskolan)\s+(?:har|vet|tror)/i,
      /soc\s+vet/i,
      /förtal/i,
      /förstör\s+(mitt|ditt)\s+(rykte|anseende)/i,
    ],
  },
  {
    id: 'ekonomisk_kontroll',
    label: 'Ekonomisk kontroll',
    hint: 'Pengar som press — svara bara på logistik (~10 %). Referens i Taktik-lexikon.',
    patterns: [
      /ekonomisk\s+kontroll/i,
      /underhåll/i,
      /betala\s+inte/i,
      /pengar\s+som\s+straff/i,
      /skuld\s+till\s+mig/i,
      /räkning(ar)?\s+som\s+betingelse/i,
      /om\s+du\s+inte\s+betalar/i,
    ],
  },
  {
    id: 'maternal_fasad',
    label: 'Maternal fasad',
    hint:
      'Offentlig vs privat bild — observerbart, inte moralisk dom. Referens cn-020 i Taktik-lexikon; logga diskrepans i Valv.',
    patterns: [
      /maternal[\s-]?(?:image|fasad)/i,
      /idealiserad\s+(?:mor|mamma)/i,
      /perfekt\s+(?:mor|mamma)/i,
      /framstår\s+som\s+(?:omsorgsfull|perfekt)/i,
      /(?:skolan|bvc|förskolan).*(?:annorlunda|helt\s+annat|skillnad)/i,
      /(?:hemma|privat).*(?:skiljer|annorlunda|helt\s+annat)/i,
      /(?:läraren|personalen)\s+(?:tror|tycker|säger)/i,
      /(?:snäll|perfekt)\s+(?:mot|i)\s+(?:skolan|lärare|bvc|förskolan)/i,
      /offentligt\s+(?:är|framstår)/i,
    ],
  },
  {
    id: 'trauma_bonding',
    label: 'Trauma bonding',
    hint:
      'Intermittent värme/straff — igenkänning, inte JADE. Referens cn-019 i Taktik-lexikon; sms är EVIDENCE i Valv.',
    patterns: [
      /trauma\s+bond/i,
      /traumatisk\s+bind/i,
      /kan\s+inte\s+leva\s+utan/i,
      /vi\s+hör\s+ihop/i,
      /själsfrände/i,
      /utan\s+dig\s+(?:går|klarar|orkar)/i,
      /vi\s+behöver\s+varandra/i,
      /ingen\s+annan\s+förstår/i,
    ],
  },
  {
    id: 'juridik_hot',
    label: 'Juridik-hot',
    hint:
      'Skilj logistik (~10 %) från affekt — svara bara på datum/handling. Referens jur-004 i Taktik-lexikon.',
    patterns: [
      /ensam\s+vårdnad/i,
      /\bsoc\b/i,
      /orosanmälan/i,
      /advokat/i,
      /tingsrätten/i,
      /lvu/i,
      /(?:familje)?domstol/i,
      /vårdnad(?:stvist)?/i,
      /familjerätten/i,
      /juridisk\s+(?:hot|varning)/i,
      /kallelse\s+(?:till|från)/i,
    ],
  },
];

export function detectHamnTaktikSignal(text: string): HamnTaktikSignal | null {
  const trimmed = text.trim();
  if (trimmed.length < 12) return null;

  for (const signal of SIGNALS) {
    if (signal.patterns.some((re) => re.test(trimmed))) {
      return { id: signal.id, label: signal.label, hint: signal.hint };
    }
  }
  return null;
}
