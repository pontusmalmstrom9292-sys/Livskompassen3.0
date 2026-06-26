import { useState } from 'react';
import { Link } from 'react-router-dom';
import { W1KompaktProjektPreview } from '@/modules/sandbox/widget/W1KompaktProjektPreview';
import w1MockupRef from '../../../../docs/design/galleri/widget/v2/W1-kompakt-projekt.png';
import pickerMockupRef from '../../../../docs/design/galleri/widget/v2/projekt-ny-picker.png';

export function W1KompaktProjektLabPage() {
  const [status, setStatus] = useState('Tryck på höger rail, Dagens riktning eller dock.');

  return (
    <div className="module-list theme-lab-page w1-lab-page">
      <header className="glass-card p-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-text-dim">Theme Lab · Widget v2</p>
        <h1 className="mt-1 font-display-serif text-xl tracking-[0.12em] text-accent">
          W1 — Kompakt projekt
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Executive Midnight · höger rail · Kognitiv sköld · Dagens riktning · Nytt projekt-picker.
          Prototyp — ingen prod-wire.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/dev/theme-lab" className="btn-pill--ghost text-xs">
            ← Theme Lab
          </Link>
          <a
            href="/docs/design/galleri/index.html#widget"
            target="_blank"
            rel="noreferrer"
            className="btn-pill--ghost text-xs"
          >
            Designgalleri ↗
          </a>
        </div>
        <p className="w1-lab-status mt-3" role="status">
          {status}
        </p>
      </header>

      <section className="glass-card p-4 w1-lab-compare">
        <div className="w1-lab-compare__ref">
          <h2 className="text-xs uppercase tracking-widest text-text-dim">Referens (mockup)</h2>
          <img src={w1MockupRef} alt="W1 kompakt projekt mockup" className="mt-2" />
        </div>
        <div>
          <h2 className="text-xs uppercase tracking-widest text-text-dim">Live prototyp</h2>
          <div className="mt-2">
            <W1KompaktProjektPreview onStatus={setStatus} />
          </div>
        </div>
      </section>

      <section className="glass-card p-4">
        <h2 className="text-xs uppercase tracking-widest text-text-dim">Projekt-picker (referens)</h2>
        <p className="mt-1 text-xs text-text-muted">
          Öppnas via «Nytt projekt» i höger rail. 6 typer enligt mockup.
        </p>
        <img
          src={pickerMockupRef}
          alt="Nytt projekt picker mockup"
          className="mt-3 w-full max-w-xs rounded-xl border border-border/40 object-cover"
        />
      </section>
    </div>
  );
}
