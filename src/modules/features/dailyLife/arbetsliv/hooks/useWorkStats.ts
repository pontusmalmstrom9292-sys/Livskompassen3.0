/**
 * useWorkStats — Arbetsliv-domänens publika hook-kontrakt för arbetsstatistik.
 *
 * Kapslar in alla anrop mot arbetslivFirestore och exponerar ett rent,
 * stabilt gränssnitt som andra domäner (t.ex. Ekonomi) kan konsumera utan
 * att direkt importera Firestore-funktioner från Arbetsliv-silon.
 *
 * ✅ Importeras av: features/dailyLife/wellbeing/economy/components/TimeAndPayPanel
 * ❌ Importera INTE arbetslivFirestore direkt från ekonomidomänen — använd denna hook.
 */

import { useCallback, useEffect, useState } from 'react';
import {
  getOpenTimeEntry,
  getTodayTimeStatus,
  getWeekFlexDetail,
  getWeekTimeStats,
} from '@/core/firebase/arbetslivFirestore';

// ─── Publikt kontrakt ─────────────────────────────────────────────────────────

export interface WorkStatsToday {
  /** Om användaren är instämplad just nu. */
  instamplad: boolean;
  /** Instämplingstid (HH:MM) om instämplad, annars tom sträng. */
  inTid: string;
  /** Aktiv kategori om instämplad, annars tom sträng. */
  kat: string;
  /** Ackumulerade timmar idag (stängda pass). */
  dagensTimmar: number;
}

export interface WorkStatsResult {
  /** Dagsstatus: instämplad, tid, kategori, dagensTimmar. */
  todayStatus: WorkStatsToday;
  /** Totalt arbetade timmar denna ISO-vecka (alla kategorier). */
  weekTotal: number;
  /** Antal timmar kvar till veckomålet (negativt = övertid). */
  flexLeft: number;
  /** Veckomålet i timmar (jämn/ojämn vecka). */
  flexTarget: number;
  /** Arbetade timmar (exkl. flex-kategorier) denna vecka. */
  workHoursWeek: number;
  /** Etikett för veckotyp, t.ex. "Jämn vecka (40 h)". */
  weekTypeLabel: string;
  /** true under initial datahämtning. */
  loading: boolean;
  /** true under tyst bakgrundsuppdatering (efter stämpling). */
  refreshing: boolean;
  /** Felmeddelande, eller null om allt är ok. */
  error: string | null;
  /** Utlöser en full omladdning av all arbetsstatistik. */
  reload: (opts?: { silent?: boolean }) => Promise<void>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

const DEFAULT_TODAY: WorkStatsToday = {
  instamplad: false,
  inTid: '',
  kat: '',
  dagensTimmar: 0,
};

export function useWorkStats(userId: string | undefined): WorkStatsResult {
  const [todayStatus, setTodayStatus] = useState<WorkStatsToday>(DEFAULT_TODAY);
  const [weekTotal, setWeekTotal] = useState(0);
  const [flexLeft, setFlexLeft] = useState(0);
  const [flexTarget, setFlexTarget] = useState(40);
  const [workHoursWeek, setWorkHoursWeek] = useState(0);
  const [weekTypeLabel, setWeekTypeLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!userId) return;

      if (opts?.silent) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const [today, week, flexDetail, open] = await Promise.all([
          getTodayTimeStatus(userId),
          getWeekTimeStats(userId),
          getWeekFlexDetail(userId),
          getOpenTimeEntry(userId),
        ]);

        // Basdata från stängda pass
        setTodayStatus(today);
        setWeekTotal(week.total);
        setFlexTarget(flexDetail.flexTarget);
        setWeekTypeLabel(flexDetail.weekTypeLabel);
        setWorkHoursWeek(flexDetail.workHoursWeek);
        setFlexLeft(flexDetail.flexLeft);

        // Överskrid med öppet pass om det finns (mer aktuell instämplingsstatus)
        if (open) {
          setTodayStatus((prev) => ({
            ...prev,
            instamplad: true,
            inTid: open.clockIn,
            kat: open.category,
          }));
        }
      } catch {
        setError('Kunde inte läsa arbetsstatistik.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    todayStatus,
    weekTotal,
    flexLeft,
    flexTarget,
    workHoursWeek,
    weekTypeLabel,
    loading,
    refreshing,
    error,
    reload,
  };
}
