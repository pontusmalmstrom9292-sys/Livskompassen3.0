import { useState } from 'react';
import { AdaptiveMemoryCards } from '../home/AdaptiveMemoryCards';
import { HomeHeroKanon } from '../home/HomeHeroKanon';
import { PlaneringHomePinCard } from '../../admin/planning/components/PlaneringHomePinCard';
import { StampClockHomeSection, isStampOnHomeScreenEnabled } from '../../admin/stampla';
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

      {isAuthenticated && isStampOnHomeScreenEnabled() && <StampClockHomeSection />}

      {materialEnabled(preset, 'home_inkast') && <InkastLiteCard />}

      <PlaneringHomePinCard />

      {materialEnabled(preset, 'home_adaptive_cards') && (
        <AdaptiveMemoryCards refreshKey={cardRefreshKey} presetId={presetId} />
      )}
    </div>
  );
}
