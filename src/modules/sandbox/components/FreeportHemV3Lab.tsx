import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  BookOpen,
  Check,
  ChevronDown,
  Droplets,
  Mic,
  PenLine,
  Sparkles,
} from 'lucide-react';
import { LivskompassMark } from '@/core/ui/LivskompassMark';
import {
  filterDevelopmentCardsForPreset,
  HEM_V3_DEVELOPMENT_CARDS,
  HEM_V3_LOW_CAPACITY_CARD_IDS,
  HEM_V3_SUPERMODS,
  HEM_V3_SUPERMOD_COPY,
  type HemV3DevCard,
  type HemV3SuperModId,
} from '@/core/home/hemV3DevelopmentCards';
import { FreeportChameleonLive } from './FreeportChameleonLive';
import { FreeportDiscoveryCards } from './FreeportDiscoveryCards';
import {
  getDefaultTarget,
  resolveCardToChameleon,
  resolveSuperModToChameleon,
  type FreeportChameleonTarget,
} from '../freeportChameleonBridge';
import type { FreeportZoneId } from '../freeportZones';

type Props = {
  lowCapacity?: boolean;
  onStatus?: (msg: string) => void;
};

const DAILY_STEPS = [
  { id: 'vatten', title: 'Vatten', sub: 'Morgonrutin', done: true, icon: Droplets },
  { id: 'medicin', title: 'Medicin', sub: 'Daglig dos', done: true, icon: Check },
  { id: 'andning', title: '3 min andning', sub: 'Närvaro', done: false, icon: Sparkles },
] as const;

const QUICK_START: {
  id: HemV3SuperModId;
  label: string;
  icon: typeof BookOpen;
}[] = [
  { id: 'Kompass', label: 'Kompass', icon: Sparkles },
  { id: 'Anteckning', label: 'Inkast', icon: PenLine },
  { id: 'Dagbok', label: 'Dagbok', icon: BookOpen },
  { id: 'Check-in', label: 'Check-in', icon: Mic },
];

const BOTTOM_NAV = [
  { id: 'hem', label: 'Hem', zone: null as FreeportZoneId | null },
  { id: 'hjartat', label: 'Hjärtat', zone: 'hjartat' as const },
  { id: 'fab', label: 'Kompass', zone: null, fab: true },
  { id: 'vardagen', label: 'Vardagen', zone: 'vardagen' as const },
  { id: 'familjen', label: 'Familjen', zone: 'familjen' as const },
] as const;

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 10) return 'God morgon';
  if (h < 17) return 'God eftermiddag';
  return 'God kväll';
}

