/**
 * Validera kollektivavtal från YAML eller JSON.
 */
import { parse as parseYaml } from 'yaml';
import type { AgreementYamlShape, CollectiveAgreementId } from './types';
import { sha256Hex } from '../checksum';

const VALID_IDS = new Set<CollectiveAgreementId>(['SE.livs.livsmedel', 'SE.handels', 'none']);

const REQUIRED_NUMERIC: (keyof AgreementYamlShape)[] = [
  'vacationPayFraction',
  'vacationDayDivisor',
  'atfAccrualFraction',
  'karensWeeklySickPayFraction',
  'sickDay2_14EmployerLossFraction',
  'agsSickTopUpFraction',
  'karensWaiverAfterDays',
  'vabNetReplacementFraction',
  'reSickGapDays',
];

function isIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function normalizeConfig(raw: Record<string, unknown>): AgreementYamlShape {
  const id = String(raw.id ?? '') as CollectiveAgreementId;
  if (!VALID_IDS.has(id)) {
    throw new Error(`Ogiltigt avtals-id: ${raw.id}. Tillåtna: SE.livs.livsmedel, SE.handels, none`);
  }
  const config: AgreementYamlShape = {
    id,
    name: String(raw.name ?? '').trim(),
    versionLabel: String(raw.versionLabel ?? '').trim(),
    vacationPayFraction: Number(raw.vacationPayFraction),
    vacationDayDivisor: Number(raw.vacationDayDivisor),
    atfAccrualFraction: Number(raw.atfAccrualFraction),
    karensWeeklySickPayFraction: Number(raw.karensWeeklySickPayFraction),
    sickDay2_14EmployerLossFraction: Number(raw.sickDay2_14EmployerLossFraction),
    agsSickTopUpFraction: Number(raw.agsSickTopUpFraction),
    agsEnabled: Boolean(raw.agsEnabled),
    karensWaiverAfterDays: Number(raw.karensWaiverAfterDays),
    vabNetReplacementFraction: Number(raw.vabNetReplacementFraction),
    reSickGapDays: Number(raw.reSickGapDays),
  };
  if (!config.name || !config.versionLabel) {
    throw new Error('Avtalet måste ha name och versionLabel.');
  }
  for (const key of REQUIRED_NUMERIC) {
    const val = config[key];
    if (typeof val !== 'number' || Number.isNaN(val)) {
      throw new Error(`Ogiltigt värde för ${key}.`);
    }
  }
  return config;
}

export type ParsedAgreementFile = {
  config: AgreementYamlShape;
  validFrom: string;
  validTo?: string;
  checksum: string;
};

export function parseAgreementContent(
  content: string,
  fileName: string,
): Omit<ParsedAgreementFile, 'checksum'> & { checksum?: string } {
  const lower = fileName.toLowerCase();
  let raw: Record<string, unknown>;
  try {
    if (lower.endsWith('.yaml') || lower.endsWith('.yml')) {
      raw = parseYaml(content) as Record<string, unknown>;
    } else if (lower.endsWith('.json')) {
      raw = JSON.parse(content) as Record<string, unknown>;
    } else {
      throw new Error('Filen måste vara .yaml, .yml eller .json.');
    }
  } catch {
    throw new Error('Filen saknar rätt format.');
  }
  if (!raw || typeof raw !== 'object') {
    throw new Error('Filen saknar rätt format.');
  }
  const config = normalizeConfig(raw);
  const validFrom = raw.validFrom != null ? String(raw.validFrom) : '2000-01-01';
  const validTo = raw.validTo != null ? String(raw.validTo) : undefined;
  if (!isIsoDate(validFrom)) {
    throw new Error('validFrom måste vara YYYY-MM-DD.');
  }
  if (validTo != null && !isIsoDate(validTo)) {
    throw new Error('validTo måste vara YYYY-MM-DD.');
  }
  return { config, validFrom, validTo };
}

export async function validateAgreementFile(content: string, fileName: string): Promise<ParsedAgreementFile> {
  const parsed = parseAgreementContent(content, fileName);
  const checksum = await sha256Hex({ config: parsed.config, validFrom: parsed.validFrom, validTo: parsed.validTo });
  return { ...parsed, checksum };
}
