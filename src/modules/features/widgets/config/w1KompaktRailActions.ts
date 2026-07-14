import { NAV_PATHS } from '@/core/navigation/navTruth';

export type W1KompaktRailId =
  | 'nytt-projekt'
  | 'lista'
  | 'anteckning'
  | 'bild'
  | 'tyst-inspelning'
  | 'planering'
  | 'valv';

export type W1KompaktRailIcon =
  | 'sparkles'
  | 'list'
  | 'pen'
  | 'camera'
  | 'mic'
  | 'plan'
  | 'shield';

export type W1KompaktRailAction =
  | {
      id: W1KompaktRailId;
      label: string;
      icon: W1KompaktRailIcon;
      kind: 'route';
      to: string;
    }
  | {
      id: 'nytt-projekt';
      label: string;
      icon: 'sparkles';
      kind: 'picker';
    };

/** W1 v2 kompakt strip — Theme Lab → prod (widget-routes + planering/valv). */
export const W1_KOMPAKT_RAIL_ACTIONS: W1KompaktRailAction[] = [
  { id: 'nytt-projekt', label: 'Nytt projekt', icon: 'sparkles', kind: 'picker' },
  { id: 'lista', label: 'Lista', icon: 'list', kind: 'route', to: '/widget/projekt' },
  { id: 'anteckning', label: 'Anteckning', icon: 'pen', kind: 'route', to: '/widget/anteckning' },
  { id: 'bild', label: 'Bild', icon: 'camera', kind: 'route', to: '/widget/projekt' },
  {
    id: 'tyst-inspelning',
    label: 'Tyst inspelning',
    icon: 'mic',
    kind: 'route',
    to: '/widget/inspelning?autostart=1&discreet=1',
  },
  {
    id: 'planering',
    label: 'Planering',
    icon: 'plan',
    kind: 'route',
    to: '/planering?tab=handling&picked=1',
  },
  { id: 'valv', label: 'Valv', icon: 'shield', kind: 'route', to: NAV_PATHS.VALVET },
];
