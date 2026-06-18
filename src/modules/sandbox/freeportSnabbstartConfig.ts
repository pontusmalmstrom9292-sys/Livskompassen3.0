import type { LucideIcon } from 'lucide-react';
import {
  BookOpen,
  Brain,
  ClipboardList,
  Heart,
  Inbox,
  Mic,
  PenLine,
  Sparkles,
} from 'lucide-react';
import type { FreeportChameleonTarget } from './freeportChameleonBridge';

export type SnabbstartItemId =
  | 'anteckning'
  | 'inspelning'
  | 'dagbok'
  | 'inkast'
  | 'kompass'
  | 'planering'
  | 'mabra'
  | 'speglar'
  | 'barnfokus'
  | 'lista';

export type SnabbstartCatalogEntry = {
  id: SnabbstartItemId;
  label: string;
  icon: LucideIcon;
  defaultEnabled: boolean;
  morph: FreeportChameleonTarget;
};

const STORAGE_KEY = 'lk:freeport:snabbstart:v1';

export const SNABBSTART_CATALOG: SnabbstartCatalogEntry[] = [
  {
    id: 'anteckning',
    label: 'Anteckning',
    icon: PenLine,
    defaultEnabled: true,
    morph: { zone: 'vardagen', module: 'planering', mode: 'inkast' },
  },
  {
    id: 'inspelning',
    label: 'Inspelning',
    icon: Mic,
    defaultEnabled: true,
    morph: { zone: 'vardagen', module: 'mabra', mode: 'checkin' },
  },
  {
    id: 'dagbok',
    label: 'Dagbok',
    icon: BookOpen,
    defaultEnabled: true,
    morph: { zone: 'hjartat', module: 'dagbok', mode: 'reflektion' },
  },
  {
    id: 'inkast',
    label: 'Inkast',
    icon: Inbox,
    defaultEnabled: true,
    morph: { zone: 'vardagen', module: 'planering', mode: 'inkast' },
  },
  {
    id: 'kompass',
    label: 'Kompass',
    icon: Sparkles,
    defaultEnabled: true,
    morph: { zone: 'vardagen', module: 'planering', mode: 'task_quick' },
  },
  {
    id: 'planering',
    label: 'Planering',
    icon: ClipboardList,
    defaultEnabled: false,
    morph: { zone: 'vardagen', module: 'planering', mode: 'task_quick' },
  },
  {
    id: 'mabra',
    label: 'MåBra',
    icon: Heart,
    defaultEnabled: false,
    morph: { zone: 'vardagen', module: 'mabra', mode: 'checkin' },
  },
  {
    id: 'speglar',
    label: 'Speglar',
    icon: Brain,
    defaultEnabled: false,
    morph: { zone: 'hjartat', module: 'dagbok', mode: 'quick_mirror' },
  },
  {
    id: 'barnfokus',
    label: 'Barnfokus',
    icon: Heart,
    defaultEnabled: false,
    morph: { zone: 'familjen', module: 'familjen', mode: 'barnfokus' },
  },
  {
    id: 'lista',
    label: 'Lista',
    icon: ClipboardList,
    defaultEnabled: false,
    morph: { zone: 'vardagen', module: 'planering', mode: 'quick_list' },
  },
];

export function getDefaultEnabledIds(): SnabbstartItemId[] {
  return SNABBSTART_CATALOG.filter((e) => e.defaultEnabled).map((e) => e.id);
}

export function loadSnabbstartEnabledIds(): SnabbstartItemId[] {
  if (typeof window === 'undefined') return getDefaultEnabledIds();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultEnabledIds();
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return getDefaultEnabledIds();
    const valid = new Set(SNABBSTART_CATALOG.map((e) => e.id));
    const ids = parsed.filter((id): id is SnabbstartItemId => typeof id === 'string' && valid.has(id as SnabbstartItemId));
    return ids.length > 0 ? ids : getDefaultEnabledIds();
  } catch {
    return getDefaultEnabledIds();
  }
}

export function saveSnabbstartEnabledIds(ids: SnabbstartItemId[]): void {
  if (typeof window === 'undefined') return;
  const valid = new Set(SNABBSTART_CATALOG.map((e) => e.id));
  const cleaned = ids.filter((id) => valid.has(id));
  if (cleaned.length === 0) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
}

export function resolveSnabbstartEntry(id: SnabbstartItemId): SnabbstartCatalogEntry | undefined {
  return SNABBSTART_CATALOG.find((e) => e.id === id);
}
