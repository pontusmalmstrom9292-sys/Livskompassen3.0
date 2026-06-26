import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';
import { CalmCard, PremiumCard, SectionHeader } from './premium';

type Props = { onStatus?: (msg: string) => void };

/** BARNFOKUS — Familjen hub, viktigaste kortet överst. */
export function FreeportBarnfokusLab({ onStatus }: Props) {
  const [navActive, setNavActive] = useState<ExecutiveNavId>('mer');
  const [answer, setAnswer] = useState('');

  return (
    <ExecutivePhoneShell
      navActive={navActive}
      onNav={(id) => {
        setNavActive(id);
        onStatus?.(`Nav: ${id}`);
      }}
    >
      <header className="design-freeport__exec-header">
        <h2 className="design-freeport__exec-screen-title">Barnfokus</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      <PremiumCard>
        <div className="flex items-start gap-3">
          <Heart className="h-5 w-5 shrink-0 text-[var(--fp-accent)]" strokeWidth={1.5} />
          <div className="flex-1">
            <SectionHeader title="Hur såg jag mitt barn idag?" />
            <textarea
              className="design-freeport__premium-textarea"
              placeholder="En kort observation — ingen analys…"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={4}
            />
          </div>
        </div>
      </PremiumCard>

      <CalmCard className="mt-3">
        <SectionHeader title="Stödjande fråga" subtitle="Om du vill gå djupare" />
        <p className="design-freeport__exec-body">
          Var mitt barn tryggt i övergången idag?
        </p>
      </CalmCard>

      <CalmCard className="mt-3">
        <p className="design-freeport__exec-label">Senaste stund</p>
        <p className="design-freeport__exec-body mt-2">
          Lekte fotboll i parken — skrattade när han gjorde mål.
        </p>
      </CalmCard>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">← Prod</Link>
        {' · '}
        Prod: /familjen · Barnfokus
      </p>
    </ExecutivePhoneShell>
  );
}
