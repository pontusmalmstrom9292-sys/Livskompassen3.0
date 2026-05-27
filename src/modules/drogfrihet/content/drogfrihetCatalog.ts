/**
 * Drogfrihet — KEEP-rader från Mabra-CONTENT-BANK (DF-REF-*).
 * Prod: parafras via bankId; ingen Kunskap-RAG, inga streaks.
 */
export type DrogfrihetCard = {
  bankId: string;
  content_class: 'REFLECTION';
  source_tier: 'product_copy' | 'psychoeducation_general';
  status: 'KEEP';
  lens: string;
  text_sv: string;
};

export const DROGFRIHET_CARDS: readonly DrogfrihetCard[] = [
  {
    bankId: 'DF-REF-01',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    lens: 'mikrosteg',
    text_sv: 'Vad är det minsta steget du kan ta idag för att hålla nykterhet — utan att lösa hela livet?',
  },
  {
    bankId: 'DF-REF-02',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    lens: 'trigger',
    text_sv: 'Vad hände precis innan impulsen — plats, tid, känsla? Beskriv utan att döma dig.',
  },
  {
    bankId: 'DF-REF-03',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    lens: 'halt',
    text_sv: 'Är du hungrig, arg, ensam eller trött? Vilket behov kan du möta med något annat än substans?',
  },
  {
    bankId: 'DF-REF-04',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    lens: 'aterfall',
    text_sv: 'Om du haft ett återfall: vad kan kroppen lära sig — utan skametikett på dig som person?',
  },
  {
    bankId: 'DF-REF-05',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    lens: 'stodnat',
    text_sv: 'Vem kan du nå idag med ett kort meddelande — utan att behöva förklara allt?',
  },
  {
    bankId: 'DF-REF-06',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    lens: 'substitut',
    text_sv: 'Vad kan du göra i två minuter istället — gå, vatten, ett ljud, en rad i anteckningar?',
  },
  {
    bankId: 'DF-REF-07',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    lens: 'varde',
    text_sv: 'Nykterhet som val — inte straff. Vilket värde bär du idag, ett ord?',
  },
  {
    bankId: 'DF-REF-08',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    lens: 'idag',
    text_sv: 'Ett beslut bara för idag. Vad väljer du att inte göra de närmaste timmarna?',
  },
  {
    bankId: 'DF-REF-09',
    content_class: 'REFLECTION',
    source_tier: 'psychoeducation_general',
    status: 'KEEP',
    lens: 'rsd',
    text_sv: 'Skam är en känsla, inte din identitet. Vad skulle du säga till en vän i samma läge?',
  },
  {
    bankId: 'DF-REF-10',
    content_class: 'REFLECTION',
    source_tier: 'product_copy',
    status: 'KEEP',
    lens: 'kropp',
    text_sv: 'Kropp först: har du druckit vatten, ätit något litet, eller pausat fem minuter?',
  },
];
