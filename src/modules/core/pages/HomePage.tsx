import { useState } from 'react';
import { AdaptiveMemoryCards } from '../home/AdaptiveMemoryCards';
import { HomeHeroKanon } from '../home/HomeHeroKanon';
import { HomeQuickModules } from '../home/HomeQuickModules';

export function HomePage() {
  const [cardRefreshKey, setCardRefreshKey] = useState(0);

  return (
    <div className="home-page home-page--kanon home-page--scenic space-y-6">
      <HomeHeroKanon onCheckInSaved={() => setCardRefreshKey((k) => k + 1)} />

      <AdaptiveMemoryCards refreshKey={cardRefreshKey} />

      <details className="home-more">
        <summary className="home-more__summary">Snabbval</summary>
        <HomeQuickModules onSaved={() => setCardRefreshKey((k) => k + 1)} />
      </details>
    </div>
  );
}
