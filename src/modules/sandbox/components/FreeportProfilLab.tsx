import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'lucide-react';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';
import { CalmCard, SectionHeader } from './premium';

const ROWS = [
  { id: 'konto', label: 'Konto & säkerhet' },
  { id: 'tema', label: 'Tema — Executive Premium' },
  { id: 'notis', label: 'Notiser' },
  { id: 'export', label: 'Exportera data' },
] as const;

type Props = { onStatus?: (msg: string) => void };

/** PROFIL — inställningar utan brus. */
export function FreeportProfilLab({ onStatus }: Props) {
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
        <h2 className="design-freeport__exec-screen-title">Profil</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      <CalmCard>
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--fp-border-strong)] bg-[var(--fp-surface-3)]">
            <User className="h-7 w-7 text-[var(--fp-accent)]" strokeWidth={1.5} />
          </div>
          <div>
            <p className="design-freeport__exec-label">Pontus</p>
            <p className="design-freeport__exec-body">Förälder · Trygg hamn</p>
          </div>
        </div>
      </CalmCard>

      <SectionHeader title="Inställningar" className="mt-4" />

      <CalmCard>
        <ul className="design-freeport__exec-list">
          {ROWS.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                className="design-freeport__exec-list-row"
                onClick={() => onStatus?.(`Profil: ${r.label}`)}
              >
                <span className="design-freeport__exec-list-title">{r.label}</span>
                <span className="design-freeport__exec-list-chevron">›</span>
              </button>
            </li>
          ))}
        </ul>
      </CalmCard>

      <button
        type="button"
        className="design-freeport__exec-cta mt-3 design-freeport__exec-cta--muted"
        onClick={() => onStatus?.('Logga ut (mock)')}
      >
        Logga ut
      </button>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">← Prod</Link>
        {' · '}
        Sandbox — ej auth
      </p>
    </ExecutivePhoneShell>
  );
}
