import { useDesignPack } from '../design/useDesignPack';
import { CompassHubOrb } from './CompassHubOrb';
import { DockClassicTriad } from './DockClassicTriad';
import { DockHubBand } from './DockHubBand';
import { DockMockupTriad } from './DockMockupTriad';

type DockMode = 'classic' | 'band' | 'orbit';

function resolveDockMode(): DockMode {
  const raw = import.meta.env.VITE_DOCK_MODE as string | undefined;
  if (raw === 'band' || raw === 'orbit' || raw === 'classic') return raw;
  if (import.meta.env.VITE_DOCK_ORBIT === 'true') return 'orbit';
  return 'classic';
}

const dockMode = resolveDockMode();

export function FloatingDock() {
  const { active, chrome } = useDesignPack();
  const ariaLabel =
    dockMode === 'orbit'
      ? 'Modulhub'
      : dockMode === 'classic'
        ? 'Huvudnavigation'
        : 'Modulhub band';

  return (
    <div className="dock-shell">
      <nav className="dock-nav dock-nav--hub" aria-label={ariaLabel}>
        {dockMode === 'orbit' ? (
          <div className="dock-orbit-stage">
            <CompassHubOrb />
          </div>
        ) : active && chrome?.dock === 'mockup-triad' ? (
          <DockMockupTriad />
        ) : dockMode === 'classic' ? (
          <DockClassicTriad />
        ) : (
          <DockHubBand />
        )}
      </nav>
    </div>
  );
}
