import type { Project, ProjectStatus } from './types';

export type ProjectCounts = Record<ProjectStatus, number>;

/** Antal projekt per status — driver räknare och filtersynlighet. */
export function computeProjectCounts(projects: Project[]): ProjectCounts {
  return {
    active: projects.filter((p) => p.status === 'active').length,
    paused: projects.filter((p) => p.status === 'paused').length,
    archived: projects.filter((p) => p.status === 'archived').length,
  };
}

export function totalProjects(counts: ProjectCounts): number {
  return counts.active + counts.paused + counts.archived;
}

/** Statusflikar visas progressivt — endast när det finns något pausat eller arkiverat. */
export function shouldShowStatusTabs(counts: ProjectCounts): boolean {
  return counts.paused > 0 || counts.archived > 0;
}

/** Projekt i vald status, valfritt filtrerade på fritextsökning i titeln. */
export function filterProjects(
  projects: Project[],
  status: ProjectStatus,
  search: string,
): Project[] {
  const q = search.trim().toLowerCase();
  return projects
    .filter((p) => p.status === status)
    .filter((p) => (q ? p.title.toLowerCase().includes(q) : true));
}

/** Sökfält visas först när listan är lång nog att behöva det. */
export const SEARCH_VISIBLE_THRESHOLD = 4;

export function shouldShowSearch(countInStatus: number): boolean {
  return countInStatus > SEARCH_VISIBLE_THRESHOLD;
}
