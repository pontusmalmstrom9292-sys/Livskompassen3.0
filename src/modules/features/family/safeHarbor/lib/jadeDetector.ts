export interface JadeViolation {
  type: 'J' | 'A' | 'D' | 'E';
  label: string;
  description: string;
}

/** Lokal realtidsanalys för JADE-mönster (Justify, Argue, Defend, Explain) */
export function analyzeJadePatterns(text: string): JadeViolation[] {
  const lower = text.toLowerCase();
  const violations: JadeViolation[] = [];

  if (
    lower.includes('förklara') ||
    lower.includes('måste förstå') ||
    lower.includes('vill förtydliga') ||
    lower.includes('meningen var')
  ) {
    violations.push({
      type: 'J',
      label: 'Justifiering (Förklaring)',
      description:
        'Du försöker få motparten att förstå eller godkänna dina skäl. Detta ger motparten mer "bränsle" att angripa.',
    });
  }
  if (
    lower.includes('ljuger') ||
    lower.includes('du gjorde') ||
    lower.includes('du alltid') ||
    lower.includes('du aldrig') ||
    lower.includes('du började')
  ) {
    violations.push({
      type: 'A',
      label: 'Argumentering (Anklagelse)',
      description:
        'Du går i motattack eller påpekar hens fel. Håll fokus helt på saklig logistik, aldrig hens karaktär.',
    });
  }
  if (
    lower.includes('mitt fel') ||
    lower.includes('försvarar') ||
    lower.includes('gjorde det för att') ||
    lower.includes('inte sant')
  ) {
    violations.push({
      type: 'D',
      label: 'Försvar (Defensivitet)',
      description:
        'Du försvarar ditt beteende. Ett defensivt svar ger ofta motparten bekräftelse och fortsatt konflikt — Grey Rock avslutar utan bränsle.',
    });
  }
  if (
    lower.includes('eftersom') ||
    lower.includes('därför att') ||
    lower.includes('orsaken är') ||
    lower.includes('anledningen var')
  ) {
    violations.push({
      type: 'E',
      label: 'Explikering (Förtydligande)',
      description:
        'Du förklarar bakomliggande detaljer eller motiv. En fientlig motpart är inte intresserad av "varför" — svara bara Ja, Nej eller ge fakta.',
    });
  }

  return violations;
}
