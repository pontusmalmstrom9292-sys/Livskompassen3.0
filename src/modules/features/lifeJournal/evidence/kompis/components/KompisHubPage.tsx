import { Link } from 'react-router-dom';
import { Anchor, BookOpen, ChevronRight, Compass, ListTodo, Sparkles } from 'lucide-react';
import { BentoCard } from '@/shared/ui/BentoCard';
import { ValvArchIcon } from '@/core/ui/ValvArchIcon';
import { UiCard } from '@/core/ui/UiCard';
import { vaultDrawerPath } from '@/core/navigation/navTruth';
import { KompisMark } from './KompisMark';

const VALV_ENTRY = vaultDrawerPath('logga');

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
    hint: 'Direkt till Valv-zonen efter PIN.',
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
    to: '/dagbok?tab=speglar',
    label: 'Speglar',
    hint: 'Validering utan att fixa dig — utan PIN.',
    icon: Compass,
  },
];

/** Publik navigatör — ingen RAG här; bara tydliga vägar. */
export function KompisHubPage() {
  return (
    <div className="kompis-hub-page space-y-6">
      <BentoCard
        title="Kompis"
        description="Välj vart du vill — jag dirigerar, jag svarar inte här."
      >
        <div className="kompis-hub-page__intro flex items-start gap-3">
          <span className="kompis-hub-page__avatar flex h-12 w-12 shrink-0 items-center justify-center rounded-full">
            <KompisMark className="h-6 w-6" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-text-muted">
              <strong className="text-text">Valv</strong> är låst med PIN på nästa skärm (sparas lokalt på
              enheten). Där finns kunskap, chatt och bevis.
            </p>
            <Link
              to={VALV_ENTRY}
              className="btn-pill--accent ui-cta-gold mt-3 inline-flex w-full items-center justify-center gap-2 text-sm"
            >
              <ValvArchIcon className="h-4 w-4 shrink-0" />
              Öppna Valv · ange PIN
            </Link>
            <p className="mt-2 text-[11px] leading-snug text-text-dim">
              Dold genväg: håll kompassen i bottenmenyn i 3 sekunder.
            </p>
          </div>
        </div>
      </BentoCard>

      <p className="px-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-text-dim">
        Öppna zoner
      </p>

      <ul className="space-y-3">
        {DESTINATIONS.map(({ to, label, hint, icon: Icon, primary }) => (
          <li key={to}>
            <UiCard as={Link} to={to} className={primary ? 'ring-1 ring-accent/30' : ''}>
              <span className="ui-card__icon flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent/35 text-accent">
                <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-display-serif text-sm font-medium text-text">{label}</span>
                <span className="mt-0.5 block text-xs text-text-dim">{hint}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-accent/55" strokeWidth={1.5} aria-hidden />
            </UiCard>
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
