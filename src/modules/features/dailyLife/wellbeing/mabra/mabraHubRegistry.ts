import type { MabraProjectId } from './constants/mabraProjects';
import { MABRA_PROJECTS } from './constants/mabraProjects';
import { MABRA_EXTENDED_PLAYS } from './content/mabraExtendedPlays';
import { FEELING_CARDS_LABEL } from '@/core/copy/compassWidgetLabels';
import type { MabraDurationMinutes, MabraSymptomHub } from './types';

export type MabraHubCategory = 'akut' | 'tankar' | 'lekar' | 'identitet' | 'projekt';

export type MabraHubToolKind =
  | 'feeling_cards'
  | 'reflection_deck'
  | 'self_quiz'
  | 'micro_play'
  | 'kbt'
  | 'daglig_mix'
  | 'explore_weekly'
  | 'movement'
  | 'nutrition'
  | 'goals'
  | 'education'
  | 'recovery'
  | 'recovery_sos';

export type MabraHubAction =
  | { type: 'symptom'; hub: MabraSymptomHub }
  | { type: 'breathing'; variant: 'panic_rsd' | 'self_critical'; minutes: MabraDurationMinutes }
  | { type: 'grounding' }
  | { type: 'reframing' }
  | { type: 'values' }
  | { type: 'project'; projectId: MabraProjectId }
  | { type: 'tool'; tool: MabraHubToolKind; playBankId?: string };

export type MabraHubItem = {
  id: string;
  title: string;
  lead: string;
  emoji: string;
  category: MabraHubCategory;
  action: MabraHubAction;
  quick?: boolean;
};

export const MABRA_HUB_CATEGORY_LABELS: Record<MabraHubCategory, string> = {
  akut: 'Akut & kropp',
  tankar: 'Tankar & KBT',
  lekar: 'Lekar & minispel',
  identitet: 'Lära känna dig',
  projekt: 'Egna projekt · Valv',
};

const CATEGORY_ORDER: MabraHubCategory[] = [
  'akut',
  'tankar',
  'lekar',
  'identitet',
  'projekt',
];

const CORE_ITEMS: MabraHubItem[] = [
  {
    id: 'akut-panic',
    title: 'Panik / RSD',
    lead: 'Akut landning + andning',
    emoji: '🌧',
    category: 'akut',
    quick: true,
    action: { type: 'symptom', hub: 'panic_rsd' },
  },
  {
    id: 'akut-self',
    title: 'Självkritik',
    lead: 'Omtolvning + valfri andning',
    emoji: '💔',
    category: 'akut',
    quick: true,
    action: { type: 'symptom', hub: 'self_critical' },
  },
  {
    id: 'akut-find',
    title: 'Hitta mig',
    lead: '5-4-3-2-1 grounding',
    emoji: '🍃',
    category: 'akut',
    quick: true,
    action: { type: 'symptom', hub: 'find_self' },
  },
  {
    id: 'breath-1',
    title: 'Andning 1 min',
    lead: '4-7-8 — låg tröskel',
    emoji: '🌬',
    category: 'akut',
    quick: true,
    action: { type: 'breathing', variant: 'panic_rsd', minutes: 1 },
  },
  {
    id: 'breath-3',
    title: 'Andning 3 min',
    lead: '4-7-8 — lugnare tempo',
    emoji: '〰',
    category: 'akut',
    action: { type: 'breathing', variant: 'panic_rsd', minutes: 3 },
  },
  {
    id: 'breath-soft',
    title: 'Andning mild',
    lead: 'Efter omtolvning — 1 min',
    emoji: '☁',
    category: 'akut',
    action: { type: 'breathing', variant: 'self_critical', minutes: 1 },
  },
  {
    id: 'ground-direct',
    title: 'Jorda mig',
    lead: 'Direkt till 5-4-3-2-1',
    emoji: '🌍',
    category: 'akut',
    action: { type: 'grounding' },
  },
  {
    id: 'play-54321-wizard',
    title: '5-4-3-2-1 wizard',
    lead: 'MB-PLAY-54321 — steg för steg',
    emoji: '🌿',
    category: 'lekar',
    quick: true,
    action: { type: 'tool', tool: 'micro_play', playBankId: 'MB-PLAY-54321' },
  },
  {
    id: 'reframe-direct',
    title: 'Omtolvning',
    lead: 'Fyra steg — inre kritiker',
    emoji: '🪞',
    category: 'tankar',
    action: { type: 'reframing' },
  },
  {
    id: 'kbt-tool',
    title: 'Automatiska tankar',
    lead: 'KBT-transformator',
    emoji: '⚙',
    category: 'tankar',
    action: { type: 'tool', tool: 'kbt' },
  },
  {
    id: 'daglig-mix',
    title: 'Dagens mix',
    lead: 'Kort + mikrospel idag',
    emoji: '✦',
    category: 'lekar',
    quick: true,
    action: { type: 'tool', tool: 'daglig_mix' },
  },
  {
    id: 'explore-weekly',
    title: 'Prova något nytt',
    lead: 'Veckoutmaning — låg stakes',
    emoji: '🧭',
    category: 'lekar',
    quick: true,
    action: { type: 'tool', tool: 'explore_weekly' },
  },
  {
    id: 'movement-panel',
    title: 'Rörelse & kropp',
    lead: 'Mikrosteg — ingen prestation',
    emoji: '🚶',
    category: 'akut',
    quick: true,
    action: { type: 'tool', tool: 'movement' },
  },
  {
    id: 'nutrition-panel',
    title: 'Näring & vätska',
    lead: 'Snabb logg · vatten · mjuka påminnelser',
    emoji: '💧',
    category: 'akut',
    action: { type: 'tool', tool: 'nutrition' },
  },
  {
    id: 'goals-panel',
    title: 'Målsättning',
    lead: 'Ett mål i taget — du bekräftar',
    emoji: '🎯',
    category: 'tankar',
    quick: true,
    action: { type: 'tool', tool: 'goals' },
  },
  {
    id: 'education-panel',
    title: 'Utbildningspelare',
    lead: 'Mikroinlärning + FACT-kapitel',
    emoji: '📚',
    category: 'lekar',
    action: { type: 'tool', tool: 'education' },
  },
  {
    id: 'recovery-sos',
    title: 'SOS craving',
    lead: '90 sek — andning eller grounding',
    emoji: '🆘',
    category: 'akut',
    quick: true,
    action: { type: 'tool', tool: 'recovery_sos' },
  },
  {
    id: 'recovery-panel',
    title: 'Återhämtning',
    lead: 'Drogfrihet · SOS · steg',
    emoji: '🛡',
    category: 'akut',
    action: { type: 'tool', tool: 'recovery' },
  },
  {
    id: 'feeling-cards',
    title: FEELING_CARDS_LABEL,
    lead: 'Namnge känslan — lär dig signalerna',
    emoji: '🎴',
    category: 'lekar',
    quick: true,
    action: { type: 'tool', tool: 'feeling_cards' },
  },
  {
    id: 'reflection-deck',
    title: 'Frågekort',
    lead: 'Bläddra i hela leken',
    emoji: '🃏',
    category: 'lekar',
    action: { type: 'tool', tool: 'reflection_deck' },
  },
  {
    id: 'self-quiz',
    title: 'Själv-frågesport',
    lead: 'Slumpat kort — inget fel svar',
    emoji: '❓',
    category: 'lekar',
    action: { type: 'tool', tool: 'self_quiz' },
  },
  {
    id: 'values',
    title: 'Värderingskompass',
    lead: 'ACT — vad du vill stå för',
    emoji: '🧭',
    category: 'identitet',
    action: { type: 'values' },
  },
];

