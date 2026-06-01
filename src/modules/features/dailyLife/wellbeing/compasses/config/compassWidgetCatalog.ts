import type { CompassFlow } from '../utils/compassTime';

export type CompassWidgetContentClass = 'FACT' | 'REFLECTION' | 'PLAY' | 'EVIDENCE' | 'none';

export type CompassWidgetDef = {
  id: string;
  label: string;
  href: string;
  contentClass: CompassWidgetContentClass;
  /** U1 / U6 — kort silo-regel för kurator */
  siloNote: string;
};

/** Per-tidskompass snabbstart — se docs/evaluations/2026-05-29-kompass-widget-snabbstart-plan.md */
export const COMPASS_WIDGET_CATALOG: Record<CompassFlow, CompassWidgetDef[]> = {
  morning: [
    {
      id: 'anteckning',
      label: 'Anteckning',
      href: '/widget/anteckning',
      contentClass: 'none',
      siloNote: 'Lager 1 journal — ej auto Valv',
    },
    {
      id: 'inspelning',
      label: 'Inspelning',
      href: '/widget/inspelning?autostart=1',
      contentClass: 'EVIDENCE',
      siloNote: 'Journal/röst — WORM vid explicit spar',
    },
    {
      id: 'kanslomemory',
      label: 'Känslokort',
      href: '/mabra',
      contentClass: 'PLAY',
      siloNote: 'Vit — REFLECTION/PLAY, ingen Kunskap-RAG',
    },
    {
      id: 'snabb-dagbok',
      label: 'Snabb rad',
      href: '/dagbok?mode=snabb',
      contentClass: 'REFLECTION',
      siloNote: 'Journal Snabb — weave opt-in separat',
    },
  ],
  day: [
    {
      id: 'quiz',
      label: 'Frågesport',
      href: '/widget/snabbval',
      contentClass: 'FACT',
      siloNote: 'Kunskap bank — ej Valv-auto',
    },
    {
      id: 'paralys',
      label: 'Mikrosteg',
      href: '/planering?tab=handling',
      contentClass: 'none',
      siloNote: 'P3 Kanban — manuell start',
    },
    {
      id: 'dagbok',
      label: 'Dagbok',
      href: '/dagbok',
      contentClass: 'REFLECTION',
      siloNote: 'Lager 1 — ej auto-promotion Valv',
    },
    {
      id: 'uppgift',
      label: 'Uppgift',
      href: '/planering?tab=fokus',
      contentClass: 'none',
      siloNote: 'Paralys-Brytaren via planering',
    },
  ],
  evening: [
    {
      id: 'kasam',
      label: 'KASAM',
      href: '/vardagen?tab=kompasser',
      contentClass: 'REFLECTION',
      siloNote: 'Kvällskompass — KasamEvening i modul',
    },
    {
      id: 'reflektion',
      label: 'Reflektion',
      href: '/dagbok?tab=reflektion',
      contentClass: 'REFLECTION',
      siloNote: 'Journal wizard — WORM',
    },
    {
      id: 'anteckning',
      label: 'Anteckning',
      href: '/widget/anteckning',
      contentClass: 'none',
      siloNote: 'Lager 1 — ej auto Valv',
    },
    {
      id: 'planering',
      label: 'Fokus',
      href: '/planering?tab=fokus',
      contentClass: 'none',
      siloNote: 'P3 — länk, ingen gamification',
    },
  ],
};

export function getCompassWidgets(flow: CompassFlow): CompassWidgetDef[] {
  return COMPASS_WIDGET_CATALOG[flow];
}
