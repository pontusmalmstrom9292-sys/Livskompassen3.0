import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Lock } from 'lucide-react';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';
import { CalmCard, PremiumCard, SectionHeader } from './premium';

const SECTIONS = [
  { id: '1', title: 'Tidslinje Q2', pages: '12 sidor' },
  { id: '2', title: 'Barn — observationer', pages: '8 sidor' },
  { id: '3', title: 'Myndighet — korrespondens', pages: '24 sidor' },
] as const;

type Props = { onStatus?: (msg: string) => void };

/** DOSSIER — WORM-sammanställning, låst känsla. */
export function FreeportDossierLab({ onStatus }: Props) {
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
        <h2 className="design-freeport__exec-screen-title">Dossier</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      <PremiumCard>
        <div className="flex items-start gap-3">
          <Lock className="h-5 w-5 shrink-0 text-[var(--fp-accent)]" strokeWidth={1.5} />
          <div>
            <SectionHeader title="Aktiv dossier" subtitle="Oföränderlig export — mock" />
            <p className="design-freeport__exec-body">Senast uppdaterad 24 jun 2026</p>
          </div>
        </div>
      </PremiumCard>

      <CalmCard className="mt-3">
        <ul className="design-freeport__exec-list">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                className="design-freeport__exec-list-row"
                onClick={() => onStatus?.(`Dossier: ${s.title}`)}
              >
                <FileText className="h-4 w-4 shrink-0 text-[var(--fp-accent)]" strokeWidth={1.5} />
                <span className="design-freeport__exec-list-title">{s.title}</span>
                <span className="design-freeport__exec-list-time">{s.pages}</span>
              </button>
            </li>
          ))}
        </ul>
      </CalmCard>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">← Prod</Link>
        {' · '}
        Prod: /valvet · Dossier (WORM)
      </p>
    </ExecutivePhoneShell>
  );
}
