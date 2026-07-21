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

/** 'bygg' länkar till modulbygg — ej ännu i PlaneringTab-union (migrate-or-freeze). */
const EXTRA_TOOLS: { id: PlaneringTab | 'bygg'; label: string; lead: string; to: string }[] = [
  {
    id: 'inkop',
    label: 'Inköpslista',
    lead: 'Snabb punktlista — inte samma som Inkorg (mejl).',
    to: '/planering?tab=inkop',
  },
  {
    id: 'bygg',
    label: 'Mina moduler',
    lead: 'Egna nedräkningar, listor och notiser.',
    to: '/planering?tab=bygg',
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
    <div className="space-y-2" aria-label="Fler planeringsverktyg">
      {EXTRA_TOOLS.map((tool) => (
        <Link
          key={tool.id}
          to={tool.to}
          className={`block min-h-11 rounded-xl border px-3 py-2.5 text-left transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/55 ${
            activeTab === tool.id
              ? 'border-accent/40 bg-accent/10'
              : 'border-border/30 hover:border-accent/25'
          }`}
          aria-current={activeTab === tool.id ? 'page' : undefined}
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
