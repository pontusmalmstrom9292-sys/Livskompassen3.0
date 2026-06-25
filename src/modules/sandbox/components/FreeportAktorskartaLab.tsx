import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';
import { CalmCard, PremiumCard, SectionHeader } from './premium';

const ACTORS = [
  { id: 'skola', label: 'Skola', role: 'Neutral logistik' },
  { id: 'bup', label: 'BUP', role: 'Vårdgivare' },
  { id: 'soc', label: 'Soc', role: 'Myndighet' },
] as const;

type Props = { onStatus?: (msg: string) => void };

/** AKTÖRSKARTA — relationer och roller, lugn översikt. */
export function FreeportAktorskartaLab({ onStatus }: Props) {
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
        <h2 className="design-freeport__exec-screen-title">Aktörskarta</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      <SectionHeader title="Aktörer i ärendet" subtitle="Roller — inte bedömningar" />

      <PremiumCard>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[var(--fp-accent)]" strokeWidth={1.5} />
          <p className="design-freeport__exec-body">3 aktiva kontakter</p>
        </div>
      </PremiumCard>

      <div className="design-freeport__premium-sub-grid mt-3">
        {ACTORS.map((a) => (
          <button
            key={a.id}
            type="button"
            className="design-freeport__premium-sub-card"
            onClick={() => onStatus?.(`Aktör: ${a.label}`)}
          >
            <strong>{a.label}</strong>
            <span>{a.role}</span>
          </button>
        ))}
      </div>

      <CalmCard className="mt-3">
        <p className="design-freeport__exec-label">Senaste händelse</p>
        <p className="design-freeport__exec-body mt-2">
          Skola — schemaändring meddelad 24 jun.
        </p>
      </CalmCard>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">← Prod</Link>
        {' · '}
        Prod: /valvet · Aktörskarta
      </p>
    </ExecutivePhoneShell>
  );
}
