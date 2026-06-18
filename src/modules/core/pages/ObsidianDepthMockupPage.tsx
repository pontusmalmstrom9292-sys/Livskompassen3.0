import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Compass,
  Home,
  Shield,
  Sparkles,
  Users,
} from 'lucide-react';
import { LivskompassMark } from '../ui/LivskompassMark';

type BentoId = 'morgon' | 'planering' | 'valv' | 'familjen';
type NavId = 'hem' | 'vardagen' | 'familjen' | 'valv';

const BENTO_CARDS: {
  id: BentoId;
  label: string;
  title: string;
  meta: string;
  span?: boolean;
  icon: typeof Compass;
}[] = [
  {
    id: 'morgon',
    label: 'Dygnsstart',
    title: 'Morgonkompassen',
    meta: 'Ett mikrosteg · kapacitetsanpassat',
    span: true,
    icon: Compass,
  },
  {
    id: 'planering',
    label: 'Vardagen',
    title: 'Planering',
    meta: '3 väntande · 1 fokus',
    icon: CalendarDays,
  },
  {
    id: 'valv',
    label: 'Bevis',
    title: 'Valvet',
    meta: 'Låst · PIN vid behov',
    icon: Shield,
  },
  {
    id: 'familjen',
    label: 'Trygg hamn',
    title: 'Familjen',
    meta: 'Barnfokus · BIFF redo',
    icon: Users,
  },
];

const NAV_ITEMS: { id: NavId; label: string; icon: typeof Home }[] = [
  { id: 'hem', label: 'Hem', icon: Home },
  { id: 'vardagen', label: 'Vardagen', icon: CalendarDays },
  { id: 'familjen', label: 'Familjen', icon: Users },
  { id: 'valv', label: 'Valv', icon: Shield },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 10) return 'God morgon';
  if (h < 17) return 'God eftermiddag';
  return 'God kväll';
}

export function ObsidianDepthMockupPage() {
  const [activeBento, setActiveBento] = useState<BentoId>('morgon');
  const [activeNav, setActiveNav] = useState<NavId>('hem');
  const [ctaPressed, setCtaPressed] = useState(false);
  const [status, setStatus] = useState('Tryck på kort, CTA eller navigering.');

  const handleBento = useCallback((id: BentoId) => {
    setActiveBento(id);
    const card = BENTO_CARDS.find((c) => c.id === id)!;
    setStatus(`Valt: ${card.title}`);
  }, []);

  const handleNav = useCallback((id: NavId) => {
    setActiveNav(id);
    const item = NAV_ITEMS.find((n) => n.id === id)!;
    setStatus(`Navigering: ${item.label}`);
  }, []);

  const handleCtaDown = useCallback(() => setCtaPressed(true), []);
  const handleCtaUp = useCallback(() => {
    setCtaPressed(false);
    setStatus('Morgonkompassen — mock CTA aktiverad.');
  }, []);

  return (
    <div className="od-depth-lab">
      <header className="od-depth-lab__intro">
        <p className="text-[10px] uppercase tracking-[0.28em] text-accent/80 font-display-serif">
          Låst · 2026-06-14
        </p>
        <h1 className="od-depth-lab__title">Obsidian Depth</h1>
        <p className="od-depth-lab__hint">
          Låst kanon för fylligare 3D — glassmorphism, taktil djup, guldaccenter endast.
          Knappar, menyer och widget förfinas separat. Välj tema i Theme Lab:
          <code className="text-accent"> OD-obsidian-depth</code>.
        </p>
        <div className="od-depth-lab__links">
          <Link to="/dev/theme-lab" className="btn-pill--ghost text-xs">
            Theme Lab
          </Link>
          <Link to="/dev/obsidian-depth-v2" className="btn-pill--accent text-xs">
            Depth v2 (Hem v3)
          </Link>
          <Link to="/" className="btn-pill--ghost text-xs">
            Hem (prod)
          </Link>
        </div>
      </header>

      <div className="od-depth">
        <div className="od-depth__phone" role="presentation">
          <div className="od-depth__scroll">
            <header className="od-depth__header flex items-start justify-between gap-3">
              <div>
                <p className="od-depth__eyebrow">Livskompassen</p>
                <h2 className="od-depth__greeting">
                  {getGreeting()}, <em>Pontus</em>
                </h2>
                <p className="od-depth__subtitle">
                  Låg visuell arousal · ett steg i taget
                </p>
              </div>
              <LivskompassMark className="od-depth__mark shrink-0" />
            </header>

            <div className="od-depth__bento">
              {BENTO_CARDS.map((card) => {
                const Icon = card.icon;
                const isActive = activeBento === card.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    className={[
                      'od-depth__bento-card',
                      card.span ? 'od-depth__bento-card--span' : '',
                      isActive ? 'od-depth__bento-card--active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleBento(card.id)}
                    aria-pressed={isActive}
                  >
                    <span className="od-depth__bento-shine" aria-hidden />
                    <span className="od-depth__bento-icon">
                      <Icon className="h-4 w-4" strokeWidth={1.5} />
                    </span>
                    <span className="od-depth__bento-label">{card.label}</span>
                    <span className="od-depth__bento-title">{card.title}</span>
                    <span className="od-depth__bento-meta">{card.meta}</span>
                  </button>
                );
              })}
            </div>

            <div className="od-depth__cta-wrap">
              <button
                type="button"
                className={['od-depth__cta', ctaPressed ? 'od-depth__cta--pressed' : '']
                  .filter(Boolean)
                  .join(' ')}
                onPointerDown={handleCtaDown}
                onPointerUp={handleCtaUp}
                onPointerLeave={handleCtaUp}
                onPointerCancel={handleCtaUp}
              >
                <span className="od-depth__cta-glow" aria-hidden />
                <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                Öppna Morgonkompassen
              </button>
            </div>

            <p className="od-depth__status" aria-live="polite">
              {status}
            </p>
          </div>

          <nav className="od-depth__dock" aria-label="Primär navigering">
            <div className="od-depth__dock-inner">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeNav === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      'od-depth__dock-btn',
                      isActive ? 'od-depth__dock-btn--active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => handleNav(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="od-depth__dock-icon" strokeWidth={1.5} />
                    <span className="od-depth__dock-pip" aria-hidden />
                    <span className="od-depth__dock-label">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
