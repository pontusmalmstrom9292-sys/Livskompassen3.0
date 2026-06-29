import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { EmptyState } from '@/core/ui/EmptyState';
import { TimelineEntry } from '@/core/ui/TimelineEntry';
import { useStore } from '@/core/store';
import {
  addEconomyLedgerEntry,
  getEconomyLedgerEntries,
} from '@/core/firebase/economyFirestore';
import { formatDateLocal } from '@/shared/utils/dateHelpers';

const INCOME_CATEGORIES = [
  { id: 'lon', label: 'Lön (arbetsgivare)' },
  { id: 'fk', label: 'Försäkringskassan' },
  { id: 'ovb', label: 'Omvårdnadsbidrag' },
  { id: 'ovrig_inkomst', label: 'Övrig inkomst' },
] as const;

type IncomeCategoryId = (typeof INCOME_CATEGORIES)[number]['id'];

const WORK_INCOME_CATEGORIES = new Set<string>(INCOME_CATEGORIES.map((c) => c.id));

/** Fas 14A — registrera jobb- och myndighetsinkomster. */
export function ArbetslivInkomstDelegate() {
  const user = useStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState(formatDateLocal());
  const [category, setCategory] = useState<IncomeCategoryId>('lon');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [rows, setRows] = useState<
    { id: string; date: string; category: string; description: string; amountSek: number }[]
  >([]);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const led = await getEconomyLedgerEntries(user.uid, 120);
      setRows(
        led
          .filter((row) => row.type === 'inkomst' && WORK_INCOME_CATEGORIES.has(row.category))
          .slice(0, 25)
          .map((row) => ({
            id: row.id,
            date: row.date,
            category: row.category,
            description: row.description,
            amountSek: row.amountSek,
          })),
      );
    } catch {
      setError('Kunde inte läsa inkomster.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const save = async () => {
    if (!user || !description.trim()) return;
    const amountSek = Number(amount);
    if (!amountSek || amountSek <= 0) return;
    setBusy(true);
    setError(null);
    try {
      await addEconomyLedgerEntry(user.uid, {
        date,
        category,
        description: description.trim(),
        amountSek,
        type: 'inkomst',
      });
      setDescription('');
      setAmount('');
      await reload();
    } catch {
      setError('Kunde inte spara inkomst.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="arbetsliv-delegate arbetsliv-delegate--inkomster overflow-hidden rounded-2xl border border-border-strong bg-surface/25 p-1"
      data-write-target="economy_ledger"
    >
      <div className="space-y-4 p-3 sm:p-4">
        {error && <p className="text-sm text-danger">{error}</p>}

        <BentoCard title="Registrera inkomst" glow="blue" className="overflow-hidden">
          <div className="space-y-3 text-sm">
            <input
              type="date"
              className="input-glass w-full"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <select
              className="input-glass w-full"
              value={category}
              onChange={(e) => setCategory(e.target.value as IncomeCategoryId)}
            >
              {INCOME_CATEGORIES.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              className="input-glass w-full"
              placeholder="Beskrivning (t.ex. maj-lön, FK sjukpenning)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <input
              type="number"
              className="input-glass w-full"
              placeholder="Belopp (kr)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              type="button"
              disabled={busy}
              className="ds-btn ds-btn--accent w-full"
              onClick={() => void save()}
            >
              Spara inkomst
            </button>
          </div>
        </BentoCard>

        <BentoCard title="Inkomster i appen" glow="blue" className="overflow-hidden">
          {loading ? (
            <p className="flex items-center gap-2 text-sm text-text-dim">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Laddar…
            </p>
          ) : rows.length === 0 ? (
            <EmptyState message="Inga registrerade inkomster ännu." />
          ) : (
            <div className="space-y-2">
              {rows.map((row) => {
                const label = INCOME_CATEGORIES.find((c) => c.id === row.category)?.label ?? row.category;
                return (
                  <TimelineEntry
                    key={row.id}
                    meta={`${row.date} · ${label}`}
                    body={`${row.description} — +${row.amountSek} kr`}
                  />
                );
              })}
            </div>
          )}
        </BentoCard>
      </div>
    </div>
  );
}
