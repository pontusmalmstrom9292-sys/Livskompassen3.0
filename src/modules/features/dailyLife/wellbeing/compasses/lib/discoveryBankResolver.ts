import { DAGLIG_MIX_CARDS } from '@/features/dailyLife/wellbeing/mabra/content/dagligMixCatalog';
import { MABRA_REFLECTION_CARDS } from '@/features/dailyLife/wellbeing/mabra/content/mabraReflectionCards';
import { getMabraPlay } from '@/features/dailyLife/wellbeing/mabra/content/mabraExtendedPlays';
import {
  DISCOVERY_COACH_PLAYS,
  DISCOVERY_COACH_REFLECTIONS,
} from '../content/discoveryCoachBank';

export type DiscoveryResolvedCard = {
  bankId: string;
  content_class: 'REFLECTION' | 'PLAY';
  title_sv?: string;
  body_sv: string;
};

/** Resolve KEEP bankId → parafras-text (ingen LLM). */
export function resolveDiscoveryBankCard(bankId: string): DiscoveryResolvedCard | undefined {
  const dmCard = DAGLIG_MIX_CARDS.find((c) => c.bankId === bankId);
  if (dmCard) {
    return { bankId, content_class: 'REFLECTION', body_sv: dmCard.text_sv };
  }

  const reflection =
    MABRA_REFLECTION_CARDS.find((c) => c.bankId === bankId) ??
    DISCOVERY_COACH_REFLECTIONS.find((c) => c.bankId === bankId);
  if (reflection) {
    return { bankId, content_class: 'REFLECTION', body_sv: reflection.text_sv };
  }

  const play =
    getMabraPlay(bankId) ?? DISCOVERY_COACH_PLAYS.find((p) => p.bankId === bankId);
  if (play) {
    return {
      bankId,
      content_class: 'PLAY',
      title_sv: play.title_sv,
      body_sv: play.rule_sv,
    };
  }

  return undefined;
}
