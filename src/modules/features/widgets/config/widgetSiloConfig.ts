/** PV1b — explicit silo-val före widget-spar (default Inkast, aldrig auto-Valv). */
export type WidgetSiloId = 'inkast' | 'dagbok' | 'bevis' | 'barn' | 'mabra' | 'planering';

export type WidgetSiloChip = {
  id: WidgetSiloId;
  label: string;
  hint: string;
};

export const WIDGET_SILO_CHIPS: WidgetSiloChip[] = [
  { id: 'inkast', label: 'Inkast', hint: 'DCAP sorterar senare' },
  { id: 'dagbok', label: 'Dagbok', hint: 'Reflektion i Hjärtat' },
  { id: 'bevis', label: 'Bevis', hint: 'WORM i Valvet' },
  { id: 'barn', label: 'Barn', hint: 'Barnlogg — inte auto-Valv' },
  { id: 'mabra', label: 'Mabra', hint: 'Vit-zon reflektion' },
  { id: 'planering', label: 'Planering', hint: 'Uppgift i P3' },
];

export const DEFAULT_WIDGET_SILO: WidgetSiloId = 'inkast';

export const WIDGET_SILO_STORAGE_KEY = 'livskompassen_widget_silo';

export function widgetSiloDoneCopy(silo: WidgetSiloId, childAlias?: string): { message: string; linkTo: string; linkLabel: string } {
  switch (silo) {
    case 'inkast':
      return { message: 'Skickat till Inkast', linkTo: '/planering/input?inputMode=inkast', linkLabel: 'Öppna Inkast' };
    case 'dagbok':
      return { message: 'Sparat i Dagbok', linkTo: '/hjartat?tab=reflektion', linkLabel: 'Öppna Dagbok' };
    case 'bevis':
      return { message: 'Låst i Valvet', linkTo: '/valvet', linkLabel: 'Öppna Valv' };
    case 'barn':
      return { message: `Sparat till ${childAlias ?? 'barn'}s logg`, linkTo: '/familjen', linkLabel: 'Öppna Familjen' };
    case 'mabra':
      return { message: 'Sparat i Mabra Vit', linkTo: '/mabra', linkLabel: 'Öppna Mabra' };
    case 'planering':
      return { message: 'Uppgift skapad', linkTo: '/planering?tab=handling', linkLabel: 'Öppna Planering' };
  }
}

export function widgetSiloSaveLabel(silo: WidgetSiloId): string {
  const chip = WIDGET_SILO_CHIPS.find((c) => c.id === silo);
  return chip ? `Spara till ${chip.label}` : 'Spara';
}
