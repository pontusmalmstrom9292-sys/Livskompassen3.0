/** CB1–CB4 — BARNPORTEN-SPEC. Default CB2 (surfplatta) efter PMIR 2026-06-06. */
export type BarnportenWidgetVariant = 'cb1' | 'cb2' | 'cb3' | 'none';

export const BARNPORTEN_WIDGET_DEFAULT: BarnportenWidgetVariant = 'cb2';

export const BARNPORTEN_WIDGET_VARIANTS: {
  id: BarnportenWidgetVariant;
  label: string;
  hint: string;
}[] = [
  { id: 'cb1', label: 'Stjärn-prick', hint: 'Diskret prick nere till höger' },
  { id: 'cb2', label: 'Hjärta-båge', hint: 'Nedre kant — bra på surfplatta' },
  { id: 'cb3', label: 'Kompass-mini', hint: 'Liten kompass nere till höger' },
  { id: 'none', label: 'Ingen widget', hint: 'Endast PWA-ikon på hemskärmen' },
];

const STORAGE_KEY = 'barnporten_widget_variant';

export function parseBarnportenWidgetVariant(
  raw: string | null | undefined,
): BarnportenWidgetVariant | null {
  if (raw === 'cb1' || raw === 'cb2' || raw === 'cb3' || raw === 'none') return raw;
  return null;
}

export function readBarnportenWidgetVariant(): BarnportenWidgetVariant {
  if (typeof localStorage === 'undefined') return BARNPORTEN_WIDGET_DEFAULT;
  return parseBarnportenWidgetVariant(localStorage.getItem(STORAGE_KEY)) ?? BARNPORTEN_WIDGET_DEFAULT;
}

export function writeBarnportenWidgetVariant(variant: BarnportenWidgetVariant): void {
  localStorage.setItem(STORAGE_KEY, variant);
}