const PLAY_ITEMS: MabraHubItem[] = MABRA_EXTENDED_PLAYS.map((play) => ({
  id: `play-${play.bankId}`,
  title: play.title_sv,
  lead: play.rule_sv.slice(0, 72) + (play.rule_sv.length > 72 ? '…' : ''),
  emoji: '🎲',
  category: 'lekar' as const,
  action: { type: 'tool' as const, tool: 'micro_play' as const, playBankId: play.bankId },
}));

const PROJECT_ITEMS: MabraHubItem[] = MABRA_PROJECTS.map((p) => ({
  id: `project-${p.id}`,
  title: p.title,
  lead: p.lead,
  emoji: '◇',
  category: 'projekt' as const,
  action: { type: 'project' as const, projectId: p.id },
}));

export const MABRA_HUB_ITEMS: MabraHubItem[] = [
  ...CORE_ITEMS,
  ...PLAY_ITEMS,
  ...PROJECT_ITEMS,
];

export const MABRA_HUB_QUICK_ITEMS = MABRA_HUB_ITEMS.filter((i) => i.quick);

/** Lågenergi — två stora val (Fas 2 §1). */
export const MABRA_LOW_ENERGY_ITEMS: MabraHubItem[] = [
  {
    id: 'low-breath-1',
    title: 'Andning 1 min',
    lead: '4-7-8 — låg tröskel',
    emoji: '🌬',
    category: 'akut',
    action: { type: 'breathing', variant: 'panic_rsd', minutes: 1 },
  },
  {
    id: 'low-reflection',
    title: 'Ett frågekort',
    lead: 'Ett kort idag — inget fel svar',
    emoji: '🃏',
    category: 'lekar',
    action: { type: 'tool', tool: 'reflection_deck' },
  },
];

export function groupMabraHubByCategory(items: MabraHubItem[]) {
  const out: Partial<Record<MabraHubCategory, MabraHubItem[]>> = {};
  for (const item of items) {
    if (!out[item.category]) out[item.category] = [];
    out[item.category]!.push(item);
  }
  return CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: MABRA_HUB_CATEGORY_LABELS[cat],
    items: out[cat] ?? [],
  })).filter((g) => g.items.length > 0);
}

export function findMabraHubItem(id: string): MabraHubItem | undefined {
  return MABRA_HUB_ITEMS.find((item) => item.id === id);
}

/** Zon för tillbaka-navigering utifrån action (snabbstart eller ruta). */
export function resolveCategoryForHubAction(action: MabraHubItem['action']): MabraHubCategory | undefined {
  const match = MABRA_HUB_ITEMS.find((item) => {
    if (item.action.type !== action.type) return false;
    if (action.type === 'symptom' && item.action.type === 'symptom') {
      return item.action.hub === action.hub;
    }
    if (action.type === 'breathing' && item.action.type === 'breathing') {
      return (
        item.action.variant === action.variant && item.action.minutes === action.minutes
      );
    }
    if (action.type === 'project' && item.action.type === 'project') {
      return item.action.projectId === action.projectId;
    }
    if (action.type === 'tool' && item.action.type === 'tool') {
      return (
        item.action.tool === action.tool && item.action.playBankId === action.playBankId
      );
    }
    return true;
  });
  return match?.category;
}
