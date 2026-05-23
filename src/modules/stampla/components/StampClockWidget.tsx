import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Loader2 } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import {
  getOpenTimeEntry,
  getWeekFlexDetail,
  getTodayTimeStatus,
  recordTimeIn,
  recordTimeOut,
} from '../../core/firebase/timeEconomyFirestore';

export function StampClockWidget() {
  const user = useStore((s) => s.user);
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

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [today, flexDetail, open] = await Promise.all([
        getTodayTimeStatus(user.uid),
        getWeekFlexDetail(user.uid),
        getOpenTimeEntry(user.uid),
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
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const canStampOut = status.instamplad || openEntryId != null;

  const stamp = async (type: 'IN' | 'UT') => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      if (type === 'IN') {
        const created = await recordTimeIn(user.uid, 'Arbete');
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
    <BentoCard
      title="Stämpelklocka"
      icon={<Clock className="h-4 w-4" />}
      description={
        status.instamplad
          ? `Instämplad ${status.inTid} · ${status.kat}`
          : `${status.dagensTimmar} h idag · ${flexLeft} h flex kvar${flexHint ? ` (${flexHint})` : ''}`
      }
    >
      {error && <p className="mb-2 text-sm text-danger">{error}</p>}
      {loading ? (
        <p className="flex items-center gap-2 text-sm text-text-dim">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={busy || status.instamplad || openEntryId != null}
            onClick={() => void stamp('IN')}
            className="btn-pill--primary text-sm disabled:opacity-40"
          >
            Stämpla in
          </button>
          <button
            type="button"
            disabled={busy || !canStampOut}
            onClick={() => void stamp('UT')}
            className="btn-pill--ghost text-sm disabled:opacity-40"
          >
            Stämpla ut
          </button>
        </div>
      )}
      <Link to="/stampla" className="mt-3 inline-block text-xs text-accent-primary hover:underline">
        Öppna full vy →
      </Link>
    </BentoCard>
  );
}
