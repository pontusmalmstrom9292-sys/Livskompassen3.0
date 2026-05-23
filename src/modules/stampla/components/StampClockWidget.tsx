import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Loader2 } from 'lucide-react';
import { BentoCard } from '../../core/ui/BentoCard';
import { useStore } from '../../core/store';
import {
  getEconomyProfileExtended,
  getFlexHoursRemaining,
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
  const [flexLeft, setFlexLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [today, profile] = await Promise.all([
        getTodayTimeStatus(user.uid),
        getEconomyProfileExtended(user.uid),
      ]);
      setStatus(today);
      setFlexLeft(await getFlexHoursRemaining(user.uid, profile.flexHoursTarget));
    } catch {
      setError('Kunde inte läsa stämpelklocka.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const stamp = async (type: 'IN' | 'UT') => {
    if (!user) return;
    setBusy(true);
    setError(null);
    try {
      if (type === 'IN') await recordTimeIn(user.uid, 'Arbete');
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
      title="Stämpelklocka"
      icon={<Clock className="h-4 w-4" />}
      description={
        status.instamplad
          ? `Instämplad ${status.inTid} · ${status.kat}`
          : `${status.dagensTimmar} h idag · ${flexLeft} h flex kvar`
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
            disabled={busy || status.instamplad}
            onClick={() => void stamp('IN')}
            className="btn-pill--primary text-sm disabled:opacity-40"
          >
            Stämpla in
          </button>
          <button
            type="button"
            disabled={busy || !status.instamplad}
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
