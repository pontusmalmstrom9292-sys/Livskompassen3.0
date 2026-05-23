import { CompassHubOrb } from './CompassHubOrb';

export function FloatingDock() {
  return (
    <div className="dock-shell">
      <nav className="dock-nav dock-nav--hub" aria-label="Modulhub">
        <CompassHubOrb />
      </nav>
    </div>
  );
}
