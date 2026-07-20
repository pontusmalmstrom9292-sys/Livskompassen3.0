import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FirebaseError } from 'firebase/app';
import {
  appendPayrollAgreementPack,
  appendPayrollTaxTablePack,
  getActivePayrollPacks,
  getEconomyProfileExtended,
  setActivePayrollPackPointers,
  setPayProfileSettings,
} from '@/core/firebase/economyFirestore';
import { getAllTimeEntriesForEconomyReadOnly } from '@/core/firebase/arbetslivFirestore';
import {
  defaultPayProfileSettings,
  type CollectiveAgreementId,
  type PayProfileSettings,
  type TaxColumn,
} from '@/features/dailyLife/wellbeing/economy/rules/payProfileContext';
import { recomputePayProfilePreview } from '@/features/dailyLife/wellbeing/economy/rules/generatePayslipCore';
import type { TimeEntryLike } from '@/features/dailyLife/wellbeing/economy/rules/payTimeRules';
import type { AgreementPack, TaxTablePack } from '@economy/agreements/packTypes';
import { validateAgreementFile } from '@economy/agreements/validateAgreement';
import { validateTaxTableFile } from '@economy/validateTaxTableFile';
import {
  isBrowserOffline,
  OfflineWriteBlockedError,
} from '@/core/firebase/offlineWritePolicy';
import { formatDateLocal } from '@/shared/utils/dateHelpers';

function toTimeEntryLike(row: {
  date: string;
  clockIn: string;
  clockOut?: string | null;
  category: string;
  breakMinutes: number;
  scopePercent: number;
  hoursWorked: number;
}): TimeEntryLike {
  return {
    date: row.date,
    clockIn: row.clockIn,
    clockOut: row.clockOut ?? null,
    category: row.category,
    breakMinutes: row.breakMinutes,
    scopePercent: row.scopePercent,
    hoursWorked: row.hoursWorked,
  };
}

async function readFileText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(new Error('Kunde inte läsa filen.'));
    reader.readAsText(file);
  });
}

