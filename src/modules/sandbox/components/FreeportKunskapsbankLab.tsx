import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';
import { CalmCard, SectionHeader } from './premium';

const DOCS = [
  { id: '1', title: 'Parallel parenting', tag: 'FACT' },
  { id: '2', title: 'Grey Rock — kort svar', tag: 'FACT' },
  { id: '3', title: 'Vagus — kallt vatten', tag: 'FACT' },
] as const;

type Props = { onStatus?: (msg: string) => void };

/** KUNSKAPSBANK — Valv undermodul, FACT-kort. */
export function FreeportKunskapsbankLab({ onStatus }: Props) {
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
        <h2 className="design-freeport__exec-screen-title">Kunskapsbank</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      <SectionHeader title="Sparade fakta" subtitle="Kunskapsvalvet — silo isolerad" />

      <CalmCard>
        <ul className="design-freeport__exec-list">
          {DOCS.map((d) => (
            <li key={d.id}>
              <button
                type="button"
                className="design-freeport__exec-list-row"
                onClick={() => onStatus?.(`Kunskap: ${d.title}`)}
              >
                <BookOpen className="h-4 w-4 shrink-0 text-[var(--fp-accent)]" strokeWidth={1.5} />
                <span className="design-freeport__exec-list-title">{d.title}</span>
                <span className="design-freeport__exec-list-time">{d.tag}</span>
              </button>
            </li>
          ))}
        </ul>
      </CalmCard>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">← Prod</Link>
        {' · '}
        Prod: /valvet · Kunskap
      </p>
    </ExecutivePhoneShell>
  );
}
