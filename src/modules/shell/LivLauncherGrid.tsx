import type { LucideIcon } from 'lucide-react';
import {
  ChevronRight,
  Clock,
  FolderKanban,
  ListTodo,
  Sparkles,
  Sprout,
  Wallet,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { CalmCardGlow } from '@/shared/ui/BentoCard';
import {
  LIV_LAUNCHER_EXTERNAL,
  LIV_LAUNCHER_INLINE_TABS,
} from './livLauncherRoutes';

export type LivLauncherId =
  | 'kompasser'
  | 'ekonomi'
  | 'mabra'
  | 'handling'
  | 'projekt'
  | 'arbetsliv';

type LauncherCardDef = {
  id: LivLauncherId;
  label: string;
  hint: string;
  icon: LucideIcon;
  glow: CalmCardGlow;
  external?: boolean;
};

const GLOW_CLASS: Record<CalmCardGlow, string> = {
  gold: 'glow-bottom-gold',
  blue: 'glow-bottom-blue',
  green: 'glow-bottom-green',
};

export const LIV_LAUNCHER_CARDS: readonly LauncherCardDef[] = [
  {
    id: 'kompasser',
    label: 'Dygns-Kompassen',
    hint: 'Morgon och kväll — rytm här',
    icon: Sprout,
    glow: 'gold',
  },
  {
    id: 'ekonomi',
    label: 'Ekonomi & Mål',
    hint: 'Budget, sparmål, saldo',
    icon: Wallet,
    glow: 'gold',
  },
  {
    id: 'mabra',
    label: 'MåBra',
    hint: 'KBT, självmedkänsla, vanor',
    icon: Sparkles,
    glow: 'green',
    external: true,
  },
  {
    id: 'handling',
    label: 'Handling',
    hint: 'Kanban — gör, väntar, klart',
    icon: ListTodo,
    glow: 'gold',
    external: true,
  },
  {
    id: 'projekt',
    label: 'Projekt',
    hint: 'Listor, anteckningar, bilder',
    icon: FolderKanban,
    glow: 'gold',
    external: true,
  },
  {
    id: 'arbetsliv',
    label: 'Arbetsliv & stämpel',
    hint: 'Stämpelklocka och tid',
    icon: Clock,
    glow: 'gold',
    external: true,
  },
] as const;

type LivLauncherGridProps = {
  activeId: LivLauncherId;
  onSelect: (id: LivLauncherId) => void;
};

export function LivLauncherGrid({ activeId, onSelect }: LivLauncherGridProps) {
  return (
    <div
      className="liv-launcher-grid"
      role="listbox"
      aria-label="Välj fokus i Liv och göra"
    >
      {LIV_LAUNCHER_CARDS.map((card) => {
        const Icon = card.icon;
        const isActive = activeId === card.id;
        const isInline = LIV_LAUNCHER_INLINE_TABS.has(card.id);
        const externalRoute = LIV_LAUNCHER_EXTERNAL[card.id];

        return (
          <button
            key={card.id}
            type="button"
            role="option"
            aria-selected={isActive}
            className={clsx(
              'liv-launcher-card calm-card text-left transition-colors',
              GLOW_CLASS[card.glow],
              isActive && 'liv-launcher-card--active',
              card.external && 'liv-launcher-card--external',
            )}
            onClick={() => onSelect(card.id)}
          >
            <span className="liv-launcher-card__icon" aria-hidden>
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <span className="liv-launcher-card__body">
              <span className="liv-launcher-card__label">{card.label}</span>
              <span className="liv-launcher-card__hint">{card.hint}</span>
            </span>
            {card.external ? (
              <ChevronRight
                className="liv-launcher-card__chevron h-5 w-5 shrink-0"
                aria-hidden
              />
            ) : null}
            <span className="sr-only">
              {isInline
                ? isActive
                  ? 'Visas här'
                  : 'Visa här'
                : externalRoute
                  ? `Öppnar ${externalRoute}`
                  : 'Öppnar egen sida'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
