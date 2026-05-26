import { useCallback, useEffect, useState } from 'react';
import {
  getOpenTimeEntry,
  getWeekFlexDetail,
  getTodayTimeStatus,
  recordTimeIn,
  recordTimeOut,
  repairOpenTimeEntryFlags,
} from '../../core/firebase/timeEconomyFirestore';

export function useStampClock(userId: string | undefined) {
  const [status, setStatus] = useState({
    instamplad: false,
    inTid: '',
    kat: '',
    dagensTimmar: 0,
  });
  const [openEntryId, setOpenEntryId] = useState<string | null>(null);
  const [flexLeft, setFlexLeft] = useState(0);
  const [flexHint, setFlexHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      await repairOpenTimeEntryFlags(userId);
      const [today, flexDetail, open] = await Promise.all([
        getTodayTimeStatus(userId),
        getWeekFlexDetail(userId),
        getOpenTimeEntry(userId),
      ]);
      setStatus(today);
      setOpenEntryId(open?.id ?? null);
      setFlexLeft(flexDetail.flexLeft);
      setFlexHint(flexDetail.weekTypeLabel);
    } catch {
      setError('Kunde inte läsa stämpelklocka.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const isClockedIn = Boolean(openEntryId) || status.instamplad;

  const stamp = useCallback(
    async (type: 'IN' | 'UT') => {
      if (!userId) {
        setError('Logga in för att stämpla.');
        return false;
      }
      setBusy(true);
      setError(null);
      setSuccess(null);
      try {
        if (type === 'IN') {
          const created = await recordTimeIn(userId, 'Arbete');
          setOpenEntryId(created.id);
          setSuccess(`Instämplad ${created.clockIn}`);
        } else {
          const result = await recordTimeOut(userId, openEntryId ?? undefined);
          setOpenEntryId(null);
          setSuccess(`Utstämplad — ${result.hoursWorked} h`);
        }
        await reload();
        return true;
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'Stämpling misslyckades.';
        setError(
          msg.includes('permission') || msg.includes('Permission')
            ? 'Sparning nekad — deploya Firestore-regler (time_entries).'
            : msg,
        );
        return false;
      } finally {
        setBusy(false);
      }
    },
    [userId, openEntryId, reload],
  );

  return {
    status,
    flexLeft,
    flexHint,
    loading,
    busy,
    error,
    success,
    isClockedIn,
    reload,
    stamp,
    setError,
    setSuccess,
  };
}
