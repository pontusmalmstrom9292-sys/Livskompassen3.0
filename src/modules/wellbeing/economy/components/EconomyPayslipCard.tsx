import { useCallback, useEffect, useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { BentoCard } from '../../../core/ui/BentoCard';
import { functions } from '../../../core/firebase/init';
import { useStore } from '../../../core/store';
import { getLatestPayslipSnapshot } from '../../../core/firebase/timeEconomyFirestore';
import type { PayslipSnapshotRow } from '../../../core/types/firestore';

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

  return (
    <BentoCard title="Lönespec" icon={<FileText className="h-4 w-4" />} description="WORM — genereras i molnet">
      {error && <p className="mb-2 text-sm text-danger">{error}</p>}
      {loading ? (
        <p className="flex items-center gap-2 text-sm text-text-dim">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
        </p>
      ) : payslip ? (
        <div className="space-y-2 text-sm">
          <p className="text-text-dim">{payslip.periodLabel}</p>
          <p>
            Brutto {payslip.taxableGrossSek} kr · Skatt {payslip.taxSek} kr ·{' '}
            <span className="font-medium text-text">Netto {payslip.netSalarySek} kr</span>
          </p>
          {payslip.absenceDeductionSek > 0 && (
            <p className="text-xs text-text-dim">Frånvaroavdrag: {payslip.absenceDeductionSek} kr</p>
          )}
        </div>
      ) : (
        <p className="text-sm text-text-dim">Ingen lönespec ännu. Genereras automatiskt den 16:e kl 08:00.</p>
      )}
      <button
        type="button"
        disabled={busy || !user}
        onClick={() => void generate()}
        className="btn-pill--ghost mt-3 w-full text-sm"
      >
        {busy ? 'Genererar…' : 'Generera lönespec nu'}
      </button>
    </BentoCard>
  );
}
