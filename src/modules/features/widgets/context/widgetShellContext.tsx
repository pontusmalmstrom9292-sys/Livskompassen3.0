import { createContext, useCallback, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';

type WidgetShellContextValue = {
  registerClear: (fn: () => void) => () => void;
  runClear: () => void;
};

const WidgetShellContext = createContext<WidgetShellContextValue | null>(null);

export function WidgetShellProvider({ children }: { children: ReactNode }) {
  const clearFns = useRef(new Set<() => void>());

  const registerClear = useCallback((fn: () => void) => {
    clearFns.current.add(fn);
    return () => {
      clearFns.current.delete(fn);
    };
  }, []);

  const runClear = useCallback(() => {
    clearFns.current.forEach((fn) => fn());
  }, []);

  useEffect(
    () => () => {
      clearFns.current.forEach((fn) => fn());
    },
    [],
  );

  const value = useMemo(() => ({ registerClear, runClear }), [registerClear, runClear]);

  return <WidgetShellContext.Provider value={value}>{children}</WidgetShellContext.Provider>;
}

export function useWidgetShellClear(onClear: () => void) {
  const ctx = useContext(WidgetShellContext);
  useEffect(() => {
    if (!ctx) return;
    return ctx.registerClear(onClear);
  }, [ctx, onClear]);
}

export function useWidgetShellContext() {
  return useContext(WidgetShellContext);
}
