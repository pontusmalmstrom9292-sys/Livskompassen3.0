import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, ArchiveRestore, FolderKanban, Plus, Search, Settings2, Sparkles } from 'lucide-react';
import { useAllProjects } from '../hooks/useProjects';
import { updateProjectStatus } from '../api/projectsApi';
import { DEFAULT_PROJECT_ICON, PROJECT_BLOCK_META, projectBlockLabel } from '../projectBlockMeta';
import type { Project, ProjectStatus } from '../types';
import { HubPageShell } from '@/core/layout/HubPageShell';
import { GoraHubTabBar } from '@/core/navigation/GoraHubTabBar';
import { TabBar, type TabBarItem } from '@/core/ui/TabBar';
import { HubPanelSkeleton } from '@/core/ui/HubPanelSkeleton';
import { HubErrorBoundary } from '@/shared/ui/HubErrorBoundary';
import { ProjektTomStatePanel } from './ProjektTomStatePanel';

const STATUS_TABS: TabBarItem<ProjectStatus>[] = [
  { id: 'active', label: 'Aktiva' },
  { id: 'paused', label: 'Pausade' },
  { id: 'archived', label: 'Arkiv' },
];

const EMPTY_FILTER_MESSAGE: Record<ProjectStatus, string> = {
  active: 'Inga aktiva projekt — skapa ett nytt eller återställ från arkivet.',
  paused: 'Inga pausade projekt just nu.',
  archived: 'Arkivet är tomt.',
};

/** Ett projekt i listan — klickbar rad + arkivera/återställ-knapp. */
function ProjectRow({
  project,
  busy,
  onArchive,
  onRestore,
}: {
  project: Project;
  busy: boolean;
  onArchive: (project: Project) => void;
  onRestore: (project: Project) => void;
}) {
  const Icon = project.primaryBlockType
    ? PROJECT_BLOCK_META[project.primaryBlockType].icon
    : DEFAULT_PROJECT_ICON;
  const isArchived = project.status === 'archived';

  return (
    <div className="elongated-module elongated-module--gold flex items-center gap-2 p-4">
      <Link
        to={`/admin/projects/${project.id}`}
        className="flex min-w-0 flex-1 items-center gap-3"
      >
        <Icon className="h-5 w-5 shrink-0 text-accent" />
        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-accent">{project.title}</span>
          <span className="block text-xs text-text-muted">
            {projectBlockLabel(project.primaryBlockType)}
            {project.updatedAt
              ? ` · ${new Date(project.updatedAt).toLocaleDateString('sv-SE')}`
              : ''}
          </span>
        </span>
      </Link>
      <button
        type="button"
        disabled={busy}
        onClick={() => (isArchived ? onRestore(project) : onArchive(project))}
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-text-muted transition hover:text-accent disabled:opacity-50"
        aria-label={isArchived ? `Återställ ${project.title}` : `Arkivera ${project.title}`}
        title={isArchived ? 'Återställ' : 'Arkivera'}
      >
        {isArchived ? <ArchiveRestore className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
      </button>
    </div>
  );
}

/** Projekt-hub — listor, anteckningar, bilder och uppgifter med statusfilter (P1). */
export function ProjektHubPage() {
  const { user, projects, loading } = useAllProjects();
  const [status, setStatus] = useState<ProjectStatus>('active');
  const [search, setSearch] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const counts = useMemo(
    () => ({
      active: projects.filter((p) => p.status === 'active').length,
      paused: projects.filter((p) => p.status === 'paused').length,
      archived: projects.filter((p) => p.status === 'archived').length,
    }),
    [projects],
  );

  const total = counts.active + counts.paused + counts.archived;
  const showStatusTabs = counts.paused > 0 || counts.archived > 0;
  const effectiveStatus: ProjectStatus = showStatusTabs ? status : 'active';

  const inStatus = useMemo(
    () => projects.filter((p) => p.status === effectiveStatus),
    [projects, effectiveStatus],
  );
  const showSearch = inStatus.length > 4;
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? inStatus.filter((p) => p.title.toLowerCase().includes(q)) : inStatus;
  }, [inStatus, search]);

  const changeStatus = async (project: Project, next: ProjectStatus) => {
    if (!user) return;
    setBusyId(project.id);
    try {
      await updateProjectStatus(user.uid, project.id, next);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <HubErrorBoundary title="Projekt kunde inte laddas" glow="gold" logTag="ProjektHubPage">
      <HubPageShell
        eyebrow="Göra"
        title="Projekt"
        lead="Samla listor, anteckningar, bilder och uppgifter på ett ställe. Uppgifter med status hamnar i Handling."
        headerAside={
          user && !loading && counts.active > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/40 px-3 py-1 text-xs text-text-muted">
              <FolderKanban className="h-3.5 w-3.5 text-accent" />
              {counts.active} aktiva
            </span>
          ) : undefined
        }
      >
        <GoraHubTabBar />

        <div className="space-y-4">
          {!user && (
            <p className="text-sm text-text-muted">Logga in för att spara projekt.</p>
          )}

          {user && (
            <Link
              to="/projekt/ny"
              className="btn-pill--accent flex w-full items-center justify-center gap-2 py-3"
            >
              <Plus className="h-4 w-4" />
              Nytt projekt
            </Link>
          )}

          {user && loading && <HubPanelSkeleton label="Laddar projekt…" lines={3} />}

          {showStatusTabs && (
            <TabBar<ProjectStatus>
              tabs={STATUS_TABS}
              active={effectiveStatus}
              onChange={setStatus}
              size="compact"
            />
          )}

          {showSearch && (
            <label className="relative block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Sök bland projekt…"
                className="input-glass w-full pl-9 text-sm"
              />
            </label>
          )}

          {user && !loading && total === 0 && (
            <div className="calm-card glow-bottom-gold overflow-hidden rounded-2xl p-4 sm:p-5">
              <ProjektTomStatePanel />
            </div>
          )}

          {user && !loading && total > 0 && visible.length === 0 && (
            <p className="rounded-2xl border border-border/60 bg-surface/30 p-4 text-sm text-text-muted">
              {search.trim()
                ? 'Inga projekt matchar sökningen.'
                : EMPTY_FILTER_MESSAGE[effectiveStatus]}
            </p>
          )}

          {user && visible.length > 0 && (
            <div className="home-module-stack">
              {visible.map((project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  busy={busyId === project.id}
                  onArchive={(p) => void changeStatus(p, 'archived')}
                  onRestore={(p) => void changeStatus(p, 'active')}
                />
              ))}
            </div>
          )}

          <div className="space-y-2 border-t border-border/50 pt-4">
            <p className="text-xs uppercase tracking-widest text-text-dim">Verktyg</p>
            <Link
              to="/projekt/regler"
              className="btn-pill--ghost flex w-full items-center justify-center gap-2 text-sm"
            >
              <Settings2 className="h-4 w-4" />
              Regler & automation
            </Link>
            <Link
              to="/projekt/genvagar"
              className="btn-pill--ghost flex w-full flex-col items-center justify-center gap-0.5 py-3 text-sm"
            >
              <span className="inline-flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Genvägar per profil
              </span>
              <span className="text-xs font-normal text-text-dim">
                Anpassa knappar på Familjen, MåBra och Hamn
              </span>
            </Link>
          </div>
        </div>
      </HubPageShell>
    </HubErrorBoundary>
  );
}
