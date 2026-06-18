import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Heart,
  Home,
  LayoutGrid,
  Search,
  Settings,
  Wallet,
} from 'lucide-react';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';

const ROWS = [
  { id: 'hem', label: 'Hem', icon: Home, zone: 'hem' },
  { id: 'ekonomi', label: 'Ekonomi', icon: Wallet, zone: 'vardagen' },
  { id: 'plan', label: 'Planering', icon: LayoutGrid, zone: 'vardagen' },
  { id: 'mabra', label: 'MåBra', icon: Heart, zone: 'vardagen' },
  { id: 'dagbok', label: 'Dagbok', icon: BookOpen, zone: 'hjartat' },
  { id: 'install', label: 'Inställningar', icon: Settings, zone: '—' },
] as const;

type Props = { onStatus?: (msg: string) => void };

/** RESURSER — pixel-match skärm 3. Zon-etikett = dev-only (S2). */
export function FreeportResurserLab({ onStatus }: Props) {
  const [navActive, setNavActive] = useState<ExecutiveNavId>('resurser');
  const [query, setQuery] = useState('');

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
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      <ul className="design-freeport__exec-list design-freeport__exec-list--full">
        {ROWS.filter((r) => !query || r.label.toLowerCase().includes(query.toLowerCase())).map(
          (row) => {
            const Icon = row.icon;
            return (
              <li key={row.id}>
                <button
                  type="button"
                  className="design-freeport__exec-list-row"
                  onClick={() => onStatus?.(`${row.label} → zon ${row.zone}`)}
                >
                  <span className="design-freeport__exec-list-icon-wrap">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="design-freeport__exec-list-body">
                    <span className="design-freeport__exec-list-title">{row.label}</span>
                    <span className="design-freeport__exec-list-sub">Livskompassen · {row.zone}</span>
                  </span>
                  <span className="design-freeport__exec-list-chevron">›</span>
                </button>
              </li>
            );
          },
        )}
      </ul>

      <div className="design-freeport__exec-search-wrap">
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
        Ref-lista · prod = drawer
      </p>
    </ExecutivePhoneShell>
  );
}
