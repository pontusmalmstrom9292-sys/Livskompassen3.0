import { clsx } from 'clsx';
import { useLocation } from 'react-router-dom';

/** Theme-aware ambient background — scenic photo on Hem (I-stone). */
export function AmbientBackground() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <div
      className={clsx('ambient-bg', isHome && 'ambient-bg--home-scenic')}
      aria-hidden
    >
      <div
        className="ambient-blob ambient-blob--gold"
        style={{ width: 420, height: 420, top: '-8%', left: '-10%' }}
      />
      <div
        className="ambient-blob ambient-blob--accent-secondary"
        style={{ width: 360, height: 360, bottom: '10%', right: '-5%' }}
      />
    </div>
  );
}
