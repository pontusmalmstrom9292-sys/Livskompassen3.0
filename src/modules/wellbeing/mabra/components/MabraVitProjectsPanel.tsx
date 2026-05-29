import { MABRA_PROJECTS, type MabraProjectId } from '../constants/mabraProjects';
import { formatVitProjectLastSeen } from '../lib/vitProjectLastSeen';

type Props = {
  lastSeen: Partial<Record<MabraProjectId, string>>;
  onOpenProject: (projectId: MabraProjectId) => void;
};

/** Fas 2 §3 — en rad per Vit-projekt, valfritt Senast. */
export function MabraVitProjectsPanel({ lastSeen, onOpenProject }: Props) {
  return (
    <section className="rounded-xl border border-border-strong bg-surface/25 p-4" aria-label="Fortsätt i Vit">
      <h2 className="text-sm font-medium text-text">Fortsätt i Vit</h2>
      <p className="mt-1 text-xs text-text-dim">Identitetsarbete — ett projekt i taget. Akutverktyg finns ovan.</p>
      <ul className="mt-3 space-y-2">
        {MABRA_PROJECTS.map((project) => {
          const Icon = project.icon;
          const seenIso = lastSeen[project.id];
          const seenLabel = seenIso ? formatVitProjectLastSeen(seenIso) : null;
          return (
            <li key={project.id}>
              <button
                type="button"
                onClick={() => onOpenProject(project.id)}
                className="flex w-full items-center gap-3 rounded-xl border border-border-strong px-3 py-3 text-left transition hover:border-accent/30 hover:bg-accent/5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium text-text">{project.title}</span>
                  <span className="block text-xs text-text-dim">{project.lead}</span>
                </span>
                {seenLabel ? (
                  <span className="shrink-0 text-[10px] uppercase tracking-wide text-text-dim">
                    Senast: {seenLabel}
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
