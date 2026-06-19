import { Link } from 'react-router-dom';
import { FolderKanban, List, Image, FileText, CheckSquare, Video } from 'lucide-react';
import { useActiveProjects } from '../hooks/useProjects';
import type { ProjectBlockType } from '../types';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { GoraHubTabBar } from '@/core/navigation/GoraHubTabBar';
import { ProjektTomStatePanel } from './ProjektTomStatePanel';

const BLOCK_ICONS: Record<ProjectBlockType, typeof List> = {
  list: List,
  note: FileText,
  image: Image,
  task: CheckSquare,
  video: Video,
};

/** Projekt-hub — aktiva projekt från Firestore (P1). */
export function ProjektHubPage() {
  const { user, projects, loading } = useActiveProjects();

  return (
    <HubPageShell
      eyebrow="Göra"
      title="Egna planeringar"
      lead="Listor, anteckningar och uppgifter — status i Handling med valfritt projekt-ID."
    >
      <GoraHubTabBar />

      <div className="space-y-4">
      {!user && (
        <p className="text-sm text-text-muted">Logga in för att spara projekt.</p>
      )}

      {user && loading && <p className="text-sm text-text-dim">Laddar projekt…</p>}

      {user && !loading && projects.length === 0 && (
        <div className="calm-card glow-bottom-gold overflow-hidden rounded-2xl p-4 sm:p-5">
          <ProjektTomStatePanel />
        </div>
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
          className="btn-pill--ghost flex w-full flex-col items-center justify-center gap-0.5 py-3 text-sm"
        >
          <span>Genvägar per profil</span>
          <span className="text-xs font-normal text-text-dim">
            Anpassa knappar på Familjen, MåBra och Hamn
          </span>
        </Link>
        <Link to="/planering?tab=handling" className="btn-pill--secondary flex w-full items-center justify-center gap-2">
          Till Handling (kanban)
        </Link>
      </div>
      </div>
    </HubPageShell>
  );
}
