import { barnfokusCatalogEntryForLegacyId } from './content/barnfokusCatalog';

export const CHILD_ALIASES = ['Kasper', 'Arvid'] as const;
export type ChildAlias = (typeof CHILD_ALIASES)[number];

export const SIGNAL_LABELS = {
  somn: 'Sömn',
  angest: 'Ångest',
  aptit: 'Aptit',
} as const;

export const BALANS_WINDOW_DAYS = 7;

/** Livslogg-kategorier — `tredjepart` för skola/BVC/soc (Kladd: Ann/Lena). */
export const LIVSLOGG_CATEGORIES = [
  { value: 'vardag', label: 'Vardag' },
  { value: 'barnfokus', label: 'Barnfokus (frågor)' },
  { value: 'middag', label: 'Middag (äldre)' },
  { value: 'skola', label: 'Skola' },
  { value: 'tredjepart', label: 'Tredjepart (skola/resurs)' },
  { value: 'halsa', label: 'Hälsa' },
  { value: 'overlamning', label: 'Överlämning' },
  { value: 'ankare', label: 'Positivt ankare' },
  { value: 'positivt', label: 'Positiv stund' },
] as const;

export type BarnfokusQuestionKind =
  | 'gladje'
  | 'kunskap'
  | 'knas'
  | 'lara_kanna'
  | 'utveckling'
  | 'valv_safe';

export type BarnfokusQuestion = {
  /** Rotation key — motsvarar `legacy_id` i Barnen-PLAY-BANK. */
  id: string;
  kind: BarnfokusQuestionKind;
  text: string;
  hint?: string;
  source?: 'builtin' | 'valv_curated';
  /** KEEP-rad från Barnen-PLAY-BANK när wiread (BP-PLAY-06+). */
  bankId?: string;
};

export const BARNFOKUS_KIND_LABELS: Record<BarnfokusQuestionKind, string> = {
  gladje: 'Roligt',
  kunskap: 'Kunskap',
  knas: 'Knas',
  lara_kanna: 'Lär känna',
  utveckling: 'Utveckling',
  valv_safe: 'Från din bank',
};

const BARNFOKUS_QUESTIONS_BUILTIN: BarnfokusQuestion[] = [
  { id: 'g1', kind: 'gladje', text: 'Vad fick dig att skratta idag?' },
  { id: 'g2', kind: 'gladje', text: 'Vad var det bästa med din dag?' },
  { id: 'g3', kind: 'gladje', text: 'Vem eller vad var extra rolig idag?' },
  { id: 'k1', kind: 'kunskap', text: 'Vet du var regnbågar kommer ifrån?', hint: 'Gissa — vi googlar inte i kväll.' },
  { id: 'k2', kind: 'kunskap', text: 'Vilket djur tror du sover mest på jorden?' },
  { id: 'k3', kind: 'kunskap', text: 'Hur många ben har en spindel? (Gissa!)' },
  { id: 'n1', kind: 'knas', text: 'Om du fick en superkraft i kväll — vilken?' },
  { id: 'n2', kind: 'knas', text: 'Om dagen var en film — vilken genre?' },
  { id: 'n3', kind: 'knas', text: 'Vilket ljud skulle din mage göra om den kunde prata?' },
  { id: 'n4', kind: 'knas', text: 'Om du fick bygga ett hus av vilken mat som helst, vad skulle du bygga det av?' },
  { id: 'n5', kind: 'knas', text: 'Vilken superkraft skulle vara roligast att ha i tio minuter?' },
  { id: 'n6', kind: 'knas', text: 'Om ni lekte att ni var på en annan planet — vad skulle ni göra först?' },
  { id: 'l1', kind: 'lara_kanna', text: 'Vad gör dig stolt (stort eller litet)?' },
  { id: 'l2', kind: 'lara_kanna', text: 'Vad vill du göra imorgon som låter kul?' },
  { id: 'l3', kind: 'lara_kanna', text: 'Vilket ord eller ljud fastnade i huvudet idag?' },
  { id: 'l4', kind: 'lara_kanna', text: 'Vad sa du idag som fick dig att skratta?' },
  { id: 'l5', kind: 'lara_kanna', text: 'Vilket ord eller uttryck har fastnat hos dig den här veckan?' },
  { id: 'u1', kind: 'utveckling', text: 'Vad vågade du idag som kändes lite svårt?' },
  { id: 'u2', kind: 'utveckling', text: 'Vad vill du bli bättre på — och vad är ett litet steg?' },
  { id: 'u3', kind: 'utveckling', text: 'Vad provade du för första gången nyligen — stort eller litet?' },
  { id: 'u4', kind: 'utveckling', text: 'Vad kändes lite modigare idag än igår?' },
  { id: 'v1', kind: 'valv_safe', text: 'Om du kunde fråga universum en sak — vad?', source: 'valv_curated' },
  { id: 'v2', kind: 'valv_safe', text: 'Vad är det finaste du sett i naturen?', source: 'valv_curated' },
  { id: 'v3', kind: 'valv_safe', text: 'Hur kändes kroppen efter skolan idag — på en skala från låg till hög energi?' },
  { id: 'v4', kind: 'valv_safe', text: 'Vad hjälpte dig att somna eller varva ner igår kväll?' },
];

