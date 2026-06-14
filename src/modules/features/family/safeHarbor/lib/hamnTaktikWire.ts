/** Deterministisk taktik-signal i Hamn — ingen LLM, ingen cross-RAG. */

export type HamnTaktikSignalId = 'hoovering' | 'smear' | 'ekonomisk_kontroll';

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
    ],
  },
  {
    id: 'smear',
    label: 'Smear campaign',
    hint: 'Systematiskt narrativ mot tredje part — logga vem, vad och när i Valv.',
    patterns: [
      /smear/i,
      /alla\s+vet/i,
      /berättat\s+för/i,
      /skolan\s+vet/i,
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
