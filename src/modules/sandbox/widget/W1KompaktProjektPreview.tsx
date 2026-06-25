import { useState } from 'react';
import {
  CalendarDays,
  Camera,
  ChevronRight,
  Flame,
  List,
  Menu,
  Mic,
  PenLine,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import { clsx } from 'clsx';
import { LivskompassHero } from '@/core/home/LivskompassHero';
import { ExecutiveDecorCompass } from '@/core/ui/executive/ExecutiveDecorCompass';
import { ValvArchIcon } from '@/core/ui/ValvArchIcon';
import { W1LabPaginationDots, W1ProjektNyPickerPreview } from './W1ProjektNyPickerPreview';

type RailId =
  | 'nytt-projekt'
  | 'lista'
  | 'anteckning'
  | 'bild'
  | 'tyst-inspelning'
  | 'planering'
  | 'valv';

const RAIL_ACTIONS: { id: RailId; label: string; icon: 'sparkles' | 'list' | 'pen' | 'camera' | 'mic' | 'plan' | 'valv' }[] = [
  { id: 'nytt-projekt', label: 'Nytt projekt', icon: 'sparkles' },
  { id: 'lista', label: 'Lista', icon: 'list' },
  { id: 'anteckning', label: 'Anteckning', icon: 'pen' },
  { id: 'bild', label: 'Bild', icon: 'camera' },
  { id: 'tyst-inspelning', label: 'Tyst inspelning', icon: 'mic' },
  { id: 'planering', label: 'Planering', icon: 'plan' },
  { id: 'valv', label: 'Valv', icon: 'valv' },
];

function RailIcon({ kind }: { kind: (typeof RAIL_ACTIONS)[number]['icon'] }) {
  const shell = 'w1-lab-rail__glyph';
  if (kind === 'sparkles') return <Sparkles className={shell} strokeWidth={1.5} aria-hidden />;
  if (kind === 'list') return <List className={shell} strokeWidth={1.5} aria-hidden />;
  if (kind === 'pen') return <PenLine className={shell} strokeWidth={1.5} aria-hidden />;
  if (kind === 'camera') return <Camera className={shell} strokeWidth={1.5} aria-hidden />;
  if (kind === 'mic') return <Mic className={shell} strokeWidth={1.5} aria-hidden />;
  if (kind === 'plan') return <CalendarDays className={shell} strokeWidth={1.5} aria-hidden />;
  return <Shield className={shell} strokeWidth={1.5} aria-hidden />;
}

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
  const [activeRail, setActiveRail] = useState<RailId | null>(null);
  const [navActive, setNavActive] = useState<'familjen' | 'hamn' | 'valv'>('hamn');

  const handleRail = (id: RailId) => {
    setActiveRail(id);
    if (id === 'nytt-projekt') {
      setPickerOpen(true);
      onStatus?.('Öppnar Nytt projekt-picker');
      return;
    }
    const label = RAIL_ACTIONS.find((a) => a.id === id)?.label ?? id;
    onStatus?.(`Widget: ${label}`);
  };

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

          <aside className="w1-lab-rail" aria-label="W1 snabbval">
            {RAIL_ACTIONS.map((action) => (
              <button
                key={action.id}
                type="button"
                className={clsx(
                  'w1-lab-rail__action',
                  activeRail === action.id && 'w1-lab-rail__action--active',
                )}
                aria-label={action.label}
                onClick={() => handleRail(action.id)}
              >
                <span className="w1-lab-rail__icon-shell">
                  <RailIcon kind={action.icon} />
                </span>
                <span className="w1-lab-rail__label">{action.label}</span>
              </button>
            ))}
          </aside>
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
