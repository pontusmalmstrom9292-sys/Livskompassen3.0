import { useCallback, useEffect, useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { Button } from '@/design-system';
import { BentoCard } from '@/shared/ui/BentoCard';
import { functions } from '@/core/firebase/init';
import { useStore } from '@/core/store';
import { getLatestPayslipSnapshot } from '@/core/firebase/economyFirestore';
import type { PayslipSnapshotRow } from '@/core/types/firestore';

function formatSek(value: number): string {
  const sign = value < 0 ? '−' : '+';
  return `${sign} ${Math.abs(Math.round(value)).toLocaleString('sv-SE')} kr`;
}

function PayslipSection({
  title,
  lines,
  subtotal,
}: {
  title: string;
  lines: Array<{ label: string; amountSek: number }>;
  subtotal?: number;
}) {
  if (lines.length === 0) return null;
  return (
    <div className="space-y-1.5 rounded-xl border border-border/50 bg-surface/30 p-3">
      <p className="text-[10px] font-medium uppercase tracking-wider text-text-muted">{title}</p>
      <ul className="space-y-1">
        {lines.map((line, i) => (
          <li key={`${line.label}-${i}`} className="flex justify-between gap-3 text-sm">
            <span className="text-text-muted">{line.label}</span>
            <span className="shrink-0 tabular-nums text-text">{formatSek(line.amountSek)}</span>
          </li>
        ))}
      </ul>
      {subtotal != null ? (
        <p className="flex justify-between border-t border-border/40 pt-2 text-sm font-medium">
          <span>Delsumma</span>
          <span className="tabular-nums text-text">{formatSek(subtotal)}</span>
        </p>
      ) : null}
    </div>
  );
}

export function EconomyPayslipCard() {
  const user = useStore((s) => s.user);
  const [payslip, setPayslip] = useState<PayslipSnapshotRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      setPayslip(await getLatestPayslipSnapshot(user.uid));
    } catch {
      setError('Kunde inte läsa lönespec.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const generate = async () => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      const fn = httpsCallable(functions, 'generatePayslip');
      await fn({});
      await reload();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Kunde inte generera lönespec.';
      setError(msg.includes('not-found') ? 'Deploya functions:generatePayslip först.' : msg);
    } finally {
      setBusy(false);
    }
  };

  const lineItems = payslip?.lineItems ?? [];
  const employerLines = lineItems
    .filter((l) => l.incomeSource === 'employer' && l.amountSek !== 0)
    .map((l) => ({ label: l.label, amountSek: l.amountSek }));
  const fkLines = lineItems
    .filter((l) => l.incomeSource === 'fk')
    .map((l) => ({ label: l.label, amountSek: l.amountSek }));
  const agsLines = lineItems
    .filter((l) => l.incomeSource === 'ags')
    .map((l) => ({ label: l.label, amountSek: l.amountSek }));

  const totalToBank =
    payslip?.totalToBankSek ?? payslip?.netSalarySek ?? 0;

  return (
    <BentoCard
      title="Lönespec"
      icon={<FileText className="h-4 w-4" />}
      description="Beräknad spec — jämför med arbetsgivarens"
    >
      {error && <p className="mb-2 text-sm text-danger">{error}</p>}
      {loading ? (
        <p className="flex items-center gap-2 text-sm text-text-muted">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
        </p>
      ) : payslip ? (
        <div className="space-y-3 text-sm">
          <p className="text-text-muted">{payslip.periodLabel}</p>
          {payslip.agreementMeta?.name ? (
            <p className="text-xs text-text-muted">Avtal: {payslip.agreementMeta.name}</p>
          ) : null}

          {employerLines.length > 0 ? (
            <PayslipSection
              title="Arbete (arbetsgivare)"
              lines={employerLines}
              subtotal={payslip.employerNetSek ?? payslip.netSalarySek}
            />
          ) : (
            <p>
              Brutto {payslip.taxableGrossSek} kr · Skatt {payslip.taxSek} kr ·{' '}
              <span className="font-medium text-text">Netto {payslip.netSalarySek} kr</span>
            </p>
          )}

          {(fkLines.length > 0 || agsLines.length > 0) && (
            <PayslipSection
              title="Försäkringskassan / tillägg"
              lines={[...fkLines, ...agsLines]}
              subtotal={(payslip.fkTotalSek ?? 0) + (payslip.agsTotalSek ?? 0)}
            />
          )}

          <div className="rounded-xl border border-accent/30 bg-accent/5 p-3">
            <p className="flex justify-between text-base font-semibold">
              <span>Totalt till bankkonto</span>
              <span className="tabular-nums text-accent">{formatSek(totalToBank)}</span>
            </p>
            <p className="mt-1 text-[10px] text-text-muted">
              Simulerad totalinkomst — FK/AGS är uppskattningar.
            </p>
          </div>

          {payslip.absenceDeductionSek > 0 && employerLines.length === 0 && (
            <p className="text-xs text-text-muted">Frånvaroavdrag: {payslip.absenceDeductionSek} kr</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-text-muted">Ingen lönespec ännu. Genereras automatiskt den 16:e kl 08:00.</p>
      )}
      <Button
        variant="ghost"
        disabled={busy || !user}
        onClick={() => void generate()}
        className="mt-3 w-full text-sm"
      >
        {busy ? 'Genererar…' : 'Generera lönespec nu'}
      </Button>
    </BentoCard>
  );
}
