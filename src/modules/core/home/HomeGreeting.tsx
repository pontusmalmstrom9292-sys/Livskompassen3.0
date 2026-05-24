import { getTimeGreeting, useHomeDisplayName } from './utils/homeGreeting';

const TAGLINES = [
  'Ett steg i taget — kompassen visar riktning.',
  'Lågaffektiv start. Ingen prestation krävs.',
  'Din eld tänds av små handlingar, inte av stress.',
] as const;

function taglineForHour(h: number): string {
  if (h >= 17 || h < 5) return TAGLINES[2];
  if (h >= 12) return TAGLINES[1];
  return TAGLINES[0];
}

export function HomeGreeting() {
  const name = useHomeDisplayName();
  const now = new Date();
  const greeting = getTimeGreeting(now);
  const tagline = taglineForHour(now.getHours());

  return (
    <header className="home-greeting">
      <h2 className="home-greeting__title">
        {greeting}, {name}
        <span className="home-greeting__star" aria-hidden>
          {' '}
          ✦
        </span>
      </h2>
      <p className="home-greeting__tagline">{tagline}</p>
    </header>
  );
}
