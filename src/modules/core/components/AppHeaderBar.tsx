import type { ReactNode } from 'react';
import { HeaderMenuGlyph } from '../ui/HeaderChromeGlyphs';
import { useHeaderPanelStyle } from '../layout/headerPanelStyle';
import { DesignPackCenterHeader } from '../design/DesignPackCenterHeader';
import { useDesignPack } from '../design/useDesignPack';
import { AppHeaderBrand } from './AppHeaderBrand';

export type { HeaderPanelStyle } from '../layout/headerPanelStyle';

type Props = {
  menuExpanded: boolean;
  onMenuClick: () => void;
  actions: ReactNode;
  /** Kompass-toggle — direkt barn i glass-header-bar (index 2). */
  headerQuickToggle?: ReactNode;
};

export function AppHeaderBar({
  menuExpanded,
  onMenuClick,
  actions,
  headerQuickToggle,
}: Props) {
  const { active, chrome } = useDesignPack();
  const panelStyle = useHeaderPanelStyle();

  if (active && chrome?.header === 'center-ornament') {
    return (
      <DesignPackCenterHeader
        menuExpanded={menuExpanded}
        onMenuClick={onMenuClick}
        actions={actions}
        headerQuickToggle={headerQuickToggle}
      />
    );
  }

  return (
    <div
      className="glass-header-bar glass-header-bar--kanon"
      data-panel-style={panelStyle}
    >
      <div className="glass-header-bar__leading">
        <button
          type="button"
          className="header-chrome-btn header-chrome-btn--round header-menu-btn header-menu-btn--kanon"
          aria-label="Öppna meny"
          aria-expanded={menuExpanded}
          onClick={onMenuClick}
        >
          <HeaderMenuGlyph className="header-chrome-btn__glyph h-8 w-8" />
        </button>
        <AppHeaderBrand />
      </div>

      <div className="app-header__actions app-header__actions--kanon">{actions}</div>
      {headerQuickToggle}
    </div>
  );
}
