import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { AppHeaderBrand } from './AppHeaderBrand';

const HEADER_PANEL_STYLES = ['ember', 'obsidian', 'aurora'] as const;
export type HeaderPanelStyle = (typeof HEADER_PANEL_STYLES)[number];

function resolveHeaderPanelStyle(): HeaderPanelStyle {
  const v = import.meta.env.VITE_HEADER_PANEL_STYLE;
  if (typeof v === 'string' && HEADER_PANEL_STYLES.includes(v as HeaderPanelStyle)) {
    return v as HeaderPanelStyle;
  }
  return 'ember';
}

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
      <span className="glass-header-bar__corner glass-header-bar__corner--tl" aria-hidden />
      <span className="glass-header-bar__corner glass-header-bar__corner--tr" aria-hidden />
      <span className="glass-header-bar__corner glass-header-bar__corner--bl" aria-hidden />
      <span className="glass-header-bar__corner glass-header-bar__corner--br" aria-hidden />

      <button
        type="button"
        className="header-menu-btn header-menu-btn--kanon"
        aria-label="Öppna meny"
        aria-expanded={menuExpanded}
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5" strokeWidth={2} />
      </button>

      <AppHeaderBrand showTagline={showTagline} />

      <div className="app-header__actions app-header__actions--kanon">{actions}</div>
    </div>
  );
}