/** Hem v3 — Executive gold hero (sandbox Modell A). */
export function FreeportHemV3Lab({ lowCapacity = false, onStatus }: Props) {
  const [zone, setZone] = useState<FreeportZoneId>('hjartat');
  const [target, setTarget] = useState<FreeportChameleonTarget>(() => getDefaultTarget('hjartat'));
  const [activeMod, setActiveMod] = useState<HemV3SuperModId>('Dagbok');
  const [railOpen, setRailOpen] = useState(true);
  const [chameleonOpen, setChameleonOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [navActive, setNavActive] = useState<'hem' | FreeportZoneId>('hem');

  const modCopy = HEM_V3_SUPERMOD_COPY[activeMod];
  const selectedCard = HEM_V3_DEVELOPMENT_CARDS.find((c) => c.id === selectedCardId);

  const handleZone = useCallback(
    (next: FreeportZoneId) => {
      setZone(next);
      setNavActive(next);
      setTarget(getDefaultTarget(next));
      setSelectedCardId(null);
      onStatus?.(`Zon: ${next}`);
    },
    [onStatus],
  );

  const handleSuperMod = useCallback(
    (modId: HemV3SuperModId) => {
      setActiveMod(modId);
      const t = resolveSuperModToChameleon(modId);
      if (t) {
        setZone(t.zone);
        setTarget(t);
      }
      onStatus?.(`Supermodul: ${modId}`);
    },
    [onStatus],
  );

  const handleNav = useCallback(
    (item: (typeof BOTTOM_NAV)[number]) => {
      if ('fab' in item && item.fab) {
        setNavActive('hem');
        handleSuperMod('Kompass');
        onStatus?.('FAB → Kompass');
        return;
      }
      if (item.zone) {
        handleZone(item.zone);
        return;
      }
      setNavActive('hem');
      onStatus?.('Nav: Hem');
    },
    [handleSuperMod, handleZone, onStatus],
  );

  const handleCard = useCallback(
    (card: HemV3DevCard) => {
      setSelectedCardId(card.id);
      const t = resolveCardToChameleon(card);
      setZone(t.zone);
      setTarget(t);
      if (!railOpen) setRailOpen(true);
      onStatus?.(`Kort «${card.title}» → ${card.actionLabel}`);
    },
    [onStatus, railOpen],
  );

  const visibleCards = filterDevelopmentCardsForPreset(HEM_V3_DEVELOPMENT_CARDS, 'foralder_trygg');
  const cardCount = lowCapacity
    ? visibleCards.filter((c) =>
        (HEM_V3_LOW_CAPACITY_CARD_IDS as readonly string[]).includes(c.id),
      ).length || 4
    : Math.min(12, visibleCards.length);

  return (
    <div className="design-freeport__phone design-freeport__phone--executive">
      <div className="design-freeport__phone-scroll">
        <header className="design-freeport__executive-top">
          <h2 className="design-freeport__screen-title">Hem</h2>
          <button type="button" className="design-freeport__notify-btn" aria-label="Aviseringar">
            <Bell className="h-4 w-4" />
          </button>
        </header>

        <p className="design-freeport__hero-greeting">
          {getGreeting()}, <span className="design-freeport__hero-name">Pontus</span>
        </p>

        <article className="design-freeport__hub-card design-freeport__hub-card--anchor">
          <header className="design-freeport__hub-head">
            <h3 className="design-freeport__hub-focus">Dagens ankare</h3>
            <span className="design-freeport__hub-focus-sub">{modCopy.focus}</span>
          </header>
          <p className="design-freeport__hub-anchor-body">{modCopy.sample || modCopy.placeholder}</p>
        </article>

        <section className="design-freeport__module-panel">
          <p className="design-freeport__section-title">Dagens steg</p>
          <ul className="design-freeport__hub-list" aria-label="Dagens steg">
            {DAILY_STEPS.map((row) => {
              const Icon = row.icon;
              return (
                <li key={row.id}>
                  <button type="button" className="design-freeport__hub-row">
                    <span
                      className={[
                        'design-freeport__hub-row-icon',
                        row.done ? 'design-freeport__hub-row-icon--done' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-hidden
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="design-freeport__hub-row-body">
                      <span className="design-freeport__hub-row-title">{row.title}</span>
                      <span className="design-freeport__hub-row-sub">{row.sub}</span>
                    </span>
                    <span className="design-freeport__hub-row-meta">{row.done ? '✓' : '→'}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="design-freeport__module-panel">
          <p className="design-freeport__section-title">Snabbstart</p>
          <div className="design-freeport__quick-grid" aria-label="Snabbstart">
            {QUICK_START.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    'design-freeport__quick-tile',
                    activeMod === item.id ? 'design-freeport__quick-tile--on' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleSuperMod(item.id)}
                >
                  <span className="design-freeport__quick-tile-icon" aria-hidden>
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="design-freeport__quick-tile-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="design-freeport__module-panel">
          <p className="design-freeport__section-title">Veckoplan</p>
          <ul className="design-freeport__plan-list">
            {HEM_V3_SUPERMODS.slice(0, 2).map((mod) => (
              <li key={mod.id}>
                <button
                  type="button"
                  className="design-freeport__plan-row"
                  onClick={() => handleSuperMod(mod.id)}
                >
                  <span className="design-freeport__plan-row-icon">{mod.icon}</span>
                  <span className="design-freeport__plan-row-title">{mod.label}</span>
                  <span className="design-freeport__plan-row-chevron">›</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <button
          type="button"
          className="design-freeport__rail-toggle"
          aria-expanded={railOpen}
          onClick={() => setRailOpen((v) => !v)}
        >
          <span>Utvecklingskort ({cardCount})</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${railOpen ? 'rotate-180' : ''}`} />
        </button>

        {railOpen ? (
          <div className="design-freeport__module-panel design-freeport__module-panel--cards">
            <FreeportDiscoveryCards
              zone={zone}
              selectedCardId={selectedCardId}
              lowCapacity={lowCapacity}
              onSelectCard={handleCard}
            />
          </div>
        ) : null}

        {selectedCard ? (
          <div className="design-freeport__card-detail">
            <p>{selectedCard.body}</p>
            <span className="design-freeport__card-detail-src">
              {selectedCard.title} → {selectedCard.actionLabel}
            </span>
          </div>
        ) : null}

        <button
          type="button"
          className="design-freeport__rail-toggle design-freeport__rail-toggle--dev"
          aria-expanded={chameleonOpen}
          onClick={() => setChameleonOpen((v) => !v)}
        >
          <span>Chameleon (dev)</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${chameleonOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {chameleonOpen ? (
          <FreeportChameleonLive
            compact
            target={target}
            onTargetChange={setTarget}
            onStatus={onStatus}
          />
        ) : null}

        <p className="design-freeport__sandbox-note">
          <Link to="/" className="design-freeport__link">
            ← Prod
          </Link>
          {' · '}
          Sandbox — 3 zoner, ej ref-etiketter Dagbok/Hälsa i nav
        </p>
      </div>

      <nav className="design-freeport__bottom-nav" aria-label="Demo navigation (S2)">
        {BOTTOM_NAV.map((item) => {
          const isOn =
            item.id === 'hem' ? navActive === 'hem' : item.zone ? navActive === item.zone : false;
          if (item.id === 'fab') {
            return (
              <button
                key={item.id}
                type="button"
                className="design-freeport__bottom-nav-fab"
                aria-label={item.label}
                onClick={() => handleNav(item)}
              >
                <LivskompassMark className="design-freeport__bottom-nav-fab-mark" />
              </button>
            );
          }
          return (
            <button
              key={item.id}
              type="button"
              className={[
                'design-freeport__bottom-nav-item',
                isOn ? 'design-freeport__bottom-nav-item--on' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => handleNav(item)}
            >
              <span className="design-freeport__bottom-nav-dot" aria-hidden />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
