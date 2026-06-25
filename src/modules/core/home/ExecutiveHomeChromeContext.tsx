import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router-dom';

type ExecutiveHomeChromeContextValue = {
  enabled: boolean;
  snabbstartOpen: boolean;
  setSnabbstartOpen: (open: boolean) => void;
  toggleSnabbstart: () => void;
};

const ExecutiveHomeChromeContext = createContext<ExecutiveHomeChromeContextValue | null>(null);

const NOOP: ExecutiveHomeChromeContextValue = {
  enabled: false,
  snabbstartOpen: false,
  setSnabbstartOpen: () => undefined,
  toggleSnabbstart: () => undefined,
};

export function ExecutiveHomeChromeProvider({
  children,
  enabled,
}: {
  children: ReactNode;
  enabled: boolean;
}) {
  const location = useLocation();
  const [snabbstartOpen, setSnabbstartOpen] = useState(false);

  useEffect(() => {
    setSnabbstartOpen(false);
  }, [location.pathname]);

  const toggleSnabbstart = useCallback(() => {
    if (!enabled) return;
    setSnabbstartOpen((value) => !value);
  }, [enabled]);

  const value = useMemo<ExecutiveHomeChromeContextValue>(
    () =>
      enabled
        ? {
            enabled: true,
            snabbstartOpen,
            setSnabbstartOpen,
            toggleSnabbstart,
          }
        : NOOP,
    [enabled, snabbstartOpen, toggleSnabbstart],
  );

  return (
    <ExecutiveHomeChromeContext.Provider value={value}>
      {children}
    </ExecutiveHomeChromeContext.Provider>
  );
}

export function useExecutiveHomeChrome(): ExecutiveHomeChromeContextValue {
  const ctx = useContext(ExecutiveHomeChromeContext);
  return ctx ?? NOOP;
}
