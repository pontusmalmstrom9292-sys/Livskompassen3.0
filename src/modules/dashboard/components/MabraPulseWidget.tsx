import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/core/store';
import { listMabraSessionsRecent, type CheckInRow } from '@/core/firebase/firestore';
import { useMabraStore } from '@/modules/features/dailyLife/wellbeing/mabra/store/mabraStore';
import { useMorningCompassStore } from '@/modules/morning/morningStore';
import type { MabraSession } from '@/core/types/firestore';
import { Heart, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

type TodaysSession = Pick<MabraSession, 'hubSymptom' | 'exerciseType' | 'createdAt'>;

export function MabraPulseWidget() {
  const user = useStore((s) => s.user);
  const { threeFocusPoints, fetchFocusPoints } = useMorningCompassStore();
  const latestCheckIn = useMabraStore((s) => s.latestCheckIn);
  const fetchLatestCheckIn = useMabraStore((s) => s.fetchLatestCheckIn);
  
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [todaysActivity, setTodaysActivity] = useState<{
    checkIn?: CheckInRow | null;
    session?: TodaysSession;
  }>({});

  useEffect(() => {
    if (user?.uid) {
      fetchFocusPoints(user.uid);
    }
  }, [user?.uid, fetchFocusPoints]);

  useEffect(() => {
    if (!user?.uid) {
      setIsCheckedIn(false);
      setLoading(false);
      return;
    }

    const checkStatus = async () => {
      setLoading(true);
      try {
        const today = new Date();
        const todayIsoStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        const [_, sessions] = await Promise.all([
          fetchLatestCheckIn(user.uid),
          listMabraSessionsRecent(user.uid, 5),
        ]);

        const storeCheckIn = useMabraStore.getState().latestCheckIn;
        const todaysCheckin = storeCheckIn && (() => {
          if (!storeCheckIn.createdAt) return null;
          const d = new Date(storeCheckIn.createdAt);
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          return dateStr === todayIsoStr ? storeCheckIn : null;
        })();

        const todaysSession = sessions.find((s) => {
          if (!s.createdAt) return false;
          const d = new Date(s.createdAt);
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          return dateStr === todayIsoStr;
        });

        setIsCheckedIn(!!todaysCheckin || !!todaysSession);
        setTodaysActivity({
          checkIn: todaysCheckin || undefined,
          session: todaysSession,
        });
      } catch (err) {
        console.error('Kunde inte läsa av MåBra-puls:', err);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user?.uid, fetchLatestCheckIn]);

  if (!user || loading) {
    return (
      <div className="dashboard-card w-full animate-pulse rounded-2xl border border-border/40 bg-surface-2 p-5">
        <div className="h-6 w-48 rounded bg-white/5" />
      </div>
    );
  }

  // TILLSTÅND 2: Incheckad (Minimalistisk sammanfattning)
  if (isCheckedIn) {
    const hasFocus = threeFocusPoints.some((p) => p && p.trim() !== '');
    const isMorningCompass = todaysActivity.checkIn?.questionId === 'compass_morning';
    const isMabraCheckin = todaysActivity.checkIn?.questionId === 'mabra_checkin';
    const isMabraSession = !!todaysActivity.session;

    return (
      <div className="dashboard-card flex w-full flex-col items-start justify-between gap-4 rounded-2xl border border-success/15 bg-surface-2/40 p-4 transition-[border-color,box-shadow] duration-300 focus-within:border-accent/35 focus-within:ring-1 focus-within:ring-accent/20 sm:flex-row sm:items-center">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 bg-success/10 rounded-xl text-success">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/90">
              {isMorningCompass 
                ? 'Morgonkompassen lagd' 
                : isMabraSession 
                ? 'MåBra-session genomförd' 
                : isMabraCheckin
                ? 'MåBra-incheckning klar'
                : 'Incheckad för idag'}
            </h3>
            
            <div className="text-xs text-text-muted mt-0.5 space-y-1">
              {isMabraCheckin && (
                <p className="text-text-muted">
                  Humör: <span className="font-semibold text-accent">{todaysActivity.checkIn?.mood}/10</span> • Energinivå: <span className="font-semibold text-accent-ai">{todaysActivity.checkIn?.energy}/10</span>
                </p>
              )}
              {todaysActivity.checkIn?.taskNote && (
                <p className="italic text-text-muted font-medium leading-relaxed">
                  "{todaysActivity.checkIn.taskNote}"
                </p>
              )}
              {isMabraSession && (
                <p className="text-text-muted">
                  Genomförde {todaysActivity.session?.exerciseType}-övning.
                </p>
              )}
              {hasFocus && (
                <p className="text-text-muted flex flex-wrap gap-x-2">
                  <span className="font-semibold text-text-muted/80">Fokus:</span>
                  <span>{threeFocusPoints.filter((p) => p && p.trim() !== '').join(' • ')}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        <Link
          to="/mabra"
          className="text-xs text-text-muted hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 shrink-0 self-end sm:self-auto"
        >
          Öppna MåBra
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // TILLSTÅND 1: Inte incheckad (Lugnande prompt)
  return (
    <div className="dashboard-card group flex w-full flex-col items-start justify-between gap-4 rounded-2xl border border-border/40 bg-surface-2 p-5 transition-all duration-300 hover:border-accent/30 hover:shadow-accent-glow focus-within:border-accent/35 focus-within:ring-1 focus-within:ring-accent/20 sm:flex-row sm:items-center">
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 bg-accent-ai/10 rounded-xl text-accent-ai animate-pulse shrink-0">
          <Heart className="w-5 h-5 fill-accent-ai/20" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/95 leading-normal">Hur mår du just nu?</h3>
          <p className="text-xs text-text-muted group-hover:text-text-muted transition-colors mt-0.5">
            {latestCheckIn && latestCheckIn.mood !== undefined && latestCheckIn.energy !== undefined ? (
              <>
                Senaste: Humör {latestCheckIn.mood}/10 • Energinivå {latestCheckIn.energy}/10
              </>
            ) : (
              'Ta en kort stund för en incheckning eller en kravlös övning.'
            )}
          </p>
        </div>
      </div>

      <Link
        to="/mabra"
        className="text-xs font-semibold text-accent-ai bg-accent-ai/10 hover:bg-accent-ai/20 border border-accent-ai/20 hover:border-accent-ai/30 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-sm shadow-accent-ai/5"
      >
        Checka in
        <Sparkles className="w-3.5 h-3.5 text-accent-ai" />
      </Link>
    </div>
  );
}
