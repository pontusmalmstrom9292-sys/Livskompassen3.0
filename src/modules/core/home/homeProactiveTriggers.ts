/** @locked MOD-CORE-MINNE — låst modul; unlock via docs/evaluations/*-unlock-MOD-CORE-MINNE.md */
import type { EvolutionHubDoc } from '@/core/types/firestore';
import { getDefaultCompassByTime } from '@/features/dailyLife/wellbeing/compasses/utils/compassTime';
import type { AdaptiveMemoryCard } from './compassAdaptiveCards';
import type { KasamAggregationRow } from '@/core/firebase/kasamAggregationFirestore';
import { kasamDimensionLabel } from '@/core/firebase/kasamAggregationFirestore';

export type ProactiveTriggerContext = {
  evolutionDoc: EvolutionHubDoc | null;
  hasJournalToday: boolean;
  presetId: string;
  latestKasam?: KasamAggregationRow | null;
  dayOfWeek?: number;
};

const HAMN_SESSION_KEY = 'livskompassen_hamn_session_open_v1';
const WEEKLY_INSIGHT_KEY = 'livskompassen_weekly_insight_prompt_v1';

/** Hamn öppnad denna session utan påminnelse om Valv-sparning. */
export function markHamnSessionOpen(): void {
  try {
    sessionStorage.setItem(HAMN_SESSION_KEY, '1');
  } catch {
    /* best-effort */
  }
}

export function consumeHamnSaveReminder(): boolean {
  try {
    const v = sessionStorage.getItem(HAMN_SESSION_KEY);
    if (v === '1') {
      sessionStorage.removeItem(HAMN_SESSION_KEY);
      return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

function cognitiveLevel(doc: EvolutionHubDoc | null): number {
  return doc?.pillars?.kognitiv?.level ?? 2;
}

function isoWeekKey(date = new Date()): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

function shouldShowWeeklyInsight(dayOfWeek: number): boolean {
  if (dayOfWeek === 0 || dayOfWeek >= 5) {
    try {
      const weekKey = isoWeekKey();
      const stored = sessionStorage.getItem(WEEKLY_INSIGHT_KEY);
      if (stored === weekKey) return false;
      sessionStorage.setItem(WEEKLY_INSIGHT_KEY, weekKey);
      return true;
    } catch {
      return dayOfWeek === 0;
    }
  }
  return false;
}

/**
 * evolution_hub-triggers — ett kort i taget, kapacitetsmedvetet (Fas 4).
 */
export function buildProactiveTriggerCards(ctx: ProactiveTriggerContext): AdaptiveMemoryCard[] {
  const cards: AdaptiveMemoryCard[] = [];
  const flow = getDefaultCompassByTime();
  const level = cognitiveLevel(ctx.evolutionDoc);
  const dayOfWeek = ctx.dayOfWeek ?? new Date().getDay();

  if (!ctx.hasJournalToday && level >= 2) {
    cards.push({
      id: 'proactive-journal',
      title: 'Dagbok',
      prompt: 'Hur har dagen varit? En rad räcker — utan att lösa något.',
      actionLabel: 'Öppna Hjärtat',
      to: '/hjartat',
      search: '?tab=reflektion',
      tone: 'gold',
    });
  }

  if (ctx.latestKasam && ctx.latestKasam.scores.overall < 55 && level >= 1) {
    const weak = ctx.latestKasam.weakestDimension;
    cards.push({
      id: 'proactive-kasam-weak',
      title: kasamDimensionLabel(weak),
      prompt: `Din senaste KASAM-bild visar lägre ${kasamDimensionLabel(weak).toLowerCase()}. Ett litet steg i kvällskompassen räcker.`,
      actionLabel: 'Kvällskompass',
      to: '/',
      hash: 'compass-evening',
      tone: 'lavender',
    });
  }

  if (shouldShowWeeklyInsight(dayOfWeek) && level >= 2) {
    cards.push({
      id: 'proactive-weekly-insights',
      title: 'Veckoinsikter',
      prompt: 'Mönster-Arkivarien kan sammanfatta din vecka — ett steg i taget, utan att gräva.',
      actionLabel: 'Se veckan',
      to: '/hjartat',
      search: '?tab=reflektion',
      hash: 'veckoinsikter',
      tone: 'emerald',
    });
  }

  if (consumeHamnSaveReminder()) {
    cards.push({
      id: 'proactive-hamn-valv',
      title: 'Hamn → Valv',
      prompt: 'Du var i Hamn. Vill du spara sms eller analys som bevis i Valvet?',
      actionLabel: 'Spara i Valv',
      to: '/valvet',
      search: '?valvMode=spara&vaultTab=logga',
      tone: 'indigo',
    });
  }

  if (flow === 'evening' && ctx.presetId === 'foralder_trygg' && level >= 1) {
    cards.push({
      id: 'proactive-barnfokus',
      title: 'Barnfokus',
      prompt: 'Kväll — en kort fråga till barnen? Lojalitetsfrihet, inget om vuxenkonflikt.',
      actionLabel: 'Familjen',
      to: '/familjen',
      search: '?tab=reflektion',
      tone: 'indigo',
    });
  }

  if (level <= 1) {
    return cards.slice(0, 1);
  }

  return cards.slice(0, 2);
}
