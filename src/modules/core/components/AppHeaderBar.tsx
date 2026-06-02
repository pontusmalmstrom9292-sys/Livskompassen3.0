import type { ReactNode } from 'react';
import { HeaderMenuGlyph } from '../ui/HeaderChromeGlyphs';
import { resolveHeaderPanelStyle } from '../layout/headerPanelStyle';
import { DesignPackCenterHeader } from '../design/DesignPackCenterHeader';
import { useDesignPack } from '../design/useDesignPack';
import { AppHeaderBrand } from './AppHeaderBrand';

export type { HeaderPanelStyle } from '../layout/headerPanelStyle';

type Props = {
  menuExpanded: boolean;
  onMenuClick: () => void;
  actions: ReactNode;
};

export function AppHeaderBar({ menuExpanded, onMenuClick, actions }: Props) {
  const { active, chrome } = useDesignPack();
  const panelStyle = resolveHeaderPanelStyle();

  if (active && chrome?.header === 'center-ornament') {
    return (
      <DesignPackCenterHeader
        menuExpanded={menuExpanded}
        onMenuClick={onMenuClick}
        actions={actions}
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
          className="header-chrome-btn header-menu-btn header-menu-btn--kanon"
          aria-label="Öppna meny"
          aria-expanded={menuExpanded}
          onClick={onMenuClick}
        >
          <HeaderMenuGlyph className="header-chrome-btn__glyph h-[1.35rem] w-[1.35rem]" />
        </button>
        <AppHeaderBrand />
      </div>

      <div className="app-header__actions app-header__actions--kanon">{actions}</div>
    </div>
  );
}
