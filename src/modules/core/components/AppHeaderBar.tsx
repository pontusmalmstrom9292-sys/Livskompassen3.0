import type { ReactNode } from 'react';
import { clsx } from 'clsx';
import { useHeaderPanelStyle } from '../layout/headerPanelStyle';
import { DesignPackCenterHeader } from '../design/DesignPackCenterHeader';
import { useDesignPack } from '../design/useDesignPack';


export type { HeaderPanelStyle } from '../layout/headerPanelStyle';

type Props = {
  menuExpanded: boolean;
  onMenuClick: () => void;
  actions: ReactNode;
  /** Kompass-toggle — direkt barn i glass-header-bar (index 2). */
  headerQuickToggle?: ReactNode;
  /** Premium executive — öga i centrum, ingen header-kompass. */
  headerVariant?: 'default' | 'executive-premium';
  centerAction?: ReactNode;
};

export function AppHeaderBar({
  menuExpanded,
  onMenuClick,
  actions,
  headerQuickToggle,
  headerVariant = 'default',
  centerAction,
}: Props) {
  const panelStyle = useHeaderPanelStyle();
  const { active: designPackActive } = useDesignPack();
  const executivePremium = headerVariant === 'executive-premium';
  const useDesignPackShell = designPackActive || executivePremium;

  const header = (
    <DesignPackCenterHeader
      menuExpanded={menuExpanded}
      onMenuClick={onMenuClick}
      actions={actions}
      headerQuickToggle={headerQuickToggle}
      variant={headerVariant}
      centerAction={centerAction}
    />
  );

  if (useDesignPackShell) {
    return (
      <div
        className={clsx(
          'app-header-bar app-header-bar--design-pack',
          executivePremium && 'app-header-bar--executive-premium',
        )}
        data-panel-style={panelStyle}
        data-header-variant={executivePremium ? 'executive-premium' : undefined}
      >
        {header}
      </div>
    );
  }

  return (
    <div
      className="glass-header-bar glass-header-bar--kanon"
      data-panel-style={panelStyle}
      data-header-variant={executivePremium ? 'executive-premium' : undefined}
    >
      {header}
    </div>
  );
}
