import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import { useStore } from '@/core/store';
import {
  addEconomyLedgerEntry,
  deleteEconomyFixedBill,
  deleteEconomyLedgerEntry,
  getEconomyFixedBills,
  getEconomyLedgerEntries,
  setEconomyFixedBill,
} from '@/core/firebase/economyFirestore';
import { formatDateLocal } from '@/shared/utils/dateHelpers';

type EconomyLogPanelProps = {
  onChanged?: () => void;
  scope?: 'vardag' | 'all';
};

export function EconomyLogPanel({ onChanged, scope = 'all' }: EconomyLogPanelProps) {
  const user = useStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bills, setBills] = useState<{ id: string; name: string; amountSek: number }[]>([]);
  const [ledger, setLedger] = useState<
    { id: string; date: string; category: string; description: string; amountSek: number; type: string }[]
  >([]);

  const [uDate, setUDate] = useState(formatDateLocal());
  const [uKat, setUKat] = useState('Mat/Köp');
  const [uBesk, setUBesk] = useState('');
  const [uBelopp, setUBelopp] = useState('');
  const [billName, setBillName] = useState('');
  const [billAmount, setBillAmount] = useState('');

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const [bl, led] = await Promise.all([
        getEconomyFixedBills(user.uid),
        getEconomyLedgerEntries(user.uid, 80),
      ]);
      setBills(bl);
      setLedger(led);
      onChanged?.();
    } catch {
      setError('Kunde inte läsa logg.');
    } finally {
      setLoading(false);
    }
  }, [user, onChanged]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const logMoney = async (type: 'utgift' | 'inkomst') => {
    if (!user || !uBesk.trim()) return;
    const amount = Number(uBelopp);
    if (!amount || amount <= 0) return;
    setBusy(true);
    try {
      await addEconomyLedgerEntry(user.uid, {
        date: uDate,
        category: uKat,
        description: uBesk.trim(),
        amountSek: amount,
        type,
      });
      setUBesk('');
      setUBelopp('');
      await reload();
    } catch {
      setError('Kunde inte spara.');
    } finally {
      setBusy(false);
    }
  };

  const addBill = async () => {
    if (!user || !billName.trim()) return;
    setBusy(true);
    try {
      await setEconomyFixedBill(user.uid, {
        name: billName.trim(),
        amountSek: Number(billAmount) || 0,
      });
      setBillName('');
      setBillAmount('');
      await reload();
    } catch {
      setError('Kunde inte spara fast räkning.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <p className="text-sm text-danger">{error}</p>}
      {loading && (
        <p className="flex items-center gap-2 text-sm text-text-dim">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar logg…
        </p>
      )}

      {!loading && (
        <>
          <BentoCard title={scope === 'vardag' ? 'Logga utgift' : 'Logga utgift / inkomst'}>
            <div className="space-y-3 text-sm">
              <input
                type="date"
                className="input-glass w-full"
                value={uDate}
                onChange={(e) => setUDate(e.target.value)}
              />
              <select className="input-glass w-full" value={uKat} onChange={(e) => setUKat(e.target.value)}>
                <option>Mat/Köp</option>
                <option>Rörliga</option>
                <option>Swish</option>
                {scope === 'all' ? <option>Sälj</option> : null}
                <option>Övrigt</option>
              </select>
              <input
                className="input-glass w-full"
                placeholder="Beskrivning"
                value={uBesk}
                onChange={(e) => setUBesk(e.target.value)}
              />
              <input
                type="number"
                className="input-glass w-full"
                placeholder="Belopp (kr)"
                value={uBelopp}
                onChange={(e) => setUBelopp(e.target.value)}
              />
              <div className={scope === 'vardag' ? '' : 'grid grid-cols-2 gap-2'}>
                <button
                  type="button"
                  disabled={busy}
                  className={scope === 'vardag' ? 'btn-pill--primary w-full' : 'btn-pill--ghost'}
                  onClick={() => void logMoney('utgift')}
                >
                  Utgift
                </button>
                {scope === 'all' ? (
                  <button
                    type="button"
                    disabled={busy}
                    className="btn-pill--primary"
                    onClick={() => void logMoney('inkomst')}
                  >
                    Inkomst
                  </button>
                ) : null}
              </div>
            </div>
          </BentoCard>

          <BentoCard title="Fasta räkningar">
            {bills.length === 0 ? (
              <EmptyState message="Inga fasta räkningar." />
            ) : (
              <ul className="mb-3 space-y-2 text-sm">
                {bills.map((b) => (
                  <li key={b.id} className="flex justify-between gap-2">
                    <span>{b.name}</span>
                    <span>
                      {b.amountSek} kr
                      <button
                        type="button"
                        className="ml-2 text-xs text-danger"
                        onClick={() => void deleteEconomyFixedBill(user!.uid, b.id).then(reload)}
                      >
                        Ta bort
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-wrap gap-2">
              <input
                className="input-glass flex-1"
                placeholder="Namn"
                value={billName}
                onChange={(e) => setBillName(e.target.value)}
              />
              <input
                type="number"
                className="input-glass w-24"
                placeholder="kr"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
              />
              <button type="button" disabled={busy} className="btn-pill--primary text-sm" onClick={() => void addBill()}>
                Lägg till
              </button>
            </div>
          </BentoCard>

          <BentoCard title="Senaste loggrader">
            {ledger.length === 0 ? (
              <EmptyState message="Inga rader ännu." />
            ) : (
              <div className="space-y-2">
                {ledger.slice(0, 25).map((row) => (
                  <div key={row.id} className="flex justify-between gap-2">
                    <TimelineEntry
                      meta={`${row.date} · ${row.category}`}
                      body={`${row.description} — ${row.type === 'inkomst' ? '+' : '−'}${row.amountSek} kr`}
                    />
                    <button
                      type="button"
                      className="shrink-0 text-xs text-danger"
                      onClick={() => void deleteEconomyLedgerEntry(user!.uid, row.id).then(reload)}
                    >
                      Radera
                    </button>
                  </div>
                ))}
              </div>
            )}
          </BentoCard>

          <p className="text-xs text-text-dim">
            {scope === 'vardag'
              ? 'Jobbinkomst och lönespec registreras i Arbetsliv — inte här.'
              : 'Frånvaro (sjuk/VAB) finns under Valv → Lön (PIN).'}
          </p>
        </>
      )}
    </div>
  );
}
