/**
 * Roterande kompass-citat — deterministisk per dag + fas (NAMN-AUDIT v2 2026-06-14).
 * Samma citat hela dagen per fas — stabilt för ADHD.
 */

export type CompassQuotePhase = 'morgon' | 'dag' | 'kvall' | 'alltid';

export type CompassBannerQuote = {
  id: string;
  text: string;
  phase: CompassQuotePhase;
};

export const COMPASS_BANNER_QUOTES: CompassBannerQuote[] = [
  // morgon
  { id: 'm01', phase: 'morgon', text: 'Ett steg räcker. Resten får vänta.' },
  { id: 'm02', phase: 'morgon', text: 'Sätt ett ankare — inte hela dagen.' },
  { id: 'm03', phase: 'morgon', text: 'Lågaffektiv start. Ingen prestation krävs.' },
  { id: 'm04', phase: 'morgon', text: 'Kroppen först. Logistik sedan.' },
  { id: 'm05', phase: 'morgon', text: 'Du behöver inte försvara dig mot någon idag.' },
  { id: 'm06', phase: 'morgon', text: 'Trött är okej. Ett mikrosteg räcker.' },
  // dag
  { id: 'd01', phase: 'dag', text: 'Börja med kroppen — sedan logistik, ett steg i taget.' },
  { id: 'd02', phase: 'dag', text: 'Ett mikrosteg i taget — inte hela listan.' },
  { id: 'd03', phase: 'dag', text: 'Logistik svarar du på. Känslomässiga beten ignoreras.' },
  { id: 'd04', phase: 'dag', text: 'Du gör nog — även när det känns långsamt.' },
  { id: 'd05', phase: 'dag', text: 'Pauser räknas. Du behöver inte prestera hela dagen.' },
  { id: 'd06', phase: 'dag', text: 'Grey Rock före JADE. Kort svar räcker.' },
  // kväll
  { id: 'k01', phase: 'kvall', text: 'Inget måste vara klart för att dagen ska räknas.' },
  { id: 'k02', phase: 'kvall', text: 'Kväll — landa mjukt. Gränser får vänta till i morgon.' },
  { id: 'k03', phase: 'kvall', text: 'Töm hjärnan lugnt. Bevis får vänta.' },
  { id: 'k04', phase: 'kvall', text: 'Du är en kapabel förälder — även på trötta dagar.' },
  { id: 'k05', phase: 'kvall', text: 'Stäng dagen utan skuld. Resten är imorgon.' },
  { id: 'k06', phase: 'kvall', text: 'Landa dagen lugnt. Inget måste vara löst i kväll.' },
  // alltid (poolas in i alla faser)
  { id: 'a01', phase: 'alltid', text: 'Ett steg räcker. Resten får vänta.' },
  { id: 'a02', phase: 'alltid', text: 'Du behöver inte försvara dig mot någon idag.' },
  { id: 'a03', phase: 'alltid', text: 'Kroppen först. Logistik sedan.' },
  { id: 'a04', phase: 'alltid', text: 'Inget måste vara klart för att dagen ska räknas.' },
  { id: 'a05', phase: 'alltid', text: 'Du är en kapabel förälder — även på trötta dagar.' },
  { id: 'a06', phase: 'alltid', text: 'Du gör nog — även när det känns långsamt.' },
];

const FORGE_MICRO_TIPS: Record<Exclude<CompassQuotePhase, 'alltid'>, string[]> = {
  morgon: [
    'Tips: en rad i dagbok räcker — spara inte till Valv automatiskt.',
    'Tips: andning två minuter räcker som ankare.',
    'Tips: vila är ett giltigt val — ingen auto-start.',
  ],
  dag: [
    'Tips: logistik svarar du på; känslomässiga beten ignoreras.',
    'Tips: ett mikrosteg i Planering — inga poäng.',
    'Tips: paus räknas. Du behöver inte hinna allt.',
  ],
  kvall: [
    'Tips: Grey Rock före JADE. Hamn om ex-sms landar.',
    'Tips: tre korta steg för att stänga dagen — inget måste.',
    'Tips: bevis och dossier får vänta till imorgon.',
  ],
};

function dateSeed(date: Date, salt: string): number {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  let h = (y * 372 + m * 31 + d) >>> 0;
  for (let i = 0; i < salt.length; i += 1) {
    h = (Math.imul(31, h) + salt.charCodeAt(i)) >>> 0;
  }
  return h;
}

function poolForPhase(phase: Exclude<CompassQuotePhase, 'alltid'>): CompassBannerQuote[] {
  return COMPASS_BANNER_QUOTES.filter((q) => q.phase === phase || q.phase === 'alltid');
}

/** Deterministiskt citat — samma hela dagen per fas. */
export function pickQuote(
  phase: Exclude<CompassQuotePhase, 'alltid'>,
  date: Date = new Date(),
): string {
  const pool = poolForPhase(phase);
  const idx = dateSeed(date, phase) % pool.length;
  return pool[idx]!.text;
}

/** Kort praktiskt tips för Forge-lab — roterar per dag + fas. */
export function pickForgeMicroTip(
  phase: Exclude<CompassQuotePhase, 'alltid'>,
  date: Date = new Date(),
): string {
  const pool = FORGE_MICRO_TIPS[phase];
  const idx = dateSeed(date, `${phase}-tip`) % pool.length;
  return pool[idx]!;
}

/** Mappa CompassFlow → quote-fas. */
export function compassFlowToQuotePhase(
  flow: 'morning' | 'day' | 'evening',
): Exclude<CompassQuotePhase, 'alltid'> {
  if (flow === 'morning') return 'morgon';
  if (flow === 'day') return 'dag';
  return 'kvall';
}
