/**
 * generatePayslipInternal — utökad profil + lineItems WORM + payroll packs.
 */
import { admin } from '../lib/firebaseAdmin';
import {
  buildMonthlyPayslip,
  getPayslipPeriodForPayday,
  type PayslipResult,
} from './vendor/generatePayslipCore';
import { defaultPayProfileSettings, type PayProfileSettings } from './vendor/payProfileContext';
import type { TimeEntryLike } from './vendor/payTimeRules';
import type { AgreementPack, TaxTablePack } from './vendor/packTypes';
import type { AgreementYamlShape, CollectiveAgreementId } from '../../../shared/economy/agreements/types';
import { sha256HexSync, PAYROLL_ENGINE_VERSION } from './vendor/checksum';

const COLLECTION = 'payslip_snapshots';
const TIME_ENTRIES = 'time_entries';
const ECONOMY_PROFILES = 'economy_profiles';
const AGREEMENT_PACKS = 'payroll_agreement_packs';
const TAX_TABLE_PACKS = 'payroll_tax_table_packs';

function mapTimeEntry(id: string, data: FirebaseFirestore.DocumentData): TimeEntryLike {
  const clockOutRaw = data.clockOut;
  const clockOut =
    clockOutRaw != null && String(clockOutRaw).trim() !== '' ? String(clockOutRaw) : null;
  return {
    date: String(data.date ?? ''),
    clockIn: String(data.clockIn ?? '00:00'),
    clockOut,
    category: String(data.category ?? 'Arbete'),
    breakMinutes: Number(data.breakMinutes ?? 30),
    scopePercent: Number(data.scopePercent ?? 100),
    hoursWorked: Number(data.hoursWorked ?? 0),
  };
}

async function loadTimeEntries(uid: string): Promise<TimeEntryLike[]> {
  const snap = await admin
    .firestore()
    .collection(TIME_ENTRIES)
    .where('ownerId', '==', uid)
    .get();
  return snap.docs.map((d) => mapTimeEntry(d.id, d.data()));
}

function mapAgreementPack(id: string, data: FirebaseFirestore.DocumentData): AgreementPack {
  const config = data.config as AgreementYamlShape;
  return {
    id,
    agreementId: String(data.agreementId ?? config?.id ?? 'none') as CollectiveAgreementId,
    config,
    validFrom: String(data.validFrom ?? '2000-01-01'),
    validTo: data.validTo != null ? String(data.validTo) : undefined,
    versionLabel: String(data.versionLabel ?? config?.versionLabel ?? ''),
    checksum: String(data.checksum ?? ''),
    sourceFileName: String(data.sourceFileName ?? ''),
    uploadedAt: '',
  };
}

function mapTaxTablePack(id: string, data: FirebaseFirestore.DocumentData): TaxTablePack {
  return {
    id,
    table: Number(data.table ?? 32),
    year: Number(data.year ?? 2026),
    brackets: Array.isArray(data.brackets)
      ? (data.brackets as Array<{ min: number; max: number; col1: number }>)
      : [],
    source: data.source != null ? String(data.source) : undefined,
    checksum: String(data.checksum ?? ''),
    sourceFileName: String(data.sourceFileName ?? ''),
    uploadedAt: '',
  };
}

async function loadAgreementPack(packId: string | null | undefined): Promise<AgreementPack | null> {
  if (!packId) return null;
  const snap = await admin.firestore().collection(AGREEMENT_PACKS).doc(packId).get();
  if (!snap.exists) return null;
  return mapAgreementPack(snap.id, snap.data()!);
}

async function loadTaxTablePack(packId: string | null | undefined): Promise<TaxTablePack | null> {
  if (!packId) return null;
  const snap = await admin.firestore().collection(TAX_TABLE_PACKS).doc(packId).get();
  if (!snap.exists) return null;
  return mapTaxTablePack(snap.id, snap.data()!);
}

function mapPayProfile(
  data: FirebaseFirestore.DocumentData | undefined,
  packs: { agreementPack: AgreementPack | null; taxTablePack: TaxTablePack | null },
): PayProfileSettings {
  const defaults = defaultPayProfileSettings();
  if (!data) return defaults;

  const salaryTermsRaw = data.salaryTerms;
  const salaryTerms = Array.isArray(salaryTermsRaw) && salaryTermsRaw.length > 0
    ? salaryTermsRaw.map((t: { effectiveFrom?: string; monthlySalarySek?: number }) => ({
        effectiveFrom: String(t.effectiveFrom ?? '2000-01-01'),
        monthlySalarySek: Number(t.monthlySalarySek ?? 0) || defaults.salaryTerms[0].monthlySalarySek,
      }))
    : data.monthlySalarySek
      ? [{ effectiveFrom: '2000-01-01', monthlySalarySek: Number(data.monthlySalarySek) }]
      : defaults.salaryTerms;

  const taxColumnRaw = Number(data.taxColumn ?? 1);
  const taxColumn = ([1, 2, 3, 4] as const).includes(taxColumnRaw as 1)
    ? (taxColumnRaw as 1 | 2 | 3 | 4)
    : 1;

  return {
    salaryTerms,
    collectiveAgreementEnabled: Boolean(
      data.collectiveAgreementEnabled ?? data.collectiveAgreement?.enabled ?? true,
    ),
    collectiveAgreementId:
      (data.collectiveAgreementId as PayProfileSettings['collectiveAgreementId']) ??
      (data.collectiveAgreement?.id as PayProfileSettings['collectiveAgreementId']) ??
      defaults.collectiveAgreementId,
    taxTable: Number(data.taxTable ?? 32),
    taxColumn,
    taxYear: Number(data.taxYear ?? 2026),
    activeAgreementPack: packs.agreementPack,
    activeTaxTablePack: packs.taxTablePack,
  };
}

