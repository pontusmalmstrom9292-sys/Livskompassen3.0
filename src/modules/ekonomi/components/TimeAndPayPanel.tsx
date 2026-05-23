import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Loader2 } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { MetricTile } from '../../core/ui/MetricTile';
import { EmptyState } from '../../core/ui/EmptyState';
import { TimelineEntry } from '../../core/ui/TimelineEntry';
import { useStore } from '../../core/store';
import type { TimeEntryRow } from '../../core/types/firestore';
import {
  getEconomyProfileExtended,
  getFlexHoursRemaining,
  getRecentTimeEntries,
  getTodayTimeStatus,
  getWeekTimeStats,
  recordTimeIn,
  recordTimeOut,
} from '../../core/firebase/timeEconomyFirestore';

const STAMP_CATEGORIES = ['Arbete', 'Semester', 'VAB', 'Sjuk', 'Sjuk dag 15+'] as const;

export function TimeAndPayPanel() {
  const user = useStore((s) => s.user);
  const [status, setStatus] = useState({
    instamplad: false,
    inTid: '',
    kat: '',
    dagensTimmar: 0,
  });
  const [weekTotal, setWeekTotal] = useState(0);
  const [workHoursWeek, setWorkHoursWeek] = useState(0);
  const [flexLeft, setFlexLeft] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [flexTarget, setFlexTarget] = useState(40);
  const [logs, setLogs] = useState<TimeEntryRow[]>([]);
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
      setHourlyRate(profile.hourlyRateSek);
      setFlexTarget(profile.flexHoursTarget);

      const [today, week, recent, flex] = await Promise.all([
        getTodayTimeStatus(user.uid),
        getWeekTimeStats(user.uid),
        getRecentTimeEntries(user.uid, 5),
        getFlexHoursRemaining(user.uid, profile.flexHoursTarget),
      ]);
      setStatus(today);
      setWeekTotal(week.total);
      setWorkHoursWeek(week.perKat.find((k) => k.kat === 'Arbete')?.timmar ?? week.total);
      setFlexLeft(flex);
      setLogs(recent);
    } catch {
      setError('Kunde inte läsa tid och lön.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const estimatedWeekPay = useMemo(() => {
    if (hourlyRate <= 0) return null;
    return Math.round(workHoursWeek * hourlyRate);
  }, [hourlyRate, workHoursWeek]);

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
    <BentoCard
      title="Tid och lön"
      icon={<Clock className="h-4 w-4" />}
      description="Stämpelklocka — sparas i Firestore."
    >
      {error && <p className="mb-2 text-sm text-danger">{error}</p>}

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-text-dim">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
        </p>
      ) : (
        <>
          <div className="mb-3 grid grid-cols-2 gap-3">
            <MetricTile label="Idag" value={`${status.dagensTimmar} h`} hint="Registrerat" />
            <MetricTile
              label="Flex kvar"
              value={`${flexLeft} h`}
              hint={`Mål ${flexTarget} h/vecka`}
            />
          </div>

          {estimatedWeekPay != null && (
            <p className="mb-3 text-sm text-text-dim">
              Uppskattad lön denna vecka:{' '}
              <span className="font-medium text-text">{estimatedWeekPay} kr</span>
              {' '}({workHoursWeek} h × {hourlyRate} kr/h)
            </p>
          )}
          {hourlyRate <= 0 && (
            <p className="mb-3 text-xs text-text-dim">
              Sätt timlön under Profil nedan för uppskattad veckolön.
            </p>
          )}

          <p className="mb-3 text-sm text-text-dim">
            {status.instamplad
              ? `Pågående pass sedan ${status.inTid} (${status.kat})`
              : `${weekTotal} h totalt denna vecka`}
          </p>

          <label className="mb-3 flex flex-col gap-1 text-sm">
            <span className="text-text-dim">Kategori vid instämpling</span>
            <select
              value={stampCategory}
              onChange={(e) => setStampCategory(e.target.value)}
              className="input-glass"
              disabled={status.instamplad || busy}
            >
              {STAMP_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <div className="mb-4 grid grid-cols-2 gap-2">
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

          {logs.length === 0 ? (
            <EmptyState message="Inga pass ännu." />
          ) : (
            <div className="mb-3 space-y-2">
              {logs.map((log) => (
                <TimelineEntry
                  key={log.id}
                  meta={`${log.date} · ${log.category}`}
                  body={`${log.clockIn}–${log.clockOut ?? '…'} · ${log.hoursWorked} h`}
                />
              ))}
            </div>
          )}

          <Link to="/stampla" className="text-xs text-accent-primary hover:underline">
            Full stämpelvy och veckokalender →
          </Link>
        </>
      )}
    </BentoCard>
  );
}
