import { useState } from 'react';
import { ClusterGrid } from '../ui/ClusterGrid';
import { AdaptiveMemoryCards } from '../home/AdaptiveMemoryCards';
import { HomeHeroCompass } from '../home/HomeHeroCompass';
import { DailyCompassAdvice } from '../home/DailyCompassAdvice';
import { useStore } from '../store';

export function HomePage() {
  const [cardRefreshKey, setCardRefreshKey] = useState(0);
  const safeMode = useStore((s) => s.ui.safeMode);

  return (
    <div className="home-page space-y-6">
      <DailyCompassAdvice />
      <HomeHeroCompass onCheckInSaved={() => setCardRefreshKey((k) => k + 1)} />

      {!safeMode && <AdaptiveMemoryCards refreshKey={cardRefreshKey} />}

      {!safeMode && (
        <section aria-label="Livsområden">
          <p className="mb-3 text-[10px] uppercase tracking-widest text-text-dim">Livsområden</p>
          <ClusterGrid />
        </section>
      )}
    </div>
  );
}
