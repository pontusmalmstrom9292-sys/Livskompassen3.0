import { Link } from 'react-router-dom';
import { Archive } from 'lucide-react';
import type { MabraProject } from '../constants/mabraProjects';
import { PLAN_KIND_LABELS } from '../constants/mabraProjects';
import type { MabraPlanKind } from '../constants/mabraProjects';
import { KbtTransformatorPanel } from './KbtTransformatorPanel';

type Props = {
  project: MabraProject;
  selectedPlan: MabraPlanKind | null;
  onSelectPlan: (kind: MabraPlanKind) => void;
  onBack: () => void;
};

/** P0 — planväljare innan Firestore Vit hub finns. */
export function VitHubPreview({ project, selectedPlan, onSelectPlan, onBack }: Props) {
  return (
    <div className="space-y-4">
      <button type="button" onClick={onBack} className="btn-pill--ghost text-xs">
        Tillbaka till projekt
      </button>

      <div className="rounded-xl border border-accent/25 bg-accent/5 px-4 py-3">
        <p className="flex items-center gap-2 text-sm font-medium text-accent">
          <Archive className="h-4 w-4" />
          {project.vitHubLabel}
        </p>
        <p className="mt-2 text-sm text-text-muted">
          Valvet samlar dina svar här — statistik och utveckling över tid. Separat från
          juridiskt bevis mot ex.
        </p>
      </div>

      <p className="text-sm text-text-muted">Välj hur du vill börja (ett val):</p>
      <div className="flex flex-col gap-2">
        {project.planKinds.map((kind) => (
          <button
            key={kind}
            type="button"
            onClick={() => onSelectPlan(kind)}
            className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition ${
              selectedPlan === kind
                ? 'border-accent/45 bg-accent/10 text-accent'
                : 'border-border-strong text-text-muted hover:border-accent/25'
            }`}
          >
            {PLAN_KIND_LABELS[kind]}
          </button>
        ))}
      </div>

      {selectedPlan === 'cards' && <KbtTransformatorPanel />}

      {selectedPlan === 'chat' && (
        <div className="home-module-panel__question-box">
          <p className="text-sm text-text-muted">
            Coach-dialog — lågaffektiv, inåtvänd (mabraCoach efter övning).
          </p>
        </div>
      )}

      {selectedPlan === 'memory' && (
        <div className="home-module-panel__question-box">
          <p className="text-sm text-text-muted">
            Känslominne: Vem är jag? · Hur känner jag kring denna upplevelse?
          </p>
          <Link
            to="/dagbok?tab=bevis"
            className="btn-pill--accent mt-3 inline-flex text-xs"
          >
            Öppna Valv (förhandsvisning)
          </Link>
        </div>
      )}

      <p className="text-xs text-text-dim">
        Fler övningar finns på MåBra-hubben under kategorin Utveckling (Vit).
      </p>
    </div>
  );
}
