// src/modules/core/navigation/navigationRegistry.ts

export const NAVIGATION_STRUCTURE = {
  lifeJournal: {
    id: 'lifeJournal',
    path: '/dagbok',
    label: 'Hjärtat',
    icon: 'heart',
    description: 'Din dagbok, bevis och speglar',
    tabs: {
      diary: { id: 'diary', label: 'Dagbok', path: '?tab=diary' },
      evidence: { id: 'evidence', label: 'Bevis', path: '?tab=bevis' },
      mirrors: { id: 'mirrors', label: 'Speglar', path: '?tab=speglar' },
    },
  },
  dailyLife: {
    id: 'dailyLife',
    path: '/vardagen',
    label: 'Vardagen',
    icon: 'sun',
    tabs: {
      compasses: { id: 'compasses', label: 'Kompasser', path: '?tab=kompasser' },
      economy: { id: 'economy', label: 'Ekonomi', path: '?tab=ekonomi' },
      work: { id: 'work', label: 'Arbetsliv', path: '?tab=work' },
      health: { id: 'health', label: 'Drogfrihet', path: '?tab=health' },
    },
  },
  family: {
    id: 'family',
    path: '/familjen',
    label: 'Familjen',
    icon: 'users',
    tabs: {
      children: { id: 'children', label: 'Barnen', path: '?tab=children' },
      harbor: { id: 'harbor', label: 'Trygg hamn', path: '/hamn' },
    },
  },
  admin: {
    id: 'admin',
    path: '/admin',
    label: 'Administration',
    icon: 'settings',
    tabs: {
      projects: { id: 'projects', label: 'Projekt', path: '?tab=projects' },
      planning: { id: 'planning', label: 'Planering', path: '?tab=planning' },
    },
  },
};

export type NavigationId = keyof typeof NAVIGATION_STRUCTURE;
export type ClusterConfig = (typeof NAVIGATION_STRUCTURE)[NavigationId];
