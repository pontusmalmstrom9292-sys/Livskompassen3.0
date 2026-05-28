/**
 * Daglig mix — KEEP-rader från Mabra-CONTENT-BANK (DM-*).
 * Prod: parafras via bankId; ingen Kunskap-RAG, inga streaks.
 */
export type DagligMixContentClass = 'REFLECTION' | 'PLAY';

export type DagligMixCard = {
  bankId: string;
  content_class: 'REFLECTION';
  source_tier: 'P1';
  status: 'KEEP';
  text_sv: string;
  lens: string;
};

export type DagligMixPlay = {
  bankId: string;
  content_class: 'PLAY';
  source_tier: 'P1';
  status: 'KEEP';
  title_sv: string;
  rule_sv: string;
};

/** Rotationspool — ordning irrelevant; pickDagligMix väljer per dag. */
export const DAGLIG_MIX_CARDS: readonly DagligMixCard[] = [
  {
    bankId: 'DM-CARD-01',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    lens: 'gladje',
    text_sv: 'Vad gav dig en liten glädje idag — även om dagen var tung?',
  },
  {
    bankId: 'DM-CARD-02',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    lens: 'rsd',
    text_sv: 'Vilken tanke känns som “avvisning” just nu — och vad är ett sakligt alternativ?',
  },
  {
    bankId: 'DM-CARD-03',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    lens: 'sjalvmedkansla',
    text_sv: 'Vad skulle du säga till en vän i samma läge som du är i nu?',
  },
  {
    bankId: 'DM-CARD-04',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    lens: 'sjalvmedkansla',
    text_sv: 'En sak du gjorde bra idag — utan att jämföra med någon annan.',
  },
  {
    bankId: 'DM-CARD-05',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    lens: 'kanslor',
    text_sv: 'Vilken känsla sitter starkast i kroppen just nu? Namnge den utan att fixa den.',
  },
  {
    bankId: 'DM-CARD-06',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    lens: 'identitet',
    text_sv: 'Vilket värde vill du leva efter idag — ett ord räcker.',
  },
  {
    bankId: 'DM-CARD-07',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    lens: 'kbt',
    text_sv: 'Vilken automatisk tanke dök upp — och vad är beviset för och emot?',
  },
  {
    bankId: 'DM-CARD-08',
    content_class: 'REFLECTION',
    source_tier: 'P1',
    status: 'KEEP',
    lens: 'mal',
    text_sv: 'Ett litet steg du kan ta inom 24 timmar — max en mening.',
  },
] as const;

export const DAGLIG_MIX_PLAYS: readonly DagligMixPlay[] = [
  {
    bankId: 'DM-PLAY-01',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Fem sinnen',
    rule_sv: 'Nämn en sak du ser, hör, känner, luktar och smakar — i valfri ordning.',
  },
  {
    bankId: 'DM-PLAY-02',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Kroppsscan 60s',
    rule_sv: 'Stanna vid fötter → knän → mage → axlar → panna. En andetag per ställe.',
  },
  {
    bankId: 'DM-PLAY-03',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Grå sten',
    rule_sv: 'Skriv en mening som bara handlar om logistik — inga känslor, inget försvar.',
  },
] as const;

export const DAGLIG_MIX_BANK_IDS = [
  ...DAGLIG_MIX_CARDS.map((c) => c.bankId),
  ...DAGLIG_MIX_PLAYS.map((p) => p.bankId),
] as const;
