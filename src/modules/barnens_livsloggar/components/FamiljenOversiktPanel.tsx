import { Link } from 'react-router-dom';
import { Anchor, Heart, Search, Wind } from 'lucide-react';
import { DailyCompassAdvice } from '../../core/home/DailyCompassAdvice';
import { CognitiveLoadBar } from '../../core/cognitive/CognitiveLoadBar';
import { BentoCard } from '../../core/ui/BentoCard';

const LINKS = [
  { to: '/hamn', label: 'BIFF-Sköld', icon: Anchor, desc: 'Grey Rock — ett meddelande i taget' },
  { to: '/mabra', label: 'Vagus-Andning', icon: Wind, desc: 'Kropp före analys' },
  { to: '/familjen?tab=barnfokus', label: 'Barnfokus', icon: Heart, desc: 'Arvid & Kasper' },
  {
    to: '/familjen?tab=korsref',
    label: 'Korsreferens',
    icon: Search,
    desc: 'WORM — fakta mot gaslighting',
  },
] as const;

/** F-03 Översikt — F-01 + F-02 + ingångar (L3, inte ny dock). */
export function FamiljenOversiktPanel() {
  return (
    <div className="space-y-4">
      <BentoCard title="Status just nu" description="Kognitiv laddning · KASAM">
        <CognitiveLoadBar />
      </BentoCard>
      <DailyCompassAdvice />
      <section aria-label="Snabblingångar">
        <p className="mb-3 text-[10px] uppercase tracking-widest text-text-dim">Ingångar</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {LINKS.map(({ to, label, icon: Icon, desc }) => (
            <Link key={to} to={to} className="glass-card block p-4 hover:border-accent/30">
              <Icon className="h-4 w-4 text-accent-secondary mb-2" strokeWidth={1.75} />
              <p className="font-display text-sm font-semibold text-text">{label}</p>
              <p className="mt-1 text-xs text-text-dim">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
