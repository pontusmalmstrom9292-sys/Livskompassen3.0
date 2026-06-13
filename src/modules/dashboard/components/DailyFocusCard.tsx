import React, { useEffect } from 'react';
import { useStore } from '../../core/store';
import { useMorningCompassStore } from '../../morning/morningStore';
import { Link } from 'react-router-dom';
import { Target, ArrowRight } from 'lucide-react';

export function DailyFocusCard() {
  const user = useStore((state) => state.user);
  const { threeFocusPoints, fetchFocusPoints, isLoading } = useMorningCompassStore();

  useEffect(() => {
    if (user?.uid) {
      fetchFocusPoints(user.uid);
    }
  }, [user?.uid, fetchFocusPoints]);

  const hasFocusPoints = threeFocusPoints.some((p) => p.trim() !== '');

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-lg h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-blue-300" />
        <h2 className="text-xl font-medium tracking-wide">Dagens Fokus</h2>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-white/10 rounded-xl" />
          ))}
        </div>
      ) : hasFocusPoints ? (
        <div className="space-y-4 flex-1">
          {threeFocusPoints.map((point, index) => (
            point.trim() !== '' && (
              <div 
                key={index}
                className="bg-white/10 border border-white/5 rounded-xl p-4 flex items-start gap-3 transition-colors hover:bg-white/15"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-sm font-medium flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <p className="text-white/90 leading-relaxed">{point}</p>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-white/5 rounded-xl border border-white/5 border-dashed">
          <p className="text-white/60 mb-4">Du har inte satt ditt fokus för idag än.</p>
          <Link 
            to="/kompasser" 
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium"
          >
            Öppna Morgonkompassen
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
