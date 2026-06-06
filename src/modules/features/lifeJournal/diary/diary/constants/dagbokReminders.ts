import { VAVAREN_DAGBOK_ARCHIVE_LINE } from '@/features/lifeJournal/evidence/vault/constants/vavarenCopy';

/** Kort «kom ihåg» — visas i DagbokPage (Lager 1 vs 2). */
export const DAGBOK_REMEMBER_LINES = [
  {
    label: 'Dagbok',
    text: 'Hur du mår — privat. Sparas när du trycker Spara.',
  },
  {
    label: 'Arkiv',
    text: 'Fakta: datum, sms, skärmdumpar — vid konflikt, vårdnad eller om du behöver tidslinje senare.',
  },
  {
    label: 'Viktigt',
    text: 'Inget flyttas automatiskt. Ventilera här — bevisa där (ℹ eller handoff-rutan).',
  },
  {
    label: 'Taggar',
    text: VAVAREN_DAGBOK_ARCHIVE_LINE,
  },
] as const;

export const DAGBOK_REMEMBER_STORAGE_KEY = 'livskompassen.dagbokRememberOpen';
