import type { ReactNode } from 'react';
import { FreeportModellADock, type ModellADockId } from './FreeportModellADock';
import { FreeportSnabbstartPanel } from './FreeportSnabbstartPanel';
import type { FreeportChameleonTarget } from '../freeportChameleonBridge';
import type { SnabbstartItemId } from '../freeportSnabbstartConfig';

type Props = {
  children: ReactNode;
  dockActive: ModellADockId;
  snabbstartOpen: boolean;
  snabbstartActiveId?: SnabbstartItemId;
  onDockSelect: (id: ModellADockId) => void;
  onFabPress: () => void;
  onSnabbstartSelect: (id: SnabbstartItemId, morph: FreeportChameleonTarget) => void;
  onSnabbstartClose: () => void;
};

/** Modell A phone — executive chrome + zon-dock + Fyren-lik snabbstart. */
export function FreeportModellAPhoneShell({
  children,
  dockActive,
  snabbstartOpen,
  snabbstartActiveId,
  onDockSelect,
  onFabPress,
  onSnabbstartSelect,
  onSnabbstartClose,
}: Props) {
  return (
    <div className="design-freeport__phone design-freeport__phone--executive design-freeport__phone--exact design-freeport__phone--chrome-v3 design-freeport__phone--modell-a">
      <div className="design-freeport__phone-scroll">{children}</div>
      <FreeportSnabbstartPanel
        open={snabbstartOpen}
        activeId={snabbstartActiveId}
        onSelect={onSnabbstartSelect}
        onClose={onSnabbstartClose}
      />
      <FreeportModellADock
        active={dockActive}
        snabbstartOpen={snabbstartOpen}
        onSelect={onDockSelect}
        onFabPress={onFabPress}
      />
    </div>
  );
}
