import type { LucideIcon } from 'lucide-react';
import { Heart, MessageCircle, Sparkles, UserCircle } from 'lucide-react';

export type MabraProjectId =
  | 'self_esteem'
  | 'emotional_memory'
  | 'learn_together'
  | 'who_am_i';

export type MabraPlanKind = 'cards' | 'chat' | 'memory';

export type MabraProject = {
  id: MabraProjectId;
  title: string;
  lead: string;
  icon: LucideIcon;
  planKinds: MabraPlanKind[];
  vitHubLabel: string;
};

/** Egna projekt — Valvet levererar plan → Vit hub. Se MABRA-PROJEKT-VIT-HUB-SPEC.md */
export const MABRA_PROJECTS: MabraProject[] = [
  {
    id: 'self_esteem',
    title: 'Självkänsla',
    lead: 'Valvet skapar en mild plan — frågekort, minnen eller chatt',
    icon: Heart,
    planKinds: ['cards', 'chat', 'memory'],
    vitHubLabel: 'Mitt självkänsla-arkiv',
  },
  {
    id: 'emotional_memory',
    title: 'Känslominnen',
    lead: 'Spara hur det kändes — utan att prestera formulering',
    icon: Sparkles,
    planKinds: ['memory', 'cards'],
    vitHubLabel: 'Känslominnen',
  },
  {
    id: 'learn_together',
    title: 'Lär tillsammans',
    lead: 'Kort dialog med coach — ett steg, inåtvändt',
    icon: MessageCircle,
    planKinds: ['chat', 'cards'],
    vitHubLabel: 'Lärdialoger',
  },
  {
    id: 'who_am_i',
    title: 'Vem är jag?',
    lead: 'Mål, glädje, identitet — din egen Vit hub över tid',
    icon: UserCircle,
    planKinds: ['cards', 'memory', 'chat'],
    vitHubLabel: 'Min identitetshub',
  },
];

export const PLAN_KIND_LABELS: Record<MabraPlanKind, string> = {
  cards: 'Frågekort',
  chat: 'Lär tillsammans',
  memory: 'Känslominne',
};
