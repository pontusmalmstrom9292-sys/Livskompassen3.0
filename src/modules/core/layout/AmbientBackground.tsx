import { clsx } from 'clsx';
import { useLocation } from 'react-router-dom';

/** Scenic I-stone bakgrund på alla huvudflikar (ej widget-routes). */
export function AmbientBackground() {
  const { pathname } = useLocation();
  const showScenic = !pathname.startsWith('/widget');

  return (
    <div
      className={clsx('ambient-bg', showScenic && 'ambient-bg--scenic')}
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
