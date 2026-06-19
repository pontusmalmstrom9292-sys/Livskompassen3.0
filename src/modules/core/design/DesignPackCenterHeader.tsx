import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { HeaderMenuGlyph } from '../ui/HeaderChromeGlyphs';
import { useDesignPackCenterTitle } from './useDesignPack';

type Props = {
  menuExpanded: boolean;
  onMenuClick: () => void;
  actions: ReactNode;
  headerQuickToggle?: ReactNode;
};

/** Mockup-header — symmetrisk 3-kolumns layout, centrerad titel. */
export function DesignPackCenterHeader({
  menuExpanded,
  onMenuClick,
  actions,
  headerQuickToggle,
}: Props) {
  const { pathname } = useLocation();
  const title = useDesignPackCenterTitle(pathname) ?? 'LIVSKOMPASSEN';

  return (
    <header className="design-pack-header" aria-label={title}>
      <div className="design-pack-header__side design-pack-header__side--left">
        <button
          type="button"
          className="design-pack-header__menu header-chrome-btn header-chrome-btn--round"
          aria-label="Öppna meny"
          aria-expanded={menuExpanded}
          onClick={onMenuClick}
        >
          <HeaderMenuGlyph className="header-chrome-btn__glyph h-5 w-5 text-accent" />
        </button>
      </div>

      <div className="design-pack-header__center">
        <h1 className="design-pack-header__title">{title}</h1>
        <div className="design-pack-header__ornament" aria-hidden>
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="design-pack-header__side design-pack-header__side--right">
        <div className="design-pack-header__actions">{actions}</div>
        {headerQuickToggle}
      </div>
    </header>
  );
}
