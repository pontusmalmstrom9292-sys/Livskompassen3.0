import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlaneringHubBody } from '../../admin/planning/components/PlaneringHubBody';
import { PlaneringHubLayoutPicker } from '../../admin/planning/components/PlaneringHubLayoutPicker';
import {
  PLANERING_HUB_LAYOUTS,
  type PlaneringHubLayoutId,
} from '../../admin/planning/planeringHubLayouts';
import { usePlaneringHubLayout } from '../../admin/planning/usePlaneringHubLayout';
import { ALL_PLANERING_HUB_MODULE_IDS } from '../../admin/planning/planeringHubModules';

export function HubLabPage() {
  const { layoutId, setLayoutId } = usePlaneringHubLayout();
  const [previewId, setPreviewId] = useState<PlaneringHubLayoutId>(layoutId);
  const previewLayout = PLANERING_HUB_LAYOUTS.find((l) => l.id === previewId)!;

  const applyToPlanering = () => {
    setLayoutId(previewId);
  };

  return (
    <div className="module-list hub-lab-page">
      <header className="glass-card p-4">
        <h1 className="font-display text-xl font-light text-accent">Hub Lab</h1>
        <p className="mt-2 text-sm text-text-muted">
          Åtta planeringshubbar med olika verktyg, layout och färger. Valet sparas och
          syns på <code className="text-accent">/planering</code>.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link to="/planering" className="btn-pill--accent">
            Öppna Planering
          </Link>
          <Link to="/dev/theme-lab" className="btn-pill--ghost">
            Theme Lab
          </Link>
          <button type="button" className="btn-pill--ghost" onClick={applyToPlanering}>
            Använd i Planering
          </button>
        </div>
      </header>

      <section className="glass-card p-4">
        <h2 className="text-xs uppercase tracking-widest text-text-dim">Välj layout</h2>
        <div className="mt-3">
          <PlaneringHubLayoutPicker
            activeId={previewId}
            onSelect={setPreviewId}
          />
        </div>
      </section>

      <section className="glass-card p-4">
        <h2 className="text-xs uppercase tracking-widest text-text-dim">
          Live — {previewLayout.label}
        </h2>
        <p className="mt-1 text-xs text-text-muted">
          Moduler: {previewLayout.modules.join(', ')} · stil: {previewLayout.style}
        </p>
        <div className="hub-lab-preview mt-4">
          <PlaneringHubBody layout={previewLayout} />
        </div>
      </section>

      <section className="glass-card p-4">
        <h2 className="text-xs uppercase tracking-widest text-text-dim">
          Alla hubbar ({PLANERING_HUB_LAYOUTS.length})
        </h2>
        <div className="hub-lab-grid mt-4">
          {PLANERING_HUB_LAYOUTS.map((layout) => (
            <article
              key={layout.id}
              className={`hub-lab-card hub-lab-card--${layout.shell}`}
            >
              <button
                type="button"
                className="hub-lab-card__select"
                onClick={() => setPreviewId(layout.id)}
              >
                <span className="hub-lab-card__emoji">{layout.emoji}</span>
                <span className="hub-lab-card__title">{layout.label}</span>
                <span className="hub-lab-card__meta">
                  {layout.modules.length} verktyg · {layout.style}
                </span>
              </button>
              <div className="hub-lab-card__preview">
                <PlaneringHubBody layout={layout} className="hub-lab-card__body" />
              </div>
              <button
                type="button"
                className="btn-pill--ghost mt-2 w-full text-xs"
                onClick={() => {
                  setPreviewId(layout.id);
                  setLayoutId(layout.id);
                }}
              >
                Välj i Planering
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="glass-card p-4">
        <h2 className="text-xs uppercase tracking-widest text-text-dim">
          Modulkatalog ({ALL_PLANERING_HUB_MODULE_IDS.length})
        </h2>
        <ul className="mt-3 grid gap-2 text-sm text-text-muted sm:grid-cols-2">
          {ALL_PLANERING_HUB_MODULE_IDS.map((id) => (
            <li key={id}>
              <code className="text-accent">{id}</code>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
