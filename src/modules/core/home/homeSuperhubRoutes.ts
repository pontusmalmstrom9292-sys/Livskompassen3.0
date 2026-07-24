import { Briefcase, BookOpen, Brain, ClipboardList, Wallet } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { LifeHubPresetId } from '../lifeOs/lifeHubPresets';

/** Canonical Universal Input Hub entry points (Fas 12B — en sanning för Hem-broar). */
export const HOME_SUPERHUB_ROUTES = {
  hjartatReflektion: '/hjartat/input?inputMode=reflektion',
  hjartatQuickMirror: '/hjartat/input?inputMode=quick_mirror',
  hjartatArkiv: '/hjartat/input?inputMode=arkiv',
  hemInkast: '/planering/input?inputMode=inkast',
  planeringTask: '/planering/input?inputMode=task_quick',
  planeringInkast: '/planering/input?inputMode=inkast',
  planeringList: '/planering/input?inputMode=quick_list',
  planeringHub: '/planering/input',
  arbetslivStampla: '/arbetsliv/input?inputMode=stampla',
  mabraInput: '/mabra/input',
  ekonomiInput: '/vardagen?tab=ekonomi',
} as const;

export type HomeSuperhubShortcut = {
  id: string;
  label: string;
  lead: string;
  to: string;
  icon: LucideIcon;
};

const SHORTCUTS = {
  dagbok: {
    id: 'superhub-dagbok',
    label: 'Superdagbok',
    lead: 'Reflektera eller snabb spegling',
    to: HOME_SUPERHUB_ROUTES.hjartatQuickMirror,
    icon: BookOpen,
  },
  planering: {
    id: 'superhub-planering',
    label: 'Snabb uppgift',
    lead: 'Lägg till i Att göra',
    to: HOME_SUPERHUB_ROUTES.planeringTask,
    icon: ClipboardList,
  },
  arbetsliv: {
    id: 'superhub-arbetsliv',
    label: 'Stämpel',
    lead: 'Tid och stämpelklocka',
    to: HOME_SUPERHUB_ROUTES.arbetslivStampla,
    icon: Briefcase,
  },
  mabra: {
    id: 'superhub-mabra',
    label: 'Mabra',
    lead: 'Andning och reflektion',
    to: HOME_SUPERHUB_ROUTES.mabraInput,
    icon: Brain,
  },
  ekonomi: {
    id: 'superhub-ekonomi',
    label: 'Ekonomi',
    lead: 'Saldo och mikrosteg',
    to: HOME_SUPERHUB_ROUTES.ekonomiInput,
    icon: Wallet,
  },
} satisfies Record<string, HomeSuperhubShortcut>;

/** Preset-styrd rad med direktlänkar till superhubbar (max 3 — kognitiv avlastning). */
export function getHomeSuperhubShortcutsForPreset(presetId: LifeHubPresetId): HomeSuperhubShortcut[] {
  switch (presetId) {
    case 'vardag_arbete':
      return [SHORTCUTS.planering, SHORTCUTS.arbetsliv, SHORTCUTS.ekonomi];
    case 'rehab_lag':
      return [SHORTCUTS.mabra, SHORTCUTS.dagbok];
    case 'minimal':
      return [SHORTCUTS.dagbok];
    case 'foralder_trygg':
    default:
      return [SHORTCUTS.dagbok, SHORTCUTS.planering];
  }
}
