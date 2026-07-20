/**
 * Kollektivavtal — resolver (inbäddad config + valfri Firestore-pack).
 */
import type { AgreementConfig, AgreementYamlShape, CollectiveAgreementId } from './types';
import type { AgreementPack } from './packTypes';
import { resolveAgreementFromPack, getAgreementMetaFromPack } from './packResolver';

/** Inbäddad config — synkad med agreements/*.yaml */
export const AGREEMENT_EMBEDDED: Record<CollectiveAgreementId, AgreementYamlShape> = {
  'SE.livs.livsmedel': {
    id: 'SE.livs.livsmedel',
    name: 'Livsmedelsavtalet 2025–2027',
    versionLabel: '2025–2027 produktion',
    vacationPayFraction: 0.132,
    vacationDayDivisor: 21.75,
    atfAccrualFraction: 0.0292,
    karensWeeklySickPayFraction: 0.2,
    sickDay2_14EmployerLossFraction: 0.2,
    agsSickTopUpFraction: 0.1,
    agsEnabled: true,
    karensWaiverAfterDays: 10,
    vabNetReplacementFraction: 0.56,
    reSickGapDays: 5,
  },
  'SE.handels': {
    id: 'SE.handels',
    name: 'Handelsavtal (stub)',
    versionLabel: 'stub v1',
    vacationPayFraction: 0.12,
    vacationDayDivisor: 22,
    atfAccrualFraction: 0,
    karensWeeklySickPayFraction: 0.2,
    sickDay2_14EmployerLossFraction: 0.2,
    agsSickTopUpFraction: 0,
    agsEnabled: false,
    karensWaiverAfterDays: 10,
    vabNetReplacementFraction: 0.56,
    reSickGapDays: 5,
  },
  none: {
    id: 'none',
    name: 'Endast lag',
    versionLabel: 'SemL + SFB',
    vacationPayFraction: 0.12,
    vacationDayDivisor: 22,
    atfAccrualFraction: 0,
    karensWeeklySickPayFraction: 0.2,
    sickDay2_14EmployerLossFraction: 0.2,
    agsSickTopUpFraction: 0,
    agsEnabled: false,
    karensWaiverAfterDays: 10,
    vabNetReplacementFraction: 0.56,
    reSickGapDays: 5,
  },
};

function loadAgreementById(id: CollectiveAgreementId): AgreementConfig {
  return { ...AGREEMENT_EMBEDDED[id] };
}

/** Resolver — avtal av ger alltid legal-only oavsett valt id. */
export function resolveAgreementConfig(params: {
  collectiveAgreementEnabled: boolean;
  collectiveAgreementId: CollectiveAgreementId;
  referenceDate?: string;
  userPack?: AgreementPack | null;
}): AgreementConfig {
  if (params.userPack != null || params.referenceDate != null) {
    return resolveAgreementFromPack(params);
  }
  if (!params.collectiveAgreementEnabled) {
    return loadAgreementById('none');
  }
  const id = params.collectiveAgreementId === 'none' ? 'SE.livs.livsmedel' : params.collectiveAgreementId;
  return loadAgreementById(id);
}

export { getAgreementMetaFromPack };

export function getAgreementDisplayName(config: AgreementConfig): string {
  return config.id === 'none' ? 'Endast lag' : `${config.name} (${config.versionLabel})`;
}
