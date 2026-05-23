import { useCallback, useEffect, useState } from 'react';
import { Clock, Loader2 } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { MetricTile } from '../../core/ui/MetricTile';
import { EmptyState } from '../../core/ui/EmptyState';
import { TimelineEntry } from '../../core/ui/TimelineEntry';
import { useStore } from '../../core/store';
import {
  getEconomyProfileExtended,
  getFlexHoursRemaining,
  getRecentTimeEntries,
  getTodayTimeStatus,
  getWeekTimeCalendar,
  getWeekTimeStats,
  recordTimeIn,
  recordTimeOut,
} from '../../core/firebase/timeEconomyFirestore';

const CATEGORIES = ['Arbete', 'Semester', 'VAB', 'Sjuk', 'Sjuk dag 15+'] as const;

export function StampClockPage() {
  const user = useStore((s) => s.user);
  const [status, setStatus] = useState({
    instamplad: false,
    inTid: '',
    kat: '',
    dagensTimmar: 0,
  });
  const [flexLeft, setFlexLeft] = useState(0);
  const [weekTotal, setWeekTotal] = useState(0);
  const [logs, setLogs] = useState<
    { id: string; date: string; clockIn: string; clockOut: string | null; category: string; hoursWorked: number }[]
  >([]);
  const [calendar, setCalendar] = useState<{ namn: string; datum: string; timmar: number; idag: boolean }[]>([]);
  const [stampCategory, setStampCategory] = useState<string>('Arbete');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const profile = await getEconomyProfileExtended(user.uid);
      const [today, week, recent, cal, flex] = await Promise.all([
        getTodayTimeStatus(user.uid),
        getWeekTimeStats(user.uid),
        getRecentTimeEntries(user.uid, 20),
        getWeekTimeCalendar(user.uid),
        getFlexHoursRemaining(user.uid, profile.flexHoursTarget),
      ]);
      setStatus(today);
      setWeekTotal(week.total);
      setFlexLeft(flex);
      setLogs(recent);
      setCalendar(cal.dagar);
    } catch {
      setError('Kunde inte läsa tidsdata.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const stamp = async (type: 'IN' | 'UT') => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      if (type === 'IN') await recordTimeIn(user.uid, stampCategory);
      else await recordTimeOut(user.uid);
      await reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Stämpling misslyckades.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-display text-2xl text-text">Stämpelklocka</h1>
        <p className="text-sm text-text-dim">In och ut — timmar sparas i Firestore.</p>
      </header>

      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="grid grid-cols-2 gap-3">
        <MetricTile label="Flex kvar" value={`${flexLeft} h`} hint="Denna vecka" />
        <MetricTile label="Vecka totalt" value={`${weekTotal} h`} hint="Alla kategorier" />
      </div>

      <BentoCard title="Stämpla" icon={<Clock className="h-4 w-4" />}>
        {loading && (
          <p className="flex items-center gap-2 text-sm text-text-dim">
            <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
          </p>
        )}
        {!loading && (
          <>
            <p className="mb-3 text-sm text-text-dim">
              {status.instamplad
                ? `Pågående pass sedan ${status.inTid} (${status.kat})`
                : `${status.dagensTimmar} h registrerade idag`}
            </p>
            <label className="mb-3 flex flex-col gap-1 text-sm">
              <span className="text-text-dim">Kategori vid instämpling</span>
              <select
                value={stampCategory}
                onChange={(e) => setStampCategory(e.target.value)}
                className="input-glass"
                disabled={status.instamplad}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={busy || status.instamplad}
                onClick={() => void stamp('IN')}
                className="btn-pill--primary disabled:opacity-40"
              >
                Stämpla in
              </button>
              <button
                type="button"
                disabled={busy || !status.instamplad}
                onClick={() => void stamp('UT')}
                className="btn-pill--ghost disabled:opacity-40"
              >
                Stämpla ut
              </button>
            </div>
          </>
        )}
      </BentoCard>

      <BentoCard title="Veckokalender" description="Mån–sön">
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {calendar.map((d) => (
            <div
              key={d.datum}
              className={`rounded-lg border border-white/5 p-2 ${d.idag ? 'bg-accent-primary/10' : ''}`}
            >
              <div className="text-text-dim">{d.namn}</div>
              <div className="font-medium text-text">{d.timmar}h</div>
            </div>
          ))}
        </div>
      </BentoCard>

      <BentoCard title="Senaste pass" description="Firestore time_entries">
        {logs.length === 0 ? (
          <EmptyState message="Inga pass ännu." />
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <TimelineEntry
                key={log.id}
                meta={`${log.date} · ${log.category}`}
                body={`${log.clockIn}–${log.clockOut ?? '…'} · ${log.hoursWorked} h`}
              />
            ))}
          </div>
        )}
      </BentoCard>

      <p className="text-xs text-text-dim">
        Frånvaro, manuella pass och löneöversikt finns under Hjärtat → Bevis → Lön (efter PIN).
      </p>
    </div>
  );
}
