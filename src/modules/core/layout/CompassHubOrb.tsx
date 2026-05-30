import { useRef } from 'react';
import { BookOpen } from 'lucide-react';
import { clsx } from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { useLongPress } from '../hooks/useLongPress';
import { useStore } from '../store';
import { FyrenProgressRing } from '../ui/FyrenProgressRing';
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
      title={module.desc}
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
        <span className="dock-hub-sat__halo" aria-hidden />
        {showFyren && <FyrenProgressRing progress={progress} />}
        <Icon className="dock-hub-sat__icon" strokeWidth={1.65} />
      </span>
      <span className="dock-hub-sat__label">{module.label}</span>
    </button>
  );
}

export function CompassHubOrb() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);

  const onDagbok =
    location.pathname === HUB_CENTER.path ||
    location.pathname.startsWith(`${HUB_CENTER.path}/`);
  const { isActive: centerRouteActive, navigateToModule } = useHubModuleNav(HUB_CENTER);
  const isCenterActive = onDagbok || centerRouteActive;

  const centerPress = useLongPress({
    onLongPress: () =>
      void openValvViaFyren(navigate, {
        pathname: HUB_CENTER.path,
        search: HUB_CENTER.search ?? '?tab=bevis',
        onDenied: (message) => setSystemError(message),
      }),
    onClick: () => navigateToModule(),
    delayMs: 3000,
  });

  const { progress, isHolding, ...centerHandlers } = centerPress;
  const showFyren = isHolding || progress > 0;

  return (
    <div ref={wrapRef} className="dock-hub-fan dock-hub-fan--orbit" aria-label="Livsområden">
      <div className="dock-orbit-stage__ring" aria-hidden />
      <div className="dock-orbit-stage__spokes" aria-hidden>
        <span className="dock-orbit-stage__spoke dock-orbit-stage__spoke--tl" />
        <span className="dock-orbit-stage__spoke dock-orbit-stage__spoke--tr" />
        <span className="dock-orbit-stage__spoke dock-orbit-stage__spoke--bl" />
        <span className="dock-orbit-stage__spoke dock-orbit-stage__spoke--br" />
      </div>

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
          showFyren && 'dock-compass-hub--fyren',
        )}
        {...centerHandlers}
      >
        <span className="dock-compass-hub__plate">
          {showFyren && <FyrenProgressRing progress={progress} />}
          <LivskompassMark className="dock-compass-hub__mark" />
          {onDagbok && (
            <span className="dock-compass-hub__overlay">
              <BookOpen className="dock-compass-hub__icon" strokeWidth={1.65} />
            </span>
          )}
        </span>
      </button>
    </div>
  );
}
