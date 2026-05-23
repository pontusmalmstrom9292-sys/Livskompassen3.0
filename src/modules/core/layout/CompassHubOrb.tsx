import { useRef } from 'react';
import { BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { useLocation } from 'react-router-dom';
import { authenticateVaultGate } from '../auth/webauthn';
import { setVaultGate } from '../auth/sessionService';
import { useLongPress } from '../hooks/useLongPress';
import { FYREN_BEVIS_HINT } from '../navigation/appNavigation';
import { useStore } from '../store';
import { HUB_BOTTOM, HUB_CENTER, HUB_TOP, type HubModule } from './moduleHubConfig';
import { useHubModuleNav } from './useHubModuleNav';
import { LivskompassMark } from '../ui/LivskompassMark';

const SATELLITES: { module: HubModule; slot: 'tl' | 'tr' | 'bl' | 'br' }[] = [
  { module: HUB_TOP[0]!, slot: 'tl' },
  { module: HUB_TOP[1]!, slot: 'tr' },
  { module: HUB_BOTTOM[0]!, slot: 'bl' },
  { module: HUB_BOTTOM[1]!, slot: 'br' },
];

const toneClass: Record<HubModule['tone'], string> = {
  gold: 'dock-hub-sat--gold',
  indigo: 'dock-hub-sat--indigo',
  lavender: 'dock-hub-sat--lavender',
  emerald: 'dock-hub-sat--emerald',
};

function FyrenRing({ progress }: { progress: number }) {
  const pct = Math.round(progress * 100);
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
      viewBox="0 0 36 36"
      aria-hidden
    >
      <circle cx="18" cy="18" r="15" fill="none" stroke="rgba(194,65,12,0.15)" strokeWidth="1.25" />
      <circle
        cx="18"
        cy="18"
        r="15"
        fill="none"
        stroke="#fde68a"
        strokeWidth="1.25"
        strokeDasharray={`${pct} ${100 - pct}`}
        pathLength={100}
        opacity={0.9}
      />
    </svg>
  );
}

function DockHubSatellite({
  module,
  slot,
}: {
  module: HubModule;
  slot: 'tl' | 'tr' | 'bl' | 'br';
}) {
  const { isActive, handlers, showFyren, progress } = useHubModuleNav(module);
  const Icon = module.icon;

  return (
    <button
      type="button"
      aria-label={module.label}
      className={clsx(
        'dock-hub-sat',
        'dock-hub-sat--visible',
        `dock-hub-sat--${slot}`,
        toneClass[module.tone],
        (isActive || showFyren) && 'dock-hub-sat--active',
      )}
      {...handlers}
    >
      <span className="dock-hub-sat__glass">
        {showFyren && <FyrenRing progress={progress} />}
        <Icon className="dock-hub-sat__icon" strokeWidth={1.75} />
      </span>
      <span className="dock-hub-sat__label">{module.label}</span>
    </button>
  );
}

export function CompassHubOrb() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const setSystemError = useStore((s) => s.setError);

  const onDagbok =
    location.pathname === HUB_CENTER.path ||
    location.pathname.startsWith(`${HUB_CENTER.path}/`);
  const { isActive: centerRouteActive, navigateToModule } = useHubModuleNav(HUB_CENTER);
  const isCenterActive = onDagbok || centerRouteActive;

  const centerPress = useLongPress({
    onLongPress: async () => {
      const ok = await authenticateVaultGate();
      if (!ok) {
        setSystemError(`Fyren avbruten. ${FYREN_BEVIS_HINT}`);
        return;
      }
      setVaultGate();
      navigateToModule(HUB_CENTER.search ?? '');
    },
    onClick: () => navigateToModule(),
    delayMs: 3000,
  });

  const { progress, isHolding, ...centerHandlers } = centerPress;
  const showFyren = isHolding || progress > 0;
  const CenterIcon = onDagbok ? BookOpen : null;

  return (
    <div ref={wrapRef} className="dock-hub-fan dock-hub-fan--orbit" aria-label="Livsområden">
      {SATELLITES.map(({ module, slot }) => (
        <DockHubSatellite key={module.path} module={module} slot={slot} />
      ))}

      <button
        type="button"
        aria-label={showFyren ? 'Hjärtat — håll för Fyren' : onDagbok ? 'Hjärtat' : 'Öppna dagbok'}
        className={clsx(
          'dock-compass-hub',
          isCenterActive && 'dock-compass-hub--active',
          onDagbok && 'dock-compass-hub--heart',
        )}
        {...centerHandlers}
      >
        <span className="dock-compass-hub__plate">
          {showFyren && <FyrenRing progress={progress} />}
          <LivskompassMark className="dock-compass-hub__mark" />
          <span
            className={clsx(
              'dock-compass-hub__core',
              CenterIcon && 'dock-compass-hub__core--icon',
            )}
          >
            {CenterIcon ? (
              <CenterIcon className="dock-compass-hub__icon" strokeWidth={1.65} />
            ) : null}
          </span>
          <span className="dock-compass-hub__shine" aria-hidden />
        </span>
        <span className="dock-compass-hub__label">{onDagbok ? 'Hjärtat' : 'Kompass'}</span>
      </button>
    </div>
  );
}
