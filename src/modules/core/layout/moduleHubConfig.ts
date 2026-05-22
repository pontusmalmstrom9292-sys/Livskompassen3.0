import type { LucideIcon } from 'lucide-react';
import { BookOpen, Anchor, Heart, Sprout, Sparkles } from 'lucide-react';

export type HubModule = {
  path: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  tone: 'gold' | 'indigo' | 'lavender' | 'emerald';
  longPress?: boolean;
  search?: string;
};

export const HUB_CENTER: HubModule = {
  path: '/dagbok',
  label: 'Hjärtat',
  desc: 'Dagbok · bevis · spegling',
  icon: BookOpen,
  tone: 'gold',
  longPress: true,
  search: '?tab=bevis',
};

export const HUB_SIDE_MODULES: HubModule[] = [
  {
    path: '/hamn',
    label: 'Hamn',
    desc: 'BIFF · gränser',
    icon: Anchor,
    tone: 'indigo',
  },
  {
    path: '/familjen',
    label: 'Familjen',
    desc: 'Livsloggar · barn',
    icon: Heart,
    tone: 'lavender',
  },
  {
    path: '/vardagen',
    label: 'Vardagen',
    desc: 'Kompass · ekonomi',
    icon: Sprout,
    tone: 'emerald',
  },
  {
    path: '/mabra',
    label: 'Måbra',
    desc: 'KBT · vanor',
    icon: Sparkles,
    tone: 'lavender',
  },
];

export const HUB_TOP = HUB_SIDE_MODULES.slice(0, 2);
export const HUB_BOTTOM = HUB_SIDE_MODULES.slice(2, 4);