export function usePayProfileSettings(userId: string | undefined) {
  const defaults = defaultPayProfileSettings();
  const [salaryTerms, setSalaryTerms] = useState(defaults.salaryTerms);
  const [collectiveAgreementEnabled, setCollectiveAgreementEnabled] = useState(
    defaults.collectiveAgreementEnabled,
  );
  const [collectiveAgreementId, setCollectiveAgreementId] = useState<CollectiveAgreementId>(
    defaults.collectiveAgreementId,
  );
  const [taxTable, setTaxTable] = useState(String(defaults.taxTable));
  const [taxColumn, setTaxColumn] = useState<TaxColumn>(defaults.taxColumn);
  const [taxYear, setTaxYear] = useState(2026);
  const [activeAgreementPack, setActiveAgreementPack] = useState<AgreementPack | null>(null);
  const [activeTaxTablePack, setActiveTaxTablePack] = useState<TaxTablePack | null>(null);
  const [newSalaryFrom, setNewSalaryFrom] = useState(formatDateLocal());
  const [newSalaryAmount, setNewSalaryAmount] = useState('');
  const [timeEntries, setTimeEntries] = useState<TimeEntryLike[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAgreement, setUploadingAgreement] = useState(false);
  const [uploadingTax, setUploadingTax] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [uploadConfirmMessage, setUploadConfirmMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploadFlashTimer = useRef<number | null>(null);

  const reload = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const [profile, entries] = await Promise.all([
        getEconomyProfileExtended(userId),
        getAllTimeEntriesForEconomyReadOnly(userId),
      ]);
      const terms =
        profile.salaryTerms.length > 0
          ? profile.salaryTerms
          : profile.monthlySalarySek > 0
            ? [{ effectiveFrom: '2000-01-01', monthlySalarySek: profile.monthlySalarySek }]
            : defaults.salaryTerms;
      setSalaryTerms(terms);
      setCollectiveAgreementEnabled(profile.collectiveAgreementEnabled);
      setCollectiveAgreementId(profile.collectiveAgreementId);
      setTaxTable(String(profile.taxTable));
      setTaxColumn(profile.taxColumn);
      setTaxYear(profile.taxYear ?? 2026);

      const packs = await getActivePayrollPacks(profile);
      setActiveAgreementPack(packs.agreementPack);
      setActiveTaxTablePack(packs.taxTablePack);
      setTimeEntries(entries.map(toTimeEntryLike));
    } catch {
      setError('Kunde inte läsa löneinställningar.');
    } finally {
      setLoading(false);
    }
  }, [userId, defaults.salaryTerms]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(
    () => () => {
      if (uploadFlashTimer.current != null) {
        window.clearTimeout(uploadFlashTimer.current);
      }
    },
    [],
  );

  const showUploadConfirm = useCallback((message: string) => {
    setUploadConfirmMessage(message);
    if (uploadFlashTimer.current != null) {
      window.clearTimeout(uploadFlashTimer.current);
    }
    uploadFlashTimer.current = window.setTimeout(() => setUploadConfirmMessage(null), 4000);
  }, []);

  const activeMonthlySalary = useMemo(() => {
    const sorted = [...salaryTerms].sort((a, b) => b.effectiveFrom.localeCompare(a.effectiveFrom));
    return sorted[0]?.monthlySalarySek ?? defaults.salaryTerms[0].monthlySalarySek;
  }, [salaryTerms, defaults.salaryTerms]);

  const draftSettings: PayProfileSettings = useMemo(
    () => ({
      salaryTerms,
      collectiveAgreementEnabled,
      collectiveAgreementId,
      taxTable: Number(taxTable) || 32,
      taxColumn,
      taxYear,
      activeAgreementPack,
      activeTaxTablePack,
    }),
    [
      salaryTerms,
      collectiveAgreementEnabled,
      collectiveAgreementId,
      taxTable,
      taxColumn,
      taxYear,
      activeAgreementPack,
      activeTaxTablePack,
    ],
  );

  const preview = useMemo(
    () => recomputePayProfilePreview(draftSettings, timeEntries),
    [draftSettings, timeEntries],
  );

  const persist = useCallback(async (): Promise<boolean> => {
    if (!userId) return false;
    setSaving(true);
    setError(null);
    setSavedFlash(false);
    try {
      if (isBrowserOffline()) {
        throw new OfflineWriteBlockedError('economy_profiles');
      }
      await setPayProfileSettings(userId, draftSettings);
      setSavedFlash(true);
      window.setTimeout(() => setSavedFlash(false), 2000);
      return true;
    } catch (err: unknown) {
      if (err instanceof OfflineWriteBlockedError) {
        setError(err.message);
      } else if (err instanceof FirebaseError && err.code === 'permission-denied') {
        setError('Behörighet saknas — logga in igen.');
      } else {
        setError('Kunde inte spara löneinställningar.');
      }
      return false;
    } finally {
      setSaving(false);
    }
  }, [userId, draftSettings]);

  const uploadAgreementFile = useCallback(
    async (file: File): Promise<boolean> => {
      if (!userId) return false;
      setUploadingAgreement(true);
      setError(null);
      try {
        if (isBrowserOffline()) {
          throw new OfflineWriteBlockedError('payroll_agreement_packs');
        }
        const content = await readFileText(file);
        const parsed = await validateAgreementFile(content, file.name);
        const packId = await appendPayrollAgreementPack(userId, {
          agreementId: parsed.config.id,
          config: parsed.config,
          validFrom: parsed.validFrom,
          validTo: parsed.validTo,
          versionLabel: parsed.config.versionLabel,
          checksum: parsed.checksum,
          sourceFileName: file.name,
        });
        await setActivePayrollPackPointers(userId, {
          activeAgreementPackId: packId,
          collectiveAgreementId: parsed.config.id,
          collectiveAgreementEnabled: parsed.config.id !== 'none',
        });
        const pack: AgreementPack = {
          id: packId,
          agreementId: parsed.config.id,
          config: parsed.config,
          validFrom: parsed.validFrom,
          validTo: parsed.validTo,
          versionLabel: parsed.config.versionLabel,
          checksum: parsed.checksum,
          sourceFileName: file.name,
          uploadedAt: new Date().toISOString(),
        };
        setActiveAgreementPack(pack);
        setCollectiveAgreementId(parsed.config.id);
        setCollectiveAgreementEnabled(parsed.config.id !== 'none');
        showUploadConfirm(
          `Avtal bytt till ${parsed.config.name} ${parsed.config.versionLabel}`,
        );
        return true;
      } catch (err: unknown) {
        if (err instanceof OfflineWriteBlockedError) {
          setError(err.message);
        } else if (err instanceof Error && err.message) {
          setError(err.message);
        } else {
          setError('Filen saknar rätt format.');
        }
        return false;
      } finally {
        setUploadingAgreement(false);
      }
    },
    [userId, showUploadConfirm],
  );

  const uploadTaxTableFile = useCallback(
    async (file: File): Promise<boolean> => {
      if (!userId) return false;
      setUploadingTax(true);
      setError(null);
      try {
        if (isBrowserOffline()) {
          throw new OfflineWriteBlockedError('payroll_tax_table_packs');
        }
        const content = await readFileText(file);
        const parsed = await validateTaxTableFile(content, file.name);
        const packId = await appendPayrollTaxTablePack(userId, {
          table: parsed.table,
          year: parsed.year,
          brackets: parsed.brackets,
          source: parsed.source,
          checksum: parsed.checksum,
          sourceFileName: file.name,
        });
        await setActivePayrollPackPointers(userId, {
          activeTaxTablePackId: packId,
          taxYear: parsed.year,
          taxTable: parsed.table,
        });
        const pack: TaxTablePack = {
          id: packId,
          table: parsed.table,
          year: parsed.year,
          brackets: parsed.brackets,
          source: parsed.source,
          checksum: parsed.checksum,
          sourceFileName: file.name,
          uploadedAt: new Date().toISOString(),
        };
        setActiveTaxTablePack(pack);
        setTaxTable(String(parsed.table));
        setTaxYear(parsed.year);
        showUploadConfirm(`Skattetabell ${parsed.table} (${parsed.year}) uppladdad`);
        return true;
      } catch (err: unknown) {
        if (err instanceof OfflineWriteBlockedError) {
          setError(err.message);
        } else if (err instanceof Error && err.message) {
          setError(err.message);
        } else {
          setError('Filen saknar rätt format.');
        }
        return false;
      } finally {
        setUploadingTax(false);
      }
    },
    [userId, showUploadConfirm],
  );

  const appendSalaryTerm = useCallback(() => {
    const amount = Number(newSalaryAmount);
    if (!amount || amount <= 0 || !newSalaryFrom) return;
    setSalaryTerms((prev) => {
      const filtered = prev.filter((t) => t.effectiveFrom !== newSalaryFrom);
      return [...filtered, { effectiveFrom: newSalaryFrom, monthlySalarySek: Math.round(amount) }].sort(
        (a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom),
      );
    });
    setNewSalaryAmount('');
  }, [newSalaryAmount, newSalaryFrom]);

  const setPrimarySalary = useCallback((monthlySalarySek: number) => {
    setSalaryTerms((prev) => {
      const rest = prev.filter((t) => t.effectiveFrom !== '2000-01-01');
      return [{ effectiveFrom: '2000-01-01', monthlySalarySek }, ...rest];
    });
  }, []);

  return {
    salaryTerms,
    activeMonthlySalary,
    collectiveAgreementEnabled,
    setCollectiveAgreementEnabled,
    collectiveAgreementId,
    setCollectiveAgreementId,
    taxTable,
    setTaxTable,
    taxColumn,
    setTaxColumn,
    taxYear,
    newSalaryFrom,
    setNewSalaryFrom,
    newSalaryAmount,
    setNewSalaryAmount,
    appendSalaryTerm,
    setPrimarySalary,
    preview,
    loading,
    saving,
    uploadingAgreement,
    uploadingTax,
    uploadConfirmMessage,
    uploadAgreementFile,
    uploadTaxTableFile,
    savedFlash,
    error,
    clearError: () => setError(null),
    persist,
    reload,
  };
}
