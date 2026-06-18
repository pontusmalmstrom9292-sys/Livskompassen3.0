import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Shield, User } from 'lucide-react';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';

const GROUPS = [
  {
    id: 'konto',
    title: 'Konto & profil',
    rows: [
      { id: 'profil', label: 'Profil', icon: User },
      { id: 'sakerhet', label: 'Säkerhet', icon: Shield },
      { id: 'notis', label: 'Aviseringar', icon: Bell },
    ],
  },
  {
    id: 'support',
    title: 'Support',
    rows: [
      { id: 'hjalp', label: 'Hjälp & guide' },
      { id: 'integritet', label: 'Integritet' },
    ],
  },
] as const;

type Props = { onStatus?: (msg: string) => void };

/** INSTÄLLNINGAR — pixel-match skärm 5. Ingen «Valv»-exponering (S7). */
export function FreeportInstallningarLab({ onStatus }: Props) {
  const [navActive, setNavActive] = useState<ExecutiveNavId>('mer');

  return (
    <ExecutivePhoneShell
      navActive={navActive}
      onNav={(id) => {
        setNavActive(id);
        onStatus?.(`Nav: ${id}`);
      }}
    >
      <header className="design-freeport__exec-header">
        <h2 className="design-freeport__exec-screen-title">Inställningar</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      {GROUPS.map((group) => (
        <section key={group.id} className="design-freeport__exec-settings-group design-freeport__exec-card--chrome">
          <p className="design-freeport__exec-label">{group.title}</p>
          <ul className="design-freeport__exec-list">
            {group.rows.map((row) => {
              const Icon = 'icon' in row ? row.icon : null;
              return (
                <li key={row.id}>
                  <button
                    type="button"
                    className="design-freeport__exec-list-row"
                    onClick={() => onStatus?.(row.label)}
                  >
                    {Icon ? (
                      <span className="design-freeport__exec-list-icon-wrap">
                        <Icon className="h-4 w-4" />
                      </span>
                    ) : null}
                    <span className="design-freeport__exec-list-title">{row.label}</span>
                    <span className="design-freeport__exec-list-chevron">›</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <button type="button" className="design-freeport__exec-logout" onClick={() => onStatus?.('Logga ut')}>
        Logga ut
      </button>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">
          ← Prod
        </Link>
        {' · '}
        Säkerhet utan valv-etikett i publikt läge
      </p>
    </ExecutivePhoneShell>
  );
}
