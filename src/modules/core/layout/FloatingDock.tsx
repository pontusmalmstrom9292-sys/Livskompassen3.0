import { CompassHubOrb } from './CompassHubOrb';
import { DockHubBand } from './DockHubBand';

/** Orbit-modulhub: sätt `VITE_DOCK_ORBIT=true` i .env */
const useOrbitDock = import.meta.env.VITE_DOCK_ORBIT === 'true';

export function FloatingDock() {
  return (
    <div className="dock-shell">
      <nav
        className="dock-nav dock-nav--hub"
        aria-label={useOrbitDock ? 'Modulhub' : 'Huvudnavigation'}
      >
        {useOrbitDock ? (
          <div className="dock-orbit-stage">
            <CompassHubOrb />
          </div>
        ) : (
          <DockHubBand />
        )}
      </nav>
    </div>
  );
}
