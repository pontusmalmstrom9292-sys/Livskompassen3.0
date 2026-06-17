import { useNavigate } from 'react-router-dom';
import { VALV_SAMLA_GRANSKA_LINK } from '@/modules/inkast/api/inkastService';
import { clsx } from 'clsx';
import { HjartatHero } from '../home/HjartatHero';
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
  const { preset } = useLifeHubPreset();
  const { themeId } = useTheme();
  const mockupSkin = isMockupTheme(themeId) || themeUsesDesignPackChrome(getTheme(themeId));

  return (
    <div
      className={clsx(
        'home-page home-page--kanon home-page--scenic space-y-4',
        mockupSkin && 'home-page--mockup-skin',
      )}
    >
      <HjartatHero />

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
