import type { CompassFlow } from '../utils/compassTime';
import { NAV_PATHS } from '@/core/navigation/navTruth';
import {
  EVENING_CLOSE_LABEL,
  EVENING_CLOSE_SILO_NOTE,
  FEELING_CARDS_LABEL,
  MICRO_STEP_LABEL,
  NEXT_STEP_LABEL,
} from '@/core/copy/compassWidgetLabels';

export type CompassWidgetContentClass = 'FACT' | 'REFLECTION' | 'PLAY' | 'EVIDENCE' | 'none';

export type CompassWidgetDef = {
  id: string;
  label: string;
  href: string;
  contentClass: CompassWidgetContentClass;
  /** Kort hjälptext (title) — utan dev-jargon. */
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
      siloNote: 'Dagbok — flyttas inte automatiskt till arkiv',
    },
    {
      id: 'inspelning',
      label: 'Inspelning',
      href: '/widget/inspelning?autostart=1',
      contentClass: 'EVIDENCE',
      siloNote: 'Låst post när du sparar explicit',
    },
    {
      id: 'kanslomemory',
      label: FEELING_CARDS_LABEL,
      href: '/mabra',
      contentClass: 'PLAY',
      siloNote: 'MåBra — reflektion och lek',
    },
    {
      id: 'snabb-dagbok',
      label: 'Snabb rad',
      href: `${NAV_PATHS.HJARTAT}?mode=snabb`,
      contentClass: 'REFLECTION',
      siloNote: 'Snabb dagbok — vävning är separat val',
    },
  ],
  day: [
    {
      id: 'quiz',
      label: 'Snabb fråga',
      href: '/widget/snabbval',
      contentClass: 'FACT',
      siloNote: 'Kunskapsbank — inget auto-spar i arkiv',
    },
    {
      id: 'paralys',
      label: MICRO_STEP_LABEL,
      href: '/planering?tab=handling',
      contentClass: 'none',
      siloNote: 'Planering — manuell start',
    },
    {
      id: 'dagbok',
      label: 'Dagbok',
      href: NAV_PATHS.HJARTAT,
      contentClass: 'REFLECTION',
      siloNote: 'Dagbok — flyttas inte automatiskt till arkiv',
    },
    {
      id: 'uppgift',
      label: 'Uppgift',
      href: '/planering?tab=fokus',
      contentClass: 'none',
      siloNote: 'Mikrosteg via planering',
    },
  ],
  evening: [
    {
      id: 'kasam',
      label: EVENING_CLOSE_LABEL,
      href: '/vardagen?tab=kompasser',
      contentClass: 'REFLECTION',
      siloNote: EVENING_CLOSE_SILO_NOTE,
    },
    {
      id: 'reflektion',
      label: 'Reflektion',
      href: NAV_PATHS.HJARTAT,
      contentClass: 'REFLECTION',
      siloNote: 'Dagbok — låst när du sparar',
    },
    {
      id: 'anteckning',
      label: 'Anteckning',
      href: '/widget/anteckning',
      contentClass: 'none',
      siloNote: 'Dagbok — flyttas inte automatiskt till arkiv',
    },
    {
      id: 'planering',
      label: NEXT_STEP_LABEL,
      href: '/planering?tab=fokus',
      contentClass: 'none',
      siloNote: 'Planering — länk, inga poäng',
    },
  ],
};

export function getCompassWidgets(flow: CompassFlow): CompassWidgetDef[] {
  return COMPASS_WIDGET_CATALOG[flow];
}
