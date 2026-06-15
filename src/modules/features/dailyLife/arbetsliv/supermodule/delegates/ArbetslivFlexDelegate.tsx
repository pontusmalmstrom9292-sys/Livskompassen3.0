import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useStore } from '@/core/store';
import { getEconomyProfileExtended } from '@/core/firebase/economyFirestore';
import { useWorkStats } from '@/features/dailyLife/arbetsliv/hooks/useWorkStats';
import { WorkWeekSummary } from '@/features/dailyLife/wellbeing/economy/components/WorkWeekSummary';

/** Fas 14A — veckoflex read-only, utan stämpel eller lönespec. */
export function ArbetslivFlexDelegate() {
  const user = useStore((s) => s.user);
  const workStats = useWorkStats(user?.uid);
  const [hourlyRate, setHourlyRate] = useState(0);
  const [hrLoading, setHrLoading] = useState(true);

  const reloadHourlyRate = useCallback(async () => {
    if (!user) return;
    setHrLoading(true);
    try {
      const profile = await getEconomyProfileExtended(user.uid);
      setHourlyRate(profile.hourlyRateSek);
    } finally {
      setHrLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reloadHourlyRate();
  }, [reloadHourlyRate]);

  const estimatedWeekPay = useMemo(() => {
    if (hourlyRate <= 0) return null;
    return Math.round(workStats.workHoursWeek * hourlyRate);
  }, [hourlyRate, workStats.workHoursWeek]);

  const statusLine = workStats.todayStatus.instamplad
    ? `Pågående pass sedan ${workStats.todayStatus.inTid} (${workStats.todayStatus.kat})`
    : `${workStats.weekTotal} h denna vecka`;

  if (workStats.loading || hrLoading) {
    return (
      <p className="flex items-center gap-2 text-sm text-text-dim">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Laddar veckodata…
      </p>
    );
  }

  if (workStats.error) {
    return <p className="text-sm text-danger">{workStats.error}</p>;
  }

  return (
    <div className="arbetsliv-delegate arbetsliv-delegate--flex" data-write-target="read_only">
      <BentoCard title="Tid & flex" glow="blue">
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
        <p className="mt-3 text-xs text-text-dim">
          Stämpla in/ut under fliken Stämpel. Lönespec finns under Valv (PIN).
        </p>
      </BentoCard>
    </div>
  );
}
