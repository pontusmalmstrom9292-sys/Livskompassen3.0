import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';
import { CalmCard, SectionHeader } from './premium';

const STUNDER = [
  { id: '1', time: '07:45', text: 'Frukost tillsammans — lugn start' },
  { id: '2', time: '15:20', text: 'Hjälp med läxor utan bråk' },
  { id: '3', time: '19:30', text: 'Kvällssaga och kram' },
] as const;

type Props = { onStatus?: (msg: string) => void };

/** LIVSLOGG — positiva stunder, en handling per rad. */
export function FreeportLivsloggLab({ onStatus }: Props) {
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
        <h2 className="design-freeport__exec-screen-title">Livslogg</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      <SectionHeader title="Positiva stunder" subtitle="En rad per minne — inga flikar" />

      <CalmCard>
        <ul className="design-freeport__exec-list">
          {STUNDER.map((s) => (
            <li key={s.id}>
              <button type="button" className="design-freeport__exec-list-row">
                <span className="design-freeport__exec-list-time">{s.time}</span>
                <span className="design-freeport__exec-list-title">{s.text}</span>
                <span className="design-freeport__exec-list-chevron">›</span>
              </button>
            </li>
          ))}
        </ul>
      </CalmCard>

      <button
        type="button"
        className="design-freeport__exec-cta mt-3"
        onClick={() => onStatus?.('Ny stund')}
      >
        <Plus className="h-4 w-4" />
        Ny stund
      </button>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">← Prod</Link>
        {' · '}
        Mock — ej Firestore
      </p>
    </ExecutivePhoneShell>
  );
}
