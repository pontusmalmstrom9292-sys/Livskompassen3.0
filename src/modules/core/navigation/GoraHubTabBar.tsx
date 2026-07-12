import { useLocation, useNavigate } from 'react-router-dom';
import { FolderKanban, Inbox, ListTodo } from 'lucide-react';
import { TabBar, type TabBarItem } from '../ui/TabBar';

export type GoraTab = 'handling' | 'projekt' | 'inkorg';

const GORA_TABS: TabBarItem<GoraTab>[] = [
  { id: 'handling', label: 'Handling', icon: <ListTodo className="h-3 w-3" /> },
  { id: 'projekt', label: 'Projekt', icon: <FolderKanban className="h-3 w-3" /> },
  { id: 'inkorg', label: 'Inkorg', icon: <Inbox className="h-3 w-3" /> },
];

const GORA_PATHS: Record<GoraTab, string> = {
  handling: '/planering?tab=handling',
  projekt: '/projekt',
  inkorg: '/planering?tab=inkorg',
};

/** Rensar konkurrerande query (inputMode, picked) som kan låsa Handling-vy på Android. */
export function buildGoraTabNavigateTarget(id: GoraTab): string {
  if (id === 'projekt') return GORA_PATHS.projekt;
  const params = new URLSearchParams();
  params.set('tab', id === 'inkorg' ? 'inkorg' : 'handling');
  return `/planering?${params.toString()}`;
}

export function resolveGoraTab(pathname: string, search: string): GoraTab {
  if (pathname.startsWith('/projekt') || pathname.startsWith('/admin/projects')) {
    return 'projekt';
  }
  if (pathname.startsWith('/planering')) {
    const tab = new URLSearchParams(search.replace(/^\?/, '')).get('tab');
    if (tab === 'inkorg') return 'inkorg';
    return 'handling';
  }
  const tab = new URLSearchParams(search.replace(/^\?/, '')).get('tab');
  if (tab === 'inkorg') return 'inkorg';
  return 'handling';
}

export function GoraHubTabBar() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const active = resolveGoraTab(pathname, search);

  return (
    <TabBar<GoraTab>
      tabs={GORA_TABS}
      active={active}
      onChange={(id) => navigate(buildGoraTabNavigateTarget(id))}
    />
  );
}
