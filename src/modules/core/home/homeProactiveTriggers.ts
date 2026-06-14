import type { EvolutionHubDoc } from '@/core/types/firestore';
import { getDefaultCompassByTime } from '@/features/dailyLife/wellbeing/compasses/utils/compassTime';
import type { AdaptiveMemoryCard } from './compassAdaptiveCards';

export type ProactiveTriggerContext = {
  evolutionDoc: EvolutionHubDoc | null;
  hasJournalToday: boolean;
  presetId: string;
};

const HAMN_SESSION_KEY = 'livskompassen_hamn_session_open_v1';

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

/**
 * evolution_hub-triggers — ett kort i taget, kapacitetsmedvetet (Fas 4).
 */
export function buildProactiveTriggerCards(ctx: ProactiveTriggerContext): AdaptiveMemoryCard[] {
  const cards: AdaptiveMemoryCard[] = [];
  const flow = getDefaultCompassByTime();
  const level = cognitiveLevel(ctx.evolutionDoc);

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
