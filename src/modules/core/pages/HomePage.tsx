import { useState } from 'react';
import { AdaptiveMemoryCards } from '../home/AdaptiveMemoryCards';
import { HomeHeroKanon } from '../home/HomeHeroKanon';
import { PlaneringHomePinCard } from '@/features/admin/planning/components/PlaneringHomePinCard';
import { StampClockHomeSection, isStampOnHomeScreenEnabled } from '@/features/admin/stampla';
import { InkastLiteCard } from '../../inkast';
import { CapturePanel, ReviewQueuePanel } from '../../capture';
import { materialEnabled, useLifeHubPreset } from '../lifeOs';
import { useStore } from '../store';

export function HomePage() {
  const [cardRefreshKey, setCardRefreshKey] = useState(0);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const { preset, presetId } = useLifeHubPreset();

  return (
    <div className="home-page home-page--kanon home-page--scenic space-y-4">
      {materialEnabled(preset, 'home_hero_checkin') && (
        <HomeHeroKanon onCheckInSaved={() => setCardRefreshKey((k) => k + 1)} />
      )}

      {isAuthenticated && isStampOnHomeScreenEnabled() && <StampClockHomeSection />}

      {materialEnabled(preset, 'home_inkast') && isAuthenticated && (
        <>
          <CapturePanel sourceModule="hem_capture" />
          <ReviewQueuePanel />
        </>
      )}

      {materialEnabled(preset, 'home_inkast') && !isAuthenticated && <InkastLiteCard />}

      <PlaneringHomePinCard />

      {materialEnabled(preset, 'home_adaptive_cards') && (
        <AdaptiveMemoryCards refreshKey={cardRefreshKey} presetId={presetId} />
      )}
    </div>
  );
}
