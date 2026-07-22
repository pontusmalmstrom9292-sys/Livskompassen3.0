import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { useStore } from '@/core/store';
import { EmptyState } from '@/core/ui/EmptyState';
import { useMabraHistoryStore } from '../store/mabraHistoryStore';
import { Smile, Loader2, AlertCircle } from 'lucide-react';

const MabraHistoryChartLazy = lazy(() =>
  import('./MabraHistoryChart').then((m) => ({ default: m.MabraHistoryChart })),
);

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
      <div
        className="flex flex-col items-center justify-center py-12 text-text-muted"
        aria-busy="true"
      >
        <Loader2 className="mb-3 h-8 w-8 animate-spin text-accent" aria-hidden />
        <p className="font-sans text-sm">Laddar historik…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="my-4 flex items-start gap-3 rounded-xl border border-danger/20 bg-danger/10 p-4 text-danger"
      >
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
        <div>
          <h4 className="text-sm font-semibold">Ett fel uppstod</h4>
          <p className="mt-1 text-xs opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  if (!isLoading && history.length === 0) {
    return (
      <EmptyState
        title="Ingen historik"
        message="Ingen MåBra-historik ännu. Logga humör eller energi efter en session så visas trender här."
      />
    );
  }

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

  return (
    <div className="calm-card relative overflow-hidden rounded-3xl border border-border/20 bg-surface-2/40 p-6 transition-all duration-300">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-display-serif text-[11px] font-medium uppercase tracking-[0.2em] text-accent">
            MåBra Historik
          </h3>
          <p className="mt-1 font-sans text-xs leading-relaxed text-text-muted">
            Följ ditt välbefinnande över tid baserat på energi och humör.
          </p>
        </div>

        <div className="flex bg-surface-3/50 border border-border/10 rounded-xl p-0.5 text-xs" role="group" aria-label="Historikperiod">
          {[7, 14, 30, 50].map((val) => (
            <button
              key={val}
              type="button"
              aria-label={`Visa ${val} dagar`}
              aria-pressed={limitCount === val}
              onClick={() => setLimitCount(val)}
              className={`inline-flex min-h-11 items-center justify-center rounded-lg px-3 font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 ${
                limitCount === val
                  ? 'border border-accent/25 bg-accent/20 text-accent'
                  : 'border border-transparent text-text-muted hover:bg-surface/30 hover:text-text'
              }`}
            >
              {val} d
            </button>
          ))}
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Smile className="mb-3 h-12 w-12 stroke-[1.2] text-accent opacity-40" aria-hidden />
          <EmptyState message="Inga incheckningar för den här perioden. Gör en incheckning för att börja se historiken." />
        </div>
      ) : (
        <div ref={chartContainerRef} className="h-72 w-full mt-2 relative">
          {chartReady ? (
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center text-xs text-text-muted">
                  Laddar diagram…
                </div>
              }
            >
              <MabraHistoryChartLazy chartData={chartData} />
            </Suspense>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-text-muted">
              Förbereder diagram…
            </div>
          )}
        </div>
      )}
    </div>
  );
}
