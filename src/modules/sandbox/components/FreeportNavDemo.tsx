import { useCallback, useState } from 'react';
import type { HemV3DevCard } from '@/core/home/hemV3DevelopmentCards';
import { FreeportChameleonShell } from './FreeportChameleonShell';
import { FreeportDiscoveryCards } from './FreeportDiscoveryCards';
import { FreeportZoneNav } from './FreeportZoneNav';
import { getFreeportZone, type FreeportZoneId } from '../freeportZones';

type Props = {
  lowCapacity?: boolean;
};

export function FreeportNavDemo({ lowCapacity = false }: Props) {
  const [zone, setZone] = useState<FreeportZoneId>('hjartat');
  const [mode, setMode] = useState(() => getFreeportZone('hjartat').modes[0]?.id ?? 'reflektion');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [status, setStatus] = useState('Välj zon → kort → se mode i supermodulen.');

  const handleZone = useCallback((next: FreeportZoneId) => {
    setZone(next);
    const first = getFreeportZone(next).modes[0]?.id ?? '';
    setMode(first);
    setSelectedCardId(null);
    setStatus(`Zon: ${getFreeportZone(next).label}`);
  }, []);

  const handleCard = useCallback(
    (card: HemV3DevCard) => {
      setSelectedCardId(card.id);
      const hint =
        card.actionLabel === 'Planering'
          ? 'task_quick'
          : card.actionLabel === 'Mabra'
            ? 'checkin'
            : card.actionLabel === 'Dagbok'
              ? 'reflektion'
              : card.actionLabel === 'Barnfokus'
                ? 'barnfokus'
                : mode;
      const zoneDef = getFreeportZone(zone);
      const matched = zoneDef.modes.find((m) => m.id === hint);
      if (matched) setMode(matched.id);
      setStatus(`Kort «${card.title}» → ${card.actionLabel} (${card.to})`);
    },
    [mode, zone],
  );

  return (
    <div>
      <section className="design-freeport__section">
        <p className="design-freeport__section-title">Steg 1 — Välj zon</p>
        <FreeportZoneNav activeZone={zone} onSelect={handleZone} />
      </section>

      <section className="design-freeport__section">
        <p className="design-freeport__section-title">Steg 2 — Upptäcktskort</p>
        <p className="design-freeport__hint mt-1">
          Max 12 · filtrerade{lowCapacity ? ' (låg kapacitet)' : ''}
        </p>
        <FreeportDiscoveryCards
          zone={zone}
          selectedCardId={selectedCardId}
          lowCapacity={lowCapacity}
          onSelectCard={handleCard}
        />
      </section>

      <FreeportChameleonShell
        zone={zone}
        activeMode={mode}
        onModeChange={(id) => {
          setMode(id);
          setStatus(`Mode: ${id}`);
        }}
        status={status}
      />
    </div>
  );
}
