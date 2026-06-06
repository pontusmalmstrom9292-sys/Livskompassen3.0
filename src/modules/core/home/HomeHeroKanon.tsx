import { clsx } from 'clsx';
import { useTheme } from '../theme';
import { isDesignPackTheme } from '../theme/themePackDesign';
import { isMockupTheme } from '../theme/mockupTheme';
import { HomeGreeting } from './HomeGreeting';
import { HomeStreakChip } from './HomeStreakChip';
import { HomeAdaptiveCompass } from './HomeAdaptiveCompass';
import { LivskompassHero } from './LivskompassHero';

type Props = {
  onCheckInSaved?: () => void;
};

function scrollToInkast() {
  document.getElementById('inkast')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Hem — hälsning + adaptiv kompass (Obsidian Calm 2.0).
 * Orbit-kompassen sitter som tillägg ovanpå adaptiv kompass — utan separat panel-ruta.
 */
export function HomeHeroKanon({ onCheckInSaved }: Props) {
  const { themeId } = useTheme();
  const mockup = isMockupTheme(themeId) || isDesignPackTheme(themeId);

  const header = (
    <div className="home-hero-kanon__header">
      <div className="home-hero-kanon__intro">
        <HomeGreeting mockupCopy={mockup} />
        <HomeStreakChip />
      </div>
    </div>
  );

  const orbitHero = mockup ? (
    <LivskompassHero variant="compass" embedded onCenterPress={scrollToInkast} />
  ) : undefined;

  return (
    <div className={clsx('home-hero-kanon space-y-4', mockup && 'home-hero-kanon--mockup')}>
      <div className="home-hero-kanon__bridge">
        <div className="home-hero-kanon__compass-stage" aria-hidden />
        <div className="home-hero-kanon__scenic-stack space-y-4">
          {header}
          <HomeAdaptiveCompass onSaved={onCheckInSaved} orbitHero={orbitHero} />
        </div>
      </div>

      <div className="home-hero-kanon__dots" aria-hidden>
        <span className="home-hero-kanon__dot home-hero-kanon__dot--active" />
        <span className="home-hero-kanon__dot" />
        <span className="home-hero-kanon__dot" />
        <span className="home-hero-kanon__dot" />
        <span className="home-hero-kanon__dot" />
      </div>
    </div>
  );
}
