import { Archive } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { MabraProject } from '../constants/mabraProjects';
import { VIT_HUB_KRAVLOST, VIT_HUB_TAGLINE, VIT_HUB_VAULT_LINK } from '../lib/vitHubCopy';
import { vitHubFilteredLink } from '../lib/vitHubLinks';
import { PLAN_KIND_LABELS } from '../constants/mabraProjects';
import type { MabraPlanKind } from '../constants/mabraProjects';
import { EmotionalMemoryView } from './EmotionalMemoryView';
import { VitCardFlowPanel } from './VitCardFlowPanel';
import { VitChatFlowPanel } from './VitChatFlowPanel';
import { VitMemoryFlowPanel } from './VitMemoryFlowPanel';

type Props = {
  project: MabraProject;
  selectedPlan: MabraPlanKind | null;
  onSelectPlan: (kind: MabraPlanKind) => void;
  onBack: () => void;
  userId?: string;
};

/** P1 — planväljare + frågekort-flöde mot Firestore Vit hub. */
export function VitHubPreview({ project, selectedPlan, onSelectPlan, onBack, userId }: Props) {
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
        <p className="mt-2 text-sm text-text-muted">{VIT_HUB_TAGLINE}</p>
        <p className="mt-1 text-xs text-text-dim">{VIT_HUB_KRAVLOST}</p>
        <Link
          to={vitHubFilteredLink(undefined, project.id)}
          className="mt-2 inline-block text-xs text-accent underline-offset-2 hover:underline"
        >
          {VIT_HUB_VAULT_LINK}
        </Link>
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

      {selectedPlan === 'cards' && (
        <VitCardFlowPanel userId={userId} projectId={project.id} />
      )}

      {selectedPlan === 'chat' && (
        <VitChatFlowPanel userId={userId} projectId={project.id} />
      )}

      {selectedPlan === 'memory' && project.id === 'emotional_memory' ? (
        <EmotionalMemoryView userId={userId} projectId={project.id} />
      ) : null}

      {selectedPlan === 'memory' && project.id !== 'emotional_memory' ? (
        <VitMemoryFlowPanel userId={userId} projectId={project.id} />
      ) : null}

      <p className="text-xs text-text-dim">
        Fler övningar finns på MåBra-hubben under kategorin Utveckling (Vit).
      </p>
    </div>
  );
}
