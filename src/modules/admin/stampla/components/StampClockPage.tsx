import { useCallback, useEffect, useState } from 'react';
import { Clock, Loader2 } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { MetricTile } from '../../../core/ui/MetricTile';
import { EmptyState } from '../../../core/ui/EmptyState';
import { TimelineEntry } from '../../../core/ui/TimelineEntry';
import { useStore } from '../../../core/store';
import type { TimeEntryRow } from '../../../core/types/firestore';
import {
  getOpenTimeEntry,
  getWeekFlexDetail,
  getRecentTimeEntries,
  getTodayTimeStatus,
  getWeekTimeCalendar,
  getWeekTimeStats,
  recordTimeIn,
  recordTimeOut,
  repairOpenTimeEntryFlags,
} from '../../../core/firebase/timeEconomyFirestore';

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
  const [flexTarget, setFlexTarget] = useState(40);
  const [weekTypeLabel, setWeekTypeLabel] = useState('');
  const [weekTotal, setWeekTotal] = useState(0);
  const [logs, setLogs] = useState<TimeEntryRow[]>([]);
  const [calendar, setCalendar] = useState<{ namn: string; datum: string; timmar: number; idag: boolean }[]>([]);
  const [stampCategory, setStampCategory] = useState<string>('Arbete');
  const [openEntryId, setOpenEntryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await repairOpenTimeEntryFlags(user.uid);
      const [today, week, recent, cal, flexDetail, open] = await Promise.all([
        getTodayTimeStatus(user.uid),
        getWeekTimeStats(user.uid),
        getRecentTimeEntries(user.uid, 20),
        getWeekTimeCalendar(user.uid),
        getWeekFlexDetail(user.uid),
        getOpenTimeEntry(user.uid),
      ]);
      setStatus(today);
      setWeekTotal(week.total);
      setFlexLeft(flexDetail.flexLeft);
      setFlexTarget(flexDetail.flexTarget);
      setWeekTypeLabel(flexDetail.weekTypeLabel);
      setLogs(recent);
      setCalendar(cal.dagar);
      setOpenEntryId(open?.id ?? null);
    } catch {
      setError('Kunde inte läsa tidsdata.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const isClockedIn = Boolean(openEntryId) || status.instamplad;

  const stamp = async (type: 'IN' | 'UT') => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      if (type === 'IN') {
        const created = await recordTimeIn(user.uid, stampCategory);
        setOpenEntryId(created.id);
        setStatus({
          instamplad: true,
          inTid: created.clockIn,
          kat: created.category,
          dagensTimmar: 0,
        });
      } else {
        await recordTimeOut(user.uid, openEntryId ?? undefined);
        setOpenEntryId(null);
        setStatus((s) => ({ ...s, instamplad: false, inTid: '', kat: '' }));
      }
      await reload();
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Stämpling misslyckades.';
      setError(
        msg.includes('permission') || msg.includes('Permission')
          ? 'Sparning nekad — deploya Firestore-regler (time_entries).'
          : msg,
      );
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
        <MetricTile
          label="Flex kvar"
          value={`${flexLeft} h`}
          hint={weekTypeLabel || `Mål ${flexTarget} h`}
        />
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
              {isClockedIn
                ? `Pågående pass sedan ${status.inTid} (${status.kat})`
                : `${status.dagensTimmar} h registrerade idag`}
            </p>
            <label className="mb-3 flex flex-col gap-1 text-sm">
              <span className="text-text-dim">Kategori vid instämpling</span>
              <select
                value={stampCategory}
                onChange={(e) => setStampCategory(e.target.value)}
                className="input-glass"
                disabled={isClockedIn}
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
                disabled={busy || isClockedIn}
                onClick={() => void stamp('IN')}
                className={isClockedIn || busy ? 'btn-pill--ghost opacity-40' : 'btn-pill--primary'}
              >
                Stämpla in
              </button>
              <button
                type="button"
                disabled={busy || !isClockedIn}
                onClick={() => void stamp('UT')}
                className={
                  isClockedIn && !busy ? 'btn-pill--success-solid' : 'btn-pill--ghost opacity-40'
                }
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
        Frånvaro, manuella pass och löneöversikt finns i Valvet under Lön (Fyren: håll Hjärtat 3 sek i modulhubben, sedan PIN).
      </p>
    </div>
  );
}
