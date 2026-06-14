import type { LucideIcon } from 'lucide-react';
import { BookOpen, CircleHelp, Compass, Sparkles, Zap } from 'lucide-react';
import { QUIZ_WIDGET_LABEL } from '@/core/copy/compassWidgetLabels';

export type HomeActionId = 'kompass' | 'dagbok' | 'uppgift' | 'quiz' | 'lucka';

export type HomeActionCategory = {
  id: HomeActionId;
  label: string;
  desc: string;
  icon: LucideIcon;
  tone: 'gold' | 'emerald' | 'indigo' | 'lavender';
};

export const HOME_ACTION_CATEGORIES: HomeActionCategory[] = [
  {
    id: 'kompass',
    label: 'Kompass',
    desc: 'Check-in efter tid på dygnet',
    icon: Compass,
    tone: 'emerald',
  },
  {
    id: 'dagbok',
    label: 'Dagbok',
    desc: 'Skriv en rad — neutralt',
    icon: BookOpen,
    tone: 'gold',
  },
  {
    id: 'uppgift',
    label: 'Uppgift',
    desc: 'Ett mikrosteg i taget',
    icon: Zap,
    tone: 'lavender',
  },
  {
    id: 'quiz',
    label: QUIZ_WIDGET_LABEL,
    desc: 'Valvet lär känna dig',
    icon: Sparkles,
    tone: 'indigo',
  },
  {
    id: 'lucka',
    label: 'Luckor',
    desc: 'Fyll i det som saknas',
    icon: CircleHelp,
    tone: 'gold',
  },
];

export function getHomeActionCategory(id: HomeActionId): HomeActionCategory {
  return HOME_ACTION_CATEGORIES.find((c) => c.id === id) ?? HOME_ACTION_CATEGORIES[0];
}
