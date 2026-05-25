import { useState } from 'react';
import { AdaptiveMemoryCards } from '../home/AdaptiveMemoryCards';
import { HomeHeroKanon } from '../home/HomeHeroKanon';
import { HomeQuickModules } from '../home/HomeQuickModules';
import { StampClockWidget } from '../../stampla';
import { useStore } from '../store';

export function HomePage() {
  const [cardRefreshKey, setCardRefreshKey] = useState(0);
  const isAuthenticated = useStore((s) => s.isAuthenticated);

  return (
    <div className="home-page home-page--kanon home-page--scenic space-y-6">
      <HomeHeroKanon onCheckInSaved={() => setCardRefreshKey((k) => k + 1)} />

      {isAuthenticated && <StampClockWidget />}

      <AdaptiveMemoryCards refreshKey={cardRefreshKey} />

      <details className="home-more">
        <summary className="home-more__summary">Snabbval</summary>
        <HomeQuickModules onSaved={() => setCardRefreshKey((k) => k + 1)} />
      </details>
    </div>
  );
}
