import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Calendar,
  Camera,
  Clock,
  Columns3,
  FolderKanban,
  ListChecks,
  NotebookPen,
  Plus,
  Route,
  ShoppingCart,
  Sparkles,
  Timer,
  Wallet,
} from 'lucide-react';

export type PlaneringHubModuleCategory =
  | 'listor'
  | 'uppgifter'
  | 'tid'
  | 'filer'
  | 'anteckning';

export type PlaneringHubModuleId =
  | 'inkop'
  | 'handling'
  | 'fokus'
  | 'inkorg'
  | 'projekt'
  | 'nytt-projekt'
  | 'tidtagning'
  | 'foton'
  | 'kalender'
  | 'rutiner'
  | 'anteckning'
  | 'ekonomi'
  | 'priolista'
  | 'mikrofokus'
  | 'deadline';

export type PlaneringHubModule = {
  id: PlaneringHubModuleId;
  title: string;
  lead: string;
  emoji: string;
  icon: LucideIcon;
  to: string;
  category: PlaneringHubModuleCategory;
  tone: 'gold' | 'emerald' | 'indigo' | 'lavender' | 'amber' | 'rose';
  badge?: string;
  /** Visas men navigerar inte än */
  soon?: boolean;
};

export const PLANERING_HUB_MODULE_CATEGORY_LABELS: Record<
  PlaneringHubModuleCategory,
  string
> = {
  listor: 'Listor',
  uppgifter: 'Uppgifter',
  tid: 'Tid & arbete',
  filer: 'Filer & projekt',
  anteckning: 'Anteckning',
};

export const PLANERING_HUB_MODULES: Record<
  PlaneringHubModuleId,
  PlaneringHubModule
> = {
  inkop: {
    id: 'inkop',
    title: 'Inköpslista',
    lead: 'Snabb punktlista i affären.',
    emoji: '🛒',
    icon: ShoppingCart,
    to: '/planering?tab=inkop',
    category: 'listor',
    tone: 'emerald',
  },
  priolista: {
    id: 'priolista',
    title: 'Prioritetslista',
    lead: 'Det viktigaste först — utan brus.',
    emoji: '★',
    icon: ListChecks,
    to: '/planering?tab=inkop',
    category: 'listor',
    tone: 'gold',
  },
  handling: {
    id: 'handling',
    title: 'Handling',
    lead: 'Att göra · väntar · klart.',
    emoji: '✓',
    icon: Columns3,
    to: '/planering?tab=handling',
    category: 'uppgifter',
    tone: 'gold',
  },
  fokus: {
    id: 'fokus',
    title: 'Fokus',
    lead: 'En sak i taget.',
    emoji: '◎',
    icon: Sparkles,
    to: '/planering?tab=fokus',
    category: 'uppgifter',
    tone: 'indigo',
  },
  mikrofokus: {
    id: 'mikrofokus',
    title: 'Mikrosteg',
    lead: 'Minsta möjliga nästa steg.',
    emoji: '→',
    icon: Sparkles,
    to: '/planering?tab=fokus',
    category: 'uppgifter',
    tone: 'lavender',
  },
  inkorg: {
    id: 'inkorg',
    title: 'Inkorg',
    lead: 'Gmail, kalender och granskningskö.',
    emoji: '📥',
    icon: BookOpen,
    to: '/planering?tab=inkorg&inbox=oversikt',
    category: 'uppgifter',
    tone: 'lavender',
  },
  deadline: {
    id: 'deadline',
    title: 'Deadlines',
    lead: 'Datum som driver handling.',
    emoji: '⏱',
    icon: Timer,
    to: '/planering?tab=handling',
    category: 'uppgifter',
    tone: 'amber',
  },
  tidtagning: {
    id: 'tidtagning',
    title: 'Tidtagning',
    lead: 'Stämpelklocka och arbetstid.',
    emoji: '⏲',
    icon: Clock,
    to: '/arbetsliv?tab=stampla',
    category: 'tid',
    tone: 'gold',
  },
  kalender: {
    id: 'kalender',
    title: 'Kalender',
    lead: 'Google Kalender i Inkorg.',
    emoji: '📅',
    icon: Calendar,
    to: '/planering/kalender',
    category: 'tid',
    tone: 'amber',
  },
  rutiner: {
    id: 'rutiner',
    title: 'Rutiner',
    lead: 'Färdiga flöden du kör ofta.',
    emoji: '↻',
    icon: Route,
    to: '/planering?tab=handling#planering-rutiner',
    category: 'tid',
    tone: 'emerald',
  },
  ekonomi: {
    id: 'ekonomi',
    title: 'Ekonomi',
    lead: 'Lön, period, tidssaldo.',
    emoji: '¤',
    icon: Wallet,
    to: '/ekonomi',
    category: 'tid',
    tone: 'gold',
  },
  foton: {
    id: 'foton',
    title: 'Foton',
    lead: 'Bilder kopplade till projekt.',
    emoji: '📷',
    icon: Camera,
    to: '/projekt',
    category: 'filer',
    tone: 'rose',
    badge: 'Album',
  },
  projekt: {
    id: 'projekt',
    title: 'Mina projekt',
    lead: 'Listor, anteckningar, planer.',
    emoji: '📁',
    icon: FolderKanban,
    to: '/projekt',
    category: 'filer',
    tone: 'gold',
  },
  'nytt-projekt': {
    id: 'nytt-projekt',
    title: 'Starta projekt',
    lead: 'Lista, uppgift eller anteckning.',
    emoji: '＋',
    icon: Plus,
    to: '/projekt/ny',
    category: 'filer',
    tone: 'emerald',
  },
  anteckning: {
    id: 'anteckning',
    title: 'Snabbanteckning',
    lead: 'Kort tanke till vardagen.',
    emoji: '✎',
    icon: NotebookPen,
    to: '/widget/anteckning',
    category: 'anteckning',
    tone: 'lavender',
  },
};

export const ALL_PLANERING_HUB_MODULE_IDS = Object.keys(
  PLANERING_HUB_MODULES,
) as PlaneringHubModuleId[];

export function getPlaneringHubModule(
  id: PlaneringHubModuleId,
): PlaneringHubModule {
  return PLANERING_HUB_MODULES[id];
}

export function resolvePlaneringHubModules(
  ids: PlaneringHubModuleId[],
): PlaneringHubModule[] {
  return ids.map((id) => PLANERING_HUB_MODULES[id]).filter(Boolean);
}
