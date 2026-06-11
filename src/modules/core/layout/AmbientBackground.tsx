import { clsx } from 'clsx';
import { useLocation } from 'react-router-dom';
import { REDESIGN_A_THEME_ID } from '../theme/themePackRedesignA';
import { useTheme } from '../theme';

/** Scenic bakgrund — alltid på mockup-teman; annars huvudflikar (ej widget). */
export function AmbientBackground() {
  const { pathname } = useLocation();
  const { themeId } = useTheme();
  const isRedesignA = themeId === REDESIGN_A_THEME_ID;
  const mockupScenic =
    !isRedesignA &&
    (/^D[1-5]-/.test(themeId) || (themeId.startsWith('M') && themeId.includes('mockup')));
  const showScenic = !isRedesignA && (mockupScenic || !pathname.startsWith('/widget'));

  return (
    <div
      className={clsx('ambient-bg', showScenic && 'ambient-bg--scenic', isRedesignA && 'ambient-bg--flat')}
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
