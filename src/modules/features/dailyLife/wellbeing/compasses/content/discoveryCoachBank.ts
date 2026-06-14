/**
 * MB-REF-01..06 + MB-PLAY-01..04 — KEEP (Mabra-CONTENT-BANK), client parafras.
 */
import type { DagligMixPlay } from '@/features/dailyLife/wellbeing/mabra/content/dagligMixCatalog';

export type DiscoveryCoachReflection = {
  bankId: string;
  content_class: 'REFLECTION';
  text_sv: string;
};

export const DISCOVERY_COACH_REFLECTIONS: readonly DiscoveryCoachReflection[] = [
  {
    bankId: 'MB-REF-01',
    content_class: 'REFLECTION',
    text_sv: 'Vilket värde är lättast att bära idag — inte det svåraste, bara det som finns nära?',
  },
  {
    bankId: 'MB-REF-02',
    content_class: 'REFLECTION',
    text_sv:
      'En handling under fem minuter som stämmer med ett värde du redan valt — vad skulle den vara?',
  },
  {
    bankId: 'MB-REF-03',
    content_class: 'REFLECTION',
    text_sv:
      'Om kroppen fortfarande reagerar på en upplevelse av "nej" — vilken behovssignal kan den bära, utan att du måste agera?',
  },
  {
    bankId: 'MB-REF-04',
    content_class: 'REFLECTION',
    text_sv: 'Tre neutrala fakta om din upplevelse just nu — inga domar om dig eller någon annan.',
  },
  {
    bankId: 'MB-REF-05',
    content_class: 'REFLECTION',
    text_sv: 'Vad är det minsta som räknas som "nog" idag — ett andetag, en paus, en rad?',
  },
  {
    bankId: 'MB-REF-06',
    content_class: 'REFLECTION',
    text_sv: 'Efter att pulsen legat högt — var i kroppen känns det lugnast just nu, även lite?',
  },
] as const;

export const DISCOVERY_COACH_PLAYS: readonly DagligMixPlay[] = [
  {
    bankId: 'MB-PLAY-01',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Paus-streck',
    rule_sv: 'Mellan två utandningar: föreställ dig ett kort streck — inget att rita perfekt, inget mål.',
  },
  {
    bankId: 'MB-PLAY-02',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Värde-touch',
    rule_sv: 'Peka på ett föremål i rummet som påminner om ett värde — säg ett ord högt eller tyst.',
  },
  {
    bankId: 'MB-PLAY-03',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Utandning fyra',
    rule_sv: 'Räkna bara utandningar till fyra — om du tappar räkningen, börja om utan kommentar.',
  },
  {
    bankId: 'MB-PLAY-04',
    content_class: 'PLAY',
    source_tier: 'P1',
    status: 'KEEP',
    title_sv: 'Ett ord, vik',
    rule_sv:
      'Skriv ett ord som beskriver dagens tyngd; vik ihop pappret eller markera "klar" på skärmen — symboliskt släpp.',
  },
] as const;
