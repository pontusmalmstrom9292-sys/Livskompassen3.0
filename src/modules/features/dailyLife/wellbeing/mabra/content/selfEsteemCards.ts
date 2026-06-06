/**
 * Självkänsla-frågekort — KEEP C-se-01..10 från Mabra-CONTENT-BANK.
 * Prod: deterministisk rotation via pickVitProjectCard; ingen Kunskap-RAG.
 */
export type SelfEsteemCard = {
  bankId: string;
  format: 'reflection_card';
  lens: 'identitet' | 'kbt_light';
  content_class: 'REFLECTION';
  text_sv: string;
};

export const SELF_ESTEEM_CARDS: readonly SelfEsteemCard[] = [
  {
    bankId: 'C-se-01',
    format: 'reflection_card',
    lens: 'identitet',
    content_class: 'REFLECTION',
    text_sv: 'Vad respekterar jag hos mig själv när ingen applåderar — ett ord räcker.',
  },
  {
    bankId: 'C-se-02',
    format: 'reflection_card',
    lens: 'identitet',
    content_class: 'REFLECTION',
    text_sv: 'När behandlade jag mig senast som någon värd omsorg — inte som belöning?',
  },
  {
    bankId: 'C-se-03',
    format: 'reflection_card',
    lens: 'identitet',
    content_class: 'REFLECTION',
    text_sv: 'En gräns jag höll nyligen, liten som helst — vad var den?',
  },
  {
    bankId: 'C-se-04',
    format: 'reflection_card',
    lens: 'identitet',
    content_class: 'REFLECTION',
    text_sv: 'Vad betyder "tillräcklig" för mig idag — ungefär, utan att jämföra med andra?',
  },
  {
    bankId: 'C-se-05',
    format: 'reflection_card',
    lens: 'identitet',
    content_class: 'REFLECTION',
    text_sv: 'En egenskap som är min även när andra inte ser den — vad är det?',
  },
  {
    bankId: 'C-se-06',
    format: 'reflection_card',
    lens: 'kbt_light',
    content_class: 'REFLECTION',
    text_sv: 'Vilken "borde"-mening är högst just nu — skriv den; du behöver inte lyda den.',
  },
  {
    bankId: 'C-se-07',
    format: 'reflection_card',
    lens: 'kbt_light',
    content_class: 'REFLECTION',
    text_sv: 'Ett kort skäl för och ett mot den kritiska rösten — valfritt, en rad vardera.',
  },
  {
    bankId: 'C-se-08',
    format: 'reflection_card',
    lens: 'kbt_light',
    content_class: 'REFLECTION',
    text_sv: 'Om samma tanke gällde en trygg vän — skulle jag säga lika hårt? Vad skulle vara mildare?',
  },
  {
    bankId: 'C-se-09',
    format: 'reflection_card',
    lens: 'kbt_light',
    content_class: 'REFLECTION',
    text_sv: 'Vilken förvrängning kanske det liknar — allt-eller-inget, katastrof, läsa tankar? Hoppa över går bra.',
  },
  {
    bankId: 'C-se-10',
    format: 'reflection_card',
    lens: 'kbt_light',
    content_class: 'REFLECTION',
    text_sv: 'En självmedkännande omformulering du inte behöver tro fullt ut — en mening.',
  },
] as const;

export const SELF_ESTEEM_BANK_IDS = SELF_ESTEEM_CARDS.map((c) => c.bankId);
