import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Check,
  Droplets,
  Mic,
  PenLine,
  Sparkles,
} from 'lucide-react';
import {
  HEM_V3_SUPERMOD_COPY,
  HEM_V3_SUPERMODS,
  type HemV3DevCard,
  type HemV3SuperModId,
} from '@/core/home/hemV3DevelopmentCards';
import { FreeportChameleonLive } from './FreeportChameleonLive';
import { FreeportDiscoveryCards } from './FreeportDiscoveryCards';
import {
  ExecutiveDecorCompass,
  ExecutiveMediaFrame,
  ExecutivePhoneShell,
  type ExecutiveNavId,
} from './exec';
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
  { id: 'Anteckning', label: 'Anteckning', icon: PenLine },
  { id: 'Check-in', label: 'Inspelning', icon: Mic },
  { id: 'Kompass', label: 'Inkorg', icon: Sparkles },
  { id: 'Dagbok', label: 'Dagbok', icon: BookOpen },
];

const STATUS_STRIP = [
  { id: 'narvaro', label: 'Närvaro', value: '7/10 Stabilt' },
  { id: 'ritual', label: 'Ritual', value: 'Morgon' },
  { id: 'rad', label: 'Kompis-råd', value: 'Andas 3 min' },
] as const;

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 10) return 'God morgon';
  if (h < 17) return 'God eftermiddag';
  return 'God kväll';
}

/**
 * HEM — Modell A: executive chrome + live Chameleon (wedge 1).
 * Supermodul alltid synlig — inte mock bakom dev-toggle.
 */
export function FreeportHemV3Lab({ lowCapacity = false, onStatus }: Props) {
  const [zone, setZone] = useState<FreeportZoneId>('hjartat');
  const [target, setTarget] = useState<FreeportChameleonTarget>(() => getDefaultTarget('hjartat'));
  const [activeMod, setActiveMod] = useState<HemV3SuperModId>('Dagbok');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [navActive, setNavActive] = useState<ExecutiveNavId>('hem');

  const modCopy = HEM_V3_SUPERMOD_COPY[activeMod];

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

  const handleCard = useCallback(
    (card: HemV3DevCard) => {
      setSelectedCardId(card.id);
      const t = resolveCardToChameleon(card);
      setZone(t.zone);
      setTarget(t);
      onStatus?.(`Kort «${card.title}»`);
    },
    [onStatus],
  );

  const handleTarget = useCallback(
    (next: FreeportChameleonTarget) => {
      setTarget(next);
      setZone(next.zone);
    },
    [],
  );

  return (
    <ExecutivePhoneShell
      navActive={navActive}
      onNav={(id) => {
        setNavActive(id);
        onStatus?.(`Nav: ${id}`);
      }}
    >
      <header className="design-freeport__exec-header design-freeport__exec-header--hero">
        <div>
          <h2 className="design-freeport__exec-screen-title">Hem</h2>
          <p className="design-freeport__exec-greeting design-freeport__exec-greeting--inline">
            {getGreeting()}, <span className="design-freeport__exec-greeting-name">Pontus</span>
          </p>
        </div>
        <ExecutiveDecorCompass className="design-freeport__exec-header-compass design-freeport__exec-header-compass--lg" />
      </header>

      <article className="design-freeport__exec-card design-freeport__exec-card--anchor design-freeport__exec-card--chrome design-freeport__exec-card--compact">
        <p className="design-freeport__exec-label">Dagens ankare</p>
        <ExecutiveMediaFrame
          label="Lägg till stämningsbild"
          alt="Dagens stämning"
          onPick={() => onStatus?.('Stämningsbild vald')}
        />
        <div className="design-freeport__exec-inset">
          <p className="design-freeport__exec-focus-line">{modCopy.focus}</p>
        </div>
      </article>

      <section className="design-freeport__exec-card design-freeport__exec-card--chrome design-freeport__exec-card--compact">
        <p className="design-freeport__exec-label">Snabbstart</p>
        <div className="design-freeport__exec-quick-grid design-freeport__exec-quick-grid--3">
          {QUICK_START.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className={[
                  'design-freeport__exec-quick-tile',
                  activeMod === item.id ? 'design-freeport__exec-quick-tile--on' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => handleSuperMod(item.id)}
              >
                <span className="design-freeport__exec-quick-icon">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="design-freeport__exec-quick-label">{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <FreeportChameleonLive
        compact
        executiveSkin
        target={target}
        onTargetChange={handleTarget}
        onStatus={onStatus}
      />

      <section className="design-freeport__exec-card design-freeport__exec-card--chrome">
        <p className="design-freeport__exec-label">Utvecklingskort</p>
        <FreeportDiscoveryCards
          zone={zone}
          selectedCardId={selectedCardId}
          lowCapacity={lowCapacity}
          onSelectCard={handleCard}
        />
      </section>

      <section className="design-freeport__exec-card design-freeport__exec-card--chrome design-freeport__exec-card--compact">
        <p className="design-freeport__exec-label">Dagens steg</p>
        <ul className="design-freeport__exec-step-list design-freeport__exec-step-list--inset">
          {DAILY_STEPS.map((row) => {
            const Icon = row.icon;
            return (
              <li key={row.id}>
                <button type="button" className="design-freeport__exec-step-row">
                  <span
                    className={[
                      'design-freeport__exec-step-icon',
                      row.done ? 'design-freeport__exec-step-icon--done' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="design-freeport__exec-step-text">
                    <span className="design-freeport__exec-step-title">{row.title}</span>
                    <span className="design-freeport__exec-step-sub">{row.sub}</span>
                  </span>
                  <span className="design-freeport__exec-step-meta">{row.done ? '✓' : '→'}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="design-freeport__exec-status-strip" aria-label="Status">
        {STATUS_STRIP.map((box) => (
          <div key={box.id} className="design-freeport__exec-status-box">
            <span className="design-freeport__exec-status-label">{box.label}</span>
            <span className="design-freeport__exec-status-value">{box.value}</span>
          </div>
        ))}
      </div>

      <section className="design-freeport__exec-card design-freeport__exec-card--flat design-freeport__exec-card--chrome">
        <p className="design-freeport__exec-label">Veckoplan</p>
        <ul className="design-freeport__exec-list">
          {HEM_V3_SUPERMODS.slice(0, 2).map((mod) => (
            <li key={mod.id}>
              <button
                type="button"
                className="design-freeport__exec-list-row"
                onClick={() => handleSuperMod(mod.id)}
              >
                <span className="design-freeport__exec-list-icon">{mod.icon}</span>
                <span className="design-freeport__exec-list-title">{mod.label}</span>
                <span className="design-freeport__exec-list-chevron">›</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">
          ← Prod
        </Link>
        {' · '}
        HEM wedge 1 — chrome + live supermodul
      </p>
    </ExecutivePhoneShell>
  );
}
