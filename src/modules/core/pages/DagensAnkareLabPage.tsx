import { Link } from 'react-router-dom';
import { DagensAnkareSupermodul } from '../ui/ankare';

/**
 * Dev-lab: Dagens Ankare supermodul (Forge + Taktisk).
 * Sandbox — ej prod-wire utan godkännande.
 */
export function DagensAnkareLabPage() {
  return (
    <div className="min-h-screen bg-surface px-4 py-8 text-text">
      <header className="mx-auto mb-8 max-w-md text-center">
        <p className="text-[10px] uppercase tracking-[0.28em] text-accent/80 font-display-serif">
          Sandbox · Hem v3
        </p>
        <h1 className="mt-2 font-display-serif text-xl tracking-wide text-accent-light">
          Dagens Ankare
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          Forge (andning: box / 4-7-8 / 4-2-6) + Taktisk (mikrosteg). Testa på Hem → Morgon-flik.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Link to="/" className="ds-btn ds-btn--ghost text-xs">
            Hem
          </Link>
          <Link to="/dev/obsidian-forge" className="ds-btn ds-btn--ghost text-xs">
            Obsidian Forge
          </Link>
          <a
            href="/docs/design-sandbox/waves/wave-2/ref-compass-life-os/hem-v3-compass-merge.html"
            className="ds-btn ds-btn--ghost text-xs"
          >
            HTML merge
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-md">
        <div className="rounded-[32px] border border-border/30 bg-surface-2/80 p-2.5 shadow-[0_26px_56px_rgba(0,0,0,0.75)]">
          <div className="calm-scroll-island max-h-[700px] overflow-y-auto rounded-[22px] bg-surface-2 p-4">
            <DagensAnkareSupermodul />
          </div>
        </div>
      </div>
    </div>
  );
}
