import { useState } from 'react';
import { HomeGreeting } from './HomeGreeting';
import { HomeStreakChip } from './HomeStreakChip';
import { LivskompassHero } from './LivskompassHero';
import { DagensRiktningCard } from './DagensRiktningCard';

type Props = {
  onCheckInSaved?: () => void;
};

/** Hem — scenic I-stone + Kognitiv sköld (HOME-HERO-KANON.md) */
export function HomeHeroKanon({ onCheckInSaved }: Props) {
  const [checkInOpen, setCheckInOpen] = useState(false);

  return (
    <div className="home-hero-kanon space-y-5">
      <div className="home-hero-kanon__top">
        <HomeGreeting />
        <HomeStreakChip />
      </div>

      <LivskompassHero onCenterPress={() => setCheckInOpen(true)} />

      <DagensRiktningCard
        open={checkInOpen}
        onOpenChange={setCheckInOpen}
        onCheckInSaved={() => {
          onCheckInSaved?.();
          setCheckInOpen(false);
        }}
      />

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
