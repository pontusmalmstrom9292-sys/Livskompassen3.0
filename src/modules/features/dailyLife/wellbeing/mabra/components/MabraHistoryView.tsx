import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/core/store';
import { useMabraHistoryStore } from '../store/mabraHistoryStore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Smile, Zap, Loader2, AlertCircle, Calendar } from 'lucide-react';

export function MabraHistoryView() {
  const user = useStore((s) => s.user);
  const userId = user?.uid;

  const { history, isLoading, error, fetchHistory } = useMabraHistoryStore();
  const [limitCount, setLimitCount] = useState(30);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    const el = chartContainerRef.current;
    if (!el) return;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      setChartReady(width > 0 && height > 0);
    };
    update();
    if (typeof ResizeObserver === 'undefined') {
      const id = window.requestAnimationFrame(update);
      return () => window.cancelAnimationFrame(id);
    }
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [history.length, limitCount]);

  useEffect(() => {
    if (userId) {
      fetchHistory(userId, limitCount);
    }
  }, [userId, fetchHistory, limitCount]);

  if (isLoading && history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-text-muted">
        <Loader2 className="w-8 h-8 animate-spin text-accent mb-3" />
        <p className="text-sm font-sans">Laddar historik...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-xl bg-danger/10 border border-danger/20 text-danger flex items-start gap-3 my-4">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-sm">Ett fel uppstod</h4>
          <p className="text-xs opacity-90 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  // Förbered data för diagrammet (vänd historiken så den läses kronologiskt från vänster till höger)
  const chartData = [...history]
    .reverse()
    .map((item) => {
      const date = new Date(item.createdAt);
      const formattedDate = isNaN(date.getTime())
        ? ''
        : date.toLocaleDateString('sv-SE', { month: 'short', day: 'numeric' });
      const formattedTime = isNaN(date.getTime())
        ? ''
        : date.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' });

      return {
        ...item,
        chartDate: formattedDate,
        chartTime: formattedTime,
        energy: typeof item.energy === 'number' ? item.energy : 0,
        mood: typeof item.mood === 'number' ? item.mood : 0,
      };
    });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-md text-left max-w-xs relative z-[100] text-text">
          <p className="text-xs text-text-muted mb-2 font-mono flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {data.chartDate} kl {data.chartTime}
          </p>
          <div className="space-y-1.5">
            <p className="text-sm font-medium flex items-center gap-1.5 text-accent-light">
              <Zap className="w-4 h-4 fill-amber-400/20" />
              Energi: {data.energy} / 10
            </p>
            <p className="text-sm font-medium flex items-center gap-1.5 text-success">
              <Smile className="w-4 h-4 fill-emerald-400/20" />
              Humör: {data.mood} / 10
            </p>
            {data.taskNote && (
              <div className="pt-2 border-t border-white/5 mt-2">
                <p className="text-xs text-text-muted italic leading-relaxed">
                  "{data.taskNote}"
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="calm-card border border-border/20 bg-surface-2/40 rounded-3xl p-6 shadow-indigo-glow relative overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-display-serif text-lg text-accent tracking-wide flex items-center gap-2">
            MåBra Historik
          </h3>
          <p className="text-xs text-text-muted font-sans mt-0.5">
            Följ ditt välbefinnande över tid baserat på energi och humör.
          </p>
        </div>

        {/* Filterknappar */}
        <div className="flex bg-surface-3/50 border border-border/10 rounded-xl p-0.5 text-xs">
          {[7, 14, 30, 50].map((val) => (
            <button
              key={val}
              onClick={() => setLimitCount(val)}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                limitCount === val
                  ? 'bg-accent/20 text-accent border border-accent/25'
                  : 'text-text-muted hover:text-text hover:bg-surface/30 border border-transparent'
              }`}
            >
              {val} d
            </button>
          ))}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-text-muted">
          <Smile className="w-12 h-12 stroke-[1.2] opacity-40 mb-3 text-accent" />
          <p className="text-sm font-sans max-w-xs">
            Inga incheckningar hittades för den här perioden. Gör en incheckning för att börja se din historik.
          </p>
        </div>
      ) : (
        <div ref={chartContainerRef} className="h-72 w-full mt-2 relative">
          {chartReady ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-light)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--accent-light)" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--success)" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="var(--success)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
              <XAxis 
                dataKey="chartDate" 
                stroke="var(--text-dim)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dy={10}
              />
              <YAxis 
                domain={[0, 10]} 
                ticks={[0, 2, 4, 6, 8, 10]}
                stroke="var(--text-dim)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false}
                dx={-5}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 1 }} />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                iconSize={8}
                formatter={(value) => <span className="text-xs text-text-muted hover:text-text transition-colors font-sans">{value}</span>}
              />
              <Line
                type="monotone"
                name="Energi"
                dataKey="energy"
                stroke="var(--accent-light)"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 1, stroke: 'var(--accent-light)', fill: 'var(--surface-2)' }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                connectNulls
              />
              <Line
                type="monotone"
                name="Humör"
                dataKey="mood"
                stroke="var(--success)"
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 1, stroke: 'var(--success)', fill: 'var(--surface-2)' }}
                activeDot={{ r: 5, strokeWidth: 0 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-text-dim">
              Förbereder diagram…
            </div>
          )}
        </div>
      )}
    </div>
  );
}
