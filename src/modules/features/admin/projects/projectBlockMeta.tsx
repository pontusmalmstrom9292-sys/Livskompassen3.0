import { CheckSquare, FileText, Film, FolderKanban, Image, List, type LucideIcon } from 'lucide-react';
import type { ProjectBlockType } from './types';

export type ProjectBlockMeta = {
  /** Svenskt visningsnamn — en sanningskälla för hub, ny-sida och previews. */
  label: string;
  /** Kort förklaring på klarspråk. */
  hint: string;
  icon: LucideIcon;
};

export const PROJECT_BLOCK_META: Record<ProjectBlockType, ProjectBlockMeta> = {
  list: { label: 'Lista', hint: 'Punkter och steg — utan kanban-stress.', icon: List },
  note: { label: 'Anteckning', hint: 'Fri text, kopplas valfritt till Handling.', icon: FileText },
  image: { label: 'Bild', hint: 'Foto eller skärmdump med kort text.', icon: Image },
  video: { label: 'Video', hint: 'Kort klipp som sparas säkert.', icon: Film },
  task: { label: 'Uppgift', hint: 'Hamnar som kort i Handling.', icon: CheckSquare },
};

export const DEFAULT_PROJECT_ICON: LucideIcon = FolderKanban;

/** Svenskt namn för en projekttyp (faller tillbaka till "Projekt"). */
export function projectBlockLabel(type?: ProjectBlockType): string {
  return (type ? (PROJECT_BLOCK_META as Record<string, ProjectBlockMeta | undefined>)[type]?.label : undefined) ?? 'Projekt';
}

/** Ikon för en projekttyp (faller tillbaka till mapp-ikonen). */
export function projectBlockIcon(type?: ProjectBlockType): LucideIcon {
  return (type ? (PROJECT_BLOCK_META as Record<string, ProjectBlockMeta | undefined>)[type]?.icon : undefined) ?? DEFAULT_PROJECT_ICON;
}
