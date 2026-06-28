/**
 * Kanon för Hjärtat-nav — zon-leda och lager (Dagbok / Speglar).
 */

export type HjartatLayerTab = 'reflektion' | 'speglar';

export const HJARTAT_LAYER_LABELS: Record<HjartatLayerTab, string> = {
  reflektion: 'Dagbok',
  speglar: 'Speglar',
};

export const HJARTAT_LAYER_INGRESS: Record<HjartatLayerTab, string> = {
  reflektion: 'Privat reflektion — ett steg i taget. Inget hamnar i Valv utan att du sparar.',
  speglar: 'Validera mot arkiv — inget auto-svar till ex.',
};
