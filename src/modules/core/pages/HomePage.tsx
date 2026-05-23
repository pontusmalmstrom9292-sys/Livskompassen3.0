import { useState } from 'react';
import { ClusterGrid } from '../ui/ClusterGrid';
import { AdaptiveMemoryCards } from '../home/AdaptiveMemoryCards';
import { StampClockWidget } from '../../stampla';
import { HomeHeroCompass } from '../home/HomeHeroCompass';
import { DailyCompassAdvice } from '../home/DailyCompassAdvice';
import { useStore } from '../store';

export function HomePage() {
  const [cardRefreshKey, setCardRefreshKey] = useState(0);
  const safeMode = useStore((s) => s.ui.safeMode);

  return (
    <div className="home-page space-y-3.5">
      <DailyCompassAdvice />
      <HomeHeroCompass onCheckInSaved={() => setCardRefreshKey((k) => k + 1)} />

      {!safeMode && <StampClockWidget />}

      {!safeMode && <AdaptiveMemoryCards refreshKey={cardRefreshKey} />}

      {!safeMode && (
        <section aria-label="Livsområden">
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <p className="text-[9px] uppercase tracking-widest text-text-dim">Livsområden</p>
            <p className="text-[9px] text-text-dim">Svep →</p>
          </div>
          <ClusterGrid />
        </section>
      )}
    </div>
  );
}
