import type { DagligMixPlay } from './dagligMixCatalog';
import { DAGLIG_MIX_PLAYS } from './dagligMixCatalog';

/** Mikrolekar från bank G1–G7 + daglig mix — inga poäng. */
export const MABRA_EXTENDED_PLAYS: readonly DagligMixPlay[] = [
  ...DAGLIG_MIX_PLAYS,
  {
    bankId: 'G2-kropp-bingo',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Kropp-bingo',
    rule_sv: 'Markera tre zoner: fot, mage, axel. Finns spänning? Ja / nej / neutral.',
  },
  {
    bankId: 'G3-varde-idag',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Värde idag',
    rule_sv: 'Välj ett värde (t.ex. omsorg, mod). En handling som passar idag — en rad.',
  },
  {
    bankId: 'G4-milt-svar',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Milt svar',
    rule_sv: 'Läs en kritisk tanke — skriv ett milt svar på en mening.',
  },
  {
    bankId: 'G5-ljud-jakt',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Ljud-jakt',
    rule_sv: 'Hitta fyra ljud omkring dig. Ingen tidtagning, ingen poäng.',
  },
  {
    bankId: 'G6-gladje-mini',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Glädje-miniatyr',
    rule_sv: 'En sak som var lugnt eller kul senaste dygnet — en rad.',
  },
  {
    bankId: 'G7-andning-runda',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'En andningsrunda',
    rule_sv: 'En 4-7-8-cykel räcker. Ingen räknare att prestera med.',
  },
  {
    bankId: 'MB-PLAY-05',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Timer-blink',
    rule_sv: 'Sätt en timer på 3 min. Gör en sak tills den ringer — eller stäng av tidigare utan skuld.',
  },
  {
    bankId: 'MB-PLAY-06',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Synlig lista',
    rule_sv: 'Skriv en rad på papper eller i telefonen som du inte behöver komma ihåg i huvudet. Klart.',
  },
  {
    bankId: 'MB-PLAY-GAD-01',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: '5-4-3-1 mini',
    rule_sv: '5 saker du ser, 4 du hör, 3 du känner mot kroppen, 1 lång utandning. Ingen poäng.',
  },
  {
    bankId: 'MB-PLAY-08',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Värde-touch 2',
    rule_sv: 'Peka på ett föremål som påminner om ett värde — ett ord högt eller tyst.',
  },
  {
    bankId: 'MB-PLAY-JOY-01',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Tre utan ordning',
    rule_sv: 'Nämn tre saker som bara är roliga för dig — stopp efter tre, ingen rangordning.',
  },
  {
    bankId: 'MB-PLAY-JOY-02',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Trettio sekunder',
    rule_sv: 'Välj sim, klättra, promenad eller vila — föreställ aktiviteten i 30 sekunder. Ingen prestation, inget resultat.',
  },
] as const;

export function getMabraPlay(bankId: string): DagligMixPlay | undefined {
  return MABRA_EXTENDED_PLAYS.find((p) => p.bankId === bankId);
}
