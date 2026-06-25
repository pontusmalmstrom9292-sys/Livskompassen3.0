import { Moon } from 'lucide-react';
import { useEffect, useState } from 'react';

const KEY = 'lk_dim_mode';

export function useDimMode() {
  const [dimMode, setDimModeState] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(KEY) === '1';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (dimMode) {
      document.documentElement.classList.add('dim-mode');
    } else {
      document.documentElement.classList.remove('dim-mode');
    }
  }, [dimMode]);

  // Apply on mount (defensive for CSR)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (localStorage.getItem(KEY) === '1') {
      document.documentElement.classList.add('dim-mode');
    }
  }, []);

  const toggle = () => {
    const next = !dimMode;
    setDimModeState(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem(KEY, next ? '1' : '0');
    }
  };

  return { dimMode, toggle };
}

export function DimModeToggle() {
  const { dimMode, toggle } = useDimMode();
  return (
    <label className="flex cursor-pointer items-start gap-3 border-t border-border pt-4">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 rounded border-border accent-accent"
        checked={dimMode}
        onChange={toggle}
        aria-label="Skymningsläge"
      />
      <span className="text-sm leading-relaxed text-text-muted">
        <span className="flex items-center gap-2 font-medium text-text">
          <Moon className="h-3.5 w-3.5" />
          Skymningsläge
        </span>
        Extra låg kontrast och ljusstyrka för sena kvällar eller migrän. Lagras lokalt.
      </span>
    </label>
  );
}
