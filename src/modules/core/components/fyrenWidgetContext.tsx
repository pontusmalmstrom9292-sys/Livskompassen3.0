import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { openValvViaFyren } from '../auth/valvFyrenGate';
import { useLongPress } from '../hooks/useLongPress';
import { useStore } from '../store';

type FyrenWidgetContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  toggle: () => void;
  progress: number;
  isHolding: boolean;
  dockTriggerProps: ReturnType<typeof useLongPress> & { onDoubleClick?: (e: React.MouseEvent) => void };
};

const FyrenWidgetContext = createContext<FyrenWidgetContextValue | null>(null);

export function FyrenWidgetProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const setSystemError = useStore((s) => s.setError);

  const toggle = useCallback(() => setOpen((value) => !value), []);

  const longPress = useLongPress({
    onLongPress: () =>
      void openValvViaFyren(navigate, {
        onDenied: (message) => setSystemError(message),
      }),
    onClick: toggle,
    delayMs: 3000,
  });

  const { progress, isHolding, onClick: triggerClick, ...triggerHandlers } = longPress;

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const value = useMemo<FyrenWidgetContextValue>(
    () => ({
      open,
      setOpen,
      toggle,
      progress,
      isHolding,
      dockTriggerProps: {
        progress,
        isHolding,
        onClick: triggerClick,
        onDoubleClick: (event: React.MouseEvent) => {
          event.preventDefault();
          navigate('/widget/inspelning?autostart=1');
        },
        ...triggerHandlers,
      },
    }),
    [open, toggle, progress, isHolding, triggerClick, triggerHandlers, navigate],
  );

  return <FyrenWidgetContext.Provider value={value}>{children}</FyrenWidgetContext.Provider>;
}

export function useFyrenWidget(): FyrenWidgetContextValue {
  const ctx = useContext(FyrenWidgetContext);
  if (!ctx) {
    throw new Error('useFyrenWidget must be used within FyrenWidgetProvider');
  }
  return ctx;
}
