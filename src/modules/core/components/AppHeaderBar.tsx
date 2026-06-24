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
  headerQuickToggle,
}: Props) {
  const panelStyle = useHeaderPanelStyle();

  return (
    <div
      className="glass-header-bar glass-header-bar--kanon"
      data-panel-style={panelStyle}
    >
      <DesignPackCenterHeader
        menuExpanded={menuExpanded}
        onMenuClick={onMenuClick}
        actions={null} // Dölj öga/lås för att matcha designen
        headerQuickToggle={headerQuickToggle}
      />
    </div>
  );
}
