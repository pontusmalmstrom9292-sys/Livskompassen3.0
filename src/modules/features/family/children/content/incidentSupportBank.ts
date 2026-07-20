/**
 * Barnhub incident support bank — Fas A + B overlay.
 * content_class PLAY/REFLECTION; ingen Valv-promote, ingen cross-RAG.
 * bankId ≤ 32 tecken (firestore.rules).
 */
import { sortCardsByRotation } from '../lib/incidentCardRotation';

export type IncidentSupportScript = {
  bankId: string;
  tagHints: string[];
  text_sv: string;
  content_class: 'PLAY' | 'REFLECTION';
};

export type IncidentSupportCard = {
  id: string;
  question: string;
  explain: string;
  nextStep: string;
  crisisTier: 0 | 1 | 2 | 3;
  fasA: boolean;
  /** Optional pattern ids (bh-*) that boost this card */
  themePatternIds?: string[];
};

export const INCIDENT_SCRIPTS: readonly IncidentSupportScript[] = [
  {
    bankId: 'BP-CRISIS-01',
    tagHints: ['separation_anxiety_signal'],
    text_sv: 'Jag är här. Vi tar det lugnt en stund — du behöver inte förklara allt nu.',
    content_class: 'PLAY',
  },
  {
    bankId: 'BP-CRISIS-05',
    tagHints: ['triangulering', 'contact_fear_relay'],
    text_sv:
      'Tack att du berättade. Det du hörde behöver inte vara hela sanningen. Jag vill träffa dig — det står kvar.',
    content_class: 'PLAY',
  },
  {
    bankId: 'BP-CRISIS-06',
    tagHints: ['loyalty_conflict'],
    text_sv:
      'Du behöver inte välja sida. Du får gilla både mig och mamma. Jag håller dig trygg här.',
    content_class: 'PLAY',
  },
  {
    bankId: 'BP-PARENT-01',
    tagHints: ['unclear_source', 'blame_relay'],
    text_sv: 'Skriv citat och tolkning separat. Beteende + datum — ingen etikett på motpart.',
    content_class: 'REFLECTION',
  },
  {
    bankId: 'BP-PARENT-07',
    tagHints: ['parental_alienation_pattern'],
    text_sv:
      'Bekräfta barnets känsla utan att angripa den andra. En mening räcker. Spara observationen.',
    content_class: 'REFLECTION',
  },
];

export const INCIDENT_SUPPORT_CARDS: readonly IncidentSupportCard[] = [
  {
    id: 'bh-r4-akut-01',
    question: 'Andas ut långsamt tre gånger — hur känns kroppen nu?',
    explain: 'Reglera dig själv innan du svarar barnet.',
    nextStep: 'Öppna SOS vid panik; annars skriv en mening.',
    crisisTier: 3,
    fasA: true,
  },
  {
    id: 'bh-r4-akut-02',
    question: 'Behöver barnet dig nära just nu — eller tyst sällskap?',
    explain: 'Närvaro före ord.',
    nextStep: 'Välj: sitt bredvid / håll hand / «jag är här».',
    crisisTier: 2,
    fasA: true,
  },
  {
    id: 'bh-r4-akut-03',
    question: 'Vad sa barnet ordagrant — ett citat?',
    explain: 'Citat vs tolkning skyddar dig och barnet.',
    nextStep: 'Skriv [citat] "…" i fältet.',
    crisisTier: 2,
    fasA: true,
  },
  {
    id: 'bh-r4-akut-04',
    question: 'Vad är din tolkning — separat från citatet?',
    explain: 'Håll isär vad som sades och vad du tror.',
    nextStep: 'Skriv [tolkning] …',
    crisisTier: 2,
    fasA: true,
  },
  {
    id: 'bh-r4-hande-01',
    question: 'Vad hände idag — en mening, utan att förklara dig?',
    explain: 'Kort logg räcker för WORM.',
    nextStep: 'Spara incident.',
    crisisTier: 1,
    fasA: true,
  },
  {
    id: 'bh-r4-hande-04',
    question: 'Hörde du något som lät som budskap från den andra föräldern?',
    explain: 'Budskap via barnet = dokumentera, inte konfrontera barnet.',
    nextStep: 'Logga citat; öppna inte konflikt framför barnet.',
    crisisTier: 1,
    fasA: true,
    themePatternIds: ['bh-tri-001', 'bh-tri-002'],
  },
  {
    id: 'bh-r4-hande-05',
    question: 'Vad behöver barnet höra av dig ikväll — en kort mening?',
    explain: 'Lojalitetsfri fras.',
    nextStep: 'Använd scriptet som visas.',
    crisisTier: 1,
    fasA: true,
    themePatternIds: ['bh-loy-001', 'bh-gate-001'],
  },
  {
    id: 'bh-r4-hande-06',
    question: 'Vad gick bra idag — en liten sak?',
    explain: 'Balansera tungt med en trygg punkt.',
    nextStep: 'Spara som positivt ankare om du vill.',
    crisisTier: 0,
    fasA: true,
  },
  {
    id: 'bh-r4-sig-03',
    question: 'Oro/ångest-nivå du observerar — 1–5?',
    explain: 'Signal, inte diagnos.',
    nextStep: 'Logga fysiologi under Fysiologi-läget.',
    crisisTier: 1,
    fasA: false,
    themePatternIds: ['bh-anx-001'],
  },
  {
    id: 'bh-r4-sig-04',
    question: 'Verkade barnet som budbärare idag?',
    explain: 'Observera beteende + datum.',
    nextStep: 'Validera barnet — bär inte konflikten vidare.',
    crisisTier: 1,
    fasA: false,
    themePatternIds: ['bh-tri-001', 'bh-blame-001'],
  },
  {
    id: 'bh-r4-pappa-01',
    question: 'Vad triggade dig mest i det som hände?',
    explain: 'Ditt inre först — sedan barnet.',
    nextStep: 'Öppna Speglar om det svider.',
    crisisTier: 1,
    fasA: false,
  },
  {
    id: 'bh-r4-pappa-02',
    question: 'Kan du skilja barnets behov från din egen smärta just nu?',
    explain: 'En fråga i taget.',
    nextStep: 'Om nej: Speglar först.',
    crisisTier: 1,
    fasA: false,
  },
  {
    id: 'bh-r4-reg-01',
    question: 'Kan du känna fötterna i golvet just nu?',
    explain: 'Kort grounding.',
    nextStep: '30 sek, sedan prata.',
    crisisTier: 2,
    fasA: false,
  },
  {
    id: 'bh-r4-hopp-01',
    question: 'En sak du gjorde bra som pappa idag?',
    explain: 'Behåll det.',
    nextStep: 'Skriv en rad till dig själv.',
    crisisTier: 0,
    fasA: false,
  },
];

