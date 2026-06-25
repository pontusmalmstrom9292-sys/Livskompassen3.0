import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { PenLine, Mic, Inbox } from 'lucide-react';
import {
  HEM_V3_SUPERMOD_COPY,
  type HemV3DevCard,
  type HemV3SuperModId,
} from '@/core/home/hemV3DevelopmentCards';
import { ExecutiveChecklistCard } from '@/core/ui/executive';
import { FreeportChameleonLive } from './FreeportChameleonLive';
import { FreeportDiscoveryCards } from './FreeportDiscoveryCards';
import { FreeportModellAPhoneShell } from './FreeportModellAPhoneShell';
import type { HybridDockSlot } from './FreeportHybridDock';
import { ExecutiveDecorCompass, ExecutiveMediaFrame } from './exec';
import {
  getDefaultTarget,
  resolveCardToChameleon,
  type FreeportChameleonTarget,
} from '../freeportChameleonBridge';
import type { SnabbstartItemId } from '../freeportSnabbstartConfig';
import type { FreeportZoneId } from '../freeportZones';

type Props = {
  lowCapacity?: boolean;
  onStatus?: (msg: string) => void;
};

const SNABB_TO_SUPERMOD: Partial<Record<SnabbstartItemId, HemV3SuperModId>> = {
  anteckning: 'Anteckning',
  inspelning: 'Check-in',
  dagbok: 'Dagbok',
  kompass: 'Kompass',
};

const MOCK_STEPS = [
  { id: '1', label: 'Fixa packning', time: '09:30', done: true },
  { id: '2', label: 'Ring Anna', time: '11:30', done: true },
  { id: '3', label: 'Träna 20 min', time: '18:00', done: false },
];

const SNABB = [
  { id: 'anteckning' as SnabbstartItemId, label: 'Anteckning', icon: PenLine },
  { id: 'inspelning' as SnabbstartItemId, label: 'Inspelning', icon: Mic },
  { id: 'inkast' as SnabbstartItemId, label: 'Inkast', icon: Inbox },
];

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 10) return 'God morgon';
  if (h < 17) return 'God eftermiddag';
  return 'God kväll';
}

