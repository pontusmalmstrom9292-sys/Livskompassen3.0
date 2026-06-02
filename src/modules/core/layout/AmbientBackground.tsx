import { clsx } from 'clsx';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../theme';

/** Scenic bakgrund — alltid på mockup-teman; annars huvudflikar (ej widget). */
export function AmbientBackground() {
  const { pathname } = useLocation();
  const { themeId } = useTheme();
  const mockupScenic =
    /^D[1-5]-/.test(themeId) || (themeId.startsWith('M') && themeId.includes('mockup'));
  const showScenic = mockupScenic || !pathname.startsWith('/widget');

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
