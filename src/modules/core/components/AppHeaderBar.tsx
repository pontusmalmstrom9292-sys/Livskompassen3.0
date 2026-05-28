import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { resolveHeaderPanelStyle } from '../layout/headerPanelStyle';
import { HeaderMenuGlyph } from '../ui/HeaderChromeGlyphs';
import { AppHeaderBrand } from './AppHeaderBrand';

export type { HeaderPanelStyle } from '../layout/headerPanelStyle';

type Props = {
  menuExpanded: boolean;
  onMenuClick: () => void;
  actions: ReactNode;
};

export function AppHeaderBar({ menuExpanded, onMenuClick, actions }: Props) {
  const location = useLocation();
  const showTagline = location.pathname === '/';
  const panelStyle = resolveHeaderPanelStyle();

  return (
    <div
      className="glass-header-bar glass-header-bar--kanon"
      data-panel-style={panelStyle}
    >
      <button
        type="button"
        className="header-chrome-btn header-menu-btn header-menu-btn--kanon"
        aria-label="Öppna meny"
        aria-expanded={menuExpanded}
        onClick={onMenuClick}
      >
        <HeaderMenuGlyph className="header-chrome-btn__glyph h-[1.35rem] w-[1.35rem]" />
      </button>

      <AppHeaderBrand showTagline={showTagline} />

      <div className="app-header__actions app-header__actions--kanon">{actions}</div>
    </div>
  );
}
