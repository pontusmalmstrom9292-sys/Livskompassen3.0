import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';
import { SectionHeader } from './premium';

const COLUMNS = [
  {
    id: 'idag',
    title: 'Idag',
    items: [
      { id: '1', label: 'Promenad', state: 'focus' as const },
      { id: '2', label: 'Drick vatten', state: 'neutral' as const },
    ],
  },
  {
    id: 'vantar',
    title: 'Väntar',
    items: [{ id: '3', label: 'Skicka dokument', state: 'neutral' as const }],
  },
  {
    id: 'klart',
    title: 'Klart',
    items: [{ id: '4', label: 'Packning klar', state: 'done' as const }],
  },
] as const;

type Props = { onStatus?: (msg: string) => void };

/** KANBAN — Idag / Väntar / Klart. Guld = fokus, grå = neutral, grön = färdig. */
export function FreeportKanbanLab({ onStatus }: Props) {
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
        <h2 className="design-freeport__exec-screen-title">Planering</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      <SectionHeader title="Tre kort" subtitle="Inga färger utom fokus och klart" />

      <div className="design-freeport__premium-kanban">
        {COLUMNS.map((col) => (
          <div key={col.id} className="design-freeport__premium-kanban-col">
            <p className="design-freeport__premium-kanban-col-title">{col.title}</p>
            {col.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={[
                  'design-freeport__premium-kanban-item',
                  item.state === 'focus' ? 'design-freeport__premium-kanban-item--focus' : '',
                  item.state === 'done' ? 'design-freeport__premium-kanban-item--done' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => onStatus?.(`Kanban: ${item.label}`)}
              >
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </div>

      <p className="design-freeport__sandbox-note mt-4">
        <Link to="/" className="design-freeport__link">← Prod</Link>
        {' · '}
        Prod: /vardagen · Planering P3
      </p>
    </ExecutivePhoneShell>
  );
}
