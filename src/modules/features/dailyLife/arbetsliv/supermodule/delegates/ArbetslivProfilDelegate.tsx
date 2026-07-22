import { AlertTriangle, Check, FileUp, Loader2, Plus } from 'lucide-react';
import { useEffect, useRef, type ChangeEvent, type FormEvent } from 'react';
import { EmptyState } from '@/core/ui/EmptyState';
import { Button, Input } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { usePayProfileSettings } from '../../hooks/usePayProfileSettings';
import type { CollectiveAgreementId } from '@/features/dailyLife/wellbeing/economy/rules/payProfileContext';

const AGREEMENT_OPTIONS: { id: CollectiveAgreementId; label: string }[] = [
  { id: 'SE.livs.livsmedel', label: 'Livs Livsmedelsavtalet 2025–2027' },
  { id: 'SE.handels', label: 'Handels (stub)' },
];

function formatSek(value: number): string {
  return `${Math.round(value).toLocaleString('sv-SE')} kr`;
}

/** Lönekontor — tre primära inställningar + uppladdning + preview. */
export function ArbetslivProfilDelegate() {
  const user = useStore((s) => s.user);
  const hasUser = Boolean(user?.uid);
  const agreementInputRef = useRef<HTMLInputElement>(null);
  const taxInputRef = useRef<HTMLInputElement>(null);

  const {
    activeMonthlySalary,
    collectiveAgreementEnabled,
    setCollectiveAgreementEnabled,
    collectiveAgreementId,
    setCollectiveAgreementId,
    taxTable,
    setTaxTable,
    taxColumn,
    setTaxColumn,
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
    clearError,
    persist,
  } = usePayProfileSettings(hasUser ? user!.uid : undefined);

  useEffect(() => () => clearError(), [clearError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!hasUser || loading || saving) return;
    clearError();
    await persist();
  };

  const handleAgreementPick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    clearError();
    void uploadAgreementFile(file);
  };

  const handleTaxPick = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    clearError();
    void uploadTaxTableFile(file);
  };

  const profile = preview.profile;
  const isUploadBusy = uploadingAgreement || uploadingTax;

  return (
    <div
      className="arbetsliv-delegate arbetsliv-delegate--lonest overflow-hidden rounded-2xl border border-border-strong bg-surface/25 p-1"
      data-write-target="economy_profiles"
    >
      <div className="space-y-4 p-3 sm:p-4">
        <header className="space-y-1">
          <p className="font-display-serif text-xs uppercase tracking-[0.2em] text-accent">
            Lönekontor
          </p>
          <p className="text-xs leading-relaxed text-text-muted">
            Ändra bara lön, kollektivavtal och skatt — timlön, SGI och spec räknas om automatiskt.
          </p>
        </header>

        {!hasUser ? (
          <EmptyState
            title="Lönekontor"
            message="Logga in för att ställa in lön, kollektivavtal och skatt."
          />
        ) : loading ? (
          <p className="flex items-center gap-2 text-sm text-text-muted" aria-busy="true">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            Laddar löneprofil…
          </p>
        ) : (
          <form className="space-y-4" onSubmit={(e) => void handleSubmit(e)} aria-label="Löneinställningar">
            <BentoCard title="Dina tre inställningar" glow="gold" className="space-y-4">
              <label className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-wider text-text-muted">
                  Grundlön (kr/mån)
                </span>
                <Input
                  type="number"
                  min={0}
                  step={100}
                  className="input-glass min-h-11 tabular-nums focus-visible:ring-2 focus-visible:ring-accent/40"
                  value={activeMonthlySalary}
                  onChange={(e) => {
                    setPrimarySalary(Number(e.target.value) || 0);
                    clearError();
                  }}
                  aria-label="Grundlön per månad"
                />
              </label>

              <div className="rounded-xl border border-border/60 bg-surface/40 p-3">
                <p className="mb-2 text-[10px] uppercase tracking-wider text-text-muted">
                  Ny lön från datum
                </p>
                <div className="flex flex-wrap gap-2">
                  <Input
                    type="date"
                    className="input-glass min-w-[9rem] flex-1"
                    value={newSalaryFrom}
                    onChange={(e) => setNewSalaryFrom(e.target.value)}
                    aria-label="Datum för ny lön"
                  />
                  <Input
                    type="number"
                    min={0}
                    step={100}
                    className="input-glass min-w-[7rem] flex-1 tabular-nums"
                    placeholder="Ny lön"
                    value={newSalaryAmount}
                    onChange={(e) => setNewSalaryAmount(e.target.value)}
                    aria-label="Ny månadslön"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="shrink-0 min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    onClick={() => appendSalaryTerm()}
                    aria-label="Lägg till lön från datum"
                  >
                    <Plus className="h-4 w-4" aria-hidden />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-surface/40 px-3 py-2">
                <div>
                  <p className="text-sm text-text">Kollektivavtal</p>
                  <p className="text-[10px] text-text-muted">Av = endast lag (12 % semester, ingen AGS)</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={collectiveAgreementEnabled}
                  className={`relative h-7 w-12 rounded-full transition-colors ${collectiveAgreementEnabled ? 'bg-accent/80' : 'bg-surface-elevated'} min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40`}
                  onClick={() => setCollectiveAgreementEnabled(!collectiveAgreementEnabled)}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${collectiveAgreementEnabled ? 'translate-x-5' : 'translate-x-0.5'}`}
                  />
                </button>
              </div>

              {collectiveAgreementEnabled ? (
                <label className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted">Avtal</span>
                  <select
                    className="input-glass w-full"
                    value={collectiveAgreementId}
                    onChange={(e) => setCollectiveAgreementId(e.target.value as CollectiveAgreementId)}
                  >
                    {AGREEMENT_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              <div className="flex flex-wrap gap-3">
                <label className="flex min-w-[6rem] flex-1 flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted">Skattetabell</span>
                  <Input
                    type="number"
                    min={1}
                    className="input-glass tabular-nums"
                    value={taxTable}
                    onChange={(e) => setTaxTable(e.target.value)}
                  />
                </label>
                <label className="flex min-w-[6rem] flex-1 flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-wider text-text-muted">Kolumn</span>
                  <select
                    className="input-glass w-full"
                    value={taxColumn}
                    onChange={(e) => setTaxColumn(Number(e.target.value) as 1 | 2 | 3 | 4)}
                  >
                    {[1, 2, 3, 4].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </BentoCard>

            <BentoCard title="Uppdatera underlag" glow="gold" className="space-y-3">
              <input
                ref={agreementInputRef}
                type="file"
                accept=".yaml,.yml,.json,application/json"
                className="sr-only"
                aria-hidden
                tabIndex={-1}
                onChange={handleAgreementPick}
              />
              <input
                ref={taxInputRef}
                type="file"
                accept=".json,application/json"
                className="sr-only"
                aria-hidden
                tabIndex={-1}
                onChange={handleTaxPick}
              />

              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="secondary"
                  className="min-h-11 flex-1 gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  disabled={isUploadBusy}
                  onClick={() => agreementInputRef.current?.click()}
                  aria-label="Uppdatera kollektivavtal — välj fil"
                >
                  {uploadingAgreement ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <FileUp className="h-4 w-4 shrink-0" aria-hidden />
                  )}
                  Uppdatera kollektivavtal
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  className="min-h-11 flex-1 gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  disabled={isUploadBusy}
                  onClick={() => taxInputRef.current?.click()}
                  aria-label="Uppdatera skattetabell — välj JSON-fil"
                >
                  {uploadingTax ? (
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  ) : (
                    <FileUp className="h-4 w-4 shrink-0" aria-hidden />
                  )}
                  Uppdatera skattetabell
                </Button>
              </div>

              <p className="text-xs leading-relaxed text-text-muted">
                När Livs eller Skatteverket publicerar nytt: be AI om en fil från PDF, ladda upp här.
                Programmet sköter resten.
              </p>
            </BentoCard>

            <BentoCard title="Systemet räknar (read-only)" glow="blue" className="space-y-2 text-sm">
              <div className="grid gap-2 sm:grid-cols-2">
                <p>
                  <span className="text-text-muted">Timlön:</span>{' '}
                  <span className="tabular-nums text-text">{formatSek(profile.hourlyRateSek)}/h</span>
                </p>
                <p>
                  <span className="text-text-muted">SGI:</span>{' '}
                  <span className="tabular-nums text-text">{formatSek(profile.sgiAnnualSek)}/år</span>
                </p>
                <p className="sm:col-span-2">
                  <span className="text-text-muted">Avtal:</span>{' '}
                  <span className="text-text">{profile.agreementDisplayName}</span>
                </p>
                <p className="sm:col-span-2">
                  <span className="text-text-muted">Nästa löneperiod:</span>{' '}
                  <span className="text-text">{profile.nextPayslipPeriod.label}</span>
                </p>
              </div>
            </BentoCard>

            <BentoCard title="Preview denna period" glow="gold" className="space-y-1 text-sm">
              <p className="text-[10px] uppercase tracking-wider text-text-muted">
                Beräknad spec — jämför med arbetsgivarens
              </p>
              <p className="text-text-muted">{preview.period.label}</p>
              <p>
                Arbete netto:{' '}
                <span className="font-medium tabular-nums text-text">
                  {formatSek(preview.employerNetSek)}
                </span>
              </p>
              {preview.fkTotalSek > 0 ? (
                <p>
                  FK: <span className="tabular-nums text-text">{formatSek(preview.fkTotalSek)}</span>
                </p>
              ) : null}
              {preview.agsTotalSek > 0 ? (
                <p>
                  AGS: <span className="tabular-nums text-text">{formatSek(preview.agsTotalSek)}</span>
                </p>
              ) : null}
              <p className="pt-1 text-base">
                Till bankkonto:{' '}
                <span className="font-semibold tabular-nums text-accent">
                  {formatSek(preview.totalToBankSek)}
                </span>
              </p>
            </BentoCard>

            <Button type="submit" disabled={saving || isUploadBusy} className="min-h-11 w-full focus-visible:ring-2 focus-visible:ring-accent/40">
              {saving ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Sparar…
                </span>
              ) : (
                'Spara löneinställningar'
              )}
            </Button>
          </form>
        )}

        {error ? (
          <p
            className="flex items-start gap-2 rounded-xl border border-danger/25 bg-danger/5 px-3 py-2.5 text-sm leading-relaxed text-danger"
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>{error}</span>
          </p>
        ) : null}
        {uploadConfirmMessage ? (
          <p className="flex items-center gap-2 text-sm text-success" role="status">
            <Check className="h-4 w-4 shrink-0" aria-hidden />
            {uploadConfirmMessage}
          </p>
        ) : null}
        {savedFlash ? (
          <p className="flex items-center gap-2 text-sm text-success" role="status">
            <Check className="h-4 w-4 shrink-0" aria-hidden />
            Sparat — preview uppdaterad.
          </p>
        ) : null}
      </div>
    </div>
  );
}
