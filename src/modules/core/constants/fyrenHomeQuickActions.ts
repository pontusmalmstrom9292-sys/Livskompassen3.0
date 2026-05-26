import {
  Calendar,
  Image,
  List,
  Mic,
  PenLine,
  Plus,
} from 'lucide-react';
import { Wallet } from 'lucide-react';

/** Hem — snabbåtgärder (header-strip + tidigare höger-rail). */
export const FYREN_HOME_QUICK_ACTIONS = [
  { id: 'projekt', label: 'Projekt', to: '/projekt/ny', Icon: Plus },
  { id: 'lista', label: 'Lista', to: '/projekt/ny', Icon: List },
  { id: 'anteckning', label: 'Anteckning', to: '/widget/anteckning', Icon: PenLine },
  { id: 'bild', label: 'Bild', to: '/projekt/ny', Icon: Image },
  { id: 'inspelning', label: 'Inspelning', to: '/widget/inspelning?autostart=1', Icon: Mic },
  { id: 'planering', label: 'Planering', to: '/planering', Icon: Calendar },
  { id: 'ekonomi', label: 'Ekonomi', to: '/vardagen?tab=ekonomi', Icon: Wallet },
] as const;
