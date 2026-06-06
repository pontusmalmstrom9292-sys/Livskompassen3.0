import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Loader2 } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { StampClockControls } from '@/features/admin/stampla/components/StampClockControls';
import { useStampClock } from '@/features/admin/stampla/hooks/useStampClock';
import {
  getEconomyProfileExtended,
  getOpenTimeEntry,
  getTodayTimeStatus,
  getWeekFlexDetail,
  getWeekTimeStats,
} from '@/core/firebase/timeEconomyFirestore';
import { WorkWeekSummary } from './WorkWeekSummary';
import { EKONOMI_TID_LEAD } from '../ekonomiCopy';

export function TimeAndPayPanel() {
  const user = useStore((s) => s.user);
  const clock = useStampClock(user?.uid);
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
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
        const [today, week, flexDetail, open] = await Promise.all([
          getTodayTimeStatus(user.uid),
          getWeekTimeStats(user.uid),
          getWeekFlexDetail(user.uid),
          getOpenTimeEntry(user.uid),
        ]);
        setStatus(today);
        setWeekTotal(week.total);
        setFlexTarget(flexDetail.flexTarget);
        setWeekTypeLabel(flexDetail.weekTypeLabel);
        setWorkHoursWeek(flexDetail.workHoursWeek);
        setFlexLeft(flexDetail.flexLeft);
        if (open) {
          setStatus((s) => ({
            ...s,
            instamplad: true,
            inTid: open.clockIn,
            kat: open.category,
          }));
        }
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

  const statusLine = clock.isClockedIn
    ? `Pågående pass sedan ${clock.status.inTid} (${clock.status.kat})`
    : status.instamplad
      ? `Pågående pass sedan ${status.inTid} (${status.kat})`
      : `${weekTotal} h denna vecka`;

  const handleStamp = async (type: 'IN' | 'UT') => {
    const ok = await clock.stamp(type);
    if (ok) await reload({ silent: true });
  };

  return (
    <BentoCard
      title="Tid och lön"
      icon={<Clock className="h-4 w-4" />}
      description={EKONOMI_TID_LEAD}
    >
      {error && <p className="mb-2 text-sm text-danger">{error}</p>}
      {clock.error && <p className="mb-2 text-sm text-danger">{clock.error}</p>}
      {clock.success && (
        <p className="mb-2 text-xs text-success" role="status">
          {clock.success}
        </p>
      )}

      {initialLoading || clock.loading ? (
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

          <div className="mt-4 rounded-xl border border-border/30 bg-surface-2/60 p-3">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-text-dim">Snabb stämpel</p>
            <StampClockControls
              isClockedIn={clock.isClockedIn}
              busy={clock.busy}
              compact
              onStampIn={() => void handleStamp('IN')}
              onStampOut={() => void handleStamp('UT')}
            />
          </div>

          <Link
            to="/arbetsliv?tab=stampla"
            className="btn-pill--ghost mt-4 inline-block text-sm"
          >
            Full stämpelvy och veckokalender →
          </Link>
        </>
      )}
    </BentoCard>
  );
}
