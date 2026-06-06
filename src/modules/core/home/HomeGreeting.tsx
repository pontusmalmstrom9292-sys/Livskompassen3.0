import { clsx } from 'clsx';
import { getTimeGreeting, useHomeDisplayName } from './utils/homeGreeting';

const TAGLINES = [
  'Ett steg i taget — kompassen visar riktning.',
  'Lågaffektiv start. Ingen prestation krävs.',
  'Kväll — landa mjukt. Inget måste vara klart.',
] as const;

function taglineForHour(h: number): string {
  if (h >= 17 || h < 5) return TAGLINES[2];
  if (h >= 12) return TAGLINES[1];
  return TAGLINES[0];
}

type Props = {
  /** Mockup-bild: «Styr med mening. Lev med riktning.» */
  mockupCopy?: boolean;
};

export function HomeGreeting({ mockupCopy = false }: Props) {
  const name = useHomeDisplayName();
  const now = new Date();
  const greeting = getTimeGreeting(now);
  const tagline = mockupCopy
    ? 'Styr med mening. Lev med riktning.'
    : taglineForHour(now.getHours());

  return (
    <header className={clsx('home-greeting', mockupCopy && 'home-greeting--mockup')}>
      <p className="home-greeting__eyebrow">Styr med mening</p>
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
