/**
 * Kanon för Valv-nav — drawer, zoner och huvudflikar (NAMN-AUDIT 2026-05-31).
 * Importeras av navTruth.ts och tabRegistry.ts (inga duplicerade strängar).
 */

export const VAULT_MAIN_TAB_LABELS = {
  logga: 'Arkiv',
  sok: 'Granska inkommande',
  monster: 'Mönster',
  orkester: 'Meddelanden eller SMS-analys',
  dossier: 'Dossier',
  kunskapsbank: 'Kunskapsbank',
  aktorskarta: 'Personer i ärendet',
} as const;

export type VaultMainTabLabelId = keyof typeof VAULT_MAIN_TAB_LABELS;

export const VALV_ZONE_LABELS = {
  samla: 'Spara & sök',
  inbox: 'Inkorg',
  analysera: 'Mönster',
  kunskap: 'Kunskapsbank',
  vit: 'Mitt Vit',
  exportera: 'Rapporter',
  forensik: 'Djupare',
} as const;

export type ValvZoneLabelId = keyof typeof VALV_ZONE_LABELS;

export const VALV_ZONE_INGRESS: Record<ValvZoneLabelId, string> = {
  samla: 'Samla in bevis och sök i loggen.',
  inbox: 'Godkänn inkommande filer från Drive för att säkra dem i Valvet.',
  analysera: 'Mönster och meddelanden — över tid, inte i stunden.',
  kunskap: 'Fakta bakom PIN: Kunskapsbank och personer i ärendet.',
  vit: 'Dina frågekort och minnen — personlig utveckling, inte bevis mot ex.',
  exportera: 'Dossier för export och översikt.',
  forensik: 'Hamn och fördjupad analys — ett steg i taget.',
};

export const VALV_DRAWER_HINTS = {
  samla: 'Objektiv registrering av skriftliga meddelanden och logistik.',
  inbox: 'Granska och godkänn inskickat material till WORM-arkivet.',
  analysera: 'Strukturerad kartläggning av återkommande mönster och beteenden.',
  kunskap: 'Sparade anteckningar, lagrum och personer i ärendet.',
  vit: 'Frågekort och känslominnen — din Vit hub över tid.',
  exportera: 'Dossier — explicit export, ingen auto-delning.',
  forensik: 'Tidsstämplade poster som inte går att ändra.',
} as const;

export const VIT_VAULT_TAB_LABEL = 'Mitt Vit' as const;

export const FORENSIC_VAULT_TAB_LABELS = {
  hamn_analys: 'Meddelanden · analys',
  speglar_fordjupat: 'Speglar · djup',
  dagbok_arkiv: 'Dagbok · Arkiv',
  familjen_monster: 'Familjen · Mönster',
  arbetsliv_franvaro: 'Arbetsliv · Frånvaro',
  arbetsliv_lon: 'Arbetsliv · Lön',
} as const;

export type ForensicVaultTabLabelId = keyof typeof FORENSIC_VAULT_TAB_LABELS;

export const FORENSIC_TAB_INGRESS: Record<ForensicVaultTabLabelId, string> = {
  hamn_analys: 'Full BIFF-triage och spara som bevis — bakom skölden.',
  speglar_fordjupat: 'Validering och jämförelse mot arkiv — inget auto-svar till ex.',
  dagbok_arkiv: 'Läsa journal — låst post, ingen redigering.',
  familjen_monster: 'Mönster i barnens loggar — separat silo.',
  arbetsliv_franvaro: 'Frånvaro och ekonomi under PIN.',
  arbetsliv_lon: 'Lön och period — kräver arkiv, inte vardagsvy.',
};

/** Drawer: Kunskapsbank-grupp underflikar */
export const VALV_KUNSKAP_DRAWER_LEAF = {
  kunskapsbank: 'Fråga & tidslinje',
  aktorskarta: 'Personer i ärendet',
} as const;

/** Vardag → Dagbok → Valv-länk */
export const DAGBOK_BEVIS_DRAWER_LABEL = 'Arkiv';
