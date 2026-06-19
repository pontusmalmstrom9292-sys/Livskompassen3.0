import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import type { PlaneringTab } from '../types';
import { PlaneringHub } from './PlaneringHub';
import { PlaneringHubCollapsible } from './PlaneringHubCollapsible';
import { RoutinesPanel } from './RoutinesPanel';

type VerktygDrawerProps = {
  activeTab?: PlaneringTab;
  /** Inuti yttre CalmCollapsible (t.ex. B4 handling) — ingen egen fold. */
  embedded?: boolean;
};

const EXTRA_TOOLS: { id: PlaneringTab; label: string; lead: string; to: string }[] = [
  {
    id: 'inkop',
    label: 'Inköpslista',
    lead: 'Snabb punktlista — inte samma som Inkorg (mejl).',
    to: '/planering?tab=inkop',
  },
  {
    id: 'hub',
    label: 'Anpassa hub-layout',
    lead: '15 verktyg och 8 layouter — avancerat.',
    to: '/planering?tab=hub',
  },
];

function PlaneringExtraTools({ activeTab }: { activeTab?: PlaneringTab }) {
  const location = useLocation();
  const [showHub, setShowHub] = useState(false);
  const [showRutiner, setShowRutiner] = useState(location.hash === '#planering-rutiner');

  useEffect(() => {
    if (location.hash === '#planering-rutiner') {
      setShowRutiner(true);
    }
  }, [location.hash]);

  return (
    <div className="space-y-2">
      {EXTRA_TOOLS.map((tool) => (
        <Link
          key={tool.id}
          to={tool.to}
          className={`block rounded-xl border px-3 py-2 text-left transition ${
            activeTab === tool.id
              ? 'border-accent/40 bg-accent/10'
              : 'border-border/30 hover:border-accent/25'
          }`}
        >
          <span className="text-sm text-text">{tool.label}</span>
          <span className="mt-0.5 block text-xs text-text-dim">{tool.lead}</span>
        </Link>
      ))}

      <PlaneringHubCollapsible
        title="Rutiner / veckomeny"
        meta="Materialpaket"
        defaultOpen={showRutiner}
        open={showRutiner}
        onOpenChange={setShowRutiner}
      >
        <div id="planering-rutiner-drawer">
          <RoutinesPanel defaultOpen />
        </div>
      </PlaneringHubCollapsible>

      <PlaneringHubCollapsible
        title="Hub-layout"
        meta="15 verktyg · 8 layouter"
        defaultOpen={showHub}
        open={showHub}
        onOpenChange={setShowHub}
      >
        <PlaneringHub />
      </PlaneringHubCollapsible>
    </div>
  );
}

/** Fler verktyg — Inköpslista, Rutiner, Hub. Fokus/Framsteg/Regler = PlaneringMoreTabsBar. */
export function VerktygDrawer({ activeTab, embedded = false }: VerktygDrawerProps) {
  if (embedded) {
    return <PlaneringExtraTools activeTab={activeTab} />;
  }

  return (
    <PlaneringHubCollapsible title="Fler verktyg" meta="Inköp · Rutiner · Hub" defaultOpen={false}>
      <PlaneringExtraTools activeTab={activeTab} />
    </PlaneringHubCollapsible>
  );
}
