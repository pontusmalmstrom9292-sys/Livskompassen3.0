import { clsx } from 'clsx';
import { Shield } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { useTheme } from '../theme';
import { getTheme } from '../theme';
import { isMockupTheme } from '../theme/mockupTheme';
import { themeUsesDesignPackChrome } from '../theme/themePackDesign';
import { useDesignPack } from '../design/useDesignPack';
import { useLifeHubPreset } from '../lifeOs/useLifeHubPreset';
import { HomeGreeting } from './HomeGreeting';
import { HomeStreakChip } from './HomeStreakChip';
import { HomeAdaptiveCompass } from './HomeAdaptiveCompass';
import { HomeLayoutA } from './HomeLayoutA';
import { ExecutiveHomeDashboard } from './executive/ExecutiveHomeDashboard';
import { BRUSHED_BRASS_THEME_ID } from '../theme/themePackBrushedBrass';
import { isMidnightExecutiveTheme } from '../theme/themePackMidnightExecutive';
import { usePansarStore } from '../store/usePansarStore';

type Props = {
  onCheckInSaved?: () => void;
};

/**
 * Hem — Layout A (ankare + rutnät) som default · adaptiv kompass kvar för mockup/lab.
 */
export function HomeHeroKanon({ onCheckInSaved }: Props) {
  const { themeId } = useTheme();
  const mockup = isMockupTheme(themeId) || themeUsesDesignPackChrome(getTheme(themeId));
  const brassHome = themeId === BRUSHED_BRASS_THEME_ID;
  const executiveHome = isMidnightExecutiveTheme(themeId);
  const { active: designPackActive } = useDesignPack();
  const { preset, presetId } = useLifeHubPreset();
  const { activate } = usePansarStore();

  const sosTrigger = (
    <button
      type="button"
      title="Nödläge (Pansar)"
      onClick={() => activate('manual', 1)}
      className="absolute top-4 right-4 z-50 p-2 text-slate-500 hover:text-indigo-400 opacity-20 hover:opacity-100 transition-all rounded-full"
    >
      <Shield size={18} />
    </button>
  );

  const header = (
    <div className="home-hero-kanon__header relative">
      <BentoCard
        bare
        depth
        glow="gold"
        noHover
        className={clsx(
          'home-greeting-module overflow-hidden !rounded-[14px] border-[2px] border-accent/30',
          designPackActive && 'home-greeting-module--design-pack',
        )}
      >
        <HomeGreeting mockupCopy={mockup} hideEyebrow={designPackActive} />
        <div className="home-greeting-module__meta">
          <p className="home-greeting-module__profile" aria-label={`Hemprofil: ${preset.label}`}>
            {preset.label}
          </p>
          <HomeStreakChip />
        </div>
      </BentoCard>
    </div>
  );

  if (brassHome) {
    return (
      <div className="home-hero-kanon home-hero-kanon--brass-a relative">
        {sosTrigger}
        <HomeLayoutA variant="brass" onCheckInSaved={onCheckInSaved} presetLabel={preset.label} />
      </div>
    );
  }

  if (executiveHome) {
    return (
      <div className="home-hero-kanon home-hero-kanon--executive relative">
        {sosTrigger}
        <ExecutiveHomeDashboard onCheckInSaved={onCheckInSaved} />
      </div>
    );
  }

  if (mockup) {
    return (
      <div className={clsx('home-hero-kanon space-y-4 relative', 'home-hero-kanon--mockup')}>
        {sosTrigger}
        <div className="home-hero-kanon__bridge">
          <div className="home-hero-kanon__compass-stage" aria-hidden />
          <div className="home-hero-kanon__scenic-stack space-y-4">
            {header}
            <HomeAdaptiveCompass
              onSaved={onCheckInSaved}
              preset={preset}
              presetId={presetId}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-hero-kanon home-hero-kanon--layout-a relative">
      {sosTrigger}
      <HomeLayoutA variant="calm" onCheckInSaved={onCheckInSaved} presetLabel={preset.label} />
    </div>
  );
}
