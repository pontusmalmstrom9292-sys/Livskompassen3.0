import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, FileText, Sparkles } from 'lucide-react';
import { ExecutiveDecorCompass, ExecutivePhoneShell, type ExecutiveNavId } from './exec';
import { CalmCard, PremiumCard, SectionHeader } from './premium';

const ENTRANCES = [
  { id: 'spara', label: 'Spara', hint: 'Bevis och dokument', icon: Archive },
  { id: 'monster', label: 'Mönster', hint: 'Taktiker och signaler', icon: Sparkles },
  { id: 'rapporter', label: 'Rapporter', hint: 'Sammanställningar', icon: FileText },
] as const;

const SUB = [
  { id: 'kb', label: 'Kunskapsbank' },
  { id: 'aktor', label: 'Aktörskarta' },
  { id: 'ork', label: 'Orkester' },
  { id: 'dossier', label: 'Dossier' },
] as const;

type Props = { onStatus?: (msg: string) => void };

/** VALV — tre gigantiska ingångar + undermoduler. Mockdata only. */
export function FreeportValvetLab({ onStatus }: Props) {
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
        <h2 className="design-freeport__exec-screen-title">Valvet</h2>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass" />
      </header>

      <SectionHeader title="Välj ingång" subtitle="Tre tydliga vägar — inga små widgets" />

      <div className="design-freeport__premium-hero-grid">
        {ENTRANCES.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className="design-freeport__premium-hero-btn"
              onClick={() => onStatus?.(`Valv: ${item.label}`)}
            >
              <Icon className="h-5 w-5 text-[var(--fp-accent)]" strokeWidth={1.5} />
              <span className="design-freeport__premium-hero-btn-label">{item.label}</span>
              <span className="design-freeport__premium-hero-btn-hint">{item.hint}</span>
            </button>
          );
        })}
      </div>

      <PremiumCard className="mt-3">
        <SectionHeader title="Under Valvet" />
        <div className="design-freeport__premium-sub-grid">
          {SUB.map((s) => (
            <button
              key={s.id}
              type="button"
              className="design-freeport__premium-sub-card"
              onClick={() => onStatus?.(`Valv under: ${s.label}`)}
            >
              <strong>{s.label}</strong>
              <span>Mock — öppna lab</span>
            </button>
          ))}
        </div>
      </PremiumCard>

      <CalmCard className="mt-3">
        <p className="design-freeport__exec-label">Senast sparat</p>
        <p className="design-freeport__exec-body mt-2">
          Mejl från skola — 24 jun. Väntar på granskning.
        </p>
      </CalmCard>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">← Prod</Link>
        {' · '}
        Mock — WORM ej kopplad
      </p>
    </ExecutivePhoneShell>
  );
}
