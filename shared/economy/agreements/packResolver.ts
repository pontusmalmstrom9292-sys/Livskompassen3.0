/**
 * Välj aktiv agreement pack — validFrom/validTo + Firestore vinner över embedded.
 */
import type { AgreementConfig, CollectiveAgreementId } from './types';
import type { AgreementPack } from './packTypes';
import { AGREEMENT_EMBEDDED } from './resolver';

function yamlToConfig(pack: AgreementPack): AgreementConfig {
  return { ...pack.config };
}

function isPackActiveOnDate(pack: AgreementPack, dateIso: string): boolean {
  if (pack.validFrom > dateIso) return false;
  if (pack.validTo != null && pack.validTo < dateIso) return false;
  return true;
}

/** Resolver med valfri användar-pack (Firestore) som vinner över inbäddad config. */
export function resolveAgreementFromPack(params: {
  collectiveAgreementEnabled: boolean;
  collectiveAgreementId: CollectiveAgreementId;
  referenceDate?: string;
  userPack?: AgreementPack | null;
}): AgreementConfig {
  const dateIso = params.referenceDate ?? new Date().toISOString().slice(0, 10);

  if (!params.collectiveAgreementEnabled) {
    return yamlToConfig({
      id: 'embedded-none',
      agreementId: 'none',
      config: AGREEMENT_EMBEDDED.none,
      validFrom: '2000-01-01',
      versionLabel: AGREEMENT_EMBEDDED.none.versionLabel,
      checksum: '',
      sourceFileName: '',
      uploadedAt: '',
    });
  }

  const id =
    params.collectiveAgreementId === 'none' ? 'SE.livs.livsmedel' : params.collectiveAgreementId;

  const pack = params.userPack;
  if (
    pack &&
    pack.agreementId === id &&
    isPackActiveOnDate(pack, dateIso)
  ) {
    return yamlToConfig(pack);
  }

  return { ...AGREEMENT_EMBEDDED[id] };
}

export function getAgreementMetaFromPack(
  config: AgreementConfig,
  userPack?: AgreementPack | null,
): { versionLabel: string; checksum: string } {
  if (userPack && userPack.config.id === config.id) {
    return { versionLabel: userPack.versionLabel, checksum: userPack.checksum };
  }
  return { versionLabel: config.versionLabel, checksum: 'embedded' };
}
