import { useState } from 'react';
import { ClusterGrid } from '../ui/ClusterGrid';
import { AdaptiveMemoryCards } from '../home/AdaptiveMemoryCards';
import { HomeHeroCompass } from '../home/HomeHeroCompass';

export function HomePage() {
  const [cardRefreshKey, setCardRefreshKey] = useState(0);

  return (
    <div className="home-page space-y-6">
      <HomeHeroCompass onCheckInSaved={() => setCardRefreshKey((k) => k + 1)} />

      <AdaptiveMemoryCards refreshKey={cardRefreshKey} />

      <section aria-label="Livsområden">
        <p className="mb-3 text-[10px] uppercase tracking-widest text-text-dim">Livsområden</p>
        <ClusterGrid />
      </section>
    </div>
  );
}
