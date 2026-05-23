import { useNavigate, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { useLongPress } from '../hooks/useLongPress';
import { setVaultGate } from '../auth/sessionService';
import { authenticateVaultGate } from '../auth/webauthn';
import { useStore } from '../store';
import { FYREN_BEVIS_HINT } from '../navigation/appNavigation';
import { DESIGN } from '../ui/tokens';
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

function FyrenProgressRing({ progress }: { progress: number }) {
  const pct = Math.round(progress * 100);
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full -rotate-90"
      viewBox="0 0 36 36"
      aria-hidden
    >
      <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(194,65,12,0.12)" strokeWidth="1.5" />
      <circle
        cx="18"
        cy="18"
        r="16"
        fill="none"
        stroke={DESIGN.accent}
        strokeWidth="1.5"
        strokeDasharray={`${pct} ${100 - pct}`}
        pathLength={100}
        opacity={0.85}
      />
    </svg>
  );
}

function HubTile({ module, size = 'side' }: { module: HubModule; size?: 'side' | 'center' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const setModuleHubOpen = useStore((s) => s.setModuleHubOpen);
  const setSystemError = useStore((s) => s.setError);
  const Icon = module.icon;

  const isActive =
    module.path === '/'
      ? location.pathname === '/'
      : location.pathname === module.path || location.pathname.startsWith(`${module.path}/`);

  const navigateToModule = (search = '') => {
    navigate({ pathname: module.path, search });
  };

  const go = (search = '') => {
    navigateToModule(search);
    setModuleHubOpen(true);
  };

  const longPress = useLongPress({
    onLongPress: async () => {
      if (!module.longPress) return;
      const ok = await authenticateVaultGate();
      if (!ok) {
        setSystemError(`Fyren avbruten. ${FYREN_BEVIS_HINT}`);
        return;
      }
      setVaultGate();
      navigateToModule(module.search ?? '');
      setModuleHubOpen(false);
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
  const systemError = useStore((s) => s.system.error);
  const setSystemError = useStore((s) => s.setError);

  return (
    <div className="module-hub-panel" role="dialog" aria-label="Modulväljare">
      {systemError && (
        <p className="module-hub-panel__alert text-sm text-danger" role="alert">
          {systemError}
          <button
            type="button"
            className="ml-2 underline"
            onClick={() => setSystemError(null)}
          >
            Stäng
          </button>
        </p>
      )}
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
