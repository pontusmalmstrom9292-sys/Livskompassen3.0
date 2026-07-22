import { LifeBuoy } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSOSStore } from '@/modules/core/store/sosStore';

/** SOS — första barn i app-main (inte header). Öppnar samma SOS Ankare som MåBra. */
export function SosMainTrigger() {
  const location = useLocation();
  const activateSOS = useSOSStore((s) => s.activateSOS);

  if (location.pathname.startsWith('/widget')) return null;

  return (
    <button
      type="button"
      onClick={activateSOS}
      className="sos-trigger header-chrome-btn header-chrome-btn--round mr-1 min-h-11 min-w-11 self-start focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55"
      aria-label="Aktivera SOS-läge"
      title="SOS Ankare — andning och grundning"
    >
      <LifeBuoy className="header-chrome-btn__glyph h-6 w-6 text-accent/75 transition-colors hover:text-accent-light" />
    </button>
  );
}
