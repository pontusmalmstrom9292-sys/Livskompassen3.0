import { describe, expect, it } from 'vitest';
import { validateAgreementFileSync } from '@economy/agreements/validateAgreement.node';
import { parseAgreementContent } from '@economy/agreements/validateAgreement';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('validateAgreement', () => {
  it('parsar Livs YAML-fixture', () => {
    const yaml = readFileSync(
      resolve(__dirname, 'livs-livsmedel.yaml'),
      'utf8',
    );
    const parsed = validateAgreementFileSync(yaml, 'livs-livsmedel.yaml');
    expect(parsed.config.id).toBe('SE.livs.livsmedel');
    expect(parsed.config.vacationPayFraction).toBe(0.132);
    expect(parsed.checksum).toHaveLength(64);
  });

  it('parsar JSON med validFrom', () => {
    const json = JSON.stringify({
      id: 'SE.handels',
      name: 'Handels test',
      versionLabel: 'test v2',
      validFrom: '2026-01-01',
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
    });
    const parsed = parseAgreementContent(json, 'handels.json');
    expect(parsed.validFrom).toBe('2026-01-01');
    expect(parsed.config.id).toBe('SE.handels');
  });

  it('ogiltigt id → fel', () => {
    expect(() =>
      parseAgreementContent(JSON.stringify({ id: 'SE.unknown', name: 'x', versionLabel: 'y' }), 'bad.json'),
    ).toThrow(/Ogiltigt avtals-id/);
  });
});
