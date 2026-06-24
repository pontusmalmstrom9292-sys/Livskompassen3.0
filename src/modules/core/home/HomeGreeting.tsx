import { Bell } from 'lucide-react';
import { getTimeGreeting, useHomeDisplayName } from './utils/homeGreeting';
import { useLifeHubPreset } from '../lifeOs/useLifeHubPreset';

type Props = {
  /** Mockup-bild: «Styr med mening. Lev med riktning.» */
  mockupCopy?: boolean;
  /** Dölj övre etikett när sidrubrik redan visas i header (designpaket). */
  hideEyebrow?: boolean;
};

export function HomeGreeting(_props?: Props) {
  const name = useHomeDisplayName();
  const now = new Date();
  const greeting = getTimeGreeting(now);
  const { preset } = useLifeHubPreset();

  return (
    <div className="home-header-area w-full space-y-4 pb-4">
      {/* Big Flat Header Row */}
      <header className="flex justify-between items-center w-full">
        <h1 className="font-display-serif text-2xl font-semibold tracking-[0.2em] text-accent">
          HEM
        </h1>
        <button
          type="button"
          className="text-accent hover:text-accent-light transition-colors p-1"
          aria-label="Notiser"
        >
          <Bell className="w-5 h-5" />
        </button>
      </header>

      {/* Greeting & Compass Row */}
      <div className="flex justify-between items-center w-full">
        <div className="space-y-1">
          <p className="text-xl font-bold font-sans text-text leading-tight">
            {greeting}, {name}
          </p>
          <p className="text-[10px] tracking-[0.18em] font-sans text-accent uppercase font-semibold">
            {preset?.label ? preset.label.toUpperCase() : 'DEN TRYGGA HAMNEN'}
          </p>
        </div>
        <div className="flex-shrink-0 ml-4">
          <img 
            src="/icons/b1-kanon-ros.svg" 
            alt="Kompassros" 
            className="w-14 h-14 object-contain animate-[spin_60s_linear_infinite] opacity-90 filter drop-shadow-[0_0_12px_rgba(212,175,55,0.2)]" 
          />
        </div>
      </div>
    </div>
  );
}


