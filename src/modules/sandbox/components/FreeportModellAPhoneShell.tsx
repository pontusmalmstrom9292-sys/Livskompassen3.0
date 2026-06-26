import type { ReactNode } from 'react';
import { useState } from 'react';
import { FreeportHybridDock, type HybridDockSlot } from './FreeportHybridDock';
import { FreeportResurserOverlay } from './FreeportResurserOverlay';
import { FreeportSnabbstartPanel } from './FreeportSnabbstartPanel';
import type { FreeportChameleonTarget } from '../freeportChameleonBridge';
import type { SnabbstartItemId } from '../freeportSnabbstartConfig';

type Props = {
  children: ReactNode;
  dockActive: HybridDockSlot;
  snabbstartOpen: boolean;
  snabbstartActiveId?: SnabbstartItemId;
  onDockSelect: (id: HybridDockSlot) => void;
  onFabPress: () => void;
  onSnabbstartSelect: (id: SnabbstartItemId, morph: FreeportChameleonTarget) => void;
  onSnabbstartClose: () => void;
  onStatus?: (msg: string) => void;
};

/** Modell A phone — hybrid dock + Resurser overlay + Fyren snabbstart. */
export function FreeportModellAPhoneShell({
  children,
  dockActive,
  snabbstartOpen,
  snabbstartActiveId,
  onDockSelect,
  onFabPress,
  onSnabbstartSelect,
  onSnabbstartClose,
  onStatus,
}: Props) {
  const [resurserOpen, setResurserOpen] = useState(false);

  const handleDock = (id: HybridDockSlot) => {
    if (id === 'resurser' || id === 'mer') {
      setResurserOpen(true);
      onDockSelect(id);
      onStatus?.(id === 'resurser' ? 'Resurser öppnad' : 'Mer → Resurser');
      return;
    }
    setResurserOpen(false);
    onDockSelect(id);
  };

  return (
    <div className="design-freeport__phone design-freeport__phone--executive design-freeport__phone--exact design-freeport__phone--chrome-v3 design-freeport__phone--modell-a design-freeport__phone--hybrid">
      <div className="design-freeport__phone-scroll">{children}</div>
      <FreeportResurserOverlay
        open={resurserOpen}
        onClose={() => {
          setResurserOpen(false);
          onStatus?.('Resurser stängd');
        }}
        onPick={(id, label) => onStatus?.(`Resurser: ${label} (${id})`)}
      />
      <FreeportSnabbstartPanel
        open={snabbstartOpen}
        activeId={snabbstartActiveId}
        onSelect={onSnabbstartSelect}
        onClose={onSnabbstartClose}
      />
      <FreeportHybridDock
        active={dockActive}
        snabbstartOpen={snabbstartOpen}
        onSelect={handleDock}
        onFabPress={onFabPress}
      />
    </div>
  );
}
