import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, Mic, Inbox } from 'lucide-react';
import { ExecutiveDecorCompass, ExecutiveMediaFrame, ExecutivePhoneShell, type ExecutiveNavId } from './exec';
import { ExecutiveChecklistCard } from '@/core/ui/executive';

const DAY_STEPS = [
  { id: '1', label: 'Fixa packning', time: '09:30', done: true },
  { id: '2', label: 'Ring Anna', time: '11:30', done: true },
  { id: '3', label: 'Träna 20 min', time: '18:00', done: false },
];

const SNABB = [
  { id: 'note', label: 'Anteckning', icon: PenLine },
  { id: 'voice', label: 'Inspelning', icon: Mic },
  { id: 'inbox', label: 'Inkast', icon: Inbox },
] as const;

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 10) return 'God morgon';
  if (h < 17) return 'God eftermiddag';
  return 'God kväll';
}

type Props = { onStatus?: (msg: string) => void };

/** HEM — FP-TI pixel-ref (statisk mockup skärm 1). */
export function FreeportHemLab({ onStatus }: Props) {
  const [navActive, setNavActive] = useState<ExecutiveNavId>('hem');
  const [steps, setSteps] = useState(DAY_STEPS);

  return (
    <ExecutivePhoneShell
      navActive={navActive}
      onNav={(id) => {
        setNavActive(id);
        onStatus?.(`Nav: ${id}`);
      }}
    >
      <header className="design-freeport__exec-header design-freeport__exec-header--hero">
        <div>
          <h2 className="design-freeport__exec-screen-title">Hem</h2>
          <p className="design-freeport__exec-greeting design-freeport__exec-greeting--inline">
            {getGreeting()},{' '}
            <span className="design-freeport__exec-greeting-name">Pontus</span>
          </p>
          <p className="design-freeport__exec-subtitle">Den trygga hamnen</p>
        </div>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      <article className="design-freeport__exec-card design-freeport__exec-card--chrome">
        <p className="design-freeport__exec-label">Dagens ankare</p>
        <ExecutiveMediaFrame
          label="Lägg till stämningsbild"
          defaultSrc="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"
          alt="Solnedgång"
        />
        <div className="design-freeport__exec-inset">
          <p className="design-freeport__exec-focus-line">Ett mikrosteg räcker</p>
        </div>
      </article>

      <ExecutiveChecklistCard
        items={steps}
        onToggle={(id) => {
          setSteps((prev) =>
            prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)),
          );
          onStatus?.('Steg togglad');
        }}
        onAdd={() => onStatus?.('Lägg till steg')}
        className="design-freeport__exec-checklist-embed"
      />

      <section className="design-freeport__exec-card">
        <p className="design-freeport__exec-label">Snabbstart</p>
        <div className="design-freeport__exec-snabb-grid">
          {SNABB.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className="design-freeport__exec-snabb-btn"
                onClick={() => onStatus?.(`Snabbstart: ${item.label}`)}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <article className="design-freeport__exec-card design-freeport__exec-card--advice">
        <p className="design-freeport__exec-label">Kompassråd</p>
        <p className="design-freeport__exec-body">Ett mikrosteg kan förändra en hel dag.</p>
      </article>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">
          ← Prod
        </Link>
        {' · '}
        FP-TI Hem-ref
      </p>
    </ExecutivePhoneShell>
  );
}
