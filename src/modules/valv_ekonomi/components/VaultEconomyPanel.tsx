import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, Wallet } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { TabBar, type TabBarItem } from '../../core/ui/TabBar';
import { EmptyState } from '../../core/ui/EmptyState';
import { TimelineEntry } from '../../core/ui/TimelineEntry';
import { useStore } from '../../core/store';
import {
  addManualTimeEntries,
  deleteTimeEntry,
  getRecentTimeEntries,
} from '../../core/firebase/timeEconomyFirestore';
import type { TimeEntryRow } from '../../core/types/firestore';
import { formatDateLocal } from '@/shared/utils/dateHelpers';
import { DEFAULT_HELDAG } from '../../core/utils/timeMath';

type VaultEcoTab = 'franvaro' | 'historik';

const TABS: TabBarItem<VaultEcoTab>[] = [
  { id: 'franvaro', label: 'Frånvaro' },
  { id: 'historik', label: 'Historik (tid)' },
];

const ABSENCE_CATS = ['Sjuk', 'Sjuk dag 15+', 'VAB', 'Semester', 'Arbete'] as const;

export function VaultEconomyPanel() {
  const user = useStore((s) => s.user);
  const [tab, setTab] = useState<VaultEcoTab>('franvaro');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLogs, setTimeLogs] = useState<TimeEntryRow[]>([]);

  const [mFrom, setMFrom] = useState(formatDateLocal());
  const [mTo, setMTo] = useState(formatDateLocal());
  const [mKat, setMKat] = useState<string>('Sjuk');
  const [mMode, setMMode] = useState<'heldag' | 'timmar'>('heldag');
  const [mIn, setMIn] = useState<string>(DEFAULT_HELDAG.in);
  const [mOut, setMOut] = useState<string>(DEFAULT_HELDAG.out);
  const [mRast, setMRast] = useState('30');
  const [mPct, setMPct] = useState('100');
  const [busy, setBusy] = useState(false);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      setTimeLogs(await getRecentTimeEntries(user.uid, 50));
    } catch {
      setError('Kunde inte läsa valv-ekonomi.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const saveManual = async () => {
    if (!user) return;
    setBusy(true);
    try {
      await addManualTimeEntries(user.uid, {
        fromDate: mFrom,
        toDate: mTo,
        clockIn: mMode === 'timmar' ? mIn : DEFAULT_HELDAG.in,
        clockOut: mMode === 'timmar' ? mOut : DEFAULT_HELDAG.out,
        category: mKat,
        breakMinutes: Number(mRast) || 30,
        scopePercent: Number(mPct) || 100,
      });
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Kunde inte spara pass.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <BentoCard title="Lön och räkningar" icon={<Wallet className="h-4 w-4" />} description="PIN-skyddad">
        <p className="mb-3 text-sm text-text-dim">
          Pengar, logg och period finns i{' '}
          <Link to="/vardagen?tab=ekonomi" className="text-accent-primary underline">
            Vardagen → Ekonomi
          </Link>
          . Här: frånvaro och tidshistorik under PIN.
        </p>
        <TabBar<VaultEcoTab> tabs={TABS} active={tab} onChange={setTab} />
      </BentoCard>

      {error && <p className="text-sm text-danger">{error}</p>}
      {loading && (
        <p className="flex items-center gap-2 text-sm text-text-dim">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
        </p>
      )}

      {!loading && tab === 'franvaro' && (
        <BentoCard title="Frånvaro / manuellt pass">
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <input type="date" className="input-glass" value={mFrom} onChange={(e) => setMFrom(e.target.value)} />
              <input type="date" className="input-glass" value={mTo} onChange={(e) => setMTo(e.target.value)} />
            </div>
            <select className="input-glass w-full" value={mKat} onChange={(e) => setMKat(e.target.value)}>
              {ABSENCE_CATS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                type="button"
                className={`btn-pill--ghost text-xs ${mMode === 'heldag' ? 'ring-1 ring-accent-primary' : ''}`}
                onClick={() => setMMode('heldag')}
              >
                Heldag
              </button>
              <button
                type="button"
                className={`btn-pill--ghost text-xs ${mMode === 'timmar' ? 'ring-1 ring-accent-primary' : ''}`}
                onClick={() => setMMode('timmar')}
              >
                Timmar
              </button>
            </div>
            {mMode === 'timmar' && (
              <div className="grid grid-cols-2 gap-2">
                <input type="time" className="input-glass" value={mIn} onChange={(e) => setMIn(e.target.value)} />
                <input type="time" className="input-glass" value={mOut} onChange={(e) => setMOut(e.target.value)} />
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                className="input-glass"
                placeholder="Rast min"
                value={mRast}
                onChange={(e) => setMRast(e.target.value)}
              />
              <select className="input-glass" value={mPct} onChange={(e) => setMPct(e.target.value)}>
                <option value="100">100%</option>
                <option value="75">75%</option>
                <option value="50">50%</option>
                <option value="25">25%</option>
              </select>
            </div>
            <button type="button" disabled={busy} className="btn-pill--primary w-full" onClick={() => void saveManual()}>
              Spara i loggen
            </button>
          </div>
        </BentoCard>
      )}

      {!loading && tab === 'historik' && (
        <BentoCard title="Aktivitetslogg (tid)">
          {timeLogs.length === 0 ? (
            <EmptyState message="Inga pass." />
          ) : (
            <div className="space-y-2">
              {timeLogs.map((t) => (
                <div key={t.id} className="flex items-start justify-between gap-2">
                  <TimelineEntry
                    meta={t.date}
                    body={`${t.category} ${t.clockIn}–${t.clockOut ?? '…'} · ${t.hoursWorked} h`}
                  />
                  <button
                    type="button"
                    className="shrink-0 text-xs text-danger"
                    onClick={() => void deleteTimeEntry(user!.uid, t.id).then(reload)}
                  >
                    Radera
                  </button>
                </div>
              ))}
            </div>
          )}
        </BentoCard>
      )}
    </div>
  );
}
