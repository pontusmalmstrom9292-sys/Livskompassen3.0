import type { DagbokMode } from '../types/journal';

const MODES: { id: DagbokMode; label: string }[] = [
  { id: 'snabb', label: 'Snabb' },
  { id: 'reflektera', label: 'Reflektera' },
  { id: 'arkiv', label: 'Arkiv' },
];

type DagbokModeNavProps = {
  mode: DagbokMode;
  onModeChange: (mode: DagbokMode) => void;
};

export function DagbokModeNav({ mode, onModeChange }: DagbokModeNavProps) {
  return (
    <nav className="dagbok-mode-nav" aria-label="Dagboksläge">
      {MODES.map((m) => {
        const active = mode === m.id;
        return (
          <button
            key={m.id}
            type="button"
            className={`dagbok-mode-nav__tab min-h-11 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${active ? 'dagbok-mode-nav__tab--active' : ''}`}
            aria-current={active ? 'page' : undefined}
            onClick={() => onModeChange(m.id)}
          >
            {m.label}
          </button>
        );
      })}
    </nav>
  );
}
