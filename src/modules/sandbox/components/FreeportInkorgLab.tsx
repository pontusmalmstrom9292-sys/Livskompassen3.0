import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Inbox } from 'lucide-react';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';
import { CalmCard, SectionHeader } from './premium';

const ITEMS = [
  { id: '1', title: 'Mejl från skola', hint: 'Väntar klassificering', time: '09:12' },
  { id: '2', title: 'Foto — lekplats', hint: 'Familj · stund', time: '14:30' },
  { id: '3', title: 'Röstanteckning', hint: 'Hjärtat · reflektion', time: '21:05' },
] as const;

type Props = { onStatus?: (msg: string) => void };

/** INKORG — smart fångst, en handling per rad. */
export function FreeportInkorgLab({ onStatus }: Props) {
  const [navActive, setNavActive] = useState<ExecutiveNavId>('inkorg');

  return (
    <ExecutivePhoneShell
      navActive={navActive}
      onNav={(id) => {
        setNavActive(id);
        onStatus?.(`Nav: ${id}`);
      }}
    >
      <header className="design-freeport__exec-header">
        <h2 className="design-freeport__exec-screen-title">Inkorg</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      <SectionHeader title="Väntar på dig" subtitle="Tre objekt — inga widgets" />

      <CalmCard>
        <ul className="design-freeport__exec-list">
          {ITEMS.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="design-freeport__exec-list-row"
                onClick={() => onStatus?.(`Inkorg: ${item.title}`)}
              >
                <Inbox className="h-4 w-4 shrink-0 text-[var(--fp-accent)]" strokeWidth={1.5} />
                <span className="design-freeport__exec-list-title">{item.title}</span>
                <span className="design-freeport__exec-list-time">{item.time}</span>
              </button>
              <p className="design-freeport__hint px-3 pb-2 text-xs">{item.hint}</p>
            </li>
          ))}
        </ul>
      </CalmCard>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">← Prod</Link>
        {' · '}
        Prod: Smart Inkast / DCAP
      </p>
    </ExecutivePhoneShell>
  );
}
