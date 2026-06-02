import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { HeaderMenuGlyph } from '../ui/HeaderChromeGlyphs';
import { useDesignPackCenterTitle } from './useDesignPack';

type Props = {
  menuExpanded: boolean;
  onMenuClick: () => void;
  actions: ReactNode;
};

/** Mockup-header: meny vänster, centrerad caps + diamant, actions höger. */
export function DesignPackCenterHeader({ menuExpanded, onMenuClick, actions }: Props) {
  const { pathname } = useLocation();
  const title = useDesignPackCenterTitle(pathname) ?? 'LIVSKOMPASSEN';

  return (
    <header className="design-pack-header" aria-label={title}>
      <button
        type="button"
        className="design-pack-header__menu header-chrome-btn"
        aria-label="Öppna meny"
        aria-expanded={menuExpanded}
        onClick={onMenuClick}
      >
        <HeaderMenuGlyph className="h-6 w-6 text-accent" />
      </button>

      <div className="design-pack-header__center">
        <h1 className="design-pack-header__title">{title}</h1>
        <div className="design-pack-header__ornament" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="design-pack-header__actions">{actions}</div>
    </header>
  );
}