/** Hem (Modell A) — hybrid dock + ankare + steg + snabbstart + Chameleon. */
export function FreeportHemV3Lab({ lowCapacity = false, onStatus }: Props) {
  const [target, setTarget] = useState<FreeportChameleonTarget>(() => getDefaultTarget('hjartat'));
  const [activeMod, setActiveMod] = useState<HemV3SuperModId>('Dagbok');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [dockActive, setDockActive] = useState<HybridDockSlot>('hem');
  const [snabbstartOpen, setSnabbstartOpen] = useState(false);
  const [snabbActiveId, setSnabbActiveId] = useState<SnabbstartItemId | undefined>();
  const [steps, setSteps] = useState(MOCK_STEPS);

  const modCopy = HEM_V3_SUPERMOD_COPY[activeMod];

  const handleCard = useCallback(
    (card: HemV3DevCard) => {
      setSelectedCardId(card.id);
      const t = resolveCardToChameleon(card);
      setTarget(t);
      setDockActive(t.zone);
      onStatus?.(`Kort «${card.title}»`);
    },
    [onStatus],
  );

  const handleTarget = useCallback((next: FreeportChameleonTarget) => {
    setTarget(next);
    setDockActive(next.zone);
  }, []);

  const handleDockSelect = useCallback(
    (id: HybridDockSlot) => {
      if (id === 'resurser' || id === 'mer') return;
      setDockActive(id);
      if (id === 'hem') {
        onStatus?.('Nav: hem');
        return;
      }
      const zone = id as FreeportZoneId;
      setTarget(getDefaultTarget(zone));
      onStatus?.(`Zon: ${zone}`);
    },
    [onStatus],
  );

  const handleFabPress = useCallback(() => {
    setSnabbstartOpen((open) => {
      onStatus?.(open ? 'Stäng snabbstart' : 'Öppna snabbstart');
      return !open;
    });
  }, [onStatus]);

  const handleSnabbstartSelect = useCallback(
    (id: SnabbstartItemId, morph: FreeportChameleonTarget) => {
      setSnabbActiveId(id);
      setTarget(morph);
      setDockActive(morph.zone);
      const superMod = SNABB_TO_SUPERMOD[id];
      if (superMod) setActiveMod(superMod);
      onStatus?.(`Snabbstart: ${id}`);
    },
    [onStatus],
  );

  return (
    <FreeportModellAPhoneShell
      dockActive={dockActive}
      snabbstartOpen={snabbstartOpen}
      snabbstartActiveId={snabbActiveId}
      onDockSelect={handleDockSelect}
      onFabPress={handleFabPress}
      onSnabbstartSelect={handleSnabbstartSelect}
      onSnabbstartClose={() => setSnabbstartOpen(false)}
      onStatus={onStatus}
    >
      <header className="design-freeport__exec-header design-freeport__exec-header--hero">
        <div>
          <h2 className="design-freeport__exec-screen-title">Hem</h2>
          <p className="design-freeport__exec-greeting design-freeport__exec-greeting--inline">
            {getGreeting()}, <span className="design-freeport__exec-greeting-name">Pontus</span>
          </p>
          <p className="design-freeport__exec-subtitle">Den trygga hamnen</p>
        </div>
      </header>

      <article className="design-freeport__exec-card design-freeport__exec-card--chrome design-freeport__exec-compass-module">
        <ExecutiveDecorCompass className="design-freeport__exec-compass-center" />
        <p className="design-freeport__exec-label">Dagens ankare</p>
        <ExecutiveMediaFrame
          label="Lägg till stämningsbild"
          alt="Dagens stämning"
          onPick={() => onStatus?.('Stämningsbild vald')}
        />
        <div className="design-freeport__exec-inset">
          <p className="design-freeport__exec-focus-line">{modCopy.focus}</p>
        </div>
        <FreeportDiscoveryCards
          selectedCardId={selectedCardId}
          lowCapacity={lowCapacity}
          collapsible
          fullRail
          executiveSkin
          compassLinked
          onSelectCard={handleCard}
        />
      </article>

      <ExecutiveChecklistCard
        items={steps}
        onToggle={(id) => {
          setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)));
          onStatus?.('Steg togglad');
        }}
        onAdd={() => onStatus?.('Lägg till steg')}
        className="design-freeport__exec-checklist-embed mx-0 mb-3"
      />

      <section className="design-freeport__exec-card design-freeport__exec-card--chrome">
        <p className="design-freeport__exec-label">Snabbstart</p>
        <div className="design-freeport__exec-snabb-grid">
          {SNABB.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                className="design-freeport__exec-snabb-btn"
                onClick={() => handleSnabbstartSelect(item.id, getDefaultTarget('hjartat'))}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="design-freeport__exec-status-grid">
        <article className="design-freeport__exec-status-card">
          <p className="design-freeport__exec-label">Närvaro</p>
          <p className="design-freeport__exec-status-val">7/10</p>
          <p className="design-freeport__exec-status-sub">Stabil</p>
        </article>
        <article className="design-freeport__exec-status-card">
          <p className="design-freeport__exec-label">Ritual</p>
          <p className="design-freeport__exec-status-val">Morgon</p>
        </article>
      </div>

      <article className="design-freeport__exec-card design-freeport__exec-card--advice">
        <p className="design-freeport__exec-label">Kompassråd</p>
        <p className="design-freeport__exec-body">Ett mikrosteg kan förändra en hel dag.</p>
      </article>

      <FreeportChameleonLive
        compact
        executiveSkin
        target={target}
        onTargetChange={handleTarget}
        onStatus={onStatus}
      />

      <p className="design-freeport__sandbox-note">
        <Link to="/" className="design-freeport__link">
          ← Prod
        </Link>
        {' · '}
        Hem Modell A — hybrid dock · Resurser overlay · chameleon
      </p>
    </FreeportModellAPhoneShell>
  );
}
