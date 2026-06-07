import { clsx } from 'clsx';
import { Compass } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { REDESIGN_A_THEME_ID } from '../theme/themePackRedesignA';
import { REDESIGN_C_THEME_IDS } from '../theme/themePackRedesignC';
import { useTheme } from '../theme';

/** Scenic bakgrund — endast hem + mockup-teman; övriga hubbar får Obsidian Bento + kompassros. */
export function AmbientBackground() {
  const { pathname } = useLocation();
  const { themeId } = useTheme();
  const isRedesignA = themeId === REDESIGN_A_THEME_ID;
  const isAuroraPrism = (REDESIGN_C_THEME_IDS as readonly string[]).includes(themeId);
  const mockupScenic =
    !isRedesignA &&
    !isAuroraPrism &&
    (/^D[1-5]-/.test(themeId) || (themeId.startsWith('M') && themeId.includes('mockup')));
  const isHome = pathname === '/';
  const showScenic = !isRedesignA && !isAuroraPrism && (mockupScenic || isHome);

  return (
    <div
      className={clsx('ambient-bg', showScenic && 'ambient-bg--scenic', isRedesignA && 'ambient-bg--flat')}
      aria-hidden
    >
      <Compass className="ambient-bg__compass-rose" strokeWidth={0.75} aria-hidden />
      {isAuroraPrism ? (
        <>
          <div className="aurora-ambient-layer" />
          <div
            className="ambient-blob ambient-blob--teal"
            style={{ width: 420, height: 420, top: '-8%', right: '-10%' }}
          />
          <div
            className="ambient-blob ambient-blob--violet"
            style={{ width: 360, height: 360, bottom: '10%', left: '-5%' }}
          />
        </>
      ) : showScenic ? (
        <>
          <div
            className="ambient-blob ambient-blob--gold"
            style={{ width: 420, height: 420, top: '-8%', left: '-10%' }}
          />
          <div
            className="ambient-blob ambient-blob--accent-secondary"
            style={{ width: 360, height: 360, bottom: '10%', right: '-5%' }}
          />
        </>
      ) : null}
    </div>
  );
}
