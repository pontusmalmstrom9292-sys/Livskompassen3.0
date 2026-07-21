import {
  Calendar,
  HeartPulse,
  Image,
  List,
  Mic,
  PenLine,
  Plus,
  Sunrise,
} from 'lucide-react';
import { Wallet } from 'lucide-react';

/** Hem — snabbåtgärder (header-strip + tidigare höger-rail). */
export const FYREN_HOME_QUICK_ACTIONS = [
  { id: 'projekt', label: 'Projekt', to: '/admin/projects/ny', Icon: Plus },
  { id: 'lista', label: 'Lista', to: '/admin/projects/ny', Icon: List },
  { id: 'anteckning', label: 'Anteckning', to: '/widget/anteckning', Icon: PenLine },
  { id: 'bild', label: 'Bild', to: '/admin/projects/ny', Icon: Image },
  { id: 'inspelning', label: 'Inspelning', to: '/widget/inspelning?autostart=1', Icon: Mic },
  { id: 'planering', label: 'Planering', to: '/planering?tab=handling', Icon: Calendar },
  { id: 'morgon', label: 'Morgon', to: '/morgon', Icon: Sunrise },
  { id: 'ekonomi', label: 'Ekonomi', to: '/vardagen?tab=ekonomi', Icon: Wallet },
  {
    id: 'drogfrihet-akut',
    label: 'SOS sug',
    to: '/familjen?tab=drogfrihet&akut=1',
    Icon: HeartPulse,
  },
] as const;
