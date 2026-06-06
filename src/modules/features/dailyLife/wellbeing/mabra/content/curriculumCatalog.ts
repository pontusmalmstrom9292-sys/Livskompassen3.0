/**
 * Vit curriculum — Kunskap FACT-kapitel + MåBra bankIds (blandat format).
 * Källa: docs/content/CONTENT-WAVES.md · Kunskap-CONTENT-SEED.md
 */

export type CurriculumExerciseKind = 'reflection' | 'play';

export type CurriculumExercise = {
  bankId: string;
  kind: CurriculumExerciseKind;
};

export type CurriculumChapter = {
  title: string;
  kunskapFactId: string;
  factTitleSv: string;
  factSummarySv: string;
  citationHint: string;
  exercises: readonly CurriculumExercise[];
};

export type CurriculumBroLink = {
  label: string;
  route: string;
};

export type VitCurriculum = {
  id: string;
  title: string;
  wave: number;
  theme: string;
  chapters: readonly CurriculumChapter[];
  broLinks?: readonly CurriculumBroLink[];
};

export const CURRICULUMS: readonly VitCurriculum[] = [
  {
    id: 'CUR-ADHD-01',
    title: 'ADHD i vardagen — kurs 1',
    wave: 1,
    theme: 'adhd_vardag',
    chapters: [
      {
        title: 'Tidsankare',
        kunskapFactId: 'kunskap-fact-016',
        factTitleSv: 'Tidsblindhet och extern tidsankare',
        factSummarySv:
          'Synliga klockor, timers och schemablock avlastar arbetsminnet vid tidsblindhet — de ersätter inte behandling.',
        citationHint: 'NICE NG87 ADHD adults',
        exercises: [
          { bankId: 'MB-REF-ADHD-01', kind: 'reflection' },
          { bankId: 'MB-PLAY-05', kind: 'play' },
        ],
      },
      {
        title: 'RSD och reaktion',
        kunskapFactId: 'kunskap-fact-021',
        factTitleSv: 'RSD — rejection sensitive dysphoria (översikt)',
        factSummarySv:
          'Intensiv smärta vid upplevd avvisning är vanlig vid ADHD — psychoeducation, inte separat diagnos.',
        citationHint: 'ADHD RSD psychoeducation',
        exercises: [
          { bankId: 'MB-REF-ADHD-02', kind: 'reflection' },
          { bankId: 'MB-REF-ADHD-03', kind: 'reflection' },
        ],
      },
      {
        title: 'Arbetsminne',
        kunskapFactId: 'kunskap-fact-028',
        factTitleSv: 'Arbetsminne — varför listor hjälper',
        factSummarySv: 'Att skriva ned avlastar — strategi, inte lathet.',
        citationHint: 'Barkley working memory overview',
        exercises: [
          { bankId: 'MB-PLAY-06', kind: 'play' },
          { bankId: 'MB-REF-ADHD-04', kind: 'reflection' },
        ],
      },
    ],
    broLinks: [
      { label: 'Kunskapsbank', route: '/valvet?vaultTab=kunskapsbank' },
    ],
  },
  {
    id: 'CUR-GAD-01',
    title: 'GAD och ångest — kurs 1',
    wave: 2,
    theme: 'gad_angest',
    chapters: [
      {
        title: 'Oro vs fakta',
        kunskapFactId: 'kunskap-fact-029',
        factTitleSv: 'Generaliserat ångestsyndrom — översikt',
        factSummarySv: 'Ihållande oro — psychoeducation, inte app-diagnos.',
        citationHint: 'ICD-11 GAD overview',
        exercises: [
          { bankId: 'MB-REF-GAD-01', kind: 'reflection' },
          { bankId: 'MB-REF-GAD-03', kind: 'reflection' },
        ],
      },
      {
        title: 'Kroppen',
        kunskapFactId: 'kunskap-fact-031',
        factTitleSv: 'Ångest i kroppen — interoception',
        factSummarySv: 'Namnge kroppsignal utan att tolka som omedelbar fara.',
        citationHint: 'Interoception anxiety psychoeducation',
        exercises: [
          { bankId: 'MB-REF-GAD-02', kind: 'reflection' },
          { bankId: 'MB-PLAY-GAD-01', kind: 'play' },
        ],
      },
      {
        title: 'Hypervigilans',
        kunskapFactId: 'kunskap-fact-030',
        factTitleSv: 'Hypervigilans — kropp i beredskap',
        factSummarySv: 'Nervsystemet skannar hot efter lång stress — fysiologi, inte karaktär.',
        citationHint: 'Trauma-informed psychoeducation',
        exercises: [
          { bankId: 'MB-REF-GAD-04', kind: 'reflection' },
          { bankId: 'MB-REF-GAD-05', kind: 'reflection' },
        ],
      },
    ],
    broLinks: [
      { label: 'Kunskapsbank', route: '/valvet?vaultTab=kunskapsbank' },
      { label: 'Speglar (ej ex-coaching här)', route: '/hjartat?tab=speglar' },
    ],
  },
  {
    id: 'CUR-FEEL-01',
    title: 'Känslor och kropp — kurs 1',
    wave: 3,
    theme: 'kanslor_vagus',
    chapters: [
      {
        title: 'Interoception',
        kunskapFactId: 'kunskap-fact-036',
        factTitleSv: 'Interoception — känna kroppen',
        factSummarySv: 'Uppmärksamhet på inre signaler utan omedelbar fix.',
        citationHint: 'Interoception psychoeducation',
        exercises: [
          { bankId: 'C-feel-04', kind: 'reflection' },
          { bankId: 'C-feel-05', kind: 'reflection' },
        ],
      },
      {
        title: 'Vagus',
        kunskapFactId: 'kunskap-fact-037',
        factTitleSv: 'Vagusnerven — förenklad översikt',
        factSummarySv: 'Långsam utandning som självreglering — inte medicin.',
        citationHint: 'Vagus psychoeducation',
        exercises: [{ bankId: 'MB-PLAY-08', kind: 'play' }],
      },
    ],
  },
  {
    id: 'CUR-ACT-01',
    title: 'ACT — värderingar i praktiken',
    wave: 3,
    theme: 'personlig_utveckling',
    chapters: [
      {
        title: 'Acceptans',
        kunskapFactId: 'kunskap-fact-038',
        factTitleSv: 'ACT — acceptans i ett nötskal',
        factSummarySv: 'Acceptera obehag och handla enligt värderingar.',
        citationHint: 'ACT Hayes overview',
        exercises: [
          { bankId: 'MB-REF-ACT-01', kind: 'reflection' },
          { bankId: 'MB-REF-ACT-03', kind: 'reflection' },
        ],
      },
      {
        title: 'Handling',
        kunskapFactId: 'kunskap-fact-040',
        factTitleSv: 'Självmedkänsla vs självförstärkning',
        factSummarySv: 'Vänlighet mot dig utan att ursäkta skada mot andra.',
        citationHint: 'Neff self-compassion',
        exercises: [{ bankId: 'MB-REF-ACT-02', kind: 'reflection' }],
      },
    ],
  },
  {
    id: 'CUR-PARENT-01',
    title: 'Föräldraskap — trygg bas',
    wave: 4,
    theme: 'barn_neuro',
    chapters: [
      {
        title: 'Trygg bas',
        kunskapFactId: 'kunskap-fact-041',
        factTitleSv: 'Trygg bas — förälder som ankare',
        factSummarySv: 'Förutsägbarhet viktigare än perfektion.',
        citationHint: 'Attachment psychoeducation',
        exercises: [{ bankId: 'C-joy-01', kind: 'reflection' }],
      },
      {
        title: 'Barn och konflikt',
        kunskapFactId: 'kunskap-fact-042',
        factTitleSv: 'Barn i konflikt mellan vuxna',
        factSummarySv: 'Håll vuxenkonflikt borta från barnets öron.',
        citationHint: 'Coparenting psychoeducation',
        exercises: [],
      },
    ],
    broLinks: [{ label: 'Familjen', route: '/familjen' }],
  },
  {
    id: 'CUR-TAKTIK-01',
    title: 'Taktiker — referens (ej coaching)',
    wave: 5,
    theme: 'taktik_referens',
    chapters: [
      {
        title: 'DARVO',
        kunskapFactId: 'kunskap-fact-043',
        factTitleSv: 'DARVO — neutral beskrivning',
        factSummarySv: 'Beteendemönster — inte diagnos.',
        citationHint: 'Freyd DARVO overview',
        exercises: [],
      },
      {
        title: 'Dokumentation',
        kunskapFactId: 'kunskap-fact-046',
        factTitleSv: 'Moving goalposts — kort',
        factSummarySv: 'Datum och neutral logg motverkar minnesglapp.',
        citationHint: 'High-conflict literature',
        exercises: [],
      },
    ],
    broLinks: [
      { label: 'Speglar', route: '/hjartat?tab=speglar' },
      { label: 'Valv — dokumentera', route: '/valvet' },
    ],
  },
  {
    id: 'CUR-COPARENT-01',
    title: 'Medföräldraskap — referens',
    wave: 6,
    theme: 'medforaldraskap',
    chapters: [
      {
        title: 'Parallellt föräldraskap',
        kunskapFactId: 'kunskap-fact-003',
        factTitleSv: 'Parallellt föräldraskap — neutral definition',
        factSummarySv: 'Separata hushåll, samordning kring barnets behov.',
        citationHint: 'Föräldrabalken 6 kap. översikt',
        exercises: [],
      },
      {
        title: 'BIFF-definition',
        kunskapFactId: 'kunskap-fact-005',
        factTitleSv: 'BIFF — vad förkortningen betyder',
        factSummarySv: 'Formuleringsteknik — konkret sms → Hamn.',
        citationHint: 'BIFF psychoeducation',
        exercises: [],
      },
    ],
    broLinks: [{ label: 'Hamn — BIFF', route: '/familjen?tab=hamn' }],
  },
  {
    id: 'CUR-SOBRIETY-01',
    title: 'Nykterhet — stöd idag',
    wave: 7,
    theme: 'beroende',
    chapters: [
      {
        title: 'Beroende som sjukdom',
        kunskapFactId: 'kunskap-fact-df-001',
        factTitleSv: 'Beroende som sjukdom — översikt',
        factSummarySv: 'Sjukdom i internationell klassificering — individuell behandling.',
        citationHint: '1177.se beroende',
        exercises: [{ bankId: 'DF-REF-01', kind: 'reflection' }],
      },
      {
        title: 'Craving',
        kunskapFactId: 'kunskap-fact-df-006',
        factTitleSv: 'ADHD och beroende',
        factSummarySv: 'Struktur och behandling kan behövas parallellt.',
        citationHint: 'NICE comorbidity',
        exercises: [
          { bankId: 'DF-REF-11', kind: 'reflection' },
          { bankId: 'DF-REF-12', kind: 'reflection' },
        ],
      },
    ],
    broLinks: [{ label: 'Drogfrihet-hub', route: '/drogfrihet' }],
  },
] as const;

export function getCurriculum(id: string): VitCurriculum | undefined {
  return CURRICULUMS.find((c) => c.id === id);
}
