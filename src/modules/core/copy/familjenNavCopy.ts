/**
 * Kanon för Familjen-nav — zon-leda och hub-flikar.
 */

import type { FamiljenTabId } from '@/features/family/children/constants/familjenTabs';

export const FAMILJEN_LAYER_LABELS: Record<FamiljenTabId, string> = {
  reflektion: 'Dagens Barnfokus',
  livslogg: 'Livslogg',
  tillsammans: 'Tillsammans',
  barnporten: 'Barnporten',
  hamn: 'Trygg Hamn',
  drogfrihet: 'Drogfrihet',
};

export const FAMILJEN_LAYER_INGRESS: Record<FamiljenTabId, string> = {
  reflektion: 'Ett barnfokus i taget — sparas till barnets logg, aldrig auto till Valv.',
  livslogg: 'Neutral observation — beteende och datum, inte diagnos.',
  tillsammans: 'Stunder och aktiviteter tillsammans med barnen.',
  barnporten: 'Barnens ingång — förälder granskar, ingen auto-promote till Valv.',
  hamn: 'BIFF och Grey Rock — inget auto-svar till ex.',
  drogfrihet: 'Dagräknare och reflektion — kravlöst stöd.',
};

export const FAMILJEN_LAYER_SWITCH: { id: FamiljenTabId; label: string }[] = [
  { id: 'reflektion', label: 'Barnfokus' },
  { id: 'livslogg', label: 'Livslogg' },
  { id: 'tillsammans', label: 'Tillsammans' },
  { id: 'barnporten', label: 'Barnporten' },
  { id: 'hamn', label: 'Hamn' },
  { id: 'drogfrihet', label: 'Drogfrihet' },
];
