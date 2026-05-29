import { Link } from 'react-router-dom';
import { FolderKanban, List, Image, FileText, CheckSquare } from 'lucide-react';
import { useActiveProjects } from '../hooks/useProjects';
import type { ProjectBlockType } from '../types';

const BLOCK_ICONS: Record<ProjectBlockType, typeof List> = {
  list: List,
  note: FileText,
  image: Image,
  task: CheckSquare,
};

/** Projekt-hub — aktiva projekt från Firestore (P1). */
export function ProjektHubPage() {
  const { user, projects, loading } = useActiveProjects();

  return (
    <div className="space-y-4">
      <header className="px-0.5">
        <p className="home-page__eyebrow">Projekt</p>
        <h1 className="home-page__title text-xl">Egna planeringar</h1>
        <p className="home-page__lead text-xs">
          Listor, anteckningar och uppgifter — status i Handling med valfritt projekt-ID.
        </p>
      </header>

      {!user && (
        <p className="text-sm text-text-muted">Logga in för att spara projekt.</p>
      )}

      {user && loading && <p className="text-sm text-text-dim">Laddar projekt…</p>}

      {user && !loading && projects.length === 0 && (
        <p className="text-sm text-text-dim">Inga aktiva projekt — skapa ett nedan.</p>
      )}

      {user && projects.length > 0 && (
        <div className="home-module-stack">
          {projects.map((project) => {
            const Icon = project.primaryBlockType
              ? BLOCK_ICONS[project.primaryBlockType]
              : FolderKanban;
            return (
              <Link
                key={project.id}
                to={`/admin/projects/${project.id}`}
                className="elongated-module elongated-module--gold flex items-center gap-3 p-4"
              >
                <Icon className="h-5 w-5 text-accent" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-accent">{project.title}</p>
                  <p className="text-xs text-text-muted">
                    {project.primaryBlockType ?? 'projekt'}
                    {project.updatedAt ? ` · ${new Date(project.updatedAt).toLocaleDateString('sv-SE')}` : ''}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Link
          to="/projekt/ny"
          className="btn-pill--accent flex w-full items-center justify-center gap-2"
        >
          <FolderKanban className="h-4 w-4" />
          Nytt projekt
        </Link>
        <Link
          to="/projekt/regler"
          className="btn-pill--ghost flex w-full items-center justify-center gap-2 text-sm"
        >
          Regler & automation
        </Link>
        <Link
          to="/projekt/genvagar"
          className="btn-pill--ghost flex w-full items-center justify-center gap-2 text-sm"
        >
          Genvägar per profil
        </Link>
        <Link to="/planering" className="btn-pill--secondary flex w-full items-center justify-center gap-2">
          Till Handling (kanban)
        </Link>
      </div>
    </div>
  );
}
