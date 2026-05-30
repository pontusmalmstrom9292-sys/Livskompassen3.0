import { useNavigate, useLocation } from 'react-router-dom';
import { useLongPress } from '../hooks/useLongPress';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { useStore } from '../store';
import type { HubModule } from './moduleHubConfig';

export function useHubModuleNav(module: HubModule) {
  const navigate = useNavigate();
  const location = useLocation();
  const setModuleHubOpen = useStore((s) => s.setModuleHubOpen);
  const setSystemError = useStore((s) => s.setError);

  const isActive =
    module.path === '/'
      ? location.pathname === '/'
      : location.pathname === module.path || location.pathname.startsWith(`${module.path}/`);

  const navigateToModule = (search = '') => {
    navigate({ pathname: module.path, search });
  };

  const go = (search = '') => {
    navigateToModule(search);
    setModuleHubOpen(false);
  };

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

  return { isActive, handlers, showFyren, progress, go, navigateToModule };
}
