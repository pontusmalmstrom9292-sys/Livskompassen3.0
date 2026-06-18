import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { ExecutiveDecorCompass, ExecutiveMediaFrame, ExecutivePhoneShell, type ExecutiveNavId } from './exec';

const DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = 18 + i;
  return { id: String(d), day: d, label: ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'][i] };
});

const ENTRIES = [
  { id: '1', time: '08:12', title: 'Morgonreflektion' },
  { id: '2', time: '14:30', title: 'Efter skolan med barnen' },
  { id: '3', time: '21:05', title: 'Kvällslogg' },
] as const;

type Props = { onStatus?: (msg: string) => void };

/** DAGBOK — pixel-match skärm 4. */
export function FreeportDagbokLab({ onStatus }: Props) {
  const [navActive, setNavActive] = useState<ExecutiveNavId>('mer');
  const [activeDay, setActiveDay] = useState('20');

  return (
    <ExecutivePhoneShell
      navActive={navActive}
      onNav={(id) => {
        setNavActive(id);
        onStatus?.(`Nav: ${id}`);
      }}
    >
      <header className="design-freeport__exec-header">
        <h2 className="design-freeport__exec-screen-title">Dagbok</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      <div className="design-freeport__exec-date-rail" role="tablist" aria-label="Datum">
        {DAYS.map((d) => (
          <button
            key={d.id}
            type="button"
            role="tab"
            aria-selected={activeDay === d.id}
            className={[
              'design-freeport__exec-date-pill',
              activeDay === d.id ? 'design-freeport__exec-date-pill--on' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              setActiveDay(d.id);
              onStatus?.(`Datum ${d.day}`);
            }}
          >
            <span className="design-freeport__exec-date-weekday">{d.label}</span>
            <span className="design-freeport__exec-date-num">{d.day}</span>
          </button>
        ))}
      </div>

      <article className="design-freeport__exec-card design-freeport__exec-card--photo design-freeport__exec-card--chrome">
        <p className="design-freeport__exec-label">Daglig reflektion</p>
        <ExecutiveMediaFrame
          label="Lägg till bild"
          defaultSrc="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
          alt="Solnedgång över hav"
          onPick={() => onStatus?.('Dagboksbild uppdaterad')}
        />
        <div className="design-freeport__exec-inset">
          <p className="design-freeport__exec-body">
            Idag kändes lugnt efter skolan. Barnen verkade trygga. Jag andades innan jag svarade på
            meddelanden.
          </p>
        </div>
      </article>

      <section className="design-freeport__exec-card">
        <p className="design-freeport__exec-label">Poster</p>
        <ul className="design-freeport__exec-list">
          {ENTRIES.map((e) => (
            <li key={e.id}>
              <button type="button" className="design-freeport__exec-list-row">
                <span className="design-freeport__exec-list-time">{e.time}</span>
                <span className="design-freeport__exec-list-title">{e.title}</span>
                <span className="design-freeport__exec-list-chevron">›</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <button type="button" className="design-freeport__exec-cta">
        <Plus className="h-4 w-4" />
        Ny anteckning
      </button>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">
          ← Prod
        </Link>
        {' · '}
        Prod: /hjartat?tab=reflektion
      </p>
    </ExecutivePhoneShell>
  );
}
