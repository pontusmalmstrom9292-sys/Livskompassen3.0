import { useState } from 'react';
import { AdaptiveMemoryCards } from '../home/AdaptiveMemoryCards';
import { HomeHeroKanon } from '../home/HomeHeroKanon';
import { HomeQuickModules } from '../home/HomeQuickModules';
import { PlaneringHomePinCard } from '../../admin/planning/components/PlaneringHomePinCard';
import { StampClockHomeSection } from '../../admin/stampla';
import { InkastLiteCard } from '../../inkast';
import { materialEnabled, useLifeHubPreset } from '../lifeOs';
import { useStore } from '../store';

export function HomePage() {
  const [cardRefreshKey, setCardRefreshKey] = useState(0);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const { preset, presetId } = useLifeHubPreset();

  return (
    <div className="home-page home-page--kanon home-page--scenic space-y-6">
      {materialEnabled(preset, 'home_hero_checkin') && (
        <HomeHeroKanon onCheckInSaved={() => setCardRefreshKey((k) => k + 1)} />
      )}

      {isAuthenticated && materialEnabled(preset, 'home_stamp') && <StampClockHomeSection />}

      {materialEnabled(preset, 'home_inkast') && <InkastLiteCard />}

      <PlaneringHomePinCard />

      {materialEnabled(preset, 'home_adaptive_cards') && (
        <AdaptiveMemoryCards refreshKey={cardRefreshKey} presetId={presetId} />
      )}

      {materialEnabled(preset, 'home_snabbval') && (
        <details className="home-more">
          <summary className="home-more__summary">Snabbval</summary>
          <HomeQuickModules onSaved={() => setCardRefreshKey((k) => k + 1)} />
        </details>
      )}
    </div>
  );
}
