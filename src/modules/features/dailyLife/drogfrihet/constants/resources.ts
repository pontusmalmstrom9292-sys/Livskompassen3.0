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
    id: 'res-113',
    kind: 'akut',
    title_sv: 'Akut — 113',
    body_sv: 'Vid omedelbar fara för liv. Ring 113.',
    href: 'tel:113',
  },
  {
    id: 'res-1177',
    kind: 'vard',
    title_sv: '1177 Vårdguiden',
    body_sv: 'Råd om beroende och var du kan vända dig. Sök ”beroende” på 1177.se.',
    href: 'https://www.1177.se',
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
    body_sv: 'Mind erbjuder stöd via chatt och telefon för psykisk ohälsa. Se mind.se.',
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
  'Hubben ersätter inte medicinsk eller beroendevård. Vid akut kris: 113. Vid behov av behandling: kontakta 1177 eller din vårdcentral.';
