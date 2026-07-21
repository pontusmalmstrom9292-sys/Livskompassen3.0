/** @locked MOD-FAM-DROG — låst modul; unlock via docs/evaluations/*-unlock-MOD-FAM-DROG.md */
/** Akuta och planerade resurser — statisk text, inga API-anrop. */
export type DrogfrihetResource = {
  id: string;
  title_sv: string;
  body_sv: string;
  href?: string;
  kind: 'akut' | 'vard' | 'stod';
};

export const DROGFRIHET_RESOURCES: readonly DrogfrihetResource[] = [
  {
    id: 'res-112',
    kind: 'akut',
    title_sv: 'Akut — 112',
    body_sv: 'Vid omedelbar fara för liv, överdos eller akut suicidrisk. Ring 112.',
    href: 'tel:112',
  },
  {
    id: 'res-90101',
    kind: 'akut',
    title_sv: 'Självmordslinjen — 90101',
    body_sv: 'Tankar om att ta ditt liv eller oro för närstående. Mind, dygnet runt. Vid akut livsfara: ring 112.',
    href: 'tel:90101',
  },
  {
    id: 'res-1177',
    kind: 'vard',
    title_sv: '1177 Vårdguiden',
    body_sv: 'Råd om beroende och var du kan vända dig. Sök ”beroende” på 1177.se.',
    href: 'https://www.1177.se',
  },
  {
    id: 'res-droghjalpen',
    kind: 'stod',
    title_sv: 'Droghjälpen — 020-91 91 91',
    body_sv: 'Anonym rådgivning om droger (eStöd, Beroendecentrum Stockholm). Kostnadsfritt.',
    href: 'tel:020919191',
  },
  {
    id: 'res-alkoholhjalpen',
    kind: 'stod',
    title_sv: 'Alkoholhjälpen — 020-84 44 48',
    body_sv: 'Anonym rådgivning om alkohol (eStöd). Kostnadsfritt.',
    href: 'tel:020844448',
  },
  {
    id: 'res-beroende',
    kind: 'stod',
    title_sv: 'Beroendecentrum / region',
    body_sv: 'Din region erbjuder beroendevård och rådgivning. Sök ”beroendecentrum” + din region på 1177.',
    href: 'https://www.1177.se/sa_fungerar_varden/sok-vard-och-hjalp/',
  },
  {
    id: 'res-bris',
    kind: 'stod',
    title_sv: 'Mind — stödlinje',
    body_sv: 'Mind erbjuder stöd via chatt och telefon för psykisk ohälsa. Se mind.se. Självmordslinjen: 90101.',
    href: 'https://mind.se',
  },
  {
    id: 'res-anonym',
    kind: 'stod',
    title_sv: 'Anonyma Nykterister (info)',
    body_sv: 'Självhjälpsgrupper finns i många orter. Neutral information — inget krav att delta.',
    href: 'https://www.anonymaalkoholister.se',
  },
];

export const DROGFRIHET_DISCLAIMER =
  'Hubben ersätter inte medicinsk eller beroendevård. Vid akut livsfara: 112. Suicidtankar: 90101 (eller 112 vid akut fara). Vid behov av behandling: 1177, Droghjälpen eller din vårdcentral.';
