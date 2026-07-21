/**
 * FACT från Kunskap-CONTENT-SEED (kunskap-fact-df-*) — statisk lista, ingen live RAG.
 */
export type DrogfrihetFact = {
  id: string;
  title_sv: string;
  content_sv: string;
  citation_hint: string;
  source_tier: 'P1' | 'P2';
};

export const DROGFRIHET_FACTS: readonly DrogfrihetFact[] = [
  {
    id: 'kunskap-fact-df-001',
    title_sv: 'Beroende som sjukdom — översikt',
    content_sv:
      'Beroende kan involvera förlust av kontroll över intag trots skada, och påverkar hjärnans belöningssystem. Det klassas som en sjukdom i internationell klassificering. Behandling kan inkludera samtal, medicin och strukturerat stöd — individuellt.',
    citation_hint: '1177.se beroende; ICD-11 substance use disorders (översikt)',
    source_tier: 'P2',
  },
  {
    id: 'kunskap-fact-df-002',
    title_sv: 'SAMT — kort',
    content_sv:
      'Samtalsterapi med motivationsstöd (motiverande samtal) hjälper många att utforska ambivalens kring förändring utan press. Det är ett etablerat stöd inom beroendevård, inte en snabb fix.',
    citation_hint: 'Socialstyrelsen beroende och missbruk; MI (Miller & Rollnick, översikt)',
    source_tier: 'P2',
  },
  {
    id: 'kunskap-fact-df-003',
    title_sv: 'Självhjälpsgrupper — neutralt',
    content_sv:
      'Självhjälpsgrupper bygger på delat erfarenhetsutbyte och anonymitet. De är frivilliga och kompletterar ofta professionell vård — de ersätter inte medicinsk bedömning.',
    citation_hint: 'Anonyma Nykterister / liknande organisationer (översikt)',
    source_tier: 'P2',
  },
  {
    id: 'kunskap-fact-df-004',
    title_sv: 'Akut hjälp',
    content_sv:
      'Vid akut fara för liv: ring 112. Suicidtankar (icke-akut samtal): 90101 (Självmordslinjen / Mind). För råd om vård: 1177. Anonym drogrådgivning: Droghjälpen 020-91 91 91.',
    citation_hint: 'SOS Alarm 112; Mind 90101; 1177; Droghjälpen',
    source_tier: 'P1',
  },
  {
    id: 'kunskap-fact-df-005',
    title_sv: 'Regional beroendevård',
    content_sv:
      'Sveriges regioner erbjuder öppenvård och ibland sluten vård för beroende. Remiss sker ofta via vårdcentral eller beroendemottagning. Väntetider varierar.',
    citation_hint: '1177; regionala vårdprogram',
    source_tier: 'P2',
  },
  {
    id: 'kunskap-fact-df-006',
    title_sv: 'ADHD och beroende',
    content_sv:
      'ADHD och substansbruk kan förekomma samtidigt. Struktur, medicin vid ADHD enligt läkare, och beroendebehandling kan behövas parallellt — bedömning ska göras professionellt.',
    citation_hint: 'NICE; forskning ADHD comorbidity substance (översikt)',
    source_tier: 'P2',
  },
  {
    id: 'kunskap-fact-df-007',
    title_sv: 'Lapse och relapse',
    content_sv:
      'En lapse är ett enstaka återfallstillfälle. En relapse är återgång till tidigare bruksmönster. Skillnaden hjälper dig att undvika “allt-eller-inget”-tänk — ett slip betyder inte att hela kedjan är trasig.',
    citation_hint: 'Marlatt Relapse Prevention (översikt); klinisk praxis',
    source_tier: 'P2',
  },
  {
    id: 'kunskap-fact-df-008',
    title_sv: 'Skam efter slip (AVE)',
    content_sv:
      'Abstinence Violation Effect: efter ett slip kan skam få dig att tänka “allt är förstört” och bruka mer. Bryt skammen — stanna upp, aktivera coping, sök stöd. Du är inte din lapse.',
    citation_hint: 'Marlatt AVE; återfallsprevention (översikt)',
    source_tier: 'P2',
  },
];
