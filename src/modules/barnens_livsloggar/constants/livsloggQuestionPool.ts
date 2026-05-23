import type { LivsloggCategory } from '../constants';

export type QuestionPoolEntry = {
  label: string;
  text: string;
};

/** Chips on frågekort (subset of LivsloggCategory). */
export type FragekortChipCategory = Extract<LivsloggCategory, 'vitals' | 'citat' | 'milstolpe' | 'lek'>;

/** F-B11.1 — neutral vardagsfrågor, ingen vuxenkonflikt. */
export const LIVSLOGG_QUESTION_POOL = {
  lek: [
    {
      label: 'Dagens middagsfråga',
      text: 'Om du fick bygga ett hus av vilken mat som helst, vad skulle du bygga det av?',
    },
    {
      label: 'Dagens lekfråga',
      text: 'Vilken superkraft skulle vara roligast att ha i tio minuter?',
    },
    {
      label: 'Dagens lekfråga',
      text: 'Om ni lekte att ni var på en annan planet — vad skulle ni göra först?',
    },
  ],
  citat: [
    {
      label: 'Dagens citat',
      text: 'Vad sa du idag som fick dig att skratta?',
    },
    {
      label: 'Dagens citat',
      text: 'Vilket ord eller uttryck har fastnat hos dig den här veckan?',
    },
  ],
  milstolpe: [
    {
      label: 'Dagens milstolpe',
      text: 'Vad provade du för första gången nyligen — stort eller litet?',
    },
    {
      label: 'Dagens milstolpe',
      text: 'Vad kändes lite modigare idag än igår?',
    },
  ],
  vitals: [
    {
      label: 'Dagens check-in',
      text: 'Hur kändes kroppen efter skolan idag — på en skala från låg till hög energi?',
    },
    {
      label: 'Dagens check-in',
      text: 'Vad hjälpte dig att somna eller varva ner igår kväll?',
    },
  ],
  vardag: [
    {
      label: 'Dagens fråga',
      text: 'Vad var det bästa lilla ögonblicket idag?',
    },
  ],
} satisfies Partial<Record<LivsloggCategory, QuestionPoolEntry[]>>;

/** Chips synliga på frågekortet (mock bild 19). */
export const FRAGEKORT_CHIPS: readonly FragekortChipCategory[] = [
  'vitals',
  'citat',
  'milstolpe',
  'lek',
];

export const FRAGEKORT_CHIP_LABELS: Record<FragekortChipCategory, string> = {
  vitals: 'Vitals',
  citat: 'Citat',
  milstolpe: 'Milstolpe',
  lek: 'Lek',
};
