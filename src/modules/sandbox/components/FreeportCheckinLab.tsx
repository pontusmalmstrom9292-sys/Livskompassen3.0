import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';
import { CalmCard, PremiumCard, SectionHeader } from './premium';

const MOOD = [
  { id: '1', label: '1' },
  { id: '2', label: '2' },
  { id: '3', label: '3' },
  { id: '4', label: '4' },
  { id: '5', label: '5' },
] as const;

type Props = { onStatus?: (msg: string) => void };

/** MÅBRA CHECK-IN — humör och energi utan gamification. */
export function FreeportCheckinLab({ onStatus }: Props) {
  const [navActive, setNavActive] = useState<ExecutiveNavId>('mer');
  const [mood, setMood] = useState('3');
  const [note, setNote] = useState('');

  return (
    <ExecutivePhoneShell
      navActive={navActive}
      onNav={(id) => {
        setNavActive(id);
        onStatus?.(`Nav: ${id}`);
      }}
    >
      <header className="design-freeport__exec-header">
        <h2 className="design-freeport__exec-screen-title">Check-in</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      <PremiumCard>
        <SectionHeader title="Hur känns det just nu?" subtitle="En skala — inga poäng" />
        <div className="design-freeport__premium-checkin-scale" role="group" aria-label="Humörskala">
          {MOOD.map((m) => (
            <button
              key={m.id}
              type="button"
              className={[
                'design-freeport__premium-checkin-dot',
                mood === m.id ? 'design-freeport__premium-checkin-dot--on' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                setMood(m.id);
                onStatus?.(`Humör: ${m.label}`);
              }}
            >
              {m.label}
            </button>
          ))}
        </div>
      </PremiumCard>

      <CalmCard className="mt-3">
        <SectionHeader title="Valfri rad" />
        <textarea
          className="design-freeport__premium-textarea"
          placeholder="En kort rad räcker…"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </CalmCard>

      <button
        type="button"
        className="design-freeport__exec-cta mt-3"
        onClick={() => onStatus?.('Check-in sparad (mock)')}
      >
        Spara check-in
      </button>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">← Prod</Link>
        {' · '}
        Prod: /vardagen · Mabra
      </p>
    </ExecutivePhoneShell>
  );
}
