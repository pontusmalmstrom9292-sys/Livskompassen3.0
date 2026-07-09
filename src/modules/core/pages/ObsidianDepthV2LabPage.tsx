import { useState } from 'react';
import { ButtonLink } from '@/design-system';
import { OdDepthHemV3Lab } from '../ui/od-depth';

/**
 * Obsidian Depth v2 — OD-estetik + Hem v3 (hub, 12 kort, supermod).
 * Låst v1 (/dev/obsidian-depth) orörd. Sandbox — ej prod utan godkännande.
 */
export function ObsidianDepthV2LabPage() {
  const [status, setStatus] = useState('Tryck supermodul, kort eller navigering.');

  return (
    <div className="od-depth-lab">
      <header className="od-depth-lab__intro">
        <p className="text-[10px] uppercase tracking-[0.28em] text-accent/80 font-display-serif">
          Uppgradering · Hem v3 + OD
        </p>
        <h1 className="od-depth-lab__title">Obsidian Depth v2</h1>
        <p className="od-depth-lab__hint">
          Samma glas/guld/3D som Obsidian Depth — plus det vi byggde i Hem v3: supermoduler, dagens fokus i
          hub, 12 utvecklingskort, tiles och inkast-feed.{' '}
          <strong>Theme Lab</strong> styr bara färgtema på prod; det här är layout-preview.
        </p>
        <div className="od-depth-lab__links">
          <ButtonLink to="/dev/obsidian-depth" variant="ghost" size="sm" className="text-xs">
            Depth v1 (låst)
          </ButtonLink>
          <ButtonLink to="/dev/dagens-ankare" variant="ghost" size="sm" className="text-xs">
            Dagens Ankare
          </ButtonLink>
          <ButtonLink to="/dev/theme-lab" variant="ghost" size="sm" className="text-xs">
            Theme Lab
          </ButtonLink>
          <ButtonLink to="/" variant="ghost" size="sm" className="text-xs">
            Hem prod
          </ButtonLink>
        </div>
        <p className="mt-3 text-xs text-text-muted" aria-live="polite">
          {status}
        </p>
      </header>

      <OdDepthHemV3Lab onStatus={setStatus} />
    </div>
  );
}
