import { useNavigate, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { useLongPress } from '../hooks/useLongPress';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { useStore } from '../store';
import { FyrenProgressRing } from '../ui/FyrenProgressRing';
import {
  HUB_BOTTOM,
  HUB_CENTER,
  HUB_TOP,
  type HubModule,
} from './moduleHubConfig';

const toneClass: Record<HubModule['tone'], string> = {
  gold: 'module-hub-tile--gold',
  indigo: 'module-hub-tile--indigo',
  lavender: 'module-hub-tile--lavender',
  emerald: 'module-hub-tile--emerald',
};

function HubTile({ module, size = 'side' }: { module: HubModule; size?: 'side' | 'center' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const setModuleHubOpen = useStore((s) => s.setModuleHubOpen);
  const Icon = module.icon;

  const isActive =
    module.path === '/'
      ? location.pathname === '/'
      : location.pathname === module.path || location.pathname.startsWith(`${module.path}/`);

  const go = (search = '') => {
    navigate({ pathname: module.path, search });
    setModuleHubOpen(true);
  };

  const setSystemError = useStore((s) => s.setError);

  const longPress = useLongPress({
    onLongPress: async () => {
      if (!module.longPress) return;
      const ok = await openValvViaFyren(navigate, {
        pathname: module.path,
        search: module.search ?? '?tab=bevis',
        onDenied: (message) => setSystemError(message),
      });
      if (ok) setModuleHubOpen(false);
    },
    onClick: () => go(module.longPress ? '' : ''),
    delayMs: 3000,
  });

  const { progress, isHolding, ...longPressHandlers } = longPress;
  const handlers = module.longPress
    ? longPressHandlers
    : { onClick: () => go('') };

  const showFyren = module.longPress && (isHolding || progress > 0);

  return (
    <button
      type="button"
      aria-label={
        module.longPress
          ? `${module.label} — håll 3 sek för dold åtkomst till bevis`
          : module.label
      }
      className={clsx(
        'module-hub-tile',
        toneClass[module.tone],
        size === 'center' && 'module-hub-tile--center',
        (isActive || showFyren) && 'module-hub-tile--active',
      )}
      {...handlers}
    >
      <span className="module-hub-tile__icon">
        {showFyren && <FyrenProgressRing progress={progress} />}
        <Icon className="relative z-10 h-5 w-5" strokeWidth={1.75} />
      </span>
      <span className="module-hub-tile__label">{module.label}</span>
      {size === 'center' && (
        <span className="module-hub-tile__desc">{module.desc}</span>
      )}
    </button>
  );
}

export function ModuleHubPanel() {
  const setModuleHubOpen = useStore((s) => s.setModuleHubOpen);

  return (
    <div className="module-hub-panel" role="dialog" aria-label="Modulväljare">
      <div className="module-hub-panel__grid">
        <div className="module-hub-panel__row">
          {HUB_TOP.map((mod) => (
            <HubTile key={mod.path} module={mod} />
          ))}
        </div>
        <HubTile module={HUB_CENTER} size="center" />
        <div className="module-hub-panel__row">
          {HUB_BOTTOM.map((mod) => (
            <HubTile key={mod.path} module={mod} />
          ))}
        </div>
      </div>
      <button
        type="button"
        className="module-hub-panel__close"
        onClick={() => setModuleHubOpen(false)}
      >
        Stäng
      </button>
    </div>
  );
}
