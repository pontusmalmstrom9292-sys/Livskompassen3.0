import { useCallback, useEffect, useMemo, useState } from 'react';
import { Clock, Loader2 } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import {
  getEconomyProfileExtended,
  getOpenTimeEntry,
  getRecentTimeEntries,
  getTodayTimeStatus,
  getWeekFlexDetail,
  getWeekTimeStats,
  recordTimeIn,
  recordTimeOut,
} from '../../core/firebase/timeEconomyFirestore';
import { StampClockPanel } from './StampClockPanel';
import { WorkWeekSummary } from './WorkWeekSummary';

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
  const [weekTypeLabel, setWeekTypeLabel] = useState('');
  const [logs, setLogs] = useState<Awaited<ReturnType<typeof getRecentTimeEntries>>>([]);
  const [stampCategory, setStampCategory] = useState<string>('Arbete');
  const [openEntryId, setOpenEntryId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!user) return;
      if (opts?.silent) setRefreshing(true);
      else setInitialLoading(true);
      setError(null);
      try {
        const profile = await getEconomyProfileExtended(user.uid);
        setHourlyRate(profile.hourlyRateSek);
        const [today, week, recent, flexDetail, open] = await Promise.all([
          getTodayTimeStatus(user.uid),
          getWeekTimeStats(user.uid),
          getRecentTimeEntries(user.uid, 5),
          getWeekFlexDetail(user.uid),
          getOpenTimeEntry(user.uid),
        ]);
        setStatus(today);
        setWeekTotal(week.total);
        setFlexTarget(flexDetail.flexTarget);
        setWeekTypeLabel(flexDetail.weekTypeLabel);
        setWorkHoursWeek(flexDetail.workHoursWeek);
        setFlexLeft(flexDetail.flexLeft);
        setLogs(recent);
        setOpenEntryId(open?.id ?? null);
      } catch {
        setError('Kunde inte läsa tid och lön.');
      } finally {
        setInitialLoading(false);
        setRefreshing(false);
      }
    },
    [user],
  );

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
        setStatus((s) => ({
          ...s,
          instamplad: false,
          inTid: '',
          kat: '',
        }));
      }
      await reload({ silent: true });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Stämpling misslyckades.';
      if (msg.includes('permission') || msg.includes('Permission')) {
        setError('Sparning nekad — Firestore-regler behöver deployas (time_entries).');
      } else {
        setError(msg);
      }
    } finally {
      setBusy(false);
    }
  };

  const canStampOut = status.instamplad || openEntryId != null;
  const statusLine = status.instamplad
    ? `Pågående pass sedan ${status.inTid} (${status.kat})`
    : `${weekTotal} h denna vecka`;

  return (
    <BentoCard
      title="Tid och lön"
      icon={<Clock className="h-4 w-4" />}
      description="Stämpelklocka — Firestore time_entries (inte Kalkylark)."
    >
      {error && <p className="mb-2 text-sm text-danger">{error}</p>}

      {initialLoading ? (
        <p className="flex items-center gap-2 text-sm text-text-dim">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
        </p>
      ) : (
        <>
          {refreshing && (
            <p className="mb-2 flex items-center gap-2 text-xs text-text-dim">
              <Loader2 className="h-3 w-3 animate-spin" /> Uppdaterar…
            </p>
          )}

          <WorkWeekSummary
            dagensTimmar={status.dagensTimmar}
            weekTotal={weekTotal}
            flexLeft={flexLeft}
            flexTarget={flexTarget}
            weekTypeLabel={weekTypeLabel}
            hourlyRate={hourlyRate}
            workHoursWeek={workHoursWeek}
            estimatedWeekPay={estimatedWeekPay}
            statusLine={statusLine}
          />

          <StampClockPanel
            instamplad={status.instamplad}
            stampCategory={stampCategory}
            onStampCategoryChange={setStampCategory}
            busy={busy}
            canStampOut={canStampOut}
            logs={logs}
            onStampIn={() => void stamp('IN')}
            onStampOut={() => void stamp('UT')}
          />
        </>
      )}
    </BentoCard>
  );
}
