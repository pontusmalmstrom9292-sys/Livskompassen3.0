import { clsx } from 'clsx';
import { getTimeGreeting, useHomeDisplayName } from './utils/homeGreeting';
import { getHomeCompassPhase } from './homeCompassPhase';
import { pickQuote } from '@/core/copy/compassBannerQuotes';

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
  const phase = getHomeCompassPhase(now);
  const tagline = mockupCopy
    ? 'Styr med mening. Lev med riktning.'
    : pickQuote(phase, now);

  return (
    <header className={clsx('home-greeting', mockupCopy && 'home-greeting--mockup')}>
      {!hideEyebrow ? <p className="home-greeting__eyebrow">Styr med mening</p> : null}
      <h2 className="home-greeting__title">
        <span className="home-greeting__salutation">{greeting},</span>{' '}
        <span className="home-greeting__name">{name}</span>
        <span className="home-greeting__star" aria-hidden>
          {' '}
          ✦
        </span>
      </h2>
      <p className="home-greeting__tagline">{tagline}</p>
    </header>
  );
}
