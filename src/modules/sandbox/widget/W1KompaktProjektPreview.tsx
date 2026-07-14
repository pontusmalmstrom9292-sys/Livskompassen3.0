import { useState } from 'react';
import { clsx } from 'clsx';
import {
  ChevronRight,
  Flame,
  Menu,
  Sparkles,
  Users,
} from 'lucide-react';
import { LivskompassHero } from '@/core/home/LivskompassHero';
import { ExecutiveDecorCompass } from '@/core/ui/executive/ExecutiveDecorCompass';
import { ValvArchIcon } from '@/core/ui/ValvArchIcon';
import { W1KompaktProjektRail } from '@/features/widgets/components/W1KompaktProjektRail';
import type { W1KompaktRailId } from '@/features/widgets/config/w1KompaktRailActions';
import { W1LabPaginationDots, W1ProjektNyPickerPreview } from './W1ProjektNyPickerPreview';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 10) return 'God morgon';
  if (h < 17) return 'God eftermiddag';
  return 'God kväll';
}

type Props = {
  onStatus?: (msg: string) => void;
};

/** W1 v2 — kompakt projekt-widget i Executive Midnight (Theme Lab only). */
export function W1KompaktProjektPreview({ onStatus }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [activeRail, setActiveRail] = useState<W1KompaktRailId | null>(null);
  const [navActive, setNavActive] = useState<'familjen' | 'hamn' | 'valv'>('hamn');

  return (
    <div className="w1-lab-phone" data-theme="ME-midnight-executive">
      <div className="w1-lab-phone__scroll">
        <header className="w1-lab-header">
          <button type="button" className="w1-lab-header__menu" aria-label="Meny">
            <Menu className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </button>
          <div className="w1-lab-header__brand">
            <p className="w1-lab-header__title">Livskompassen</p>
            <div className="w1-lab-header__ornament" aria-hidden>
              <span />
              <span className="w1-lab-header__ornament-gem" />
              <span />
            </div>
          </div>
          <button type="button" className="w1-lab-header__compass" aria-label="Snabbåtkomst">
            <ExecutiveDecorCompass size="sm" className="w1-lab-header__compass-mark" />
          </button>
        </header>

        <div className="w1-lab-greeting">
          <div className="w1-lab-greeting__copy">
            <p className="w1-lab-greeting__name">
              {getGreeting()}, Erik
              <Sparkles className="inline h-3.5 w-3.5 text-accent/80" strokeWidth={1.5} aria-hidden />
            </p>
            <p className="w1-lab-greeting__tagline">Styr med mening. Lev med riktning.</p>
          </div>
          <div className="home-streak-chip w1-lab-greeting__eld" aria-label="Din eld 128">
            <Flame className="home-streak-chip__icon" strokeWidth={1.5} aria-hidden />
            <span className="home-streak-chip__value tabular-nums">128</span>
            <span className="home-streak-chip__label">Din eld</span>
          </div>
        </div>

        <div className="w1-lab-stage">
          <div className="w1-lab-stage__main">
            <LivskompassHero variant="compass" embedded />
          </div>

          <W1KompaktProjektRail
            activeId={activeRail ?? undefined}
            onNyttProjekt={() => {
              setActiveRail('nytt-projekt');
              setPickerOpen(true);
              onStatus?.('Öppnar Nytt projekt-picker');
            }}
            onNavigate={() => onStatus?.('Widget: rail navigation')}
          />
        </div>

        <section className="w1-lab-riktning" aria-label="Dagens riktning">
          <button type="button" className="w1-lab-riktning__card">
            <span className="w1-lab-riktning__icon-wrap" aria-hidden>
              <ExecutiveDecorCompass size="sm" className="w1-lab-riktning__compass" />
            </span>
            <span className="w1-lab-riktning__body">
              <span className="w1-lab-riktning__eyebrow">Dagens riktning</span>
              <span className="w1-lab-riktning__quote">
                “Små steg i rätt riktning skapar det liv du drömmer om.”
              </span>
            </span>
            <ChevronRight className="w1-lab-riktning__chevron" strokeWidth={1.75} aria-hidden />
          </button>
          <W1LabPaginationDots active={1} />
        </section>
      </div>

      <nav className="w1-lab-dock" aria-label="Huvudnavigation">
        <button
          type="button"
          className={clsx('w1-lab-dock__item', navActive === 'familjen' && 'w1-lab-dock__item--active')}
          onClick={() => {
            setNavActive('familjen');
            onStatus?.('Nav: Familjen');
          }}
        >
          <Users className="w1-lab-dock__glyph" strokeWidth={1.5} aria-hidden />
          <span>Familjen</span>
        </button>

        <div className="w1-lab-dock__compass-slot">
          <button
            type="button"
            className={clsx('w1-lab-dock__compass', navActive === 'hamn' && 'w1-lab-dock__compass--active')}
            aria-label="Hamn"
            onClick={() => {
              setNavActive('hamn');
              onStatus?.('Nav: Hamn');
            }}
          >
            <ExecutiveDecorCompass size="hero" className="w1-lab-dock__compass-mark" />
          </button>
          <span className="w1-lab-dock__compass-label">Hamn</span>
        </div>

        <button
          type="button"
          className={clsx('w1-lab-dock__item', navActive === 'valv' && 'w1-lab-dock__item--active')}
          onClick={() => {
            setNavActive('valv');
            onStatus?.('Nav: Valv');
          }}
        >
          <ValvArchIcon className="w1-lab-dock__glyph w1-lab-dock__glyph--valv" />
          <span>Valv</span>
        </button>
      </nav>

      <W1ProjektNyPickerPreview
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(id) => onStatus?.(`Picker: ${id}`)}
      />
    </div>
  );
}
