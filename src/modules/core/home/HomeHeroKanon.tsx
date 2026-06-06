import { clsx } from 'clsx';
import { useTheme } from '../theme';
import { isDesignPackTheme } from '../theme/themePackDesign';
import { isMockupTheme } from '../theme/mockupTheme';
import { useLifeHubPreset } from '../lifeOs/useLifeHubPreset';
import { HomeGreeting } from './HomeGreeting';
import { HomeStreakChip } from './HomeStreakChip';
import { HomeAdaptiveCompass } from './HomeAdaptiveCompass';

type Props = {
  onCheckInSaved?: () => void;
};

/**
 * Hem — hälsning + adaptiv kompass (Obsidian Calm 2.0).
 * Mockup: kompass/navigation via dock — ingen dubbel orbit-disc på hem.
 */
export function HomeHeroKanon({ onCheckInSaved }: Props) {
  const { themeId } = useTheme();
  const mockup = isMockupTheme(themeId) || isDesignPackTheme(themeId);
  const { preset, presetId } = useLifeHubPreset();

  const header = (
    <div className="home-hero-kanon__header">
      <div className="home-hero-kanon__intro">
        <HomeGreeting mockupCopy={mockup} />
        {!mockup ? (
          <p className="mt-1 text-[10px] text-text-dim" aria-label={`Hemprofil: ${preset.label}`}>
            Profil: {preset.label}
          </p>
        ) : null}
        <HomeStreakChip />
      </div>
    </div>
  );

  return (
    <div className={clsx('home-hero-kanon space-y-4', mockup && 'home-hero-kanon--mockup')}>
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
