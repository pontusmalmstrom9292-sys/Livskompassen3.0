import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/core/store';
import { getRecentCheckIns, listMabraSessionsRecent } from '@/core/firebase/firestore';
import { useMorningCompassStore } from '@/modules/morning/morningStore';
import { Heart, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

export function MabraPulseWidget() {
  const user = useStore((s) => s.user);
  const { threeFocusPoints, fetchFocusPoints } = useMorningCompassStore();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [todaysActivity, setTodaysActivity] = useState<{
    checkIn?: any;
    session?: any;
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

        const [checkins, sessions] = await Promise.all([
          getRecentCheckIns(user.uid, 10),
          listMabraSessionsRecent(user.uid, 5),
        ]);

        const todaysCheckin = checkins.find((c) => {
          if (!c.createdAt) return false;
          const d = new Date(c.createdAt);
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          return dateStr === todayIsoStr;
        });

        const todaysSession = sessions.find((s) => {
          if (!s.createdAt) return false;
          const d = new Date(s.createdAt);
          const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          return dateStr === todayIsoStr;
        });

        setIsCheckedIn(!!todaysCheckin || !!todaysSession);
        setTodaysActivity({
          checkIn: todaysCheckin,
          session: todaysSession,
        });
      } catch (err) {
        console.error('Kunde inte läsa av MåBra-puls:', err);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [user?.uid]);

  if (!user || loading) {
    return (
      <div className="w-full bg-surface-2 border border-border/40 rounded-2xl p-5 animate-pulse">
        <div className="h-6 w-48 bg-white/5 rounded" />
      </div>
    );
  }

  // TILLSTÅND 2: Incheckad (Minimalistisk sammanfattning)
  if (isCheckedIn) {
    const hasFocus = threeFocusPoints.some((p) => p && p.trim() !== '');
    const isMorningCompass = todaysActivity.checkIn?.questionId === 'compass_morning';
    const isMabraSession = !!todaysActivity.session;

    return (
      <div className="w-full bg-surface-2/40 border border-success/15 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300">
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
                : 'Incheckad för idag'}
            </h3>
            
            <div className="text-xs text-text-muted mt-0.5 space-y-1">
              {isMorningCompass && todaysActivity.checkIn?.taskNote && (
                <p className="italic text-text-dim font-medium leading-relaxed">
                  "{todaysActivity.checkIn.taskNote}"
                </p>
              )}
              {isMabraSession && (
                <p className="text-text-dim">
                  Genomförde {todaysActivity.session.exerciseType}-övning.
                </p>
              )}
              {hasFocus && (
                <p className="text-text-dim flex flex-wrap gap-x-2">
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
    <div className="w-full bg-surface-2 border border-border/40 rounded-2xl p-5 hover:shadow-accent-glow hover:border-accent/30 transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
      <div className="flex items-center gap-3.5">
        <div className="p-2.5 bg-accent-ai/10 rounded-xl text-accent-ai animate-pulse shrink-0">
          <Heart className="w-5 h-5 fill-accent-ai/20" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white/95 leading-normal">Hur mår du just nu?</h3>
          <p className="text-xs text-text-dim group-hover:text-text-muted transition-colors mt-0.5">
            Ta en kort stund för en incheckning eller en kravlös övning.
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
