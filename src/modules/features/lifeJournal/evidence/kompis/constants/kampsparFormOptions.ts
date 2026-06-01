/** Förinställda kategorier — matchar profil-seed + utökade Life OS-domäner. */
export const KAMPSPAR_CATEGORY_PRESETS = [
  { value: '', label: '— Välj kategori —' },
  { value: 'profil', label: 'Profil' },
  { value: 'strategi', label: 'Strategi' },
  { value: 'diagnos', label: 'Diagnos / hälsa' },
  { value: 'barn', label: 'Barn' },
  { value: 'coping', label: 'Coping' },
  { value: 'metod', label: 'Metod' },
  { value: 'kommunikation', label: 'Kommunikation' },
  { value: 'skola', label: 'Skola' },
  { value: 'ekonomi', label: 'Ekonomi' },
  { value: '__custom__', label: 'Egen kategori…' },
] as const;

export const KAMPSPAR_ENTRY_TYPES = [
  { value: 'fakta', label: 'Fakta' },
  { value: 'milstolpe', label: 'Milstolpe' },
  { value: 'utmaning', label: 'Utmaning' },
  { value: 'rutin', label: 'Rutin' },
  { value: 'strategi', label: 'Strategi / plan' },
  { value: 'annat', label: 'Annat' },
] as const;

export type KampsparEntryType = (typeof KAMPSPAR_ENTRY_TYPES)[number]['value'];

export function parseTagsInput(raw: string): string[] {
  return raw
    .split(/[,;]+/)
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 12)
    .map((t) => t.slice(0, 40));
}
