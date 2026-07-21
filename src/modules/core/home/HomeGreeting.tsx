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

export function HomeGreeting({ mockupCopy = false, variant = 'default' }: Props) {
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
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl p-1 text-accent transition-colors hover:text-accent-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          aria-label="Notiser"
        >
          <Bell className="h-5 w-5" aria-hidden />
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
            {mockupCopy
              ? 'Styr med mening. Lev med riktning.'
              : preset?.label
                ? preset.label.toUpperCase()
                : 'DEN TRYGGA HAMNEN'}
          </p>
        </div>
        {!isExecutive ? (
          <div className="home-greeting__rose ml-4 flex-shrink-0">
            <img
              src="/icons/b1-kanon-ros.svg"
              alt=""
              aria-hidden
              className="home-greeting__rose-img h-14 w-14 object-contain opacity-90"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}


