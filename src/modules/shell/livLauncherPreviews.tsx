import type { ReactNode } from 'react';

type LivLauncherId =
  | 'kompasser'
  | 'ekonomi'
  | 'mabra'
  | 'projekt'
  | 'arbetsliv';

export const LIV_LAUNCHER_PREVIEWS: Record<LivLauncherId, ReactNode> = {
  kompasser: (
    <div className="liv-launcher-card__preview text-[10px] text-text-muted">
      <span className="text-accent">Morgon</span> · Kväll · En rytm
    </div>
  ),
  ekonomi: (
    <div className="liv-launcher-card__preview text-[10px] text-text-muted">
      Budget · Matprep · Sparmål
    </div>
  ),
  mabra: (
    <div className="liv-launcher-card__preview text-[10px] text-text-muted">
      Akut · Daglig mix · Ett steg
    </div>
  ),
  projekt: (
    <div className="liv-launcher-card__preview flex flex-wrap gap-1 text-[9px] text-text-muted">
      {['Lista', 'Anteckning', 'Bild'].map((l) => (
        <span key={l} className="rounded border border-border/30 px-1">
          {l}
        </span>
      ))}
    </div>
  ),
  arbetsliv: (
    <div className="liv-launcher-card__preview text-[10px] text-text-muted">
      Stämpla · Flex · Lönespec
    </div>
  ),
};
