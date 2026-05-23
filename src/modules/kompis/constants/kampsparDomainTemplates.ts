import type { KampsparEntryType } from './kampsparFormOptions';

export type KampsparDomainTemplate = {
  id: string;
  label: string;
  hint: string;
  title: string;
  content: string;
  category: string;
  entryType: KampsparEntryType;
  tags: string;
};

/** Färdiga mallar — användaren redigerar texten och trycker Spara i Minne. */
export const KAMPSPAR_DOMAIN_TEMPLATES: KampsparDomainTemplate[] = [
  {
    id: 'adhd',
    label: 'ADHD',
    hint: 'Ett mikrosteg som fungerade',
    title: 'ADHD — strategi som fungerade',
    content: 'Situation: \n\nÅtgärd (ett mikrosteg): \n\nResultat: ',
    category: 'strategi',
    entryType: 'strategi',
    tags: 'adhd, mikrosteg',
  },
  {
    id: 'angest',
    label: 'Ångest',
    hint: 'Vad lugnade kroppen',
    title: 'Grounding — vad som hjälpte',
    content:
      'Symtom i kroppen: \n\nMetod (4-7-8 / kallt vatten / promenad): \n\nEfteråt kändes det: ',
    category: 'coping',
    entryType: 'strategi',
    tags: 'gad, vagus, mabra',
  },
  {
    id: 'kanslor',
    label: 'Känslor',
    hint: 'Insikt från dagbok eller reflektion',
    title: 'Insikt — känsla och lärdom',
    content: 'Känsla: \n\nVad hände: \n\nEn sak jag tar med mig: ',
    category: 'insikt',
    entryType: 'fakta',
    tags: 'dagbok, insikt',
  },
  {
    id: 'barn',
    label: 'Barn',
    hint: 'Lärdom — daglig BBIC-logg sker i Familjen',
    title: 'Föräldraskap — lärdom',
    content: 'Barn: \n\nObservation (neutral): \n\nNästa gång ett steg: ',
    category: 'barn',
    entryType: 'fakta',
    tags: 'foraldraskap, bbic',
  },
  {
    id: 'aterhamtning',
    label: 'Återhämtning',
    hint: 'Känsligt — redigera innan du sparar',
    title: 'Återhämtning — trigger och plan',
    content:
      'Trigger (stress/miljö): \n\nTidig signal: \n\nSäker åtgärd (sömn, samtal, vård): ',
    category: 'aterhamtning',
    entryType: 'strategi',
    tags: 'f155, aterhamtning',
  },
];