function wireBarnfokusQuestion(question: BarnfokusQuestion): BarnfokusQuestion {
  const catalog = barnfokusCatalogEntryForLegacyId(question.id);
  if (!catalog) return question;
  return {
    ...question,
    bankId: catalog.bankId,
    kind: catalog.lens,
    text: catalog.text_sv,
    hint: catalog.hint_sv ?? question.hint,
    source: catalog.source ?? question.source,
  };
}

/** Roterande barnfokus-frågor — lekfull ton, inga vuxenkonflikter. */
export const BARNFOKUS_QUESTIONS: BarnfokusQuestion[] =
  BARNFOKUS_QUESTIONS_BUILTIN.map(wireBarnfokusQuestion);

const KIND_ROTATION: BarnfokusQuestionKind[] = [
  'gladje',
  'kunskap',
  'knas',
  'lara_kanna',
  'utveckling',
  'valv_safe',
];

function daySeed(date: Date, childAlias?: string): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  const childBump = childAlias === 'Arvid' ? 1 : childAlias === 'Kasper' ? 2 : 0;
  return dayOfYear + childBump;
}

export function barnfokusQuestionForToday(
  childAlias?: string,
  date = new Date(),
  excludeId?: string,
): BarnfokusQuestion {
  const seed = daySeed(date, childAlias);
  const kind = KIND_ROTATION[seed % KIND_ROTATION.length]!;
  const inKind = BARNFOKUS_QUESTIONS.filter((q) => q.kind === kind && q.id !== excludeId);
  const pool = inKind.length > 0 ? inKind : BARNFOKUS_QUESTIONS.filter((q) => q.id !== excludeId);
  const list = pool.length > 0 ? pool : BARNFOKUS_QUESTIONS;
  return list[seed % list.length]!;
}

/** @deprecated — använd barnfokusQuestionForToday */
export function middagsQuestionForToday(date = new Date()): string {
  return barnfokusQuestionForToday(undefined, date).text;
}

export type LivsloggCategory = (typeof LIVSLOGG_CATEGORIES)[number]['value'];

/** D12 — profilkort (UI; inte juridisk bedömning). */
export const CHILD_PROFILES = [
  {
    alias: 'Kasper' as const,
    focus: 'Trygghet & struktur',
    traits: ['Nyfiken', 'Behöver tydlighet', 'Älskar lek och rörelse'],
  },
  {
    alias: 'Arvid' as const,
    focus: 'Kreativitet & närhet',
    traits: ['Känslig', 'Humor som bro', 'Behöver lugn vid övergångar'],
  },
] as const;
