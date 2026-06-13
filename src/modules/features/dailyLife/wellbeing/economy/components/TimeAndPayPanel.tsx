import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Loader2 } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { StampClockControls } from '@/features/admin/stampla/components/StampClockControls';
import { useStampClock } from '@/features/admin/stampla/hooks/useStampClock';
import { useWorkStats } from '@/features/dailyLife/arbetsliv/hooks/useWorkStats';
import { getEconomyProfileExtended } from '@/core/firebase/economyFirestore';
import { useCallback, useEffect, useState } from 'react';
import { WorkWeekSummary } from './WorkWeekSummary';
import { EKONOMI_TID_LEAD } from '../ekonomiCopy';

export function TimeAndPayPanel() {
  const user = useStore((s) => s.user);
  const clock = useStampClock(user?.uid);

  // ─── Arbetsliv-statistik via hook-kontrakt (inga direkta arbetslivFirestore-importer) ──
  const workStats = useWorkStats(user?.uid);

  // ─── Ekonomi-specifikt: timlön från Ekonomi-silon ────────────────────────────
  const [hourlyRate, setHourlyRate] = useState(0);
  const [hrLoading, setHrLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reloadHourlyRate = useCallback(async () => {
    if (!user) return;
    setHrLoading(true);
    setError(null);
    try {
      const profile = await getEconomyProfileExtended(user.uid);
      setHourlyRate(profile.hourlyRateSek);
    } catch {
      setError('Kunde inte läsa löneprofil.');
    } finally {
      setHrLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reloadHourlyRate();
  }, [reloadHourlyRate]);

  // ─── Beräkningar ──────────────────────────────────────────────────────────────
  const estimatedWeekPay = useMemo(() => {
    if (hourlyRate <= 0) return null;
    return Math.round(workStats.workHoursWeek * hourlyRate);
  }, [hourlyRate, workStats.workHoursWeek]);

  const statusLine = clock.isClockedIn
    ? `Pågående pass sedan ${clock.status.inTid} (${clock.status.kat})`
    : workStats.todayStatus.instamplad
      ? `Pågående pass sedan ${workStats.todayStatus.inTid} (${workStats.todayStatus.kat})`
      : `${workStats.weekTotal} h denna vecka`;

  const handleStamp = async (type: 'IN' | 'UT') => {
    const ok = await clock.stamp(type);
    if (ok) await workStats.reload({ silent: true });
  };

  const initialLoading = workStats.loading || hrLoading || clock.loading;
  const refreshing = workStats.refreshing;

  return (
    <BentoCard
      title="Tid och lön"
      icon={<Clock className="h-4 w-4" />}
      description={EKONOMI_TID_LEAD}
    >
      {(error ?? workStats.error) && (
        <p className="mb-2 text-sm text-danger">{error ?? workStats.error}</p>
      )}
      {clock.error && <p className="mb-2 text-sm text-danger">{clock.error}</p>}
      {clock.success && (
        <p className="mb-2 text-xs text-success" role="status">
          {clock.success}
        </p>
      )}

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
            dagensTimmar={workStats.todayStatus.dagensTimmar}
            weekTotal={workStats.weekTotal}
            flexLeft={workStats.flexLeft}
            flexTarget={workStats.flexTarget}
            weekTypeLabel={workStats.weekTypeLabel}
            hourlyRate={hourlyRate}
            workHoursWeek={workStats.workHoursWeek}
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
