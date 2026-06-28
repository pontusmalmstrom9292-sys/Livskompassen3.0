/**
 * Kanon för Vardagen-nav — zon-leda och inline-flikar (/vardagen).
 */

export type VardagenInlineTab = 'kompasser' | 'ekonomi' | 'mabra';

export const VARDAGEN_LAYER_LABELS: Record<VardagenInlineTab, string> = {
  kompasser: 'Kompasser',
  ekonomi: 'Ekonomi',
  mabra: 'MåBra',
};

export const VARDAGEN_LAYER_INGRESS: Record<VardagenInlineTab, string> = {
  kompasser: 'Daglig riktning — morgon och kväll. Ett fokus i taget.',
  ekonomi: 'Budget och flöde — utan skuld eller stress.',
  mabra: 'Check-in och små vanor — låg press, inga krav.',
};
