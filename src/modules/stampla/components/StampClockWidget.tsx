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
  repairOpenTimeEntryFlags,
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
  const [success, setSuccess] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      await repairOpenTimeEntryFlags(user.uid);
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

  const isClockedIn = Boolean(openEntryId) || status.instamplad;

  const stamp = async (type: 'IN' | 'UT') => {
    if (!user) {
      setError('Logga in för att stämpla.');
      return;
    }
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      if (type === 'IN') {
        const created = await recordTimeIn(user.uid, 'Arbete');
        setOpenEntryId(created.id);
        setSuccess(`Instämplad ${created.clockIn}`);
      } else {
        const result = await recordTimeOut(user.uid, openEntryId ?? undefined);
        setOpenEntryId(null);
        setSuccess(`Utstämplad — ${result.hoursWorked} h räknades`);
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

  if (!user) {
    return (
      <BentoCard title="Stämpelklocka" icon={<Clock className="h-4 w-4" />}>
        <p className="text-sm text-text-muted">Logga in under Konto för att stämpla.</p>
      </BentoCard>
    );
  }

  return (
    <BentoCard
      title="Stämpelklocka"
      icon={<Clock className="h-4 w-4" />}
      description={
        isClockedIn
          ? `Instämplad sedan ${status.inTid || '—'} · ${status.kat || 'Arbete'}`
          : `${status.dagensTimmar} h idag · ${flexLeft} h flex kvar${flexHint ? ` (${flexHint})` : ''}`
      }
    >
      {error && (
        <p className="mb-2 rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}
      {success && !error && (
        <p className="mb-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
          {success}
        </p>
      )}

      {loading ? (
        <p className="flex items-center gap-2 text-sm text-text-dim">
          <Loader2 className="h-4 w-4 animate-spin" /> Laddar…
        </p>
      ) : (
        <>
          <p className="mb-2 text-[10px] uppercase tracking-widest text-text-dim">
            {isClockedIn ? 'Pågående pass' : 'Inte instämplad'}
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={busy || isClockedIn}
              onClick={() => void stamp('IN')}
              className={`text-sm ${
                isClockedIn || busy ? 'btn-pill--ghost opacity-40' : 'btn-pill--primary'
              }`}
            >
              {busy && !isClockedIn ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                'Stämpla in'
              )}
            </button>
            <button
              type="button"
              disabled={busy || !isClockedIn}
              onClick={() => void stamp('UT')}
              className={`text-sm ${
                isClockedIn && !busy ? 'btn-pill--success-solid' : 'btn-pill--ghost opacity-40'
              }`}
            >
              {busy && isClockedIn ? (
                <Loader2 className="mx-auto h-4 w-4 animate-spin" />
              ) : (
                'Stämpla ut'
              )}
            </button>
          </div>
        </>
      )}
      <Link to="/stampla" className="mt-3 inline-block text-xs text-accent hover:underline">
        Öppna full vy →
      </Link>
    </BentoCard>
  );
}
