import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { VALV_SAMLA_GRANSKA_LINK } from '@/modules/inkast/api/inkastService';
import { clsx } from 'clsx';
import { HomeHeroKanon } from '../home/HomeHeroKanon';
import { AdaptiveMemoryCards } from '../home/AdaptiveMemoryCards';
import { HemV3DevelopmentRail } from '../home/HemV3DevelopmentRail';
import { CaptureSuperModule } from '../../capture';
import { CalmCollapsible } from '../ui/CalmCollapsible';
import { materialEnabled, useLifeHubPreset } from '../lifeOs';
import { useStore } from '../store';
import { useTheme } from '../theme';
import { getTheme } from '../theme';
import { isMockupTheme } from '../theme/mockupTheme';
import { themeUsesDesignPackChrome } from '../theme/themePackDesign';
import { isMidnightExecutiveTheme } from '../theme/themePackMidnightExecutive';
import { isBastaDesignTheme } from '../theme/themePackBastaDesign';
import { BastaDesignHome } from '../home/basta-design/BastaDesignHome';
import { ChameleonLive } from '../home/ChameleonLive';
import { getDefaultTarget, type ChameleonTarget } from '../home/chameleonBridge';
import type { ChameleonZoneId } from '../home/chameleonZones';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { NAV_PATHS } from '../navigation/navTruth';
import { CompanionHomeRail } from '@/widgets/pack/CompanionHomeRail';


export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const { preset, presetId } = useLifeHubPreset();
  const { themeId } = useTheme();
  const bastaDesignSkin = isBastaDesignTheme(themeId);
  const mockupSkin = isMockupTheme(themeId) || themeUsesDesignPackChrome(getTheme(themeId));
  const executiveSkin = isMidnightExecutiveTheme(themeId);
  const [adaptiveRefreshKey, setAdaptiveRefreshKey] = useState(0);
  
  const showAdaptiveCards = !mockupSkin && isAuthenticated && materialEnabled(preset, 'home_adaptive_cards');
  const showDevelopmentRail = !mockupSkin && isAuthenticated && materialEnabled(preset, 'home_development_rail');
  const usesLayoutA = !mockupSkin;
  const showSecondaryFeed = showAdaptiveCards || showDevelopmentRail;

  let activeZone: ChameleonZoneId | 'hem' = 'hem';
  if (location.pathname.startsWith('/hjartat') || location.pathname.startsWith('/dagbok')) activeZone = 'hjartat';
  else if (location.pathname.startsWith('/vardagen') || location.pathname.startsWith('/planering') || location.pathname.startsWith('/mabra') || location.pathname.startsWith('/arbetsliv')) activeZone = 'vardagen';
  else if (location.pathname.startsWith('/familjen')) activeZone = 'familjen';

  const [target, setTarget] = useState<ChameleonTarget>(() => {
    const defaultZone = activeZone === 'hem' ? 'hjartat' : activeZone;
    const baseTarget = getDefaultTarget(defaultZone);
    const queryTab = new URLSearchParams(location.search).get('tab');
    if (defaultZone === 'vardagen') {
      if (queryTab === 'mabra') return { ...baseTarget, module: 'mabra', mode: 'checkin' };
      if (queryTab === 'planering') return { ...baseTarget, module: 'planering', mode: 'task_quick' };
    }
    return baseTarget;
  });

  useEffect(() => {
    if (activeZone !== 'hem' && activeZone !== target.zone) {
      const baseTarget = getDefaultTarget(activeZone);
      const queryTab = new URLSearchParams(location.search).get('tab');
      if (activeZone === 'vardagen' && queryTab === 'mabra') {
        setTarget({ ...baseTarget, module: 'mabra', mode: 'checkin' });
      } else {
        setTarget(baseTarget);
      }
    }
  }, [activeZone, target.zone, location.search]);

  const handleTargetChange = useCallback((newTarget: ChameleonTarget) => {
    setTarget(newTarget);
    if (newTarget.zone === 'hjartat') navigate('/hjartat', { replace: true });
    else if (newTarget.zone === 'vardagen') navigate('/vardagen', { replace: true });
    else if (newTarget.zone === 'familjen') navigate('/familjen', { replace: true });
  }, [navigate]);

  if (bastaDesignSkin && activeZone === 'hem') {
    return (
      <HubErrorBoundary title="Hem kunde inte laddas" glow="gold" backTo={NAV_PATHS.HOME} logTag="HomePage">
        <div className="home-page home-page--basta-design">
          <BastaDesignHome
            onCheckInSaved={() => setAdaptiveRefreshKey((k) => k + 1)}
            developmentRefreshKey={adaptiveRefreshKey}
          />
        </div>
      </HubErrorBoundary>
    );
  }

  return (
    <HubErrorBoundary title="Hem kunde inte laddas" glow="gold" backTo={NAV_PATHS.HOME} logTag="HomePage">
      <div
        className={clsx(
          'home-page home-page--kanon home-page--scenic space-y-4 pb-32',
          mockupSkin && 'home-page--mockup-skin',
          executiveSkin && 'home-page--executive',
          usesLayoutA && 'home-page--layout-a',
        )}
      >
        {activeZone === 'hem' && (
          <>
            <HomeHeroKanon onCheckInSaved={() => setAdaptiveRefreshKey((k) => k + 1)} />

            {showSecondaryFeed ? (
              <div className="mx-auto w-full max-w-2xl px-1">
                <CalmCollapsible title="Mer för dig" meta="Valfritt" defaultOpen={false} glow="gold">
                  <div className="space-y-4 pt-1">
                    {isAuthenticated ? <CompanionHomeRail max={2} /> : null}
                    {showAdaptiveCards ? (
                      <AdaptiveMemoryCards refreshKey={adaptiveRefreshKey} presetId={presetId} />
                    ) : null}
                    {showDevelopmentRail ? (
                      <HemV3DevelopmentRail refreshKey={adaptiveRefreshKey} />
                    ) : null}
                  </div>
                </CalmCollapsible>
              </div>
            ) : isAuthenticated && !mockupSkin ? (
              <div className="mx-auto w-full max-w-2xl px-1">
                <CalmCollapsible title="Companion" meta="Valfritt" defaultOpen={false} glow="gold">
                  <div className="pt-1">
                    <CompanionHomeRail max={2} />
                  </div>
                </CalmCollapsible>
              </div>
            ) : null}

            {!usesLayoutA && !mockupSkin && materialEnabled(preset, 'home_inkast') && !materialEnabled(preset, 'home_hero_checkin') && isAuthenticated && (
              <CaptureSuperModule variant="hem-capture" />
            )}

            {!mockupSkin && materialEnabled(preset, 'home_inkast') && !isAuthenticated && (
              <CaptureSuperModule
                variant="hem-inkast"
                onQueued={() => navigate(VALV_SAMLA_GRANSKA_LINK)}
              />
            )}
          </>
        )}

        {/* Chameleon — döljs på executive hem (dashboard-kort ersätter) */}
        {!(executiveSkin && activeZone === 'hem') ? (
          <div className="mx-auto mt-6 w-full max-w-2xl px-1">
            <ChameleonLive
              target={target}
              onTargetChange={handleTargetChange}
              compact={activeZone === 'hem'}
            />
          </div>
        ) : null}
      </div>
    </HubErrorBoundary>
  );
}
