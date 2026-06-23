import { clsx } from 'clsx';
import { getTimeGreeting, useHomeDisplayName } from './utils/homeGreeting';
import { useLifeHubPreset } from '../lifeOs/useLifeHubPreset';

type Props = {
  /** Mockup-bild: «Styr med mening. Lev med riktning.» */
  mockupCopy?: boolean;
  /** Dölj övre etikett när sidrubrik redan visas i header (designpaket). */
  hideEyebrow?: boolean;
};

export function HomeGreeting({ mockupCopy = false, hideEyebrow = false }: Props) {
  const name = useHomeDisplayName();
  const now = new Date();
  const greeting = getTimeGreeting(now);
  const { preset } = useLifeHubPreset();

  return (
    <header className="home-greeting flex justify-between items-start w-full pb-4">
      <div className="space-y-0.5">
        <p className="text-[10px] tracking-[0.2em] font-sans text-accent uppercase font-semibold">
          Hem
        </p>
        <h1 className="text-2xl font-bold font-sans text-text leading-tight">
          {greeting}, {name}
        </h1>
        <p className="text-[9px] tracking-[0.15em] font-sans text-accent-dim uppercase font-medium opacity-85">
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
    </header>
  );
}

