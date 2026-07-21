/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
/**
 * Akut craving-protokoll — kuraterad bank (Zero Footprint: ingen auto-logg).
 * Ton: skamfri, lågaffektiv. Ingen glorifiering / anskaffning.
 */

export const HALT_ITEMS = [
  { id: 'H', label: 'Hungrig', tip: 'Ät eller drick något säkert först.' },
  { id: 'A', label: 'Arg', tip: 'Andas. Rörelse. Skriv tre rader.' },
  { id: 'L', label: 'Ensam', tip: 'Ett kort meddelande till någon trygg.' },
  { id: 'T', label: 'Trött', tip: 'Vila. Minska beslut. Ljus.' },
] as const;

export const DISTRACT_PROMPTS_1MIN = [
  'Drick vatten. Sätt dig. Säg: det här är sug.',
  'Namnge: sug. Det går över.',
  'Fyra lugna andetag. Inget mer just nu.',
  'Kallt vatten på handlederna.',
  'Byt rum. Bara det.',
] as const;

export const DISTRACT_PROMPTS_3MIN = [
  'Gå ut två minuter — ingen destination.',
  'Duscha ansiktet med kallt vatten.',
  'Skriv en rad: vad triggade?',
  'HALT-check: hungrig, arg, ensam, trött?',
  'Sätt på ett ljud som inte påminner om bruk.',
  'Diske eller städa en yta i tre minuter.',
] as const;

export const URGE_SURF_COPY = {
  title: 'Urge surfing',
  lead: 'Sug är en våg. Den stiger, toppar och sjunker. Du behöver inte följa den.',
  bodyPrompt: 'Var i kroppen känns det mest just nu?',
  valuePrompt: 'Ett värdeord för dig — t.ex. pappa, klarhet, hälsa.',
  doneHint: 'Bra. Du red ut en bit av vågen.',
  defaultSeconds: 120,
} as const;

export const ANTI_BUY_COPY = {
  title: 'Vänta 15 minuter',
  lead: 'Beslutet att köpa kan vänta. Plånboken kan stanna.',
  line: 'Om suget fortfarande finns om en kvart — öppna ankaret igen. Just nu: vänta.',
} as const;

export const PROTOCOL_META = {
  1: { label: '1 min', lead: 'Stopp & landa' },
  3: { label: '3 min', lead: 'Delay + byt kanal' },
  10: { label: '10 min', lead: 'Urge surf + plan' },
} as const;

export const AFTER_COPY = {
  title: 'Bra. Du klarade ett steg.',
  lead: 'Det räcker för nu.',
  stay: 'Stanna 2 min till',
  call112: 'Ring 112',
  call90101: 'Ring 90101',
  done: 'Klar för nu',
} as const;

export const ANCHOR_EXTRA = {
  haltLine: 'Hungrig · arg · ensam · trött?',
  protocolHint: 'Coping nu',
  urgeLabel: 'Urge surfing',
  antiBuyLabel: 'Anti-köp (15 min)',
  haltLabel: 'HALT-check',
} as const;
