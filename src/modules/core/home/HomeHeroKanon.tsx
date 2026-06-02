import { useState } from 'react';
import { clsx } from 'clsx';
import { useTheme } from '../theme';
import { isDesignPackTheme } from '../theme/themePackDesign';
import { isMockupTheme } from '../theme/mockupTheme';
import { HomeGreeting } from './HomeGreeting';
import { HomeStreakChip } from './HomeStreakChip';
import { DagensRiktningCard } from './DagensRiktningCard';
import { LivskompassHero } from './LivskompassHero';

type Props = {
  onCheckInSaved?: () => void;
};

/**
 * Hem — mockup-läge visar stor kompass-ros (M2-referens); annars scenic + Dagens riktning.
 */
export function HomeHeroKanon({ onCheckInSaved }: Props) {
  const { themeId } = useTheme();
  const mockup = isMockupTheme(themeId) || isDesignPackTheme(themeId);
  const [checkInOpen, setCheckInOpen] = useState(false);

  const dagensRiktning = (
    <DagensRiktningCard
      open={checkInOpen}
      onOpenChange={setCheckInOpen}
      onCheckInSaved={() => {
        onCheckInSaved?.();
        setCheckInOpen(false);
      }}
    />
  );

  const welcomeModule = (
    <div className="home-hero-kanon__welcome-module">
      <div className="home-hero-kanon__intro">
        <HomeGreeting mockupCopy={mockup} />
        <HomeStreakChip />
      </div>
      {mockup ? (
        <div className="home-hero-kanon__welcome-compass">
          <LivskompassHero variant="compass" onCenterPress={() => setCheckInOpen(true)} />
        </div>
      ) : null}
      {dagensRiktning}
    </div>
  );

  return (
    <div className={clsx('home-hero-kanon space-y-5', mockup && 'home-hero-kanon--mockup')}>
      {mockup ? (
        welcomeModule
      ) : (
        <div className="home-hero-kanon__bridge">
          <div className="home-hero-kanon__compass-stage" aria-hidden />
          <div className="home-hero-kanon__scenic-stack">{welcomeModule}</div>
        </div>
      )}

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
