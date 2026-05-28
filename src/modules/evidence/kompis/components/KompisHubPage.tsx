import { Link } from 'react-router-dom';
import { Anchor, BookOpen, Compass, ListTodo, Sparkles } from 'lucide-react';
import { BentoCard } from '../../../core/ui/BentoCard';
import { vaultDrawerPath } from '../../../core/navigation/navTruth';
import { KompisMark } from './KompisMark';

type KompisDestination = {
  to: string;
  label: string;
  hint: string;
  icon: typeof BookOpen;
  primary?: boolean;
};

const DESTINATIONS: KompisDestination[] = [
  {
    to: vaultDrawerPath('kunskapsbank'),
    label: 'Kunskapsbank',
    hint: 'Egen Valv-zon — Tidshjul och RAG bakom PIN.',
    icon: BookOpen,
    primary: true,
  },
  {
    to: '/hamn',
    label: 'Trygg hamn',
    hint: 'BIFF och Grey Rock vid konflikt.',
    icon: Anchor,
  },
  {
    to: '/planering?tab=handling',
    label: 'Planering · Handling',
    hint: 'Kanban och nästa konkreta steg.',
    icon: ListTodo,
  },
  {
    to: '/mabra',
    label: 'MåBra',
    hint: 'Andning, jordning och daglig mix.',
    icon: Sparkles,
  },
  {
    to: '/dagbok?tab=speglar',
    label: 'Speglar',
    hint: 'Validering utan att fixa dig.',
    icon: Compass,
  },
];

/** Publik navigatör — ingen RAG här; bara tydliga vägar. */
export function KompisHubPage() {
  return (
    <div className="space-y-6">
      <BentoCard
        title="Kompis"
        description="Välj vart du vill — jag dirigerar, jag svarar inte här."
      >
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-bg/40">
            <KompisMark className="h-6 w-6" />
          </span>
          <p className="text-sm text-text-muted">
            Kunskap och chatt finns bakom <strong className="text-text">Valv</strong> (PIN). Övriga
            zoner är öppna från menyn.
          </p>
        </div>
      </BentoCard>

      <ul className="space-y-3">
        {DESTINATIONS.map(({ to, label, hint, icon: Icon, primary }) => (
          <li key={to}>
            <Link
              to={to}
              className={`glass-card flex items-start gap-3 p-4 transition-colors hover:border-border-strong ${
                primary ? 'ring-1 ring-accent/30' : ''
              }`}
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <span>
                <span className="block text-sm font-medium text-text">{label}</span>
                <span className="mt-1 block text-xs text-text-dim">{hint}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-center text-xs text-text-dim">
        <Link to="/" className="text-accent hover:underline">
          Tillbaka till Hem
        </Link>
      </p>
    </div>
  );
}
