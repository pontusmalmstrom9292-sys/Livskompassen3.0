import { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { useStore } from '@/core/store';
import { getJournalEntries } from '@/core/firebase/firestore';

export function WeeklyPulseWidget() {
  const user = useStore(s => s.user);
  const [scores, setScores] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchPulse = async () => {
      setLoading(true);
      try {
        const entries = await getJournalEntries(user.uid); // Get entries
        const now = new Date();

        // Filter and map entries to the last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (6 - i));
          // Use local time offset to get correct YYYY-MM-DD
          const offset = d.getTimezoneOffset() * 60000;
          const localDate = new Date(d.getTime() - offset);
          return localDate.toISOString().slice(0, 10);
        });

        // Initialize score map
        const scoreMap: Record<string, number> = {};

        entries.forEach(e => {
          if (e.mood === 'physiology') {
            const dateObj = new Date(e.createdAt);
            const offset = dateObj.getTimezoneOffset() * 60000;
            const localDate = new Date(dateObj.getTime() - offset);
            const dateStr = localDate.toISOString().slice(0, 10);

            if (last7Days.includes(dateStr)) {
              // Extract energy score from tags, e.g., 'energy:8'
              const energyTag = e.tags?.find(t => t.startsWith('energy:'));
              if (energyTag) {
                const score = parseInt(energyTag.split(':')[1], 10);
                if (!isNaN(score)) {
                  if (scoreMap[dateStr] === undefined) {
                    scoreMap[dateStr] = score; // first found is most recent because entries are sorted descending
                  }
                }
              }
            }
          }
        });

        const newScores = last7Days.map(dateStr => scoreMap[dateStr] ?? 0);
        setScores(newScores);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPulse();
  }, [user?.uid]);

  return (
    <div className="dashboard-card calm-card glow-bottom-green space-y-4 rounded-2xl p-4 transition-[border-color,box-shadow] focus-within:border-accent/35 focus-within:ring-1 focus-within:ring-accent/20 sm:p-5">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted flex items-center gap-2">
        <Activity className="h-3.5 w-3.5" />
        Veckans Energi
      </h3>

      {loading ? (
        <div className="h-24 w-full animate-pulse bg-white/5 rounded-xl" />
      ) : (
        <div className="flex h-24 items-end justify-between gap-1">
          {scores.map((score, i) => {
            const height = score > 0 ? `${(score / 10) * 100}%` : '4px';
            const opacity = score > 0 ? 1 : 0.2;
            const daysAgo = 6 - i;
            const isToday = daysAgo === 0;

            return (
              <div key={i} className="flex flex-col items-center justify-end h-full w-full gap-2">
                <div 
                  className={`w-full max-w-[20px] rounded-sm transition-all duration-500 ${isToday ? 'bg-accent' : 'bg-accent/40'}`}
                  style={{ height, opacity }}
                  title={score > 0 ? `Energi: ${score}/10` : 'Ingen data'}
                />
              </div>
            );
          })}
        </div>
      )}
      <div className="flex justify-between text-[10px] uppercase tracking-widest text-text-muted px-1">
        <span>6 dgr</span>
        <span>Idag</span>
      </div>
    </div>
  );
}
