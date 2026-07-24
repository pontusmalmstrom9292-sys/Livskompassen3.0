import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Compass,
  Heart,
  Home,
  LayoutGrid,
  Search,
  Settings,
  Shield,
  Users,
  Wallet,
} from 'lucide-react';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';

const ROWS = [
  { id: 'hem', label: 'Hem', sub: 'Dagens kompass', icon: Home, zone: 'hem' },
  { id: 'ekonomi', label: 'Ekonomi', sub: 'Konton & flöde', icon: Wallet, zone: 'vardagen' },
  { id: 'plan', label: 'Planering', sub: 'Vecka & projekt', icon: LayoutGrid, zone: 'vardagen' },
  { id: 'mabra', label: 'Mabra', sub: 'Check-in & verktyg', icon: Heart, zone: 'vardagen' },
  { id: 'dagbok', label: 'Dagbok', sub: 'Reflektion', icon: BookOpen, zone: 'hjartat' },
  { id: 'familjen', label: 'Familjen', sub: 'Barnfokus & hamn', icon: Users, zone: 'familjen' },
  { id: 'valv', label: 'Säkerhet', sub: 'Efter upplåsning', icon: Shield, zone: 'valv' },
  { id: 'kompass', label: 'Kompass', sub: 'Morgon & kväll', icon: Compass, zone: 'hem' },
  { id: 'install', label: 'Inställningar', sub: 'Konto & support', icon: Settings, zone: '—' },
] as const;

type Props = { onStatus?: (msg: string) => void };

/** RESURSER — fyllig 3D-meny (chrome v3). */
export function FreeportResurserLab({ onStatus }: Props) {
  const [navActive, setNavActive] = useState<ExecutiveNavId>('resurser');
  const [activeRow, setActiveRow] = useState('hem');
  const [query, setQuery] = useState('');

  const filtered = ROWS.filter(
    (r) => !query || r.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <ExecutivePhoneShell
      navActive={navActive}
      onNav={(id) => {
        setNavActive(id);
        onStatus?.(`Nav: ${id}`);
      }}
    >
      <header className="design-freeport__exec-header">
        <h2 className="design-freeport__exec-screen-title">Resurser</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass design-freeport__exec-header-compass--lg" />
      </header>

      <nav className="design-freeport__exec-menu-stack" aria-label="Resurser">
        {filtered.map((row) => {
          const Icon = row.icon;
          const isOn = activeRow === row.id;
          return (
            <button
              key={row.id}
              type="button"
              className={[
                'design-freeport__exec-menu-pill',
                isOn ? 'design-freeport__exec-menu-pill--on' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                setActiveRow(row.id);
                onStatus?.(`${row.label} → ${row.zone}`);
              }}
            >
              <span className="design-freeport__exec-menu-pill-icon">
                <Icon className="h-4 w-4" />
              </span>
              <span className="design-freeport__exec-menu-pill-body">
                <span className="design-freeport__exec-menu-pill-title">{row.label}</span>
                <span className="design-freeport__exec-menu-pill-sub">{row.sub}</span>
              </span>
              <span className="design-freeport__exec-menu-pill-chevron">›</span>
            </button>
          );
        })}
      </nav>

      <div className="design-freeport__exec-search-wrap design-freeport__exec-search-wrap--recessed">
        <Search className="design-freeport__exec-search-icon" />
        <input
          type="search"
          className="design-freeport__exec-search"
          placeholder="Sök resurser…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Sök resurser"
        />
      </div>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">
          ← Prod
        </Link>
        {' · '}
        Fyllig 3D-meny · prod = drawer
      </p>
    </ExecutivePhoneShell>
  );
}
