import { LifeBuoy } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSOSStore } from '@/modules/core/store/sosStore';

/** SOS — första barn i app-main (inte header). */
export function SosMainTrigger() {
  const location = useLocation();
  const activateSOS = useSOSStore((s) => s.activateSOS);

  if (location.pathname.startsWith('/widget')) return null;

  return (
    <button
      type="button"
      onClick={activateSOS}
      className="header-chrome-btn header-chrome-btn--round mr-1 self-start"
      aria-label="Aktivera SOS-läge"
    >
      <LifeBuoy className="header-chrome-btn__glyph h-6 w-6 text-accent/75 transition-colors hover:text-accent-light" />
    </button>
  );
}
