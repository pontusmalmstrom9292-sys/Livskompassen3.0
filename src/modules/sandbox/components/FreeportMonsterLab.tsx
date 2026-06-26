import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';
import { CalmCard, PremiumCard, SectionHeader } from './premium';

const PATTERNS = [
  { id: 'darvo', label: 'DARVO', hint: 'Förne · attack · rollbyte' },
  { id: 'gas', label: 'Gaslighting', hint: 'Verklighetsförnekelse' },
  { id: 'inter', label: 'Intermittent', hint: 'Push-pull cykel' },
] as const;

type Props = { onStatus?: (msg: string) => void };

/** MÖNSTER — Valv-ingång, taktiker och signaler. */
export function FreeportMonsterLab({ onStatus }: Props) {
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
        <h2 className="design-freeport__exec-screen-title">Mönster</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      <SectionHeader title="Identifierade mönster" subtitle="Beteende + datum — aldrig diagnos på motpart" />

      <PremiumCard>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[var(--fp-accent)]" strokeWidth={1.5} />
          <p className="design-freeport__exec-body">3 aktiva mönster i tidslinjen</p>
        </div>
      </PremiumCard>

      <div className="design-freeport__premium-hero-grid mt-3">
        {PATTERNS.map((p) => (
          <button
            key={p.id}
            type="button"
            className="design-freeport__premium-hero-btn"
            onClick={() => onStatus?.(`Mönster: ${p.label}`)}
          >
            <span className="design-freeport__premium-hero-btn-label">{p.label}</span>
            <span className="design-freeport__premium-hero-btn-hint">{p.hint}</span>
          </button>
        ))}
      </div>

      <CalmCard className="mt-3">
        <p className="design-freeport__exec-label">Senaste signal</p>
        <p className="design-freeport__exec-body mt-2">
          Projektion efter gräns — 24 jun. Loggat som beteende, inte känsla.
        </p>
      </CalmCard>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">← Prod</Link>
        {' · '}
        Prod: /valvet · Mönster
      </p>
    </ExecutivePhoneShell>
  );
}
