import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { FreeportThemeId } from '../freeportThemes';

type Props = {
  themeId: FreeportThemeId;
  children: ReactNode;
};

/** Standalone freeport — ingen prod Fyren, dock eller guld-header. */
export function FreeportChromeShell({ themeId, children }: Props) {
  useEffect(() => {
    document.documentElement.classList.add('design-freeport-root');
    return () => document.documentElement.classList.remove('design-freeport-root');
  }, []);

  return (
    <div className="design-freeport design-freeport--standalone" data-fp-theme={themeId}>
      <div className="design-freeport__standalone-bar">
        <Link to="/" className="design-freeport__standalone-back">
          ← Prod
        </Link>
        <span className="design-freeport__standalone-badge">Sandbox · ej prod</span>
        <Link to="/dev/obsidian-depth-v2" className="design-freeport__link">
          Depth v2
        </Link>
      </div>
      {children}
    </div>
  );
}