async function loadPayProfileSettings(uid: string): Promise<PayProfileSettings> {
  const prof = await admin.firestore().collection(ECONOMY_PROFILES).doc(uid).get();
  const data = prof.exists ? prof.data() : undefined;
  const [agreementPack, taxTablePack] = await Promise.all([
    loadAgreementPack(data?.activeAgreementPackId as string | undefined),
    loadTaxTablePack(data?.activeTaxTablePackId as string | undefined),
  ]);
  return mapPayProfile(data, { agreementPack, taxTablePack });
}

export type GeneratePayslipOptions = {
  referenceDate?: Date;
  period?: { from: string; to: string };
};

export async function generatePayslipInternal(
  uid: string,
  options: GeneratePayslipOptions = {},
): Promise<{ payslipId: string; result: PayslipResult }> {
  const referenceDate = options.referenceDate ?? new Date();
  const period = options.period
    ? {
        from: options.period.from,
        to: options.period.to,
        label: `${options.period.from} – ${options.period.to}`,
      }
    : getPayslipPeriodForPayday(referenceDate);

  const [entries, profileSettings] = await Promise.all([
    loadTimeEntries(uid),
    loadPayProfileSettings(uid),
  ]);

  const result = buildMonthlyPayslip({
    entries,
    period,
    profileSettings,
    referenceDate,
  });

  const payslipId = `${uid}_${period.from}_${period.to}`;
  const ref = admin.firestore().collection(COLLECTION).doc(payslipId);

  const existing = await ref.get();
  if (existing.exists) {
    console.log(`[generatePayslip] Snapshot finns redan: ${payslipId}`);
    return { payslipId, result };
  }

  const agreementPackChecksum = result.agreementMeta.checksum ?? 'embedded';
  const taxTablePackChecksum = result.taxMeta.checksum ?? 'embedded';
  const calculationChecksum = sha256HexSync({
    period,
    taxableGrossSek: result.taxableGrossSek,
    taxSek: result.taxSek,
    totalToBankSek: result.totalToBankSek,
    agreementPackChecksum,
    taxTablePackChecksum,
    engine: PAYROLL_ENGINE_VERSION,
  });

  await ref.set({
    ownerId: uid,
    userId: uid,
    payslipId,
    periodFrom: period.from,
    periodTo: period.to,
    periodLabel: period.label,
    baseSalarySek: result.baseSalarySek,
    grossBeforeDeductionsSek: result.grossBeforeDeductionsSek,
    absenceDeductionSek: result.absenceDeductionSek,
    taxableGrossSek: result.taxableGrossSek,
    taxSek: result.taxSek,
    netSalarySek: result.netSalarySek,
    employerNetSek: result.employerNetSek,
    fkTotalSek: result.fkTotalSek,
    agsTotalSek: result.agsTotalSek,
    totalToBankSek: result.totalToBankSek,
    expectedIncomeAdjustmentSek: result.expectedIncomeAdjustmentSek,
    hourlyRateSek: result.hourlyRateSek,
    pbb2026Sek: result.pbb2026Sek,
    karensDaysLast365: result.karensDaysLast365,
    karensWaived: result.karensWaived,
    absenceLines: result.absenceLines,
    lineItems: result.lineItems,
    agreementMeta: result.agreementMeta,
    taxMeta: result.taxMeta,
    obSupplementSek: result.obSupplementSek,
    otSupplementSek: result.otSupplementSek,
    vacationAccrualSek: result.vacationAccrualSek,
    atfAccrualSek: result.atfAccrualSek,
    taxTable: result.taxMeta.table,
    taxColumn: result.taxMeta.column,
    agreementPackChecksum,
    taxTablePackChecksum,
    calculationChecksum,
    engineVersion: PAYROLL_ENGINE_VERSION,
    isLocked: true,
    status: 'ready',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log(
    `[generatePayslip] uid=${uid} period=${period.label} total=${result.totalToBankSek} employer=${result.employerNetSek} fk=${result.fkTotalSek}`,
  );

  return { payslipId, result };
}

/** Schemalagd körning: alla economy_profiles. */
export async function generatePayslipsForAllProfiles(referenceDate = new Date()): Promise<number> {
  const snap = await admin.firestore().collection(ECONOMY_PROFILES).get();
  let count = 0;
  for (const doc of snap.docs) {
    const uid = doc.id;
    if (doc.data()?.ownerId && doc.data().ownerId !== uid) continue;
    try {
      await generatePayslipInternal(uid, { referenceDate });
      count += 1;
    } catch (err) {
      console.error(`[generatePayslip] uid=${uid} fel:`, err);
    }
  }
  if (count === 0) {
    const envUid = process.env.PAYSLIP_DEFAULT_UID;
    if (envUid) {
      await generatePayslipInternal(envUid, { referenceDate });
      count = 1;
    }
  }
  return count;
}
