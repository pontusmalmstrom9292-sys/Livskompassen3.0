import { describe, expect, it } from 'vitest';
import { resolveAgreementConfig, getAgreementDisplayName } from '@economy/agreements/resolver';
import type { AgreementPack } from '@economy/agreements/packTypes';
import { AGREEMENT_EMBEDDED } from '@economy/agreements/resolver';

describe('agreementResolver', () => {
  it('Livs avtal på — semester 13,2 % och AGS', () => {
    const cfg = resolveAgreementConfig({
      collectiveAgreementEnabled: true,
      collectiveAgreementId: 'SE.livs.livsmedel',
    });
    expect(cfg.vacationPayFraction).toBe(0.132);
    expect(cfg.agsEnabled).toBe(true);
    expect(cfg.agsSickTopUpFraction).toBe(0.1);
    expect(getAgreementDisplayName(cfg)).toContain('Livsmedelsavtalet');
  });

  it('avtal av — endast lag', () => {
    const cfg = resolveAgreementConfig({
      collectiveAgreementEnabled: false,
      collectiveAgreementId: 'SE.livs.livsmedel',
    });
    expect(cfg.id).toBe('none');
    expect(cfg.vacationPayFraction).toBe(0.12);
    expect(cfg.agsEnabled).toBe(false);
  });

  it('Handels stub', () => {
    const cfg = resolveAgreementConfig({
      collectiveAgreementEnabled: true,
      collectiveAgreementId: 'SE.handels',
    });
    expect(cfg.id).toBe('SE.handels');
    expect(cfg.atfAccrualFraction).toBe(0);
  });

  it('Firestore-pack vinner med ny semester %', () => {
    const userPack: AgreementPack = {
      id: 'test-pack',
      agreementId: 'SE.livs.livsmedel',
      config: {
        ...AGREEMENT_EMBEDDED['SE.livs.livsmedel'],
        vacationPayFraction: 0.14,
        versionLabel: 'upload v2027',
      },
      validFrom: '2026-01-01',
      versionLabel: 'upload v2027',
      checksum: 'abc',
      sourceFileName: 'livs.yaml',
      uploadedAt: '2026-07-01',
    };
    const cfg = resolveAgreementConfig({
      collectiveAgreementEnabled: true,
      collectiveAgreementId: 'SE.livs.livsmedel',
      referenceDate: '2026-06-01',
      userPack,
    });
    expect(cfg.vacationPayFraction).toBe(0.14);
    expect(cfg.versionLabel).toBe('upload v2027');
  });

  it('pack utanför validFrom → embedded', () => {
    const userPack: AgreementPack = {
      id: 'future',
      agreementId: 'SE.livs.livsmedel',
      config: { ...AGREEMENT_EMBEDDED['SE.livs.livsmedel'], vacationPayFraction: 0.99 },
      validFrom: '2027-01-01',
      versionLabel: 'future',
      checksum: 'x',
      sourceFileName: 'f.yaml',
      uploadedAt: '',
    };
    const cfg = resolveAgreementConfig({
      collectiveAgreementEnabled: true,
      collectiveAgreementId: 'SE.livs.livsmedel',
      referenceDate: '2026-06-01',
      userPack,
    });
    expect(cfg.vacationPayFraction).toBe(0.132);
  });
});
