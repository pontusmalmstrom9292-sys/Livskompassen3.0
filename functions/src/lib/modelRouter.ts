/**
 * Gemini Model Router — automatisk modellval
 *
 * Väljer rätt modell baserat på uppgiftens komplexitet.
 * Ingen manuell konfiguration behövs — systemet väljer själv.
 *
 * Nivåer:
 *   FLASH  → gemini-3.5-flash  — snabb, låg kostnad, bra för de flesta uppgifter
 *   PRO    → gemini-3.1-pro    — djupt resonemang, bäst för analys och viktiga beslut
 *   LITE   → gemini-3.5-flash  — alias för enkla/automatiserade tasks
 */

/** Modell-tier */
export type GeminiTier = 'flash' | 'pro' | 'lite';

/** Kanoniska modell-ID (API-strängar) */
export const GEMINI_FLASH = 'gemini-3.5-flash';
export const GEMINI_PRO = 'gemini-3.1-pro';

/**
 * Välj modell baserat på tier.
 * Systemet sköter valet automatiskt — du behöver bara ange VARFÖR (flash/pro).
 */
export function selectModel(tier: GeminiTier): string {
  switch (tier) {
    case 'pro':
      return GEMINI_PRO;
    case 'flash':
    case 'lite':
    default:
      return GEMINI_FLASH;
  }
}

/**
 * Automatisk tier-val baserat på intent/uppgiftsnamn.
 * Används av ADK-orchestratorn för att välja modell utan manuell konfiguration.
 *
 * PRO-uppgifter: dossier, valv, mönster, veckoinsikter, vävaren, gränsanalys
 * FLASH-uppgifter: allt annat (chat, klassificering, dagbok, compass m.m.)
 */
export function autoSelectTier(intent: string, executorId?: string): GeminiTier {
  const key = `${intent} ${executorId ?? ''}`.toLowerCase();

  const proKeywords = [
    'dossier',
    'mönster',
    'monster',
    'pattern',
    'valv',
    'vault',
    'insikt',
    'insight',
    'vecko',
    'weekly',
    'vävaren',
    'weaver',
    'gräns',
    'grans',
    'arkitekt',
    'deep',
    'forensic',
    'analys',
    'evidence',
    'bevis',
    'speglar',
    'mirror',
    'evolution',
    'dossier_foreword',
    'pattern_scan',
    'entity_profile',
  ];

  if (proKeywords.some((kw) => key.includes(kw))) {
    return 'pro';
  }

  return 'flash';
}
