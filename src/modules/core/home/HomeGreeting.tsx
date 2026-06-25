import { Bell } from 'lucide-react';
import { clsx } from 'clsx';
import { getTimeGreeting, useHomeDisplayName } from './utils/homeGreeting';
import { useLifeHubPreset } from '../lifeOs/useLifeHubPreset';

type Props = {
  /** Mockup-bild: «Styr med mening. Lev med riktning.» */
  mockupCopy?: boolean;
  /** Dölj övre etikett när sidrubrik redan visas i header (designpaket). */
  hideEyebrow?: boolean;
  /** Executive: ingen liten snurrande B1-ros — ren textheader. */
  variant?: 'default' | 'executive';
};

export function HomeGreeting({ variant = 'default' }: Props) {
  const name = useHomeDisplayName();
  const now = new Date();
  const greeting = getTimeGreeting(now);
  const { preset } = useLifeHubPreset();
  const isExecutive = variant === 'executive';

  return (
    <div className={clsx('home-header-area w-full', isExecutive ? 'space-y-3 pb-2' : 'space-y-4 pb-4')}>
      <header className="flex justify-between items-center w-full">
        <h1 className="font-display-serif text-2xl font-semibold tracking-[0.2em] text-accent">
          HEM
        </h1>
        <button
          type="button"
          className="text-accent hover:text-accent-light transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Notiser"
        >
          <Bell className="w-5 h-5" />
        </button>
      </header>

      <div className={clsx('w-full', isExecutive ? 'space-y-1.5' : 'flex justify-between items-center')}>
        <div className="space-y-1 min-w-0">
          <p className={clsx(
            'font-bold leading-tight text-text',
            isExecutive ? 'text-2xl font-display-serif tracking-wide' : 'text-xl font-sans',
          )}>
            {greeting}, {name}
          </p>
          <p className="text-[10px] tracking-[0.2em] font-sans text-accent uppercase font-semibold">
            {preset?.label ? preset.label.toUpperCase() : 'DEN TRYGGA HAMNEN'}
          </p>
        </div>
        {!isExecutive ? (
          <div className="flex-shrink-0 ml-4">
            <img
              src="/icons/b1-kanon-ros.svg"
              alt="Kompassros"
              className="w-14 h-14 object-contain animate-[spin_60s_linear_infinite] opacity-90 filter drop-shadow-[0_0_12px_rgba(212,175,55,0.2)]"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}


