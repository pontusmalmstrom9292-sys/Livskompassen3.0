import type { LucideIcon } from 'lucide-react';
import {
  ChevronRight,
  Clock,
  FolderKanban,
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
import { LIV_LAUNCHER_PREVIEWS } from './livLauncherPreviews';

export type LivLauncherId =
  | 'kompasser'
  | 'ekonomi'
  | 'mabra'
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

const LAUNCHER_CARD_CLASS =
  'liv-launcher-card calm-card text-left transition-colors min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-2';

const GLOW_CLASS: Record<CalmCardGlow, string> = {
  gold: 'glow-bottom-gold',
  blue: 'glow-bottom-gold',
  green: 'glow-bottom-gold',
  indigo: 'glow-bottom-gold',
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
              LAUNCHER_CARD_CLASS,
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
              {LIV_LAUNCHER_PREVIEWS[card.id]}
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
