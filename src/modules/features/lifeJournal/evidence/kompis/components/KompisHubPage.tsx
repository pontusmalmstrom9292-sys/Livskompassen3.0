import { Link } from 'react-router-dom';
import { Anchor, BookOpen, ChevronRight, Compass, ListTodo, Sparkles } from 'lucide-react';
import { textStyles } from '@/design-system';
import { NAV_PATHS, vaultDrawerPath } from '@/core/navigation/navTruth';
import { KompisChat } from './KompisChat';

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
    hint: 'Direkt till Valv-zonen efter WebAuthn/Fyren.',
    icon: BookOpen,
    primary: true,
  },
  {
    to: '/familjen?tab=hamn',
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
    to: `${NAV_PATHS.HJARTAT}?tab=speglar`,
    label: 'Speglar',
    hint: 'Validering utan att fixa dig — utan Valv-upplåsning.',
    icon: Compass,
  },
];

/** Publik navigatör — ingen RAG här; bara tydliga vägar. */
export function KompisHubPage() {
  return (
    <div className="kompis-hub-page space-y-6">
      <div className="mb-6">
        <KompisChat />
      </div>

      <p className={`px-0.5 ${textStyles.eyebrow}`}>Öppna zoner</p>

      <ul className="space-y-3">
        {DESTINATIONS.map(({ to, label, hint, icon: Icon, primary }) => (
          <li key={to}>
            <Link
              to={to}
              className={`glass-card flex items-center gap-3 rounded-2xl p-4 transition-colors hover:border-accent/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50 ${primary ? 'ring-1 ring-accent/30' : ''}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/35 text-accent">
                <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display-serif text-sm font-medium text-text">{label}</span>
                <span className="mt-0.5 block text-xs text-text-dim">{hint}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-accent/55" strokeWidth={1.5} aria-hidden />
            </Link>
          </li>
        ))}
      </ul>

      <p className="text-center text-xs text-text-dim">
        <Link to="/" className="text-accent hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent/50">
          Tillbaka till Hem
        </Link>
      </p>
    </div>
  );
}
