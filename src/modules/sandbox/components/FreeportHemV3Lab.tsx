import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HEM_V3_SUPERMOD_COPY,
  type HemV3DevCard,
  type HemV3SuperModId,
} from '@/core/home/hemV3DevelopmentCards';
import { FreeportChameleonLive } from './FreeportChameleonLive';
import { FreeportDiscoveryCards } from './FreeportDiscoveryCards';
import { FreeportModellAPhoneShell } from './FreeportModellAPhoneShell';
import type { ModellADockId } from './FreeportModellADock';
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

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 10) return 'God morgon';
  if (h < 17) return 'God eftermiddag';
  return 'God kväll';
}

/** Hem (Modell A) — kompassmodul + Utforska + live Chameleon + zon-dock + Fyren-snabbstart. */
export function FreeportHemV3Lab({ lowCapacity = false, onStatus }: Props) {
  const [target, setTarget] = useState<FreeportChameleonTarget>(() => getDefaultTarget('hjartat'));
  const [activeMod, setActiveMod] = useState<HemV3SuperModId>('Dagbok');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [dockActive, setDockActive] = useState<ModellADockId>('hem');
  const [snabbstartOpen, setSnabbstartOpen] = useState(false);
  const [snabbActiveId, setSnabbActiveId] = useState<SnabbstartItemId | undefined>();

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
    (id: ModellADockId) => {
      if (id === 'fab') return;
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
    >
      <header className="design-freeport__exec-header design-freeport__exec-header--hero">
        <div>
          <h2 className="design-freeport__exec-screen-title">Hem</h2>
          <p className="design-freeport__exec-greeting design-freeport__exec-greeting--inline">
            {getGreeting()}, <span className="design-freeport__exec-greeting-name">Pontus</span>
          </p>
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
        Hem Modell A — zon-dock · snabbstart · chameleon
      </p>
    </FreeportModellAPhoneShell>
  );
}
