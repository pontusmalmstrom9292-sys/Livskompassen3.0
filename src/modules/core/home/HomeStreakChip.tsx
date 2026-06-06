import { useCallback, useEffect, useState } from 'react';
import { Flame } from 'lucide-react';
import { useStore } from '../store';
import { getRecentCheckIns } from '../firebase/firestore';

/** Liten närvaro-indikator — dagar med check-in (dold utan data, ingen streak-gamification). */
export function HomeStreakChip() {
  const user = useStore((s) => s.user);
  const [streak, setStreak] = useState(0);

  const load = useCallback(async () => {
    if (!user) {
      setStreak(0);
      return;
    }
    try {
      const checkins = await getRecentCheckIns(user.uid, 168);
      const days = new Set(
        checkins.map((c) => {
          const d = c.createdAt ? new Date(c.createdAt) : new Date();
          return d.toISOString().slice(0, 10);
        }),
      );
      setStreak(days.size);
    } catch {
      setStreak(0);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  if (!user || streak < 1) return null;

  return (
    <div className="home-streak-chip" aria-label={`Närvaro: ${streak} dagar med check-in`}>
      <Flame className="home-streak-chip__icon" strokeWidth={1.5} aria-hidden />
      <span className="home-streak-chip__value tabular-nums">{streak}</span>
      <span className="home-streak-chip__label">Närvaro</span>
    </div>
  );
}
