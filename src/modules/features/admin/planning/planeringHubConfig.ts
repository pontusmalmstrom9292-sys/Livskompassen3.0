import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  FolderKanban,
  Plus,
  ShoppingCart,
  Sparkles,
  Columns3,
} from 'lucide-react';
import type { PlaneringTab } from './types';

export type PlaneringToolId = PlaneringTab | 'projekt' | 'nytt-projekt';

export type PlaneringToolCard = {
  id: PlaneringToolId;
  title: string;
  lead: string;
  emoji: string;
  icon: LucideIcon;
  /** Intern flik eller extern route */
  to: string;
  tone: 'gold' | 'emerald' | 'indigo' | 'lavender';
  badge?: string;
};

export const PLANERING_HUB_LEAD =
  '«Ett steg räcker.» Välj ett verktyg — resten kan vänta.';

export const PLANERING_TOOLS: PlaneringToolCard[] = [
  {
    id: 'inkop',
    title: 'Inköpslista',
    lead: 'Snabb punktlista i affären. Fäst på Hem om du vill.',
    emoji: '🛒',
    icon: ShoppingCart,
    to: '/planering?tab=inkop',
    tone: 'emerald',
    badge: 'Ny',
  },
  {
    id: 'handling',
    title: 'Handling',
    lead: 'Uppgifter i tre steg: att göra, väntar, klart.',
    emoji: '✓',
    icon: Columns3,
    to: '/planering?tab=handling',
    tone: 'gold',
  },
  {
    id: 'fokus',
    title: 'Fokus',
    lead: 'En sak i taget — utan kanban-brus.',
    emoji: '◎',
    icon: Sparkles,
    to: '/planering?tab=fokus',
    tone: 'indigo',
  },
  {
    id: 'inkorg',
    title: 'Inkorg',
    lead: 'Mejl och saker att sortera.',
    emoji: '📥',
    icon: BookOpen,
    to: '/planering?tab=inkorg',
    tone: 'lavender',
  },
  {
    id: 'projekt',
    title: 'Mina projekt',
    lead: 'Listor, anteckningar och egna planer.',
    emoji: '📁',
    icon: FolderKanban,
    to: '/projekt',
    tone: 'gold',
  },
  {
    id: 'nytt-projekt',
    title: 'Starta projekt',
    lead: 'Välj lista, uppgift eller anteckning.',
    emoji: '＋',
    icon: Plus,
    to: '/admin/projects/ny',
    tone: 'emerald',
  },
];

export const PLANERING_VIEW_TITLES: Record<PlaneringTab, string> = {
  start: 'Välj verktyg',
  hub: 'Planering',
  inkop: 'Inköpslista',
  handling: 'Handling',
  fokus: 'Fokus',
  framsteg: 'Framsteg',
  inkorg: 'Inkorg',
  regler: 'E-postregler',
};

export function parsePlaneringTab(raw: string | null): PlaneringTab {
  if (
    raw === 'start' ||
    raw === 'handling' ||
    raw === 'fokus' ||
    raw === 'framsteg' ||
    raw === 'inkorg' ||
    raw === 'regler' ||
    raw === 'inkop'
  ) {
    return raw;
  }
  if (raw === 'hub') return 'hub';
  return 'handling';
}
