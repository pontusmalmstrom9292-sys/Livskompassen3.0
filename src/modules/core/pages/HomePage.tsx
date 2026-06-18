import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { VALV_SAMLA_GRANSKA_LINK } from '@/modules/inkast/api/inkastService';
import { clsx } from 'clsx';
import { HomeHeroKanon } from '../home/HomeHeroKanon';
import { AdaptiveMemoryCards } from '../home/AdaptiveMemoryCards';
import { HemV3DevelopmentRail } from '../home/HemV3DevelopmentRail';
import { CaptureSuperModule } from '../../capture';
import { materialEnabled, useLifeHubPreset } from '../lifeOs';
import { useStore } from '../store';
import { useTheme } from '../theme';
import { getTheme } from '../theme';
import { isMockupTheme } from '../theme/mockupTheme';
import { themeUsesDesignPackChrome } from '../theme/themePackDesign';

export function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const { preset, presetId } = useLifeHubPreset();
  const { themeId } = useTheme();
  const mockupSkin = isMockupTheme(themeId) || themeUsesDesignPackChrome(getTheme(themeId));
  const [adaptiveRefreshKey, setAdaptiveRefreshKey] = useState(0);
  const showAdaptiveCards =
    !mockupSkin && isAuthenticated && materialEnabled(preset, 'home_adaptive_cards');
  const showDevelopmentRail =
    !mockupSkin && isAuthenticated && materialEnabled(preset, 'home_development_rail');

  return (
    <div
      className={clsx(
        'home-page home-page--kanon home-page--scenic space-y-4',
        mockupSkin && 'home-page--mockup-skin',
      )}
    >
      <HomeHeroKanon onCheckInSaved={() => setAdaptiveRefreshKey((k) => k + 1)} />

      {showAdaptiveCards || showDevelopmentRail ? (
        <div className="mx-auto w-full max-w-2xl space-y-4 px-1">
          <p className="text-[10px] uppercase tracking-[0.2em] text-text-dim">Mer för dig</p>
          {showAdaptiveCards ? (
            <AdaptiveMemoryCards refreshKey={adaptiveRefreshKey} presetId={presetId} />
          ) : null}
          {showDevelopmentRail ? (
            <HemV3DevelopmentRail refreshKey={adaptiveRefreshKey} />
          ) : null}
        </div>
      ) : null}

      {!mockupSkin &&
        materialEnabled(preset, 'home_inkast') &&
        !materialEnabled(preset, 'home_hero_checkin') &&
        isAuthenticated && <CaptureSuperModule variant="hem-capture" />}

      {!mockupSkin && materialEnabled(preset, 'home_inkast') && !isAuthenticated && (
        <CaptureSuperModule
          variant="hem-inkast"
          onQueued={() => navigate(VALV_SAMLA_GRANSKA_LINK)}
        />
      )}
    </div>
  );
}
