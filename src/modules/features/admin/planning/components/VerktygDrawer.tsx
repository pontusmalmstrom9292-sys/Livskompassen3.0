import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronDown, Wrench } from 'lucide-react';
import { PLANERING_MORE_TABS } from '../constants';
import type { PlaneringTab } from '../types';
import { PlaneringHub } from './PlaneringHub';
import { RoutinesPanel } from './RoutinesPanel';

type VerktygDrawerProps = {
  activeTab?: PlaneringTab;
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

/** Fler verktyg — Regler, Rutiner, Inköpslista, Hub. Progressive disclosure. */
export function VerktygDrawer({ activeTab }: VerktygDrawerProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [showHub, setShowHub] = useState(false);
  const [showRutiner, setShowRutiner] = useState(false);

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="btn-pill--ghost flex w-full items-center justify-between gap-2 text-xs uppercase tracking-widest text-text-dim"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <Wrench className="h-3.5 w-3.5" aria-hidden />
          Fler verktyg
        </span>
        <ChevronDown className={`h-4 w-4 transition ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>

      {open && (
        <div className="calm-card glow-bottom-gold space-y-2 rounded-2xl border border-border/30 p-3">
          {PLANERING_MORE_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => navigate(`/planering?tab=${id}`)}
              className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                activeTab === id
                  ? 'border-accent/40 bg-accent/10 text-accent'
                  : 'border-border/30 text-text-muted hover:border-accent/25'
              }`}
            >
              {label}
            </button>
          ))}

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

          <button
            type="button"
            onClick={() => setShowRutiner((v) => !v)}
            className="w-full rounded-xl border border-border/30 px-3 py-2 text-left text-sm text-text-muted hover:border-accent/25"
          >
            Rutiner / veckomeny
          </button>
          {showRutiner && (
            <div id="planering-rutiner-drawer">
              <RoutinesPanel />
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowHub((v) => !v)}
            className="w-full rounded-xl border border-border/30 px-3 py-2 text-left text-sm text-text-muted hover:border-accent/25"
          >
            {showHub ? 'Dölj hub-layout' : 'Visa hub-layout (avancerat)'}
          </button>
          {showHub && <PlaneringHub />}
        </div>
      )}
    </div>
  );
}
