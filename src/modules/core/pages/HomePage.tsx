import { useState } from 'react';
import { AdaptiveMemoryCards } from '../home/AdaptiveMemoryCards';
import { HomeHeroCompass } from '../home/HomeHeroCompass';

export function HomePage() {
  const [cardRefreshKey, setCardRefreshKey] = useState(0);

  return (
    <div className="home-page space-y-6">
      <HomeHeroCompass onCheckInSaved={() => setCardRefreshKey((k) => k + 1)} />

      <AdaptiveMemoryCards refreshKey={cardRefreshKey} />
    </div>
  );
}
