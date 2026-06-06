import type { ReactNode } from 'react';

type LivLauncherId =
  | 'kompasser'
  | 'ekonomi'
  | 'mabra'
  | 'handling'
  | 'projekt'
  | 'arbetsliv';

export const LIV_LAUNCHER_PREVIEWS: Record<LivLauncherId, ReactNode> = {
  kompasser: (
    <div className="liv-launcher-card__preview text-[10px] text-text-dim">
      <span className="text-accent">Morgon</span> · Kväll · En rytm
    </div>
  ),
  ekonomi: (
    <div className="liv-launcher-card__preview text-[10px] text-text-dim">
      Budget · Matprep · Sparmål
    </div>
  ),
  mabra: (
    <div className="liv-launcher-card__preview text-[10px] text-text-dim">
      Akut · Daglig mix · Ett steg
    </div>
  ),
  handling: (
    <div className="liv-launcher-card__preview grid grid-cols-3 gap-0.5 text-[8px] uppercase text-text-dim">
      <span>Att göra</span>
      <span>Väntar</span>
      <span>Klart</span>
    </div>
  ),
  projekt: (
    <div className="liv-launcher-card__preview flex flex-wrap gap-1 text-[9px] text-text-dim">
      {['Lista', 'Anteckning', 'Bild'].map((l) => (
        <span key={l} className="rounded border border-border/30 px-1">
          {l}
        </span>
      ))}
    </div>
  ),
  arbetsliv: (
    <div className="liv-launcher-card__preview text-[10px] text-text-dim">
      Stämpla · Flex · Lönespec
    </div>
  ),
};