/** @deprecated use INCIDENT_SUPPORT_CARDS */
export const INCIDENT_FASA_CARDS = INCIDENT_SUPPORT_CARDS.filter((c) => c.fasA);

export function scriptForTags(tagNames: string[]): IncidentSupportScript {
  for (const tag of tagNames) {
    const hit = INCIDENT_SCRIPTS.find((s) => s.tagHints.includes(tag));
    if (hit) return hit;
  }
  return INCIDENT_SCRIPTS[0]!;
}

export function cardForId(id: string | undefined): IncidentSupportCard | undefined {
  if (!id) return undefined;
  return INCIDENT_SUPPORT_CARDS.find((c) => c.id === id);
}

export function defaultFasACard(): IncidentSupportCard {
  return INCIDENT_SUPPORT_CARDS.find((c) => c.id === 'bh-r4-hande-01') ?? INCIDENT_SUPPORT_CARDS[0]!;
}

/**
 * Välj frågekort: tag-match → 7-dagars tema → lokal rotation (öppnad/hoppad).
 * preferredCardId är soft boost — tvingar inte samma kort varje gång.
 */
export function pickIncidentCard(input: {
  preferredCardId?: string;
  tagPatternIds: string[];
  themePatternIds?: string[];
  preferCrisis?: boolean;
}): IncidentSupportCard {
  const themeBoost = new Set(input.themePatternIds ?? []);
  const tagBoost = new Set(input.tagPatternIds);

  let pool = [...INCIDENT_SUPPORT_CARDS];
  if (input.preferCrisis) {
    const crisis = pool.filter((c) => c.crisisTier >= 2);
    if (crisis.length) pool = crisis;
  }

  const scored = pool.map((card) => {
    let boost = 0;
    if (input.preferredCardId && card.id === input.preferredCardId) boost += 55;
    for (const pid of card.themePatternIds ?? []) {
      if (tagBoost.has(pid)) boost += 40;
      if (themeBoost.has(pid)) boost += 25;
    }
    return { card, boost };
  });

  scored.sort((a, b) => b.boost - a.boost);
  const topBoost = scored[0]?.boost ?? 0;
  const candidates =
    topBoost > 0 ? scored.filter((s) => s.boost >= topBoost - 15).map((s) => s.card) : pool;

  const rotated = sortCardsByRotation(candidates);
  return rotated[0] ?? defaultFasACard();
}
